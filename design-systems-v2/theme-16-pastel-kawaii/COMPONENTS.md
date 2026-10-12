# COMPONENTS — 폭닥문방구 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값(날짜·가격·ID·인물)은 `DIRECTION.md`의 **팩트 시트**만 쓴다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected` `aria-current` `aria-expanded` `aria-pressed` `aria-busy` `aria-invalid` `aria-disabled` `disabled`)으로 표시한다. CSS가 그 속성을 읽는다.

시그니처 두 개를 빼먹지 말 것:
- **A 다이컷 스티커** — 버튼·배지·칩·아바타·탭·토스트·페이지 번호가 전부 "색 면 + 흰 3px 외곽 + 자두 그림자". 호버하면 오른쪽 아래 모서리가 들린다(CSS가 처리).
- **B 마스킹테이프** — 메모지·카드·폴라로이드는 반드시 테이프 조각(`.tape--pin`)으로 고정. 섹션 제목은 `.tape-title`(테이프 위 손글씨). **테이프 없는 카드형 면 금지.**

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>11월 셋째 주 운영 위클리 — 폭닥문방구</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('pokdak-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Dongle:wght@400;700&family=Zen+Maru+Gothic:wght@400;500;700&family=Gowun+Dodum&family=Gaegu:wght@400;700&family=M+PLUS+1+Code:wght@400;500&family=Nanum+Gothic+Coding&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
  <!-- 1) SVG 스프라이트 (0-2절, body 첫 줄) -->
  <!-- 2) 밤 장면 야광 별 (0-3절) -->
  <!-- 3) 셸 (4절: 관리 도구 / 고객 / index) -->
  <!-- 4) 오버레이(모달·드로어·커맨드)는 셸 바깥, body 끝에 -->
  <script src="app.js"></script>                 <!-- pages: ../app.js -->
</body>
</html>
```

- `localStorage` 키 `pokdak-theme`. 우선순위 `?theme=dark|light` → 저장값 → 시스템.
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만**(1절 목록). raw hex 금지, 인라인 `grid-template-columns` 금지, `href="#"` 금지, 인라인 onclick 금지. 단 `style="--val:62%"` `style="--start:2;--dur:1.5"` 같은 **커스텀 속성 주입은 허용**.
- 숫자는 한글 폰트로 쓰지 않는다. 큰 한글 제목(Dongle) 안의 숫자는 `<span class="num">` 로 감싼다(0.66배 보정 + Zen Maru 700).
- 한글이 섞인 라벨에 넓은 자간·대문자 eyebrow 금지. 섹션 라벨 = `.tape-title` 또는 `.label-sticker`.
- **기울기 규칙**: 스티커·메모지·폴라로이드만 −4°~+4°(`.tilt-a~f` 또는 부모 `.tilt-cycle`). 표·폼·본문·달력은 0°. 모바일은 자동으로 절반.
- 이모지 금지. 아이콘은 0-1절 인라인 SVG, 마스코트는 0-2절 `<use>`.
- 상시 움직임은 화면당 2개까지: 마키 테이프 1 + 폭닥이 숨쉬기(`.pk--breathe`) 1.

### 0-1. 아이콘 (인라인 SVG, `class="ico"` 20px · `ico--lg` 24 · `ico--sm` 16)
`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>` — 선은 CSS가 `stroke: currentColor`로 준다. **presentation attribute에 `var()` 금지.** 아이콘 버튼은 `aria-label` 필수.

| 이름 | 안쪽 마크업 |
|---|---|
| 검색 | `<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>` |
| 봉투(장바구니·편지) | `<path d="M3.5 7.5h17v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 7.5l8.5 6.5 8.5-6.5"/>` |
| 편지함 | `<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>` |
| 해 | `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>` |
| 달 | `<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>` |
| 닫기 | `<path d="M6 6l12 12M18 6L6 18"/>` |
| 왼쪽 / 오른쪽 | `<path d="M15 5l-7 7 7 7"/>` / `<path d="M9 5l7 7-7 7"/>` |
| 위클리(달력) | `<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>` |
| 제작 보드 | `<rect x="3.5" y="4" width="7" height="9" rx="1"/><rect x="13.5" y="4" width="7" height="6" rx="1"/><rect x="13.5" y="13" width="7" height="7" rx="1"/><rect x="3.5" y="16" width="7" height="4" rx="1"/>` |
| 스티커 시트(작가) | `<path d="M6 3.5h9l4 4v13H6z"/><circle cx="10.5" cy="11" r="2"/><circle cx="14.5" cy="15.5" r="2"/>` |
| 설정 | `<circle cx="12" cy="12" r="3"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M5.4 18.6l2.1-2.1M16.5 7.5l2.1-2.1"/>` |
| 더하기 / 체크 | `<path d="M12 5v14M5 12h14"/>` / `<path d="M5 12.5l4.2 4.2L19 7"/>` |
| 복사 | `<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>` |
| 정지 / 재생 | `<path d="M8 5v14M16 5v14"/>` / `<path d="M8 5l11 7-11 7z"/>` |
| 경고 / 정보 | `<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>` / `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>` |
| 더 보기 | `<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>` |
| 택배 | `<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>` |
| 휴지통 / 연필 | `<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>` / `<path d="M4 20h4l11-11-4-4L4 16z"/>` |
| 테이프 | `<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M6 8v8M18 8v8"/>` |
| 카톡 말풍선 / 인스타 | `<path d="M4 5h16v11H9l-5 4z"/>` / `<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/>` |
| 집(견본첩) | `<path d="M4 11l8-6.5 8 6.5V20h-5v-5H9v5H4z"/>` |

### 0-2. SVG 스프라이트 — 폭닥이 4표정 + 별 (body 첫 줄에 그대로 복사)
쓰는 법: `<svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg>`
표정: `#pk`(기본 ^ω^) · `#pk-happy`(신남, 별 눈) · `#pk-sleepy`(졸림 — 다크·로딩) · `#pk-sad`(시무룩 — 404·빈 상태). 별: `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#pk-star"/></svg>`.
크기는 `style="--pk-size:200px"` 또는 장면 CSS에서 `--pk-size`. 숨쉬기 = `.pk--breathe`(화면당 1개).

```html
<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <g id="pk-cloud">
      <circle cx="58" cy="94" r="30"/><circle cx="74" cy="60" r="30"/><circle cx="108" cy="46" r="31"/>
      <circle cx="142" cy="64" r="30"/><circle cx="152" cy="100" r="28"/><circle cx="126" cy="128" r="28"/>
      <circle cx="84" cy="130" r="28"/><circle cx="104" cy="92" r="46"/>
    </g>
    <g id="pk-legs">
      <rect x="66" y="132" width="17" height="32" rx="8.5"/><rect x="90" y="138" width="17" height="28" rx="8.5"/>
      <rect x="112" y="138" width="17" height="28" rx="8.5"/><rect x="134" y="132" width="17" height="32" rx="8.5"/>
    </g>
    <g id="pk-tuft"><circle cx="88" cy="72" r="13"/><circle cx="104" cy="66" r="15"/><circle cx="119" cy="73" r="12"/></g>
    <g id="pk-body">
      <use href="#pk-legs" style="fill:var(--die-cut);stroke:var(--die-cut);stroke-width:10"/>
      <use href="#pk-cloud" style="fill:var(--die-cut);stroke:var(--die-cut);stroke-width:12"/>
      <use href="#pk-legs" style="fill:var(--pk-leg)"/>
      <use href="#pk-cloud" style="fill:var(--pk-line);stroke:var(--pk-line);stroke-width:3.5"/>
      <use href="#pk-cloud" style="fill:var(--pk-wool)"/>
      <ellipse cx="64" cy="100" rx="17" ry="9" transform="rotate(-24 64 100)" style="fill:var(--pk-face);stroke:var(--pk-line);stroke-width:2.5"/>
      <ellipse cx="144" cy="100" rx="17" ry="9" transform="rotate(24 144 100)" style="fill:var(--pk-face);stroke:var(--pk-line);stroke-width:2.5"/>
      <ellipse cx="104" cy="104" rx="37" ry="31" style="fill:var(--pk-face)"/>
      <use href="#pk-tuft" style="fill:var(--pk-line);stroke:var(--pk-line);stroke-width:3.5"/>
      <use href="#pk-tuft" style="fill:var(--pk-wool)"/>
      <ellipse cx="81" cy="116" rx="8" ry="5" style="fill:var(--pk-cheek)"/>
      <ellipse cx="127" cy="116" rx="8" ry="5" style="fill:var(--pk-cheek)"/>
    </g>
  </defs>
  <symbol id="pk" viewBox="0 0 200 170">
    <use href="#pk-body"/>
    <circle cx="91" cy="103" r="5" style="fill:var(--pk-ink)"/><circle cx="117" cy="103" r="5" style="fill:var(--pk-ink)"/>
    <path d="M97 114q3.5 4 7 0q3.5 4 7 0" style="fill:none;stroke:var(--pk-ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/>
  </symbol>
  <symbol id="pk-happy" viewBox="0 0 200 170">
    <use href="#pk-body"/>
    <path d="M91 95l2.3 5.4 5.4 2.3-5.4 2.3L91 110.4l-2.3-5.4-5.4-2.3 5.4-2.3zM117 95l2.3 5.4 5.4 2.3-5.4 2.3-2.3 5.4-2.3-5.4-5.4-2.3 5.4-2.3z" style="fill:var(--pk-ink)"/>
    <path d="M96 113q8 11 16 0z" style="fill:var(--pk-ink);stroke:var(--pk-ink);stroke-width:2;stroke-linejoin:round"/>
  </symbol>
  <symbol id="pk-sleepy" viewBox="0 0 200 170">
    <use href="#pk-body"/>
    <path d="M84 103q7 4.5 14 0M110 103q7 4.5 14 0M101 116q3 2.5 6 0" style="fill:none;stroke:var(--pk-ink);stroke-width:3;stroke-linecap:round"/>
  </symbol>
  <symbol id="pk-sad" viewBox="0 0 200 170">
    <use href="#pk-body"/>
    <circle cx="91" cy="104" r="4.5" style="fill:var(--pk-ink)"/><circle cx="117" cy="104" r="4.5" style="fill:var(--pk-ink)"/>
    <path d="M84 96l9-3M124 96l-9-3M97 118q7-6 14 0" style="fill:none;stroke:var(--pk-ink);stroke-width:3;stroke-linecap:round"/>
    <path d="M88 111q-3.5 6 0 8.5q3.5-2.5 0-8.5z" style="fill:var(--st-sky);stroke:var(--die-cut);stroke-width:1.5"/>
  </symbol>
  <symbol id="pk-star" viewBox="0 0 24 24">
    <path d="M12 2.5l2.8 6 6.5.8-4.8 4.5 1.3 6.5L12 17l-5.8 3.3 1.3-6.5L2.7 9.3l6.5-.8z"/>
  </symbol>
</svg>
```

### 0-3. 밤 장면 — 천장의 야광 별 (body 둘째 줄, 모든 HTML 동일)
낮에는 `display:none`, 밤에만 보이고 레몬 글로우가 붙는다(글로우는 별·야광 상품 전용). 스탠드 불빛 원뿔은 `body::before`가 자동으로 그린다.
```html
<div class="night-sky" aria-hidden="true">
  <svg style="--x:8px;--y:150px;--sz:24px;--r:-12deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:calc(100% - 34px);--y:230px;--sz:20px;--r:10deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:14px;--y:430px;--sz:16px;--r:4deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:calc(100% - 38px);--y:520px;--sz:26px;--r:-6deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:10px;--y:700px;--sz:20px;--r:14deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:calc(100% - 28px);--y:790px;--sz:14px;--r:0deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
  <svg style="--x:48%;--y:20px;--sz:16px;--r:8deg" viewBox="0 0 24 24"><use href="#pk-star"/></svg>
</div>
```

---

## 1. 장면 CSS에서 쓸 semantic 토큰

- 종이·잉크: `--paper --paper-raised --grid-line --grid-line-strong --ink --ink-soft --ink-faint(장식 전용)`
- 체리: `--cherry --cherry-press --on-cherry --cherry-ink(링크·강조 글자) --link --focus`
- 스티커 면: `--st-strawberry --st-mint --st-lavender --st-lemon --st-sky --st-peach` + 그 위 글자 `--on-sticker`
- 연한 면: `--wash-strawberry --wash-mint --wash-lavender --wash-lemon --wash-sky --wash-peach`
- 테이프 바탕: `--tape-strawberry --tape-mint --tape-lavender --tape-lemon --tape-sky --tape-peach --tape-alpha --tape-blend` + 그 위 글자 `--on-tape --on-tape-soft`
- 상태: `--ok --warn --err --info`(글자·아이콘) `--ok-wash --warn-wash --err-wash --info-wash --on-err`
- 형광펜·선택: `--marker --marker-soft --selected --hover-wash --disabled-fill --disabled-fg`
- 다이컷·그림자: `--die-cut --peel-back --peel-under --shadow-c --shadow-sticker --shadow-sticker-lift --shadow-sticker-press --shadow-paper --shadow-paper-lift --shadow-drop --overlay --hole --glow --glow-filter`
- 폭닥이 색: `--pk-wool --pk-line --pk-face --pk-ink --pk-cheek --pk-leg`
- 치수(테마 무관): `--font-display --font-display-ko --font-body --font-hand --font-mono --font-num`, `--t-cover --t-numeral --t-h1 --t-h2 --t-h3 --t-hand-lg --t-hand --t-body-lg --t-body --t-small --t-label --t-label-ko --t-mono`, `--s-4 --s-8 --s-12 --s-20 --s-40 --s-60 --s-80 --s-120`, `--r-paper --r-paper-sm --r-sheet --r-sticker --r-sticker-odd --r-tab --r-round --die --tape-h --tape-h-wide --tooth --zigzag --zigzag-end`, `--ease-stick --ease-peel --ease-paper --dur-press --dur-peel --dur-stick --dur-paper --stagger`, `--nav-h --rail-w --tabbar-h --spread-max --binding --z-*`

규칙: 파스텔 면 위 글자는 항상 `--on-sticker`/`--on-tape`(밤에도 진한 자두). 파스텔 위 파스텔 글자 금지. 크림·베이지 금지. radial 얼룩 금지.

---

## 2. 레이아웃 문법 (base.css) — "모눈 속지 위에 붙인다"

모든 간격·크기는 20의 배수(장 안의 간격은 20/40/80 세 단계). `html` 배경이 이미 20px 모눈 + 100px 굵은 선이다.

### `.spread` — 좌우 두 쪽 펼침면 (≥1080px), 가운데 제본선 링 구멍 9개
```html
<section class="spread" id="stickers" aria-labelledby="h-stickers">
  <div class="spread__page">…왼쪽 쪽…</div>
  <div class="spread__binding" aria-hidden="true"></div>
  <div class="spread__page">…오른쪽 쪽…</div>
</section>
```
- 720–1079px: 제본선이 왼쪽으로, 두 쪽이 세로로 쌓임. 719px 이하: 상단 스프링, 쪽 안쪽 여백 20px. 480px 이하: 테두리·그림자 없는 한 장.
- 여러 장은 `<div class="spread-stack">`로 감싼다 → 장 사이 120px, 짝수 장은 20px 밀려 "넘긴" 단차.
- 쪽 경계를 넘는 큰 스티커(폭닥이 등)는 펼침면에 한 개만. 넘침 연출은 `overflow-x: clip`된 래퍼 안에서(가로 스크롤 0).

### `.page` — 한 쪽짜리 속지 (패딩 40, 모바일 20)
### `.sheet` — 키스컷 스티커 시트 (wash 면 + 점선 칼선). `--mint --lavender --lemon --sky --peach --paper`
### 배치 유틸
| 클래스 | 용도 |
|---|---|
| `.stack` `.stack--8` `.stack--40` | 세로 간격 20(기본)/8/40 |
| `.cluster` `.cluster--20` | 가로 줄바꿈 묶음 |
| `.split` | 양끝 정렬 |
| `.tilt-a`(−2) `.tilt-b`(+3) `.tilt-c`(−1) `.tilt-d`(+4) `.tilt-e`(−4) `.tilt-f`(+2) / 부모 `.tilt-cycle` | 스티커·메모지 기울기 |
| `.measure` | 읽는 글 폭 42em |
| `.vh` `.skip` `.kbd` `.sprite` | 숨김 · 건너뛰기 · 키캡 · 스프라이트 보관 |

### 활자 유틸
| 클래스 | 용도 |
|---|---|
| `.t-cover` | Dongle 168px(모바일 96) — 표지 한 줄 |
| `.t-numeral` | Mochiy 120px(모바일 72) — "11", KPI 큰 숫자 |
| `.t-h1` `.t-h2` `.t-h3` / `h1~h4` | Dongle 700 (88/60/40, 모바일 60/44/34) |
| `.t-pop` | Mochiy 라틴·숫자 팝 레터링 |
| `.t-label` / `.t-label-latin` | 한글 라벨(Dongle 26) / 라틴 라벨(Zen Maru 13, 자간 .04em) |
| `.hand` `.hand-lg` `.hand--cherry` | Gaegu 손글씨 주석(포인트에만) |
| `.num` | 숫자(Zen Maru 700, tabular) — Dongle 안에서는 자동 0.66배 |
| `.mono` | M PLUS 1 Code — ID·hex·코드만 |
| `strong` `mark` `.marker` | **형광펜** 강조(굵게 대신) |
| `.t-soft` `.t-cherry` `.t-ok` `.t-warn` `.t-err` `.t-small` `.t-body-lg` `.t-right` | |

---

## 3. 시그니처 유틸

### 3-1. `.sticker` — 다이컷 스티커 (시그니처 A)
```html
<span class="sticker sticker--strawberry tilt-a">딸기우유</span>
<a class="sticker sticker--mint tilt-b" href="pages/product.html">스티커 보러 가기</a>   <!-- a/button이면 모서리 떼기 + 눌림 자동 -->
<span class="sticker sticker--lemon sticker--round sticker--glow">★</span>            <!-- 글로우는 별·야광 상품만 -->
```
색: `--strawberry --mint --lavender --lemon(기본) --sky --peach --cherry --paper`. 모양: `--round` `--pill`. 다른 요소에 떼기 효과만 주려면 `.peel`. 시트 위에 놓을 땐 부모 `.sheet`가 `--peel-under`를 맞춰 준다(장면에서 색 면 위에 올릴 땐 `style="--peel-under:var(--wash-mint)"`).

### 3-2. `.tape` — 마스킹테이프 (시그니처 B)
```html
<span class="tape">레몬 줄무늬</span>                     <!-- 기본 = 줄무늬(레몬) -->
<span class="tape tape--gingham">깅엄 딸기</span>
<span class="tape tape--grid">민트 모눈</span>
<span class="tape tape--dot">라벤더 도트</span>
<span class="tape tape--wide tape--sky">와이드 하늘</span>   <!-- --sky --peach --plain --wide(44px) --end(왼쪽만 직선) -->
```
- **고정용 조각**(메모지·폴라로이드 위): 부모 `position:relative`(`.card`·`.memo`·`.page`는 이미 됨) 안에
  `<span class="tape tape--gingham tape--pin tape--top" aria-hidden="true"></span>` — 위치 `--top`(가운데) `--tl` `--tr` `--bl` `--br`(대각 모서리) `--left`. 길이는 `style="--tape-w:120px"`.
- **섹션 제목** = 테이프 위 손글씨 (가운데정렬 라벨+제목+부제 대신):
  `<h2 class="tape tape-title" id="h-tape">마스킹테이프 · 글씨</h2>` (무늬 바꾸려면 `tape--gingham` 등 추가)
- **라벨 스티커**: `<span class="label-sticker">오늘 할 일</span>`
- **손글씨 주석 + 화살표**: `<p class="anno"><svg viewBox="0 0 40 28" aria-hidden="true"><path d="M38 4C26 4 12 10 6 24M6 24l-2-9M6 24l8-5"/></svg>흰 외곽 3px</p>`

### 3-3. 메모지 원형 `.memo` (`--lined` `--grid` `--fold`) — 카드가 아닌 자유 메모 면. 테이프 조각 필수.

---

## 4. 공통 셸 — 복사해서 쓰는 스니펫 (페이지마다 바꾸지 말 것)

바꿔도 되는 것: `<h1 class="cover__title">` 문구, `aria-current="page"`의 위치, `.cover__sub` 시각 표기. **그 외 마크업·순서·문구·링크는 그대로.**

- `<title>` 순서는 10장 모두 **"장면 이름 — 폭닥문방구"** 한 가지다(예: `편지함 — 폭닥문방구`, `2027 다꾸 견본첩 — 폭닥문방구`). 브랜드를 앞에 두지 않는다.

### 4-1. 관리 도구 페이지 (dashboard · inbox · kanban · profile) — `pages/*.html`
```html
<div class="shell shell--admin">
  <a class="skip" href="#main">본문으로 건너뛰기</a>
  <header class="cover">
    <a class="wordmark" href="../index.html" aria-label="폭닥문방구 견본첩 첫 장">
      <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg>
      <span class="wordmark__text"><span class="wordmark__latin">pokdak</span><span class="wordmark__ko">폭닥문방구</span></span>
    </a>
    <h1 class="cover__title">11월 셋째 주 운영 위클리</h1>
    <span class="cover__sub">11/20 금 15:40</span>
    <span class="cover__spacer"></span>
    <div class="cover__tools">
      <button class="cmd-trigger" type="button" data-open="cmd" aria-label="찾기 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
        <span class="cmd-trigger__text">상품·주문 찾기</span><span class="kbd">⌘K</span>
      </button>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="밤 다꾸 모드">
        <svg class="ico theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>
        <svg class="ico theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>
      </button>
      <span class="avatar avatar--mint" aria-hidden="true">다</span>
    </div>
  </header>

  <nav class="rail" aria-label="관리 도구">
    <ul class="rail__list" role="list">
      <li><a class="rail__tab" href="dashboard.html" aria-current="page"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg><span class="rail__label">위클리</span></a></li>
      <li><a class="rail__tab" href="inbox.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg><span class="rail__label">편지함</span><span class="rail__count" aria-label="미답 9건">9</span></a></li>
      <li><a class="rail__tab" href="kanban.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="7" height="9" rx="1"/><rect x="13.5" y="4" width="7" height="6" rx="1"/><rect x="13.5" y="13" width="7" height="7" rx="1"/><rect x="3.5" y="16" width="7" height="4" rx="1"/></svg><span class="rail__label">제작</span></a></li>
      <li><a class="rail__tab" href="profile.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9l4 4v13H6z"/><circle cx="10.5" cy="11" r="2"/><circle cx="14.5" cy="15.5" r="2"/></svg><span class="rail__label">작가</span></a></li>
      <li><a class="rail__tab" href="settings.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M5.4 18.6l2.1-2.1M16.5 7.5l2.1-2.1"/></svg><span class="rail__label">설정</span></a></li>
    </ul>
    <div class="rail__foot"><span class="avatar avatar--mint">다</span><span class="rail__who">서다온<br>운영</span></div>
  </nav>

  <main class="shell__main" id="main">
    …장면…
  </main>

  <!-- 4-4 공통 푸터 (pages 경로) -->
</div>
<!-- 4-5 커맨드 팔레트 #cmd (모든 페이지 동일) -->
```
- 페이지별 `cover__title`: dashboard "11월 셋째 주 운영 위클리" · inbox "편지함" · kanban "신상 스티커 제작 보드" · profile "작가 노트 · 솜사탕공방".
- 레일 5번째 탭 "설정"은 직원이 고객 설정 화면(settings.html)을 미리 보는 링크다. settings 자체는 **고객 셸(4-2)** 을 쓴다.
- 719px 이하에서 레일은 자동으로 하단 탭바(5개)가 된다. 따로 마크업하지 않는다.

### 4-2. 고객 페이지 (product · pricing · onboarding · settings · 404) — `pages/*.html`
```html
<div class="shell shell--shop">
  <a class="skip" href="#main">본문으로 건너뛰기</a>
  <header class="shopbar">
    <div class="shopbar__inner">
      <a class="wordmark" href="../index.html" aria-label="폭닥문방구 견본첩 첫 장">
        <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg>
        <span class="wordmark__text"><span class="wordmark__latin">pokdak</span><span class="wordmark__ko">폭닥문방구</span></span>
      </a>
      <nav class="shopbar__links" aria-label="가게">
        <a class="shopbar__link" href="product.html">스티커</a>
        <a class="shopbar__link" href="pricing.html">폭닥 우편함</a>
        <a class="shopbar__link" href="onboarding.html">취향 고르기</a>
        <a class="shopbar__link" href="settings.html">내 다이어리</a>
      </nav>
      <form class="search" role="search" action="404.html">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
        <label class="vh" for="shop-q">가게 검색</label>
        <input class="search__input" id="shop-q" name="q" placeholder="스티커·테이프·메모지 찾기">
      </form>
      <div class="shopbar__tools">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="밤 다꾸 모드">
          <svg class="ico theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>
          <svg class="ico theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>
        </button>
        <a class="shopbar__cart has-count" href="product.html" aria-label="장바구니 봉투, 2개">
          <svg class="ico ico--lg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h17v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 7.5l8.5 6.5 8.5-6.5"/></svg>
          <span class="badge badge--count badge--cherry" aria-hidden="true">2</span>
        </a>
      </div>
    </div>
  </header>

  <main class="shell__main" id="main">
    …장면…
  </main>

  <!-- 4-4 공통 푸터 (pages 경로) -->
</div>
```
- 현재 페이지 링크에 `aria-current="page"`(404는 없음). 899px 이하에서 검색이 둘째 줄, 링크가 셋째 줄 가로 스크롤(오른쪽 페이드)로 자동 배치.

### 4-3. index 상단 띠 — `index.html` (견본첩 표지)
```html
<header class="cover cover--index">
  <a class="wordmark" href="index.html" aria-label="폭닥문방구 견본첩 첫 장">
    <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg>
    <span class="wordmark__text"><span class="wordmark__latin">pokdak</span><span class="wordmark__ko">폭닥문방구</span></span>
  </a>
  <span class="cover__spacer"></span>
  <nav class="cover__tabs" aria-label="견본첩 장">
    <a class="cover__tab" href="#cover">표지</a>
    <a class="cover__tab" href="#stickers">스티커</a>
    <a class="cover__tab" href="#tape">테이프</a>
    <a class="cover__tab" href="#memo">메모</a>
    <a class="cover__tab" href="#tracker">트래커</a>
    <a class="cover__tab" href="#pages">페이지</a>
  </nav>
  <div class="cover__tools">
    <button class="cmd-trigger" type="button" data-open="cmd" aria-label="찾기 (⌘K)">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <span class="cmd-trigger__text">견본 찾기</span><span class="kbd">⌘K</span>
    </button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="밤 다꾸 모드">
      <svg class="ico theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>
      <svg class="ico theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>
    </button>
  </div>
</header>
<main id="main">…여섯 장(spread-stack)…</main>
<!-- 4-4 공통 푸터 (index 경로) — 뒤표지 장 바로 아래 -->
```
- 719px 이하에서 `.cover__tabs`는 숨겨진다 → index 장면은 각 장 시작부에 같은 6개 링크를 `.tabs--bare` 가로 탭 줄로 다시 둔다(스크롤 페이드 자동).
- index의 `.cover`도 sticky이고 고무줄 밴드(오른쪽 세로 띠)는 CSS가 그린다.

### 4-4. 공통 푸터 (모든 HTML 1종)
pages 경로:
```html
<footer class="site-foot">
  <span class="site-foot__tape" aria-hidden="true"></span>
  <div class="site-foot__inner">
    <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg>
    <p class="site-foot__text"><b>폭닥문방구</b> <span class="site-foot__fact">서울 성동구 연무장7길 14, 2층</span> · <span class="site-foot__fact">02-468-1120</span> · <span class="site-foot__fact">화–일 12:00–20:00 (월 휴무)</span><br><span class="site-foot__fact">hello@pokdak.kr</span> · <span class="site-foot__fact">카카오톡 채널 “폭닥문방구”</span> · <span class="site-foot__fact">인스타그램 @pokdak.stationery</span></p>
    <nav class="site-foot__links" aria-label="바닥 링크">
      <a href="../index.html">견본첩 첫 장</a>
      <a href="pricing.html">폭닥 우편함</a>
      <a href="product.html">스티커 시트</a>
      <a href="dashboard.html">운영 위클리</a>
    </nav>
  </div>
</footer>
```
index 경로: 위와 동일하되 링크만 `index.html#cover` · `pages/pricing.html` · `pages/product.html` · `pages/dashboard.html`.

### 4-5. 커맨드 팔레트 `#cmd` (모든 HTML의 body 끝, 동일 구성 — 경로만 index/pages에 맞춤)
```html
<div class="cmd" id="cmd" data-cmd-default hidden>
  <div class="cmd__scrim"></div>
  <div class="cmd__sheet" role="dialog" aria-modal="true" aria-label="스티커 검색 시트">
    <div class="cmd__field">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <input class="cmd__input" placeholder="상품·주문·페이지 찾기" aria-label="찾기" autofocus>
      <span class="kbd">esc</span>
    </div>
    <div class="cmd__list">
      <div class="cmd__group" role="group" aria-label="페이지">
        <span class="cmd__group-label">페이지</span>
        <div class="cmd__opt" data-href="dashboard.html"><span class="cmd__opt-ico cmd__opt-ico--strawberry"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg></span><span class="cmd__opt-text"><b>운영 위클리</b><small>11월 셋째 주</small></span><span class="cmd__opt-meta">G W</span></div>
        <div class="cmd__opt" data-href="inbox.html"><span class="cmd__opt-ico"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></span><span class="cmd__opt-text"><b>편지함</b><small>미답 9건</small></span><span class="cmd__opt-meta">G I</span></div>
        <div class="cmd__opt" data-href="kanban.html"><span class="cmd__opt-ico cmd__opt-ico--sky"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="7" height="9" rx="1"/><rect x="13.5" y="4" width="7" height="6" rx="1"/><rect x="13.5" y="13" width="7" height="7" rx="1"/><rect x="3.5" y="16" width="7" height="4" rx="1"/></svg></span><span class="cmd__opt-text"><b>제작 보드</b><small>MK-138 ~ MK-152</small></span><span class="cmd__opt-meta">G B</span></div>
      </div>
      <div class="cmd__group" role="group" aria-label="상품">
        <span class="cmd__group-label">상품</span>
        <div class="cmd__opt" data-href="product.html"><span class="cmd__opt-ico cmd__opt-ico--lemon"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9l4 4v13H6z"/><circle cx="10.5" cy="11" r="2"/><circle cx="14.5" cy="15.5" r="2"/></svg></span><span class="cmd__opt-text"><b>폭닥이 리무버블 스티커 시트</b><small>₩3,500 · 리뷰 1,287개</small></span><span class="cmd__opt-meta">PD-ST-0412</span></div>
        <div class="cmd__opt" data-href="product.html"><span class="cmd__opt-ico cmd__opt-ico--lavender"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9l4 4v13H6z"/><circle cx="10.5" cy="11" r="2"/><circle cx="14.5" cy="15.5" r="2"/></svg></span><span class="cmd__opt-text"><b>야광 별사탕 스티커</b><small>₩3,800 · 재고 38개</small></span><span class="cmd__opt-meta">PD-ST-0425</span></div>
        <div class="cmd__opt" data-href="pricing.html"><span class="cmd__opt-ico cmd__opt-ico--peach"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></span><span class="cmd__opt-text"><b>폭닥 우편함 1월호</b><small>11/30(월) 23:59 마감</small></span><span class="cmd__opt-meta">MB-27-01</span></div>
      </div>
      <div class="cmd__empty" hidden>
        <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk-sad"/></svg>
        <p>찾는 스티커가 없어요</p>
      </div>
    </div>
    <div class="cmd__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 열기</span><span><span class="kbd">esc</span> 닫기</span></div>
  </div>
</div>
```
index에서는 `data-href`를 `pages/dashboard.html` 식으로. ⌘K / Ctrl+K는 `data-cmd-default`가 붙은 팔레트를 연다. `data-href` 없는 항목은 클릭 시 `data-toast` 문구(없으면 "붙였어요") 토스트.

---

## 5. 컴포넌트 32 (알파벳순)

### accordion — 접힌 메모지 묶음
```html
<div class="acc" data-accordion="single">        <!-- 여러 개 동시: data-accordion -->
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__btn" id="q1" aria-expanded="true" aria-controls="a1">
      <span class="acc__q">Q</span>
      <span class="acc__title">1월호는 언제 도착해요?<span class="acc__sub">12/4(금) 일괄 발송</span></span>
      <span class="acc__fold" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="a1" role="region" aria-labelledby="q1">
      <div class="acc__inner"><div class="acc__body"><p>12/4(금)에 한꺼번에 보내고 12/7(월)까지 도착해요.</p></div></div>
    </div>
  </div>
</div>
```
항목 색은 순서대로 흰·레몬·민트·하늘 메모지, 왼쪽 테이프 자동. 비활성: 버튼에 `aria-disabled="true"`. JS가 `hidden` 동기화.

### alert — 손글씨 경고 메모
```html
<div class="alert alert--warn" role="status">
  <span class="alert__icon"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/></svg></span>
  <div>
    <p class="alert__title">앗, 야광 별사탕이 38개 남았어요</p>
    <p class="alert__text">PD-ST-0425 · 주말 전에 재입고 신청을 넣어 두세요.</p>
    <div class="alert__actions"><button class="btn btn--secondary btn--sm" type="button">재입고 신청</button></div>
  </div>
  <button class="alert__close" type="button" aria-label="알림 떼기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
변형 `--ok --warn --err --info`, 한 줄 띠 `--band`. 닫기 누르면 떼어져 사라짐(JS). 오류는 `role="alert"`.

### badge — 작은 다이컷 스티커 (+ 별점 · 아바타)
```html
<span class="badge badge--ok badge--dot">출고 완료</span>
<span class="badge badge--warn badge--dot">11/23 출고</span>
<span class="badge badge--err badge--dot">재고 38개</span>
<span class="badge badge--cherry">D-10</span>
<span class="badge badge--paper">PD-ST-0412</span>
<span class="badge badge--count">9</span>                            <!-- 레몬 원 숫자 -->
<button class="btn btn--icon has-count" aria-label="편지함, 미답 9건">…<span class="badge badge--count badge--cherry" aria-hidden="true">9</span></button>

<span class="stars" role="img" aria-label="평점 4.9점">
  <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#pk-star"/></svg> ×5   <!-- 빈 별: class="is-off" -->
  <span class="stars__score" aria-hidden="true">4.9</span>
</span>

<span class="avatar avatar--peach avatar--lg" aria-hidden="true">나</span>   <!-- --sm --lg --xl, 색 6종 -->
```
변형: 색 `--strawberry --mint --lavender --lemon --sky --peach --paper --cherry`, 상태 `--ok --warn --err --info --wait`(색만으로 구분 금지 → 글자 필수), `--dot`, `--flat`(기울기 0; 표·리스트 안은 자동). 갱신 순간 `.is-new`(붙이기). 아바타 색은 팩트 시트 인물별 색을 따른다(한보미 딸기 · 서다온 민트 · 문채이 라벤더 · 오하린 레몬 · 정우람 하늘 · 김나래 복숭아 · 이수아 라벤더).

### breadcrumb — 라벨 스티커 + 사선 테이프 조각
```html
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="../index.html">폭닥문방구</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="product.html">스티커</a></li>
  <li class="crumbs__item"><span class="crumbs__current" aria-current="page">폭닥이 리무버블 스티커 시트</span></li>
</ol></nav>
```
고객 화면(product · pricing · settings)의 첫 칸은 가게 이름 **폭닥문방구**다. "견본첩"은 디자인팀 내부 말이라 index · 관리 도구 · 404 버튼에만 쓴다.

### button — 다이컷 스티커 버튼
```html
<button class="btn btn--primary" type="button">1월호 신청하기</button>
<button class="btn btn--secondary" type="button">장바구니에 담기</button>
<button class="btn btn--ghost" type="button">더 보기</button>
<button class="btn btn--danger" type="button">주문 취소</button>
<button class="btn btn--lemon btn--lg" type="button">₩<span class="num">3,500</span> 담기</button>
<button class="btn btn--secondary btn--icon" type="button" aria-label="장바구니"><svg class="ico" …/></button>
<a class="btn btn--primary" href="pages/pricing.html">우편함 보러 가기</a>
```
- 변형 `--primary --secondary --ghost --danger` + 스티커색 `--strawberry --mint --lemon --sky --lavender --peach`. 크기 `--sm`(44) 기본(52) `--lg`(60), `--block`, `--icon`(원형, aria-label 필수).
- 상태: hover(들림 + 모서리 떼기) · active(납작) · focus-visible(체리 점선) · `disabled`/`aria-disabled="true"`(점선 칼선 자리) · `aria-busy="true"`(라벨 자리 유지 + 점선 원 회전; 라벨은 `<span>`으로 감쌀 것). 견본용 강제 상태 `.is-hover` `.is-active`.
- JS 보조: `data-loading="저장했어요"` → 1.6초 로딩 후 토스트. 버튼 줄은 `.btn-row`.

### calendar — 월간 다이어리 페이지 (월요일 시작)
```html
<section class="cal" data-calendar aria-label="2026년 11월">
  <div class="cal__head">
    <div class="cal__title"><span class="cal__month">11</span><span class="cal__year"><span class="num">2026</span>년 11월</span></div>
    <div class="cal__nav">
      <button class="carousel__btn carousel__btn--prev" type="button" aria-label="이전 달">…왼쪽 아이콘…</button>
      <button class="carousel__btn carousel__btn--next" type="button" aria-label="다음 달">…오른쪽 아이콘…</button>
    </div>
  </div>
  <div class="cal__grid">
    <span class="cal__dow">월</span><span class="cal__dow">화</span><span class="cal__dow">수</span><span class="cal__dow">목</span><span class="cal__dow">금</span><span class="cal__dow cal__dow--sat">토</span><span class="cal__dow cal__dow--sun">일</span>
    <button class="cal__day cal__day--out" type="button" data-date="2026-10-26" aria-label="10월 26일"><span class="cal__date">26</span></button>
    …
    <button class="cal__day cal__day--closed" type="button" data-date="2026-11-02" aria-label="11월 2일 월요일 휴무"><span class="cal__date">2</span><span class="cal__closed-label">휴무</span></button>
    <button class="cal__day" type="button" data-date="2026-11-11" aria-label="11월 11일, 다이어리 오픈"><span class="cal__date">11</span><span class="cal__ev cal__ev--tape">다이어리 오픈</span></button>
    <button class="cal__day cal__day--today" type="button" data-date="2026-11-20" aria-current="date" aria-label="11월 20일 오늘"><span class="cal__date">20</span></button>
    <button class="cal__day cal__day--sat" …><span class="cal__date">28</span><span class="cal__ev cal__ev--lavender">다꾸 클래스</span></button>
    <button class="cal__day" … aria-pressed="false"><span class="cal__date">30</span><span class="cal__ev cal__ev--cherry">1월호 마감!</span></button>
  </div>
  <div class="cal__legend"><span><i class="legend-cherry"></i>마감</span>…</div>
</section>
```
- 2026년 11월 1일은 **일요일** → 첫 줄 = 10/26(월)~11/1(일). 월요일은 매장 휴무 → `cal__day--closed`. 주말 클래스 `--sat` `--sun`.
- 일정: `.cal__ev` + 색 `--strawberry --lemon --lavender --sky --peach --cherry`(기본 민트), 여러 날 걸침 = `--tape`(깅엄, `--tape.cal__ev--mint` 모눈). 480px 이하·`.cal--mini`에서는 점으로 줄어듦(글자는 버튼 aria-label에 반드시 포함).
- 선택: JS가 `aria-pressed="true"`(고른 날)를 단일 유지, 방향키로 칸 이동, `pk:date` 이벤트. 범례 점 색은 장면 CSS에서 `.cal__legend i.legend-cherry{background:var(--cherry)}` 식으로(인라인 style 대신).

### card — 메모지 (테이프 필수)
```html
<article class="card card--grid tilt-a">
  <span class="tape tape--pin tape--top" aria-hidden="true"></span>
  <span class="card__id">PD-ST-0412</span>
  <h3 class="card__title card__title--sm">폭닥이 리무버블 스티커 시트</h3>
  <p class="card__meta">A6 · 표정 24개 · 재부착 3회</p>
  <div class="card__foot"><span class="card__price">₩3,500</span><span class="badge badge--ok">재고 넉넉</span></div>
</article>

<a class="card card--polaroid tilt-c" href="pages/dashboard.html">
  <span class="tape tape--dot tape--pin tape--tl" aria-hidden="true"></span>
  <span class="card__photo">…CSS 미니어처…</span>
  <span class="card__caption">운영 위클리<small>dashboard</small></span>
</a>
```
- 모양 `--lined`(줄노트+빨간 여백선, 글 메모용 — 폼을 올리지 말 것) `--grid` `--cloud`(위아래 물결 떡메모지) `--polaroid` `--fold`(모서리 접힘). 색 `--strawberry --mint --lemon --sky --lavender`.
- `a.card`/`.card--link`: 호버 시 들리며 기울기가 반쯤 펴짐. 선택 `aria-selected="true"`/`.is-selected`(체리 테두리), 비활성 `aria-disabled="true"`, 오류 `--error`. 사진 칸 색은 `style="--photo:var(--wash-mint)"`.
- 메모 콜라주: `.card-grid`(auto-fill 260px, `align-items:start`). 비정형 콜라주는 장면 CSS에서.

### carousel — 스티커 팩 넘기기
```html
<div class="carousel" data-carousel data-loop aria-label="폭닥이 스티커 시트 미리보기">   <!-- 자동: data-autoplay="5000" -->
  <div class="carousel__pack">
    <span class="badge badge--paper carousel__label">PD-ST-0412</span>
    <div class="carousel__viewport"><div class="carousel__track">
      <div class="carousel__slide"><div class="sheet">…스티커들…</div></div>
      <div class="carousel__slide">…</div>
    </div></div>
  </div>
  <div class="carousel__controls">
    <button class="carousel__btn carousel__btn--prev" type="button" aria-label="이전 시트">…</button>
    <div class="carousel__dots"><button class="carousel__dot" type="button" aria-label="1번 시트"></button>…</div>
    <span class="carousel__status" aria-live="polite"></span>
    <button class="carousel__btn carousel__btn--next" type="button" aria-label="다음 시트">…</button>
  </div>
  <div class="carousel__thumbs"><button class="carousel__thumb" type="button" aria-label="1번 시트">…</button>…</div>  <!-- 선택 -->
</div>
```
JS: ←→ 키, 스와이프, 점/썸네일 `aria-current`, 보이지 않는 시트 `aria-hidden`+`inert`, 호버·포커스 시 자동 넘김 정지, reduced-motion이면 자동 넘김 없음. `data-loop` 없으면 끝에서 버튼 `disabled`.

### code — 라벨 프린터 띠 / 모눈 코드 메모
```html
<code class="code">PD-ST-0412</code>  <code class="code code--mint">SB-30417</code>
<div class="codeblock">
  <div class="codeblock__head"><span class="codeblock__name">sticker.html <small>다이컷 스티커 버튼</small></span>
    <button class="codeblock__copy" type="button" data-copy><svg class="ico" …복사…/><span data-copy-label>복사</span></button></div>
  <pre><code><span class="ln"><span class="tk-com">&lt;!-- 1월호 신청 --&gt;</span></span><span class="ln ln--mark">…</span></code></pre>
</div>
```
한 줄 = `<span class="ln">`(줄번호 자동), 강조 줄 `ln--mark`. 토큰 색 `.tk-key .tk-str .tk-num .tk-com .tk-prop`. `data-copy="#id"`로 다른 요소 복사 가능. 복사 후 2초간 민트 "복사했어요".

### command — ⌘K 스티커 검색 시트
4-5절 스니펫이 정본. 옵션 `.cmd__opt` + `.cmd__opt-ico(--strawberry/--lemon/--sky/--lavender/--peach)` + `.cmd__opt-text`(b + small) + `.cmd__opt-meta`. 그룹 `.cmd__group` + `.cmd__group-label`. 비활성 옵션 `aria-disabled="true"`. JS: 입력 필터링, ↑↓ `aria-selected`(형광펜), ↵ 실행, 결과 없으면 `.cmd__empty`. **index의 열린 상태 견본**은 `class="cmd cmd--static"`(scrim 없이 흐름 속에 놓임, `hidden` 없이).

### drawer — 속지 한 장이 밀려 나옴
```html
<div class="drawer" id="order-drawer" hidden>
  <div class="drawer__scrim"></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="dr-t">
    <span class="drawer__handle" aria-hidden="true"></span>
    <div class="drawer__head">
      <div><p class="drawer__kicker">PDK-261120-0144</p><h2 class="drawer__title" id="dr-t">진서아님 주문</h2></div>
      <button class="modal__close" type="button" data-close aria-label="닫기">…닫기 아이콘…</button>
    </div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot"><button class="btn btn--ghost btn--sm" data-close>닫기</button><button class="btn btn--primary btn--sm">출고 처리</button></div>
  </aside>
</div>
<button class="btn btn--secondary" data-open="order-drawer">주문 상세</button>
```
왼쪽에서 = `drawer--left`. 정적 견본 = `drawer--static`(높이 460, 패널이 오른쪽에 붙은 모습). 포커스 트랩·Esc·바깥 클릭·스크롤 잠금·트리거로 포커스 복귀는 JS.

### empty — 빈 칸 + 시무룩 폭닥이
```html
<div class="empty">
  <div class="empty__art"><span class="empty__tear empty__tear--a"></span><span class="empty__tear empty__tear--b"></span>
    <svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk-sad"/></svg></div>
  <h3 class="empty__title">아직 붙인 스티커가 없어요</h3>
  <p class="empty__text">마음에 드는 시트를 찾아 첫 장을 꾸며 봐요</p>
  <div class="empty__actions"><a class="btn btn--primary" href="product.html">스티커 보러 가기</a></div>
</div>
```
작게 `empty--sm`. 버튼은 1개(404만 2개).

### form — 주문서 메모지
```html
<form class="form" data-validate data-demo data-success="배송지를 저장했어요">
  <div class="form__row">
    <div class="field"><label class="field__label" for="nm">받는 분 <span class="field__req">꼭!</span></label>
      <input class="input" id="nm" required autocomplete="name" value="이수아"></div>
    <div class="field"><label class="field__label" for="ph">연락처</label>
      <input class="input" id="ph" type="tel" required pattern="01[0-9]-[0-9]{3,4}-[0-9]{4}" data-error="앗, 번호가 한 칸 모자라요">
      <p class="field__hint">하이픈까지 적어 주세요</p></div>
  </div>
  <div class="field"><label class="field__label" for="pl">플랜</label><div class="select"><select id="pl"><option>두근 봉투 · ₩12,900</option></select></div></div>
  <div class="field"><label class="field__label" for="memo">요청 메모</label><textarea class="textarea" id="memo"></textarea></div>
  <div class="input-group"><span class="input-group__affix">₩</span><input class="input" inputmode="numeric" aria-label="금액"></div>

  <label class="check"><input type="checkbox" class="check__input" checked><span class="check__box" aria-hidden="true"></span><span>작가 엽서 함께 받기</span></label>
  <!-- 라디오 점(.radio__dot)은 input 바로 옆이 아니어도 된다: 감싼 label 이 :has(:checked) 로 상태를 그린다(카드형 라디오) -->
  <div class="choice-list" role="radiogroup" aria-label="속지">
    <label class="radio"><input type="radio" name="paper" class="radio__input" checked><span class="radio__dot" aria-hidden="true"></span><span>모눈 속지</span></label>
  </div>
  <label class="switch"><input type="checkbox" role="switch" class="switch__input">
    <span class="switch__wrap" aria-hidden="true"><span class="switch__track"></span><span class="switch__knob"></span></span>
    <span class="switch__text">밤 다꾸 모드<small>밤 11시 이후 자동</small></span></label>
  <div class="field"><label class="field__label" for="bud">한 달 예산</label>
    <input type="range" class="range" id="bud" min="5000" max="30000" step="500" value="12900">
    <output class="range-out" data-range-out="bud" data-format="₩{v}"></output></div>

  <div class="chip-group" data-max="3" role="group" aria-label="좋아하는 테이프 무늬">   <!-- 하나만: data-single -->
    <button type="button" class="chip" aria-pressed="true"><span class="swatch tape--gingham"></span>깅엄</button>
    <button type="button" class="chip" aria-pressed="false">도트</button>
  </div>
  <div class="seg" role="group" aria-label="결제 주기"><button type="button" class="seg__btn" aria-pressed="true" value="month">매달</button><button type="button" class="seg__btn" aria-pressed="false" value="year">1년 <span class="badge badge--cherry">2회 무료</span></button></div>
  <div class="qty"><button type="button" class="qty__btn" data-step="-1" aria-label="하나 빼기" disabled>…</button><input class="qty__val" type="number" value="1" min="1" max="9" aria-label="수량"><button type="button" class="qty__btn" data-step="1" aria-label="하나 더">…</button></div>

  <div class="form__actions"><button class="btn btn--primary" type="submit">저장하기</button><button class="btn btn--ghost" type="button">취소</button></div>
</form>
```
- 상태: focus(형광펜 + 체리 밑줄) · `aria-invalid="true"`(오류 밑줄 + 물결) + `.field__error`(빨간 손글씨) · `disabled`(점선) · `readonly`(점선 점) · `.field.is-ok`.
- `data-validate`: 제출 시 required/pattern/type 검사 → `aria-invalid` + `.field__error` 자동 생성(문구 `data-error` 우선, 기본 "앗, 이 칸이 비었어요"). `data-demo`면 실제 제출 대신 로딩 → `data-success` 토스트.
- 세그먼트 값에 따라 보이기: 공통 조상에 `data-seg-scope`, 대상에 `data-seg-show="year"`.
- 검색창은 `.search` > `.search__input`(4-2절).

### kanban — 포스트잇 보드
```html
<div class="kanban" data-kanban aria-label="신상 스티커 제작 보드">
  <section class="kanban__col" aria-labelledby="k1">
    <header class="kanban__head"><h3 class="kanban__title" id="k1">아이디어</h3><span class="kanban__count">2</span></header>
    <div class="kanban__list">
      <article class="postit" tabindex="0">
        <span class="postit__id">MK-151</span>
        <h4 class="postit__title">떡국 스티커</h4>
        <p class="postit__note">1월호 동봉 후보</p>
        <div class="postit__foot"><span class="postit__due">11/25 수</span><span class="avatar avatar--lavender" aria-label="문채이">채</span></div>
      </article>
    </div>
    <button class="kanban__add" type="button">+ 포스트잇 붙이기</button>
  </section>
  …열 5개: 아이디어 → 도안 → 샘플 인쇄 → 본 인쇄 → 입고…
</div>
```
열 색은 순서대로 레몬·딸기·하늘·민트·라벤더(포스트잇도 그 열 색). 개별 색 `postit--strawberry` 등. 지연 마감 `postit__due--late`. 드래그 들린 정적 견본 `.is-lifted`. JS: 포인터 드래그(+4° 들림 → 놓으면 붙이기+별 버스트), 키보드 Space 집기 → ←→ 열 이동 / ↑↓ 순서 → Space 놓기 · Esc 취소, 개수 자동 갱신, 낭독 영역 자동 생성. 넘치면 오른쪽 페이드.

### list — 체크리스트 / 행 리스트
```html
<ul class="todo">
  <li class="todo__item"><label class="check"><input type="checkbox" class="check__input" checked><span class="check__box" aria-hidden="true"></span><span class="todo__text">QA-20931 진서아님 배송지 변경</span></label><span class="todo__meta">오하린</span></li>
</ul>

<ul class="list" data-select-list>
  <li class="list__item is-unread">
    <a class="list__row" href="inbox.html" aria-current="true">
      <span class="stamp"><svg class="ico" …카톡…/></span>              <!-- 우표 = 채널: stamp(레몬 카톡) --sky(메일) --strawberry(인스타) -->
      <span class="list__main"><span class="list__title">진서아 · 1월호 배송지 변경해 주세요</span><span class="list__sub">QA-20931 · …</span></span>
      <span class="list__side"><span class="list__time">15:12</span><span class="badge badge--err">미답</span></span>
    </a>
  </li>
</ul>
<dl class="kv"><dt>상품</dt><dd>다꾸 입문 키트</dd><dt>금액</dt><dd>₩24,000</dd></dl>
```
완료 = 체리 55% · 1px 손글씨 물결 취소선(체크 시 자동, 글자는 비쳐 읽힌다). 켜고 끄는 목록(알림 설정 등)은 `todo todo--toggle` — 체크 = "켜짐"이라 취소선·흐림 없음. `data-select-list`면 행 클릭 시 `aria-current` 이동 + 읽음 처리.

### marquee — 공지 마스킹테이프 (상시 움직임 1번)
```html
<div class="marquee-wrap">
  <div class="marquee" role="region" aria-label="공지">           <!-- 줄무늬 레몬: marquee--stripe -->
    <div class="marquee__track"><div class="marquee__group">
      <span class="marquee__item">1월호 신청 11/30(월) 23:59 마감</span>
      <span class="marquee__item">₩20,000 이상 무료배송</span>
      <span class="marquee__item">12/5–12/13 더현대 서울 팝업</span>
    </div></div>
    <button class="marquee__toggle" type="button" aria-label="공지 테이프 멈추기"><svg class="ico" …정지…/></button>
  </div>
</div>
```
JS가 그룹을 복제(aria-hidden)해 무한 흐름. 호버·포커스·정지 버튼으로 멈춤. reduced-motion이면 정지된 테이프 한 줄.

### menu — 작은 메모지 드롭다운
```html
<div class="menu-wrap">
  <button class="btn btn--secondary btn--sm" type="button" data-menu="order-menu">주문 관리</button>
  <div class="menu menu--end" id="order-menu">
    <p class="menu__label">PDK-261120-0144</p>
    <button class="menu__item" type="button" data-toast="출고 처리했어요"><span class="menu__ico"><svg class="ico" …택배…/></span><span class="menu__text">출고 처리</span><span class="menu__kbd">⌘ D</span></button>
    <button class="menu__item" type="button" aria-disabled="true"><span class="menu__ico menu__ico--lemon">…</span><span class="menu__text">송장 복사 (출고 전)</span></button>
    <button class="menu__item" type="button" role="menuitemcheckbox" aria-checked="true">…</button>
    <hr class="menu__sep">
    <button class="menu__item menu__item--danger" type="button" data-toast="주문을 취소했어요"><span class="menu__ico">…휴지통…</span><span class="menu__text">주문 취소</span></button>
  </div>
</div>
```
`menu--end`(오른쪽 정렬) `menu--up`(위로). JS: role·tabindex 부여, ↑↓ Home End, Esc/바깥 클릭 닫기 + 트리거로 포커스 복귀, 트리거에서 ↓로 열기. 정적 견본 `menu--static`.

### modal — 포스트잇 떨어뜨리기
```html
<div class="modal" id="mb-modal" hidden>
  <div class="modal__scrim"></div>
  <div class="modal__note" role="dialog" aria-modal="true" aria-labelledby="mb-t">
    <span class="modal__tape modal__tape--l" aria-hidden="true"></span><span class="modal__tape modal__tape--r" aria-hidden="true"></span>
    <button class="modal__close" type="button" data-close aria-label="닫기">…</button>
    <p class="modal__kicker">마감까지 D-10</p>
    <h2 class="modal__title" id="mb-t">1월호 신청할까요?</h2>
    <div class="modal__body"><p>두근 봉투 · 매달 ₩12,900 · 배송비 무료.</p></div>
    <div class="modal__actions"><button class="btn btn--ghost" type="button" data-close>조금 더 볼게요</button><button class="btn btn--primary" type="button">신청하기</button></div>
  </div>
</div>
<button class="btn btn--primary" type="button" data-open="mb-modal">1월호 신청</button>
```
`modal__note--lg` `--lined` `--strawberry`. 정적 견본 = 바깥 `div`에 `modal--static`(hidden·scrim 없이). 닫힐 땐 떼어져 올라감.

### motion — 붙이기 · 떼기 · 눌림 · 버스트
```html
<div class="sheet sheet--lemon"><div class="motion-demo">
  <div class="motion-demo__cell"><button class="motion-demo__target sticker sticker--strawberry" type="button" data-motion="stick">톡</button><span class="motion-demo__name">붙이기</span><span class="motion-demo__spec">320ms · stick</span></div>
  … data-motion="peel" / "press" / "burst" / "stamp" …
</div></div>
```
상태 클래스: `.is-sticking` `.is-peeling` `.is-pressing` `.is-stamped`, 순차 등장 부모 `.stick-in`(60ms 간격). `data-motion-target="#id"`로 다른 요소에 적용. JS API `Pokdak.stick(el)` `Pokdak.burst(el)`. reduced-motion이면 모두 즉시.

### navbar — 4-1 · 4-2 · 4-3절 셸이 정본
워드마크 `.wordmark`, 테마 토글 `.theme-toggle[data-theme-toggle]`(해↔달, 밤에는 라벤더 + 글로우), ⌘K 트리거 `.cmd-trigger`.

### pagination — 페이지 탭 스티커
```html
<nav class="pager" aria-label="리뷰 쪽" data-pager>          <!-- data-pager: 버튼일 때 데모 이동 -->
  <ul class="pager__list">
    <li><a class="pager__step" aria-disabled="true">← <span>앞 쪽</span></a></li>
    <li><a class="pager__page" href="product.html" aria-current="page">1</a></li>
    <li><a class="pager__page" href="product.html">2</a></li>
    <li class="pager__hide-sm"><a class="pager__page" href="product.html">3</a></li>
    <li><span class="pager__gap">…</span></li>
    <li><a class="pager__page" href="product.html">161</a></li>
    <li><a class="pager__step" href="product.html"><span>다음 쪽</span> →</a></li>
  </ul>
</nav>
<p class="pager__info">리뷰 1,287개 · 한 쪽 8개</p>
```

### popover — 꼬리 달린 말풍선 메모
```html
<div class="pop-wrap">
  <button class="btn btn--secondary btn--sm" type="button" data-popover="seat5">5번 자리</button>
  <div class="popover popover--start" id="seat5" role="dialog" aria-label="다꾸 테이블 5번 자리">
    <p class="popover__title">다꾸 테이블 5번 자리</p>
    <div class="popover__body"><p>15:00–17:00 · 차하율님 · TB-1120-05</p></div>
    <div class="popover__foot"><button class="btn btn--mint btn--sm" type="button">연장</button></div>
  </div>
</div>
```
위치 `--top` `--start` `--end`. 바깥 클릭·Esc 닫기. 정적 견본 `popover--static`.

### progress — 테이프가 늘어나는 바 · 해빗 트래커
```html
<div class="progress">
  <div class="progress__head"><span class="progress__label">1월호 신청</span><span class="progress__value"><span class="num">2,418</span> / <span class="num">3,000</span>명</span></div>
  <div class="progress__bar" role="progressbar" aria-label="1월호 신청" aria-valuemin="0" aria-valuemax="3000" aria-valuenow="2418" style="--val:80.6%"><span class="progress__tape"></span></div>
  <p class="progress__note">80.6% · 마감까지 D-10 · 오늘 신규 87명</p>
</div>
<div class="ring" role="img" aria-label="출고 77%" style="--val:77"><span class="ring__val">77%</span></div>
<div class="habit">…요일 7 .habit__day + 원 7 .habit__dot(.is-on / .is-half / .is-today)…</div>
<div class="tapebars">
  <div class="tapebars__row"><span class="tapebars__key">월</span><span class="tapebars__track"><span class="progress__tape" style="--val:58%"></span></span><span class="tapebars__val">98</span></div>
  <div class="tapebars__row is-today">…금 146…</div>
  <div class="tapebars__row is-empty"><span class="tapebars__key">토</span><span class="tapebars__track"></span><span class="tapebars__val">–</span></div>
</div>
```
바 무늬 기본 깅엄, `--mint`(모눈) `--lemon`(줄무늬) `--lavender`(도트), 얇게 `--sm`. 상태 `data-state="done|error|loading"`. 목표선 `<span class="progress__goal" style="--goal:100%"></span>`. 링 색 `ring--strawberry/--lemon/--sky/--lavender`, 크기 `--ring:64px`. 이번 주 일별 주문 막대는 팩트 시트 값(월 98 · 화 121 · 수 167 · 목 139 · 금 146, 최대 167 = 100%). JS: `Pokdak.setProgress(el, pct)`.

### sidebar — 인덱스 탭 레일
4-1절 `nav.rail`이 정본. 탭 색은 순서대로 딸기·민트·레몬·하늘·라벤더·복숭아, 현재 탭 `aria-current="page"`는 20px 더 길다. 숫자 `.rail__count`. 비활성 `aria-disabled="true"`. 719px 이하 하단 탭바(최대 5개).

### skeleton — 아직 안 붙인 스티커 자리
```html
<div class="skel-sheet" aria-busy="true" aria-label="불러오는 중">
  <div class="skel-row"><span class="skel skel--circle"></span><div class="skel-col"><span class="skel skel--text"></span><span class="skel skel--text"></span></div></div>
  <span class="skel skel--memo"></span>
  <div class="skel-row"><span class="skel skel--sticker" style="--sk:80px"></span><span class="skel skel--btn"></span></div>
</div>
```
`--text --title --circle(--sk) --sticker(--sk) --memo --btn`.

### spinner — 데굴 구르는 폭닥이
```html
<div class="spinner" role="status"><span class="spinner__roll"><svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk-sleepy"/></svg></span><span class="spinner__text">봉투 접는 중…</span></div>
<span class="spinner--star" role="status" aria-label="불러오는 중"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#pk-star"/></svg></span>
```
크기 `spinner--sm`(44) 기본(72) `spinner--lg`(112), 별은 `style="--sp-size:20px"`.

### steps — 도장 칸
```html
<ol class="steps" style="--steps:4" aria-label="우편함 1월호 제작">
  <li class="steps__item is-done"><span class="steps__stamp"><svg class="pk" viewBox="0 0 200 170" aria-hidden="true"><use href="#pk"/></svg></span><span class="steps__title">도안 확정</span><span class="steps__sub">11/9 문채이</span></li>
  <li class="steps__item" aria-current="step"><span class="steps__stamp"><svg class="pk" …/></span><span class="steps__title">본 인쇄</span><span class="steps__sub">지금 여기!</span></li>
  <li class="steps__item"><span class="steps__stamp"><svg class="pk" …/></span><span class="steps__title">봉투 포장</span><span class="steps__sub">12/1~12/3</span></li>
</ol>
```
완료 = 체리 잉크 폭닥이 도장, 현재 = 점선 원 흔들림 + 손글씨, 다음 = 번호. 막 완료 `is-done is-new`(찍힘 모션), 오류 `is-error`, 세로 `steps--vertical`. 560px 이하 부제는 현재 단계만.

### table — 장부 속지
```html
<div class="ledger">
  <span class="tape tape--grid tape--pin tape--top" aria-hidden="true"></span>
  <div class="ledger__head"><h3 class="ledger__title">오늘 주문 장부</h3><span class="ledger__meta">11/20(금) 15:40 기준 · 146건</span></div>
  <div class="ledger__scroll">
    <table class="table">
      <caption class="vh">오늘 주문 146건 중 최근 12건</caption>
      <thead><tr>
        <th><label class="check"><input type="checkbox" class="check__input" data-select-all aria-label="모두 선택"><span class="check__box" aria-hidden="true"></span></label></th>
        <th aria-sort="descending"><button class="table__sort" type="button">주문 번호</button></th>
        <th>받는 분</th><th>상품</th>
        <th aria-sort="none" class="t-num"><button class="table__sort" type="button">금액</button></th>
        <th>상태</th>
      </tr></thead>
      <tbody>
        <tr><td><label class="check"><input type="checkbox" class="check__input" aria-label="PDK-261120-0146 선택"><span class="check__box" aria-hidden="true"></span></label></td>
          <td class="t-id">PDK-261120-0146</td><td>윤봄</td><td>폭닥이 리무버블 스티커 시트 외 2</td>
          <td class="t-num" data-sort="13400">₩13,400</td><td><span class="badge badge--ok badge--dot">출고 완료</span></td></tr>
      </tbody>
    </table>
  </div>
  <div class="ledger__foot">…pager…</div>
</div>
```
셀 유틸 `.t-id .t-num .t-muted .t-hand .t-who`. `.t-num`의 숫자 글꼴은 본문 칸(tbody)에만 걸리고, 헤더 `<th class="t-num">`은 테이프 띠 글꼴을 유지한 채 오른쪽 정렬만 한다. `.t-who`는 `td`에 붙여도 표 칸으로 남는다(아바타는 인라인). 칸 안을 flex로 묶어야 하면 `td` 말고 안쪽 `span`에 준다. 행 상태 `aria-selected="true"`(체크 시 자동) `.is-alert` `.is-disabled`. 촘촘 `table--dense`. 좁은 화면: 기본은 래퍼 안 가로 스크롤(최소 폭 = 내용 폭, 넓은 표만 장면 CSS에서 `--table-min: 680px` 지정) + 오른쪽 페이드 / `table--stack` + 각 `td`에 `data-label="금액"` 붙이면 640px 이하 카드형 행(`.t-span` 전폭, 강조색은 행 한 장에).

### tabs — 다이어리 인덱스 탭
```html
<div class="tabs">                                   <!-- 패널 없는 필터 줄: tabs--bare -->
  <div class="tabs__list" role="tablist" aria-label="오늘 보기">
    <button class="tabs__tab" role="tab" id="t-ord" aria-controls="p-ord" aria-selected="true" type="button">주문 <span class="badge badge--count">146</span></button>
    <button class="tabs__tab" role="tab" id="t-sub" aria-controls="p-sub" aria-selected="false" type="button">구독</button>
    <button class="tabs__tab" role="tab" id="t-tbl" aria-controls="p-tbl" aria-selected="false" type="button">다꾸 테이블</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="p-ord" aria-labelledby="t-ord">…</div>
  <div class="tabs__panel" role="tabpanel" id="p-sub" aria-labelledby="t-sub" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="p-tbl" aria-labelledby="t-tbl" hidden>…</div>
</div>
```
JS: 클릭/←→ Home End, roving tabindex, 패널 넘김 모션, 넘치면 `.has-more`(오른쪽 페이드). 비활성 탭 `disabled`.

### timeline — 하루 타임테이블 / 기록형
```html
<div class="tt" style="--hours:8" aria-label="11/20 매장 일정">
  <div class="tt__hours"><span class="tt__hour">12:00</span> … <span class="tt__hour">19:00</span></div>
  <div class="tt__lane">
    <div class="tt__ev tt__ev--gingham is-done" style="--start:0;--dur:1.5"><span class="tt__title">오픈 · 입고 정리</span><span class="tt__time">12:00–13:30</span><span class="tt__who">정우람</span></div>
    <div class="tt__ev tt__ev--stripe" style="--start:2;--dur:1;--lanes:2"><span class="tt__title">택배 마감</span><span class="tt__time">14:00</span></div>
    <div class="tt__ev tt__ev--dot" style="--start:2;--dur:2;--lanes:2;--lane:1">…</div>
    <div class="tt__now" style="--at:3.67"><span class="tt__now-label">지금 15:40</span></div>
  </div>
</div>

<ol class="timeline">
  <li class="timeline__item is-done"><span class="timeline__dot"></span><p class="timeline__date">2023.04</p><p class="timeline__title">솜사탕공방 입점</p><p class="timeline__text">첫 상품 3종으로 시작</p></li>
  <li class="timeline__item is-now">…</li><li class="timeline__item is-next">…</li>
</ol>
```
`--start`/`--dur`/`--at`은 첫 시각(12:00)부터의 시간(소수). 무늬 기본 민트 모눈, `--gingham --stripe --dot --sky`, 30분짜리 `tt__ev--short`. 클릭 가능하면 `<button class="tt__ev">`.

### toast — 툭 붙는 스티커 (4초 뒤 떼어짐)
JS로 띄운다: `Pokdak.toast({ title: '장바구니에 붙였어요', text: '폭닥이 리무버블 스티커 시트 · ₩3,500', tone: 'ok' })` — tone `ok|err|warn|info|''(레몬)`, `duration`(ms, 0=고정), `action`(손글씨 링크 문구).
마크업 트리거: `<button class="btn" data-toast="장바구니에 붙였어요" data-toast-text="₩3,500" data-toast-tone="ok">`.
정적 견본:
```html
<div class="toast toast--ok toast--static" role="status">
  <span class="toast__icon"><svg class="ico" …체크…/></span>
  <div><p class="toast__title">장바구니에 붙였어요</p></div>
  <button class="toast__close" type="button" aria-label="알림 떼기">…</button>
  <p class="toast__text">폭닥이 리무버블 스티커 시트 · ₩3,500</p>
</div>
```
호버·포커스 중엔 안 떼어짐. 오른쪽 아래(모바일은 하단 전폭, 탭바 위).

### tooltip — 라벨 테이프 조각
```html
<span class="tip">
  <button class="btn btn--secondary btn--icon btn--sm" type="button" aria-label="밤 다꾸 모드" aria-describedby="tt-night">…달…</button>
  <span class="tooltip" role="tooltip" id="tt-night">밤 11시엔 자동으로 켜져요</span>    <!-- 아래로: tooltip--bottom -->
</span>
```
호버·포커스 150ms 뒤 표시, Esc로 숨김(JS). 정적 견본 `tooltip--static` 또는 `.is-open`.

---

## 6. app.js 계약 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮↔밤, `pokdak-theme` 저장, `aria-pressed`, 별 버스트 |
| `[data-open="id"]` / `[data-close]` | 모달·드로어·커맨드 열기/닫기 (포커스 트랩·Esc·스크롤 잠금·포커스 복귀) |
| ⌘K / Ctrl+K | `.cmd[data-cmd-default]` 토글 |
| `[data-menu="id"]` `[data-popover="id"]` | 메뉴·팝오버 (바깥 클릭·Esc) |
| `.tabs` `[data-accordion]` `[data-carousel]` `[data-calendar]` `[data-kanban]` | 자동 초기화 |
| `table.table` | `.table__sort` 정렬(`data-sort` 우선), 체크박스 행 선택·전체 선택(`data-select-all`), 가로 페이드 |
| `form[data-validate]` (`data-demo`, `data-success`) | 검증 · 데모 제출 토스트 |
| `.range` + `output[data-range-out]` | 테이프 길이 `--val`·값 표시 |
| `.chip[aria-pressed]` (`.chip-group[data-single|data-max]`) · `.seg__btn` · `.qty__btn` | 고르기·세그먼트·수량 |
| `.marquee` | 그룹 복제 · 정지 버튼 |
| `[data-copy]` · `[data-pager]` · `[data-select-list]` · `.alert__close` · `[data-loading]` · `[data-motion]` · `[data-toast]` | 복사 · 쪽 이동 · 행 선택 · 알림 떼기 · 로딩 · 모션 시연 · 토스트 |
| `window.Pokdak` | `toast() burst() stick() setTheme() open(id) close(id) setProgress(el,pct) init(scope)` |

동적으로 넣은 마크업은 `Pokdak.init(scope)`로 초기화한다.

### 폼의 `[data-dirty]`
`form[data-validate]` 안에서 값이 바뀌면(input · change) app.js가 폼에 `data-dirty`를 붙이고, `reset`이나 데모 저장 성공 뒤에 뗀다. settings의 저장 띠(`.set-save`)는 평소 폼 끝 제자리에 있다가 `[data-dirty]`일 때만 쪽 아래에 sticky로 따라붙는다(붙이기 모션). 고정 띠가 아무것도 안 바꾼 첫 화면의 카드를 덮지 않게 하기 위함이다. onboarding의 단계 이동 줄은 데스크톱에선 펼침면 아래 제자리, 719px 이하에서만 화면 아래 고정이다.

### 폰(≤480) 압축 규칙 — index
견본첩을 끝없이 내리지 않고 "옆으로 넘기는 장"으로 줄인다(목표 높이 15,000px 이하). 가로 넘김 띠 = `display:flex; overflow-x:auto; scroll-snap-type:x proximity` + 오른쪽 36px 페이드 마스크(넘김 힌트). 적용: 상태 동그라미 · 테이프 바탕 · 이름표 · 버튼/알림/⌘K 묶음(`.collage__col--a`) · 열린 상태 견본(`.collage__col--c`) · 주문서 두 장(`.order__pages > .order__page`) · 트래커(`.trk__swipe`) · 아직 안 붙인 칸 · 빨랫줄 · 스티커 팩/메모/셸(`.pg__grid`) · 본문/코드. `.order__pages` `.order__page` `.trk__swipe`는 넓은 화면에서 `display: contents`라 레이아웃에 영향이 없다. 스티커 시트는 3열 소형(이름 + hex), 버튼 상태표는 hover 열을 뺀 3열이다.
