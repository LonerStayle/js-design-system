# 몽돌 오디오 · 컴포넌트 마크업 계약

다음 단계(index.html, pages/*.html) 에이전트는 **이 문서와 `DIRECTION.md`(세계관·팩트 시트)만 보고** 마크업한다.
수치·이름·날짜는 DIRECTION.md 팩트 시트 값만 쓴다 — 기준 **2026년 10월 16일 금요일 20:40**, 라이트/다크는 시각이 아니라 조명만 다르다(모드별 시각 분기 금지).

- 클래스는 BEM(`block__elem--mod`). 상태는 가능한 한 **ARIA 속성**(`aria-pressed`, `aria-selected`, `aria-current`, `aria-expanded`, `aria-invalid`, `aria-busy`, `aria-disabled`)으로 표현하고 CSS가 그 속성을 읽는다.
- 인라인 `style`은 **CSS 변수 주입에만**(`--v`, `--i`, `--n`, `--h`, `--ticks`). 인라인 grid-template-columns, onclick, `href="#"` 금지.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 의미 토큰만(`--surface`, `--ink-2`, `--sh-raised` …). `tokens.css` 원시값(`--granite-*`, `--basalt-*`)·hex 금지.
- SVG presentation attribute에 `var()` 금지 → `style="stroke:var(--ink-2)"` 또는 `currentColor`.
- 아이콘은 `<span data-icon="이름"></span>`(app.js가 SVG로 채움). 이모지 금지. 아이콘만 있는 버튼은 `aria-label` 필수.
- **깊이 = 만질 수 있음.** 누를 수 있는 것만 솟는다(`.key`, `.module--press`, `.chip` …). 정적 정보는 면(0) + 홈(groove)으로만 구획한다. 값이 들어가는 곳은 파인 우물(−).
- **색은 세 곳에만**: 주황 키(화면당 1개, `.key--orange`) · LED(`.led`) · 앰버 LCD(`.lcd`). 상태를 색 면 채우기로 알리지 않는다.
- 라틴 각인 레전드(`.legend`, 대문자 +0.14em)와 모노(`.mono`, `.lcd`)는 **라틴·숫자에만**. 한글 각인은 `.legend-ko`(자간 0). LCD 안 한글은 `<span class="ko">`로 분리.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>내 청음실 · 몽돌</title>
<meta name="description" content="…">
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('md-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@500;600&family=Noto+Sans+KR:wght@400;500;700&family=Orbit&family=Share+Tech+Mono&display=swap">
<link rel="stylesheet" href="../styles.css">     <!-- index 는 styles.css -->
<link rel="stylesheet" href="dashboard.css">     <!-- 장면 전용: index 는 index.css, 페이지는 pages/<name>.css -->
<script src="../app.js" defer></script>          <!-- index 는 app.js -->
</head>
```
- `localStorage` 키 **`md-theme`**. URL `?theme=dark|light`가 최우선(저장하지 않음).
- `<title>` 형식: `<페이지 이름> · 몽돌`. index는 `몽돌 M1 사용설명서`.
  페이지 이름: 내 청음실 · 몽돌 고객지원 · AS 수리 보드 · M1 처음 켜기 · 구성 고르기 · 몽돌 M1 · 윤하람의 청음 기록 · 기기 설정 · 신호 없음

### body 골격 (순서 고정)
```html
<body>
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<!-- 1. 상단 면판 띠 (§1-1) -->
<main id="main"> … </main>                         <!-- 사이드바 페이지는 §1-3 의 .app-shell 이 main 을 감싼다 -->
<!-- 2. 바닥 명판 (§1-2) -->
<!-- 3. 공통 오버레이: 커맨드 팔레트 (§1-4) + 이 페이지의 모달·서랍 -->
</body>
```
- 모달·서랍·커맨드 팔레트는 **body 직속**에 둔다(고정 위치 + 덮개). 메뉴·팝오버는 트리거 옆 `.menu-anchor` 안에 둔다.
- 토스트 스택은 app.js가 필요할 때 body 끝에 만든다(마크업 불필요).

---

## 1. 복사해서 쓰는 셸 스니펫 (전 페이지 동일 — 고치지 말고 그대로 붙인다)

경로 규칙: index는 `pages/xxx.html`, pages 안에서는 `xxx.html` 과 `../index.html`.
현재 페이지 표시는 **해당 `<a>`에 `aria-current="page"` 하나만** 옮긴다(띠 키·화면 목록 메뉴·명판 키 세 곳). 띠 키 5개에 없는 페이지(inbox, kanban, onboarding, profile, 404)는 띠 키에는 표시하지 않고 메뉴·명판에만 표시한다.

### 1-1. 상단 면판 띠 (navbar)

**index.html 용**
```html
<header class="topbar">
  <div class="topbar__in wrap wrap--wide">
    <a class="wordmark" href="index.html" data-scene="manual" aria-label="몽돌 M1 사용설명서 첫 화면"><span class="led" aria-hidden="true"></span><span class="wordmark__name">mongdol</span><span class="wordmark__sub"><span class="led" aria-hidden="true"></span><span>사용설명서 · 제2판</span></span></a>
    <nav class="topbar__nav" aria-label="주요 화면">
      <ul class="topbar__keys">
        <li><a class="topbar__key" href="index.html" aria-current="page"><span class="led"></span>사용설명서</a></li>
        <li><a class="topbar__key" href="pages/dashboard.html"><span class="led"></span>내 청음실</a></li>
        <li><a class="topbar__key" href="pages/product.html"><span class="led"></span>몽돌 M1</a></li>
        <li><a class="topbar__key" href="pages/pricing.html"><span class="led"></span>구성 고르기</a></li>
        <li><a class="topbar__key" href="pages/settings.html"><span class="led"></span>기기 설정</a></li>
      </ul>
    </nav>
    <div class="topbar__end">
      <button class="key key--icon" type="button" data-command-open aria-label="찾기 (⌘K)"><span data-icon="search"></span></button>
      <button class="daynight" type="button" role="switch" aria-checked="false" data-theme-toggle aria-label="야간 조명으로 전환"><span class="daynight__legend">주간</span><span class="daynight__track"><span class="daynight__thumb"></span></span><span class="daynight__legend">야간</span></button>
      <div class="menu-anchor">
        <button class="key key--icon" type="button" data-menu="menu-screens" aria-label="화면 목록"><span data-icon="grid"></span></button>
        <div class="menu" id="menu-screens" aria-label="화면 목록" data-align="end">
          <p class="menu__label">화면 목록</p>
          <a class="menu__item" href="index.html" aria-current="page"><span data-icon="book"></span>M1 사용설명서<span class="led"></span></a>
          <a class="menu__item" href="pages/dashboard.html"><span data-icon="knob"></span>내 청음실<span class="led"></span></a>
          <a class="menu__item" href="pages/profile.html"><span data-icon="user"></span>청음 기록<span class="led"></span></a>
          <a class="menu__item" href="pages/settings.html"><span data-icon="settings"></span>기기 설정<span class="led"></span></a>
          <a class="menu__item" href="pages/onboarding.html"><span data-icon="power"></span>M1 처음 켜기<span class="led"></span></a>
          <div class="menu__sep" role="separator"></div>
          <a class="menu__item" href="pages/product.html"><span data-icon="speaker"></span>몽돌 M1<span class="led"></span></a>
          <a class="menu__item" href="pages/pricing.html"><span data-icon="tag"></span>구성 고르기<span class="led"></span></a>
          <div class="menu__sep" role="separator"></div>
          <a class="menu__item" href="pages/inbox.html"><span data-icon="inbox"></span>고객지원 받은편지함<span class="led"></span></a>
          <a class="menu__item" href="pages/kanban.html"><span data-icon="wrench"></span>AS 수리 보드<span class="led"></span></a>
          <a class="menu__item" href="pages/404.html"><span data-icon="signal"></span>신호 없음(404)<span class="led"></span></a>
        </div>
      </div>
    </div>
  </div>
</header>
```

**pages/*.html 용** — 경로만 다르다. `aria-current="page"`는 그 페이지의 띠 키(있다면)·메뉴 항목으로 옮긴다(아래는 dashboard 기준).
```html
<header class="topbar">
  <div class="topbar__in wrap wrap--wide">
    <a class="wordmark" href="../index.html" data-scene="control" aria-label="몽돌 M1 사용설명서 첫 화면"><span class="led" aria-hidden="true"></span><span class="wordmark__name">mongdol</span><span class="wordmark__sub"><span class="led" aria-hidden="true"></span><span>몽돌 컨트롤</span></span></a>
    <nav class="topbar__nav" aria-label="주요 화면">
      <ul class="topbar__keys">
        <li><a class="topbar__key" href="../index.html"><span class="led"></span>사용설명서</a></li>
        <li><a class="topbar__key" href="dashboard.html" aria-current="page"><span class="led"></span>내 청음실</a></li>
        <li><a class="topbar__key" href="product.html"><span class="led"></span>몽돌 M1</a></li>
        <li><a class="topbar__key" href="pricing.html"><span class="led"></span>구성 고르기</a></li>
        <li><a class="topbar__key" href="settings.html"><span class="led"></span>기기 설정</a></li>
      </ul>
    </nav>
    <div class="topbar__end">
      <button class="key key--icon" type="button" data-command-open aria-label="찾기 (⌘K)"><span data-icon="search"></span></button>
      <button class="daynight" type="button" role="switch" aria-checked="false" data-theme-toggle aria-label="야간 조명으로 전환"><span class="daynight__legend">주간</span><span class="daynight__track"><span class="daynight__thumb"></span></span><span class="daynight__legend">야간</span></button>
      <div class="menu-anchor">
        <button class="key key--icon" type="button" data-menu="menu-screens" aria-label="화면 목록"><span data-icon="grid"></span></button>
        <div class="menu" id="menu-screens" aria-label="화면 목록" data-align="end">
          <p class="menu__label">화면 목록</p>
          <a class="menu__item" href="../index.html"><span data-icon="book"></span>M1 사용설명서<span class="led"></span></a>
          <a class="menu__item" href="dashboard.html" aria-current="page"><span data-icon="knob"></span>내 청음실<span class="led"></span></a>
          <a class="menu__item" href="profile.html"><span data-icon="user"></span>청음 기록<span class="led"></span></a>
          <a class="menu__item" href="settings.html"><span data-icon="settings"></span>기기 설정<span class="led"></span></a>
          <a class="menu__item" href="onboarding.html"><span data-icon="power"></span>M1 처음 켜기<span class="led"></span></a>
          <div class="menu__sep" role="separator"></div>
          <a class="menu__item" href="product.html"><span data-icon="speaker"></span>몽돌 M1<span class="led"></span></a>
          <a class="menu__item" href="pricing.html"><span data-icon="tag"></span>구성 고르기<span class="led"></span></a>
          <div class="menu__sep" role="separator"></div>
          <a class="menu__item" href="inbox.html"><span data-icon="inbox"></span>고객지원 받은편지함<span class="led"></span></a>
          <a class="menu__item" href="kanban.html"><span data-icon="wrench"></span>AS 수리 보드<span class="led"></span></a>
          <a class="menu__item" href="404.html"><span data-icon="signal"></span>신호 없음(404)<span class="led"></span></a>
        </div>
      </div>
    </div>
  </div>
</header>
```
- 띠는 `position: sticky`. ≤ 960px 에서 띠 키 열은 숨고 화면 목록 메뉴 키가 이동을 맡는다. ≤ 600px 에서 주간/야간 글자는 숨고 스위치만 남는다.
- 띠에는 주황 채움 키를 두지 않는다(화면당 1개 원칙). 띠의 주황은 워드마크 앞 전원 LED 하나.
- **장면 부제는 페이지마다 다르다** — `wordmark`의 `data-scene`과 `wordmark__sub` 글자를 아래 표대로 바꾼다. 띠 키 열에 없는 화면은 부제 앞 LED를 켜서(`<span class="led is-on">`) 현재 위치를 알린다(≤ 1100px에서도 이 경우만 부제를 남긴다, ≤ 600px 숨김).

  | 페이지 | data-scene | wordmark__sub | 부제 LED |
  |---|---|---|---|
  | index | `manual` | 사용설명서 · 제2판 | 꺼짐 (띠 키 LED가 위치 표시) |
  | dashboard | `control` | 몽돌 컨트롤 | 꺼짐 (띠 키 LED가 위치 표시) |
  | settings | `control` | 몽돌 컨트롤 | 꺼짐 (띠 키 LED가 위치 표시) |
  | profile | `control` | 몽돌 컨트롤 · 청음 기록 | **켜짐** (`.led.is-on`) |
  | onboarding | `control` | 몽돌 컨트롤 · 처음 켜기 | **켜짐** (`.led.is-on`) |
  | product | `store` | 몽돌 스토어 | 꺼짐 (띠 키 LED가 위치 표시) |
  | pricing | `store` | 몽돌 스토어 | 꺼짐 (띠 키 LED가 위치 표시) |
  | inbox | `support` | 고객지원 콘솔 | **켜짐** (`.led.is-on`) |
  | kanban | `service` | AS센터 · 수리 보드 | **켜짐** (`.led.is-on`) |
  | 404 | `nosignal` | 신호 없음 | **켜짐** (`.led.is-on`) |
- 화면 목록 메뉴·명판 키의 `aria-current="page"`는 그 페이지 하나.

### 1-2. 바닥 명판 (footer — 전 페이지 동일, 다른 푸터를 만들지 않는다)

> 명판의 일련번호는 **형식 표기 `M1-GR-YYMM-#####`(제조 라벨 견본)** 로 고정한다. 바닥 명판은 스토어·고객지원 콘솔·AS 보드에도 붙으므로 특정 고객의 기기 번호를 찍지 않는다. 윤하람의 기기 번호 `M1-GR-2602-04172`는 그녀의 장면(dashboard · profile · settings · onboarding)과 index 사용 예시 안에서만 쓴다.

기기 바닥에 붙은 **각인 라벨 한 장**. 파인 우물(`well-deep`) 판 위에 가운데 정렬로 새긴 줄 — 모델명 `MD-M1` · 정격 · CSS 바코드 일련번호 · 인증 각인(원 KC · 사각 CE · 분리배출) · 제조. **칸 테두리·라벨/값 쌍(정의 목록) 없음.** 아래에 화면 링크 키 열(5열 → 960px 3열 → 600px 2열).

**index.html 용**
```html
<footer class="nameplate">
  <div class="wrap wrap--wide">
    <div class="nameplate__plate">
      <div class="nameplate__label" role="group" aria-label="M1 바닥 명판">
        <p class="nameplate__model">MD-M1</p>
        <p class="nameplate__name">몽돌 M1 데스크톱 스트리밍 앰프</p>
        <p class="nameplate__rating">AC 100–240V 50/60Hz 18W</p>
        <div class="nameplate__serial"><span class="nameplate__barcode" aria-hidden="true"></span><span class="nameplate__sn"><span class="sr-only">일련번호 형식(제조 라벨 견본) </span>M1-GR-YYMM-#####</span></div>
        <ul class="nameplate__certs" aria-label="인증 표시">
          <li class="nameplate__cert nameplate__cert--round">KC</li>
          <li class="nameplate__cert nameplate__cert--square">CE</li>
          <li class="nameplate__cert nameplate__cert--bin"><span class="sr-only">분리배출 표시</span></li>
        </ul>
        <p class="nameplate__maker">MADE BY MONGDOL AUDIO · SEOUL</p>
        <p class="nameplate__fine">몽돌 오디오 주식회사 · 서울 성동구 연무장7길 12, 1층 · 면판 설계 백도윤 · 고객센터 1588-0416(평일 10:00–18:00) · care@mongdol.kr</p>
        <p class="nameplate__fine">© 2026 Mongdol Audio Co., Ltd.</p>
      </div>
      <nav class="nameplate__nav" aria-label="모든 화면">
        <ul class="nameplate__keys">
          <li><a class="nameplate__key" href="index.html" aria-current="page"><span class="led"></span>M1 사용설명서</a></li>
          <li><a class="nameplate__key" href="pages/dashboard.html"><span class="led"></span>내 청음실</a></li>
          <li><a class="nameplate__key" href="pages/profile.html"><span class="led"></span>청음 기록</a></li>
          <li><a class="nameplate__key" href="pages/settings.html"><span class="led"></span>기기 설정</a></li>
          <li><a class="nameplate__key" href="pages/onboarding.html"><span class="led"></span>M1 처음 켜기</a></li>
          <li><a class="nameplate__key" href="pages/product.html"><span class="led"></span>몽돌 M1</a></li>
          <li><a class="nameplate__key" href="pages/pricing.html"><span class="led"></span>구성 고르기</a></li>
          <li><a class="nameplate__key" href="pages/inbox.html"><span class="led"></span>고객지원</a></li>
          <li><a class="nameplate__key" href="pages/kanban.html"><span class="led"></span>AS 수리 보드</a></li>
          <li><a class="nameplate__key" href="pages/404.html"><span class="led"></span>신호 없음</a></li>
        </ul>
      </nav>
    </div>
  </div>
</footer>
```

**pages/*.html 용** — 키 경로만 다르다. `aria-current="page"`는 그 페이지 키 하나(아래는 dashboard 기준).
```html
<footer class="nameplate">
  <div class="wrap wrap--wide">
    <div class="nameplate__plate">
      <div class="nameplate__label" role="group" aria-label="M1 바닥 명판">
        <p class="nameplate__model">MD-M1</p>
        <p class="nameplate__name">몽돌 M1 데스크톱 스트리밍 앰프</p>
        <p class="nameplate__rating">AC 100–240V 50/60Hz 18W</p>
        <div class="nameplate__serial"><span class="nameplate__barcode" aria-hidden="true"></span><span class="nameplate__sn"><span class="sr-only">일련번호 형식(제조 라벨 견본) </span>M1-GR-YYMM-#####</span></div>
        <ul class="nameplate__certs" aria-label="인증 표시">
          <li class="nameplate__cert nameplate__cert--round">KC</li>
          <li class="nameplate__cert nameplate__cert--square">CE</li>
          <li class="nameplate__cert nameplate__cert--bin"><span class="sr-only">분리배출 표시</span></li>
        </ul>
        <p class="nameplate__maker">MADE BY MONGDOL AUDIO · SEOUL</p>
        <p class="nameplate__fine">몽돌 오디오 주식회사 · 서울 성동구 연무장7길 12, 1층 · 면판 설계 백도윤 · 고객센터 1588-0416(평일 10:00–18:00) · care@mongdol.kr</p>
        <p class="nameplate__fine">© 2026 Mongdol Audio Co., Ltd.</p>
      </div>
      <nav class="nameplate__nav" aria-label="모든 화면">
        <ul class="nameplate__keys">
          <li><a class="nameplate__key" href="../index.html"><span class="led"></span>M1 사용설명서</a></li>
          <li><a class="nameplate__key" href="dashboard.html" aria-current="page"><span class="led"></span>내 청음실</a></li>
          <li><a class="nameplate__key" href="profile.html"><span class="led"></span>청음 기록</a></li>
          <li><a class="nameplate__key" href="settings.html"><span class="led"></span>기기 설정</a></li>
          <li><a class="nameplate__key" href="onboarding.html"><span class="led"></span>M1 처음 켜기</a></li>
          <li><a class="nameplate__key" href="product.html"><span class="led"></span>몽돌 M1</a></li>
          <li><a class="nameplate__key" href="pricing.html"><span class="led"></span>구성 고르기</a></li>
          <li><a class="nameplate__key" href="inbox.html"><span class="led"></span>고객지원</a></li>
          <li><a class="nameplate__key" href="kanban.html"><span class="led"></span>AS 수리 보드</a></li>
          <li><a class="nameplate__key" href="404.html"><span class="led"></span>신호 없음</a></li>
        </ul>
      </nav>
    </div>
  </div>
</footer>
```
- 명판 글자·순서·키 10개는 모든 화면에서 같다. 다른 푸터(링크 목록형·판권 정의 목록형)를 만들지 않는다.

### 1-3. 세로 셀렉터 랙 (sidebar — dashboard · settings 공용, pages 전용)

```html
<div class="wrap wrap--wide app-shell">
  <aside class="rack" aria-label="내 M1 메뉴">
    <nav class="rack__bed" aria-label="내 M1">
      <p class="rack__group legend-ko">내 M1 · 윤하람</p>
      <ul class="rack__keys">
        <li><a class="rack__key" href="dashboard.html" aria-current="page"><span class="led"></span><span data-icon="knob"></span><span>내 청음실</span><span class="legend">LIVE</span></a></li>
        <li><a class="rack__key" href="profile.html"><span class="led"></span><span data-icon="user"></span><span>청음 기록</span><span class="legend">LOG</span></a></li>
        <li><a class="rack__key" href="settings.html#output"><span class="led"></span><span data-icon="output"></span><span>출력</span><span class="legend">OUT</span></a></li>
        <li><a class="rack__key" href="settings.html#sound"><span class="led"></span><span data-icon="sliders"></span><span>소리</span><span class="legend">EQ</span></a></li>
        <li><a class="rack__key" href="settings.html#night"><span class="led"></span><span data-icon="night"></span><span>야간 모드</span><span class="legend">NIGHT</span></a></li>
        <li><a class="rack__key" href="settings.html#network"><span class="led"></span><span data-icon="wifi"></span><span>네트워크</span><span class="legend">NET</span></a></li>
        <li><a class="rack__key" href="settings.html#firmware"><span class="led"></span><span data-icon="firmware"></span><span>펌웨어</span><span class="legend">FW</span></a></li>
        <li><a class="rack__key" href="settings.html#account"><span class="led"></span><span data-icon="shield"></span><span>계정</span><span class="legend">ID</span></a></li>
      </ul>
    </nav>
    <div class="lcd rack__status" aria-label="기기 상태 20:40 기준">
      <div class="lcd__row"><span class="lcd__label">M1-GR-2602-04172</span></div>
      <div class="lcd__row"><span>41°C</span><span>-52 dBm</span></div>
      <div class="lcd__row"><span>FW 2.4.1</span><span class="lcd__green">2.5.0 10/20</span></div>
    </div>
  </aside>
  <main class="app-shell__main" id="main">
    …
  </main>
</div>
```
- dashboard: `aria-current="page"`는 "내 청음실". settings: "내 청음실"의 `aria-current`를 빼고 "출력" 키에 `aria-current="location"`. settings 본문 구역 id는 반드시 `output` `sound` `night` `network` `firmware` `account` — app.js 스크롤스파이가 현재 키를 옮긴다.
- 사이드바 페이지에서는 body 골격의 `<main id="main">` 대신 위 `.app-shell` 이 main 을 감싼다(그리고 `.app-shell` 밖 `<main>`을 따로 두지 않는다).
- ≤ 960px: 랙은 본문 위 가로 스크롤 키 띠(오른쪽 페이드 힌트, 현재 키 자동 스크롤), 상태 LCD 숨김.

### 1-4. 공통 오버레이 — 커맨드 팔레트 (⌘K / Ctrl+K, 전 페이지 body 끝)

**index.html 용**
```html
<div class="command" id="command">
  <div class="command__slab" role="dialog" aria-modal="true" aria-label="찾기">
    <div class="command__field"><span data-icon="search"></span><input class="command__input" type="text" placeholder="화면·설정·기능 찾기" aria-label="찾기"><kbd>Esc</kbd></div>
    <div class="command__list">
      <p class="command__group">화면</p>
      <a class="command__item" href="index.html"><span class="led"></span><span data-icon="book"></span><span class="command__item-label">M1 사용설명서</span><span class="command__item-meta">제2판</span></a>
      <a class="command__item" href="pages/dashboard.html"><span class="led"></span><span data-icon="knob"></span><span class="command__item-label">내 청음실</span><span class="command__item-meta">VOL 36</span></a>
      <a class="command__item" href="pages/profile.html"><span class="led"></span><span data-icon="user"></span><span class="command__item-label">윤하람의 청음 기록</span></a>
      <a class="command__item" href="pages/onboarding.html"><span class="led"></span><span data-icon="power"></span><span class="command__item-label">M1 처음 켜기</span></a>
      <a class="command__item" href="pages/product.html"><span class="led"></span><span data-icon="speaker"></span><span class="command__item-label">몽돌 M1 상품</span><span class="command__item-meta">₩890,000</span></a>
      <a class="command__item" href="pages/pricing.html"><span class="led"></span><span data-icon="tag"></span><span class="command__item-label">구성 고르기</span></a>
      <a class="command__item" href="pages/inbox.html"><span class="led"></span><span data-icon="inbox"></span><span class="command__item-label">고객지원 받은편지함</span><span class="command__item-meta">미해결 23</span></a>
      <a class="command__item" href="pages/kanban.html"><span class="led"></span><span data-icon="wrench"></span><span class="command__item-label">AS 수리 보드</span><span class="command__item-meta">17건</span></a>
      <p class="command__group">설정</p>
      <a class="command__item" href="pages/settings.html#night" data-keywords="night 야간 밤"><span class="led"></span><span data-icon="night"></span><span class="command__item-label">야간 모드 시작 시각</span><span class="command__item-meta">22:00</span></a>
      <a class="command__item" href="pages/settings.html#firmware" data-keywords="firmware 업데이트"><span class="led"></span><span data-icon="firmware"></span><span class="command__item-label">펌웨어 2.5.0 예약</span><span class="command__item-meta">10/20 03:00</span></a>
      <a class="command__item" href="pages/settings.html#sound" data-keywords="eq 프리셋"><span class="led"></span><span data-icon="sliders"></span><span class="command__item-label">EQ 프리셋 · 저녁 작업</span></a>
      <p class="command__group">기능</p>
      <button class="command__item" type="button" data-theme-toggle data-keywords="dark light 다크 라이트 조명"><span class="led"></span><span data-icon="moon"></span><span class="command__item-label">주간·야간 조명 바꾸기</span></button>
      <p class="command__empty" hidden>맞는 항목이 없습니다. 고객센터 1588-0416</p>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>열기</span><span><kbd>Esc</kbd>닫기</span></div>
  </div>
</div>
```

**pages/*.html 용** — 경로만 다르다.
```html
<div class="command" id="command">
  <div class="command__slab" role="dialog" aria-modal="true" aria-label="찾기">
    <div class="command__field"><span data-icon="search"></span><input class="command__input" type="text" placeholder="화면·설정·기능 찾기" aria-label="찾기"><span class="spinner spinner--sm command__busy" aria-hidden="true"></span><kbd>Esc</kbd></div>
    <div class="command__list">
      <p class="command__group">화면</p>
      <a class="command__item" href="../index.html"><span class="led"></span><span data-icon="book"></span><span class="command__item-label">M1 사용설명서</span><span class="command__item-meta">제2판</span></a>
      <a class="command__item" href="dashboard.html"><span class="led"></span><span data-icon="knob"></span><span class="command__item-label">내 청음실</span><span class="command__item-meta">VOL 36</span></a>
      <a class="command__item" href="profile.html"><span class="led"></span><span data-icon="user"></span><span class="command__item-label">윤하람의 청음 기록</span></a>
      <a class="command__item" href="onboarding.html"><span class="led"></span><span data-icon="power"></span><span class="command__item-label">M1 처음 켜기</span></a>
      <a class="command__item" href="product.html"><span class="led"></span><span data-icon="speaker"></span><span class="command__item-label">몽돌 M1 상품</span><span class="command__item-meta">₩890,000</span></a>
      <a class="command__item" href="pricing.html"><span class="led"></span><span data-icon="tag"></span><span class="command__item-label">구성 고르기</span></a>
      <a class="command__item" href="inbox.html"><span class="led"></span><span data-icon="inbox"></span><span class="command__item-label">고객지원 받은편지함</span><span class="command__item-meta">미해결 23</span></a>
      <a class="command__item" href="kanban.html"><span class="led"></span><span data-icon="wrench"></span><span class="command__item-label">AS 수리 보드</span><span class="command__item-meta">17건</span></a>
      <p class="command__group">설정</p>
      <a class="command__item" href="settings.html#night" data-keywords="night 야간 밤"><span class="led"></span><span data-icon="night"></span><span class="command__item-label">야간 모드 시작 시각</span><span class="command__item-meta">22:00</span></a>
      <a class="command__item" href="settings.html#firmware" data-keywords="firmware 업데이트"><span class="led"></span><span data-icon="firmware"></span><span class="command__item-label">펌웨어 2.5.0 예약</span><span class="command__item-meta">10/20 03:00</span></a>
      <a class="command__item" href="settings.html#sound" data-keywords="eq 프리셋"><span class="led"></span><span data-icon="sliders"></span><span class="command__item-label">EQ 프리셋 · 저녁 작업</span></a>
      <p class="command__group">기능</p>
      <button class="command__item" type="button" data-theme-toggle data-keywords="dark light 다크 라이트 조명"><span class="led"></span><span data-icon="moon"></span><span class="command__item-label">주간·야간 조명 바꾸기</span></button>
      <p class="command__empty" hidden>맞는 항목이 없습니다. 고객센터 1588-0416</p>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>열기</span><span><kbd>Esc</kbd>닫기</span></div>
  </div>
</div>
```
- `.command__busy`(작은 회전 노브)는 `.command__slab[aria-busy="true"]`일 때만 보인다. index 스니펫에도 같은 자리에 넣어도 된다.

---

## 2. 토큰 요약 (semantic.css — 장면 CSS가 쓰는 이름)

| 분류 | 토큰 |
|---|---|
| 재질 | `--surface`(돌) `--surface-deep`(깊은 우물 바닥) `--well-floor`(레벨·진행 트랙 바닥) `--hi` `--lo` `--hi-line` `--lo-line` `--scrim` |
| 잉크 | `--ink` `--ink-2` `--ink-3` `--engrave`(text-shadow) |
| 주황 | `--key-orange` `--on-orange` `--text-orange` `--led-orange` `--glow-orange` `--key-orange-glow` |
| LED | `--led-green/red/amber` `--glow-green/red/amber` `--text-green/red/amber` |
| LCD | `--lcd-bg` `--lcd-ink` `--lcd-ghost` `--lcd-text` `--lcd-green` `--lcd-red` `--lcd-dim` `--lcd-rule` `--lcd-edge` `--lcd-bloom` |
| 깊이 | `--sh-raised-sm` `--sh-raised` `--sh-raised-hover` `--sh-raised-lg` / `--sh-pressed-sm` `--sh-pressed` `--sh-well-deep` / `--sh-groove` `--sh-lip` `--sh-lcd` / `--knob-cap`(유일한 그라디언트) |
| 반경 | `--r-device` 28 · `--r-module` 20 · `--r-key` 14 · `--r-well` 12 · `--r-pill` (LED·노브는 50%) |
| 글꼴 | `--font-display`(Orbit) `--font-ui`(Barlow+Noto) `--font-ko` `--font-legend`(Barlow SC) `--font-mono`(Share Tech Mono) |
| 크기 | `--fs-lcd-xl` 72/48 · `--fs-display` 64/36 · `--fs-h1` 44/30 · `--fs-h2` 28/22 · `--fs-h3` 19/17 · `--fs-body` 16 · `--fs-sm` 14 · `--fs-legend` 11 · `--fs-legend-ko` 12 · `--fs-lcd` 15 |
| 간격 | `--sp-1…9` = 4/8/12/16/24/32/48/72/120 · `--pad-cluster` 24/16 · `--pad-page` 48/16 · `--touch` 44 · `--topbar-h` 72/60 |
| 모션 | `--ease-press` `--ease-spring` `--ease-detent` · `--dur-press` 120 `--dur-spring` 280 `--dur-detent` 160 `--dur-led` 180 `--dur-hover` 150 `--dur-in` 220 `--dur-out` 140 |

---

## 3. base.css 프리미티브

| 클래스 | 쓰임 |
|---|---|
| `.wrap` / `.wrap--wide`(1320) / `.wrap--narrow`(880) | 컨테이너 1200. 단면도 띠 같은 풀블리드는 `.bleed`(래퍼 없이) |
| `.grid-12` + `.span-3…8`, `.span-12` | 12단. ≤ 960px 에서 모두 한 줄 |
| `.split` > `.split__readout` + 조작부 | **판독창 4 : 조작부 8**. 데스크톱에서 판독창은 `sticky; top: 96px`로 스크롤 동안 따라온다(빈 칸 대신). ≤ 960px 기본은 일반 흐름. `.split__readout--band`를 더한 판독창만 띠 아래 sticky "계기 띠"(큰 LCD 40px) — dashboard·pricing |
| `.faceplate` | 기기 한 대의 면판(raised-lg, 28). 물체 자체에만 쓴다 |
| `.cluster` | 면판 안 홈으로 판 구획(groove, 20) — 카드 대신 이것 |
| `.groove-h` `.groove-v` | 2px 홈 구획선(보더 대신) |
| `.raised` `.raised-sm` `.raised-lg` `.well` `.well--deep` `.grooved` | 깊이 유틸 |
| `.led` + `.is-on` / `--green` `--red` `--amber` / `--blink` / `--lg` | 표시등 8px. 꺼짐 = 파인 구멍 |
| `.lcd` / `--xl` `--lg` `--mini` · `.lcd__row` `.lcd__label` `.lcd__dim` `.lcd__green` `.lcd__red` `.lcd__white` `.ko` | 앰버 LCD 창 |
| `.lcd-seg` | 꺼진 세그먼트 잔상 — **숫자만 이어진 값(`/^[0-9:.,]+$/`)에만** app.js가 숫자→8로 깐다(`22:00`→`88:88`, `4.7`→`8.8`). 글자·기호(`VOL`, `₩`, `-`, `/`)가 섞이면 잔상 없음. `data-ghost`를 손으로 쓰지 않는다. 끄기: `data-ghost="off"`. 금액은 `₩<span class="lcd-seg">890,000</span>`처럼 기호를 밖으로 |
| `.seg7` | **7-세그먼트 숫자** — 면판 메인 판독값(index 첫 화면 VOL) 전용. 꺼진 막대가 진짜 88 잔상. `data-seg7-out="노브id"`면 노브 값이 들어가고, 옆 `data-knob-tag`는 `VOL`/`MUTE`. 마크업은 app.js `renderSeg7`이 만든다(정적 HTML에 미리 그려 둬도 됨) |
| `.m1mini` | **M1 정면 축소판** — index 첫 화면 면판이 정본(LCD 좌상 · LED 5 우상 · IR · 헤드폰/야간 좌측 · 노브 중앙 · 입력 키 5 좌하 · 주황 전원 우하). 비율 고정(672:698), 콜아웃 없음, 모든 치수 cqw. 마감 `--gr` `--bs` `--or`(조명 무관 실물 색), 없으면 그 방의 재질. 윗면 `.m1mini__face--top`(220:68) + `.m1top__*`, 후면 `.m1r*` 도 같은 폭·같은 반경 |
| `.t-model` | 모델명(M1·P2…)을 Orbit 제목·음각 숫자 안에서 Barlow SC 600으로 (Orbit 라틴 M이 Ⅲ처럼 보임) |
| `.folio` (+ `.folio--corner`) | **base.css**. index 장마다 우상단 같은 자리의 쪽 번호 `p. 04`(장 번호+제목 반복 대신). `--corner`는 부모(`position: relative`) 우상단 고정, 세부 위치는 장면 CSS |
| `.nobr` | 일련번호·주문번호(`M1-GR-2602-04172`, `MD-20260314-0087`)가 중간에서 꺾이지 않게 |
| `.kbd--ko` · `.keypath` | 한글 경로는 모노 code 대신 각인 키캡: `<span class="keypath"><kbd class="kbd--ko">몽돌 컨트롤</kbd>→<kbd class="kbd--ko">소리</kbd></span>` |
| `.ctl` > `.ctl__legend` · 조작체 · `.ctl__readout` | 레전드 위 · 조작 가운데 · 판독 아래 |
| `.mhead` > `.legend` + `.mhead__title` + `.mhead__meta` | 모듈 머리(좌측 정렬, 작게). 가운데정렬 섹션 헤더 금지 |
| `.legend` `.legend-ko` `.mono` `.num` `.t-display` `.t-h1` `.t-h2` `.t-h3` `.t-sm` `.t-xs` `.t-2` `.t-3` `.t-orange` `.t-green` `.t-red` `.t-amber` `.prose` | 조판. **Orbit = `.t-display`(64/36) · `.t-h1`(44/30) · `.t-h2`(28, 모바일 22px에선 Noto Sans KR 700으로 자동 전환)** — 28px 미만 한글 제목에 Orbit 금지. Orbit 어절 간격은 `--ws-display`(−0.3em)가 자동 적용 |
| `.t-deboss` `.t-emboss` | 음각/양각 — 404 숫자·index 장 번호에만 |
| `.stack` (`--2` `--3` `--5` `--6`) `.row` (`--2` `--4` `--between` `--end` `--nowrap`) `.grow` | 흐름 |
| `.scroll-x` + 부모 `.has-scroll-hint` | 가로 스크롤 + 잘림 페이드(app.js가 `.is-clipped`) |
| `.only-light` `.only-dark` `.sr-only` `.skip-link` `kbd`/`.kbd` | 기타 |

### 아이콘 이름
`power volume mute search chevron-left chevron-right chevron-down chevron-up close plus minus check moon sun menu grid settings bell inbox home chart board user tag box alert info error copy play pause next prev wrench sliders clock calendar arrow-right arrow-left trash edit refresh thermo wifi bluetooth usb optical disc headphones speaker knob download more grip mail send phone pin cart shield signal sort filter external lock star list book night firmware output receipt`

### app.js 훅 (요약)
| 속성 / API | 동작 |
|---|---|
| `[data-theme-toggle]` (role="switch" 면 aria-checked) | 주간/야간 전환 + `md-theme` 저장 |
| `[data-modal-open="id"]` `[data-modal-close]` / `[data-drawer-open="id"]` `[data-drawer-close]` | 열기·닫기 · Esc · 덮개 클릭 · 포커스 트랩 · 포커스 복귀. 모달은 하단 첫 키에 포커스(`data-autofocus`로 바꿈) |
| `[data-command-open]` · ⌘K/Ctrl+K · `#command` | 팔레트. 입력 필터(`data-keywords` 포함), ↑↓ Enter |
| `[role=tablist]` > `[role=tab][aria-controls]` | 탭, ←→ Home End |
| `.acc__trigger[aria-expanded][aria-controls]` · `.acc[data-single]` | 아코디언(닫힌 패널 inert) |
| `[data-toast="문구"]` `[data-toast-tone=ok/warn/error/info]` `[data-toast-code]` · `mongdol.toast(msg,{tone,code})` | LCD 토스트 4s |
| `[data-menu="id"]` / `[data-popover="id"]` (+ `.menu-anchor`) · `data-align="end"` · `data-prefer="top"` | 메뉴(↑↓ Home End Esc, menuitemradio/checkbox) · 팝오버 |
| `[data-tooltip="문구"]` | LCD 꼬리표(호버·포커스, Esc) |
| `[data-carousel]` > `.carousel__track/.carousel__slide` + `[data-carousel-prev/next]` + 빈 `.carousel__dots` + `.carousel__pos` | ←→ · 스와이프 |
| `[data-knob]` role=slider aria-valuemin/max/now · `data-format="vol"` · `[data-knob-out=id]` `[data-knob-db=id]` `[data-knob-num=id]` · `[data-knob-step="±1"][data-knob-target=id]` | 노브: 드래그(회전) · ←→↑↓ · PgUp/PgDn ±5 · Home/End · 포커스 상태에서 휠 |
| `.fader__input` (`data-unit` `data-signed` `data-decimals`) · `[data-fader-out=id]` | 페이더 판독 |
| `.meter[aria-valuenow][data-segments][data-warn][data-peak][data-clip]` · `mongdol.setMeter(el,v)` | 레벨 미터 세그먼트 생성·점등 |
| `[data-kanban]` | 끌어 놓기 + 키보드(Space 잡기 ←→ 열 이동 ↑↓ 순서 Space 놓기) · `[data-kanban-count]` 갱신 · 토스트 |
| `th[aria-sort] .table__sort` · `[data-select-all]` · `tbody .check__box` · `[data-selected-count]` | 표 정렬 · 행 선택 |
| `[data-calendar] .cal__day[aria-pressed]` · `[data-cal-out]` (`data-label`) | 날짜 키 선택 |
| `[data-exclusive]` > `[aria-pressed]` · `[data-exclusive-out=그룹id]` | 배타 키 열 |
| `[data-toggle]`, `.chip[aria-pressed]` | 토글 |
| `[data-pager][data-total]` > `.pager__key` · `[data-step-prev]` `[data-step-next]` | 페이지 키 시연 |
| `[data-busy-demo="ms"]`(`data-busy-label`) · `[data-error-demo]` · `[data-dismiss]` · `[data-copy]` | 로딩 LED · 오류 LED+토스트 · 닫기 · 복사 |
| `.marquee` + `[data-marquee-toggle]` | 그룹 자동 복제, 정지/재생 |
| `[data-power-seq]` > `.led[data-seq="1…"]` + `[data-seq-lcd]` | 전원 켜짐 시퀀스(index·dashboard만, 세션당 1회, `?theme=` 샷·reduced-motion 생략) |
| `[data-light="부위id …"]` | 호버/포커스 시 해당 id 의 `.led`를 점등(+`.is-lit`) — index "각 부 명칭" 목록용 |
| `form[data-validate]`(`data-success` `data-success-code`) | required 검사 → aria-invalid + `.field__error` 노출, 성공 토스트 |
| `[data-wizard]` > `.steps__item` + `[data-step-panel]` + `[data-step-go="+1/-1"]` `[data-step-finish]` `[data-step-out]` | 단계 진행(다이얼 회전) |
| `[data-play="#id"]` | 모션 시연 재생 토글(`.is-playing`) |

---

## 4. 컴포넌트 32종

### accordion — 경첩 덮개
```html
<div class="acc" data-single>
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="faq-1"><span class="acc__label">노브를 돌릴 때 지직거려요</span><span class="acc__meta">5건</span><span class="acc__knob"></span></button></h3>
    <div class="acc__panel" id="faq-1"><div class="acc__inner"><div class="acc__body"><p>볼륨 노브를 <strong>끝에서 끝까지 10번</strong> 천천히 돌려 주세요…</p></div></div></div>
  </div>
</div>
```
상태: 열림 `aria-expanded="true"`(트리거 파임 + 노브 눈금 90° 주황) · 꺼짐 `disabled` · 호버/포커스 기본.

### alert — 표시등 경고 / 위험은 LCD 띠
```html
<div class="alert alert--ok" role="status"><span class="alert__led"></span><span class="alert__icon" data-icon="check"></span><div class="alert__body"><strong class="alert__title">2.5.0 자동 업데이트 예약됨</strong>10월 20일(화) 03:00에 설치합니다.</div><button class="key key--icon key--quiet alert__close" type="button" data-dismiss aria-label="닫기"><span data-icon="close"></span></button></div>
<div class="alert alert--danger" role="alert"><span class="alert__led"></span><span class="alert__icon" data-icon="error"></span><div class="alert__body"><strong class="alert__title">클리핑 감지</strong>볼륨을 3칸 낮추세요. <span class="alert__code">ERR CLIP-L</span></div><button class="key key--icon alert__close" type="button" data-dismiss aria-label="닫기"><span data-icon="close"></span></button></div>
```
변형: `--ok`(그린) `--warn`(앰버 깜빡임) `--info`(앰버 링) `--danger`(LCD 창 + 빨강) · `--inline`(한 줄 띠) · 조치 키는 `.alert__actions` 안에.

### badge — LED + 각인 / 숫자 = LCD 미니창 / 칩
```html
<span class="badge badge--green">정상</span> <span class="badge">재생 중</span> <span class="badge badge--amber badge--blink">업데이트 대기</span>
<span class="badge badge--red">AS 접수</span> <span class="badge badge--off">꺼짐</span> <span class="badge badge--legend badge--plain">MD-M1</span>
<span class="count">23</span> <span class="count count--red">3</span>
<a class="key key--icon has-count" href="inbox.html" aria-label="미해결 문의 23건"><span data-icon="inbox"></span><span class="count">23</span></a>
<div class="chip-row"><button class="chip" type="button" aria-pressed="true"><span class="led"></span>미해결</button><button class="chip" type="button" aria-pressed="false"><span class="led"></span>오늘 접수</button></div>
```

### breadcrumb — 각인 경로
```html
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="../index.html"><span data-icon="home"></span>몽돌</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="settings.html">기기 설정</a></li>
  <li class="crumbs__item"><span class="crumbs__current" aria-current="page">펌웨어</span></li>
</ol></nav>
```
≤ 600px 에서는 처음과 마지막 둘만 보인다.

### button — 키캡
```html
<button class="key key--orange" type="button"><span data-icon="power"></span>장바구니에 담기</button>   <!-- 화면당 1개 -->
<button class="key" type="button">취소</button>
<button class="key" type="button" aria-pressed="true"><span class="key__led"></span>야간 모드</button>
<button class="key key--quiet" type="button">자세히</button>
<button class="key key--danger" type="button"><span class="key__led"></span>공장 초기화</button>
<button class="key key--icon" type="button" aria-label="설정"><span data-icon="settings"></span></button>
<button class="key" type="button" data-busy-demo="1600" data-busy-label="확인 중" data-toast="연결을 확인했습니다."><span class="key__label">연결 확인</span></button>
<button class="key" type="button" disabled>꺼짐</button>
<div class="keyrow" data-exclusive id="out-keys"><button class="key" type="button" aria-pressed="true"><span class="key__led"></span><span class="key__legend">EQ</span></button>…</div>
```
크기 `--sm`(36, 터치 기기 44) `--lg`(56) `--block`. 상태: hover(그림자 한 단계) · `:active`/`aria-pressed`(파임 + 1px) · `:disabled`/`aria-disabled`(눌린 채 잠긴 키: `--sh-pressed-sm` + opacity .45, 외곽선 없음) · `aria-busy="true"`(앰버 LED 깜빡임) · `.is-error`(빨강 LED). 라틴 레전드는 `.key__legend`, 보조 판독은 `.key__sub`.

### calendar — 숫자 키패드 (청음실 예약)
```html
<div class="cal" data-calendar>
  <div class="cal__head"><button class="key key--icon" type="button" aria-label="이전 달"><span data-icon="chevron-left"></span></button><div class="cal__month"><span class="lcd"><span class="lcd-seg">2026.10</span></span></div><button class="key key--icon" type="button" aria-label="다음 달"><span data-icon="chevron-right"></span></button></div>
  <div class="cal__grid">
    <span class="cal__dow">월</span>…<span class="cal__dow">일</span>
    <span class="cal__day cal__day--out">28</span>
    <button class="cal__day" type="button" aria-disabled="true" aria-label="10월 12일 월요일 휴무">12</button>
    <button class="cal__day has-event" type="button" aria-pressed="false" aria-current="date" aria-label="10월 16일 금요일 오늘">16</button>
    <button class="cal__day has-event" type="button" aria-pressed="true" data-label="10월 24일 (토) 15:00 LP 청음회" aria-label="10월 24일 토요일 청음회">24</button>
    <button class="cal__day is-full" type="button" aria-pressed="false" aria-label="10월 28일 마감">28</button>
  </div>
  <div class="cal__legend"><span><span class="led led--green is-on"></span>예약 가능</span><span><span class="led led--red is-on"></span>마감</span><span><span class="led is-on"></span>선택</span></div>
  <p class="cal__readout">선택: <strong data-cal-out>10월 24일 (토) 15:00 LP 청음회</strong></p>
</div>
```
2026-10-01은 목요일. 월요일 = 휴무(`aria-disabled`), 지난 날(10/1–10/15)도 `aria-disabled`.

### card — 면판 모듈
```html
<section class="module"><div class="module__head"><span class="legend">WEEK</span><h3 class="module__title">이번 주 청음</h3><span class="module__aside"><span class="badge badge--green">+30%</span></span></div><p class="module__figure">14:32<small>시간</small></p><p class="module__body">지난주 11시간 08분</p></section>
<a class="module module--press" href="profile.html"><span class="led module__led"></span><div class="module__head"><span class="legend">PRESET</span><span class="module__title">저녁 작업</span></div><p class="module__body">60 +1.5 · 250 0 · 1k −0.5 · 4k +1 · 12k +2 dB</p></a>
<button class="module module--press" type="button" aria-pressed="true">…</button>
<div class="moat"><article class="module">…추천 구성…</article></div>
```
정적 = `.module`(홈 구획, 솟지 않음) · 정적 안내 블록 = `.module--groove`(면 0 + 바깥 홈, 누를 곳은 안의 링크·키뿐) · 값 판독 구역 = `.module--well` · 누름 = `.module--press`(선택 `aria-pressed`/`aria-current` → 파임 + LED) · 추천 = `.moat` · `.is-error`(띠 없이 모듈 LED 빨강) · `aria-busy`. `.module__foot` · `.module__divider`(= `.groove-h`).

### carousel — 로터리 셀렉터
```html
<div class="carousel" data-carousel aria-label="M1 면판 도면">
  <div class="carousel__viewport" tabindex="0"><div class="carousel__track">
    <div class="carousel__slide" data-name="정면"><div class="carousel__caption"><strong>정면</strong>노브 · LCD · 입력 키</div>…CSS 도면…</div>
    <div class="carousel__slide" data-name="윗면">…</div>
    <div class="carousel__slide" data-name="후면">…</div>
  </div></div>
  <div class="carousel__controls"><button class="key key--icon" type="button" data-carousel-prev aria-label="이전 장면"><span data-icon="chevron-left"></span></button><div class="carousel__dots"></div><span class="carousel__pos">1 / 3</span><button class="key key--icon" type="button" data-carousel-next aria-label="다음 장면"><span data-icon="chevron-right"></span></button></div>
</div>
```

### code — LCD 판독창
```html
<div class="code"><div class="code__bar"><span class="code__file">preset-evening.json</span><button class="code__copy" type="button" data-copy><span data-icon="copy" class="icon-sm"></span><span class="code__copy-label">복사</span></button></div>
<pre><code><span class="code__c">// 저녁 작업 · 윤하람</span>
{ <span class="code__k">"eq"</span>: [<span class="code__s">1.5, 0, -0.5, 1, 2</span>] }</code></pre></div>
```
2색만: `.code__k`(그린) · 기본 앰버 · `.code__s`(흰) · `.code__c`(어두운 앰버). 인라인은 `<code>`.

### command — §1-4
정적 견본(index ⑥)은 `<div class="command command--static">` 안에 같은 `.command__slab`(입력 value 채움, 첫 항목은 app.js가 `aria-selected`).

### drawer — 랙 서랍
```html
<div class="drawer" id="drawer-eq">
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-eq-t">
    <div class="drawer__head"><h2 class="drawer__title" id="drawer-eq-t">EQ 프리셋 편집 · 저녁 작업</h2><button class="key key--icon key--quiet" type="button" data-drawer-close aria-label="닫기"><span data-icon="close"></span></button></div>
    <div class="drawer__body">…페이더 · 입력…</div>
    <div class="drawer__foot"><button class="key" type="button" data-drawer-close>취소</button><button class="key" type="button" data-drawer-close data-toast="프리셋 '저녁 작업' 저장됨" data-toast-code="PRESET 01"><span class="key__led"></span>저장</button></div>
  </div>
</div>
<button class="key" type="button" data-drawer-open="drawer-eq">프리셋 편집</button>
```
정적 견본: `.drawer.drawer--static`.

### empty — 파인 그릇 + 몽돌
```html
<div class="empty"><div class="empty__bowl" aria-hidden="true"><span class="empty__pebble"></span></div><p class="empty__title">저장된 프리셋이 없어요</p><p class="empty__text">노브와 EQ를 맞춘 뒤 길게 눌러 저장하세요.</p><button class="key" type="button">프리셋 만들기</button></div>
```
`.empty--sm` 작은 판.

### form — 입력 = 우물
```html
<form class="stack stack--5" data-validate data-success="프리셋을 저장했습니다." data-success-code="PRESET 05">
  <div class="field"><label class="field__label" for="p-name">프리셋 이름 <span class="field__req">*</span></label><input class="input" id="p-name" required placeholder="예: 저녁 작업"><p class="field__hint">한글 12자까지 저장됩니다.</p><p class="field__error">프리셋 이름을 입력해 주세요.</p></div>
  <div class="field"><label class="field__label" for="sn">일련번호</label><div class="input-wrap"><span class="input-wrap__pre" data-icon="tag"></span><input class="input input--mono" id="sn" value="M1-GR-2602-04172"></div></div>
  <div class="field"><label class="field__label" for="sb">자동 대기</label><span class="select-wrap"><select class="select" id="sb"><option>20분 뒤</option></select></span></div>
  <label class="check"><input class="check__box" type="checkbox" checked>야간 모드 자동 시작</label>
  <div class="selector" role="radiogroup" aria-label="입력 선택">
    <label class="selector__opt"><input type="radio" name="input" value="NET" checked><span class="selector__key"><span class="led"></span><span class="selector__name">NET</span></span></label>
    … BT · USB · OPT · PHONO (한글 이름은 <span class="selector__name ko">) …
  </div>
  <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked><span class="switch__led"></span>야간 모드</label>
  <div class="fader"><div class="row row--between"><span class="legend">MAX VOL</span><output class="fader__out"></output></div><div class="fader__track"><span class="fader__ticks" style="--ticks:8"></span><input class="fader__input" type="range" min="0" max="80" value="40" aria-label="야간 볼륨 상한"></div><div class="fader__scale"><span>0</span><span>40</span><span>80</span></div></div>
  <div class="eq"><div class="ctl fader fader--v"><span class="legend">60</span><div class="fader__track"><span class="fader__ticks"></span><input class="fader__input" type="range" min="-6" max="6" step="0.5" value="1.5" data-signed data-decimals="1" aria-label="60Hz"></div><output class="fader__out"></output></div> …250 1K 4K 12K…</div>
  <button class="key" type="submit"><span class="key__led"></span>저장</button>   <!-- 주황 키는 화면당 1개 — 폼 저장은 일반 키 -->
</form>
```
**노브** (볼륨·로터리):
```html
<div class="ctl">
  <span class="ctl__legend legend">VOLUME</span>
  <div class="knob knob--lg" id="vol" data-knob data-format="vol" aria-label="볼륨" aria-valuemin="0" aria-valuemax="80" aria-valuenow="36"></div>
  <div class="knob-pair"><button class="key key--icon key--sm" type="button" data-knob-step="-1" data-knob-target="vol" aria-label="볼륨 한 칸 내리기"><span data-icon="minus"></span></button><span class="ctl__readout" data-knob-num="vol">36</span><button class="key key--icon key--sm" type="button" data-knob-step="1" data-knob-target="vol" aria-label="볼륨 한 칸 올리기"><span data-icon="plus"></span></button></div>
</div>
<div class="lcd lcd--xl"><span class="m1__voltag" data-knob-tag="vol">VOL</span><span class="seg7" data-seg7-out="vol" data-digits="2" aria-hidden="true"></span><span class="sr-only" data-knob-out="vol">VOL 36</span></div> <span data-knob-db="vol">−44 dB</span>
```
크기 `--sm`(64) `--md`(120) `--lg`(260, 모바일 200) · `--orange`(주황 노브 에디션). 비활성 `aria-disabled="true"`. 일반 노브는 `data-format` 생략 + `data-unit="분"`.
상태: 우물 hover/focus = 더 깊게 · 오류 `aria-invalid="true"`(빨강 바닥선 + LED + `.field__error`) · disabled(우물이 메워짐) · readonly.

### kanban — 파인 트랙 위 키캡 (AS 수리 보드)
```html
<div class="kanban-wrap"><div class="kanban" data-kanban>
  <section class="kanban__col" aria-label="진단">
    <header class="kanban__head"><span class="led led--amber is-on"></span><h3 class="kanban__title">진단</h3><span class="count" data-kanban-count>5</span></header>
    <div class="kanban__list">
      <article class="kanban__card"><div class="kanban__card-top"><span class="kanban__id">AS-2610-031</span><span class="led led--amber is-on" role="img" aria-label="우선순위 보통"></span></div><p class="kanban__name">볼륨 노브 접점 잡음</p><div class="kanban__meta"><span class="mono">M1-GR-2511-01562</span><span>택배</span></div><div class="kanban__foot"><span class="kanban__who" title="남궁현">남궁</span><span class="t-xs t-2">10/13 접수</span></div></article>
    </div>
    <p class="kanban__empty" hidden>비어 있음</p>
    <button class="kanban__add" type="button"><span data-icon="plus"></span>접수 추가</button>
  </section>
</div></div>
```
우선순위 LED: 빨강 = 높음, 앰버 = 보통, 그린 = 낮음(텍스트 aria-label 병기). `.is-locked`(옮길 수 없음).

### list — 홈으로 구획된 줄
```html
<ul class="list list--well">
  <li class="list__row"><a class="list__item list__item--link is-unread" href="inbox.html" aria-current="page"><span class="list__lead"><span class="led"></span></span><span class="list__main"><span class="list__title">볼륨 노브 돌릴 때 지직거려요</span><span class="list__sub">박지호 · CS-2610-0418</span></span><span class="list__value">20:12<small>28분 전</small></span></a></li>
  <li class="list__row"><div class="list__item"><span class="list__lead"><span class="led led--green is-on"></span></span><span class="list__main"><span class="list__title">NET</span></span><span class="list__value">61%</span></div></li>
</ul>
```
`.list--dense`, 선택 `aria-current`/`aria-selected`, 안 읽음 `.is-unread`, 비활성 `aria-disabled`.

### marquee — LCD 도트 티커
공지 전용(index NOW · product NOTICE). 판독값은 흘리지 않는다 — settings 계기 띠(`.st-gauge` 6칸)·inbox 미해결 LCD(`.desk-lcd__run` 3칸)처럼 고정 `dl` 판독 칸으로 쓴다.
```html
<div class="marquee"><span class="marquee__label"><span class="led led--green is-on"></span>NOW</span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item"><span class="ko">느린 썰물 — 해무</span> 24/96 FLAC 2:37</span>
    <span class="marquee__item"><span class="ko">10/24(토) 15:00 성수 청음실 LP 청음회 — 가을 재즈</span> 3/16</span>
  </div></div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-label="흐름 멈춤"><span data-icon="pause"></span></button>
</div>
```

### menu — 팝업 슬랩
```html
<div class="menu-anchor">
  <button class="key key--icon" type="button" data-menu="menu-input" aria-label="입력 NET 메뉴"><span data-icon="more"></span></button>
  <div class="menu" id="menu-input" aria-label="입력 NET">
    <p class="menu__label">입력 NET</p>
    <button class="menu__item" type="button" data-toast="입력 이름을 바꿨습니다."><span data-icon="edit"></span>이름 바꾸기</button>
    <button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span data-icon="sliders"></span>저녁 작업 연결<span class="led"></span></button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item" type="button" aria-disabled="true"><span data-icon="lock"></span>잠금</button>
    <button class="menu__item menu__item--danger" type="button"><span data-icon="trash"></span>입력 숨기기<span class="led"></span></button>
  </div>
</div>
```
정적 견본: `.menu.menu--static`.

### modal — 확인 슬랩
```html
<div class="modal" id="modal-reset">
  <div class="modal__slab" role="alertdialog" aria-modal="true" aria-labelledby="modal-reset-t" aria-describedby="modal-reset-d">
    <div class="modal__head"><span class="led led--red is-on modal__led"></span><h2 class="modal__title" id="modal-reset-t">공장 초기화할까요?</h2><button class="key key--icon key--quiet modal__close" type="button" data-modal-close aria-label="닫기"><span data-icon="close"></span></button></div>
    <div class="modal__body" id="modal-reset-d">저장 프리셋 4개와 Wi-Fi 설정이 지워집니다. <strong>M1-GR-2602-04172</strong>의 보증 정보는 남습니다.</div>
    <div class="modal__foot"><button class="key" type="button" data-modal-close>취소</button><button class="key key--danger" type="button" data-modal-close data-toast="초기화를 시작합니다." data-toast-tone="warn" data-toast-code="RESET"><span class="key__led"></span>초기화</button></div>
  </div>
</div>
<button class="key key--danger" type="button" data-modal-open="modal-reset"><span class="key__led"></span>공장 초기화</button>
```
`.modal--wide`(640) · 정적 견본 `.modal.modal--static`. ≤ 600px 아래에서 솟는 시트, 키는 세로 꽉 참.

### motion — 촉각 시연
```html
<div class="motion-demo">
  <div class="motion-demo__cell"><div class="motion-demo__stage"><button class="key press-demo" type="button" id="demo-press">누름</button></div><span class="motion-demo__name">누름 · 놓음</span><span class="motion-demo__curve">120ms (.3,0,.5,1) → 280ms (.34,1.56,.64,1)</span><button class="key key--sm" type="button" data-play="#demo-press" aria-pressed="false">재생</button></div>
  <div class="motion-demo__cell"><div class="motion-demo__stage"><div class="detent-dial" id="demo-detent"></div></div><span class="motion-demo__name">디텐트</span><span class="motion-demo__curve">1칸 3.375° · steps → 160ms</span><button class="key key--sm" type="button" data-play="#demo-detent" aria-pressed="false">재생</button></div>
  <div class="motion-demo__cell"><div class="motion-demo__stage led-demo"><span class="led is-on"></span><span class="led led--green is-on"></span><span class="led led--amber led--blink is-on"></span></div><span class="motion-demo__name">LED</span><span class="motion-demo__curve">180ms ease-out</span></div>
</div>
```
전원 켜짐 시퀀스: 면판 루트에 `data-power-seq`, LED에 `data-seq="1…5"`, LCD 값에 `data-seq-lcd`.

### navbar — §1-1 상단 면판 띠 · §1-2 바닥 명판

### pagination — 키캡 열
```html
<nav class="pager" data-pager data-total="3" aria-label="문의 목록 페이지">
  <ul class="pager__keys">
    <li><button class="pager__key pager__step" type="button" data-step-prev aria-disabled="true" aria-label="이전 페이지"><span data-icon="chevron-left"></span></button></li>
    <li><button class="pager__key" type="button" aria-current="page">1</button></li>
    <li><button class="pager__key" type="button">2</button></li>
    <li><button class="pager__key" type="button">3</button></li>
    <li><button class="pager__key pager__step" type="button" data-step-next aria-label="다음 페이지"><span data-icon="chevron-right"></span></button></li>
  </ul>
  <span class="pager__readout">1 / 3</span>
</nav>
```
먼 번호 `li.is-far`는 ≤ 480px 에서 숨는다. 생략 `<li><span class="pager__gap">…</span></li>`.

### popover — 작은 슬랩 + 노치
```html
<span class="menu-anchor">
  <button class="key key--quiet key--sm" type="button" data-popover="pop-detent">디텐트란?</button>
  <div class="popover" id="pop-detent" aria-label="디텐트 설명"><p class="popover__title"><span class="led is-on"></span>디텐트</p><p class="popover__body">노브가 한 칸 돌 때마다 손끝에 걸리는 홈입니다. M1은 80칸입니다.</p><div class="popover__foot"><button class="key key--sm" type="button" data-popover-close>닫기</button></div></div>
</span>
```
정적 견본: `.popover.popover--static`.

### progress — 레벨 미터 · 선형 막대
```html
<div class="meter" aria-label="이번 주 NET 입력 비율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="61" data-segments="20">
  <div class="meter__top"><span class="legend">NET</span><span class="meter__name">스트리밍</span><span class="meter__readout">61%</span></div>
  <div class="meter__track"></div>
</div>
<div class="meter meter--lg" aria-label="출력 L" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" data-segments="24" data-clip><div class="meter__top"><span class="legend">OUT L</span><span class="meter__clip">CLIP</span><span class="meter__readout">0.0 dB</span></div><div class="meter__track"></div></div>
<div class="bar" role="progressbar" aria-label="펌웨어 2.5.0 내려받기" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"><div class="bar__top">펌웨어 2.5.0 내려받기<span class="mono">72%</span></div><div class="bar__track"><div class="bar__fill" style="--v:72%"></div></div></div>
```
미터: `data-warn`(기본 70) `data-peak`(기본 90) %, `.meter--mono`(주황 단색), `.meter--v`(세로). 막대: 채움(솟은 돌 막대) 위에 **채움 길이만큼 켜진 3px LED 띠**(기본 그린)가 깔려 값이 색으로도 읽힌다. `--v:0%`면 채움이 사라지고 트랙만 남는다. `--orange` `--busy`(불확정, aria-valuenow 생략) `--error`. 수치 판독값은 늘 `.bar__top`에 병기. `<span>`으로 짜도 된다(트랙·채움은 block).

### sidebar — §1-3 세로 셀렉터 랙

### skeleton — 빈 우물
```html
<div class="skel-group" aria-busy="true" aria-label="기기 상태 불러오는 중"><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line is-mid"></span><span class="skel skel--lcd"></span></div>
```
`skel--circle` `skel--knob` `skel--block`(`style="--h:140px"`).

### spinner — 회전 노브
```html
<span class="spinner" role="status" aria-label="기기 찾는 중"></span>
<span class="spinner-row"><span class="spinner spinner--sm" aria-hidden="true"></span>기기 찾는 중</span>
```
`--sm`(24) `--lg`(64).

### steps — 로터리 위치 (M1 처음 켜기)
```html
<div data-wizard>
  <div class="steps">
    <div class="steps__dial" style="--i:2;--n:4" aria-hidden="true"></div>
    <ol class="steps__list" aria-label="M1 처음 켜기">
      <li class="steps__item is-done"><span class="steps__led"></span><span class="steps__num">01</span><span class="steps__label">전원·스피커 연결</span></li>
      <li class="steps__item is-done"><span class="steps__led"></span><span class="steps__num">02</span><span class="steps__label">Wi-Fi</span><span class="steps__note">haram-studio-5G</span></li>
      <li class="steps__item" aria-current="step"><span class="steps__led"></span><span class="steps__num">03</span><span class="steps__label">룸 튜닝</span></li>
      <li class="steps__item"><span class="steps__led"></span><span class="steps__num">04</span><span class="steps__label">몽돌 계정</span></li>
    </ol>
  </div>
  <section data-step-panel hidden>…</section> ×4
  <div class="row"><button class="key" type="button" data-step-go="-1">이전</button><button class="key key--orange" type="button" data-step-go="+1">다음</button><button class="key key--orange" type="button" data-step-finish hidden>시작하기</button></div>
</div>
```
`.is-error`(빨강 LED + `.steps__note` 빨강). ≤ 720px 세로 LED 체인.

### table — 사양표
```html
<div class="table-wrap">
  <div class="scroll-x"><table class="table">
    <caption>입력 단자 사양</caption>
    <thead><tr>
      <th class="table__check"><input class="check__box" type="checkbox" data-select-all aria-label="모두 선택"></th>
      <th scope="col" aria-sort="none"><span class="legend">PORT</span><button class="table__sort" type="button">단자<span data-icon="sort"></span></button></th>
      <th scope="col"><span class="legend">TYPE</span>규격</th>
      <th scope="col" class="num" aria-sort="none"><span class="legend">RATE</span><button class="table__sort" type="button">최대 샘플<span data-icon="sort"></span></button></th>
      <th scope="col"><span class="legend">STATE</span>상태</th>
    </tr></thead>
    <tbody>
      <tr><td><input class="check__box" type="checkbox" aria-label="NET 선택"></td><th scope="row">NET</th><td>Wi-Fi 6 · 이더넷</td><td class="num" data-sort="384">384 kHz</td><td><span class="badge badge--green">연결됨</span></td></tr>
    </tbody>
  </table></div>
  <div class="table-foot"><span><span data-selected-count>0</span>개 선택</span></div>
</div>
```
`.table--compact` · 행 `tr.is-muted` `tr.is-error`(띠·빨간 글자 없이 행 머리 체크 키 LED 만 빨강) · 선택 `aria-selected`(app.js). 표 최소 폭 560 → 좁은 화면은 가로 스크롤 + 페이드.

### tabs — 입력 선택 키 열
```html
<div class="tabs">
  <div class="tabs__bedwrap"><div class="tabs__bed" role="tablist" aria-label="입력별 기록">
    <button class="tabs__key" role="tab" id="tab-net" aria-controls="panel-net" aria-selected="true"><span class="led"></span><span class="tabs__legend">NET</span>스트리밍<span class="tabs__count">61%</span></button>
    <button class="tabs__key" role="tab" id="tab-bt" aria-controls="panel-bt" aria-selected="false"><span class="led"></span><span class="tabs__legend">BT</span>블루투스</button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="panel-net" aria-labelledby="tab-net" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-bt" aria-labelledby="tab-bt" tabindex="0" hidden>…</div>
</div>
```
`.tabs--fill`(베드 꽉 참). 꺼짐 `disabled`.

### timeline — LED 체인
```html
<ol class="timeline">
  <li class="timeline__item is-done"><span class="timeline__led"></span><time class="timeline__time" datetime="2026-08-27">2026-08-27</time><span class="timeline__title">펌웨어 2.4.1 배포</span><p class="timeline__body">LCD 밝기 자동 조절 개선 · 강시우</p></li>
  <li class="timeline__item is-now"><span class="timeline__led"></span><time class="timeline__time" datetime="2026-10-13">2026-10-13</time><span class="timeline__title">2.5.0 베타 공개</span></li>
  <li class="timeline__item is-pending"><span class="timeline__led"></span><time class="timeline__time" datetime="2026-10-20T03:00">2026-10-20 03:00</time><span class="timeline__title">2.5.0 정식 · 자동 설치 예약</span></li>
</ol>
```
`.is-warn` `.is-error` · `.timeline--dense`.

### toast — LCD 띠
트리거 `data-toast="프리셋 '저녁 작업' 저장됨" data-toast-code="PRESET 01" data-toast-tone="ok|warn|error|info"`.
정적 견본:
```html
<div class="toast toast--static" role="status"><span class="toast__led"></span><span class="toast__text"><span class="toast__code">PRESET 01</span><span class="toast__msg">프리셋 '저녁 작업' 저장됨</span></span><button class="toast__close" type="button" aria-label="알림 닫기"><span data-icon="close"></span></button></div>
```

### tooltip — LCD 꼬리표
```html
<button class="key key--icon key--sm" type="button" data-tooltip="한 칸에 1단계, 80칸에서 최대" aria-label="볼륨 도움말"><span data-icon="info"></span></button>
<span class="tooltip tooltip--static">한 칸에 1단계 · <span class="tooltip__val">−44 dB</span></span>   <!-- 정적 견본 -->
```

### 4-부록. 상태 일람 (2단계 보강 — 모든 상태는 깊이 · LED · 텍스트로만 표현)

공통: **hover** = 그림자 한 단계(변위 없음) · **active/selected** = 파임(pressed) + 주황 LED · **focus-visible** = 주황 3px 실선 + 3px 간격(가로 스크롤 띠 안에서는 안쪽 링) · **disabled** = 눌린 채 잠김(`--sh-pressed-sm`) + opacity .45 + `cursor: not-allowed` (외곽선 없음) · **loading** = `aria-busy="true"` → 앰버 LED 깜빡임(steps, 0.8s · 꺼짐 프레임은 잔광 .25) 또는 우물 숨쉬기(1.6s) · **error** = `.is-error`/`aria-invalid="true"` → 빨강 LED + 빨강 텍스트.

| 컴포넌트 | 로딩 | 오류 | 선택/현재 | 꺼짐 |
|---|---|---|---|---|
| button `.key` | `aria-busy` 앰버 LED | `.is-error` 빨강 LED | `aria-pressed` | `disabled` / `aria-disabled` |
| accordion | `.acc__trigger[aria-busy]` 눈금 깜빡임 | `.acc__item.is-error`(노브 빨강 링 · 메타 빨강) | `aria-expanded="true"` | `disabled` |
| tabs | `.tabs__key[aria-busy]` | `.tabs__key.is-error`(신호 없는 입력) | `aria-selected` | `disabled` |
| pagination | `.pager[aria-busy]`(현재 키 LED 앰버, 키 잠김) | `.pager.is-error`(판독 빨강) | `aria-current="page"` | `aria-disabled` |
| calendar | `.cal[aria-busy]`(키패드 숨쉬기) | `.cal.is-error` / `aria-invalid` + `<p class="cal__error">날짜를 고르세요</p>` | `aria-pressed` · 오늘 `aria-current="date"` | 휴무·지난 날 `aria-disabled` |
| command | `.command__slab[aria-busy]` + `.command__busy` | `.command__empty` 문구 | `aria-selected`(↑↓) | `.command__item[aria-disabled]` |
| list | `.list[aria-busy]` | `.list__item.is-error` | `aria-current`/`aria-selected`/`aria-pressed` | `aria-disabled` |
| table | `.table-wrap[aria-busy]` | `tr.is-error`(앞머리 빨강 띠) | `tr[aria-selected]` | `tr.is-muted` |
| kanban | `.kanban__card[aria-busy]`(반영 대기) | `.kanban__card.is-error` | 잡기 `.is-grabbed` · 보기 `aria-pressed` | `.is-locked` |
| menu | `.menu__item[aria-busy]` | `--danger`(위험 동작) | `aria-checked` / `aria-current` | `aria-disabled` |
| carousel | `.carousel[aria-busy]` | — | 점 `aria-current` | 끝에서 이전/다음 `disabled` |
| sidebar `.rack__key` | `aria-busy` | `.is-error`(경고 구역) | `aria-current` | `aria-disabled` |
| form | `.input-wrap[aria-busy]` · `.switch[aria-busy]` | `aria-invalid` + `.field__error` · `.switch__input[aria-invalid]` · `.fader.is-error` · `.knob.is-error` | `:checked` | `disabled` |
| chip | `.chip[aria-busy]` | `.chip.is-error` | `aria-pressed` | `disabled` |
| steps | `.steps__item[aria-busy]`(측정 중) | `.is-error` | `aria-current="step"` · 완료 `.is-done` | — |
| modal / drawer | `.modal__slab[aria-busy]`(닫기 잠김) · `.drawer__panel[aria-busy]` | `.modal--danger`(머리 LED 빨강) | — | — |
| code | — | `.code__copy.is-error` | 복사 완료 `.is-done` | `.code__copy:disabled` |
| progress | `.bar--busy`(불확정) | `.bar--error` · `.meter.is-clip` | — | 0% = 트랙만 |
| alert / toast | — | `--danger` / `--error` | — | — |

모바일 보강: ≤ 600px 에서 입력 선택 키 열(`.selector`)은 5개가 한 줄을 지킨다(키 폭 균등, 레전드 자간 0.08em). 브레드크럼 링크·작은 키(`--sm`)는 터치 기기에서 44px. 달력 날짜 키는 360px 에서 40px 이상.

---

## 5. 장면 작성 체크리스트

1. 첫 화면 1초: 회색 돌 면판 + 앰버 LCD가 보이는가(다크 = 불 끈 방, LCD·LED만 빛남). 랜딩 공식(eyebrow·2줄 헤드라인·CTA 쌍·칩) 금지.
2. 주황 채움 키는 화면당 1개. 나머지 강조는 LED.
3. 정적 카드를 띄우지 않았는가 — `.module`(홈) / 누를 수 있는 것만 `.module--press`.
4. 모든 판독값은 Share Tech Mono + 단위 + "20:40 기준"(실시간 값) 병기. 상태는 LED + 텍스트(색만으로 전달 금지).
5. 레전드 위 · 조작 가운데 · 판독 아래(`.ctl`). 클러스터 사이는 홈(`.groove-h`, `.cluster`).
6. 반경은 물체 종류대로(기기 28 · 모듈 20 · 키 14 · 우물 12 · 노브/LED 원).
7. 그라디언트·radial 얼룩·나사·리벳 장식 금지(노브 캡 원뿔 반사만 허용).
8. 360/390px 가로 스크롤 0, 터치 타깃 44px, 넘치는 키 열은 페이드 힌트.
9. 셸 3종(§1-1 띠 · §1-2 명판 · §1-3 랙)과 커맨드 팔레트(§1-4)는 글자 그대로 복사, `aria-current`만 옮긴다.
10. 숫자·이름·날짜는 DIRECTION.md 팩트 시트에서만. 기준 2026-10-16(금) 20:40.
