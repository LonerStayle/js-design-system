# COMPONENTS — theme-27 솔개에어 SOLGAE (SF HUD v2)

> 이 문서는 index.html과 pages/*.html을 만드는 작업자가 **그대로 복사해서 쓰는** 마크업 사전이다.
> 기준 문서는 `DIRECTION.md`이고, 값(날짜·편명·인물·금액)은 DIRECTION의 **팩트 시트**만 쓴다.
> 컴포넌트 CSS는 이미 완성되어 있다. 장면 전용 배치는 `index.css` 또는 `pages/<name>.css`에만 쓰고, semantic 토큰만 참조한다.

---

## 0. 읽기 전에 — 이 테마의 다섯 가지 규칙

1. **색 = 규약.** 흰 잉크(눈금·라벨) · 초록 `ok`(정상·완료·현재 작동 모드) · 시안 `select`(조종사가 고른 값·주 조작·포커스) · 마젠타 `target`(목표·현재 위치·활성 탭·선택일) · 앰버 `caution`(주의) · 빨강 `warning`(경고·파괴적 동작). 장식으로 색을 칠하지 않는다.
2. **반경 0, 그림자 0.** 원은 원형 계기·레티클·상태 점에만. 깊이는 `--bg → --surface → --bezel → --pressed` 면 단계와 선으로만.
3. **DU 사이 간격은 6px(`--sp-gap`) 또는 24px(`--sp-group`) 둘뿐.** `.grid`(12단·거터 6px), `.stack`, `.stack--group`을 쓴다.
4. **한글은 모노·넓은 자간에 넣지 않는다.** `.t-code`(B612 Mono, 자간 0.08em, 대문자)에는 라틴 코드만(`BATT 2 TEMP`, `ALT HLD`). 한글 라벨은 자간 0, 위계는 굵기와 `--ink-muted`로.
5. **값을 가진 것은 눈금 위에, 현재 값은 리드아웃 창(`.rdo`) 안에.** 상태는 꺼진 램프(선만)와 켜진 램프(면) 두 가지로 말한다. 색만으로 구분하지 않고 항상 글자(한글 상태 또는 라틴 코드)를 함께 둔다.

금지: `href="#"`, 인라인 `onclick`, 인라인 `grid-template-columns`, SVG presentation attribute 안의 `var()`(`stroke="var(--x)"` 금지 → `style="stroke:var(--x)"` 또는 `currentColor`), 이모지 아이콘, 이미지 파일, 외부 JS.

---

## 1. `<head>` — 모든 HTML 공통 (복사)

index.html은 `styles.css` · `app.js`, pages는 `../styles.css` · `../app.js`. 장면 CSS는 index는 `index.css`, 페이지는 `<name>.css`(pages 폴더 안) 하나만.

```html
<!doctype html>
<html lang="ko" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>운항관제 — 솔개에어 SOLGAE</title>
<meta name="description" content="솔개에어 김포 OCC 야간 당직 상황판 — 2026년 11월 6일(금) 19:42">
<script>(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),s=null;try{s=localStorage.getItem('solgae-theme')}catch(e){}var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.setAttribute('data-theme',t);d.classList.add('js');}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=B612:wght@400;700&family=B612+Mono:wght@400;700&family=Chakra+Petch:wght@500;600;700&family=Gothic+A1:wght@400;500;700&family=Orbit&display=swap">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="dashboard.css">
<script src="../app.js" defer></script>
</head>
```

- 인라인 스크립트는 FOUC 방지용이다. 우선순위: URL `?theme=dark|light` → localStorage `solgae-theme` → `prefers-color-scheme`. 동시에 `html.js`를 붙여 셀프테스트 점등(`[data-boot]`)이 첫 프레임에 깜박이지 않게 한다.
- `<title>` 형식: `<페이지 이름> — 솔개에어 SOLGAE`. index는 `SG-4 솔개 조종사 운용 교범 — 솔개에어 SOLGAE`.

---

## 2. 공통 셸 — 복사해서 쓰는 스니펫

모든 페이지의 `<body>` 구조는 아래 순서로 고정한다. **푸터(상태 스트립)·글레어실드·메뉴 드로어·스크래치패드는 페이지마다 다르게 만들지 않는다.** 바꾸는 곳은 표시된 `aria-current`와 `.glare__mode` 두 군데뿐이다.

```
<body>
  [2-1 글레어실드 + 가장자리 눈금]   ← 페이지별: 현재 FMA 칸 aria-current, .glare__mode 코드
  <main id="main" …>장면</main>
  [2-3 상태 스트립(footer)]         ← 페이지별: 현재 소프트키 aria-current
  [2-4 메뉴 드로어]                 ← 페이지별: 현재 링크 aria-current
  [2-5 FMS 스크래치패드(⌘K)]
</body>
```

### 페이지별 현재 위치 표

| 파일 | FMA 칸(aria-current) | `.glare__mode` 코드 / 한글 | 레일(2-2) |
|---|---|---|---|
| index.html | POH 교범 | `POH` 교범 | 없음 |
| pages/dashboard.html | OCC 운항관제 | `OCC` 운항관제 | OCC 레일 — OCC |
| pages/inbox.html | MSG 교신함 | `MSG` 교신함 | OCC 레일 — MSG |
| pages/kanban.html | MX 정비 | `MX` 정비 | OCC 레일 — MX |
| pages/product.html | TKT 탑승권 | `TKT` 탑승권 | 없음 |
| pages/pricing.html | FARE 요금 | `FARE` 요금 | 없음 |
| pages/profile.html | CREW 기장 | `CREW` 기장 | 기장 레일 — LOG |
| pages/settings.html | SET 설정 | `SET` 설정 | 기장 레일 — SET |
| pages/onboarding.html | (FMA에 없음 — aria-current 없음) | `TRN` 전환 교육 | 기장 레일 — TRN |
| pages/404.html | (aria-current 없음) | `LOST` 신호 소실 — **`glare__mode glare__mode--warn`**(빨강 = 고장 규약) | 없음 |

FMA는 8칸(교범·운항관제·교신함·정비·탑승권·요금·기장·설정)이다. 전환 교육과 신호 소실은 상태 스트립 소프트키와 메뉴 드로어로 들어간다.

### 2-1. 글레어실드(navbar) — **index.html 경로**

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="edge" aria-hidden="true"></div>
<header class="glare">
  <button type="button" class="mlamp mlamp--warn" aria-label="마스터 경고 — 미확인 없음"><span>MASTER</span><span>WARN</span></button>
  <a class="glare__brand" href="index.html" aria-label="솔개에어 SOLGAE — 조종사 운용 교범">
    <svg class="glare__mark" viewBox="0 0 26 16" aria-hidden="true"><circle cx="13" cy="9" r="4"/><path d="M1 9h8M17 9h8M13 5V1"/></svg>
    <span class="glare__word">SOLGAE</span>
  </a>
  <nav class="glare__fma" aria-label="주 메뉴">
    <ul>
      <li><a class="fma" href="index.html" aria-current="page"><span class="fma__code">POH</span><span class="fma__ko">교범</span></a></li>
      <li><a class="fma" href="pages/dashboard.html"><span class="fma__code">OCC</span><span class="fma__ko">운항관제</span></a></li>
      <li><a class="fma" href="pages/inbox.html"><span class="fma__code">MSG</span><span class="fma__ko">교신함</span></a></li>
      <li><a class="fma" href="pages/kanban.html"><span class="fma__code">MX</span><span class="fma__ko">정비</span></a></li>
      <li><a class="fma" href="pages/product.html"><span class="fma__code">TKT</span><span class="fma__ko">탑승권</span></a></li>
      <li><a class="fma" href="pages/pricing.html"><span class="fma__code">FARE</span><span class="fma__ko">요금</span></a></li>
      <li><a class="fma" href="pages/profile.html"><span class="fma__code">CREW</span><span class="fma__ko">기장</span></a></li>
      <li><a class="fma" href="pages/settings.html"><span class="fma__code">SET</span><span class="fma__ko">설정</span></a></li>
    </ul>
  </nav>
  <span class="glare__mode" aria-hidden="true"><span class="fma__code">POH</span><span class="fma__ko">교범</span></span>
  <div class="glare__right">
    <span class="glare__clock"><span class="glare__utc" data-clock="utc">061042Z</span><span class="glare__kst"><span data-clock="kst">19:42:00</span> KST</span></span>
    <button type="button" class="skey skey--icon glare__cmd" data-command-open aria-label="FMS 스크래치패드 열기 (⌘K)"><span class="t-code">⌘K</span></button>
    <button type="button" class="skey skey--icon" data-theme-toggle aria-pressed="true" aria-label="주간 화면으로 전환 (현재 야간)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" style="fill:currentColor"/></svg></button>
    <button type="button" class="skey skey--icon glare__menu" data-drawer-open="nav-drawer" aria-controls="nav-drawer" aria-expanded="false" aria-label="페이지 메뉴 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    <button type="button" class="mlamp mlamp--caut" data-lit="true" aria-label="마스터 주의 — 미확인 메시지 있음"><span>MASTER</span><span>CAUT</span></button>
  </div>
</header>
```

### 2-1'. 글레어실드 — **pages/ 경로** (예: dashboard.html)

index 스니펫과 같고 **경로와 현재 표시만** 다르다. 차이 줄만 보이면 실수하므로 전체를 둔다.

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="edge" aria-hidden="true"></div>
<header class="glare">
  <button type="button" class="mlamp mlamp--warn" aria-label="마스터 경고 — 미확인 없음"><span>MASTER</span><span>WARN</span></button>
  <a class="glare__brand" href="../index.html" aria-label="솔개에어 SOLGAE — 조종사 운용 교범">
    <svg class="glare__mark" viewBox="0 0 26 16" aria-hidden="true"><circle cx="13" cy="9" r="4"/><path d="M1 9h8M17 9h8M13 5V1"/></svg>
    <span class="glare__word">SOLGAE</span>
  </a>
  <nav class="glare__fma" aria-label="주 메뉴">
    <ul>
      <li><a class="fma" href="../index.html"><span class="fma__code">POH</span><span class="fma__ko">교범</span></a></li>
      <li><a class="fma" href="dashboard.html" aria-current="page"><span class="fma__code">OCC</span><span class="fma__ko">운항관제</span></a></li>
      <li><a class="fma" href="inbox.html"><span class="fma__code">MSG</span><span class="fma__ko">교신함</span></a></li>
      <li><a class="fma" href="kanban.html"><span class="fma__code">MX</span><span class="fma__ko">정비</span></a></li>
      <li><a class="fma" href="product.html"><span class="fma__code">TKT</span><span class="fma__ko">탑승권</span></a></li>
      <li><a class="fma" href="pricing.html"><span class="fma__code">FARE</span><span class="fma__ko">요금</span></a></li>
      <li><a class="fma" href="profile.html"><span class="fma__code">CREW</span><span class="fma__ko">기장</span></a></li>
      <li><a class="fma" href="settings.html"><span class="fma__code">SET</span><span class="fma__ko">설정</span></a></li>
    </ul>
  </nav>
  <span class="glare__mode" aria-hidden="true"><span class="fma__code">OCC</span><span class="fma__ko">운항관제</span></span>
  <div class="glare__right">
    <span class="glare__clock"><span class="glare__utc" data-clock="utc">061042Z</span><span class="glare__kst"><span data-clock="kst">19:42:00</span> KST</span></span>
    <button type="button" class="skey skey--icon glare__cmd" data-command-open aria-label="FMS 스크래치패드 열기 (⌘K)"><span class="t-code">⌘K</span></button>
    <button type="button" class="skey skey--icon" data-theme-toggle aria-pressed="true" aria-label="주간 화면으로 전환 (현재 야간)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" style="fill:currentColor"/></svg></button>
    <button type="button" class="skey skey--icon glare__menu" data-drawer-open="nav-drawer" aria-controls="nav-drawer" aria-expanded="false" aria-label="페이지 메뉴 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    <button type="button" class="mlamp mlamp--caut" data-lit="true" aria-label="마스터 주의 — 미확인 메시지 있음"><span>MASTER</span><span>CAUT</span></button>
  </div>
</header>
```

글레어실드 동작 메모
- 1100px 이하: FMA 8칸이 숨고 `.glare__mode` 1칸 + 메뉴 소프트키(`.glare__menu`)가 나온다. 767px 이하: 시계·⌘K 숨김, MASTER WARN은 경고가 켜졌을 때만 보인다.
- **MASTER CAUT는 모든 화면에서 `data-lit="true"`로 시작한다** — 기준 시각 19:42에 미확인 주의 1건(`BATT 2 TEMP`, HL5406)이 있다는 세계 상태. 누르면 확인되어 소등되고 상태 토스트가 뜬다.
- MASTER WARN은 평소 꺼짐. 경고급 토스트가 뜨거나 `[data-master-demo]`를 누르면 `html[data-master="warning"]`이 되어 2Hz 점멸 + 가장자리 눈금 빨강. 램프를 누르면 확인.
- 시계 `[data-clock]`은 app.js가 기준 시각 `061042Z`(19:42 KST)부터 1초씩 흘린다. 값: `utc` → `061042Z`, `kst` → `19:42:05`, `kst-hm` → `19:42`.

### 2-2. 사이드바 셸 — 계기 선택 레일 (pages 전용, index에는 쓰지 않는다)

레일은 `.with-rail` 그리드의 첫 칸이다. 72px 세로 소프트키 열, 항목 간격 6px 고정(화면 높이에 균등 분산 금지), 현재 = 마젠타 왼쪽 레일. 767px 이하에서 가로 줄 + 오른쪽 페이드로 바뀐다.

**OCC 레일** — dashboard / inbox / kanban (운항관리사 윤서하의 도구). 현재 페이지 키에 `aria-current="page"`.

```html
<div class="with-rail panel">
  <nav class="rail" aria-label="운항통제 도구">
    <a class="rail__key" href="dashboard.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></svg><span class="rail__code">OCC</span><span class="rail__ko">상황판</span></a>
    <a class="rail__key" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 6l9 7 9-7"/></svg><span class="rail__code">MSG</span><span class="rail__ko">교신함</span></a>
    <a class="rail__key" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z"/></svg><span class="rail__code">MX</span><span class="rail__ko">정비</span><span class="cnt cnt--warn" aria-label="운항 불가 기체 1대">1</span></a>
    <span class="rail__sep" aria-hidden="true"></span>
    <a class="rail__key" href="../index.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4"/></svg><span class="rail__code">POH</span><span class="rail__ko">교범</span></a>
  </nav>
  <main id="main" class="stack stack--group"><!-- 장면 --></main>
</div>
```

**기장 레일** — profile / settings / onboarding (조종사 개인 화면).

```html
<div class="with-rail panel">
  <nav class="rail" aria-label="기장 화면">
    <a class="rail__key" href="profile.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/></svg><span class="rail__code">LOG</span><span class="rail__ko">비행 기록</span></a>
    <a class="rail__key" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><path d="M14 5v4M8 15v4"/></svg><span class="rail__code">SET</span><span class="rail__ko">화면 설정</span></a>
    <a class="rail__key" href="onboarding.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18l5-5 4 3 7-9"/><path d="M15 7h5v5"/></svg><span class="rail__code">TRN</span><span class="rail__ko">전환 교육</span></a>
    <span class="rail__sep" aria-hidden="true"></span>
    <a class="rail__key" href="../index.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4"/></svg><span class="rail__code">POH</span><span class="rail__ko">교범</span></a>
  </nav>
  <main id="main" class="stack stack--group"><!-- 장면 --></main>
</div>
```

- 레일이 있는 페이지는 `<main>`이 `.with-rail` 안에 들어간다(바깥 `.panel`이 24px 여백 담당). 레일 없는 페이지는 `<main id="main" class="panel stack stack--group">`.
- 같은 페이지 안의 계기 전환(예: dashboard의 ND/OPS/BATT 보기)은 레일이 아니라 `.railed` 소프트키 레일이나 탭으로 한다.

### 2-3. 상태 스트립(footer) — **index.html 경로**

```html
<footer class="strip">
  <div class="atis">
    <span class="atis__tag">ATIS K</span>
    <div class="atis__view">
      <div class="atis__track">
        <p class="atis__group">
          <span class="atis__item"><span class="t-mono">RKSS 061030Z 28009G15KT 9999 FEW040 09/02 Q1021</span><span class="t-ko">김포 바람 280° 9kt 돌풍 15kt · 시정 10km 이상 · 기온 9°C</span></span><span class="atis__sep"></span>
          <span class="atis__item"><span class="t-mono">R1 450M 300/14KT</span><span class="t-ko">한강 회랑 상공 바람</span></span><span class="atis__sep"></span>
          <span class="atis__item"><span class="t-mono">A2381/26</span><span class="t-ko">잠실 FATO 2 조명 점검 11.06 22:00–11.07 05:00</span></span><span class="atis__sep"></span>
          <span class="atis__item"><span class="t-mono">SG120</span><span class="t-ko">김포→잠실 20:40 출발, 30분 지연</span></span><span class="atis__sep"></span>
        </p>
      </div>
    </div>
    <button type="button" class="atis__pause" data-marquee-toggle aria-pressed="false" aria-label="ATIS 띠 멈춤"><svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg></button>
  </div>
  <div class="strip__bar">
    <span class="strip__brand">SOLGAE AIR</span>
    <span class="strip__item">김포 OCC</span>
    <span class="strip__item"><span class="t-mono" data-clock="utc">061042Z</span></span>
    <span class="strip__item">기준 <span class="t-mono">2026.11.06</span>(금) <span class="t-mono">19:42</span> KST</span>
    <span class="strip__item">고객센터 <span class="t-mono">1668-5400</span> (매일 06:30–23:00)</span>
    <span class="strip__item">서울특별시 강서구 하늘길 112, 김포 버티포트 운항동 3층</span>
  </div>
  <nav class="strip__keys" aria-label="페이지 바로가기">
    <a class="skey skey--stack" href="index.html" aria-current="page"><span class="skey__code">POH</span>교범</a>
    <a class="skey skey--stack" href="pages/dashboard.html"><span class="skey__code">OCC</span>운항관제</a>
    <a class="skey skey--stack" href="pages/inbox.html"><span class="skey__code">MSG</span>교신함</a>
    <a class="skey skey--stack" href="pages/kanban.html"><span class="skey__code">MX</span>정비</a>
    <a class="skey skey--stack" href="pages/onboarding.html"><span class="skey__code">TRN</span>전환 교육</a>
    <a class="skey skey--stack" href="pages/product.html"><span class="skey__code">TKT</span>탑승권</a>
    <a class="skey skey--stack" href="pages/pricing.html"><span class="skey__code">FARE</span>요금</a>
    <a class="skey skey--stack" href="pages/profile.html"><span class="skey__code">CREW</span>기장</a>
    <a class="skey skey--stack" href="pages/settings.html"><span class="skey__code">SET</span>설정</a>
    <a class="skey skey--stack" href="pages/404.html"><span class="skey__code">LOST</span>신호 소실</a>
  </nav>
</footer>
```

### 2-3'. 상태 스트립 — **pages/ 경로** (예: dashboard.html)

`.atis`와 `.strip__bar`는 index와 **한 글자도 다르지 않다**. `.strip__keys`만 아래로 바꾼다.

```html
  <nav class="strip__keys" aria-label="페이지 바로가기">
    <a class="skey skey--stack" href="../index.html"><span class="skey__code">POH</span>교범</a>
    <a class="skey skey--stack" href="dashboard.html" aria-current="page"><span class="skey__code">OCC</span>운항관제</a>
    <a class="skey skey--stack" href="inbox.html"><span class="skey__code">MSG</span>교신함</a>
    <a class="skey skey--stack" href="kanban.html"><span class="skey__code">MX</span>정비</a>
    <a class="skey skey--stack" href="onboarding.html"><span class="skey__code">TRN</span>전환 교육</a>
    <a class="skey skey--stack" href="product.html"><span class="skey__code">TKT</span>탑승권</a>
    <a class="skey skey--stack" href="pricing.html"><span class="skey__code">FARE</span>요금</a>
    <a class="skey skey--stack" href="profile.html"><span class="skey__code">CREW</span>기장</a>
    <a class="skey skey--stack" href="settings.html"><span class="skey__code">SET</span>설정</a>
    <a class="skey skey--stack" href="404.html"><span class="skey__code">LOST</span>신호 소실</a>
  </nav>
```

### 2-4. 메뉴 드로어 (1100px 이하에서 `.glare__menu`가 연다) — **index.html 경로**

```html
<div class="drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-labelledby="nav-drawer-title" hidden>
  <div class="drawer__panel">
    <div class="drawer__head"><span class="du__code">MENU</span><h2 class="drawer__title" id="nav-drawer-title">페이지 선택</h2><button type="button" class="skey skey--icon skey--quiet" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="drawer__body">
      <nav class="drawer__nav" aria-label="주 메뉴">
        <a class="drawer__link" href="index.html" aria-current="page"><span class="t-code">POH</span>교범</a>
        <a class="drawer__link" href="pages/dashboard.html"><span class="t-code">OCC</span>운항관제</a>
        <a class="drawer__link" href="pages/inbox.html"><span class="t-code">MSG</span>교신함</a>
        <a class="drawer__link" href="pages/kanban.html"><span class="t-code">MX</span>정비</a>
        <a class="drawer__link" href="pages/onboarding.html"><span class="t-code">TRN</span>전환 교육</a>
        <a class="drawer__link" href="pages/product.html"><span class="t-code">TKT</span>탑승권</a>
        <a class="drawer__link" href="pages/pricing.html"><span class="t-code">FARE</span>요금</a>
        <a class="drawer__link" href="pages/profile.html"><span class="t-code">CREW</span>기장</a>
        <a class="drawer__link" href="pages/settings.html"><span class="t-code">SET</span>설정</a>
        <a class="drawer__link" href="pages/404.html"><span class="t-code">LOST</span>신호 소실</a>
      </nav>
      <div class="skey-row">
        <button type="button" class="skey" data-theme-toggle><span data-theme-label>야간</span>&nbsp;화면</button>
        <button type="button" class="skey" data-command-open><span class="t-code">FMS</span>&nbsp;스크래치패드</button>
      </div>
    </div>
  </div>
</div>
```

pages/ 경로에서는 `drawer__nav`의 href를 2-3'과 같은 규칙(`../index.html`, `dashboard.html` …)으로 바꾸고, 현재 페이지 링크에만 `aria-current="page"`를 둔다.

### 2-5. FMS 스크래치패드 (⌘K 커맨드 팔레트) — 모든 페이지 `</body>` 직전

**index.html 경로** (pages에서는 `pages/` 접두를 떼고 index는 `../index.html`).

```html
<div class="cmd" data-command role="dialog" aria-modal="true" aria-label="FMS 스크래치패드" hidden>
  <div class="cmd__box">
    <div class="cmd__head"><span class="du__code">FMS</span><span class="cmd__head-title">스크래치패드</span><button type="button" class="skey skey--icon skey--quiet" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="cmd__list" role="listbox" id="cmd-list" aria-label="명령">
      <p class="cmd__group">항법</p>
      <a class="cmd__item" role="option" href="pages/dashboard.html" data-keywords="여의도 직행 상황판"><span class="cmd__key">DIR TO YDP</span><span class="cmd__label">여의도 버티포트로 직행 — 상황판에서 보기</span><span class="cmd__hint">D</span></a>
      <button type="button" class="cmd__item" role="option" data-toast="advisory" data-toast-code="HOLD HG3" data-toast-text="HG3 상공 체공 패턴을 입력했습니다."><span class="cmd__key">HOLD HG3</span><span class="cmd__label">HG3 상공 체공</span><span class="cmd__hint">H</span></button>
      <p class="cmd__group">페이지</p>
      <a class="cmd__item" role="option" href="pages/inbox.html" data-keywords="교신 메시지 데이터링크"><span class="cmd__key">MSG</span><span class="cmd__label">교신함 열기</span></a>
      <a class="cmd__item" role="option" href="pages/kanban.html" data-keywords="정비 작업지시"><span class="cmd__key">MX</span><span class="cmd__label">정비 작업 보드</span></a>
      <a class="cmd__item" role="option" href="pages/product.html" data-keywords="탑승권 예매 SG132"><span class="cmd__key">TKT SG132</span><span class="cmd__label">11월 7일(토) 08:15 김포→여의도 탑승권</span></a>
      <div class="cmd__item" role="option" aria-disabled="true"><span class="cmd__key">LAND AUTO</span><span class="cmd__label">자동 착륙 — SG-4 미지원</span></div>
      <p class="cmd__empty" hidden><span class="t-code">NOT IN DATABASE</span>일치하는 명령이 없습니다.</p>
    </div>
    <span class="sr-only" id="cmd-help">빈 칸 6자리 — 편명, 기체, 화면 이름을 입력</span><label class="cmd__pad"><span class="cmd__prompt">&gt;</span><input class="cmd__input" type="text" placeholder=" " aria-label="명령 입력" aria-describedby="cmd-help" role="combobox" aria-expanded="true" aria-controls="cmd-list" autocomplete="off"></label>
    <div class="cmd__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 이동</span><span><span class="kbd">Enter</span> 실행</span><span><span class="kbd">Esc</span> 닫기</span></div>
  </div>
</div>
```

토스트 영역(`.toasts`)은 app.js가 첫 토스트 때 `<body>` 끝에 만든다. 직접 넣지 않는다.

스크래치패드 항목은 **모든 페이지 공통**이다. `DIR TO YDP`처럼 dashboard로 가는 항목은 dashboard 밖에서는 그 화면으로 이동하는 바로가기로 동작한다(페이지별로 목록을 바꾸지 않는다). 빈 입력줄은 placeholder 공백 1자 + CSS 세그먼트 박스 6칸, `#cmd-help`(sr-only)가 "빈 칸 6자리"를 읽어 준다.

### 2-6. 페이지 뼈대 요약

```html
<body>
  <!-- 2-1 글레어실드 -->
  <main id="main" class="panel stack stack--group">   <!-- 레일 있는 페이지는 2-2의 .with-rail 안 -->
    <nav class="route" aria-label="현재 위치">…</nav>   <!-- 선택: breadcrumb -->
    <div class="grid">
      <section class="du span-7" data-boot>…</section>
      <section class="du span-5" data-boot>…</section>
    </div>
  </main>
  <!-- 2-3 상태 스트립 · 2-4 메뉴 드로어 · 2-5 스크래치패드 -->
</body>
```

---

## 3. 레이아웃 프리미티브 (base.css)

| 클래스 | 쓰임 |
|---|---|
| `.panel` | 계기판 바탕. 바깥 여백 24px(모바일 16). `.panel--flush` 풀블리드, `.panel--max` 1440 중앙 |
| `.grid` + `.span-1`…`.span-12`, `.start-4` | 12단 · 거터 6px. 1024 이하 6단 매핑, 767 이하 전부 1열. `.grid--group`(24px), `.grid--stretch` |
| `.stack` / `--group` / `--tight` / `--text` | 세로 6 / 24 / 8 / 12px |
| `.cluster` / `--group`, `.split` | 가로 묶음 6 / 16px, 양끝 정렬 |
| `.narrow` | 560px 체크리스트 칼럼 |
| `.railed` (`--left`, `--right`) + `.railed__keys` | DU 좌우 44px 소프트키 레일. 767 이하에서 DU 아래 가로 줄 |
| `.hscroll` | 가로 스크롤 + 오른쪽 페이드(끝에 닿으면 app.js가 `.is-end`) |
| `.ticks` (`--top`, `--v`, `--end`) | 눈금 띠(소 8px · 대 40px) |
| `.rdo` | 리드아웃 창 — 아래 5절 |
| `.bevel`, `.bevel--bl` | 6px 베벨 컷 |
| `.edge` | 뷰포트 좌우 가장자리 눈금(셸에 포함) |
| `.scrolltape` | 우측 세로 스크롤 테이프(≥1100). 섹션에 `data-tape-label="CAS"`. 테이프가 있는 페이지는 base.css가 `main`·`.strip`에 오른쪽 40px 거터를 자동으로 비운다(`body:has(.scrolltape)`) — 페이지 CSS에서 따로 여백을 주지 않는다 |

```html
<!-- 스크롤 위치 테이프 (index 같은 긴 판에서 선택) -->
<div class="scrolltape" aria-hidden="true"><span class="scrolltape__scale ticks ticks--v ticks--end"></span><span class="scrolltape__win rdo rdo--sm rdo--tgt rdo--ptr-r">PFD</span></div>
<section data-tape-label="PFD">…</section>

<!-- 소프트키 레일 달린 DU -->
<div class="railed">
  <div class="railed__keys"><button type="button" class="skey" aria-label="ND 보기"><span class="t-code">ND</span></button>…</div>
  <section class="du">…</section>
  <div class="railed__keys">…</div>
</div>
```

활자 유틸: `.h-cover`(Chakra Petch 64), `.h-chapter`(Orbit 32), `.h-panel`(Orbit 24), `.h-sub`(Orbit 20), `.h-page`(Gothic A1 700 17), `.t-code`(라틴 코드 전용), `.t-mono`(편명·시각·금액), `.t-latin`, `.t-ko`, `.t-xs/sm/md`, `.t-bold`, `.t-muted`, `.num`(우측 정렬 숫자), 규약 색 글자 `.c-ink .c-ok .c-sel .c-tgt .c-caut .c-warn`(다크에서 심볼로지 글로우), `.prose`, `a.link`, 아이콘 `.icon`(`--sm` 16 · 기본 20 · `--lg` 24, `stroke=currentColor`).

---

## 4. 상태 표기 공통

| 상태 | 표기 | 마크업 훅 |
|---|---|---|
| hover | 테두리 `--line-strong` → 시안 (락온) | CSS |
| focus-visible | 2px 시안 바깥선 + 2px 오프셋 | CSS(전역) |
| active / 눌림 | `--pressed` 면 | CSS |
| pressed 토글 | 소프트키 상단 초록 램프 점등 | `aria-pressed="true"` |
| selected / current | 마젠타 테두리 | `aria-selected="true"` · `aria-current="page|step|date|true"` |
| disabled | 점선 테두리 + 보조 글자 | `disabled` · `aria-disabled="true"` |
| loading | 12분할 눈금 링 회전 / 눈금 흐름 | `aria-busy="true"` |
| error | 앰버 테두리 + `CHK` 문구 (빨강은 불가능한 값만) | `aria-invalid="true"` · `data-state="error"` · `data-invalid="impossible"` |

---

## 5. 컴포넌트 32

### 1. accordion — 체크리스트 절

```html
<div class="acc" data-accordion>                 <!-- data-accordion="single" 이면 하나만 열림 -->
  <div class="acc__item">
    <button type="button" class="acc__head" aria-expanded="true" aria-controls="acc-norm"><span class="acc__code">NORM</span><span class="acc__title">정상 절차</span><span class="acc__count cnt">5</span></button>
    <div class="acc__panel" id="acc-norm">…체크리스트(14번)…</div>
  </div>
  <div class="acc__item acc__item--abn">
    <button type="button" class="acc__head" aria-expanded="false" aria-controls="acc-abn"><span class="acc__code">ABN</span><span class="acc__title">비정상 절차</span><span class="acc__count cnt">8</span></button>
    <div class="acc__panel" id="acc-abn">…</div>
  </div>
  <div class="acc__item acc__item--emer">
    <button type="button" class="acc__head" aria-expanded="false" aria-controls="acc-emer"><span class="acc__code">EMER</span><span class="acc__title">비상 절차</span><span class="acc__count cnt cnt--warn">4</span></button>
    <div class="acc__panel" id="acc-emer">…</div>
  </div>
</div>
```
열린 절 = 왼쪽 2px 시안 레일 + 시안 코드, CSS 삼각형 회전. `acc__item--abn` 앰버 코드, `--emer` 빨강 코드. 비활성 = `<button … disabled>`.

### 2. alert — CAS 메시지

```html
<div class="cas-list">
  <div class="cas cas--warning"><span class="cas__lvl">WARN</span><span class="cas__code">BATT 1 FAIL</span><span class="cas__text">배터리 1 출력 차단 — 즉시 착륙 절차<small>교범 3.4 시연 예문</small></span><span class="cas__side"><time class="cas__time">061041Z</time><button type="button" class="skey skey--compact" data-cas-ack>확인</button></span></div>
  <div class="cas cas--caution"><span class="cas__lvl">CAUT</span><span class="cas__code">BATT 2 TEMP</span><span class="cas__text">배터리 2 온도 높음 — 셀 41°C, SG203 계속 운항</span><span class="cas__side"><time class="cas__time">061039Z</time><button type="button" class="skey skey--compact" data-cas-ack>확인</button></span></div>
  <div class="cas cas--advisory"><span class="cas__lvl">ADVY</span><span class="cas__code">WIND R1</span><span class="cas__text">22시 이후 한강 회랑 돌풍 20kt 예상</span><span class="cas__side"><time class="cas__time">060955Z</time></span></div>
  <div class="cas cas--status"><span class="cas__lvl">STAT</span><span class="cas__code">AC SWAP</span><span class="cas__text">SG120 기체 HL5404 → HL5402 교체</span><span class="cas__side"><time class="cas__time">061031Z</time></span></div>
</div>
```
4단계: 경고(빨강 램프) / 주의(앰버 램프) / 권고(시안 선) / 상태(흰 글자). 레벨 문자(`WARN CAUT ADVY STAT`)는 항상 둔다. 확인됨 = `data-acked="true"`(램프 소등, `[data-cas-ack]`가 자동으로 붙인다). 좁은 칸 안에서는 `.cas--stacked`. 닫기 가능한 알림은 `<button data-dismiss>`.
**주의**: 실제 운항 수치상 오늘 경고급 CAS는 없다. `BATT 1 FAIL`은 교범 예문으로만 쓰고 "시연/예문"임을 `<small>`로 밝힌다.

### 3. badge — 상태 램프 · 숫자 창 · 상태 점

```html
<span class="lamp lamp--ok">도착</span>           <!-- 켜진 램프: --ok --sel --tgt --caut --warn --ink -->
<span class="lamp lamp--sel">탑승 중</span>
<span class="lamp lamp--tgt">비행 중 · 순항</span>
<span class="lamp lamp--caut">지연 30분</span>
<span class="lamp lamp--warn">운항 불가</span>
<span class="lamp">예정</span>                     <!-- 꺼진 램프 -->
<span class="lamp lamp--code lamp--ok">NORM</span>  <!-- 라틴 코드 램프 -->
<span class="lamp lamp--code lamp--line-sel">ADVY</span>  <!-- 선 램프: --line-ok/sel/tgt/caut/warn -->
<span class="cnt">12</span> <span class="cnt cnt--caut">1</span>   <!-- 숫자 창: --sel --tgt --ok --caut --warn, 모서리 고정 --pin -->
<span class="state"><span class="dot dot--ok"></span>정상</span>   <!-- 점은 반드시 글자와 함께. 변형 --ok --sel --tgt --caut --warn --ink(고정 기호) -->
```
크기 `lamp--sm`(표 셀) · `lamp--lg`. 운항표 상태 매핑: 도착=ok, 비행 중=tgt, 탑승 중=sel, 충전 중=line-ok, 예정=꺼짐, 지연=caut, 정비·운항 불가=warn.

### 4. breadcrumb — 비행 경로 웨이포인트

```html
<nav class="route" aria-label="현재 위치">
  <ol class="route__list">
    <li class="route__item"><a class="route__link" href="../index.html"><span class="route__code">POH</span>교범</a></li>
    <li class="route__item"><a class="route__link" href="dashboard.html"><span class="route__code">OCC</span>운항관제</a></li>
    <li class="route__item"><a class="route__link" aria-current="page"><span class="route__code">SG203</span>인천→여의도</a></li>
  </ol>
</nav>
```
지난 구간 = 흰 선 + 빈 마름모, 현재 = 마젠타 선 + 채운 마름모(`aria-current="page"`, href 없음).

### 5. button — 베젤 소프트키

```html
<button type="button" class="skey skey--primary">출발 준비 완료</button>      <!-- 주 조작: 시안 면 + 베벨 컷 -->
<button type="button" class="skey">취소</button>                              <!-- 보조: 선만 -->
<button type="button" class="skey" aria-pressed="true">AP1</button>          <!-- 토글: 눌림 = 초록 램프 점등 -->
<button type="button" class="skey skey--stack"><span class="skey__code">DIR TO</span>직행</button>  <!-- 2줄: 라틴 코드 + 한글 -->
<button type="button" class="skey skey--icon" aria-label="새로고침"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></button>
<button type="button" class="skey" disabled>잠김</button>                     <!-- 비활성: 점선 -->
<button type="button" class="skey skey--primary" aria-busy="true">전송 중</button>   <!-- 처리 중: 나침 링 -->
<button type="button" class="skey" data-state="error">재시도</button>          <!-- 직전 실패: 앰버 -->
<button type="button" class="skey skey--danger" data-guard data-toast="status" data-toast-code="AC SWAP" data-toast-text="SG120 기체를 HL5402로 교체했습니다."><span class="skey__label">기체 운항 불가 처리</span></button>
```
- 파괴적 동작 = `skey--danger` + `data-guard`: 1회차 클릭은 "덮개 열림 — 한 번 더 눌러 실행"(빨강 램프 `data-armed="true"`, 4초 뒤·Esc·포커스 이탈 시 원복), 2회차에 실행(`guard:fire` 이벤트, `data-toast` 있으면 토스트). 라벨은 반드시 `.skey__label`로 감싼다. 문구 바꾸기: `data-guard="덮개 열림 — 다시 눌러 삭제"`.
- 변형: `skey--block`(전폭), `skey--compact`(32px, 터치 영역은 ::after로 44 보전), `skey--quiet`(테두리 없음), 묶음 `.skey-row`. 링크도 `<a class="skey" href="…">` 가능, 현재 위치면 `aria-current="page"`(마젠타).
- 처리 중 시연: `data-busy-demo`(1.6초).

### 6. calendar — 운항 일정 달력 (2026년 11월, 1일 = 일요일)

```html
<section class="cal" data-calendar="cal-out">
  <div class="cal__head"><h2 class="cal__title">2026년 11월 <span class="t-code">NOV</span></h2><button type="button" class="skey skey--icon" aria-label="이전 달" disabled>…</button><button type="button" class="skey skey--icon" aria-label="다음 달" disabled>…</button></div>
  <div class="cal__grid" role="grid" aria-label="2026년 11월 운항 일정">
    <span class="cal__dow">일</span><span class="cal__dow">월</span><span class="cal__dow">화</span><span class="cal__dow">수</span><span class="cal__dow">목</span><span class="cal__dow">금</span><span class="cal__dow">토</span>
    <button type="button" class="cal__day" style="--n:58" data-label="11월 1일(일)"><span class="cal__num">1</span><span class="cal__n">58편</span><span class="cal__ticks"></span></button>
    …
    <button type="button" class="cal__day cal__day--mx" style="--n:64" data-label="11월 6일(금)" aria-current="date"><span class="cal__num">6</span><span class="cal__n">64편</span><span class="cal__ticks"></span></button>
    …
    <button type="button" class="cal__day" style="--n:62" data-label="11월 9일(월) 시뮬레이터 예약" aria-selected="true"><span class="cal__num">9</span><span class="cal__n">62편</span><span class="cal__ticks"></span></button>
    …
    <span class="cal__day cal__day--out"></span>   <!-- 달 밖 칸(30일 뒤 5칸) -->
  </div>
  <div class="cal__foot"><span class="cal__key">오늘</span><span class="cal__key cal__key--sel">선택</span><span class="cal__key cal__key--mx">정비·결항</span><span>선택: <b id="cal-out">11월 9일(월) 시뮬레이터 예약</b></span></div>
</section>
```
11월 1일은 일요일이라 첫 칸, 30일은 월요일. `--n`은 그날 편수(64 = 꽉 참). 오늘 6일 = 흰 테두리 + "오늘", 선택 = 마젠타, `cal__day--mx` = 앰버 점(6일 HL5404 정비). 방향키 이동·클릭 선택은 app.js. 운항 안 하는 날은 `disabled`(사선 해치). `style="--n:…"`은 데이터 값이므로 인라인 허용(레이아웃 속성 아님).

### 7. card — DU(디스플레이 유닛)

```html
<section class="du" data-boot>
  <div class="du__head"><span class="du__code">BATT</span><h2 class="du__title">HL5406 배터리</h2><span class="du__meta">SG203 · <span data-clock="kst-hm">19:42</span></span></div>
  <div class="du__body">…</div>
  <div class="du__foot"><button type="button" class="skey">…</button></div>
</section>

<a class="du du--link" href="pages/dashboard.html">…</a>   <!-- 링크 DU: 호버·포커스 시 락온(모서리 눈금이 안으로 모이고 시안) -->
```
변형: `du--flush`(본문 패딩 0, 표·지도용), `du--full`(좌우 테두리·모서리 없음, 풀블리드), `du--bare`(면 없음, 베젤 위에 선만 — 계통도), `du--strong`, 상태 `du--ok` `du--caut` `du--warn`, 선택 `aria-selected="true"`/`aria-current`(마젠타), 비활성 `aria-disabled="true"`, 처리 중 `aria-busy="true"`(머리줄 눈금 흐름). `data-boot`는 처음 보일 때 셀프테스트 점등.

### 8. carousel — MFD 페이지 순환

```html
<section class="mfd" data-carousel aria-roledescription="carousel" aria-label="MFD 페이지">
  <button type="button" class="skey mfd__prev" aria-label="이전 페이지"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
  <div class="mfd__screen"><div class="mfd__track">
    <div class="mfd__page" aria-roledescription="slide" aria-label="항로도" aria-hidden="false"><div class="mfd__page-head"><span class="du__code">ND</span><b>항로도 — 한강 회랑 R1</b></div>…</div>
    <div class="mfd__page" aria-roledescription="slide" aria-label="기상" aria-hidden="true"><div class="mfd__page-head"><span class="du__code">WX</span><b>김포 기상</b></div><p class="t-mono t-sm">RKSS 061030Z 28009G15KT 9999 FEW040 09/02 Q1021</p></div>
    <div class="mfd__page" aria-roledescription="slide" aria-label="배터리" aria-hidden="true"><div class="mfd__page-head"><span class="du__code">BATT</span><b>HL5406 배터리</b></div>…</div>
  </div></div>
  <button type="button" class="skey mfd__next" aria-label="다음 페이지"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
  <div class="mfd__index"><button type="button" class="mfd__dot" aria-current="true" aria-label="항로도"><span class="mfd__dot-label">ND</span></button><button type="button" class="mfd__dot" aria-label="기상"><span class="mfd__dot-label">WX</span></button><button type="button" class="mfd__dot" aria-label="배터리"><span class="mfd__dot-label">BATT</span></button></div>
  <p class="mfd__live sr-only" aria-live="polite"></p>
</section>
```
점 대신 눈금 위 페이지 코드, 현재 = 마젠타 창. 좌우 화살표 키 지원. 모바일에서 이전/다음 소프트키가 화면 아래 줄로 내려온다.

### 9. code — 데이터링크 전문

```html
<figure class="code">
  <figcaption class="code__head"><span class="code__tag">ACARS</span><span class="code__name">HL5406 데이터링크 전문 · 061039Z</span><button type="button" class="skey code__copy" data-copy><span class="skey__label">복사</span></button></figcaption>
  <div class="code__body"><div class="code__gutter"></div><pre class="code__pre" tabindex="0"><code><span class="tk-com">-- SG203 ICN→YDP</span>
<span class="tk-key">QU</span> RKSSOSG
.HL5406 061039
<span class="tk-cau">CAS CAUT BATT 2 TEMP</span>
CELL MAX <span class="tk-cau">41C</span> SOC <span class="tk-val">47</span>
POS IC3 ALT <span class="tk-val">1480</span> GS 118
NEXT <span class="tk-tgt">IC4</span> ETA 1047Z</code></pre></div>
</figure>
```
행 번호는 app.js가 채운다. 복사 성공 = 초록 램프 "복사됨"(1.6초). 구문 색도 규약: `tk-key` 시안(명령) · `tk-val` 초록 · `tk-tgt` 마젠타 · `tk-cau` 앰버 · `tk-wrn` 빨강 · `tk-com` 보조. 본문 속 코드 `<code class="icode">QNH</code>`, 키 `<span class="kbd">⌘</span><span class="kbd">K</span>`.

### 10. command — FMS 스크래치패드 (⌘K)

셸 2-5 그대로. 결과 목록 위, 입력줄은 맨 아래(CDU 관행), 빈 입력은 앰버 세그먼트 박스 6칸(placeholder는 공백 1자, CSS 배경으로 그림 — □ 글리프 금지), 입력값은 시안. 항목은 `<a href>`(이동) 또는 `<button>`(동작: `data-toast…`). 검색어는 `data-keywords`로 보강. 열기: ⌘K/Ctrl+K 또는 `[data-command-open]`. ↑↓ 이동, Enter 실행, Esc 닫기, 포커스 트랩, 닫으면 트리거로 포커스 복귀. 결과 없음 = `.cmd__empty`(`NOT IN DATABASE`).

### 11. drawer — EFB 측면 패널

```html
<button type="button" class="skey" data-drawer-open="efb" aria-controls="efb" aria-expanded="false"><span class="t-code">EFB</span>&nbsp;비행 서류</button>

<div class="drawer" id="efb" role="dialog" aria-modal="true" aria-labelledby="efb-title" hidden>
  <div class="drawer__panel">
    <div class="drawer__head"><span class="du__code">EFB</span><h2 class="drawer__title" id="efb-title">SG116 비행 서류</h2><button type="button" class="skey skey--icon skey--quiet" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="drawer__body">
      <dl class="ldr"><div class="ldr__row"><dt>구간</dt><dd>GMP → YDP</dd></div><div class="ldr__row"><dt>출발</dt><dd>19:45</dd></div><div class="ldr__row"><dt>기체</dt><dd>HL5401 · SoC 96%</dd></div><div class="ldr__row"><dt>탑승</dt><dd>4/4</dd></div></dl>
    </div>
    <div class="drawer__foot"><button type="button" class="skey" data-close>닫기</button><button type="button" class="skey skey--primary" data-close data-toast="status" data-toast-code="EFB SIGNED" data-toast-text="SG116 비행 서류에 서명했습니다.">서명</button></div>
  </div>
</div>
```
오른쪽 400px(모바일 전폭), 왼쪽은 `drawer--left`. 240ms clip-path 열림, 스크림 클릭·Esc 닫기, 포커스 트랩. **정적 견본**(index 7-7 규칙): 같은 마크업에서 바깥 `.drawer`의 fixed를 장면 CSS에서 풀고 `hidden` 대신 `class="drawer is-open" data-static`으로 두면 열린 상태를 그 자리에 렌더한다(이때 `role="dialog"`·`aria-modal` 대신 `role="img" aria-label="EFB 패널 열린 상태 견본"` 또는 `aria-hidden="true"`).

### 12. empty — 계기 고장 플래그

```html
<div class="flag">
  <span class="flag__code">NO DATA</span>
  <p class="flag__text"><strong>항로도 신호 없음</strong>HL5404는 격납고 정비 중이라 위치 자료가 들어오지 않습니다.</p>
  <div class="flag__act"><button type="button" class="skey">다시 수신</button></div>
</div>
```
빨강 대각 X = 고장. 고장이 아닌 정상 빈 상태(예: 확인할 메시지 없음)는 `flag--none`(흰 선), 부분 실패 `flag--caut`, 작은 칸 `flag--sm`.

### 13. form — CDU 데이터 입력 칸

```html
<form class="stack stack--text" data-validate data-success-code="PREFLT OK" data-success-text="SG116 비행 전 입력을 저장했습니다." data-error-code="ENTRY CHK" data-error-text="확인이 필요한 칸이 있습니다.">
  <div class="form-row">
    <div class="field">
      <label class="field__label" for="qnh">기압 보정값 <span class="t-code">QNH</span><span class="field__req">필수</span></label>
      <div class="field__box"><input class="input input--data input--seg" id="qnh" type="number" required min="950" max="1050" placeholder=" " inputmode="numeric" aria-describedby="qnh-help"><span class="field__unit">HPA</span></div>
      <p class="field__msg" id="qnh-help">빈 칸 4자리 · 김포 METAR 기준 1021</p>
    </div>
    <div class="field">
      <label class="field__label" for="pax">승객 수</label>
      <div class="field__box"><input class="input input--data input--default" id="pax" type="number" min="0" max="4" value="4"><span class="field__unit">PAX</span></div>
    </div>
    <div class="field">
      <label class="field__label" for="alt">순항 고도 목표</label>
      <div class="field__box"><input class="input input--data input--target" id="alt" value="1480" readonly><span class="field__unit">FT</span></div>
    </div>
  </div>
  <div class="field">
    <label class="field__label" for="dest">도착 버티포트</label>
    <div class="field__box field__box--select"><select class="select" id="dest"><option>여의도 YDP</option><option>잠실 JSL</option><option>김포 GMP</option></select></div>
  </div>
  <div class="field"><label class="field__label" for="memo">기장 메모</label><textarea class="textarea" id="memo" placeholder="특이사항을 적으세요"></textarea></div>
  <fieldset class="fieldset"><legend class="fieldset__legend">탑승 보조 <span class="t-code">SVC</span></legend>
    <label class="check"><input type="checkbox" class="check__input" checked><span class="check__lamp" aria-hidden="true"></span><span>휠체어 탑승 보조</span></label>
    <label class="check"><input type="radio" name="corr" class="check__input" checked><span class="check__lamp" aria-hidden="true"></span><span>한강 회랑 R1</span></label>
  </fieldset>
  <button type="button" class="switch" role="switch" aria-checked="true"><span class="switch__track"><span class="switch__lever"></span></span><span class="switch__pos" aria-hidden="true"><span class="switch__on">ON</span><span class="switch__off">OFF</span></span><span>착륙등</span></button>
  <div class="field"><label class="field__label" for="bright">화면 밝기</label>
    <div class="slider" style="--val:35"><output class="slider__rdo rdo rdo--sm rdo--sel rdo--ptr-b" for="bright">35<span class="rdo__unit">%</span></output><input class="slider__input" id="bright" type="range" min="0" max="100" value="35" data-valuetext="밝기 {v}%"><div class="slider__scale"><span>0</span><span>50</span><span>100</span></div></div>
  </div>
  <div class="skey-row"><button type="submit" class="skey skey--primary">입력 저장</button></div>
</form>
```
값의 성격: 입력값 = 시안(기본) · 시스템 기본값 `input--default` 흰 · 목표값 `input--target` 마젠타 · 데이터 숫자 `input--data`. 빈 필수 칸은 `input--seg` + `placeholder=" "` — 앰버 세그먼트 박스를 CSS로 그린다(칸 수 `--seg`, 기본 4). □ 글리프는 두부 문자로 보이므로 금지. 오류 = 앰버 테두리 + `CHK` 문구(`field__msg--error`), 물리적으로 불가능한 값만 `data-invalid="impossible"` + `field__msg--impossible`(빨강). 비활성 점선, 읽기 전용 테두리 약화. `form[data-validate]`이면 app.js가 제출 시 검증 → 오류는 첫 칸 포커스 + 주의 토스트, 통과는 처리 중 0.9초 후 상태 토스트 + `form:ok` 이벤트. 체크박스 = 사각 램프(시안 점등), 라디오 = 사각 안 사각, 스위치 = 위(ON 초록)/아래(OFF) 레버. 토글 소프트키 묶음은 `<div data-toggle-group="single|multi" data-output="id" data-max="2">` 안에 `aria-pressed` 버튼들.

### 14. kanban — 정비 작업 보드

```html
<div class="board" data-kanban>
  <section class="board__col">
    <header class="board__head"><span class="lamp lamp--sm">계획</span><span class="board__name sr-only">계획</span><span class="cnt">4</span></header>
    <div class="board__list">
      <article class="wo"><span class="wo__id">WO-2611-032</span><span class="wo__ac">HL5401</span><p class="wo__text">기수 카메라 렌즈 세척·보정</p><p class="wo__meta"><span>한예솔</span><span>기한 <span class="t-mono">11.07</span></span></p></article>
      <article class="wo wo--caut"><span class="wo__id">WO-2611-033</span><span class="wo__ac">HL5406</span><p class="wo__text">배터리 2 셀 온도 센서 점검 (운항 종료 후 22:40)</p><p class="wo__meta"><span>한예솔</span><span>기한 <span class="t-mono">11.06</span></span></p></article>
    </div>
  </section>
  <section class="board__col">
    <header class="board__head"><span class="lamp lamp--sm lamp--sel">작업 중</span><span class="board__name sr-only">작업 중</span><span class="cnt">1</span></header>
    <div class="board__list">
      <article class="wo wo--nogo"><span class="wo__id">WO-2611-031</span><span class="wo__ac">HL5404</span><p class="wo__text">리프트 모터 3번 진동 점검</p><p class="wo__meta"><span>오민혁</span><span class="lamp lamp--sm lamp--warn">운항 불가</span></p>
        <div class="wo__move"><button type="button" class="skey skey--compact" data-move="prev" aria-label="WO-2611-031 이전 열로">←</button><button type="button" class="skey skey--compact" data-move="next" aria-label="WO-2611-031 다음 열로">→</button></div></article>
    </div>
  </section>
  …
</div>
```
열 순서: 계획(꺼진 램프) → 부품 대기(`lamp--caut`) → 작업 중(`lamp--sel`) → 검사 대기(`lamp--tgt`) → 복귀 완료(`lamp--ok`). 카드 왼쪽 레일: 운항 불가 `wo--nogo` 빨강, 운항 영향 `wo--caut` 앰버, 완료 `wo--done` 초록. 끌어 옮기기, 카드 포커스 후 ←/→, `data-move` 소프트키 모두 지원. 건수 창은 app.js가 갱신. 이동 시 `kanban:move` 이벤트 + 스크린리더 안내. 첫 열의 `←`, 마지막 열의 `→`는 app.js가 `disabled`로 바꾼다(점선 소프트키). 카드 메타 줄(기한·등록·완료일)은 DIRECTION 팩트 시트 "카드 메타" 열 값을 그대로 쓴다 — 완료 열은 `완료 11.05(목)`처럼 완료일, 기한이 아니다.

### 15. list — 체크리스트 · 점선 리더 · 행 목록

```html
<!-- 호명–응답 체크리스트 -->
<ol class="chk" data-checklist="pre" data-finish="btn-ready">
  <li class="chk__item"><label class="chk__row"><input type="checkbox" class="chk__input" checked><span class="chk__box"></span><span class="chk__call">배터리 주 스위치</span><span class="chk__lead"></span><span class="chk__resp">ON</span></label></li>
  <li class="chk__item"><label class="chk__row"><input type="checkbox" class="chk__input"><span class="chk__box"></span><span class="chk__call">기압 보정값</span><span class="chk__lead"></span><span class="chk__resp">1021</span></label></li>
  <li class="chk__item chk__item--caut"><label class="chk__row"><input type="checkbox" class="chk__input"><span class="chk__box"></span><span class="chk__call">리프트 로터 6기</span><span class="chk__lead"></span><span class="chk__resp">CHECK</span></label></li>
</ol>
<span data-chk-count="pre">1/3</span>
<button type="button" class="skey skey--primary" id="btn-ready" disabled>출발 준비 완료</button>

<!-- 점선 리더 정의 목록 (제원·요약) -->
<dl class="ldr"><div class="ldr__row"><dt>최대이륙중량</dt><dd>2,180kg</dd></div><div class="ldr__row"><dt>순항 속도</dt><dd>120kt (222km/h)</dd></div></dl>

<!-- 행 목록 (교신함 등) -->
<div class="rows">
  <a class="rows__item rows__item--unread" href="inbox.html" aria-current="true"><span class="lamp lamp--sm lamp--code lamp--caut">CAUT</span><span class="rows__main"><span class="rows__title">BATT 2 TEMP 셀 41°C</span><span class="rows__sub">HL5406 데이터링크 — SG203 계속 운항, 도착 후 점검 요청</span></span><span class="rows__meta">19:39</span></a>
</div>
```
확인된 응답 = 초록, 다음 할 항목 = 왼쪽 마젠타 선(app.js `data-next`), 진행률은 `[data-chk-count]`·`[data-chk-progress]`(vtape/tape)로 연결, 모두 끝나면 `data-finish` 버튼 활성. 읽기 전용은 `chk--static`(상자 없이 `<div class="chk__row">`). 응답(`.chk__resp`)은 기본 자간 0.02em·대소문자 그대로 — **라틴 코드 응답(ON, TEST OK, CHECK…)에만 `chk__resp--code`**를 붙여 넓은 자간·대문자를 쓴다. 한글 응답(확정, 완료, 리프트 6 + 틸트 2)에는 붙이지 않는다.

### 16. marquee — ATIS 띠

셸 2-3의 `.atis` 그대로. 그룹 하나만 쓰면 app.js가 복제해 끊김 없이 흐른다(40초). 호버·포커스·일시정지 버튼에서 정지, `prefers-reduced-motion`에서는 정적 한 줄 + 버튼 숨김. 화면당 상시 움직임은 이 띠 + 계통 흐름 최대 2개.

### 17. menu — 소프트키 하위 메뉴

```html
<div class="menu-anchor">
  <button type="button" class="skey" data-menu-trigger aria-controls="mode-menu" aria-expanded="false" aria-haspopup="menu">비행 모드&nbsp;<span id="mode-out">항로 추종</span></button>
  <div class="menu" id="mode-menu" role="menu" data-menu-output="mode-out" hidden>
    <p class="menu__label">수평 모드</p>
    <button type="button" class="menu__item" role="menuitemradio" aria-checked="true"><span class="menu__key">NAV</span><span class="menu__text">항로 추종</span><span class="menu__hint">N</span></button>
    <button type="button" class="menu__item" role="menuitemradio" aria-checked="false"><span class="menu__key">HDG</span><span class="menu__text">방위 유지</span><span class="menu__hint">H</span></button>
    <div class="menu__sep" role="separator"></div>
    <button type="button" class="menu__item menu__item--danger" role="menuitem"><span class="menu__key">AP OFF</span><span class="menu__text">자동비행 해제</span></button>
    <button type="button" class="menu__item" role="menuitem" disabled><span class="menu__key">LAND</span><span class="menu__text">자동 착륙 (미지원)</span></button>
  </div>
</div>
```
`data-menu-output`이 가리키는 칸에 고른 항목의 `.menu__text`(한글)가 들어간다 — 그래서 출력 칸은 `.t-code`가 아닌 일반 글자로 둔다. 오른쪽 끝에서는 `menu--end`. ↑↓ Home End 이동, Esc·바깥 클릭·Tab 닫기, 현재 항목 마젠타 테두리.

### 18. modal — 확인 대화상자 DU

```html
<button type="button" class="skey skey--danger" data-modal-open="modal-nogo" aria-controls="modal-nogo" aria-expanded="false">HL5404 운항 불가 확정</button>

<div class="modal modal--warn" id="modal-nogo" role="dialog" aria-modal="true" aria-labelledby="modal-nogo-title" hidden>
  <div class="modal__box">
    <div class="modal__lamp">CONFIRM · WO-2611-031<span class="lamp lamp--sm lamp--code lamp--ink">WARN</span></div>
    <div class="modal__head"><h2 class="modal__title" id="modal-nogo-title">HL5404 운항 불가 확정</h2><button type="button" class="skey skey--icon skey--quiet" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="modal__body">
      <p>리프트 모터 3번 진동 점검이 끝나지 않았습니다. 확정하면 SG120(김포→잠실 20:10)은 HL5402로 교체되고 출발이 <b class="c-caut">20:40</b>으로 30분 늦춰집니다.</p>
      <dl class="ldr"><div class="ldr__row"><dt>대상 기체</dt><dd>HL5404</dd></div><div class="ldr__row"><dt>대체 기체</dt><dd>HL5402 · SoC 64%</dd></div><div class="ldr__row"><dt>영향 승객</dt><dd>3명</dd></div></dl>
    </div>
    <div class="modal__foot"><button type="button" class="skey" data-close>취소</button><button type="button" class="skey skey--danger" data-guard data-close data-toast="status" data-toast-code="AC SWAP" data-toast-text="SG120 기체를 HL5402로 교체했습니다."><span class="skey__label">운항 불가 확정</span></button></div>
  </div>
</div>
```
중앙 560px, 상단 램프 띠: 일반 = 흰 글자 줄, `modal--warn` 빨강 램프(파괴적 확인), `modal--caut` 앰버. 240ms 위아래로 열림, 스크림 클릭·Esc 닫기, 포커스 트랩·복귀. 모바일에서는 아래에 붙고 하단 버튼 전폭. 정적 견본은 drawer와 같은 방법(`is-open data-static`).

### 19. motion — 셀프테스트 · 롤 · 선 그리기 · 흐름

```html
<section class="du" data-boot>…</section>                           <!-- 셀프테스트 점등(처음 보일 때 1회) -->
<span class="rdo rdo--lg rdo--sel"><span class="roll" data-roll="118">118</span><span class="rdo__unit">KT</span></span>   <!-- 오도미터 -->
<svg class="draw" viewBox="0 0 200 40" aria-hidden="true"><path class="draw__line" pathLength="1" d="M0 35 L40 35 L70 5 L160 5 L200 35" style="fill:none;stroke:var(--select);stroke-width:2"/></svg>
<span class="bus bus--on"></span> <span class="bus bus--v bus--on"></span>   <!-- 전원 들어온 계통선 흐름 -->
<path class="flow" d="…" style="fill:none;stroke:var(--ok)"/>                 <!-- SVG 계통 흐름 -->

<!-- 시연 칸 -->
<div class="motion"><div class="motion__head"><span class="motion__name">셀프테스트 점등</span><button type="button" class="skey skey--compact" data-motion-play="mt1">다시 재생</button></div><div class="motion__stage" id="mt1">…</div><p class="motion__spec">480MS · STEPS(4)</p></div>
```
숫자 바꾸기: `Solgae.roll(el, '120')` 또는 `data-roll-seq="118|120|096"` + `[data-roll-demo="id"]`. 점멸은 마스터 경고 램프 하나뿐(`master-blink`), 다른 곳에 쓰지 않는다. y 이동·튕김 없음. reduced-motion이면 전부 최종 상태.

### 20. navbar — 글레어실드 + FMA

셸 2-1. 현재 페이지 = 초록 박스(작동 중인 비행 모드). 하단 상태 스트립(footer)도 navbar.css에 있다(셸 2-3).

### 21. pagination — 눈금 위 페이지

```html
<nav class="pager" aria-label="운항표 페이지">
  <a class="skey skey--icon" aria-disabled="true" aria-label="이전 페이지"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></a>
  <ol class="pager__scale">
    <li><a class="pager__page" href="dashboard.html" aria-current="page"><span class="pager__win">1</span></a></li>
    <li><a class="pager__page" href="dashboard.html?p=2"><span class="pager__win">2</span></a></li>
    <li><span class="pager__gap">…</span></li>
    <li><a class="pager__page" href="dashboard.html?p=6"><span class="pager__win">6</span></a></li>
  </ol>
  <a class="skey skey--icon" href="dashboard.html?p=2" aria-label="다음 페이지"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a>
  <span class="pager__info">1–12 / 64편</span>
</nav>
```
대눈금 = 페이지, 현재 = 마젠타 리드아웃 창. 480px 이하에서 처음·현재·끝만 남는다.

### 22. popover — 데이터 블록(레이더 표적 태그)

```html
<span class="pop-anchor">
  <button type="button" class="tgt tgt--caut" data-popover-trigger aria-controls="db-sg203" aria-expanded="false" aria-label="SG203 데이터 블록"></button>
  <div class="pop pop--caut" id="db-sg203" role="dialog" aria-label="SG203 데이터 블록" hidden>
    <div class="pop__l1">SG203 <span class="lamp lamp--caut lamp--sm lamp--code">CAUT</span></div>
    <div class="pop__l2">015 · 118KT · 0</div>
    <div class="pop__l3">→ YDP 19:47</div>
    <p class="pop__note">배터리 2 셀 41°C — 도착 후 점검</p>
  </div>
</span>
```
3줄: 편명 / 고도(백 ft, 015 = 1,480ft)·지면속도·수직속도 / 목적지·도착시각(마젠타). 기준점에서 45° 인출선. 화면 오른쪽 끝 `pop--left`, 아래로 `pop--below`. 바깥 클릭·Esc 닫기. 표적 기호 `.tgt`(정상) / `.tgt--caut`.

### 23. progress — 테이프 · 행형 테이프 · 세로 테이프 · 원호 게이지

```html
<!-- 가로 테이프 + 리드아웃 창 + 목표 마커 -->
<div class="tape tape--soc" data-zones="soc" style="--val:64" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" aria-label="HL5402 충전 64%, 목표 80%">
  <div class="tape__head"><span class="tape__label">HL5402 충전</span><span class="tape__note">목표 80% · YDP 충전기 Y2</span></div>
  <div class="tape__body"><span class="tape__rdo rdo rdo--sm rdo--ptr-b">64<span class="rdo__unit">%</span></span><div class="tape__track"><span class="tape__fill"></span><span class="tape__goal" style="--goal:80"></span></div></div>
  <div class="tape__scale"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
</div>

<!-- 행형(기체 8대 SoC) -->
<div class="tape tape--row tape--soc" data-zones="soc" style="--val:47" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="47" aria-label="HL5406 배터리 47%"><span class="tape__label">HL5406</span><div class="tape__body"><div class="tape__track"><span class="tape__fill"></span></div></div><span class="tape__rdo rdo rdo--sm">47<span class="rdo__unit">%</span></span></div>

<!-- 세로 진행 테이프(체크리스트) -->
<div class="vtape" data-chk-progress="pre" style="--val:40" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" aria-label="비행 전 점검 진행"><span class="vtape__scale"></span><span class="vtape__fill"></span><span class="vtape__rdo rdo rdo--sm rdo--ok rdo--ptr-l">40<span class="rdo__unit">%</span></span></div>

<!-- 원호 게이지(SoC) -->
<div class="gauge" data-zones="soc" style="--val:47" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="47" aria-label="HL5406 배터리 잔량 47%">
  <svg class="gauge__svg" viewBox="0 0 120 120" aria-hidden="true"><circle class="gauge__track" cx="60" cy="60" r="52" pathLength="360"/><circle class="gauge__zone gauge__zone--warn" cx="60" cy="60" r="52" pathLength="360"/><circle class="gauge__zone gauge__zone--caut" cx="60" cy="60" r="52" pathLength="360"/><circle class="gauge__zone gauge__zone--ok" cx="60" cy="60" r="52" pathLength="360"/><circle class="gauge__ticks" cx="60" cy="60" r="44" pathLength="360"/></svg>
  <span class="gauge__needle"></span><span class="gauge__rdo">47<small>%</small></span><span class="gauge__label">SOC</span>
</div>
```
`data-zones="soc"`이면 값에 따라 색이 자동: 35% 이상 초록 · 25–35 앰버 · 25 미만 빨강(팩트 시트 배터리 경계). 그 외 색은 `tape--ok/caut/warn/tgt`(기본 시안), `gauge--ok/caut/warn`. 값 미정 = `aria-busy="true"`(눈금 흐름). 값 변경 `Solgae.setProgress(el, 72)` 또는 `[data-progress-demo="id"][data-value]`. 작은 게이지 `gauge--sm`.

세로 테이프 `.vtape`는 `height: 100%`(최소 240px)다. **부모 높이를 고정**하거나(`.chkx__tape .vtape { height: 440px }`처럼 직접 높이 지정) `.stack` 안에 두어야 한다. `align-items: stretch`로 늘어난 DU·그리드 칸 안에 그대로 두면 칸 높이만큼(1000px 이상) 늘어난다.

### 24. sidebar — 계기 선택 레일

`.rail`은 페이지 셸에서 `position: sticky`로 글레어실드 아래에 붙는다. 견본·카드 안에 레일을 놓을 때는 **`rail rail--static`**을 쓴다(장면 CSS에서 position을 덮어쓰지 않는다).

셸 2-2. 상태: 현재 `aria-current="page"`(또는 페이지 안 전환이면 `aria-selected="true"`) = 마젠타 왼쪽 레일, 호버 시안, 눌림 `--pressed`, 비활성 `aria-disabled="true"` 점선, 숫자 창은 `.cnt`를 키 안에 두면 우상단에 고정.

### 25. skeleton — 관성항법 정렬 중(ALIGN)

```html
<div class="align" aria-busy="true" aria-label="운항표 불러오는 중">
  <div class="align__head"><span class="align__code">ALIGN</span><span class="align__text">관성항법 정렬 중</span><span class="align__sec">07<small>S</small></span></div>
  <span class="align__line align__line--lg" style="--w:60%"></span>
  <span class="align__line"></span>
  <span class="align__line" style="--w:80%"></span>
  <span class="align__line align__line--block"></span>
</div>
```
회색 덩어리 대신 들어올 내용 폭(`--w`)만큼 눈금이 흐르는 줄. 표 행 자리는 `.align__rows`로 묶는다.

### 26. spinner — 방위 나침 링

```html
<span class="loading" role="status"><span class="compass" aria-hidden="true"></span><span class="t-code">HDG</span> 기상 자료 수신 중</span>
```
12분할 눈금 중 한 칸만 점등되어 30°씩 회전. `compass--sm`(20) · 기본 40 · `compass--lg`(64) · `compass--caut`. 버튼 안 처리 중은 `aria-busy="true"`가 같은 링을 그린다.

### 27. steps — 비행 단계

```html
<ol class="phase" aria-label="SG203 비행 단계">
  <li class="phase__item" data-state="done"><span class="phase__code">GND</span><span class="phase__name">지상</span></li>
  <li class="phase__item" data-state="done"><span class="phase__code">TO</span><span class="phase__name">이륙</span><span class="phase__sub">19:30</span></li>
  <li class="phase__item" data-state="done"><span class="phase__code">CLB</span><span class="phase__name">상승</span></li>
  <li class="phase__item" aria-current="step"><span class="phase__code">CRZ</span><span class="phase__name">순항</span><span class="phase__sub">19:42</span></li>
  <li class="phase__item"><span class="phase__code">DES</span><span class="phase__name">강하</span></li>
  <li class="phase__item"><span class="phase__code">LDG</span><span class="phase__name">착륙</span><span class="phase__sub">19:47</span></li>
</ol>
```
지난 단계 초록, 현재 마젠타 창, 다음 흰 선. 세로형 `phase--v`(onboarding 5단계). 단계가 링크면 `<a class="phase__item" href="…">`. 모바일 가로형은 스크롤 + 페이드.

### 28. table — 운항표

```html
<section class="du du--flush">
  <div class="du__head"><span class="du__code">OPS</span><h2 class="du__title">오늘 밤 운항표</h2><span class="du__meta" id="ops-sel"></span></div>
  <div class="du__body">
    <div class="tbl-wrap tbl-wrap--stack">
      <table class="tbl tbl--stack" data-table-select="ops-sel">
        <thead><tr>
          <th class="tbl__check"><label class="check"><input type="checkbox" class="check__input" aria-label="전체 선택"><span class="check__lamp" aria-hidden="true"></span></label></th>
          <th class="tbl__no"><span class="th__code">#</span></th>
          <th aria-sort="ascending"><button type="button" class="tbl__sort"><span><span class="th__code">FLT</span><span class="th__ko">편명</span></span></button></th>
          <th><span class="th__code">ROUTE</span><span class="th__ko">구간</span></th>
          <th class="num"><button type="button" class="tbl__sort"><span><span class="th__code">STD</span><span class="th__ko">출발</span></span></button></th>
          <th class="num"><span class="th__code">STA</span><span class="th__ko">도착</span></th>
          <th><span class="th__code">REG</span><span class="th__ko">기체</span></th>
          <th><span class="th__code">CAPT</span><span class="th__ko">기장</span></th>
          <th class="num"><span class="th__code">PAX</span><span class="th__ko">탑승</span></th>
          <th><span class="th__code">STS</span><span class="th__ko">상태</span></th>
        </tr></thead>
        <tbody>
          <tr class="is-caut">
            <td class="tbl__check"><label class="check"><input type="checkbox" class="check__input" aria-label="SG120 선택"><span class="check__lamp" aria-hidden="true"></span></label></td>
            <td class="tbl__no">10</td>
            <td class="tbl__keep tbl__flight">SG120</td>
            <td data-label="구간">GMP→JSL</td>
            <td class="num" data-label="출발" data-sort="20:40">20:10 <span class="tbl__chg">20:40</span></td>
            <td class="num" data-label="도착">20:54</td>
            <td class="mono" data-label="기체">HL5402</td>
            <td data-label="기장">박도현</td>
            <td class="num" data-label="탑승">3/4</td>
            <td class="tbl__keep"><span class="lamp lamp--caut lamp--sm">지연 30분</span></td>
            <td class="tbl__exp"><button type="button" class="skey skey--icon skey--quiet" aria-expanded="false" aria-label="SG120 상세"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></td>
          </tr>
          …
        </tbody>
      </table>
    </div>
  </div>
</section>
```
헤더 = 라틴 코드 + 한글 두 줄, 숫자·시각 우측 정렬. 행 호버 = 시안 왼쪽 레일, 선택 = 시안 면(체크박스, `data-table-select` 출력에 "N편 선택"), 현재 `aria-current="true"` 마젠타 레일, 주의 행 `is-caut`, 경고 행 `is-warn`, 흐린 행 `is-muted`. 정렬 = `.tbl__sort` 버튼(숫자·시각은 숫자 비교, `data-sort`로 정렬값 지정). 모바일(`tbl--stack`): `.tbl__keep` 칸(편명·상태)만 남고 펼침 버튼으로 나머지를 `data-label`과 함께 보인다. 처리 중 `tbl-wrap[aria-busy="true"]`.

열 폭은 `<thead>` 앞 `<colgroup>`으로 고정한다(자동 분배 금지 — ROUTE→STD, REG→CAPT 사이에 죽은 공간이 생긴다): `tbl__col--chk 44 · --no 48 · --flt 96 · --route 128 · --time 96(STD·STA) · --reg 200(대체 표기 포함) · --capt 96 · --pax 64 · STS는 클래스 없는 <col>`로 남는 폭 전부. 표는 `width: 100%`로 DU 끝까지 채운다. `.tbl__exp`(모바일 펼침 칸)는 th·td 모두 데스크톱에서 숨는다. 모바일 `tbl--stack`에서도 `aria-current` 행은 마젠타 왼쪽 레일을 유지한다.

```html
<colgroup><col class="tbl__col--chk"><col class="tbl__col--no"><col class="tbl__col--flt"><col class="tbl__col--route"><col class="tbl__col--time"><col class="tbl__col--time"><col class="tbl__col--reg"><col class="tbl__col--capt"><col class="tbl__col--pax"><col></colgroup>
```

### 29. tabs — MFD 상단 소프트키

```html
<div class="tabs" data-tabs>
  <div class="tabs__list" role="tablist" aria-label="MFD 페이지">
    <button type="button" class="tabs__tab" role="tab" id="t-nd" aria-selected="true" aria-controls="p-nd"><span class="tabs__code">ND</span>항로도</button>
    <button type="button" class="tabs__tab" role="tab" id="t-wx" aria-selected="false" aria-controls="p-wx"><span class="tabs__code">WX</span>기상</button>
    <button type="button" class="tabs__tab" role="tab" id="t-batt" aria-selected="false" aria-controls="p-batt"><span class="tabs__code">BATT</span>배터리<span class="cnt cnt--caut" aria-label="주의 1건">1</span></button>
    <button type="button" class="tabs__tab" role="tab" id="t-cam" aria-selected="false" aria-controls="p-cam" disabled><span class="tabs__code">CAM</span>카메라</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="p-nd" aria-labelledby="t-nd" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="p-wx" aria-labelledby="t-wx" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="p-batt" aria-labelledby="t-batt" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="p-cam" aria-labelledby="t-cam" tabindex="0" hidden>…</div>
</div>
```
활성 = 마젠타 테두리 + 하단 2px, ←/→ Home End roving(세로형은 ↑↓도). 세로 레일형 `tabs tabs--rail`(settings: 화면 / 단위 / 경고음 / 계정) — 모바일에서 가로 줄로 바뀐다. 모바일 가로 스크롤 + 페이드.

### 30. timeline — 비행 프로필 · 로그북

```html
<!-- 비행 프로필(수직 단면) -->
<div class="prof">
  <div class="prof__plot"><span class="prof__alt" style="top:0">1,500FT</span><span class="prof__alt" style="top:100%">0</span>
    <svg class="prof__svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path class="prof__area" d="M0 40 L12 40 L25 2 L70 2 L88 40 L100 40 Z"/><path class="prof__line prof__line--done" d="M0 40 L12 40 L25 2 L52 2"/><path class="prof__line prof__line--plan" d="M52 2 L70 2 L88 40 L100 40"/></svg>
    <span class="prof__now" style="--t:52;--y:5" aria-hidden="true"></span></div>
  <div class="prof__axis"><span class="prof__tick" style="--t:0">19:28</span><span class="prof__tick" style="--t:50">19:38</span><span class="prof__tick" style="--t:100">19:47</span></div>
  <div class="prof__events">
    <div class="prof__evt prof__evt--done" style="--t:12"><time>19:30</time>이륙</div>
    <div class="prof__evt prof__evt--caut" style="--t:40"><time>19:39</time>BATT 2 TEMP</div>
    <div class="prof__evt prof__evt--now" style="--t:60"><time>19:42</time>IC3 통과</div>
    <div class="prof__evt prof__evt--end" style="--t:100"><time>19:47</time>여의도 착륙</div>
  </div>
</div>

<!-- 로그북(세로) -->
<ol class="log">
  <li class="log__item log__item--done"><span class="log__time">17:44</span><span class="log__axis"></span><div class="log__body"><p class="log__title">교범 3장 개정안 감수 완료</p><p class="log__text">강태린 수석 기장</p></div></li>
  <li class="log__item log__item--caut"><span class="log__time">19:31</span><span class="log__axis"></span><div class="log__body"><p class="log__title"><span class="t-mono">HL5404</span>운항 불가 확정</p><p class="log__text">정비 오민혁 — SG120 기체 교체 요청</p></div></li>
  <li class="log__item log__item--now"><span class="log__time">19:42</span><span class="log__axis"></span><div class="log__body"><p class="log__title">지금</p><p class="log__text">비행 중 3편 · 지연 1편</p></div></li>
</ol>
```
`--t`는 시간축 위치(%), `--y`는 고도 위치(위 0%). 지난 구간 초록 선, 계획 구간 점선, 현재 마젠타 기체 표지. 사건: `--done` 초록 · `--now` 마젠타 · `--caut` 앰버 · 마지막 사건은 `--end`(오른쪽 정렬). SVG 선 색은 CSS 클래스로만 칠한다(presentation attribute에 var() 금지). 로그북 `log__item--warn`도 있다.

### 31. toast — CAS 메시지 추가

```html
<button type="button" class="skey" data-toast="caution" data-toast-code="BATT 2 TEMP" data-toast-text="배터리 2 온도 높음 — 셀 41°C" data-toast-sub="HL5406 · SG203">주의 발생</button>
<script>/* 또는 */ Solgae.toast({ level: 'advisory', code: 'WIND R1', text: '22시 이후 한강 회랑 돌풍 20kt 예상' });</script>
```
레벨 `warning | caution | advisory | status`. 우상단(글레어실드 아래) 위로 쌓임, 최대 5개, 80ms 램프 점등. 권고·상태 = 6초 뒤 자동 닫힘(하단 타이머 바, 호버 시 정지, `role="status"`), 주의·경고 = "확인" 누를 때까지 유지(`role="alert"`). 경고 토스트는 마스터 경고 모드를, 주의 토스트는 MASTER CAUT 점등을 함께 켠다. 마크업은 alert의 `.cas`를 그대로 쓴다.

### 32. tooltip — 리드아웃 창

```html
<span class="tip-anchor">
  <button type="button" class="skey" aria-describedby="tip-qnh">QNH 1021</button>
  <span class="tip" role="tooltip" id="tip-qnh"><b class="tip__code">QNH</b>기압 보정값 — 김포 METAR</span>
</span>
```
호버와 포커스 모두에서 표시, Esc로 숨김. 아래로 `tip--below`, 왼쪽 끝 `tip--start`, 오른쪽 끝 `tip--end`. 정적으로 열린 견본은 `tip is-open`.

---

## 6. 리드아웃 창 `.rdo` (시그니처 1)

```html
<span class="rdo rdo--md rdo--ptr-r">118<span class="rdo__unit">KT</span></span>          <!-- 속도 테이프 창: 오른쪽 포인터 -->
<span class="rdo rdo--md rdo--sel rdo--ptr-l">1,480<span class="rdo__unit">FT</span></span>  <!-- 조종사 선택값 = 시안 -->
<span class="rdo rdo--md rdo--tgt">IC4</span>                                             <!-- 목표 웨이포인트 = 마젠타 -->
<div class="rdo rdo--xl rdo--ok">97.9<span class="rdo__unit">%</span></div>              <!-- 정시율 초대형 -->
```
크기 `rdo--sm`(13) · `--md`(20) · `--lg`(44) · `--xl`(96, 모바일 56). 포인터 `rdo--ptr-l/r/t/b`. 의미색 `--sel --tgt --ok --caut --warn`, 창 없이 숫자만 `rdo--bare`. 두 창을 나란히 둘 때는 포인터가 서로를 향하지 않게 간격(≥ 16px)을 둔다.

---

## 7. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` (+ 안쪽 `[data-theme-label]`) | 야간/주간 전환, localStorage `solgae-theme`. 우선순위 `?theme=` > 저장값 > 시스템 |
| `[data-theme-set="light|dark"]` | 2칸 세그먼트 소프트키(`.seg`) — 누르면 그 모드로, `aria-pressed`는 늘 현재 `data-theme`을 따른다(설정 화면 "화면 모드") |
| `details[data-fold-sm]` | 480 이하에서 접힌 채 시작, 넓은 화면은 늘 펼침(요약 줄은 클릭 불가). index의 PFD 해설·토큰 묶음·CAS 기록·계통 장면 범례 |
| `[data-modal-open="id"]` · `[data-drawer-open="id"]` · `[data-command-open]` · ⌘K | 레이어 열기(포커스 트랩·스크롤 잠금·Esc·스크림 닫기·포커스 복귀) |
| `[data-close]` | 가장 가까운 모달/드로어/커맨드 닫기(떠 있는 메뉴·팝오버면 그것) |
| `[data-popover-trigger]` · `[data-menu-trigger]` + `aria-controls` | 팝오버·메뉴 토글 |
| `[data-tabs]` · `[data-accordion]` · `[data-carousel]` · `[data-calendar]` · `[data-kanban]` · `table.tbl` · `form[data-validate]` · `.slider` · `[data-checklist]` · `.code` · `.atis` | 각 컴포넌트 초기화 |
| `[data-toast="level"]` + `data-toast-code/-text/-sub` | CAS 토스트 |
| `[data-guard]` | 해치 가드 2단계 실행 |
| `[data-cas-ack]` · `[data-dismiss]` | CAS 확인 / 닫기 |
| `.mlamp` · `[data-master-demo]` · `[data-lamp-test]` | 마스터 램프 확인 / 경고 시연 / 램프 시험 1.5초 |
| `[data-busy-demo]` · `[data-progress-demo]` · `[data-roll-demo]` · `[data-motion-play]` · `[data-marquee-toggle]` · `[data-copy]` · `[data-toggle-group]` · `.switch[role=switch]` | 시연·보조 동작 |
| `[data-clock="utc|kst|kst-hm"]` | 기준 시각부터 흐르는 시계 |
| `[data-boot]` · `.draw` | 처음 보일 때 셀프테스트 점등 / 선 그리기. 로드 시 뷰포트 안·위에 있는 것은 즉시 점등, `load` 뒤 1.2초면 남은 것 전부 점등, 인쇄(`beforeprint`·`print` 미디어)에서도 전부 점등 — 스크롤 없는 전체 캡처에 빈 칸이 생기지 않는다 |
| `[data-tabs]` 선택 | 사용자가 조작할 때만 탭을 화면 안으로 스크롤(로드 시 페이지가 끌려 내려가지 않음). 고른 탭이 `rows__item--unread`면 읽음 처리 |
| `[data-lost-path]` | 404 — 서버가 없는 주소에 404를 내줄 때 실제 요청 경로(`location.pathname` + `search`)를 `<code>`에 표시. `?from=/경로`가 있으면 그 값. 404 파일을 직접 열었을 때(`/404.html`, `file:`)는 정적 기본값 `/pages/fleet-map.html`을 그대로 둔다 — 파일명이 새지 않게 |
| `[data-roll]` · `[data-roll-seq]` | 오도미터 숫자 |
| `.scrolltape` + `[data-tape-label]` | 스크롤 위치 테이프 |

JS API: `Solgae.toast(opt)`, `Solgae.setProgress(el, v)`, `Solgae.setTheme('dark'|'light')`, `Solgae.open(id)`, `Solgae.close(id)`, `Solgae.roll(el, text)`, `Solgae.zulu()`, `Solgae.init(scope)`(동적으로 넣은 마크업 초기화).
이벤트: `guard:fire`, `form:ok`, `kanban:move`, `toggle:change`, `switch:change`.

---

## 8. 장면 작업자 체크리스트

- 셸 2-1 ~ 2-5를 그대로 복사했고, 바꾼 것은 현재 표시(`aria-current`, `.glare__mode`)와 상대 경로뿐인가.
- 날짜·요일·시각·편명·기체·인물·금액이 DIRECTION 팩트 시트와 일치하는가(기준 2026년 11월 6일(금) 19:42 KST, 오늘 64편·완료 47·정시율 97.9%·비행 중 SG203·SG114·SG305·지연 SG120 30분).
- 한글이 `.t-code`나 넓은 자간에 들어가지 않았는가.
- 빈 칸 표시에 □ 같은 글리프를 쓰지 않았는가(`input--seg` + `placeholder=" "`).
- 색이 규약을 지키는가(현재 위치 마젠타, 선택·주 조작 시안, 정상 초록, 주의 앰버, 경고 빨강).
- DU 간격이 6px / 24px 둘뿐인가, 같은 그리드 구도를 연속 두 번 쓰지 않았는가.
- 1440 · 390 × 야간 · 주간 네 장을 찍어 가로 넘침 0, 터치 타깃 44px을 눈으로 확인했는가.

---

## 8. 계통 장면 문법 (index 전용, 수정 2)

컴포넌트를 같은 노드 패널에 하나씩 담아 반복하지 않는다. 한 계통을 실물 패널 한 장으로 합성할 때 쓰는 클래스(`index.css`):

| 클래스 | 역할 |
|---|---|
| `.scene` (+ `.node w12`) · `.scene__plate` · `.scene__t` · `.scene__m` | 장면 한 장과 그 명판(라틴 코드 · 한글 제목 · 치수 메모) |
| `.zone` · `.zone__tag` · `.zone__no` · `.zone__code` · `.zone__ko` | 패널 위 점선 각인 구역과 각인 이름표. `id="n-…"`는 구역에 둔다(PFD 인출선 링크 대상) |
| `.scene__legend` (+ `details.scene__fold[data-fold-sm]`) | 구역 번호 범례 — 해설은 여기로 모은다 |
| `.ckpt` · `.ckpt__glare` · `.ckpt__mfd` · `.ckpt__rail` · `.ckpt__screen` | NAV — 글레어실드 + 레일 + 다기능 화면 |
| `.ovp` · `.ovp__screw` · `.ovp__cas` · `.ovp__col` · `.ovp__guard` · `.guardsw` · `.ovp__flags` | CAS — 오버헤드 패널 |
| `.logbook` · `.logbook__page--l/--r` · `.logbook__gutter` · `.logbook__rubric` · `.logbook__folio` | REC — 기록부 펼침면 |
| `.node-col` · `.sys__row--fill` · `.node--fill` | 짧은 노드 둘을 한 열에 직렬로 쌓고, 옆 노드는 남는 높이를 내용으로 채운다(빈 칸 방지) |
| `.legs` · `.leg` · `.leg--from` · `.leg--lost` · `.leg__a` | FMS LEGS 페이지 선택 |
