# 금란좌 GEUMNAN-JWA · 컴포넌트 마크업 계약

index.html과 pages/*.html은 이 문서만 보고 마크업한다. 세계관·카피·수치의 기준은 `DIRECTION.md` 팩트 시트다. 거기 없는 값은 지어내지 말고 팩트 시트에 먼저 추가한다.

- 클래스는 BEM(`block__elem--mod`)을 쓴다. 상태는 가능하면 **ARIA 속성**(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-invalid`, `aria-busy`, `aria-disabled`)으로 표현하고, CSS가 그 속성을 읽는다.
- 인라인 `style`은 CSS 변수를 넣을 때만 쓴다(`style="--v:96.4"`). 인라인 grid-template-columns, onclick, `href="#"`는 쓰지 않는다.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만** 쓴다. hex와 `--c-*` 원시 토큰은 쓰지 않는다.
- 라틴 캡스(`.caps`, `ADMIT ONE`, `ACT II`)에는 **라틴 문자열만** 넣는다. 한글 라벨은 `.label`을 쓰고 자간은 0이다.
- 장식 요소에는 `aria-hidden="true"`를 붙인다. 의미는 반드시 텍스트로 전달한다.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>오늘 밤의 장부 · 금란좌</title>
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('gn-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);d.classList.add('js')})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Limelight&family=Josefin+Sans:wght@400;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..700&family=Hahmlet:wght@400;700;900&family=Nanum+Myeongjo:wght@400;700;800&family=Gothic+A1:wght@400;500;700&family=Courier+Prime:wght@400;700&display=swap">
<link rel="stylesheet" href="../styles.css">      <!-- index: styles.css -->
<link rel="stylesheet" href="dashboard.css">      <!-- 장면 전용. index: index.css -->
<script src="../app.js" defer></script>           <!-- index: app.js -->
</head>
```
- localStorage 키는 `gn-theme`이다. URL `?theme=dark|light`가 가장 먼저 적용되고, 이 값은 저장하지 않는다.
- 머리말 스크립트가 `<html>`에 `js` 클래스를 단다. `data-reveal="rise"` 진입 연출이 이 클래스에 기대므로 반드시 넣는다.
- 페이지 `<title>` 형식은 `<장면 이름> · 금란좌`로 한다(예: `컨시어지 전보함 · 금란좌`). index는 `금란좌 프로그램 북 제7호 · 개관 90주년 기념호`이다.
- app.js는 경로에 `/pages/`가 있는지 보고 커맨드 팔레트 링크의 기준 경로를 정한다. 파일 위치를 바꾸지 않는다.

---

## 1. 토큰 요약 (semantic.css)

| 용도 | 토큰 |
|---|---|
| 면 | `--paper`(바탕) `--paper-raised`(카드·모달·입력) `--paper-sunk`(표 머리·비활성·스켈레톤) `--hover` |
| 글자 | `--ink` `--ink-muted` `--ink-faint` · 금박 면 위 글자 `--on-foil`(흰 글자 금지) |
| 금 | `--gold-text`(금색 **글자**) `--gold-line`(장식 헤어라인, **텍스트·경계 금지**) `--gold-edge`(입력 등 UI 경계) `--gold-strong`(hover·누름) `--foil`(금박 그라디언트) `--foil-flat`(단색 금) |
| 공작록 | `--peacock`(면) `--peacock-ink` `--peacock-ink-muted` `--peacock-gold` `--peacock-text`(밝은 면 위 공작록 글자) `--peacock-raised` `--peacock-sunk` |
| 래커 | `--lacquer-face` `--lacquer-raised` `--lacquer-sunk` |
| 상태 | `--ok/--ok-tint`(발권 완료) `--warn/--warn-tint`(현장 수령) `--danger/--danger-tint`(환불 완료·위험) `--info/--info-tint` |
| 포커스·비활성 | `--focus` `--focus-gap` `--disabled-ink` `--disabled-fill` `--disabled-line` |
| 장식 | `--ray` `--ray-strong`(선버스트 광선) `--bulb` `--bulb-off` `--fold-shadow`(딥틱 접지 그림자) `--pleat-dark` `--pleat-light`(플루팅) |
| 오버레이 | `--scrim` `--shadow-overlay` `--glow`(다크에서 화면당 1곳) |
| 차트 | `--chart-now`(올 시즌 실선) `--chart-prev`(작년 점선) `--chart-grid` `--chart-area` · 좌석 `--seat-sold` `--seat-open` `--seat-open-line` `--seat-mark` |
| 스케일(tokens) | `--t-marquee` `--t-act` `--t-d1` `--t-d2` `--t-h1` `--t-h2` `--t-h3` `--t-lead` `--t-body` `--t-ui` `--t-small` `--t-caps` / 여백 `--sp-1…10` = 4·8·12·16·24·32·48·72·112·168 / `--gutter`(24, ≤560px에서 16) `--measure`(34em) `--w-max`(1320) |
| 폰트 | `--font-marquee`(Limelight) `--font-display`(Bodoni Moda→Hahmlet) `--font-display-ko`(Hahmlet) `--font-body`/`--font-body-ko`(나눔명조) `--font-ui`(Josefin Sans→Gothic A1) `--font-ui-ko`(Gothic A1) `--font-caps` `--font-mono`(Courier Prime) `--font-num`(Bodoni Moda) `--font-numeral-sm`(Bodoni Moda 700 · 자간 .06em — 40px 미만 로마숫자 전용, Limelight는 40px 이상만) |
| 모션 | `--dur-1…5` = 120·240·480·720·1400ms · `--ease-curtain` `--ease-gilt` `--ease-out` |

**면 문맥 클래스**를 붙이면 그 안의 모든 컴포넌트 토큰이 자동으로 바뀐다.
- `.surface-peacock`: 공작록 면. 막 표지, 막간 띠, 사이드바, 칸반 "공연 중" 열에 쓴다. 다크에서도 공작록이 유지된다.
- `.surface-lacquer`: 흑 래커 면. 표지와 흑 막 표지에 쓰고, 양 모드에서 모두 밤 토큰을 쓴다. `.code`와 `.tooltip`은 자동으로 이 문맥이 된다.
- `.surface-lacquer.band-lacquer` + 자식 `<span class="band-rays" aria-hidden="true"></span>`: 페이지를 가로지르는 **흑 래커 띠**(흑 막 표지, 객실 띠, 방명록 띠, 404 무대). 다크에서 바탕과 같은 흑이 되지 않도록 `--band-lacquer`(#1A1711)로 한 단 밝히고, 위아래 이중 금선과 바닥 중앙 선버스트(알파 .08)를 그린다. 띠 바로 뒤 지면은 바탕색으로 둔다.

**SVG 차트**: presentation attribute에 `var()`를 넣지 않는다. `<path style="stroke:var(--chart-now)">`처럼 쓰거나 `stroke="currentColor"`에 부모 `color`를 준다. 주간 매출 라인은 실선(`--chart-now`)으로 올 시즌, 점선(`stroke-dasharray:4 4`, `--chart-prev`)으로 작년을 그린다. 마커는 마름모(`<rect transform="rotate(45)">`)이고 값은 직접 라벨로 단다.

---

## 2. base.css 프리미티브

| 클래스 | 설명 |
|---|---|
| `.t-marquee` `.t-act` | Limelight 초대형. 워드마크 `GEUMNAN-JWA`, `ACT I`에 쓰고 **라틴만** 넣는다 |
| `.t-d1` `.t-d2` | Hahmlet 900 한글 막 제목·장면 제목 |
| `.t-h1` `.t-h2` `.t-h3` | Bodoni→Hahmlet 700 페이지 제목 |
| `.t-lead` `.t-body` `.prose` | 명조 본문. `.prose`는 34em 폭이고 단락 간격을 갖는다. 단락은 좌정렬, 블록은 중앙에 둔다 |
| `.t-ui` `.t-small` `.label` `.t-muted` `.t-faint` `.t-gold` `.t-center` | UI 글자와 색 |
| `.caps` | 라틴 캡스(0.2em). `<span class="caps" lang="en">ADMIT ONE</span>` |
| `.mono` `.num` `.serif` | Courier(예약번호·좌석·시각) / Bodoni 숫자(금액·지표, tabular) / 명조 |
| `.dropcap-num` + `.dropcap-num__year` | 문단 첫머리의 독립 숫자(연도)만 Bodoni Moda 700 금색 드롭캡으로 키운다(인사말). 한글 첫 음절 드롭캡(`.dropcap`)은 고유명사·조사를 쪼개므로 쓰지 않는다 |
| `.link` | 금 글자 링크. 밑줄이 있고 hover 시 2px이 된다 |
| `.span-12` `.span-10` `.span-8` `.span-6` | **대칭 판**(항상 중앙)이다. 좌우가 다른 스팬은 만들지 않는다. 각각 풀 플레이트·지면·본문 판·티켓 판이다 |
| `.measure` `.axis` | 34em 중앙 / 세로 중앙축 정렬 |
| `.stack` `.stack-2` `.stack-5` `.stack-7` `.row` `.row--center` `.row--between` | 간격 프리미티브 |
| `.scene` `.scene--tight` | 장면 상하 112 / 72 (모바일 72) |
| `.diptych` | 거울 2단. 자식 2개(또는 짝수 개)를 넣는다. 홀수째는 오른쪽 정렬, 짝수째는 왼쪽 정렬이고 가운데에 금 접지선과 접힘 그림자가 생긴다. ≤560px에서 한 단·가운데 정렬로 바뀐다. `.diptych--flat`은 그림자를 뺀다 |
| `.triptych` | 3면 접지(3·4·3). 자식 3개를 넣고, 가운데가 24px 솟는다. 접지선 위에 마름모가 생긴다. ≤860px에서 가운데 패널이 먼저 오고 세로로 쌓인다 |
| `.frame` | 단선 등급(1px 금선, 직각) |
| `.gilt` | **이중선 등급**: 이중 금선과 6px 계단 홈. `.gilt--stage`는 **무대 등급**(3단 계단 4·8·12, 모바일 3·6·8). 보조 클래스: `.gilt--strong`(선 진하게) `.gilt--sunk` `.gilt--paper` `.gilt--clear`(채움). 이 클래스는 `::before`/`::after`를 쓰므로 **같은 요소에 다른 가상요소 장식을 걸지 않는다** |
| `.stair-clip` | 계단 실루엣 클립(채움 전용) |
| `.rule-double` `.rule-double--wide` `.rule-triple` `.rule-diamond`(`<span class="rule-diamond"><i></i></span>`) | 금 장식선 |
| `.diamond` (`--sm` `--lg` `--foil` `--hollow`) | 마름모 |
| `.chev-cut` | 6각 셰브론 실루엣 |
| `.avatar` (`--sm` 32 `--lg` 72 `--xl` 120 `--foil`) | 팔각 아바타 + 금선. 내용은 이름 2자이다(`정원`) |
| `.foil-text` (+ `.is-gilding` 또는 `data-reveal="gilt"`) | 금박 글자. 진입 시 1회 스윕한다 |
| `.foil-fill` | 금박 면 + 칠흑 글자 |
| `.rays` `.rays--top` | 위치 지정된 부모 안을 채우는 24갈래 광선 레이어 |
| `.ray-head` (`--lg`) | 반원 선버스트 머리. 모달·커맨드·온보딩 단계·추천 티켓·빈 상태에 쓰고 **일반 카드에는 쓰지 않는다** |
| `.act-plate` | **막 표지**: 위쪽 가장자리가 5단 지구라트이고 하단 중앙에서 선버스트가 퍼진다. 바로 앞 섹션 위로 40px 겹친다. 페이지 첫 요소일 때는 `.act-plate--first`를 붙인다 |
| `.curtain` (+ `.is-raised`) | 막 오름 레이어(래커 막이 위로 걷힘) |
| `.bulbs` | 전구 점열(8px 높이) |
| `.fluting` | 세로 홈 면 |
| `.backstage` > `.sidebar` + `.backstage__main` > `.topbar` + `main.backstage__content` + `.colophon` | 백스테이지 셸 |
| `.colophon` | 공통 푸터(셸 스니펫 참고) |
| `.skip-link` `.sr-only` `.hide-sm` `.show-sm` | 유틸 |

### 막 표지
```html
<section class="act-plate surface-peacock" id="act-1" aria-labelledby="act-1-t" data-reveal="gilt">
  <span class="act-plate__no foil-text" lang="en">ACT I</span>
  <h2 class="act-plate__title" id="act-1-t">금박과 막</h2>
  <span class="rule-double" aria-hidden="true"></span>
  <p class="act-plate__note">마티네의 상아 지면과 수와레의 래커, 같은 쪽을 두 조명으로.</p>
</section>
```
흑 막 표지는 `surface-lacquer`를 쓴다. 공작록과 흑 막 표지를 번갈아 놓는다(DIRECTION 9절 순서를 따른다).

### 아이콘
`<span data-icon="ticket"></span>`를 쓰면 app.js가 24 격자의 1.5px 선 SVG(currentColor)로 채우고 `aria-hidden`을 단다. 크기는 기본 20px이고 `.icon--sm`은 16, `.icon--lg`는 24다.
쓸 수 있는 이름: `search close chevron-left chevron-right chevron-down chevron-up arrow-right arrow-left arrow-down check plus minus sun moon menu shield info warn ticket seat calendar clock bell user telegram grip more copy play pause replay external sliders logout glass bed music stage phone pin card lock edit trash filter download diamond keyboard`
아이콘만 있는 버튼에는 반드시 `aria-label`을 단다. 이모지는 쓰지 않는다.

---

## 3. 복사해서 쓰는 공통 셸 (그대로 붙여 넣을 것)

> 셸은 아래 스니펫과 **글자 하나까지 같아야** 한다. 바꿀 수 있는 곳은 `aria-current` 위치, 브레드크럼 마지막 칸, 사이드바 `aria-current`뿐이다.
> 고정 앵커: 다음 앵커는 다른 장면이 링크로 가리키므로 해당 페이지에 **반드시 둔다**. `index.html#intermission`(막간 광고면), `pricing.html#rooms`(객실 요금 절), `product.html#booking`(회차·좌석 선택 영역), `dashboard.html#seatmap`(객석 도식).

### 3-1. 관객용 내비 — index.html 경로
```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__bar">
    <button class="btn btn--icon btn--ghost nav__burger" type="button" data-nav-toggle aria-controls="nav-sheet" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
    <nav class="nav__side nav__side--left" aria-label="극장">
      <a class="nav__link" href="pages/product.html">공연</a>
      <a class="nav__link" href="pages/pricing.html#rooms">객실</a>
      <a class="nav__link" href="#intermission">살롱</a>
    </nav>
    <a class="nav__brand" href="index.html" aria-label="금란좌 프로그램 북 표지">
      <span class="nav__word" lang="en">GEUMNAN-JWA</span><span class="nav__name">금란좌</span>
    </a>
    <nav class="nav__side nav__side--right" aria-label="관객">
      <a class="nav__link" href="pages/product.html#booking">예매</a>
      <a class="nav__link" href="pages/profile.html">회원</a>
      <div class="pop-wrap nav__box">
        <button class="nav__link nav__link--btn" type="button" data-popover aria-controls="pop-boxoffice">매표소</button>
        <div class="popover gilt" id="pop-boxoffice" role="dialog" aria-label="매표소 안내">
          <p class="popover__title">매표소</p>
          <p class="popover__body"><b class="nav__box-tel">02-2266-1936</b>화–일 11:00–21:00 · 월요일 휴관<br>서울 중구 을지로 금란좌길 7</p>
          <div class="popover__actions"><button class="btn btn--ghost" type="button" data-popover-close>닫기</button></div>
        </div>
      </div>
    </nav>
    <button class="btn btn--icon btn--ghost nav__theme" type="button" data-theme-toggle aria-label="조명 바꾸기"><span data-icon="moon"></span></button>
  </div>
  <div class="nav__sheet" id="nav-sheet">
    <nav class="nav__sheet-list" aria-label="전체 메뉴">
      <a href="pages/product.html">공연</a><a href="pages/pricing.html#rooms">객실</a><a href="#intermission">살롱</a><a href="pages/product.html#booking">예매</a><a href="pages/profile.html">회원</a><a href="tel:02-2266-1936">매표소 02-2266-1936</a>
    </nav>
  </div>
</header>
```

### 3-2. 관객용 내비 — pages/*.html 경로 (onboarding · pricing · product · profile · settings · 404)
```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__bar">
    <button class="btn btn--icon btn--ghost nav__burger" type="button" data-nav-toggle aria-controls="nav-sheet" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
    <nav class="nav__side nav__side--left" aria-label="극장">
      <a class="nav__link" href="product.html">공연</a>
      <a class="nav__link" href="pricing.html#rooms">객실</a>
      <a class="nav__link" href="../index.html#intermission">살롱</a>
    </nav>
    <a class="nav__brand" href="../index.html" aria-label="금란좌 프로그램 북 표지">
      <span class="nav__word" lang="en">GEUMNAN-JWA</span><span class="nav__name">금란좌</span>
    </a>
    <nav class="nav__side nav__side--right" aria-label="관객">
      <a class="nav__link" href="product.html#booking">예매</a>
      <a class="nav__link" href="profile.html">회원</a>
      <div class="pop-wrap nav__box">
        <button class="nav__link nav__link--btn" type="button" data-popover aria-controls="pop-boxoffice">매표소</button>
        <div class="popover gilt" id="pop-boxoffice" role="dialog" aria-label="매표소 안내">
          <p class="popover__title">매표소</p>
          <p class="popover__body"><b class="nav__box-tel">02-2266-1936</b>화–일 11:00–21:00 · 월요일 휴관<br>서울 중구 을지로 금란좌길 7</p>
          <div class="popover__actions"><button class="btn btn--ghost" type="button" data-popover-close>닫기</button></div>
        </div>
      </div>
    </nav>
    <button class="btn btn--icon btn--ghost nav__theme" type="button" data-theme-toggle aria-label="조명 바꾸기"><span data-icon="moon"></span></button>
  </div>
  <div class="nav__sheet" id="nav-sheet">
    <nav class="nav__sheet-list" aria-label="전체 메뉴">
      <a href="product.html">공연</a><a href="pricing.html#rooms">객실</a><a href="../index.html#intermission">살롱</a><a href="product.html#booking">예매</a><a href="profile.html">회원</a><a href="tel:02-2266-1936">매표소 02-2266-1936</a>
    </nav>
  </div>
</header>
```
현재 페이지 표시 규칙: product에서는 `공연`에, pricing에서는 `객실`에, profile과 settings에서는 `회원`에 `aria-current="page"`를 단다. 시트 안의 같은 링크에도 단다. onboarding과 404에는 달지 않는다.

### 3-3. 백스테이지 셸 — pages/*.html 경로 (dashboard · inbox · kanban)
```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<div class="backstage">
  <aside class="sidebar surface-peacock" id="bs-sidebar" aria-label="백스테이지 메뉴">
    <button class="btn btn--icon btn--ghost sidebar__close" type="button" data-sidebar-close aria-label="메뉴 닫기"><span data-icon="close"></span></button>
    <a class="sidebar__crown" href="dashboard.html"><span class="sidebar__word" lang="en">GEUMNAN-JWA</span><span class="sidebar__sub">백스테이지</span></a>
    <nav class="sidebar__nav" aria-label="운영 화면">
      <a class="sidebar__link" href="dashboard.html" aria-current="page"><span class="sidebar__num" lang="en">I</span>오늘 밤의 장부</a>
      <a class="sidebar__link" href="inbox.html"><span class="sidebar__num" lang="en">II</span>전보함<span class="sidebar__count">10</span></a>
      <a class="sidebar__link" href="kanban.html"><span class="sidebar__num" lang="en">III</span>제작 보드<span class="sidebar__count">12</span></a>
      <a class="sidebar__link" href="dashboard.html#seatmap"><span class="sidebar__num" lang="en">IV</span>객석 배치</a>
      <p class="sidebar__label">관객 쪽 화면</p>
      <a class="sidebar__link" href="../index.html"><span class="sidebar__num" aria-hidden="true"><i class="diamond diamond--sm"></i></span>프로그램 북 표지</a>
      <a class="sidebar__link" href="product.html"><span class="sidebar__num" aria-hidden="true"><i class="diamond diamond--sm"></i></span>달빛 레뷔 상세</a>
    </nav>
    <div class="sidebar__show">
      <span class="sidebar__show-code">P07-S05 · 수와레</span>
      <span class="sidebar__show-title">달빛 레뷔 — 경성 1936</span>
      <div class="meter meter--thin" style="--v:96.4"><div class="meter__track" role="progressbar" aria-valuenow="96.4" aria-valuemin="0" aria-valuemax="100" aria-label="수와레 좌석 점유 96.4%"><span class="meter__fill"></span></div></div>
      <span class="sidebar__show-time">397 / 412석 · 개막 19:30</span>
    </div>
    <div class="sidebar__user"><span class="avatar" aria-hidden="true">도겸</span><span class="sidebar__user-name">한도겸<span class="sidebar__user-role">무대감독</span></span></div>
  </aside>
  <div class="backstage__main">
    <header class="topbar">
      <button class="btn btn--icon btn--ghost topbar__menu" type="button" data-sidebar-toggle aria-controls="bs-sidebar" aria-label="백스테이지 메뉴 열기"><span data-icon="menu"></span></button>
      <nav class="crumbs" aria-label="경로"><ol class="crumbs__list">
        <li class="crumbs__item"><a class="crumbs__link" href="../index.html">금란좌</a></li>
        <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html">백스테이지</a></li>
        <li class="crumbs__item"><span aria-current="page">오늘 밤의 장부</span></li>
      </ol></nav>
      <div class="topbar__tools">
        <span class="topbar__now" lang="en">SAT 11.14 · 18:40</span>
        <button class="topbar__search" type="button" data-cmd-open aria-label="극장 전체 검색 (⌘K)"><span data-icon="search"></span><span>극장 전체 검색</span><kbd>⌘K</kbd></button>
        <button class="btn btn--icon btn--ghost" type="button" data-theme-toggle aria-label="조명 바꾸기"><span data-icon="moon"></span></button>
      </div>
    </header>
    <main id="main" class="backstage__content" tabindex="-1">
      <!-- 장면 -->
    </main>
    <!-- 3-5 푸터(pages 경로) -->
  </div>
</div>
<!-- 3-6 커맨드 팔레트 -->
```
inbox에서는 `II 전보함`에, kanban에서는 `III 제작 보드`에 `aria-current="page"`를 옮긴다. 브레드크럼 마지막 칸은 각각 `컨시어지 전보함`과 `시즌 제작 보드`로 바꾼다. ≤1024px에서 사이드바는 왼쪽에서 열리는 오프캔버스가 된다. 이때 바깥 클릭·Esc로 닫히고 포커스가 갇힌다.

### 3-4. 공통 푸터 — index.html 경로
```html
<footer class="colophon">
  <div class="colophon__inner">
    <span class="rule-triple" aria-hidden="true"></span>
    <a class="colophon__mark" href="index.html" aria-label="금란좌 프로그램 북 표지로"><span class="colophon__word" lang="en">GEUMNAN-JWA</span><span class="colophon__name">금란좌 · 1936</span></a>
    <nav class="colophon__links" aria-label="바닥글">
      <a href="index.html">프로그램 북 표지</a><a href="pages/product.html">달빛 레뷔</a><a href="pages/pricing.html">좌석과 회원권</a><a href="pages/onboarding.html">금란회 입회</a><a href="pages/dashboard.html">백스테이지</a>
    </nav>
    <p class="colophon__info"><span>금란좌</span><span>서울 중구 을지로 금란좌길 7</span><span>매표소 02-2266-1936</span><span>화–일 11:00–21:00</span><span>월요일 휴관</span></p>
    <p class="colophon__copy">© 1936–2026 금란좌</p>
  </div>
</footer>
```

### 3-5. 공통 푸터 — pages/*.html 경로 (관객용·백스테이지 모두 이것 하나)
```html
<footer class="colophon">
  <div class="colophon__inner">
    <span class="rule-triple" aria-hidden="true"></span>
    <a class="colophon__mark" href="../index.html" aria-label="금란좌 프로그램 북 표지로"><span class="colophon__word" lang="en">GEUMNAN-JWA</span><span class="colophon__name">금란좌 · 1936</span></a>
    <nav class="colophon__links" aria-label="바닥글">
      <a href="../index.html">프로그램 북 표지</a><a href="product.html">달빛 레뷔</a><a href="pricing.html">좌석과 회원권</a><a href="onboarding.html">금란회 입회</a><a href="dashboard.html">백스테이지</a>
    </nav>
    <p class="colophon__info"><span>금란좌</span><span>서울 중구 을지로 금란좌길 7</span><span>매표소 02-2266-1936</span><span>화–일 11:00–21:00</span><span>월요일 휴관</span></p>
    <p class="colophon__copy">© 1936–2026 금란좌</p>
  </div>
</footer>
```

### 3-6. 커맨드 팔레트 (모든 HTML의 `</body>` 바로 앞, 경로 무관)
```html
<div class="overlay cmd" id="cmd" hidden>
  <div class="overlay__scrim" data-close></div>
  <div class="cmd__panel gilt gilt--stage" role="dialog" aria-modal="true" aria-labelledby="cmd-title">
    <span class="ray-head" aria-hidden="true"></span>
    <p class="cmd__title" id="cmd-title">극장 전체 검색</p>
    <label class="cmd__field"><span data-icon="search"></span><span class="sr-only">검색어</span><input class="cmd__input" type="text" autocomplete="off" placeholder="공연 · 예약번호 · 좌석 · 회원"><kbd class="cmd__kbd">Esc</kbd></label>
    <ul class="cmd__list" data-cmd-source="default"></ul>
    <p class="cmd__foot"><span><kbd>↑↓</kbd>고르기</span><span><kbd>↵</kbd>열기</span><span><kbd>Esc</kbd>닫기</span></p>
  </div>
</div>
```
`data-cmd-source="default"`를 두면 app.js가 팩트 시트 색인을 채운다. 색인은 공연 4편, 오늘 수와레 예약 10건, 회원 2명, 화면 8곳이다. 링크 경로는 app.js가 알아서 맞춘다. ⌘K(Windows는 Ctrl+K)와 `[data-cmd-open]` 버튼이 연다.

### 3-7. index 막 진행 표시 (index.html 전용, `.nav` 바로 아래)
```html
<nav class="actbar" aria-label="막 진행" data-scrollspy>
  <ol class="actbar__list">
    <li class="actbar__item"><a class="actbar__link" href="#cover"><span class="actbar__mark" aria-hidden="true"></span>표지</a></li>
    <li class="actbar__item"><a class="actbar__link" href="#contents"><span class="actbar__mark" aria-hidden="true"></span>목차</a></li>
    <li class="actbar__item"><a class="actbar__link" href="#act-1" aria-label="제1막 금박과 막"><span class="actbar__mark" aria-hidden="true"></span><span class="actbar__roman" lang="en">I</span></a></li>
    <li class="actbar__item"><a class="actbar__link" href="#act-2" aria-label="제2막 활자"><span class="actbar__mark" aria-hidden="true"></span><span class="actbar__roman" lang="en">II</span></a></li>
    <li class="actbar__item"><a class="actbar__link" href="#act-3" aria-label="제3막 무대 장치"><span class="actbar__mark" aria-hidden="true"></span><span class="actbar__roman" lang="en">III</span></a></li>
    <li class="actbar__item"><a class="actbar__link" href="#intermission"><span class="actbar__mark" aria-hidden="true"></span>막간</a></li>
    <li class="actbar__item"><a class="actbar__link" href="#act-4" aria-label="제4막 출연진"><span class="actbar__mark" aria-hidden="true"></span><span class="actbar__roman" lang="en">IV</span></a></li>
    <li class="actbar__item"><a class="actbar__link" href="#curtain-call"><span class="actbar__mark" aria-hidden="true"></span>커튼콜</a></li>
  </ol>
</nav>
```
app.js 스크롤스파이가 현재 막에 `aria-current="true"`를, 지나온 막에 `.is-past`를 단다.

---

## 4. 컴포넌트 32종

### accordion — 관람 안내 각주
```html
<div class="acc" data-single>                         <!-- data-single: 하나만 열림. .acc--plain: 번호 들여쓰기 없음 -->
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="guide-1">
      <span class="acc__num">주 1</span><span class="acc__label">입장과 지연 입장</span><span class="acc__meta">19:00</span><span class="acc__mark" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="guide-1"><div class="acc__body"><p>하우스 오픈은 19:00입니다. …</p></div></div>
  </div>
</div>
```
- 마름모가 닫힘 상태에서는 사각형이고, 열리면 45° 돌아 금박으로 채워진다. 비활성은 `disabled`로 만든다.
- app.js: 클릭하면 토글하고 `hidden`을 맞춘다. ↑↓ Home End로 머리 사이를 옮긴다. 패널에 `role="region"`이 자동으로 붙는다.

### alert — 양쪽 셰브론 테두리
```html
<div class="alert alert--warn" role="status">         <!-- --info --ok --warn --danger --plain. danger 는 role="alert" -->
  <span class="alert__icon" data-icon="shield"></span>
  <div class="alert__body"><p class="alert__title">2막 5분 지연 가능성</p><p class="alert__text">무대감독 한도겸 · 선버스트 배경막 교체 점검 중</p><a class="link alert__action" href="kanban.html">제작 보드 PRD-108</a></div>
  <button class="alert__close" type="button" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button>
</div>
```
아이콘은 정보에 `info`, 경고에 `shield`, 위험에 `warn`을 쓴다. `data-dismiss`에 값이 없으면 가장 가까운 `.alert`를 닫고, `data-dismiss="id"`이면 그 요소를 닫는다.

### badge — 6각 로젠지
```html
<span class="badge badge--issued"><span class="badge__dot" aria-hidden="true"></span>발권 완료</span>
<span class="badge badge--pickup"><span class="badge__dot" aria-hidden="true"></span>현장 수령</span>
<span class="badge badge--refund"><span class="badge__dot" aria-hidden="true"></span>환불 완료</span>
<span class="badge badge--royal">로열박스</span> <span class="badge badge--r">R석</span> <span class="badge badge--s">S석</span> <span class="badge badge--balcony">발코니</span>
```
- 상태는 **이 세 가지로 고정**한다. 다른 상태 이름은 만들지 않는다.
- 형태: `--count`(숫자), `--mono`(코드), `--latin`(라틴 캡스: `SOIRÉE` `MATINÉE`), `--lg`, `--solid`, `--info`.

### breadcrumb — 금 마름모 구분자
```html
<nav class="crumbs" aria-label="경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="../index.html">금란좌</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html">백스테이지</a></li>
  <li class="crumbs__item"><span aria-current="page">오늘 밤의 장부</span></li>
</ol></nav>
```
코드값에는 `<span class="crumbs__code" aria-current="page">GN-261114-0731</span>`을 쓴다. ≤560px에서는 첫 칸과 마지막 칸만 남고 가운데가 `◆ ⋯ ◆`로 접힌다.

### button
```html
<button class="btn btn--primary btn--lg" type="button">좌석 고르기</button>
<button class="btn btn--primary" type="button">예매 확정 <span class="btn__price">₩196,000</span></button>
<button class="btn" type="button">회차 바꾸기</button>                 <!-- 보조 = 이중선 직사각(기본형) -->
<button class="btn btn--ghost" type="button">관람 안내 보기</button>
<button class="btn btn--danger" type="button">예약 취소</button>
<button class="btn btn--icon" type="button" aria-label="검색"><span data-icon="search"></span></button>
<a class="btn btn--primary" href="product.html#booking">예매하기</a>
```
- 변형: `--primary`(금박 면, 셰브론 컷), 기본(보조, 이중선), `--ghost`(금 글자와 중앙에서 펼쳐지는 밑줄), `--danger`(주홍 단선). 크기는 기본 44px, `--lg` 52px이다. `--icon`(정사각)에는 aria-label이 필수다. 그 밖에 `--block`이 있다.
- 상태:
  - `:hover`: 주 버튼은 금박이 흐르고, 보조는 안쪽 금선이 진해진다.
  - `:active`: 1px 내려앉는다.
  - `:focus-visible`: 3px 띄운 포커스 링이 생긴다.
  - `:disabled`·`aria-disabled="true"`: 면이 꺼진다.
  - `aria-pressed="true"`: 토글 선택 상태다.
  - `aria-busy="true"`: 로딩. 라벨은 `<span class="btn__label">`로 감싼다.
  - `data-state="error"`: 실패를 주홍으로 표시한다.
- 시연: `data-busy="1200"`을 주면 클릭 시 그만큼 선버스트 스피너가 돈다. `data-busy-text="발권 중"`, `data-busy-fail`(실패 시연), `data-fail-text`, `data-toast`(완료 후 토스트)를 함께 쓸 수 있다.
- 묶음: `.btn-row`(중앙 대칭), `.btn-row--start`, `.btn-row--end`.

### calendar — 공연 달력 (app.js 렌더)
```html
<div class="cal" data-cal="2026-11" data-today="2026-11-14" data-selected="2026-11-14"></div>
```
- 옵션: `data-min="2026-10"`, `data-max="2026-12"`(달 이동 범위), `data-no-legend`, `.cal--compact`(셀 52px, 시각 문구 숨김).
- 공연 일정은 app.js가 팩트 시트 레퍼토리(P05–P08)와 요일 규칙으로 계산한다. 화–금은 19:30, 토는 15:00·19:30, 일은 15:00이고 월요일은 휴관이다. **마크업에 날짜를 손으로 쓰지 않는다.**
- 표시: 공연일에는 회차 수만큼 금 마름모가 붙는다. 월요일은 사선 해칭과 "휴관", 오늘(14일)은 이중선 칸과 "오늘", 선택한 날은 공작록 면이다.
- 키보드: ←→↑↓ Home End로 움직이고, Enter·Space로 고른다. 달 경계를 넘으면 자동으로 달이 넘어간다.
- 이벤트: `gn:date`(`detail: { date, times, run, closed }`). 셀 아래 `[data-cal-output]`에 "11월 14일 토요일 · P07 달빛 레뷔 — 경성 1936 · 마티네 15:00 · 수와레 19:30"이 표시된다.

### card — 3등급 위계
```html
<!-- 단선(일반) -->
<article class="card">
  <header class="card__head"><h3 class="card__title">오늘 매출</h3><span class="card__meta">11.14 18:40</span></header>
  <p class="card__figure">₩66,286,000</p>
  <p class="card__body">마티네 ₩33,069,000 + 수와레 ₩33,217,000</p>
</article>
<!-- 이중선(주요) -->
<article class="card gilt"> … <footer class="card__foot"><span>얼음 추가 입고 완료</span><a class="link" href="inbox.html">전보 보기</a></footer></article>
<!-- 무대(화면당 1장: 대시보드 초점 지표, 추천 티켓 등) -->
<article class="card gilt gilt--stage card--stage card--glow">
  <span class="ray-head" aria-hidden="true"></span>
  <header class="card__head"><h3 class="card__title">수와레 P07-S05</h3><span class="card__meta">개막 50분 전</span></header>
  …
</article>
```
- 카드 머리에는 한글 제목과 금 단선만 둔다. **라틴 캡스 라벨은 쓰지 않는다.**
- 링크 카드는 `<a class="card">` 또는 `.card--link`로 만들고, hover 시 선이 진해지며 면이 바뀐다.
- 선택 상태는 `aria-current="true"` 또는 `.is-selected`로 표시한다. 그 밖에 `.card--sunk`, `.card--flat`, `.card__figure small`(단위)이 있다.

**입장권 `.ticket`** (커튼콜 9장, 회원권, 추천 티켓)
```html
<a class="ticket" href="pages/dashboard.html">
  <span class="ticket__stub"><span class="ticket__no" lang="en">I</span><span class="ticket__admit" lang="en">ADMIT ONE</span></span>
  <span class="ticket__body"><span class="ticket__kicker">백스테이지</span><span class="ticket__title">오늘 밤의 장부</span><span class="ticket__when">11.14 SAT 18:40</span></span>
</a>
<a class="ticket ticket--foil" href="pricing.html">…<span class="ticket__price">₩590,000</span>…</a>   <!-- 금박 반전 = 추천·현재 회원권 -->
<div class="ticket ticket--tall">…</div>                                                        <!-- 세로형(회원권 3장 나란히) -->
```
`ticket__stub`, `ticket__no`(Bodoni Moda 700 로마숫자 — `--font-numeral-sm`), `ticket__admit`(세로 라틴), `ticket__kicker`, `ticket__title`, `ticket__when`(Courier), `ticket__price`, `ticket__latin`을 쓴다. 절취선과 좌우 반원 홈은 CSS가 그린다.

### carousel — 객실·공연 도판
```html
<div class="carousel" aria-roledescription="캐러셀" aria-label="객실 도판">
  <div class="carousel__viewport">
    <figure class="carousel__slide">
      <div class="plate-art plate-art--deluxe" role="img" aria-label="계단 아치 창 너머로 무대가 보이는 스테이지 뷰 디럭스"><span class="plate-art__tag">701 – 706</span></div>
      <figcaption class="carousel__caption"><span class="carousel__title">스테이지 뷰 디럭스</span><span class="carousel__meta">7·8층 12실 · 체크인 15:00</span><span class="carousel__price">₩260,000 / 박</span></figcaption>
    </figure>
    …
  </div>
  <div class="carousel__controls">
    <button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="이전 도판"><span data-icon="chevron-left"></span></button>
    <div class="carousel__dots"></div>                  <!-- 비워 두면 app.js 가 마름모 점을 만든다 -->
    <button class="carousel__arrow carousel__arrow--next" type="button" aria-label="다음 도판"><span data-icon="chevron-right"></span></button>
  </div>
</div>
```
- CSS 도판은 `.plate-art--deluxe`(계단 아치 창과 무대), `--suite`(부채꼴 헤드보드), `--stage`(프로시니엄·휘장·초승달), `--salon`(쿠프 잔과 바)이다. 자동재생은 없다.
- 스크롤 스냅으로 넘기고 ←→ 키가 동작한다. `.carousel__count`가 있으면 "1 / 4"가 표시된다.

### code — 흑 래커 면 + 금 행번호
```html
<figure class="code">
  <figcaption class="code__head"><span class="code__name">ticket.css</span><button class="code__copy" type="button">복사</button></figcaption>
  <pre class="code__pre"><code><span class="tk-c">/* 추천 티켓 = 금박 반전 */</span>
<span class="tk-k">.ticket--foil</span> {
  background: <span class="tk-s">var(--foil)</span>;
}</code></pre>
</figure>
```
줄 번호는 app.js가 매긴다. 색 토큰 클래스는 `.tk-c`(주석), `.tk-k`(선택자·키워드), `.tk-s`(값), `.tk-p`(속성)이다. 본문 안 인라인 `<code>`는 자동으로 상아 바탕 칩이 된다.

### command — ⌘K 극장 전체 검색
오버레이 마크업은 3-6에 있다. **열린 상태를 정적으로 보여 주는 견본**(index 3장 무대 뒤):
```html
<div class="cmd__panel cmd__panel--static gilt gilt--stage" role="group" aria-label="극장 전체 검색 견본">
  <span class="ray-head" aria-hidden="true"></span>
  <p class="cmd__title">극장 전체 검색</p>
  <label class="cmd__field"><span data-icon="search"></span><span class="sr-only">검색어</span><input class="cmd__input" type="text" value="달빛" placeholder="공연 · 예약번호 · 좌석 · 회원"><kbd class="cmd__kbd">⌘K</kbd></label>
  <ul class="cmd__list" data-cmd-source="default"></ul>
</div>
<button class="btn" type="button" data-cmd-open>⌘K 실제로 열기</button>
```
- 정적 견본도 실제로 걸러진다. 직접 항목을 쓸 때는 다음 형식을 따른다.
  ```html
  <li class="cmd__group" role="presentation">좌석</li>
  <li class="cmd__item" role="option" data-href="dashboard.html#seatmap" data-keywords="F-12 지정석"><span data-icon="seat"></span><span class="cmd__label">F-12 · 이정원 님 지정석<span class="cmd__sub">R석 · 1층 F열</span></span><span class="cmd__meta">₩98,000</span></li>
  ```
- 동작 속성: `data-href`(이동), `data-open="overlayId"`(다른 오버레이 열기), `data-toast`와 `data-toast-text`(알림). ↑↓로 고르고 Enter로 실행한다. 일치하는 글자는 `<mark>`로 금 밑줄이 그어진다.

### drawer — 좌석 상세
```html
<button class="btn" type="button" data-open="d-f12">좌석 F-12 상세</button>
<div class="overlay drawer" id="d-f12" hidden>
  <div class="overlay__scrim" data-close></div>
  <div class="drawer__panel gilt" role="dialog" aria-modal="true" aria-labelledby="d-f12-t">
    <div class="drawer__top">
      <div><p class="drawer__kicker">오케스트라 R석 · 1층 F열</p><span class="drawer__seat" id="d-f12-t">F-12</span></div>
      <button class="btn btn--icon btn--ghost" type="button" data-close aria-label="닫기"><span data-icon="close"></span></button>
    </div>
    <p class="drawer__title">이정원 님의 지정석</p>
    <div class="drawer__body"> … 리더 점선 목록 · 배지 … </div>
    <div class="drawer__foot"><button class="btn" type="button" data-close>닫기</button><button class="btn btn--primary" type="button" data-close data-toast="F-12 좌석 메모를 저장했습니다">메모 저장</button></div>
  </div>
</div>
```
정적 견본은 `<div class="drawer__panel drawer__panel--static gilt" role="group" aria-label="좌석 상세 견본">`으로 만든다. 열리면 오른쪽에서 미끄러져 들어온다. Esc와 배경 클릭으로 닫히고, 포커스가 갇혔다가 닫힐 때 트리거로 돌아간다.

### empty — 닫힌 커튼
```html
<div class="empty">
  <div class="empty__stage" aria-hidden="true"><span class="empty__valance"></span></div>
  <h3 class="empty__title">아직 오른 막이 없습니다</h3>
  <p class="empty__text">12월 27일 송년 갈라 이후의 레퍼토리는 아직 발표 전입니다.</p>
  <div class="empty__actions"><a class="btn" href="product.html">현재 공연 보기</a></div>
</div>
```
`.empty--sm`은 칸반 빈 열과 패널 안에 쓰는 작은 크기다.

### form — 프로그램북 신청서 양식
```html
<form class="form" data-validate data-success-toast="예매 신청서를 받았습니다" data-success-text="GN-261114-0741 · 매표소 확인 후 전보로 알려 드립니다" novalidate>
  <div class="alert alert--danger form__summary" role="alert" hidden><span class="alert__icon" data-icon="warn"></span><div class="alert__body"><p class="alert__title">신청서를 다시 확인해 주십시오</p><p class="alert__text"></p></div></div>
  <div class="field">
    <label class="field__label" for="bk-name">이름<span class="field__req" aria-hidden="true">*</span></label>
    <input class="input" id="bk-name" name="name" required autocomplete="name">
  </div>
  <div class="field">
    <label class="field__label" for="bk-tel">연락처<span class="field__req" aria-hidden="true">*</span></label>
    <input class="input" id="bk-tel" name="tel" required data-mask="phone" autocomplete="tel" aria-describedby="bk-tel-h">
    <p class="field__hint" id="bk-tel-h">발권 문자를 이 번호로 보냅니다.</p>
  </div>
  <div class="form__row">
    <div class="field"><label class="field__label" for="bk-zone">구역</label><select class="select" id="bk-zone"><option>오케스트라 S석 · ₩77,000</option><option>발코니 · ₩55,000</option></select></div>
    <div class="field"><span class="field__label" id="bk-n">인원</span>
      <div class="stepper" role="group" aria-labelledby="bk-n">
        <button type="button" class="stepper__btn" data-stepper="-1" aria-label="한 명 줄이기"><span data-icon="minus"></span></button>
        <input class="stepper__value" type="number" min="1" max="4" value="2" aria-labelledby="bk-n">
        <button type="button" class="stepper__btn" data-stepper="1" aria-label="한 명 늘리기"><span data-icon="plus"></span></button>
      </div></div>
  </div>
  <div class="field"><label class="field__label" for="bk-memo">요청 사항<span class="field__opt">선택</span></label><textarea class="textarea" id="bk-memo" maxlength="120" data-count></textarea><span class="field__count" aria-live="polite"></span></div>
  <fieldset class="fieldset"><legend class="fieldset__legend">관람 회차</legend>
    <div class="choice-group choice-group--row"><label class="radio"><input type="radio" name="slot" checked>수와레 19:30</label><label class="radio"><input type="radio" name="slot">마티네 15:00</label></div>
  </fieldset>
  <label class="check"><input type="checkbox" required data-msg-required="관람 약관에 동의해야 신청할 수 있습니다.">관람 약관과 환불 규정에 동의합니다</label>
  <label class="switch"><input type="checkbox" checked>개막 리허설 초대 알림<span class="switch__state" data-on="받음" data-off="받지 않음"></span></label>
  <button class="btn btn--primary btn--lg" type="submit" data-busy="900"><span class="btn__label">신청서 보내기</span></button>
</form>
```
- 입력 종류는 `.input`(`--mono` `--lg`), `.select`, `.textarea`, `.affix`(`<span class="affix__part">₩</span>` + input), `.stepper`, `.check`(사각), `.radio`(마름모), `.switch`(직사각 트랙과 마름모 손잡이)이다.
- 상태:
  - hover: 선이 진해진다.
  - focus: 공작록 테두리와 이중선 승격.
  - `aria-invalid="true"` 또는 `.field--error`: 주홍 테두리와 `.field__error` 문장이 붙는다.
  - `:disabled`, `[readonly]`.
  - 체크·라디오에서 `:checked`는 금박, `:indeterminate`도 쓸 수 있다.
- `data-validate` 동작:
  - 제출 시 required·전화(`010-0000-0000`)·email·pattern·maxlength를 검사한다.
  - 오류 문장은 `.field__error`로 만들고 `aria-describedby`에 연결한다.
  - `.form__summary`에 오류 개수를 쓰고 첫 오류 칸으로 포커스를 옮긴다.
  - 오류 문장은 `data-msg-required`와 `data-msg-pattern`으로 바꿀 수 있다.
  - 성공하면 `gn:submit` 이벤트를 보내고 `data-success-toast`를 띄운다.
- `data-mask="phone"`은 숫자를 자동으로 하이픈 형식으로 바꾼다. `data-count`는 `.field__count`에 "12 / 120"을 표시한다.

### kanban — 시즌 제작 보드
```html
<div class="kanban" aria-label="시즌 제작 보드">
  <section class="kanban__col" aria-labelledby="kc-1">
    <header class="kanban__head"><span class="kanban__no" lang="en">I</span><h3 class="kanban__title" id="kc-1">구상</h3><span class="kanban__count"><b>2</b>장</span></header>
    <ul class="kanban__list">
      <li class="kanban__card" id="prd-118">
        <span class="kanban__id">PRD-118</span>
        <span class="kanban__name">2027 봄 실내악 「정원의 오후」 레퍼토리 선정</span>
        <span class="kanban__meta"><span class="kanban__who"><span class="avatar avatar--sm" aria-hidden="true">시아</span>류시아</span><span>12.20</span></span>
      </li>
    </ul>
    <button class="kanban__add" type="button" data-toast="구상 열에 새 제작 카드를 놓을 자리를 만들었습니다">카드 추가</button>
  </section>
  …
  <section class="kanban__col surface-peacock" aria-labelledby="kc-5"> … 공연 중 … </section>
</div>
```
- 열 머리에는 지구라트 왕관과 로마숫자 장 번호(I–V)가 붙는다. "공연 중" 열에만 `surface-peacock`을 쓴다.
- 마우스로 끌어 놓을 수 있다. 끄는 동안 카드는 이중선이 되고, 놓을 열은 `.is-over` 점선 테두리가 된다.
- 키보드: Space·Enter로 들고, ←→로 열을, ↑↓로 순서를 바꾸고, Space로 놓는다. Esc는 취소다. 들지 않은 상태에서는 ↑↓←→로 카드 사이를 옮겨 다닌다.
- 열은 `align-items: start`라 마지막 카드 + 「카드 추가」 칸에서 끝난다(짧은 열 아래 빈 면 없음). ≤560px 가로 스크롤 보드는 app.js가 보드 높이를 지금 보이는 열 높이에 맞춘다.
- 열의 `kanban__count b`는 자동으로 갱신된다. 스크린리더용 안내(aria-live)가 있다. 이벤트는 `gn:kanban`(`{ card, column }`)이다.

### list — 리더 점선 목록 (기본) · 선택 목록
```html
<ul class="leaders leaders--serif">                    <!-- 목차·출연진·가격표. --serif 명조, --ruled 행 금선, --mirror 거울(값이 왼쪽) -->
  <li class="leaders__row"><span class="leaders__key">제1막 금박과 막</span><span class="leaders__val">7</span></li>
  <li class="leaders__row leaders__row--total"><span class="leaders__key">오늘 티켓 매출</span><span class="leaders__val num">₩66,286,000</span></li>
</ul>
<a class="leaders__row" href="#act-1"> … </a>              <!-- 목차 행을 링크로 만들 때 -->

<div class="list" data-selectable role="listbox" aria-label="전보함">
  <button class="list__row is-unread" type="button" role="option" aria-selected="true">
    <span class="list__lead avatar avatar--sm" aria-hidden="true">정원</span>
    <span class="list__title">F-12 옆자리 F-13 추가 가능한가요</span><span class="list__time">18:31</span>
    <span class="list__text"><span class="list__id">TG-1114-018</span> · 이정원</span>
  </button>
</div>
```
선택 목록에서 선택한 행에는 왼쪽 공작록 막대와 금박 마름모가 붙는다. `.is-unread`는 제목 앞에 마름모가 붙는다. `data-selectable`이면 클릭으로 선택되고(`gn:select`) ↑↓로 이동한다.

### marquee — 극장 전광 마퀴
```html
<div class="marquee surface-peacock" aria-label="오늘 밤 안내">          <!-- 흑 띠: surface-lacquer. 큰 글자: .marquee--lg -->
  <span class="bulbs" aria-hidden="true"></span>
  <div class="marquee__viewport"><div class="marquee__track">
    <p class="marquee__group"><span class="marquee__item">오늘 밤 수와레 <b>19:30</b></span><span class="marquee__item">잔여 <b>15석</b></span><span class="marquee__item">막간 20:25 – 20:45</span><span class="marquee__item">살롱 1936 「금란 1936」 <b>₩18,000</b></span></p>
  </div></div>
  <span class="bulbs" aria-hidden="true"></span>
</div>
```
app.js가 그룹을 복제해 이음매 없이 흐르게 하고 정지·재생 버튼(aria-pressed)을 붙인다. hover·focus 중에는 멈춘다. reduced-motion이면 정적인 한 줄에 좌우 스크롤이 된다.

### menu — 이중선 메뉴
```html
<div class="menu-wrap">
  <button class="btn" type="button" aria-haspopup="menu" aria-controls="m-slot">회차 선택 <span data-icon="chevron-down"></span></button>
  <ul class="menu gilt" id="m-slot" role="menu">        <!-- 오른쪽 맞춤 .menu--end, 위로 .menu--up -->
    <li role="none"><button class="menu__item" type="button" role="menuitemradio" aria-checked="false">마티네 15:00</button></li>
    <li role="none"><button class="menu__item" type="button" role="menuitemradio" aria-checked="true">수와레 19:30</button></li>
    <li role="separator" class="menu__sep"></li>
    <li role="none"><button class="menu__item" type="button" role="menuitem"><span data-icon="ticket"></span>발권 다시 하기<span class="menu__kbd">⌘P</span></button></li>
    <li role="none"><button class="menu__item" type="button" role="menuitem" aria-disabled="true">로열박스로 이동(만석)</button></li>
    <li role="none"><button class="menu__item menu__item--danger" type="button" role="menuitem"><span data-icon="trash"></span>예약 취소</button></li>
  </ul>
</div>
```
- 정적 견본은 `<ul class="menu gilt is-static" role="menu" aria-label="회차 메뉴 견본">`으로 만든다. 그룹 머리는 `<li class="menu__label" role="presentation">`이다.
- app.js: 트리거에서 ↓↑로 열고, 열린 메뉴 안에서 ↑↓ Home End와 첫 글자로 항목을 옮긴다. Esc는 닫고 포커스를 트리거로 돌린다. 바깥을 클릭하면 닫힌다. `menuitemradio`는 고른 항목만 checked가 된다. 이벤트는 `gn:menu`이다.

### modal — 무대 등급
```html
<button class="btn btn--primary" type="button" data-open="m-f13">F-13 추가</button>
<div class="overlay modal" id="m-f13" hidden>
  <div class="overlay__scrim" data-close></div>
  <div class="modal__panel gilt gilt--stage" role="dialog" aria-modal="true" aria-labelledby="m-f13-t" aria-describedby="m-f13-d">
    <span class="ray-head" aria-hidden="true"></span>
    <p class="modal__kicker">GN-261114-0731 · 수와레 P07-S05</p>
    <h2 class="modal__title" id="m-f13-t">F-13 좌석을 추가할까요</h2>
    <span class="rule-double" aria-hidden="true"></span>
    <div class="modal__body" id="m-f13-d"><p>이정원 님의 지정석 F-12 바로 옆 자리입니다. …</p></div>
    <div class="modal__actions"><button class="btn" type="button" data-close>취소</button><button class="btn btn--primary" type="button" data-close data-toast="F-13 좌석을 예약 장부에 추가했습니다" data-toast-text="GN-261114-0731 · 이정원 님 · 3인">추가 확정</button></div>
    <button class="btn btn--icon btn--ghost modal__x" type="button" data-close aria-label="닫기"><span data-icon="close"></span></button>
  </div>
</div>
```
- 정적 견본은 `<div class="modal__panel modal__panel--static gilt gilt--stage" role="group" aria-label="모달 견본">`이다. 넓은 판은 `.modal__panel--wide`를 쓴다.
- 열면 래커 막이 위로 걷히고(막 오름, app.js가 `.curtain`을 넣는다) 선버스트 머리가 3° 돈다. Esc와 배경 클릭으로 닫힌다. 포커스는 패널 안에 갇히고, 닫으면 트리거로 돌아간다. 스크롤도 잠긴다.
- API: `gn.open('m-f13')`, `gn.close('m-f13')`. 이벤트는 `gn:open`과 `gn:close`이다.

### motion — 모션 견본
```html
<div class="motion-demo">
  <div class="motion-demo__item">
    <div class="motion-demo__stage" id="mo-curtain" data-motion="curtain"><span class="curtain is-raised" aria-hidden="true"></span><span class="motion-demo__act" lang="en">ACT II</span></div>
    <p class="motion-demo__name">막 오름</p><p class="motion-demo__spec">720ms · cubic-bezier(.65,0,.25,1)</p>
    <button class="btn" type="button" data-replay="mo-curtain"><span data-icon="replay"></span>다시 재생</button>
  </div>
  <!-- data-motion: gilt(.foil-text 포함) · spread(.spread-line) · stagger([data-stagger] 자식) · rays(.ray-head) · meter · gauge -->
</div>
```
- 진입 1회 재생: 요소에 `data-reveal="gilt|curtain|spread|stagger|rays|meter|gauge|rise"`를 단다. 화면에 20% 들어오면 1회 재생된다.
- `[data-stagger]`의 자식은 가운데에서 바깥 순서로 60ms씩 늦게 나온다. 9번째 자식부터는 동시에 나온다.
- `gn.play(el, 'gilt')`로 직접 재생할 수 있다. 화면당 움직이는 장식은 2개 이하로 둔다.

### navbar
셸 3-1, 3-2, 3-7(막 진행), 3-3(백스테이지 `.topbar`)를 그대로 쓴다. 상태는 다음과 같다.
- `.nav__link`: hover 시 밑줄이 중앙에서 펼쳐진다. `aria-current="page"`이면 금 글자 아래에 금박 마름모가 붙는다.
- 메뉴는 좌 3(공연 · 객실 · 살롱) · 우 3(예매 · 회원 · 매표소)으로 글자 수까지 대칭이다. `매표소`는 링크가 아니라 팝오버 트리거(`#pop-boxoffice`, 02-2266-1936 · 화–일 11:00–21:00 · 월요일 휴관)다.
- 조명 토글 `.nav__theme`은 메뉴 줄 바깥, 바 오른쪽 끝 여백(absolute)에 둔다. 메뉴 줄 안에 아이콘을 넣어 좌우 무게를 깨지 않는다.
- ≤860px에서 메뉴 버튼, 워드마크, 조명 토글이 대칭으로 놓이고 시트가 막처럼 내려온다. 시트 끝에 `매표소 02-2266-1936`(tel 링크)이 붙는다.

### pagination
```html
<!-- 표와 연결(자동 생성) -->
<nav class="pager" aria-label="예약 장부 쪽" data-pager-for="ledger" data-per-page="5"><ul class="pager__list"></ul><p class="pager__info"></p></nav>
<!-- 정적 링크형 -->
<nav class="pager" aria-label="관람 후기 쪽"><ul class="pager__list">
  <li><a class="pager__step" href="product.html?page=1" aria-label="이전 쪽"><span data-icon="chevron-left"></span><span>이전</span></a></li>
  <li><a class="pager__link" href="product.html?page=1" aria-label="1쪽">1</a></li>
  <li><a class="pager__link" href="product.html?page=2" aria-current="page" aria-label="2쪽">2</a></li>
  <li class="pager__gap" aria-hidden="true">⋯</li>
  <li><a class="pager__step" href="product.html?page=3" aria-label="다음 쪽"><span>다음</span><span data-icon="chevron-right"></span></a></li>
</ul></nav>
```
현재 쪽은 금박 마름모 안에 숫자로 표시된다. 버튼형은 `<button class="pager__link" data-page="2">`로 만들며 클릭하면 `aria-current`가 옮겨 가고 `gn:page`가 발생한다. 끝 쪽에서는 `aria-disabled="true"`가 된다.

### popover — 계단 꼬리
```html
<div class="pop-wrap">
  <button class="btn btn--ghost" type="button" data-popover aria-controls="pop-rb">가격 기준</button>
  <div class="popover gilt" id="pop-rb" role="dialog" aria-label="로열박스 가격 기준">   <!-- 위로: data-place="top" -->
    <p class="popover__title">로열박스 가격</p>
    <p class="popover__body">박스당 4인 ₩720,000, 1인 ₩180,000. 부가세 포함.</p>
    <div class="popover__actions"><button class="btn btn--ghost" type="button" data-popover-close>닫기</button></div>
  </div>
</div>
```
정적 견본은 `<div class="popover gilt is-static" role="group" aria-label="…">`이다. 정적 견본(`.menu.is-static`, `.popover.is-static`, `.tooltip.is-static`, `.sidebar--static`)은 `z-index: auto`라 sticky 내비·막 진행 바·오버레이 스크림 위로 뜨지 않는다. 계단 꼬리(`.popover__tail`)는 app.js가 넣는다. 화면 밖으로 나가지 않게 위치를 보정하고, Esc와 바깥 클릭으로 닫는다.

### progress — 좌석 점유 게이지
```html
<div class="meter" style="--v:96.4">                        <!-- .meter--mirror 중앙에서 양쪽으로 · --thin · --warn · --danger · --indeterminate -->
  <div class="meter__top"><span class="meter__label">수와레 좌석 점유</span><span class="meter__value">96.4<small>%</small></span></div>
  <div class="meter__track" role="progressbar" aria-valuenow="96.4" aria-valuemin="0" aria-valuemax="100" aria-label="수와레 좌석 점유"><span class="meter__fill"></span></div>
  <div class="meter__foot"><span>397석 판매</span><span>잔여 15석</span></div>
</div>

<div class="gauge gauge--glow" style="--v:.964;--size:280px" data-value=".964" data-reveal="gauge" role="img" aria-label="수와레 397 / 412석 판매, 96.4%">
  <div class="gauge__dial"><div class="gauge__readout"><span class="gauge__num foil-text">397</span><span class="gauge__of">/ 412석</span></div></div>
  <p class="gauge__label">수와레 P07-S05 · 잔여 15석</p>
</div>

<div class="seatmap" id="seatmap" data-seatmap="soiree" data-mark="F-12"></div>
```
- 반원 게이지는 24갈래 광선이 값만큼 금으로 켜진다. 다크에서 `--glow`를 쓰는 곳은 화면당 한 곳이다.
- **객석 도식**(app.js 렌더, 412석): 무대, 로열박스 6(좌우 대칭), R석 A–F, S석 G–L(22석씩, 중앙 통로), 2층 발코니(4줄, 124석)로 그려진다.
  - `data-seatmap`: `soiree`(397석 판매), `matinee`(401석), `blank`(빈 객석).
  - `data-mark="F-12,F-13"`: 해당 좌석을 주홍 마름모로 표시한다.
  - `data-pick`: 구역 고르기(온보딩 1막)가 된다. 구역이 `aria-pressed` 버튼이 되고 `gn:zone` 이벤트가 발생한다. 처음 선택은 `data-zone="S"`로 준다.
  - `data-summary="off"`: 요약 줄을 숨긴다.

### sidebar
셸 3-3을 그대로 쓴다. 장면 안에 축소 견본을 둘 때는 `<aside class="sidebar sidebar--static surface-peacock" aria-label="백스테이지 사이드바 견본">`으로 만든다.
- 현재 항목: 이중선 박스와 왼쪽 금박 마름모가 붙는다.
- 상단 지구라트 계단 아래에 워드마크가 놓인다.
- `.sidebar__count`에는 전보 10통, 제작 카드 12장을 쓴다.

### skeleton — 플루팅 줄무늬
```html
<div class="row"><span class="skel skel--avatar" aria-hidden="true"></span>
  <div class="skel-group" style="flex:1" aria-hidden="true"><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line skel--short"></span></div></div>
<div class="skel skel--block" aria-hidden="true"></div>
<p class="sr-only" role="status">전보함을 불러오는 중</p>
```

### spinner — 12갈래 선버스트
```html
<span class="spinner-block" role="status"><span class="spinner spinner--lg" aria-hidden="true"></span>좌석 배치를 불러오는 중</span>
<span class="spinner spinner--sm" role="status"><span class="sr-only">불러오는 중</span></span>
```
30° 스텝으로 돈다. reduced-motion에서는 느리게 돈다(로딩의 의미는 유지한다).

### steps — 예매 4단계
```html
<ol class="steps" id="bk-steps" data-step="1" aria-label="예매 단계">   <!-- .steps--vertical 세로형 -->
  <li class="steps__item"><span class="steps__mark" lang="en" aria-hidden="true">I</span><span class="steps__label">공연</span><span class="sr-only steps__state"></span></li>
  <li class="steps__item"><span class="steps__mark" lang="en" aria-hidden="true">II</span><span class="steps__label">좌석</span><span class="sr-only steps__state"></span></li>
  <li class="steps__item"><span class="steps__mark" lang="en" aria-hidden="true">III</span><span class="steps__label">결제</span><span class="sr-only steps__state"></span></li>
  <li class="steps__item"><span class="steps__mark" lang="en" aria-hidden="true">IV</span><span class="steps__label">발권</span><span class="sr-only steps__state"></span></li>
</ol>
<button class="btn" type="button" data-steps-go="prev" data-steps-target="bk-steps">이전 단계</button>
<button class="btn btn--primary" type="button" data-steps-go="next" data-steps-target="bk-steps">다음 단계</button>
```
- 상태 표시:
  - 완료 `.is-done`: 금박 마름모, 잇는 선이 금박 3px가 된다.
  - 현재 `aria-current="step"`: 이중선 마름모.
  - 오류 `.is-error`: 주홍.
- app.js가 `data-step`(0부터)을 읽어 맞춘다. `gn.setStep(el, i)`를 쓸 수 있고, 이벤트는 `gn:step`이다. 온보딩은 3막이므로 항목 3개로 쓴다.

### table — 예약 장부
```html
<div class="table-wrap" role="region" aria-label="오늘 수와레 예약 장부" tabindex="0">
  <table class="table table--stack" id="ledger" data-selectable>
    <thead><tr>
      <th scope="col" aria-sort="none"><button class="table__sort" type="button">예약</button></th>
      <th scope="col">이름</th><th scope="col">좌석</th><th scope="col">구역</th>
      <th scope="col" class="num" aria-sort="none"><button class="table__sort" type="button">인원</button></th>
      <th scope="col">상태</th>
      <th scope="col" class="num" aria-sort="none"><button class="table__sort" type="button">금액</button></th>
    </tr></thead>
    <tbody>
      <tr><td data-label="예약" class="mono">GN-261114-0731</td><td data-label="이름" class="table__name">이정원</td><td data-label="좌석" class="mono">F-12</td><td data-label="구역">R석</td><td data-label="인원" class="num">2</td><td data-label="상태"><span class="badge badge--issued">발권 완료</span></td><td data-label="금액" class="num">₩196,000</td></tr>
      <tr class="is-muted"> … 환불 완료 행 … </tr>
    </tbody>
  </table>
</div>
```
- 머리줄은 위아래 이중 금선이다. 숫자는 `.num`(Courier, 우정렬)이다.
- 행 hover와 선택(`aria-selected="true"`) 시 좌우 끝에 마름모가 붙는다. 그 밖의 행 상태는 `.is-muted`(환불)와 `.is-new`(방금 추가)이다.
- 정렬: `th > button.table__sort`를 누르면 `aria-sort`가 순환한다. 숫자 열은 `th.num` 또는 `data-type="num"`으로 표시한다. 셀 정렬값은 `data-sort`로 덮어쓸 수 있다.
- `.table--stack`: ≤560px에서 행이 카드로 쌓인다(`td[data-label]` 필수). 그 밖에 `.table--compact`가 있다.
- 쪽 나누기: `[data-pager-for="ledger"]`를 둔다.

### tabs · seg
```html
<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="객석 구역">
    <button class="tabs__tab" type="button" role="tab" id="tz-all" aria-selected="true" aria-controls="pz-all">전체 <span class="tabs__count">10</span></button>
    <button class="tabs__tab" type="button" role="tab" id="tz-r" aria-selected="false" aria-controls="pz-r">오케스트라 R</button>
    …
  </div>
  <div class="tabs__panel gilt" role="tabpanel" id="pz-all" aria-labelledby="tz-all" tabindex="0">…</div>
  <div class="tabs__panel gilt" role="tabpanel" id="pz-r" aria-labelledby="tz-r" tabindex="0" hidden>…</div>
</div>

<div class="seg" role="group" aria-label="회차">
  <button class="seg__btn" type="button" aria-pressed="false" data-value="matinee">마티네 15:00</button>
  <button class="seg__btn" type="button" aria-pressed="true" data-value="soiree">수와레 19:30</button>
</div>
```
- 탭 인디케이터는 중앙에서 펼쳐지는 금박 3px이다. ←→ Home End로 옮긴다. 모바일에서 넘치면 탭 줄이 가로로 스크롤되고 양끝이 흐려진다(`data-overflow`).
- 세그먼트의 선택 항목은 공작록 면이다. `data-multi`를 주면 여러 개를 고를 수 있다. 이벤트는 `gn:seg`이다.

### timeline — 막 타임시트
```html
<ol class="timesheet">                                   <!-- .timesheet--center 축 50%. 기본 축 38%, 모바일 96px -->
  <li class="timesheet__item is-past"><span class="timesheet__time">19:00</span><div class="timesheet__body"><p class="timesheet__title">하우스 오픈</p></div></li>
  <li class="timesheet__item is-act is-now"><span class="timesheet__time">19:30<small>– 20:25</small></span><div class="timesheet__body"><p class="timesheet__title">제1막 「황금정의 밤」</p><p class="timesheet__text">윤달래 · 남궁효와 금란 악단</p></div></li>
  …
</ol>
```
가로 띠형(대시보드 상단)은 다음과 같다.
```html
<div class="timestrip" style="--n:5"><div class="timestrip__cell is-past"><p class="timestrip__time">19:00</p><p class="timestrip__name">하우스 오픈</p></div><div class="timestrip__cell is-now" style="--at:0%">…</div>…</div>
```
- 기준 시각이 18:40이므로 오늘 밤 공연에는 아직 `.is-now`가 없다. 대시보드 띠에서는 하우스 오픈 칸을 `.is-now`로 하고 `--at:0%`로 막 오르기 전을 표시한다.
- profile 관람 이력도 같은 `.timesheet`를 쓴다. 날짜는 왼쪽, 공연은 오른쪽에 둔다.

### toast
```html
<button class="btn" type="button" data-toast="F-13 좌석을 예약 장부에 추가했습니다" data-toast-text="GN-261114-0731 · 3인" data-toast-tone="ok">추가</button>
<!-- 정적 견본 -->
<div class="toast gilt is-static" role="status"><span class="toast__mark" aria-hidden="true"></span><div><p class="toast__title">F-13 좌석을 예약 장부에 추가했습니다</p><p class="toast__text">GN-261114-0731 · 3인</p></div><button class="toast__close" type="button" aria-label="알림 닫기"><span data-icon="close"></span></button></div>
```
하단 중앙에서 막 오름으로 등장하고 4초 뒤에 사라진다. hover·focus 중에는 멈추고, 최대 3장까지 쌓인다. API는 `gn.toast({ title, text, tone: 'ok'|'danger', duration })`이다.

### tooltip
```html
<button class="btn btn--icon" type="button" aria-label="막간 시각" data-tip="막간 20:25 – 20:45 · 살롱 1936"><span data-icon="clock"></span></button>
<span class="tooltip is-static">막간 20:25 – 20:45</span>           <!-- 정적 견본 -->
```
흑 래커 면에 금 글자, 계단 꼬리가 붙는다. hover나 focus 후 120ms에 나타나고, Esc·스크롤·blur에 사라진다. `aria-describedby`는 자동으로 연결된다. 위쪽 공간이 없으면 아래에 뜬다.

---

## 5. 장면 작성 체크

- [ ] 셸(3절)이 스니펫과 똑같다. 고정 앵커 4개(`#intermission` `#rooms` `#booking` `#seatmap`)가 해당 페이지에 있다.
- [ ] 오버레이(모달·드로어·커맨드·메뉴·팝오버·툴팁·토스트)를 index 3장에서 **정적 견본과 실제 트리거로 둘 다** 보여 준다.
- [ ] 같은 면색·같은 폭 섹션이 두 번 연달아 오지 않는다(막 표지 → 상아 장면 → 공작록 막간 띠 …).
- [ ] 화면당 무대 등급(`.gilt--stage`)은 1–2곳이다. 선버스트(`.ray-head`, `.rays`)는 "막이 오르는" 자리에만 쓴다.
- [ ] 숫자·이름·시각은 팩트 시트 값만 쓴다(기준: 2026년 11월 14일 토요일 18:40).
- [ ] 390px에서 가로 넘침이 0이고 터치 타깃이 44px이다. 라이트(마티네)와 다크(수와레)를 둘 다 확인한다.
