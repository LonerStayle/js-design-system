# COMPONENTS — 도형상회 v2 마크업 계약

index.html · pages/*.html 담당 에이전트는 **이 문서와 DIRECTION.md 2절(팩트 시트)만 보고** 마크업한다.
디자인 근거는 `DIRECTION.md`. 클래스는 BEM(`블록__요소--변형`). 상태는 가능한 한 ARIA 속성
(`aria-selected` `aria-current` `aria-expanded` `aria-pressed` `aria-busy` `aria-invalid` `aria-checked` `disabled`)으로 표시하고, CSS가 그 속성을 읽는다.

> 시그니처 두 개를 마크업에서 따로 켤 필요는 없다. 아래 컴포넌트 루트 클래스를 쓰면 자동으로 붙는다.
> **S1 라미네이트 단면**(블러 없는 오프셋 블록을 LM 패턴으로 채움) · **S2 한 모서리 컷**(한 모서리만 크게 둥글림).

---

## 0. 페이지 뼈대 (모든 HTML 공통, 그대로 복사)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>파도 책장 DH-SH-07 — 도형상회</title>
<meta name="description" content="…">
<script>(function(){try{var d=document.documentElement;d.classList.add('js');var q=new URLSearchParams(location.search).get('theme');var s=null;try{s=localStorage.getItem('dohyeong-theme');}catch(e){}var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gasoek+One&family=Do+Hyeon&family=Unbounded:wght@500;700;900&family=Rubik:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: product.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<!-- 셸: 매장 셸(3-1) 또는 작업실 셸(3-2) -->
<!-- 오버레이(모달·드로어·커맨드)는 body 끝, app.js 바로 위 -->
<script src="app.js"></script>                   <!-- pages: ../app.js -->
</body>
</html>
```

- 테마 결정 순서: **URL `?theme=dark|light` → localStorage `dohyeong-theme` → 시스템**. 인라인 스크립트가 `<html>`에 `data-theme`와 `js` 클래스를 붙인다(`js`가 없으면 등장 모션 대상도 그냥 보인다).
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만** 쓴다(2절 목록). raw hex 금지, 인라인 `grid-template-columns` 금지. `style="--w-sh:80px"`, `style="--val:62%"`, `style="--plinth-h:40px"`처럼 **커스텀 속성 주입만 허용**.
- `href="#"` 금지, 인라인 `onclick` 금지, 이미지 파일 금지(가구·도형은 CSS/SVG로).
- **SVG presentation attribute에 `var()` 금지.** 아이콘은 `class="icon"` + `stroke: currentColor`(CSS가 줌). 원형 진행은 `style="--val:62"` 같은 커스텀 속성만.
- 품번·코드가 하이픈에서 끊기지 않게 제목 안의 코드는 `<span class="nobr">LM-05</span>`.
- 모노(`.t-mono`, Space Mono)와 넓은 자간은 **라틴·숫자에만**. 한글이 섞인 라벨은 `.t-label`(Do Hyeon).

---

## 1. 데이터 정본 (DIRECTION 2절 요약 — 화면에 쓰는 값은 이것뿐)

| 항목 | 값 |
|---|---|
| 작업실 '오늘' | **2026년 10월 14일 (수) 14:20** · 로그인 한도윤(대표) |
| 카탈로그 | 『도형상회 카탈로그 No.07 — 2026 가을·겨울』 2026.10.01 (목) 발행 |
| 쇼룸 전시 | 「칼턴 이후」 10.9(금) – 11.11(수) |
| 견본 박스 다음 발송 | 10.16(금) |
| 성수 쇼룸 | 서울 성동구 성수이로7길 24, 1층 · 화–일 11:00–20:00 · **월요일 휴무** · 02-468-1981 |
| 파주 공방 | 경기 파주시 탄현면 새오리로 112 · 평일 09:00–18:00, 토 10:00–15:00(예약) · 일요일 휴무 |
| 온라인 | dohyeong.kr · hello@dohyeong.kr |
| 10월 달력 | 1일 = 목. 월요일(5·12·19·26) 휴무 |
| 품번 | DH-SH-07 파도 책장 ₩2,480,000 · DH-TB-03 반달 사이드 테이블 ₩690,000 · DH-TB-09 테라조 커피 테이블 ₩1,150,000 · DH-LP-11 기둥 스탠드 조명 ₩420,000 · DH-CH-02 삼각 다리 의자 ₩380,000 · DH-OB-05 번개 거울 ₩260,000 · DH-OB-12 뾰족 꽃병 ₩89,000(재고 4) · 견본 박스 ₩15,000 |
| 견본 | LM-01 꿈틀 · LM-02 바둑판 · LM-03 깨알 · LM-04 번개 · LM-05 사탕 테라조 · LM-06 사선 |
| 재고(판) | LM-01 48 · LM-02 31 · LM-03 22 · **LM-04 9(부족)** · LM-05 17 · LM-06 40 |
| ID | 주문 `DH-2610-0412` · 고객 `C-00384` · 작업지시 `WO-318` · 문의 `Q-1207` · index 부품 `CP-01~32` |
| 인물 | 한도윤(대표) · 문채린(패턴) · 백승호(공방장) · 오가람(쇼룸) · 진하늘(CS) · 김서연(오브제랩, 트레이드) · 류지호(레몬스퀘어) · 송민아(개인) · 박태오(개인) · 이나래(책방 세모) |

---

## 2. 토큰 · 레이아웃 프리미티브 (base.css)

### 2-1 semantic 토큰 (장면 CSS에서 쓸 수 있는 전부)
지면 `--bg --bg-alt --surface --surface-raised --surface-sunk --surface-hover` · 글자 `--text --text-muted --disabled-text` · 선 `--line --line-soft` · 잉크 면 `--ink-field`
판재(두 모드 같은 색) `--brand --brand-hover --on-brand --info --on-info --accent --on-accent --success --on-success --danger --on-danger`
판재 위 고정 글자 `--plate-ink --plate-white` · 지면 위 원색 글자 `--brand-text --info-text --accent-text --success-text --danger-text`
필드 `--field-salmon --field-lilac --field-lemon --field-mint --field-cobalt` · 패턴 `--pat-lm01 … --pat-lm06 --pat-zigv --pattern-ink --pattern-bg`
상호작용 `--focus --selection --overlay --overlay-dot` · 스케일(tokens) `--sp-1~11 --fs-* --ff-* --cut* --off-* --ease-* --dur-* --z-*`

- 패턴 토큰은 **배경 레이어**다: `background: var(--pat-lm02), var(--pattern-bg);` (마지막에 바탕색 레이어를 붙인다).
- **패턴 위에 글자를 올리지 않는다.** 글자는 항상 단색 판 위.

### 2-2 스코프 — 원색 필드와 잉크 면
| 클래스 | 언제 | 효과 |
|---|---|---|
| `.on-plate` | 연분홍·레몬·라일락·민트 **필드(넓은 면)** 위 섹션/칸 | 다크에서도 라이트 토큰 세트 유지(조명 받은 진열창). 크림 선이 레몬 위에서 사라지는 것 방지 |
| `.on-ink` | 푸터, 작업실 사이드바, 코드, 뒤표지, 마퀴 | 라이트에서도 밤 토큰 세트. 배경 `--ink-field`(라이트 #15121A / 다크 #0C0A10) |

`.spread--salmon/--lemon/--lilac/--mint` 에는 **반드시 `.on-plate`** 를 같이 붙인다. `.spread--ink`에는 `.on-ink`.

### 2-3 펼침면 `.spread` — 섹션마다 배경 필드가 바뀐다
```html
<section class="spread spread--lemon on-plate spread--pad-120" aria-labelledby="sp-04">
  <div class="wrap">
    <div class="folio"><span>라미네이트 견본</span><span class="folio__page">p.04–05</span></div>
    <h2 class="spread-title" id="sp-04">견본 판 여섯 장</h2>
    …
  </div>
</section>
<div class="band band--lm01" aria-hidden="true"></div>   <!-- 펼침면 사이 가로지르는 패턴 띠 -->
```
- 필드: `--paper` `--grid`(지면+LM-02 바둑판) `--lemon` `--salmon` `--lilac` `--mint` `--cobalt`(글자 흰색) `--ink`. **같은 배경 연속 금지.**
- 상하 패딩: 기본 96 · `--pad-64` · `--pad-120` · `--pad-160` · `--tight`(48). 펼침면마다 다르게.
- `.folio` = 위 모서리 섹션 이름(Do Hyeon) + 쪽번호(모노). `--bare`는 선 없음. "작은 라벨→제목→부제" 3단 금지.
- `.spread-title` 바닥선 위 왼쪽 큰 제목 / `.spine` 세로 책등 제목(≤768에서 가로로 눕는다).
- `.band` 패턴 띠: `--lm01~06` 패턴, `--up`(+4°) `--thin`(56px) `--flow`(천천히 흐름). 높이 96px·−6°(모바일 40px·−4°). **띠 위에 글자 금지**, `aria-hidden="true"`.

### 2-4 그리드 · 그리드 밖으로
`.wrap`(최대 1360 + 바깥 여백 48/16) · `.grid12`(12단, 거터 24) + `.c-2 … .c-9 .c-12 .c-push-1 .c-push-2` · `.grid12--end`(바닥 정렬) `--center`
반응형: ≤1024 `c-3→4, c-9→8, c-4/5/7/8→6` · ≤768 4단(전부 전폭, `c-3 c-half`처럼 `.c-half`를 함께 붙인 칸만 반폭).
한 펼침면에 하나는 삐져나가기: `.bleed-r` `.bleed-l` `.bleed-full`. 묶음: `.stack`(세로, `--gap`) `.cluster`(가로 줄바꿈) `.split`(양끝).

### 2-5 바닥선 · 받침대 — 상품은 공중에 뜨지 않는다
```html
<div class="floor">                                 <!-- 4px 잉크 바닥선, 자식은 바닥 정렬 -->
  <div class="plinth plinth--terrazzo" style="--plinth-h:40px" data-drop>
    <span class="sh sh--cobalt" style="--w-sh:80px;--h-sh:260px"></span>   <!-- 상품(도형/컴포넌트) -->
  </div>
  <div class="plinth plinth--lemon" style="--plinth-h:72px" data-drop>…</div>
</div>
```
`.plinth` 자식이 받침 위에 선다. 받침 색 `--terrazzo --lemon --mint --magenta --ink`, 높이 `--plinth-h`.

### 2-6 선반 (칼턴 책장) — 컴포넌트 진열
```html
<div class="shelf">
  <div class="shelf__cell w-5 shelf__cell--lemon on-plate">
    <div class="shelf__meta"><span>버튼</span><span class="shelf__no">CP-05</span></div>
    …컴포넌트…
  </div>
  <div class="shelf__cell w-3 shelf__cell--surface">…</div>
  <div class="shelf__cell w-4 shelf__cell--lilac on-plate">…</div>
</div>
```
- 한 줄 칸 폭 합 = 12(`w-3 w-4 w-5 w-6 w-7 w-8 w-12`). 칸 색 `--lemon --salmon --lilac --mint --surface --grid`(원색 칸엔 `.on-plate`).
- 기본은 아래 정렬(바닥선), 위 정렬은 `.shelf__cell--top`. ≤1024 대부분 6/6, ≤768 2단 — `.shelf__cell--half`만 반폭이고 짝수 칸은 24px 아래로 엇갈린다.

### 2-7 도형 · 견본 · 스티커 유틸
| 클래스 | 용도 |
|---|---|
| `.sh` + `--circle --half --half-down --tri --cyl --pill` + 색 `--magenta --cobalt --lemon --mint --coral --salmon --lilac --ink` | 가구 부품 도형. 크기 `style="--w-sh:64px;--h-sh:120px"` |
| `.sample .sample--lm01~06` | 정사각 견본 판(폭은 장면에서) |
| `.pat-lm01~06` | 임의 요소를 패턴 면으로 |
| `.price-tag`(+`--right`) > `.price-tag__no .price-tag__name .price-tag__price` | −4° 레몬 가격표 |
| `.stamp` > `텍스트 <b>2026.10.01</b>` | 원형 도장 |
| `.part-no` (`--tilt`) | 품번 태그 |
| `.lam` (+`--sm --lg --flat --lm01~06 --magenta --cobalt --lemon --mint --coral --salmon --lilac --ink`) + `.cut-tl/-tr/-br/-bl/-lg-tl` + `.lam--press` | 임의 판에 S1 단면·S2 컷을 붙이는 범용 판 |
| 타이포 `.t-mega .t-d1 .t-d2 .t-d3 .t-h1 .t-h2 .t-h3 .t-ko(Gasoek) .t-label(Do Hyeon) .t-mono .t-muted .t-brand .t-small .t-body-l .lead .measure .num .nobr` | |

### 2-8 등장 모션
`data-drop`을 붙이면 화면에 들어올 때 받침대 위로 "툭"(−16px·−6°→0, 형제 순서대로 60ms 스태거). `style="--i:3"`으로 순서 지정 가능. reduced-motion이면 즉시 표시.

### 2-9 아이콘 (인라인 SVG, 3px 기하 스트로크)
```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
```
`.icon`(20) `.icon--lg`(24) `.icon--sm`(16) `.icon--fill`. 자주 쓰는 path:
닫기 `M6 6l12 12M18 6L6 18` · 검색 `<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>` · 메뉴 `M4 7h16M4 12h16M4 17h10` · 해 `<circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>` · 달 `M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z` · 체크 `M5 12l5 5 9-10` · 더하기 `M12 5v14M5 12h14` · 시계 `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` · 하트 `M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z` · 화살표 `M5 12h14M13 6l6 6-6 6` · 일시정지 `M8 5v14M16 5v14` · 재생 `M7 5l12 7-12 7z` · 트럭 `M3 7h11v9H3zM14 10h4l3 3v3h-7` · 전화 `M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z`

### 2-10 상품 일러스트 스니펫 (품번마다 정본 1종 — 복사해서 그대로, 크기만 `--s`)
같은 상품은 표지·차례·캐러셀·상세·프로필·현황판·온보딩 어디서나 **같은 그림**이다. 부품 순서·색을 바꾸지 말고, 장면 CSS에서 `--s`(배율)만 준다(예: `.db-item .fx-shelf { --s: .56; }`).
판재 원색은 모드와 무관(밤에도 낮 색), 선반·상판 마감은 `--finish`(견본 = 고정 토큰 `--lam-lm0X`)를 상속한다. 정의는 base.css 6-2.

| 클래스 | 품번 · 이름 | 정본 모양 | 기준 폭(`--s:1`) |
|---|---|---|---|
| `.fx-shelf` | DH-SH-07 파도 책장 | 왼쪽 코발트 기둥 · 오른쪽 마젠타 원기둥 · 레몬 파도 머리 · 라미네이트 선반 5장 · 잉크 발 2개 (1,900×400×1,960) | 200px |
| `.fx-moon` | DH-TB-03 반달 사이드 테이블 | 마젠타 반원 상판(곧은 변이 위) + 마감 단면 · 코발트 원기둥 다리 · 레몬 발판 | 120px |
| `.fx-lamp` | DH-LP-11 기둥 스탠드 조명 | 레몬 삼각 갓 · 민트 원기둥 · 마젠타 반구 받침 | 80px |
| `.fx-chair` | DH-CH-02 삼각 다리 의자 | 코발트 등판(우상단 컷) · 레몬 좌판 · 잉크 삼각 다리 | 110px |
| `.fx-vase` | DH-OB-12 뾰족 꽃병 | 마젠타 뾰족 입 · 코발트 몸통 | 56px |
| `.fx-ctable` | DH-TB-09 테라조 커피 테이블 | LM-05 사탕 테라조 상판 · 코발트·마젠타 원기둥 다리 | 132px |
| `.fx-mirror` | DH-OB-05 번개 거울 | 코랄 지그재그 프레임 · 라일락 아치 거울면 | 74px |

```html
<!-- DH-SH-07 파도 책장 (작은 썸네일은 .fx-shelf--bare 로 칸 속 소품을 걷는다) -->
<div class="fx fx-shelf" aria-hidden="true"><svg class="fx-shelf__crown" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M2 39V22C14 2 30 2 42 22S70 42 82 22 110 2 122 22 150 42 162 22 190 6 198 18V39Z"/></svg><i class="fx-shelf__post"></i><i class="fx-shelf__col"></i><i class="fx-shelf__b fx-shelf__b--1"></i><i class="fx-shelf__b fx-shelf__b--2"></i><i class="fx-shelf__b fx-shelf__b--3"></i><i class="fx-shelf__b fx-shelf__b--4"></i><i class="fx-shelf__b fx-shelf__b--5"></i><i class="fx-shelf__books"><b></b><b></b><b></b><b></b><b></b></i><i class="fx-shelf__ball"></i><i class="fx-shelf__diag"></i><i class="fx-shelf__dome"></i><i class="fx-shelf__tri"></i><i class="fx-shelf__vase"></i><i class="fx-shelf__books fx-shelf__books--low"><b></b><b></b><b></b></i><i class="fx-shelf__foot fx-shelf__foot--l"></i><i class="fx-shelf__foot fx-shelf__foot--r"></i></div>

<!-- DH-TB-03 반달 사이드 테이블 -->
<div class="fx fx-moon" aria-hidden="true"><i class="fx-moon__leg"></i><i class="fx-moon__foot"></i><i class="fx-moon__top"></i><i class="fx-moon__edge"></i></div>

<!-- DH-LP-11 기둥 스탠드 조명 -->
<div class="fx fx-lamp" aria-hidden="true"><i class="fx-lamp__pole"></i><i class="fx-lamp__base"></i><i class="fx-lamp__shade"></i></div>

<!-- DH-CH-02 삼각 다리 의자 -->
<div class="fx fx-chair" aria-hidden="true"><i class="fx-chair__legs"></i><i class="fx-chair__back"></i><i class="fx-chair__seat"></i></div>

<!-- DH-OB-12 뾰족 꽃병 -->
<div class="fx fx-vase" aria-hidden="true"><i class="fx-vase__body"></i><i class="fx-vase__crown"></i></div>

<!-- DH-TB-09 테라조 커피 테이블 -->
<div class="fx fx-ctable" aria-hidden="true"><i class="fx-ctable__leg fx-ctable__leg--l"></i><i class="fx-ctable__leg fx-ctable__leg--r"></i><i class="fx-ctable__top"></i></div>

<!-- DH-OB-05 번개 거울 -->
<div class="fx fx-mirror" aria-hidden="true"><i class="fx-mirror__frame"></i><i class="fx-mirror__glass"></i></div>
```
- 의미가 있는 그림(상품 상세 히어로)만 `role="img"` + `aria-label`로 바꾸고, 나머지는 `aria-hidden="true"`.
- 인라인 요소 안에 넣을 때는 `div` 대신 `span`을 써도 된다(클래스·부품 순서는 동일).
- 상품을 새로 그리지 않는다. 표에 없는 품번이 필요하면 base.css 6-2와 이 표에 먼저 추가한다.

---

## 3. 공통 셸 스니펫 (복사해서 그대로 — 바꾸는 것은 `aria-current` 위치뿐)

### 3-1 매장 셸 — product · pricing · profile · onboarding · 404 (+ index)
**navbar · index.html 경로**
```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="index.html" aria-label="도형상회 카탈로그 첫 쪽">
      <span class="nav__mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="nav__word">도형상회</span>
      <span class="nav__issue">No.07<br><span class="nav__season">2026 가을·겨울</span></span>
    </a>
    <nav class="nav__links" aria-label="주 메뉴">
      <a class="nav__link" href="index.html" aria-current="page">카탈로그</a>
      <a class="nav__link" href="pages/product.html">파도 책장</a>
      <a class="nav__link" href="pages/pricing.html">도형 클럽</a>
      <a class="nav__link" href="pages/profile.html">디자이너</a>
      <a class="nav__link" href="pages/onboarding.html">패턴 찾기</a>
    </nav>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-command-open aria-label="품번 검색 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span>품번 검색</span><kbd>⌘K</kbd></button>
      <button class="nav__icon" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 쇼룸으로 바꾸기 (다크 모드)">
        <svg class="icon theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="icon theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>
      </button>
      <a class="nav__cart" href="pages/product.html"><span class="nav__cart-label">장바구니</span><span class="badge badge--count" aria-label="2점">2</span></a>
      <button class="nav__burger" type="button" data-nav-toggle aria-expanded="false" aria-label="메뉴 열기">
        <svg class="icon icon-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
        <svg class="icon icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>
</header>
```
**navbar · pages/ 경로** — 위와 동일하되 링크만:
`nav__brand href="../index.html"` · 카탈로그 `../index.html` · 파도 책장 `product.html` · 도형 클럽 `pricing.html` · 디자이너 `profile.html` · 패턴 찾기 `onboarding.html` · 장바구니 `product.html`.
`aria-current="page"`는 현재 페이지 링크 하나에만(index는 카탈로그, 404는 없음).

**바닥글 (마퀴 + 잉크 푸터) · index.html 경로**
```html
<div class="marquee on-ink" data-marquee>
  <div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item">10.9–11.11 쇼룸 전시 「칼턴 이후」</span><span class="marquee__sep marquee__sep--circle" aria-hidden="true"></span>
    <span class="marquee__item">월요일 휴무</span><span class="marquee__sep marquee__sep--tri" aria-hidden="true"></span>
    <span class="marquee__item">견본 박스 <span class="t-mono">₩15,000</span> · 가구 구매 시 환급</span><span class="marquee__sep marquee__sep--zig" aria-hidden="true"></span>
    <span class="marquee__item">다음 견본 발송 10.16(금)</span><span class="marquee__sep marquee__sep--sq" aria-hidden="true"></span>
  </div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="공지 흐름 멈춤"><svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg><svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg></button>
</div>
<footer class="foot on-ink">
  <div class="foot__inner">
    <div class="foot__grid">
      <div class="foot__brand">
        <div class="foot__shapes" aria-hidden="true"><span class="sh sh--circle sh--magenta"></span><span class="sh sh--tri sh--cobalt"></span><span class="sh sh--lemon"></span><span class="sh sh--half sh--mint"></span></div>
        <p class="foot__word">도형상회<span class="foot__word-en">DOHYEONG SANGHOE</span></p>
      </div>
      <nav aria-label="바닥글 메뉴">
        <p class="foot__title">둘러보기</p>
        <div class="foot__links">
          <a href="index.html">카탈로그 No.07</a>
          <a href="pages/product.html">파도 책장</a>
          <a href="pages/pricing.html">도형 클럽</a>
          <a href="pages/profile.html">디자이너 한도윤</a>
          <a href="pages/onboarding.html">내 공간 패턴 찾기</a>
          <a href="pages/dashboard.html">작업실</a>
        </div>
      </nav>
      <dl class="foot__addr">
        <dt>성수 쇼룸</dt><dd>서울 성동구 성수이로7길 24, 1층</dd><dd>화–일 11:00–20:00 · 월요일 휴무</dd>
        <dt>파주 공방</dt><dd>경기 파주시 탄현면 새오리로 112</dd><dd>방문은 예약제 · 토 10:00–15:00</dd>
        <dt>전화 · 메일</dt><dd><span class="t-mono">02-468-1981</span> · hello@dohyeong.kr</dd>
      </dl>
    </div>
    <div class="foot__bottom"><span>© 2026 도형상회 · 파주 공방에서 만듭니다</span><span>카탈로그 <span class="t-mono">No.07 · 2026.10.01</span></span></div>
  </div>
</footer>
```
**바닥글 · pages/ 경로** — 링크만: `../index.html` · `product.html` · `pricing.html` · `profile.html` · `onboarding.html` · `dashboard.html`. 문구·순서는 같게. (index는 뒤표지 엽서 장면 아래에 이 마퀴+푸터를 그대로 둔다.)

### 3-2 작업실 셸 — dashboard · inbox · kanban · settings (pages/ 전용)

> 상단바 날짜는 두 표기를 함께 둔다: `.app__date-long`(2026년 10월 14일 (수)) / `.app__date-short`(10.14(수)).
> ≤480px 에서는 짧은 표기만 보이고 `white-space: nowrap` 으로 한 줄을 지킨다(이름이 둘째 줄로 떨어지지 않게).
```html
<div class="app">
  <aside class="side on-ink" id="side" aria-label="작업실 메뉴">
    <a class="side__brand" href="../index.html"><span class="nav__mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="side__word">도형상회</span><span class="side__sub">작업실</span></a>
    <button class="nav__icon side__close" type="button" data-side-toggle aria-label="작업실 메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <nav class="side__nav" aria-label="작업실">
      <p class="side__label">오늘의 작업실</p>
      <a class="side__link" href="dashboard.html"><span class="side__shape side__shape--circle" aria-hidden="true"></span>현황판</a>
      <a class="side__link" href="inbox.html"><span class="side__shape side__shape--tri" aria-hidden="true"></span>문의함<span class="badge badge--count" aria-label="미답변 7건">7</span></a>
      <a class="side__link" href="kanban.html"><span class="side__shape side__shape--sq" aria-hidden="true"></span>공방 제작 보드</a>
      <a class="side__link" href="settings.html"><span class="side__shape side__shape--half" aria-hidden="true"></span>쇼룸·주문 설정</a>
      <p class="side__label">매장 화면</p>
      <a class="side__link" href="product.html"><span class="side__shape side__shape--zig" aria-hidden="true"></span>상품 상세</a>
      <a class="side__link" href="pricing.html"><span class="side__shape side__shape--sq" aria-hidden="true"></span>도형 클럽</a>
      <a class="side__link" href="../index.html"><span class="side__shape side__shape--circle" aria-hidden="true"></span>카탈로그 No.07</a>
    </nav>
    <div class="side__user"><span class="side__avatar" aria-hidden="true">도</span><span><b>한도윤</b>대표 · 가구 디자이너</span></div>
  </aside>
  <div class="app__scrim" data-side-toggle aria-hidden="true"></div>
  <div class="app__main">
    <header class="app__bar">
      <button class="nav__icon app__menu" type="button" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="작업실 메뉴 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
      <p class="app__today"><span class="app__date-long">2026년 10월 14일 (수)</span><span class="app__date-short">10.14(수)</span> · 한도윤<span class="t-mono">14:20</span></p>
      <div class="app__tools">
        <button class="nav__search" type="button" data-command-open aria-label="품번 검색 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span>품번 검색</span><kbd>⌘K</kbd></button>
        <button class="nav__icon" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 쇼룸으로 바꾸기 (다크 모드)">
          <svg class="icon theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="icon theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>
        </button>
      </div>
    </header>
    <main class="app__content" id="main">
      <!-- 장면 -->
    </main>
  </div>
</div>
```
- 현재 페이지 링크에 `aria-current="page"` 하나. 작업실 페이지에는 매장 바닥글을 두지 않는다(셸이 바닥글 역할).
- ≤900px에서 사이드바는 왼쪽 서랍(`.app.is-side-open`), 스크림 클릭·Esc로 닫힌다. **접힌 띠를 남기지 않는다.**
- 데스크톱의 잉크 기둥은 `.app::before`(1열 전체, 페이지 끝까지)가 깔고, 내비 `.side`만 `sticky; height: 100dvh`로 붙는다. 긴 페이지 아래에서 크림 지면이 드러나지 않는다.
- `.app__content`는 세로 48px 간격 스택. 장면 레이아웃은 `.grid12` 또는 장면 CSS.

### 3-3 공통 오버레이 — 품번 검색기 (모든 페이지 body 끝, 1개)
index 경로(pages에서는 `data-href`의 `pages/` 제거, 카탈로그는 `../index.html`):
```html
<div class="cmd" data-command hidden>
  <div class="cmd__box" role="dialog" aria-modal="true" aria-label="품번 검색기">
    <div class="cmd__bar"><span class="cmd__prefix">DH-</span><input class="cmd__input" type="text" placeholder="품번이나 이름 (예: SH-07, 반달)" aria-label="품번 검색" data-autofocus></div>
    <div class="cmd__list" role="listbox" aria-label="검색 결과">
      <p class="cmd__group">수납 · 테이블 · 의자</p>
      <div class="cmd__opt" data-href="pages/product.html" data-keywords="sh07 책장 파도 수납"><span class="cmd__no">DH-SH-07</span><span class="cmd__name">파도 책장</span><span class="cmd__price">₩2,480,000</span></div>
      <div class="cmd__opt" data-keywords="tb03 반달 사이드 테이블"><span class="cmd__no">DH-TB-03</span><span class="cmd__name">반달 사이드 테이블</span><span class="cmd__price">₩690,000</span></div>
      <div class="cmd__opt" data-keywords="tb09 테라조 커피 테이블"><span class="cmd__no">DH-TB-09</span><span class="cmd__name">테라조 커피 테이블</span><span class="cmd__price">₩1,150,000</span></div>
      <div class="cmd__opt" data-keywords="ch02 삼각 다리 의자"><span class="cmd__no">DH-CH-02</span><span class="cmd__name">삼각 다리 의자</span><span class="cmd__price">₩380,000</span></div>
      <p class="cmd__group">조명 · 오브제 · 견본</p>
      <div class="cmd__opt" data-keywords="lp11 기둥 스탠드 조명"><span class="cmd__no">DH-LP-11</span><span class="cmd__name">기둥 스탠드 조명</span><span class="cmd__price">₩420,000</span></div>
      <div class="cmd__opt" data-keywords="ob05 번개 거울"><span class="cmd__no">DH-OB-05</span><span class="cmd__name">번개 거울</span><span class="cmd__price">₩260,000</span></div>
      <div class="cmd__opt" data-keywords="ob12 뾰족 꽃병 품절 임박"><span class="cmd__no">DH-OB-12</span><span class="cmd__name">뾰족 꽃병</span><span class="cmd__price">₩89,000</span></div>
      <div class="cmd__opt" data-href="pages/onboarding.html" data-keywords="견본 박스 lm 라미네이트 샘플"><span class="cmd__no">LM-01~06</span><span class="cmd__name">라미네이트 견본 박스</span><span class="cmd__price">₩15,000</span></div>
      <p class="cmd__group">화면</p>
      <div class="cmd__opt" data-href="pages/pricing.html" data-keywords="트레이드 클럽 회원 할인"><span class="cmd__no cmd__no--ko">클럽</span><span class="cmd__name">도형 클럽 (트레이드)</span><span class="cmd__price">₩290,000/년</span></div>
      <div class="cmd__opt" data-href="pages/dashboard.html" data-keywords="작업실 현황 대시보드"><span class="cmd__no cmd__no--ko">작업실</span><span class="cmd__name">작업실 현황판</span><span class="cmd__price">10.14</span></div>
    </div>
    <p class="cmd__empty" hidden><b>그런 품번은 아직 없어요</b>「<span data-cmd-echo></span>」 — SH · TB · LP · CH · OB 중 하나로 찾아보세요.</p>
    <div class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd>고르기</span><span><kbd>↵</kbd>열기</span><span><kbd>esc</kbd>닫기</span></div>
  </div>
</div>
```
`data-href`가 없는 항목은 고르면 토스트(`data-toast-text`로 문구 지정 가능). ⌘K / Ctrl+K로 어디서나 열린다. 입력의 `DH-` 접두는 무시하고 찾는다.

---

## 4. 컴포넌트 32 (가나다 대신 파일명 순)

> 공통: 루트 클래스에 S1 단면이 자동으로 붙는다(엔진: `--face` 판 면, `--pat` 단면 패턴, `--off` 오프셋, `--edge` 윤곽, `--r` 컷). 장면에서 바꾸고 싶으면 이 변수만 덮어쓴다.
> 상태 문법: hover = 판이 들림(오프셋 6→10) · active = 눌림(단면 0) · focus-visible = 3px 마젠타 아웃라인 + 4px 간격 · disabled = 단면 제거 + 깨알 면.
> 패턴 배정(고정): 버튼 LM-06 · 카드 LM-01 · 모달/드로어/팝오버/메뉴/커맨드 LM-02 · 입력/달력/목록 LM-03 · 알림/토스트 LM-04 · 칸반 LM-05.

### accordion (CP-01) — 서랍 손잡이
```html
<div class="acc" data-accordion="single">
  <div class="acc__item">            <!-- 열린 패널 엣지 색: data-plate="mint|salmon|lilac" (기본 레몬) -->
    <h3 class="acc__head"><button class="acc__btn" type="button" id="q1b" aria-expanded="true" aria-controls="q1">
      <span class="acc__no">Q-01</span><span class="acc__title">견본 박스 값은 돌려받나요?</span><span class="acc__handle" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="q1" role="region" aria-labelledby="q1b"><p>가구를 사시면 <strong>₩15,000 전액</strong>을 빼 드립니다.</p></div>
  </div>
</div>
```
`data-accordion`(여럿 열림) / `="single"`(하나만). 닫힌 패널은 app.js가 `hidden`. 비활성: `button disabled`.

### alert (CP-02) — 도형 아이콘 칸
```html
<div class="alert alert--warn" role="status">
  <span class="alert__mark" aria-hidden="true"><span class="alert__shape"></span></span>
  <div class="alert__body">
    <p class="alert__title">LM-04 번개 판재가 9판 남았어요</p>
    <p class="alert__text">이번 주 압착 예정 <strong>WO-318</strong>에 12판이 필요합니다.</p>
    <div class="alert__actions"><button class="btn btn--sm btn--secondary" type="button">판재 발주</button></div>
  </div>
  <button class="alert__close" type="button" data-dismiss aria-label="경고 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
`--info`(원) `--warn`(삼각) `--error`(X, `role="alert"`) `--success`(체크) · `--inline`(한 줄형, 닫기 없이).

### badge (CP-03)
```html
<span class="badge badge--stock"><span class="badge__dot"></span>재고 있음</span>
<span class="badge badge--low"><span class="badge__dot badge__dot--tri"></span>품절 임박 · 4개</span>
<span class="badge badge--new"><span class="badge__dot badge__dot--sq"></span>신상</span>
<span class="badge badge--trade">트레이드</span>
<span class="badge badge--count" aria-label="미답변 7건">7</span>
<button class="tag-chip" type="button" aria-pressed="true" data-toggle-pressed="finish"><span class="sample sample--lm01" aria-hidden="true"></span>꿈틀</button>
```
변형 `--stock --low --new --trade --brand --salmon --lilac --muted --outline --count` · `.badge__no`(모노 품번).
`.tag-chip`: `data-toggle-pressed`(단독 토글) / `data-toggle-pressed="그룹명"`(그룹 중 하나) · `disabled`.

### breadcrumb (CP-04)
```html
<nav class="crumbs" aria-label="위치"><ol>
  <li><a class="crumbs__link" href="../index.html">카탈로그</a></li>
  <li><a class="crumbs__link" href="../index.html">수납</a></li>
  <li><span class="crumbs__here" aria-current="page">파도 책장 <span class="t-mono">DH-SH-07</span></span></li>
</ol></nav>
```

### button (CP-05)
```html
<button class="btn btn--primary" type="button" data-burst data-toast data-toast-title="장바구니에 담았어요" data-toast-text="파도 책장 · LM-01 꿈틀" data-toast-no="DH-SH-07">장바구니 담기</button>
<button class="btn btn--secondary" type="button">견본 박스 신청 <span class="btn__no">₩15,000</span></button>
<button class="btn" type="button">쇼룸 예약</button>
<a class="btn btn--ghost" href="profile.html">디자이너 보기</a>
<button class="btn btn--icon" type="button" aria-label="찜하기"><svg class="icon" …/></button>
```
변형 `--primary`(마젠타·흰 글자) `--secondary`(레몬) `--ghost`(지면) `--danger`(코랄·잉크 글자) `--ink` · 크기 `--sm --lg --icon --block --round`.
상태 `disabled` · `aria-pressed="true"`(눌린 선택) · `aria-busy="true"`(로딩 삼각, app.js `data-busy-demo="1600"`이 자동) · `aria-invalid="true"`.
**튀김(`data-burst`)은 상품 상세 "장바구니 담기" 한 곳에만.** 묶음은 `.btn-row`.

### calendar (CP-06) — 쇼룸 예약 2026년 10월
```html
<div class="cal" data-calendar>
  <div class="cal__head"><h3 class="cal__title">2026년 10월<span class="cal__sub">성수 쇼룸 예약</span></h3>
    <div class="cal__nav"><button class="cal__arrow cal__arrow--prev" type="button" aria-label="9월" disabled></button><button class="cal__arrow" type="button" aria-label="11월"></button></div></div>
  <div class="cal__grid" role="grid" aria-label="2026년 10월 쇼룸 예약">
    <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span>…<span class="cal__dow">토</span>
    <button class="cal__day cal__day--out" type="button" disabled>27</button> …(9월 27–30)
    <button class="cal__day" type="button" disabled>1</button> …
    <button class="cal__day" type="button" data-closed aria-disabled="true" aria-label="10월 12일 월요일 휴무">12</button>
    <button class="cal__day" type="button" aria-current="date" data-booked="8" aria-label="10월 14일 수요일 오늘, 예약 8팀">14</button>
    <button class="cal__day" type="button" data-booked="12" data-full aria-label="10월 17일 토요일 마감">17</button>
    <button class="cal__day" type="button" data-label="10월 22일 (목) 선택" aria-label="10월 22일 목요일, 예약 2팀">22</button>
  </div>
  <div class="cal__legend"><span><i class="cal__key cal__key--today"></i>오늘</span><span><i class="cal__key cal__key--booked"></i>예약 팀 수</span><span><i class="cal__key cal__key--full"></i>마감</span><span><i class="cal__key cal__key--closed"></i>월요일 휴무</span></div>
  <p class="cal__out" data-cal-output aria-live="polite"></p>
</div>
```
1일 = 목 → 앞에 9월 27·28·29·30(`--out`) 4칸. 월요일 5·12·19·26 `data-closed`. 지난 날(1–13) `disabled`. 선택 = `aria-pressed="true"`(클릭 시 app.js), 방향키 이동.

### card (CP-07) — 상품 카드
```html
<article class="card">
  <div class="card__art card__art--salmon card__art--tall" aria-hidden="true">
    <span class="sh sh--cobalt" style="--w-sh:60px;--h-sh:150px"></span><span class="sh sh--lemon sh--circle" style="--w-sh:56px"></span>
  </div>
  <span class="card__price price-tag"><span class="price-tag__no">DH-SH-07</span><span class="price-tag__price">₩2,480,000</span></span>
  <div class="card__body">
    <p class="card__no">DH-SH-07 · 1,900×400×1,960mm</p>
    <h3 class="card__title"><a class="card__link" href="product.html">파도 책장</a></h3>
    <p class="card__desc">원색 판재를 토템처럼 쌓은 책장.</p>
    <div class="card__foot"><span class="badge badge--new">이번 호 표지</span><span class="card__sum">₩2,480,000</span></div>
  </div>
</article>
```
- `.card__link`가 있으면 카드 전체가 링크(들림·눌림·포커스 링). 링크 없는 정보 카드는 그냥 둔다.
- 일러스트 칸 색 `--salmon --lemon --lilac --mint --cobalt --paper`, `--tall`. 아래쪽 테라조 바닥띠는 자동.
- 변형 `--flat`(단면 없음) `--plate-lemon/-salmon/-lilac`(면 색) `--row`(가로형) `--note`(글 카드: 일러스트 없이 `.card__body`만).
- 상태 `aria-selected="true"`(담음, 레몬 면 + `.card__check` 원) · `aria-busy="true"`(일러스트 칸 사선 흐름) · `.card--soldout` / `aria-disabled="true"`(회색 + 「품절」 띠).
- 묶음 `.card-row`(자동 채움, 바닥 정렬).

### carousel (CP-08) — 쪽 넘김
```html
<div class="carousel" data-carousel aria-roledescription="carousel" aria-label="카탈로그 넘겨보기">
  <div class="carousel__stage">
    <article class="carousel__sheet" role="group" aria-roledescription="쪽" data-title="표지 — 파도 책장">…카드 내용(card__art + card__body 재사용 가능)…</article>
    <article class="carousel__sheet" role="group" aria-roledescription="쪽" data-title="견본 6종">…</article>
  </div>
  <div class="carousel__bar">
    <button class="carousel__arrow" type="button" data-carousel-prev aria-label="이전 쪽"></button>
    <span class="carousel__count" data-carousel-count>01 / 04</span>
    <button class="carousel__arrow" type="button" data-carousel-next aria-label="다음 쪽"></button>
    <span class="carousel__name" data-carousel-name></span>
    <div class="carousel__dots"></div>          <!-- 점은 app.js가 생성 -->
  </div>
</div>
```
뒤 장들은 −3°/+3°로 기울어 쌓이고(라일락·연분홍 면), 넘긴 장은 왼쪽 위로 날아간다. 스테이지 포커스 후 ←/→, 스와이프.

### code (CP-09)
```html
<div class="code on-ink">
  <div class="code__head"><span class="code__file">components/button.css</span><span class="code__lang">CSS</span>
    <button class="code__copy" type="button" data-copy><span data-copy-label>복사</span></button></div>
<pre class="code__pre" tabindex="0"><code><span class="tk-p">.btn--primary</span> { <span class="tk-v">--face</span>: <span class="tk-k">var</span>(--brand); }</code></pre>
</div>
```
`.on-ink` 필수. 토큰 `.tk-k .tk-s .tk-n .tk-c .tk-p .tk-v`. 인라인 코드 `<code class="ic">`.

### command (CP-10) — 품번 검색기
3-3 셸 스니펫 참조. 정적 견본(index 진열장): `<div class="cmd cmd--static">` + 같은 `.cmd__box`(이때 `data-command`·`hidden` 없음, 현재 항목은 `aria-selected="true"`).

### drawer (CP-11) — 견본 서랍
```html
<button class="btn" type="button" data-drawer-open="samples">견본 서랍 열기</button>
<div class="drawer" id="samples" hidden>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="samples-t">
    <div class="drawer__head"><div><span class="drawer__no">A6 견본 · 6종</span><h2 class="drawer__title" id="samples-t">견본 서랍</h2></div>
      <button class="drawer__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="drawer__body">
      <div class="drawer__row"><span class="sample sample--lm01"></span><span>꿈틀 <span class="t-mono">LM-01</span></span><span class="badge badge--stock">48판</span></div>
    </div>
    <div class="drawer__foot"><button class="btn btn--ghost" type="button" data-close>닫기</button><button class="btn btn--primary" type="button">견본 박스 담기</button></div>
  </div>
</div>
```
`.drawer__panel--left` · `--bottom`(+`.drawer__grip`). 정적 견본 `.drawer.drawer--static`(높이는 부모가). 포커스 트랩·Esc·바깥 클릭 닫힘.

### empty (CP-12) — 빈 선반
```html
<div class="empty">
  <div class="empty__plate"><div class="empty__art" aria-hidden="true"></div><span class="empty__floor" aria-hidden="true"></span></div>
  <p class="empty__title">장바구니 선반이 비었어요</p>
  <p class="empty__text">책장 한 칸이라도 채워 볼까요? 이번 호 표지는 파도 책장이에요.</p>
  <a class="btn btn--secondary empty__action" href="product.html">파도 책장 보러 가기</a>
</div>
```
`--center` `--row` · `.empty__art--none`(도형 없이 선반만). 행동은 하나.

### form (CP-13)
```html
<form class="form-grid" data-validate data-toast-title="견본 박스를 주문했어요" data-toast-text="10월 16일 (금) 발송" novalidate>
  <div class="field">
    <label class="field__label" for="tel">연락처 <span class="field__req">*</span></label>
    <div class="field__ctl"><input class="field__input field__input--mono" id="tel" type="tel" required pattern="01[0-9]-?[0-9]{4}-?[0-9]{4}" aria-describedby="tel-err" autocomplete="tel"></div>
    <p class="field__error" id="tel-err" hidden>휴대폰 번호 11자리를 입력해 주세요</p>
  </div>
  <div class="field">
    <label class="field__label" for="part">관심 품번</label>
    <div class="field__ctl field__ctl--select"><select class="field__input" id="part"><option>DH-SH-07 파도 책장</option></select><span class="field__caret" aria-hidden="true"></span></div>
  </div>
  <div class="field span-2">
    <label class="field__label" for="msg">요청 사항 <span class="field__count" data-char-count>0 / 200</span></label>
    <div class="field__ctl field__ctl--area"><textarea class="field__input" id="msg" maxlength="200"></textarea></div>
    <p class="field__hint">공방 백승호 공방장이 직접 읽어요.</p>
  </div>
  <fieldset class="fieldset"><legend>공간</legend>
    <div class="choices"><label class="radio"><input type="radio" name="sp" checked><span>거실</span></label><label class="radio"><input type="radio" name="sp"><span>카페</span></label></div>
  </fieldset>
  <label class="check"><input type="checkbox" checked><span>견본 박스 함께 받기 <span class="check__sub">가구 구매 시 ₩15,000 환급</span></span></label>
  <label class="switch"><input type="checkbox" role="switch" checked><span>배송 알림 문자</span><span class="switch__state" data-on="켜짐" data-off="꺼짐">켜짐</span></label>
  <fieldset class="fieldset span-2"><legend>마감</legend>
    <div class="swatch-set" data-finish-target="shelf-art">   <!-- 선택 시 #shelf-art 의 --finish 를 var(--pat-lm0X) 로 -->
      <label class="swatch-pick"><input type="radio" name="fin" value="LM-01" data-name="꿈틀" checked><span class="swatch-pick__tile sample--lm01"></span><span class="swatch-pick__name">꿈틀<span class="t-mono">LM-01</span></span></label>
      …LM-02~06
    </div>
  </fieldset>
  <div class="qty"><button type="button" data-qty-down aria-label="수량 줄이기">−</button><input type="number" value="1" min="1" max="9" aria-label="수량"><button type="button" data-qty-up aria-label="수량 늘리기">+</button></div>
  <button class="btn btn--primary" type="submit">견본 박스 주문 · ₩15,000</button>
</form>
```
- 입력은 반드시 `.field__ctl` 안에(단면이 여기에 붙는다). 접두/접미 `.field__pre .field__suf`, 확인 중 `.field__ctl[aria-busy="true"]` + `<span class="spin spin--sm field__spin" aria-hidden="true"><i></i><i></i><i></i></span>`.
- 상태: focus(마젠타 깨알 단면+링) · 에러 `aria-invalid="true"`(번개 단면 + 코랄 `.field__error`) · 성공 `.field--ok` + `.field__ok` · `disabled` · `readonly`.
- `form[data-validate]` 제출 시 app.js가 required/pattern/email/minLength를 검사해 첫 오류로 포커스, 통과하면 제출 버튼 로딩 → 토스트 → `form:valid` 이벤트.
- 마감 스와치와 상품 일러스트 연동: 일러스트 요소에 `id="shelf-art"` + 장면 CSS에서 `background: var(--finish, var(--pat-lm01)), var(--pattern-bg)`. 선택 이름 표시는 `[data-finish-scope]` 안의 `[data-finish-label]`.

### kanban (CP-14) — 공방 제작 보드
```html
<div class="board" data-kanban aria-label="공방 제작 보드">
  <section class="board__col"><header class="board__head"><span class="board__shape board__shape--circle" aria-hidden="true"></span><h2 class="board__title">도면 확정</h2><span class="board__count" data-count>2</span></header>
    <div class="board__list" role="list">
      <article class="kcard kcard--rush" draggable="true" tabindex="0" role="listitem" data-title="반달 사이드 테이블 6점">
        <span class="kcard__hole" aria-hidden="true"></span>
        <div class="kcard__top"><span class="kcard__no">WO-331</span><span class="kcard__part">DH-TB-03</span></div>
        <p class="kcard__name">반달 사이드 테이블 6점</p>
        <p class="kcard__finish"><span class="kcard__swatch sample--lm05" aria-hidden="true"></span>LM-05 사탕 테라조</p>
        <div class="kcard__foot"><span class="kcard__who"><i aria-hidden="true">백</i>백승호</span><span class="kcard__due">10.30 출고</span></div>
      </article>
      <p class="board__empty" hidden>아직 비어 있어요</p>
    </div>
  </section>
</div>
```
열 도형 `--circle --tri --sq --half --zig --star`(6열: 도면 확정 → 재단 → 라미네이트 압착 → 조립 → 검수 → 출고 대기). 카드 `--late`(지연, 코랄) `--rush`(급함) `--done`. 끌어 놓기 + **Alt(⌥)+←/→** 열 이동, 개수·빈 칸·라이브 안내 자동. 보드 위에 `<p class="t-small t-muted">카드를 끌거나 ⌥+←/→로 옮겨요</p>` 안내 권장.
- 열 끝에 `<span class="board__plinth" aria-hidden="true"></span>`(목록 `.board__list` 바로 뒤)을 둔다. 열 높이 차이는 빈 칸 대신 4px 바닥선 + LM-05 테라조 받침대 높이로 읽힌다.

### list (CP-15) — 주문·문의 행
```html
<ul class="list" aria-label="미답변 문의">
  <li><a class="list__item is-unread" href="inbox.html" aria-current="true">
    <span class="list__avatar" data-kind="trade" aria-hidden="true">김</span>
    <span class="list__main"><span class="list__title">연남 카페 6곳 반달 테이블 견적</span><span class="list__sub">오브제랩 김서연 · <span class="t-mono">Q-1207</span></span><span class="list__snippet">LM-05 마감 가능할까요?</span></span>
    <span class="list__meta"><span class="list__time">14:02</span><span class="badge badge--new">견적</span></span>
  </a></li>
</ul>
```
아바타 색 = 고객 유형 고정: `trade`(코발트) `space`(카페·공간, 민트) `person`(개인, 연분홍) `shop`(서점, 라일락) `staff`(직원, 레몬). 행은 `a`/`button`/`div`. 상태 `aria-current="true"`(열람 중) `aria-selected` `.is-unread` `aria-disabled`. `--plain`(판 없이).

### marquee (CP-16)
3-1 바닥글 스니펫의 마퀴가 정본. `.marquee--lemon`(레몬 띠, 장면용). 복제 그룹은 app.js가 만든다. hover·focus·멈춤 버튼으로 정지.

### menu (CP-17)
```html
<span class="menu-anchor">
  <button class="btn btn--sm btn--ghost" type="button" data-menu-trigger aria-controls="order-menu" aria-haspopup="menu" aria-expanded="false">주문 메뉴</button>
  <div class="menu" id="order-menu" role="menu" hidden>
    <p class="menu__label">DH-2610-0412</p>
    <button class="menu__item" role="menuitem" type="button" data-toast data-toast-title="송장을 출력했어요">송장 출력 <span class="menu__kbd">P</span></button>
    <button class="menu__item" role="menuitemradio" aria-checked="true" data-group="st" type="button">출고 대기</button>
    <button class="menu__item" role="menuitem" aria-disabled="true" type="button">환불 (결제 전)</button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button">주문 취소</button>
  </div>
</span>
```
`.menu--start`(왼쪽 정렬). ↑↓ Home End, Esc(트리거로 복귀), 바깥 클릭. `menuitemradio`는 같은 `data-group` 안에서 하나만, `menuitemcheckbox` 토글. 정적 견본 `.menu.menu--static`.

### modal (CP-18)
```html
<button class="btn" type="button" data-modal-open="finish-modal">마감 바꾸기</button>
<div class="modal" id="finish-modal" hidden>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="finish-t">
    <div class="modal__head"><div><span class="modal__no">DH-SH-07 · 마감 변경</span><h2 class="modal__title" id="finish-t">마감을 <span class="nobr">LM-05</span>로 바꿀까요?</h2></div>
      <button class="modal__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="modal__body"><p>사탕 테라조는 패턴 커스텀이라 리드타임이 <strong>14일 → 21일</strong>로 늘어납니다.</p></div>
    <div class="modal__foot"><button class="btn btn--ghost" type="button" data-close>그대로 두기</button><button class="btn btn--primary" type="button" data-close data-toast data-toast-title="마감을 LM-05로 바꿨어요">LM-05로 변경</button></div>
  </div>
</div>
```
`.modal__box--sm --lg`. 첫 포커스는 `[data-autofocus]` 또는 첫 포커스 가능 요소. 정적 견본 `.modal.modal--static`(hidden 없이, `aria-modal="false"`).

### motion (CP-19)
```html
<div class="motion">
  <div class="motion__cell">
    <div class="motion__stage"><span class="motion__obj" id="mo-drop" data-motion="drop"></span></div>
    <div class="motion__meta"><span class="motion__name">툭 떨어짐</span><span class="motion__spec">420ms · pop</span></div>
    <button class="btn btn--sm" type="button" data-motion-play="mo-drop">재생</button>
  </div>
  <!-- data-motion="lift"(판 들림 160ms) · "press"(눌림 90ms) · "burst"(튀김 600ms) -->
</div>
```
reduced-motion이면 재생 대신 안내 토스트.

### navbar (CP-20)
3-1 셸 스니펫이 정본. ≤1100 검색은 아이콘만, ≤900 링크가 버거 판으로 접힌다(Esc·바깥 클릭·링크 클릭으로 닫힘).

### pagination (CP-21)
```html
<nav class="pager" aria-label="리뷰 쪽" data-pager data-total="4" data-per="5" data-count="18">
  <a class="pager__btn pager__btn--step" href="product.html?review=1" data-pager-prev><span class="pager__tri pager__tri--prev" aria-hidden="true"></span><span class="pager__label">이전</span></a>
  <a class="pager__btn" href="product.html?review=1" aria-current="page">1</a>
  <a class="pager__btn" href="product.html?review=2">2</a>
  <span class="pager__gap" aria-hidden="true">…</span>
  <a class="pager__btn" href="product.html?review=4">4</a>
  <a class="pager__btn pager__btn--step" href="product.html?review=2" data-pager-next><span class="pager__label">다음</span><span class="pager__tri" aria-hidden="true"></span></a>
  <span class="pager__info">18건 중 1–5</span>
</nav>
```
`data-pager`가 있으면 app.js가 쪽 이동을 시연(현재 표시·이전/다음 비활성·정보 문구). 비활성 `aria-disabled="true"`.

### popover (CP-22)
```html
<span class="pop-anchor">
  <button class="btn btn--sm btn--ghost" type="button" data-popover-trigger aria-controls="lm05-pop" aria-expanded="false">LM-05는?</button>
  <div class="pop" id="lm05-pop" role="dialog" aria-label="LM-05 사탕 테라조" hidden>
    <div class="pop__head"><p class="pop__title">사탕 테라조</p><span class="pop__no">LM-05</span></div>
    <p class="pop__body">원색 조각을 흩뿌린 무늬. <strong>재고 17판</strong>.</p>
    <div class="pop__foot"><button class="btn btn--sm btn--secondary" type="button">견본 받기</button></div>
  </div>
</span>
```
`--end --above --wide`. 꼬리(`.pop__tail`)는 없으면 app.js가 넣는다. 정적 견본 `.pop.pop--static` + `<span class="pop__tail" aria-hidden="true"></span>`.

### progress (CP-23)
```html
<div class="meter-row"><span class="meter__label">10월 견본→가구 전환</span><span class="meter__value">27%</span></div>
<div class="meter" role="progressbar" aria-valuenow="27" aria-valuemin="0" aria-valuemax="100" aria-label="견본에서 가구 전환율"><span class="meter__fill"></span></div>

<div class="ring-wrap" role="progressbar" aria-valuenow="34" aria-valuemin="0" aria-valuemax="100" aria-label="재구매율" style="--ring:96px">
  <svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="ring__track" cx="24" cy="24" r="19"/><circle class="ring__val" cx="24" cy="24" r="19" pathLength="100"/><circle class="ring__edge" cx="24" cy="24" r="23"/></svg>
  <span class="ring__text">34%</span>
</div>

<div class="stack-meter" data-low aria-label="LM-04 재고 9판"><span class="stack-meter__plate"></span>…(판 수만큼)</div>
```
`.meter` 색 `--mint --coral --lemon --cobalt`, 크기 `--sm --lg`, 흐름 `--indeterminate` 또는 `aria-busy="true"`. 값은 `aria-valuenow`만 바꾸면 app.js가 `--val` 반영(`dohyeong.setProgress(el, 60)`). `.ring--mint --coral`.

### sidebar (CP-24)
3-2 작업실 셸 스니펫이 정본. 도형 칩 `.side__shape--circle --tri --sq --half --zig`.

### skeleton (CP-25)
```html
<div class="skel-card" aria-busy="true"><span class="sr-only">상품 불러오는 중</span>
  <span class="skel skel--art"></span><span class="skel skel--title"></span><span class="skel skel--text" style="--w:80%"></span>
  <div class="skel-row"><span class="skel skel--circle"></span><span class="skel skel--text"></span></div>
</div>
```
`--text`(`--w`) `--title` `--circle`(`--s`) `--art` `--btn`. 사선이 흐른다(샤인 없음).

### spinner (CP-26)
```html
<span class="spin" role="status"><i></i><i></i><i></i><span class="sr-only">불러오는 중</span></span>
<span class="spin-line"><span class="spin spin--sm" aria-hidden="true"><i></i><i></i><i></i></span>견본 재고 확인 중</span>
```
`--sm --lg`.

### steps (CP-27)
```html
<div data-stepper>
  <ol class="steps">
    <li class="steps__item" data-state="done"><span class="steps__mark">1</span><div class="steps__text"><p class="steps__title">공간 고르기</p><p class="steps__sub">거실</p></div></li>
    <li class="steps__item" data-state="current" aria-current="step"><span class="steps__mark">2</span><div class="steps__text"><p class="steps__title">색 조합</p></div></li>
    <li class="steps__item" data-state="todo"><span class="steps__mark">3</span>…</li>
    <li class="steps__item" data-state="todo"><span class="steps__mark">4</span>…</li>
  </ol>
  <section data-step-panel>…</section><section data-step-panel hidden>…</section>…
  <button class="btn btn--ghost" type="button" data-step-prev>이전</button><button class="btn btn--primary" type="button" data-step-next>다음</button>
</div>
```
도형 순서 자동(1 원 · 2 삼각 · 3 사각 · 4 별 · 5 반원). `data-state="done|current|todo|error"`. `[data-stepper]`는 이전/다음·패널 전환·`aria-current` 갱신, 패널 안 `form[data-validate]`가 통과하면 자동으로 다음 단계. `--vertical`, ≤640 자동 세로.

### table (CP-28)
```html
<div class="tbl-wrap">
  <div class="tbl-scroll" tabindex="0" role="region" aria-label="최근 주문 표">
    <table class="tbl" data-count-target="order-sel">
      <caption class="tbl__caption">최근 주문<span class="t-mono">2026.10.14</span></caption>
      <thead><tr>
        <th class="tbl__check-col"><label class="check"><input type="checkbox" data-table-select aria-label="전체 선택"></label></th>
        <th><button class="tbl__sort" type="button" data-sort-type="text">주문번호</button></th>
        <th>고객</th><th>마감</th>
        <th class="num" aria-sort="descending"><button class="tbl__sort" type="button" data-sort-type="num">금액</button></th>
        <th>상태</th>
      </tr></thead>
      <tbody>
        <tr><td class="tbl__check-col"><label class="check"><input type="checkbox" class="tbl__check" aria-label="DH-2610-0412 선택"></label></td>
          <td class="tbl__mono">DH-2610-0412</td><td><span class="tbl__strong">오브제랩 김서연</span><span class="tbl__sub">반달 사이드 테이블 × 6</span></td>
          <td><span class="tbl__swatch sample--lm05" aria-hidden="true"></span>LM-05</td>
          <td class="num" data-sort="4140000">₩4,140,000</td><td><span class="badge badge--trade">트레이드</span></td></tr>
        …(10행 이상)
      </tbody>
    </table>
  </div>
  <div class="tbl-foot"><span id="order-sel">선택 없음</span><nav class="pager" aria-label="주문 쪽">…</nav></div>
</div>
```
행 상태 `aria-selected="true"`(체크 시 자동) `.is-warn`(왼쪽 코랄 막대). 숫자 정렬은 `data-sort`에 원값. `--compact`, `--stack`(≤640 카드형, 각 `td`에 `data-label="금액"`). 넘칠 때 오른쪽 그림자 힌트 자동.

### tabs (CP-29) — 칼턴 책장 칸
```html
<div class="tabs" data-tabs>
  <div class="tabs__scroller"><div class="tabs__list" role="tablist" aria-label="상품 정보">
    <button class="tabs__tab" role="tab" id="t-desc" aria-controls="p-desc" aria-selected="true">설명</button>
    <button class="tabs__tab" role="tab" id="t-dim" aria-controls="p-dim" aria-selected="false" data-plate="mint">치수 도면</button>
    <button class="tabs__tab" role="tab" id="t-rev" aria-controls="p-rev" aria-selected="false" data-plate="salmon">리뷰 <span class="tabs__count">18</span></button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="p-desc" aria-labelledby="t-desc" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="p-dim" aria-labelledby="t-dim" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="p-rev" aria-labelledby="t-rev" tabindex="0" hidden>…</div>
</div>
```
활성 칸 색 `data-plate="lemon(기본)|mint|salmon|lilac"`. ←→ Home End, 넘치면 오른쪽 페이드 힌트. `.tabs--pill`(알약형 하위 탭). 비활성 `disabled`.

### timeline (CP-30)
```html
<ol class="tl">
  <li class="tl__item" data-kind="order"><span class="tl__mark" aria-hidden="true"></span><div class="tl__body"><p class="tl__time">2026.10.02 11:40</p><p class="tl__title">주문 접수</p><p class="tl__text">DH-2610-0412 · 오브제랩</p></div></li>
  <li class="tl__item" data-kind="make" data-state="current">…</li>
  <li class="tl__item" data-kind="ship" data-state="todo">…</li>
</ol>
```
도형 `order`(원) `make`(삼각) `ship`(사각) `note`(반원) `mile`(별). 상태 `current`(마젠타 + 「지금」) `todo`. 연표형 `.tl--years`(시간 칸이 큰 연도).

### toast (CP-31)
JS: `dohyeong.toast({ tone: 'success'|'info'|'warn'|'error', title, text, no, duration })` 또는 아무 요소에 `data-toast="success" data-toast-title="…" data-toast-text="…" data-toast-no="DH-2610-0412"`. 우하단 −2°로 붙었다 펴지고, hover·focus 동안 타이머 정지.
정적 견본:
```html
<div class="toast toast--success toast--static" role="status"><span class="toast__mark" aria-hidden="true"></span>
  <div class="toast__body"><span class="toast__no">DH-2610-0412</span><p class="toast__title">주문이 접수됐어요</p><p class="toast__text">오브제랩 · 반달 사이드 테이블 6점</p></div>
  <button class="toast__close" type="button" aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
```

### tooltip (CP-32)
```html
<span class="tip-anchor">
  <button class="btn btn--icon btn--sm" type="button" aria-label="영업시간" aria-describedby="tip-hours"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></button>
  <span class="tip" role="tooltip" id="tip-hours">화–일 11:00–20:00 · 월 휴무</span>
</span>
```
`--below --end`. hover·focus로 표시, Esc로 숨김. 정적 견본 `.tip.tip--static`.

---

## 5. app.js 훅 요약

| 속성/클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 쇼룸 전환 + localStorage. `[data-theme-label]`(버튼 안 문구) `[data-theme-state]`(어디든 현재 모드 문구) 자동 갱신 |
| `[data-modal-open="id"]` `[data-drawer-open="id"]` `[data-close]` | 열기/닫기, 포커스 트랩, Esc, 바깥 클릭, 스크롤 잠금, 포커스 복원 |
| `[data-command-open]` · ⌘K/Ctrl+K | 품번 검색기 |
| `[data-popover-trigger]` `[data-menu-trigger]` (`aria-controls`) | 팝오버/메뉴 |
| `[data-tabs]` `[data-accordion]` `[data-carousel]` `[data-calendar]` `[data-kanban]` `[data-marquee]` `[data-stepper]` `[data-pager]` | 각 컴포넌트 초기화 |
| `table.tbl` `.tbl__sort` `[data-table-select]` | 정렬·전체 선택 |
| `form[data-validate]` | 검증 + 로딩 + 토스트 |
| `[data-toast]` `[data-busy-demo="ms"]` `[data-burst]` `[data-dismiss]` `[data-copy]` `[data-motion-play]` `[data-toggle-pressed]` | 시연 동작 |
| `[data-finish-target="id"]` | 마감 스와치 → 일러스트 `--finish` 패턴 교체 |
| `[data-nav-toggle]` `[data-side-toggle]` | 매장 버거 / 작업실 서랍 |
| `[data-drop]` | 등장 모션 |
| `window.dohyeong` | `toast() setProgress() burst() openModal(id) openDrawer(id) openCommand() applyTheme(t)` |
