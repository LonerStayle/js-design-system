# SEWOON.SH · 컴포넌트 마크업 계약

index.html·pages/*.html을 만드는 장면 에이전트는 이 문서와 `DIRECTION.md`(세계관·팩트 시트)만 보고 마크업한다.
- 클래스는 BEM(`block__elem--mod`). 상태는 가능하면 **ARIA 속성**(`aria-selected`, `aria-current`, `aria-pressed`, `aria-expanded`, `aria-busy`, `aria-invalid`, `aria-disabled`)으로 쓰고 CSS가 그것을 읽는다.
- 인라인 `style`은 CSS 변수 주입(`--w`, `--board-cols`, `--ls-cols`, `--side-w`)에만. 인라인 grid-template-columns·onclick·`href="#"` 금지.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 semantic 토큰만 쓴다. 원시 램프(`--phos-*`, `--lcd-*`, `--green-*` …)와 hex 금지.
- 보이는 글은 한국어. 명령·경로·핸들·호스트·ID·파일명만 라틴(그건 코드다). 한글이 섞인 라벨에 자간을 주지 않는다(전역 자간 0).
- 이모지 금지. 아이콘은 문자(`▸ ▾ ✓ ✗ ⏎ ← → ✕ ■ □ • ·`) 또는 `currentColor` 인라인 SVG. SVG presentation attribute에 `var()` 금지 → `style="stroke:var(--prompt)"` 또는 `stroke="currentColor"`.
- 화면당 깜빡이는 블록 커서 `.cursor`는 1개.

---

## 0. 공통 머리말

### index.html
```html
<!doctype html>
<html lang="ko" data-power-on>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>세운 터미널 · SEWOON.SH</title>
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('sewoon-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wdth,wght@100,400;100,500;100,700;100,800&family=Nanum+Gothic+Coding:wght@400;700&family=Sixtyfour:BLED,SCAN@0..100,-53..100&display=swap">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="index.css">
<script src="app.js" defer></script>
</head>
```
- `data-power-on`은 **index만**. 세션당 1회 전원 켜짐 모션(`[data-power-target]` 요소가 있으면 그것, 없으면 body).

### pages/<name>.html
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>운영 메일함 · SEWOON.SH</title>
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('sewoon-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wdth,wght@100,400;100,500;100,700;100,800&family=Nanum+Gothic+Coding:wght@400;700&family=Sixtyfour:BLED,SCAN@0..100,-53..100&display=swap">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="inbox.css">
<script src="../app.js" defer></script>
</head>
```
- `<title>` 형식: `<한글 장면 이름> · SEWOON.SH`. localStorage 키 `sewoon-theme`. URL `?theme=dark|light`가 최우선(저장 안 함).
- 기본 테마는 시스템 설정. dark = "새벽 3시 512호 CRT"(녹흑 + 인광 + 스캔라인), light = "오후 2시 계측기 LCD"(녹회색 + 먹색, 글로우·스캔라인 0).

### body 골격 (모든 HTML 동일)
```html
<body>
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<!-- §3-1 상태 바 -->
<main id="main" class="session"> … 명령 블록들 … </main>
<!-- §3-2 logout 푸터 -->
<!-- §3-4 fzf 오버레이 -->
</body>
```

---

## 1. 토큰 요약

| 용도 | 토큰 (semantic.css) |
|---|---|
| 면 | `--bg`(화면) `--pane`(떠 있는 창·오버레이 면) `--pane-2`(표 머리·호버 직전) `--bar-bg`/`--bar-fg`(상태 바) |
| 글자 | `--fg` `--fg-muted` |
| 선 | `--rule`(박스 선 1px) `--rule-strong`(컨트롤·활성·이중선) |
| ANSI 슬롯 | `--prompt`(user@host, 녹) `--path`(경로·디렉터리, 시안) `--hash`(커밋·문제 ID, 호박) `--meta`(핸들·보조 메타, 청) `--sign`(간판 핑크, 브랜드·퍼지 매치에만) |
| 반전 | `--select-bg`/`--select-fg`(선택·호버·활성 탭) `--accent`/`--on-accent`(주 버튼·오늘) `--press-bg`/`--press-fg`(누름) `--on-sign` `--on-status` |
| 상태 | `--ok` `--warn` `--err` `--info` (반전 면 위 글자는 `--on-status`) |
| 상호작용 | `--link` `--focus` `--cursor` `--caret` |
| 장식(다크 전용) | `--glow-green` `--glow-sign` `--glow-err` `--scanline` / 라이트 전용 `--ghost`(LCD 꺼진 세그먼트) |
| 디더 | `--scrim` `--dither-dot` `--skel-dot` `--skel-dot-hot` |
| 크기 | `--fs-mega`(Sixtyfour 워드마크) `--fs-num`(Sixtyfour 수치) `--fs-d1` `--fs-d2` `--fs-h 18` `--fs-body 16→15` `--fs-data 14` `--fs-meta 13` / `--lh-body 1.625` `--lh-data 1.4` |
| 셀 그리드 | `--cell 8px` `--c1 --c2 --c4 --c7 --c14`(가로, 셀 배수) `--r-half --r1 --r2 --r3`(세로, 행 배수 26px) `--gutter`(32→16) `--touch 44` / 열 폭 `--cols-man 72ch` `--cols-log 100ch` `--cols-table 120ch` |
| 모션 | `--redraw 96ms` `--glitch 160ms` `--blink 1060ms` `--stream 1400ms` `--spin 100ms` `--type-char 22ms` `--line-out 14ms` `--power-on 280ms` — 이징 곡선 없음 |

글자 단위: Inconsolata 라틴 = 0.5em = **1셀(1ch)**, 나눔고딕코딩 한글 = **2셀**. 그래서 열 폭은 `ch`로 쓴다(`grid-template-columns: 9ch 6ch 1fr`).

---

## 2. base.css 프리미티브

### 시그니처 1 — 프롬프트 → 출력
모든 블록은 그것을 만든 명령으로 시작한다. 명령 = 라틴, 출력 = 한국어.
```html
<section class="block" aria-labelledby="h-mail">
  <p class="sh-cmd"><span class="sh-ps1" aria-hidden="true">d0kkaebi@sewoon:<span class="sh-path">~/메일</span>$</span> <code>mutt -f ~/메일/운영</code></p>
  <div class="sh-out"> … 출력(컴포넌트). h1 은 출력 안의 자연스러운 자리에 — 예: mutt 도움말 줄 끝 <h1 class="mutt__title" id="h-mail">운영 메일함</h1> … </div>
</section>
```
- **명령 바로 아래는 출력이 머리다.** `.scene-head`(48px 제목 + 부연 2줄) 는 9개 페이지 중 dashboard·onboarding·pricing 3곳만 쓴다. 나머지는 출력 속에 h1 을 둔다(inbox 도움말 줄, kanban 카운트다운, profile finger 첫 줄, settings 대화상자 테두리, product `SW-07`).
| 클래스 | 설명 |
|---|---|
| `.session` | `<main>` 컨테이너. 왼쪽 정렬, 좌우 `--gutter`, 가운데 컨테이너 없음. 자식 사이 2행(명령과 다음 명령) |
| `.block` | 명령 1개 + 출력. 프롬프트→출력 간격 0, `.sh-out + .sh-out` 1행. pane이 바로 오면 제목 줄 자리만큼 자동으로 띄운다 |
| `.sh-cmd` `.sh-ps1` `.sh-path` | 프롬프트 줄. `.sh-ps1`은 `aria-hidden`. 로컬 프롬프트(`~ %`)는 `.sh-cmd--local` |
| `.sh-out` (`--tight`) | 출력 묶음. 자식 사이 1행(tight = 0) |
| `.sh-err` | stderr 줄 `! …`(적색). `.sh-note` = `# …` 주석 줄(보조색) |
| `.cursor` (`--idle` `--hollow`) | 블록 커서 `<span class="cursor" aria-hidden="true"></span>`. 0.94Hz. **꽉 찬 깜빡이는 커서는 화면당 1개**(활성 프롬프트 끝). 푸터 로컬 셸·모션 견본처럼 비활성 프롬프트는 `cursor cursor--idle cursor--hollow`(멈춘 빈 상자) |
| `.scene-head` > `__title` `__sub` | 장면 제목(한글, `--fs-d1`)과 한 줄 설명(72열). **최대 3개 페이지**(dashboard·onboarding·pricing) |
| `.winrule` | tmux 창 전환 줄 `<p class="winrule"><b>1:로그</b> 03:12:07</p>` → `──── 1:로그 03:12:07 ─────────` (장면 구획) |
| `.gap0 .gap-half .gap1 .gap2 .gap3` | 세로 간격 강제(행 배수) |
| `.w-man` `.w-log` `.w-table` `.w-bleed` `.w-content` | 출력 폭: 72열 / 100열 / 120열 / 풀블리드(gutter만) / 내용 폭 |
| `.in1 .in2 .in4 .in7` | 셀 들여쓰기 |

### tmux 분할 `.split`
```html
<div class="split split--62-38">  <!-- --38-62 --50-50 --40-30-30 --20-30-50 , --top 은 위 정렬 -->
  <section class="pane">…</section>
  <section class="pane">…</section>
</div>
```
- gap 0, 이웃 pane은 1px 선을 공유(`margin-left:-1px` 자동). 균등 3·4분할 카드 그리드 금지(칸반 4열만 예외).
- ≥1200: 지정 비율 / 768–1199: 3분할은 2열로 접힘 / <768: 세로 스택(다음 pane의 제목 선이 앞 pane의 아래 선이 된다).
- 한 줄 전체를 차지하는 자식은 `.split__row`. 세로로만 쌓을 땐 `<div class="pane-stack">`.
- 세로로 붙는 두 pane(`.pane-stack`, <768 의 `.split`)에서는 card.css 가 **앞 pane 의 아래 선을 투명하게** 만든다. 다음 pane 의 제목 줄 선이 그 자리를 대신하므로 제목 글자 위로 선이 지나가지 않는다. 장면 CSS 에서 따로 덮지 말 것.

### man 페이지 `.man`
```html
<article class="man">
  <header class="man__head"><span>SEWOON-MEMBERSHIP(7)</span><span>세운 터미널 회원 안내</span><span>SEWOON-MEMBERSHIP(7)</span></header>
  <h2 class="man__sec">이름</h2>
  <div class="man__body"><p>sewoon-membership — 세운 터미널 클럽 회원권 3종과 출입 규칙</p></div>
  <h2 class="man__sec">옵션</h2>
  <dl class="man__tag">
    <dt>--billing=월</dt><dd>매달 결제. 야간 ₩39,000 · 상주 ₩79,000</dd>
    <dt>--billing=연</dt><dd>12개월 선결제, 2개월분 할인</dd>
  </dl>
  <footer class="man__foot"><span>sewoon 2.6</span><span>2026-10-10</span></footer>
</article>
```
14셀(`--c14`)보다 긴 태그는 `<dt class="dt-wide">` — 태그가 한 줄을 다 쓰고 설명은 다음 줄 14셀 위치에서 시작한다(자르지 않음, man 과 같음).
본문 72열, 섹션 헤더 0열, 본문 7셀 들여쓰기, 옵션 설명 14셀(모바일 3셀/6셀). 밑줄 강조는 `<u>` 또는 `.u`.

### tail -f 로그 `.log`
```html
<ol class="log" id="nr31-log" data-stream data-stream-max="12" data-stream-start="03:12:07" aria-live="off">
  <li class="log__line log__line--warn"><time>03:11:41</time><span class="log__lv">경고</span><span class="log__msg">bench06 디스크 91% — /var/lib/sdr</span></li>
  <li class="log__line log__line--ok"><time>03:11:58</time><span class="log__lv">통과</span><span class="log__msg"><span class="id">NR31-web-02</span> 검수 통과 — <span class="who">hajin</span></span></li>
</ol>
<template data-stream-src="nr31-log">
  <li class="log__line"><time></time><span class="log__lv">정보</span><span class="log__msg">리허설 제출 team-17 → <span class="id">NR31-pwn-03</span> 오답</span></li>
  <li class="log__line log__line--err"><time></time><span class="log__lv">오류</span><span class="log__msg">NR31-hw-01 make: *** [fw.bin] 오류 2</span></li>
</template>
<p class="log__state"><span data-stream-stamp="nr31-log">갱신 03:12:07</span><span data-stream-note="nr31-log" hidden></span></p>
```
- 열: 시각 9셀 + 레벨 6셀(한글 2자) + 메시지. 레벨 `--ok`(통과) `--warn`(경고) `--err`(오류) `--wall`(방송), 기본은 정보(시안).
- `data-stream`: 1400ms마다 `<template>`의 줄을 차례로 붙이고 `<time>`을 03:12:07부터 1–3초씩 진행. `data-stream-max`줄 유지. 화면 밖·탭 숨김이면 멈춤.
- 일시정지 버튼 `data-stream-toggle="<id>"`(+`data-hotkey="p"`), 라벨은 `<span data-label>`/`.btn__label`이 "일시정지↔재개"로 바뀐다. 동작 줄이기면 **정지 상태로 시작** + `data-stream-note`에 "동작 줄이기 설정으로 정지됨".

### 글자·색 유틸
| 클래스 | 설명 |
|---|---|
| `.t-mega` `.t-num` `.crt` | Sixtyfour(32px 이상, **라틴·숫자만**). 다크 SCAN 20·BLED 10 / 라이트 SCAN 10·BLED 0(도트 줄 사이 틈이 보이는 LCD 도트 매트릭스) |
| `.t-d1 .t-d2 .t-h .t-body .t-data .t-meta .t-bold` | 크기 단계 |
| `.c-fg .c-muted .c-prompt .c-path .c-hash .c-meta .c-sign .c-ok .c-warn .c-err .c-info` | ANSI 색 글자 |
| `.rev` `.rev--accent` `.rev--sign` `.rev--warn` `.rev--err` | 반전(면을 칠하는 유일한 방식) |
| `.glow` `.glow-sign` | 인광 블룸 — 20px 이상 녹·핑크 글자에만, 다크에서만 보임 |
| `.ghosted` + `data-ghost="8-88"` | 라이트에서 Sixtyfour 숫자 뒤 꺼진 세그먼트 잔상. **dashboard `D-14` 전용**(3.5%). 404·점수 등 즉시 읽혀야 하는 숫자에는 쓰지 않는다 |
| `.g1` `.g2` | 폴백 글꼴로 그려지는 기호(▸ ✓ ⏎ ⠋)를 1·2셀 폭에 고정 |
| `<kbd>` / `.kbd` | `[p]` 키 힌트(대괄호 자동). `.kbd--bare`는 괄호 없음 |
| `.scroll-x` | pane 안 가로 스크롤 + 오른쪽 4셀 페이드(app.js가 `is-overflow`/`is-end` 토글). `position: relative` 라 안쪽 `.sr-only` 가 밖으로 새지 않는다 |
| `.num` `.tnum` `.right` `.nowrap` `.sr-only` `.skip-link` `.hide-sm` `.show-sm`(≤767) | 유틸 |

---

## 3. 공통 셸 스니펫 (복사해서 그대로 쓴다)

창 번호 체계(고정): `0:세션`(index) `1:대시보드` `2:메일` `3:출제보드` `4:가입` `5:회원권` `6:SW-07` `7:프로필` `8:설정`. 404는 창 목록에 없다(활성 창 없음).
현재 창 하나에만 `aria-current="page"` → 반전 + `*`.

### 3-1. 상태 바 (navbar) — index 경로
```html
<header class="statusbar">
  <a class="statusbar__session" href="index.html" aria-label="세운 터미널 처음으로">sewoon</a>
  <nav class="statusbar__wins" aria-label="창 목록">
    <ul class="statusbar__list">
      <li><a class="statusbar__win" href="index.html" aria-current="page"><span class="statusbar__idx">0:</span>세션</a></li>
      <li><a class="statusbar__win" href="pages/dashboard.html"><span class="statusbar__idx">1:</span>대시보드</a></li>
      <li><a class="statusbar__win" href="pages/inbox.html"><span class="statusbar__idx">2:</span>메일</a></li>
      <li><a class="statusbar__win" href="pages/kanban.html"><span class="statusbar__idx">3:</span>출제보드</a></li>
      <li><a class="statusbar__win" href="pages/onboarding.html"><span class="statusbar__idx">4:</span>가입</a></li>
      <li><a class="statusbar__win" href="pages/pricing.html"><span class="statusbar__idx">5:</span>회원권</a></li>
      <li><a class="statusbar__win" href="pages/product.html"><span class="statusbar__idx">6:</span>SW-07</a></li>
      <li><a class="statusbar__win" href="pages/profile.html"><span class="statusbar__idx">7:</span>프로필</a></li>
      <li><a class="statusbar__win" href="pages/settings.html"><span class="statusbar__idx">8:</span>설정</a></li>
    </ul>
  </nav>
  <div class="statusbar__ticker ticker" id="statusbar-tail" aria-label="nr31.log 마지막 줄">
    <span class="ticker__lead" aria-hidden="true">tail</span>
    <div class="ticker__window"><div class="ticker__track">
      <span class="ticker__item"><time>03:11:58</time><span class="lv-ok">통과</span> NR31-web-02 검수 — hajin</span>
      <span class="ticker__item"><time>03:12:03</time><span class="lv-warn">대기</span> bench06 SDR 예약 03:30</span>
      <span class="ticker__item"><time>03:12:07</time>ej0 님이 B-04 납땜 벤치 점유</span>
    </div></div>
  </div>
  <div class="statusbar__right">
    <span class="statusbar__clock"><span class="statusbar__host">bench03</span>03:12<span class="statusbar__date">&nbsp;10-10(토)</span></span>
    <button class="statusbar__btn" type="button" data-command-open aria-label="명령 팔레트 열기 (⌘K 또는 /)"><kbd>⌘K</kbd></button>
    <button class="statusbar__btn" type="button" data-theme-toggle aria-label="테마 전환">[<span data-theme-label>밤</span>]</button>
  </div>
</header>
```

### 3-1. 상태 바 — pages 경로 (예: inbox.html)
위와 같고 링크만 `../`·같은 폴더 기준으로 바꾸며, `aria-current="page"`를 현재 창으로 옮긴다.
```html
<header class="statusbar">
  <a class="statusbar__session" href="../index.html" aria-label="세운 터미널 처음으로">sewoon</a>
  <nav class="statusbar__wins" aria-label="창 목록">
    <ul class="statusbar__list">
      <li><a class="statusbar__win" href="../index.html"><span class="statusbar__idx">0:</span>세션</a></li>
      <li><a class="statusbar__win" href="dashboard.html"><span class="statusbar__idx">1:</span>대시보드</a></li>
      <li><a class="statusbar__win" href="inbox.html" aria-current="page"><span class="statusbar__idx">2:</span>메일</a></li>
      <li><a class="statusbar__win" href="kanban.html"><span class="statusbar__idx">3:</span>출제보드</a></li>
      <li><a class="statusbar__win" href="onboarding.html"><span class="statusbar__idx">4:</span>가입</a></li>
      <li><a class="statusbar__win" href="pricing.html"><span class="statusbar__idx">5:</span>회원권</a></li>
      <li><a class="statusbar__win" href="product.html"><span class="statusbar__idx">6:</span>SW-07</a></li>
      <li><a class="statusbar__win" href="profile.html"><span class="statusbar__idx">7:</span>프로필</a></li>
      <li><a class="statusbar__win" href="settings.html"><span class="statusbar__idx">8:</span>설정</a></li>
    </ul>
  </nav>
  <div class="statusbar__ticker ticker" id="statusbar-tail" aria-label="nr31.log 마지막 줄">
    <span class="ticker__lead" aria-hidden="true">tail</span>
    <div class="ticker__window"><div class="ticker__track">
      <span class="ticker__item"><time>03:11:58</time><span class="lv-ok">통과</span> NR31-web-02 검수 — hajin</span>
      <span class="ticker__item"><time>03:12:03</time><span class="lv-warn">대기</span> bench06 SDR 예약 03:30</span>
      <span class="ticker__item"><time>03:12:07</time>ej0 님이 B-04 납땜 벤치 점유</span>
    </div></div>
  </div>
  <div class="statusbar__right">
    <span class="statusbar__clock"><span class="statusbar__host">bench03</span>03:12<span class="statusbar__date">&nbsp;10-10(토)</span></span>
    <button class="statusbar__btn" type="button" data-command-open aria-label="명령 팔레트 열기 (⌘K 또는 /)"><kbd>⌘K</kbd></button>
    <button class="statusbar__btn" type="button" data-theme-toggle aria-label="테마 전환">[<span data-theme-label>밤</span>]</button>
  </div>
</header>
```
- 404.html: 어떤 창에도 `aria-current` 없음.
- 반응형: 티커는 ≥1200에서만, 호스트·날짜는 ≥768, 시계는 >420. 창 목록은 가로 스크롤 + 양끝 페이드(현재 창이 보이게 자동 스크롤). 모든 칸 44px.
- 티커: 1셀씩 흐름(steps), 호버하면 멈춤, 동작 줄이기면 첫 줄 고정. 멈춤 버튼이 필요하면 `.statusbar` 안에 `<button class="statusbar__btn" data-ticker-toggle aria-pressed="false" aria-label="로그 흐름 멈춤"><kbd>p</kbd></button>`.

### 3-2. logout 푸터 — index 경로
```html
<footer class="logout">
  <p class="sh-cmd"><span class="sh-ps1" aria-hidden="true">d0kkaebi@sewoon:~$</span> <code>exit</code></p>
  <p class="logout__lines">logout<br>Connection to sewoon.sh closed.</p>
  <p class="sh-cmd sh-cmd--local"><span class="sh-ps1" aria-hidden="true">~ %</span> <code>cat ~/.ssh/sewoon.txt</code></p>
  <address class="logout__info">
    <p><span>서울 중구 청계천로 159,</span> <span>세운상가 가동 5층 512호</span> <span>· 을지로3가역 / 을지로4가역</span></p>
    <p><span>영업 화–금 19:00–04:00(익일)</span> <span>· 토 14:00–05:00(익일)</span> <span>· 일 14:00–24:00</span> <span>· 월 휴무</span></p>
    <p><span>서버 <code>ssh d0kkaebi@sewoon.sh -p 2222</code></span> <span>· 24시간</span> <span>· 월 06:00–09:00 점검</span></p>
    <p><span>메일 <a href="mailto:ops@sewoon.sh">ops@sewoon.sh</a> 운영</span> <span>· <a href="mailto:nr@sewoon.sh">nr@sewoon.sh</a> 야간수리반</span></p>
  </address>
  <nav class="logout__nav" aria-label="참고">
    <a href="pages/dashboard.html">dashboard(1)</a><a href="pages/inbox.html">inbox(1)</a><a href="pages/kanban.html">kanban(1)</a><a href="pages/onboarding.html">onboarding(1)</a><a href="pages/pricing.html">pricing(7)</a><a href="pages/product.html">product(7)</a><a href="pages/profile.html">profile(1)</a><a href="pages/settings.html">settings(5)</a><a href="pages/404.html">404(3)</a>
  </nav>
  <p class="sh-cmd sh-cmd--local"><span class="sh-ps1" aria-hidden="true">~ %</span> <span class="cursor cursor--idle cursor--hollow" aria-hidden="true"></span></p>
</footer>
```
- 푸터 로컬 셸 커서는 모든 페이지에서 `cursor cursor--idle cursor--hollow`(깜빡이지 않는 빈 상자). 링크 줄 끝에 `404(3)` 포함 — man 참고 절과 같은 목록.

### 3-2. logout 푸터 — pages 경로
```html
<footer class="logout">
  <p class="sh-cmd"><span class="sh-ps1" aria-hidden="true">d0kkaebi@sewoon:~$</span> <code>exit</code></p>
  <p class="logout__lines">logout<br>Connection to sewoon.sh closed.</p>
  <p class="sh-cmd sh-cmd--local"><span class="sh-ps1" aria-hidden="true">~ %</span> <code>cat ~/.ssh/sewoon.txt</code></p>
  <address class="logout__info">
    <p><span>서울 중구 청계천로 159,</span> <span>세운상가 가동 5층 512호</span> <span>· 을지로3가역 / 을지로4가역</span></p>
    <p><span>영업 화–금 19:00–04:00(익일)</span> <span>· 토 14:00–05:00(익일)</span> <span>· 일 14:00–24:00</span> <span>· 월 휴무</span></p>
    <p><span>서버 <code>ssh d0kkaebi@sewoon.sh -p 2222</code></span> <span>· 24시간</span> <span>· 월 06:00–09:00 점검</span></p>
    <p><span>메일 <a href="mailto:ops@sewoon.sh">ops@sewoon.sh</a> 운영</span> <span>· <a href="mailto:nr@sewoon.sh">nr@sewoon.sh</a> 야간수리반</span></p>
  </address>
  <nav class="logout__nav" aria-label="참고">
    <a href="../index.html">sewoon(7)</a><a href="dashboard.html">dashboard(1)</a><a href="inbox.html">inbox(1)</a><a href="kanban.html">kanban(1)</a><a href="onboarding.html">onboarding(1)</a><a href="pricing.html">pricing(7)</a><a href="product.html">product(7)</a><a href="profile.html">profile(1)</a><a href="settings.html">settings(5)</a><a href="404.html">404(3)</a>
  </nav>
  <p class="sh-cmd sh-cmd--local"><span class="sh-ps1" aria-hidden="true">~ %</span> <span class="cursor cursor--idle cursor--hollow" aria-hidden="true"></span></p>
</footer>
```
- 푸터 커서는 언제나 빈 상자다. 페이지의 활성 프롬프트(예: 404 의 `~/pages$`)만 꽉 찬 깜빡이는 커서를 가진다.

### 3-3. ranger 사이드바 (필요한 페이지만: inbox·settings·profile 등) — pages 경로
좌측 고정 목차 사이드바가 아니다. `ranger`의 왼쪽 열로, 장면 안 `.split--20-30-50` 또는 `.split--38-62`의 첫 pane이다.
```html
<nav class="pane pane--flush side" id="side" aria-label="디렉터리">
  <div class="pane__head"><h2 class="pane__title">~/</h2><span class="pane__meta"><button class="pane__key" type="button" data-side-toggle aria-controls="side" aria-expanded="true" aria-label="열 접기"><span data-label>«</span></button></span></div>
  <ul class="side__list">
    <li><p class="side__group">창</p></li>
    <li><a class="side__link side__link--dir" href="dashboard.html" data-short="1"><span class="side__name">대시보드</span><span class="side__count">bench 5/8</span></a></li>
    <li><a class="side__link side__link--dir" href="inbox.html" data-short="2" aria-current="page"><span class="side__name">메일</span><span class="side__count">4</span></a></li>
    <li><a class="side__link side__link--dir" href="kanban.html" data-short="3"><span class="side__name">출제보드</span><span class="side__count">18</span></a></li>
    <li><a class="side__link side__link--dir" href="settings.html" data-short="8"><span class="side__name">설정</span></a></li>
    <li><p class="side__group">파일</p></li>
    <li><a class="side__link" href="profile.html" data-short="."><span class="side__name">.plan</span></a></li>
  </ul>
  <p class="side__foot">41/48 사물함 · L-512-07</p>
</nav>
```
- index 경로는 `href="pages/…"`, 현재 항목은 장면에 맞게. 접힘 = 2셀 폭, 각 항목은 `data-short` 한 글자만.
- 모바일(<768)에서는 위 pane을 `.hide-sm`으로 숨기고, 대신 이 트리거 + 오버레이를 둔다:
```html
<button class="btn btn--sm show-sm" type="button" data-open="side-drawer"><span class="btn__label">~/ 디렉터리</span></button>
<div class="overlay overlay--right" id="side-drawer" role="dialog" aria-modal="true" aria-labelledby="side-drawer-t" hidden>
  <div class="overlay__scrim" data-close></div>
  <aside class="pane drawer"><div class="pane__head"><h2 class="pane__title" id="side-drawer-t">~/</h2><span class="pane__meta"><button class="pane__key" type="button" data-close><kbd>q</kbd> 닫기</button></span></div>
    <div class="drawer__body"><ul class="side__list"> …위와 같은 li… </ul></div></aside>
</div>
```

### 3-4. fzf 명령 팔레트 (모든 HTML 끝, 1개) — index 경로
```html
<div class="overlay overlay--top" id="cmd" data-command role="dialog" aria-modal="true" aria-label="명령 팔레트" hidden>
  <div class="overlay__scrim" data-close></div>
  <div class="pane fzf" id="cmd-fzf">
    <div class="pane__head"><h2 class="pane__title">fzf — 어디로 갈까요</h2><span class="pane__meta">Esc 닫기</span></div>
    <div class="fzf__list" id="cmd-list">
      <p class="fzf__group">창</p>
      <a class="fzf__item" href="index.html" data-keywords="세션 man sewoon 처음"><span class="fzf__label">sewoon — 세션 처음 화면</span><span class="fzf__path">0:</span></a>
      <a class="fzf__item" href="pages/dashboard.html" data-keywords="btop 대시보드 운영"><span class="fzf__label">dashboard — 야간수리반 운영 콘솔</span><span class="fzf__path">1:</span></a>
      <a class="fzf__item" href="pages/inbox.html" data-keywords="mutt 메일"><span class="fzf__label">inbox — 운영 메일함</span><span class="fzf__path">2:</span></a>
      <a class="fzf__item" href="pages/kanban.html" data-keywords="board 출제 보드"><span class="fzf__label">kanban — NR31 출제 보드</span><span class="fzf__path">3:</span></a>
      <a class="fzf__item" href="pages/onboarding.html" data-keywords="join 가입"><span class="fzf__label">onboarding — 신규 회원 가입</span><span class="fzf__path">4:</span></a>
      <a class="fzf__item" href="pages/pricing.html" data-keywords="membership 회원권 가격"><span class="fzf__label">pricing — 회원권 비교</span><span class="fzf__path">5:</span></a>
      <a class="fzf__item" href="pages/product.html" data-keywords="apt sw07 디버거"><span class="fzf__label">product — 세운 디버거 SW-07</span><span class="fzf__path">6:</span></a>
      <a class="fzf__item" href="pages/profile.html" data-keywords="finger 프로필 d0kkaebi"><span class="fzf__label">profile — finger d0kkaebi</span><span class="fzf__path">7:</span></a>
      <a class="fzf__item" href="pages/settings.html" data-keywords="menuconfig 설정"><span class="fzf__label">settings — ~/.sewoonrc 설정</span><span class="fzf__path">8:</span></a>
      <a class="fzf__item" href="pages/404.html" data-keywords="없는 경로 오류"><span class="fzf__label">404 — 없는 경로</span><span class="fzf__path">cd</span></a>
      <p class="fzf__group">명령</p>
      <button class="fzf__item" type="button" data-run="theme" data-keywords="테마 다크 라이트 낮 밤"><span class="fzf__label">theme — 낮/밤 화면 전환</span><span class="fzf__path">명령</span></button>
    </div>
    <p class="fzf__empty" hidden>일치하는 항목이 없습니다</p>
    <p class="fzf__info"><span class="fzf__count">11/11</span></p>
    <div class="fzf__field"><span class="fzf__ps" aria-hidden="true">&gt;</span><input class="fzf__input" type="text" aria-label="페이지나 명령 검색" placeholder="페이지나 명령 이름" autocomplete="off" spellcheck="false"></div>
  </div>
</div>
```
- pages 경로: `index.html` → `../index.html`, `pages/x.html` → `x.html`. 그 외 동일.
- 열기: ⌘K / Ctrl+K / `/`(입력 중이 아닐 때) / `[data-command-open]`. ↑↓(또는 Ctrl+N/P) 이동, Enter 실행, Esc 닫기.
- `data-run`: `theme`(낮/밤), `open:<overlay id>`, `toast:<문구>`.

---

## 4. 시그니처 2 — pane (card) 와 32개 컴포넌트

### card = pane — 제목·메타·키 힌트가 테두리 위에 박힌다
```html
<section class="pane" aria-labelledby="pn-log">
  <div class="pane__head">
    <h2 class="pane__title" id="pn-log">tail -f /var/log/sewoon/nr31.log</h2>
    <span class="pane__meta"><span data-stream-stamp="nr31-log">갱신 03:12:07</span></span>
  </div>
  … 내용 …
  <div class="pane__keys">
    <button class="pane__key" type="button" data-stream-toggle="nr31-log" data-hotkey="p"><kbd>p</kbd> <span data-label>일시정지</span></button>
    <button class="pane__key" type="button" data-command-open><kbd>/</kbd> 검색</button>
  </div>
</section>
```
- `.pane__title` = 그 출력을 만든 명령(라틴) 또는 짧은 한글 이름. `.pane__meta` = 시각·개수·상태(오른쪽). `.pane__keys` = 아래 테두리 키 힌트(`.pane__key`는 보이는 높이 20px, 누르는 영역 44px).
- 상태: 포커스가 안에 있거나 `.is-active`/`.pane--active` = **이중선 + 제목 반전**(MC 활성 패널). `aria-selected="true"`/`.is-selected` = 밝은 선 + 제목 반전. `aria-disabled="true"` = 점선 + 보조색. `aria-busy="true"` = 제목 앞 점자 스피너. `.pane--err`/`data-state="error"` = 적색 선. `.pane--warn`.
- 변형: `.pane--fill`(--pane 면, 떠 있는 것), `.pane--flush`(좌우 여백 0 — 표·목록·사이드바), `.pane--static`(포커스 이중선 끄기).
- 링크 카드: `<a class="pane" href="product.html">…</a>` — 호버 시 선이 밝아지고 제목 반전.
- `.pane`은 `display: flow-root`다. 제목 줄(위로 반 줄 나온 `.pane__head`)의 음수 margin 이 부모와 접히지 않아, 블록 흐름·grid·flex 어디에 두어도 좌우 테두리가 제목 선에서 정확히 시작한다. 장면 CSS 에서 `.pane`의 display 를 `block`으로 되돌리지 말 것(flex/grid 로 바꾸는 것은 괜찮다).
- 떠 있는 pane(토스트 `wall`, 떠 있는 `popup`)은 테두리 줄 전체를 면으로 칠해 뒤 글자와 섞이지 않는다(자동).
- ●●● 창 크롬, 둥근 모서리, 그림자, 카드 사이 여백 그리드 금지.

### accordion = tree
```html
<div class="tree" data-single>
  <div class="tree__item">
    <h3 class="tree__head"><button class="tree__toggle" type="button" aria-expanded="true" aria-controls="tr-sw07"><span class="tree__name">sw07</span><span class="tree__meta">4개 · 10-09</span></button></h3>
    <div class="tree__panel" id="tr-sw07">
      <ul class="tree__leaves"><li><span>sw07-front.svg</span><span>12K</span></li><li><span>pinout.txt</span><span>2K</span></li></ul>
    </div>
  </div>
  <div class="tree__item"><h3 class="tree__head"><button class="tree__toggle" type="button" disabled><span class="tree__name">archive</span><span class="tree__meta">권한 없음</span></button></h3></div>
</div>
```
`▸`↔`▾`, 펼친 내용 4셀 들여쓰기 + 안내선(잎은 `├─ └─`, 마지막 잎에서 세로선이 끊긴다). 패널에 문단(`<p>`)도 가능. 파일 이름은 `.tree__name--file`(슬래시 없음). `data-single` = 하나만 열림. 키: ↑↓ Home End로 머리 이동, Enter/Space 토글. 호버 = 반전, 비활성 = `disabled`(`·` 표시).

### alert = syslog 블록
```html
<div class="alert alert--warn" role="status">       <!-- --info --ok --warn --err (err 는 role="alert") -->
  <span class="alert__tag">경고</span>
  <p class="alert__msg"><b class="alert__title">bench06 디스크 91%</b>/var/lib/sdr 녹음 파일을 월요일 점검 전에 정리하세요. <a href="dashboard.html">대시보드</a></p>
  <span class="alert__side"><time class="alert__time">03:11:41</time><button class="alert__close" type="button" data-dismiss aria-label="알림 닫기">✕</button></span>
</div>
```
상자 없음, 위아래 1px 전폭 선(레벨 색), 왼쪽 레벨 태그 반전 `[경고]`. 태그 글: 정보 / 완료 / 경고 / 오류. 연속 alert는 선을 공유.

### badge = [ 해결 ]
```html
<span class="badge badge--ok">해결</span>  <span class="badge badge--rev badge--sign">새 글</span>  <span class="badge badge--count">12</span>  <span class="badge badge--live badge--ok">접속 5</span>
```
색 `--ok --warn --err --info --sign --muted --hash`, 반전 면 `--rev`(색과 함께, 단독이면 백록 반전), `--count` = `(12)`, `--bare` = 괄호 없음, `--live` = `● ` 접두. 알약 모양 없음.

### breadcrumb = pwd
```html
<nav class="pwd" aria-label="경로"><ol class="pwd__list">
  <li class="pwd__item"><a class="pwd__link" href="../index.html">~</a></li>
  <li class="pwd__item"><a class="pwd__link" href="kanban.html">ctf</a></li>
  <li class="pwd__item"><a class="pwd__link" href="kanban.html">nr31</a></li>
  <li class="pwd__item"><span class="pwd__cur" aria-current="page">pwn-03</span></li>
</ol></nav>
```
구분자 `/`는 CSS. `.pwd--sm`(14px). 앞에 `<span class="pwd__lead">pwd</span>`를 둘 수 있다.

### button = [ 실행 ⏎ ]
```html
<button class="btn btn--primary" type="button"><span class="btn__label">제출</span><kbd class="btn__key">⏎</kbd></button>
```
| 변형 | 모양 |
|---|---|
| `.btn--primary` | 반전 녹 면 `[ 제출 ⏎ ]` |
| `.btn`(기본) | 1px 박스 `[ 미리보기 p ]` |
| `.btn--ghost` | 밑줄 글자(괄호 없음) |
| `.btn--danger` | 반전 적 면 |
| `.btn--sign` | 반전 핑크 면(브랜드 1곳에만: 장바구니 담기 등) |
| `.btn--dlg` (+`.is-default` / `.btn--danger`) | ncurses `< 예 >` — 대화상자 안에서만. `.dlg--danger` 의 확인 버튼은 `.btn--danger`(반전 적 면), 초기 포커스는 `< 취소 >` |
| `.btn--icon` | 44px 정사각 문자 1개, `aria-label` 필수 |
| `.btn--sm` `.btn--lg` `.btn--block` | 32(터치 44) / 52 / 전폭 |

상태: 호버 = 반전 0ms, 누름 = `--press`, `:focus-visible` 녹 2px 링, `disabled`/`aria-disabled="true"` = 점선 + 보조색, `aria-busy="true"` = 라벨 앞 점자 스피너(라벨 유지), `aria-pressed="true"` = 반전(토글), `data-state="error"` = 적색 + `!` 접두. 묶음 `.btn-row`(`--dlg` 가운데).
동작: `data-busy="1200"` 클릭 시 해당 ms 로딩 → `data-busy-toast="문구"` 성공 방송 / `data-busy-fail="원인"` 오류 상태 + 글리치 + stderr 방송.

### calendar = cal 10 2026
```html
<div class="cal">
  <div class="cal__head"><button class="cal__nav" type="button" aria-label="이전 달" disabled>‹</button><p class="cal__title">10월 2026</p><button class="cal__nav" type="button" aria-label="다음 달" disabled>›</button></div>
  <div class="cal__grid" role="group" aria-label="2026년 10월">
    <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span><span class="cal__dow">화</span><span class="cal__dow">수</span><span class="cal__dow">목</span><span class="cal__dow">금</span><span class="cal__dow">토</span>
    <span class="cal__day cal__day--out cal__day--sun">27</span><span class="cal__day cal__day--out">28</span><span class="cal__day cal__day--out">29</span><span class="cal__day cal__day--out">30</span>
    <button class="cal__day" type="button" data-date="2026-10-01">1</button><button class="cal__day" type="button" data-date="2026-10-02">2</button>
    <button class="cal__day cal__day--holiday" type="button" data-date="2026-10-03" aria-label="10월 3일 개천절" data-note="10-03(토) 개천절 — 정상 영업">3</button>
    <button class="cal__day cal__day--sun" type="button" data-date="2026-10-04">4</button>
    <button class="cal__day" type="button" disabled aria-label="10월 5일 월요일 정기 휴무">5</button>
    …
    <button class="cal__day" type="button" aria-current="date" aria-label="10월 10일 오늘">10</button>
    …
    <button class="cal__day cal__day--event" type="button" data-date="2026-10-17" data-note="10-17(토) 23:59 출제 마감">17</button>
  </div>
  <p class="cal__foot"><span class="cal__key cal__key--today">오늘</span><span class="cal__key cal__key--event">일정</span><span class="cal__out" aria-live="polite"></span></p>
</div>
```
2026-10-01 = 목요일(일요일 시작이라 앞에 지난달 27–30). 오늘 10 = 녹 반전(`aria-current="date"`), 일정 17·21·24 = `--event`(아래 호박 `•`), 월요일 휴무 5·12·19·26 = `disabled`(취소선), 일요일·공휴일(3 개천절, 9 한글날) = 적색. 선택 = `aria-pressed="true"`(1px 상자) — 클릭/Enter로 단일 선택, ←→↑↓ Home End 이동, `.cal__out`에 `data-note` 출력. 칸 44px.

### carousel = feh
```html
<div class="feh">
  <div class="feh__bar" aria-live="polite"><span class="feh__count">[1/4]</span><span class="feh__name">sw07-front.svg</span><span class="feh__dim">640×400</span></div>
  <div class="feh__viewport" tabindex="0" aria-roledescription="슬라이드" aria-label="SW-07 기판 도면">
    <figure class="feh__slide" data-name="sw07-front.svg" data-dim="640×400">
      <div class="feh__art"><svg viewBox="0 0 320 200" fill="none" stroke="currentColor" stroke-width="1.5" role="img" aria-label="SW-07 정면 라인아트">…<rect x="140" y="110" width="60" height="40" style="stroke:var(--prompt)"/></svg></div>
      <figcaption class="feh__cap">정면 — USB-C, UART 6핀</figcaption>
    </figure>
    <figure class="feh__slide" data-name="sw07-back.svg" data-dim="640×400" hidden>…</figure>
  </div>
  <div class="feh__ctrl"><button class="btn btn--icon" type="button" data-feh-prev aria-label="이전 사진">←</button><div class="feh__dots"></div><button class="btn btn--icon" type="button" data-feh-next aria-label="다음 사진">→</button></div>
</div>
```
전환은 즉시(슬라이드 이동 없음) + 위→아래 다시 그리기. `.feh__dots`를 비워 두면 `□ ■ □ □` 버튼(44px) 자동 생성. ←→ Home End. 그림은 currentColor 라인아트(이미지 파일 금지).

### code = cat -n
```html
<section class="pane code" aria-labelledby="pn-rc">
  <div class="pane__head"><h2 class="pane__title" id="pn-rc">cat -n ~/.sewoonrc</h2>
    <span class="pane__meta"><button class="pane__key code__copy" type="button" data-copy data-hotkey="y"><kbd>y</kbd> <span data-copy-label>복사</span></button></span></div>
  <pre class="code__pre" tabindex="0"><code><span class="code__l"><span class="tk-com"># ~/.sewoonrc — d0kkaebi</span></span><span class="code__l"><span class="tk-sec">[session]</span></span><span class="code__l is-hl"><span class="tk-key">port</span> <span class="tk-op">=</span> <span class="tk-num">2222</span></span></code></pre>
</section>
```
줄마다 `.code__l`(줄번호 자동, `is-hl` 반전 번호, `is-err` 적색 번호). 구문 색 `tk-key`(시안) `tk-str`(녹) `tk-num`(호박) `tk-com`(보조) `tk-kw`(핑크) `tk-sec`(녹 굵게) `tk-op` `tk-err`. 줄번호 없는 출력은 `.code--plain`. 복사: `data-copy`(가장 가까운 pre), `data-copy="id"`, `data-copy-text="…"` → 1.5초 "복사됨".

### command = fzf
§3-4 오버레이. 정적 견본은 `.overlay` 없이 `.pane.fzf`만 두고 입력에 값을 넣어 둔다(`value="da"` → 매치 글자 핑크, 선택 행 반전, `>` 표시). 각 행 `.fzf__item`(a 또는 button), 묶음 제목 `.fzf__group`, 카운터 `.fzf__count`(`12/48`, 호박), 빈 결과 `.fzf__empty`(`합계 0 …`).

### drawer = tmux split-window -h
```html
<button class="btn" type="button" data-open="dr-pwn03"><span class="btn__label">문제 열기</span><kbd class="btn__key">⏎</kbd></button>
<div class="overlay overlay--right" id="dr-pwn03" role="dialog" aria-modal="true" aria-labelledby="dr-pwn03-t" hidden>
  <div class="overlay__scrim" data-close></div>
  <aside class="pane drawer">
    <div class="pane__head"><h2 class="pane__title" id="dr-pwn03-t">split-window -h · NR31-pwn-03</h2><span class="pane__meta"><button class="pane__key" type="button" data-close aria-label="닫기"><kbd>q</kbd> 닫기</button></span></div>
    <div class="drawer__body"> … </div>
    <div class="pane__keys"><button class="pane__key" type="button" data-close><kbd>q</kbd> 닫기</button><button class="pane__key" type="button" data-toast="NR31-pwn-03 → 검수">검수로 ⏎</button></div>
  </aside>
</div>
```
오른쪽 38%(320–620px)·전체 높이·이중선·제목 반전. <768은 아래에서 70% 높이. 열 때 다시 그리기 96ms. Esc·스크림 클릭·`data-close`로 닫힘, 포커스 트랩, 닫으면 트리거로 포커스 복귀. 정적 견본은 `.overlay` 없이 `<aside class="pane drawer">`만.

### empty = ls → 합계 0
```html
<div class="empty">
  <p class="sh-cmd"><span class="sh-ps1" aria-hidden="true">d0kkaebi@sewoon:~$</span> <code>ls ~/알림</code></p>
  <p class="empty__total">합계 0</p>
  <p class="empty__hint">새 방송이 없습니다. 운영 공지는 03:00, 15:00에 올라옵니다.</p>
  <a class="btn btn--sm empty__next" href="inbox.html"><span class="btn__label">sewoon wall --history</span></a>
</div>
```
다음 명령 버튼 라벨 앞에 `$ `가 자동으로 붙는다. 오류형 `.empty--err`(합계 줄 적색).

### form = dialog / whiptail
```html
<form class="form" data-toast="장미래(mirae) 가입 신청을 받았습니다." data-toast-from="sewoon@bench03" novalidate>
  <div class="field">
    <label class="field__label" for="f-handle">핸들 <span class="req" aria-hidden="true">*</span></label>
    <input class="input" id="f-handle" name="handle" value="mirae" required data-validate="handle" aria-describedby="f-handle-h f-handle-e">
    <p class="field__hint" id="f-handle-h">영문 소문자로 시작, 3–16자</p>
    <p class="field__err" id="f-handle-e"></p>
  </div>
  <div class="field">
    <label class="field__label" for="f-key">SSH 공개키</label>
    <textarea class="input" id="f-key" required data-validate="ssh" aria-describedby="f-key-e"></textarea>
    <p class="field__err" id="f-key-e"></p>
  </div>
  <div class="field"><label class="field__label" for="f-plan">회원권</label>
    <div class="select"><select class="select__el" id="f-plan"><option>야간 회원 ₩39,000</option><option>상주 회원 ₩79,000</option></select></div></div>
  <div class="field"><label class="field__label" for="f-port">SSH 포트</label><input class="input input--mono" id="f-port" value="2222" inputmode="numeric" data-validate="port"><p class="field__err"></p></div>
  <fieldset class="choices"><legend>규약</legend>
    <label class="check"><input class="check__input" type="checkbox" required><span class="check__box" aria-hidden="true"></span><span class="check__text">야간 출입 규약에 동의</span></label>
  </fieldset>
  <fieldset class="choices choices--row"><legend>결제 주기</legend>
    <label class="radio"><input class="radio__input" type="radio" name="cycle" checked><span class="radio__box" aria-hidden="true"></span><span class="radio__text">월간</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="cycle"><span class="radio__box" aria-hidden="true"></span><span class="radio__text">연간</span></label>
  </fieldset>
  <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked><span class="switch__box" aria-hidden="true"></span><span class="switch__text">방송 알림 받기</span></label>
  <div class="dlg__actions"><button class="btn btn--dlg is-default" type="submit">다음</button><button class="btn btn--dlg" type="button">취소</button></div>
</form>
```
- 입력: 1px 박스 → 포커스 = 3px 이중선(녹) + 녹 블록 caret. 비활성 = 점선. `readonly` = 점선 + 본문색.
- 체크 `[ ]`/`[x]`(indeterminate `[-]`), 라디오 `( )`/`(*)`, 토글 `<꺼짐>`/`<켜짐>`(menuconfig), select `< 값 ▾ >`. 행 전체 44px·호버 반전.
- 프롬프트형 입력: `<div class="input-ps"><span class="input-ps__ps">$</span><input class="input" …></div>`.
- 검증 `data-validate`: `required` `ssh` `handle` `port` `email`(공백 구분 여러 개). 흐림·입력·제출 때 `aria-invalid="true"` + `.field--error` + `.field__err`에 stderr 줄 `! 키 형식이 올바르지 않습니다 (ssh-ed25519로 시작)`. 문구 덮어쓰기 `data-msg-ssh="…"`.
- 제출: 실패하면 첫 오류로 포커스 + 제출 버튼 오류 상태·글리치 1회. 성공하면 버튼 로딩 → `data-toast` 문구로 방송.
- 글자 수 `maxlength` + `<p class="field__count">0/120</p>` — 처음 그릴 때도 app.js 가 미리 채워진 값 길이로 맞춘다. 2열 `.form-grid`(+`.span-all`).
- 한 줄 `.input`·`.select__el` 은 높이 44px 고정(`height`). 한글 값도 라틴 값과 같은 높이.
- 체크박스 `required` = 체크돼야 통과.
- menuconfig 화면의 `.mc` 클래스는 컴포넌트가 아니다(settings.css 장면 전용).

### kanban = tmux 4분할
```html
<div class="board" style="--board-cols:4">
  <section class="pane board__col" data-name="출제 중">
    <div class="pane__head"><h3 class="pane__title">출제 중 (<span data-count>4</span>)</h3><span class="pane__meta board__wip">마감 D-7</span></div>
    <div class="board__list">
      <div class="board__card" tabindex="0" aria-roledescription="이동 가능한 카드">
        <span class="board__id">NR31-hw-01</span><span class="board__pts">500점</span>
        <span class="board__title">SW-07 펌웨어 덤프</span>
        <span class="board__meta"><span>hw</span><span>ej0</span><span class="badge badge--warn">검수 대기</span></span>
      </div>
    </div>
  </section>
  … 아이디어 · 검수 · 배포 준비 …
  <p class="board__live sr-only" aria-live="polite"></p>
</div>
```
열 사이 gap 0·공유 선(599 이하 가로 스냅 스크롤일 때 오른쪽 4셀 페이드 힌트 자동). 카드 = ID(호박) · 점수 · 제목 · 분야/출제자. 상태 `.is-blocked`(적색 선 + `!`), `.is-done`(취소선). 드래그: 마우스 즉시, 터치는 0.3초 누른 뒤 → 카드 반전 + 점선 자리표시 → 놓으면 `[data-count]` 갱신. 키보드: Space/Enter 집기 → ←→ 열 이동 · ↑↓ 순서 → Space/Enter 놓기, Esc 취소(`.board__live`에 안내). 1023 이하 2열, 599 이하 가로 스냅 스크롤.

### list = ls -l
```html
<div class="ls" data-select style="--ls-cols: 8ch 9ch 12ch minmax(0,1fr)">
  <p class="ls__total">합계 12</p>
  <div class="ls__rows" role="listbox" aria-label="운영 메일">
    <button class="ls__row is-new" type="button" role="option" aria-selected="true"><span class="ls__mode">읽지않음</span><span class="ls__owner">pilseung</span><span class="ls__date">10-10 02:41</span><span class="ls__name">SW-07 커넥터 견적 회신</span></button>
    <a class="ls__row" href="kanban.html"><span class="ls__mode">drwxr-x</span><span class="ls__owner">seorin</span><span class="ls__date">10-08 22:14</span><span class="ls__name ls__name--dir">nr31</span></a>
  </div>
</div>
```
열 = 상태·소유자·날짜·이름(`--ls-cols`로 폭 지정, 모바일은 `--ls-cols-sm`, 기본 상태·소유자 숨김). 이름 변형 `--dir`(시안 굵게 + `/`) `--exec`(녹 + `*`) `--link`. `.is-new` = 앞에 `N`. 선택/현재 = 반전(`aria-selected`/`aria-current`), 행 44px, `.ls--dense` 30px(터치 44). `data-select` = 클릭 단일 선택 + ↑↓ 이동 + `ls:select` 이벤트. **메일 pager 연결은 app.js 가 한다**: 래퍼에 `data-mail-root`, 행에 `data-mail="m1"`, 본문에 `data-mail-body="m1"`(나머지는 `hidden`), 위치 표시 `<span data-pager-pos>1/12</span>`, 안 읽은 수 `<b data-unread>4</b>`, 좁은 화면 스크롤 대상 `data-pager`. 페이지 인라인 스크립트 금지.

### marquee = 상태 바 tail 티커
§3-1의 `.ticker`. 다른 곳에서도 쓸 수 있다(`<div class="ticker" id="…">` + `.ticker__lead` + `.ticker__window > .ticker__track > .ticker__item`). 항목 안 레벨 색 `lv-ok lv-warn lv-err`. 멈춤 버튼 `data-ticker-toggle="<id>"`(aria-pressed). 1셀씩 흐름(steps), 호버 정지, 동작 줄이기 = 첫 줄 고정. **첫 줄이 창 왼쪽에서 바로 보이며 시작**한다(빈 창 없음) — app.js 가 항목을 한 벌 복제(`ticker__item--clone`, aria-hidden)하고 트랙을 -50% 까지 돌린다. 상태 바 티커 창은 최소 24ch·최대 64ch.

### menu = ncurses 드롭다운
```html
<button class="btn" type="button" data-menu="mn-win"><span class="btn__label">창</span><kbd class="btn__key">▾</kbd></button>
<ul class="menu" id="mn-win" role="menu" aria-label="창 메뉴" hidden>
  <li role="none"><button class="menu__item" role="menuitem" type="button" data-key="n" data-toast="2:메일 창을 열었습니다"><span>새 창(<u>N</u>)</span><span class="menu__key">^b c</span></button></li>
  <li role="none"><button class="menu__item" role="menuitemcheckbox" aria-checked="true" type="button" data-key="l"><span>로그 따라가기(<u>L</u>)</span></button></li>
  <li role="separator" class="menu__sep"></li>
  <li role="none"><button class="menu__item" role="menuitem" aria-disabled="true" type="button"><span>세션 분리(<u>D</u>)</span></button></li>
  <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button" data-key="k"><span>창 닫기(<u>K</u>)</span><span class="menu__key">^b &amp;</span></button></li>
</ul>
```
트리거 아래에 붙어 뜬다(화면 밖이면 위로). 단축키 글자 `<u>` 호박 밑줄 + `data-key`로 바로 실행. ↑↓ Home End, Esc 닫기(트리거로 포커스), Tab 닫기, 바깥 클릭 닫기. 선택 = 반전. `menuitemcheckbox`/`menuitemradio`는 `aria-checked` 토글(`*` 표시). 정적 견본은 `hidden`/`id` 없이 `<ul class="menu" role="menu">` + `.menu__item.is-active`.

### modal = dialog --yesno
```html
<button class="btn" type="button" data-open="dlg-hw01"><span class="btn__label">검수로 넘기기</span></button>
<div class="overlay" id="dlg-hw01" role="dialog" aria-modal="true" aria-labelledby="dlg-hw01-t" hidden>
  <div class="overlay__scrim" data-close></div>
  <div class="pane dlg">
    <div class="pane__head"><h2 class="pane__title" id="dlg-hw01-t">dialog --yesno</h2></div>
    <div class="dlg__body"><p class="dlg__q">NR31-hw-01 을 검수로 넘길까요?</p><p class="dlg__note">출제자 ej0 에게 메일이 갑니다.</p></div>
    <div class="dlg__actions"><button class="btn btn--dlg is-default" type="button" data-close data-toast="NR31-hw-01 → 검수" data-autofocus>예</button><button class="btn btn--dlg" type="button" data-close>아니요</button></div>
  </div>
</div>
```
화면 중앙(이 테마의 유일한 가운데 정렬), 이중선, 제목 반전, 뒤는 디더 `░`. `.dlg--wide`(88열), `.dlg--danger`(적색 선·제목, 확인 버튼 `btn btn--dlg btn--danger`, `data-autofocus`는 취소 버튼에). 포커스 트랩·Esc·복귀. 정적 견본: `<div class="dither dither--bg">` 안에 `.pane.dlg`만 둔다(index ⑥·⑦).

### navbar = tmux 상태 바
§3-1.

### pagination = less
```html
<div class="less" data-less data-total="7" data-current="2" data-less-target="mail-pages" aria-label="메일 목록 페이지">
  <span class="less__status" aria-live="polite">-- 더 보기 -- (2/7)</span>
  <button class="less__step" type="button" data-dir="-1"><kbd>b</kbd> 이전</button>
  <span class="less__pages">
    <button class="less__page" type="button" data-page="1">1</button><button class="less__page" type="button" data-page="2">2</button><button class="less__page" type="button" data-page="3">3</button><span class="less__gap">…</span><button class="less__page" type="button" data-page="7">7</button>
  </span>
  <button class="less__step" type="button" data-dir="1"><kbd>space</kbd> 다음</button>
</div>
```
현재 페이지 = 녹 반전(`aria-current="page"`), 끝 페이지에서 상태 줄은 `(끝) (7/7)`, 처음/끝에서 이전/다음 `disabled`. `data-less-target` 컨테이너의 `[data-page="n"]` 자식을 보이기/숨기기. `less:change` 이벤트. 599 이하 현재·처음·끝만.

### popover = tmux display-popup
```html
<button class="btn btn--sm" type="button" data-popover="pp-bench03"><span class="btn__label">bench03</span></button>
<div class="pane popup" id="pp-bench03" role="dialog" aria-label="bench03 상태" hidden>
  <span class="popup__notch" aria-hidden="true"></span>
  <div class="pane__head"><h3 class="pane__title">bench03.sewoon.sh</h3></div>
  <dl class="popup__dl"><dt>사용</dt><dd>d0kkaebi · pts/3</dd><dt>up</dt><dd>4일 18시간</dd><dt>load</dt><dd>0.18 0.22 0.20</dd></dl>
</div>
```
앵커 아래 18px(제목 줄 자리)에 뜨고, 위 테두리 선에서 앵커 아랫변까지 꺾쇠 선(18px)이 이어진다(제목 글자 뒤로 지나갈 때는 제목 칸이 가린다). Esc·바깥 클릭 닫기. 정적 견본은 `hidden`/`id` 없이 `.pane.popup`.

### progress = wget / htop
```html
<!-- wget -->
<div class="meter" data-value="52" data-cells="20" aria-label="sw07-fw-1.3.bin 받기"><span class="meter__pct">52%</span><span class="meter__extra">1.2MB/s  남은 00:14</span></div>
<!-- htop -->
<div class="meter meter--htop" data-value="62" data-cells="24" aria-label="bench03 CPU 1"><span class="meter__label">1</span></div>
<div class="meter meter--htop" data-value="31" data-cells="24" data-label-in="2.1G/7.7G" aria-label="메모리"><span class="meter__label">Mem</span></div>
```
app.js가 `[=========>      ]` / `[||||||||      62%]` 글자 막대를 그린다(`role="progressbar"` + aria 값 자동). 값 텍스트 항상 표시. 색 `--warn`(호박) `--err`(적), 100%면 `--done`(녹 %). 좁은 곳은 `.meter--fluid`(막대만 늘고 채움 칸 수는 `data-cells` 그대로 — 넓은 칸에서는 쓰지 말 것). htop 형은 채움 글자가 값 글자 앞 1셀에서 멈추고, 값 글자에는 놓인 pane 의 바탕이 깔린다(겹쳐 읽히지 않음). 다시 받기 시연: `data-to="100" data-eta` + 버튼 `data-meter-run="<id>"`(화면에 들어오면 자동 1회). 여러 개는 `.meters`(2열 → 모바일 1열).

### sidebar = ranger 왼쪽 열
§3-3.

### skeleton = 디더
```html
<div class="skel" aria-hidden="true"><span class="skel__line" style="--w:80%"></span><span class="skel__line" style="--w:55%"></span></div>
<div class="skel skel--row" aria-hidden="true"><span class="skel__line"></span><span class="skel__line"></span><span class="skel__line"></span></div>
```
`░` 디더 행, 밝은 `▒` 한 칸이 1.2초에 한 번 지나감(동작 줄이기 = 정지). 감싸는 영역에 `aria-busy="true"`. `--title`/`--data` 높이 변형, 행형은 `--skel-cols`.

### spinner = 점자
```html
<span class="spin" role="status" aria-live="polite"><span class="spin__label">채점 중</span><span class="spin__meta">NR31-pwn-03</span></span>
```
`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` 100ms/프레임. 끝나면 `.spin--done`(✓ 녹) / `.spin--fail`(✗ 적)으로 바꾼다. 동작 줄이기 = `…`. `.spin--warn`.

### steps = make 진행
```html
<div class="steps" id="join-steps" data-steps data-index="1" data-steps-panels="join-panels" aria-label="가입 단계">
  <div class="steps__item"><span class="steps__mark"><span class="steps__n">[1/4]</span> 키 생성 <span class="steps__state"></span></span></div>
  <div class="steps__item"><span class="steps__mark"><span class="steps__n">[2/4]</span> 규약 <span class="steps__state"></span></span></div>
  <div class="steps__item"><span class="steps__mark"><span class="steps__n">[3/4]</span> 사물함 <span class="steps__state"></span></span></div>
  <div class="steps__item"><span class="steps__mark"><span class="steps__n">[4/4]</span> 첫 접속 <span class="steps__state"></span></span></div>
</div>
<div id="join-panels"><section data-step-panel>…</section><section data-step-panel>…</section>…</div>
<div class="dlg__actions">
  <button class="btn btn--dlg" type="button" data-step-nav="prev" aria-controls="join-steps">이전</button>
  <button class="btn btn--dlg is-default" type="button" data-step-nav="next" aria-controls="join-steps" data-label-done="접속하기" data-toast="mirae 계정이 열렸습니다. ssh mirae@sewoon.sh -p 2222"><span class="btn__label">다음</span></button>
</div>
```
완료 = 녹 + `✓`, 현재 = 반전 + `▸`(`aria-current="step"`), 대기 = 보조색 `·`, 오류 = `data-state="error"`(`!`). 단계 사이 `──` 선(완료 구간은 녹). 모바일은 세로. app.js가 `data-index`로 상태·패널·이전/다음 버튼을 맞춘다. **다음(또는 앞 단계로 가는 `data-step-go`)은 지금 패널의 `[data-validate]`·`[required]`를 검사해 하나라도 틀리면 넘어가지 않고 첫 오류 칸으로 포커스한다.** 단계 이름을 버튼으로 하려면 `.steps__mark`를 `<button data-step-go>`로.

### table = column -t / psql
```html
<section class="pane pane--flush" aria-labelledby="pn-solves">
  <div class="pane__head"><h2 class="pane__title" id="pn-solves">psql -c 'select * from 풀이'</h2></div>
  <div class="tbl scroll-x">
    <table class="tbl__t">
      <caption class="sr-only">NR31 문제별 풀이 수</caption>
      <thead><tr>
        <th scope="col" aria-sort="none"><button class="tbl__sort" type="button">문제</button></th>
        <th scope="col">분야</th>
        <th scope="col" class="num" aria-sort="descending"><button class="tbl__sort" type="button">풀이</button></th>
      </tr></thead>
      <tbody>
        <tr><td class="id">NR31-web-02</td><td>web</td><td class="num">11</td></tr>
        <tr class="is-err"><td class="id">NR31-hw-01</td><td>hw</td><td class="num" data-sort="0">0</td></tr>
      </tbody>
    </table>
    <p class="tbl__rows">(12개 행)</p>
    <p class="sr-only" aria-live="polite" data-sort-live></p>
  </div>
</section>
```
1px 박스 선, 머리 아래 3px 이중선, 숫자 `.num` 오른쪽 정렬, 셀 색 `.id`(호박) `.who`(청) `.muted`. 행 호버 = 반전, `aria-selected="true"` 행 = 반전, `.is-err`/`.is-warn` = 왼쪽 3px 색 띠. 정렬 버튼 `▲▼` → 클릭마다 오름/내림, 숫자 열은 `th.num` 또는 `data-sort-type="num"`(`data-type` 은 타이핑 효과 전용이라 쓰지 않는다), 값 덮어쓰기 `data-sort`. `.tbl--lined`(행 사이 선) `.tbl--compact`. pane 안에서는 `.pane--flush`(표 테두리를 pane 선이 대신한다).

### tabs = tmux 창 목록
```html
<div class="wins">
  <div class="wins__list" role="tablist" aria-label="pricing 보기">
    <button class="wins__tab" role="tab" type="button" id="tb-m" aria-controls="pn-m" aria-selected="true"><span class="wins__idx">0:</span>월간</button>
    <button class="wins__tab" role="tab" type="button" id="tb-y" aria-controls="pn-y" aria-selected="false"><span class="wins__idx">1:</span>연간<span class="badge badge--ok">2개월 무료</span></button>
  </div>
  <div class="wins__panel" role="tabpanel" id="pn-m" aria-labelledby="tb-m" tabindex="0">…</div>
  <div class="wins__panel" role="tabpanel" id="pn-y" aria-labelledby="tb-y" tabindex="0" hidden>…</div>
</div>
```
활성 = 반전 + `*`, 0ms. ←→ Home End(로빙 탭인덱스), 넘치면 가로 스크롤 + 오른쪽 페이드. 패널 전환 시 다시 그리기. `tabs:change` 이벤트. 탭 44px.

### timeline = git log --graph
```html
<ol class="gitlog">
  <li class="gitlog__row"><span class="gitlog__graph"><span class="gitlog__node"></span></span><span class="gitlog__hash">a3f9c21</span><span class="gitlog__body"><span class="gitlog__ref">HEAD</span><span class="gitlog__msg">pwn-03 힙 레이아웃 수정</span><span class="gitlog__who">seorin</span><span class="gitlog__time">03:02</span></span></li>
  <li class="gitlog__row gitlog__row--merge"> … 병합 커밋(오른쪽으로 갈라지는 ─╮) … </li>
  <li class="gitlog__row gitlog__row--branch"> … 곁가지 위 커밋(노드가 두 번째 줄기에) … </li>
  <li class="gitlog__row gitlog__row--fork"> … 분기점(곁가지가 돌아오는 ─╯) … </li>
</ol>
```
선은 CSS(글꼴 상자 그림 문자 폭 문제 회피). 노드 `*` 녹(곁가지는 핑크), 해시 호박, 핸들 청, 시각 보조. `.is-err` 행 = 적색 노드·메시지. 메시지를 링크로 하면 `a.gitlog__msg`.

### toast = wall 방송
```html
<button class="btn btn--sm" type="button" data-toast="04:00 마감합니다. 벤치 쓰신 분은 인두 전원 꼭 내려 주세요.">wall 보내기</button>
<button class="btn btn--sm" type="button" data-toast="ctf.sewoon.sh:443 연결 거부" data-toast-kind="err" data-toast-title="stderr" data-toast-from="sewoon: 리허설 서버 응답 없음">오류 방송</button>
```
app.js가 오른쪽 아래 `.toasts`에 `.pane.wall`을 만든다: 제목 `wall`(오류는 반전 적색 `stderr`), 첫 줄 `moon@sewoon 님의 방송 (pts/0, 03:12)`, 본문. 5초 뒤 닫힘(호버 중 유지), `[x]` = "알림 닫기", 최대 3개. 오류는 다시 그리기 + 글리치 1회. `data-toast-kind`: `info ok warn err`. JS: `sewoon.toast({ kind, title, from, msg, duration })`.
정적 견본:
```html
<section class="pane wall wall--info" aria-label="방송 견본">
  <div class="pane__head"><span class="pane__title">wall</span><span class="pane__meta"><button class="pane__key" type="button" data-dismiss aria-label="알림 닫기"><kbd>x</kbd></button></span></div>
  <p class="wall__from">moon@sewoon 님의 방송 (pts/0, 03:12)</p><p class="wall__msg">04:00 마감합니다. 벤치 쓰신 분은 인두 전원 꼭 내려 주세요.</p>
</section>
```

### tooltip = --help 한 줄
```html
<button class="btn btn--ghost" type="button" data-tip="ssh d0kkaebi@sewoon.sh -p 2222 로 접속">접속법</button>
<span class="tip tip--static">ssh d0kkaebi@sewoon.sh -p 2222</span>   <!-- 정적 견본 -->
```
반전 작은 상자 13px, 앵커 아래(공간 없으면 위), 400ms 지연, 키보드 포커스로도 열림, Esc 닫기, 열린 동안 `aria-describedby`. 아이콘 버튼의 이름은 `aria-label`로 따로 준다(툴팁이 이름을 대신하지 않는다).

### motion = sewoon motion --demo
```html
<div class="motion" id="mo-demo">
  <div class="motion__row"><span class="motion__name">type-char</span><span class="motion__val">22ms/글자</span><span class="motion__demo"><code data-type>ssh d0kkaebi@sewoon.sh</code><span class="cursor cursor--idle cursor--hollow" aria-hidden="true"></span></span></div>
  <div class="motion__row"><span class="motion__name">line-out</span><span class="motion__val">14ms/줄</span><span class="motion__demo"><span data-lines><span>OK  pane mounted</span> <span>OK  stream 1400ms</span></span></span></div>
  <div class="motion__row"><span class="motion__name">redraw</span><span class="motion__val">96ms steps(4)</span><span class="motion__demo"><span class="motion__box" data-redraw>pane 다시 그리기</span></span></div>
  <div class="motion__row"><span class="motion__name">glitch</span><span class="motion__val">160ms · 1회</span><span class="motion__demo"><span class="motion__box" data-glitch>404</span></span></div>
</div>
<button class="btn btn--sm" type="button" data-replay="mo-demo" data-hotkey="r"><span class="btn__label">다시 재생</span><kbd class="btn__key">r</kbd></button>
```
| 속성/클래스 | 동작 |
|---|---|
| `data-type` | 화면에 들어오면 글자를 추가하며 타이핑(22ms/글자, 명령당 최대 900ms, 40자 넘으면 즉시). `data-delay="ms"` 시작 지연 |
| `data-lines` | 자식을 줄 단위로 찍는다(14ms/줄, 40줄 넘으면 나머지 즉시, 페이드 없음) |
| `data-glitch` | 화면에 들어오면 RGB 분리 글리치 1회(404 제목, 오류 토스트) |
| `data-redraw` / `.redraw` | 위→아래 4단계 다시 그리기 |
| `data-replay="id"` | 대상과 그 안의 위 효과를 다시 재생 |
| `data-glitch-now="id"` | 버튼으로 글리치 1회 |
| `html[data-power-on]` | index 첫 진입 전원 켜짐(세션당 1회) |

동작 줄이기: 모두 최종 상태로 즉시, 커서 정지, 스트림은 정지 상태로 시작, 스피너 `…`. 화면당 움직이는 것은 커서 1개 + 스트림 1개가 기준.

---

## 5. app.js 동작 요약 (data 속성)

| 속성 | 하는 일 |
|---|---|
| `data-theme-toggle` (+ 안의 `data-theme-label`) | 낮/밤 전환·저장, 라벨 `밤`/`낮`, aria-label 갱신 |
| `data-command-open` · ⌘K · Ctrl+K · `/` | `.overlay[data-command]` 열기 |
| `data-open="id"` / `data-close(="id")` | 오버레이(modal·drawer) 열고 닫기, 포커스 트랩·Esc·복귀·스크롤 잠금 |
| `data-menu="id"` / `data-popover="id"` | 떠 있는 메뉴·팝오버(aria-expanded·haspopup·controls 자동) |
| `data-tip="문구"` | 툴팁 |
| `data-toast="문구"` (+`-kind` `-title` `-from`) | wall 방송 |
| `data-busy="ms"` (+`data-busy-toast` / `data-busy-fail`) | 버튼 로딩 시연 |
| `data-copy(="id")` / `data-copy-text` | 복사 + "복사됨" |
| `data-dismiss(="id")` | alert·wall 닫기 |
| `data-hotkey="p"` | 그 키를 누르면 화면에 보이는 첫 요소 클릭(입력 중·오버레이 밖이면 무시) |
| `data-stream` · `data-stream-toggle/stamp/note` | tail -f 스트림 |
| `data-replay` `data-type` `data-lines` `data-glitch` `data-redraw` `data-glitch-now` | 모션 |
| `data-less` · `data-steps` · `data-step-nav` · `data-step-go` | 페이지·단계 |
| `data-select`(.ls) · `.board` · `.cal` · `.feh` · `[role=tablist]` · `.tree__toggle` · `.tbl__sort` | 자동 초기화 |
| `data-side-toggle` | ranger 열 접기 |
| `data-meter-run="id"` · `.meter[data-value]` | 미터 그리기·재생 |
| `data-validate` · `form[data-toast]` | 폼 검증·제출 방송 |

JS API: `window.sewoon.toast(opts)` `.open(id)` `.close(id)` `.setTheme('dark'|'light')` `.setMeter(el, v)` `.setStep(el|id, i)` `.replay(id)` `.init(scope)`(동적으로 넣은 마크업 초기화).
이벤트: `overlay:open` `overlay:close` `tabs:change` `cal:select` `less:change` `steps:change` `ls:select` `typed`.

---

## 6. 장면 에이전트 체크리스트

- 첫 줄은 언제나 명령(`.sh-cmd`). 그 바로 아래는 **그 명령의 출력이 머리**다. `.scene-head`(한글 장면 제목 블록)는 dashboard·onboarding·pricing 3곳만, 나머지는 출력 안에 h1. eyebrow·CTA 2개·기능 칩·가운데 정렬 섹션 머리 금지.
- 나란히 놓는 것은 `.split`(gap 0, 공유 선)으로. 카드 사이 여백 그리드 금지. 비율 62/38 · 38/62 · 40/30/30 · 20/30/50.
- 숫자·날짜·사람·ID는 DIRECTION.md 팩트 시트 값만(기준 2026-10-10(토) 03:12:07).
- Sixtyfour(`.t-mega`·`.t-num`)는 라틴·숫자만, 32px 이상, 화면당 1–2곳. `.ghosted` 잔상은 dashboard D-14 에만.
- 다크 = 인광(글로우·스캔라인), 라이트 = LCD(글로우 0). 장면 CSS에서 모드별 분기가 필요하면 `[data-theme="light"] .x {}`로, 값은 토큰만.
- 오버레이는 열린 정적 견본(`.overlay` 없이)과 실제 트리거를 둘 다 둔다(index ⑦).
- 360/390에서 가로 스크롤 0: 표·`<pre>`·로그는 `.scroll-x` 또는 pane 내부 스크롤.
