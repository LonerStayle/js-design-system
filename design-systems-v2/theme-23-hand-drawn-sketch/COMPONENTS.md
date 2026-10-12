# COMPONENTS — 끄적 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거는 `DIRECTION.md`, 세계관 값은 DIRECTION의 **팩트 시트**만 쓴다(기준일 2026-10-14 수요일 오후 3:40, 로그인 사용자 한서윤).
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected` `aria-current` `aria-expanded` `aria-pressed` `aria-checked` `aria-busy` `aria-invalid` `disabled`)으로 표시하고 CSS가 그 속성을 읽는다.

시그니처 두 가지는 컴포넌트에 이미 들어 있다. 장면 CSS에서 다시 그리지 않는다.
- **A. 두 번 그은 윤곽선**: `border 2px` + 손그림 radius + `::before` 두 번째 선. 정보 영역(카드·표·폼·모달·달력)에 쓰고 0deg로 둔다.
- **B. 빨간 마커 주석**: 포커스 고리, 활성 탭, 현재 페이지, 오늘 날짜, 에러, "새로", WIP 초과. 뷰포트 하나에 정적 동그라미는 최대 3개(포커스·에러 제외).

---

## 0. 페이지 뼈대

### 0-1. `<head>` — pages/*.html

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>끄적 — 모락 프로덕트팀 홈</title>
<script>(function(){try{var d=document.documentElement;d.classList.add('js');var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('kkeujeok-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&family=Gaegu:wght@400;700&family=Nanum+Pen+Script&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="dashboard.css">
</head>
```

index.html은 `href="styles.css"`, `href="index.css"`로 바꾼다. `<title>`은 "끄적 — 장면 이름" 형식이다. 스크립트는 `</body>` 직전에 `<script src="../app.js"></script>`(index는 `app.js`)를 둔다.

- 첫 인라인 스크립트가 FOUC를 막는다(우선순위 `?theme=` → localStorage `kkeujeok-theme` → 시스템). `js` 클래스도 여기서 붙는다. 선 그리기 초기 상태가 이 클래스에 달려 있어 빼면 안 된다.
- 폰트는 이 `<link>` 1개만 쓴다. Balsamiq Sans(라틴 마커) · Gaegu(한글 마커) · Nanum Pen Script(메모) · IBM Plex Sans KR(UI) · IBM Plex Mono(ID·코드).
- 장면 CSS(`index.css`, `pages/<name>.css`)는 **semantic 토큰만** 쓴다(2절). raw hex, 인라인 `grid-template-columns`, `href="#"`, 인라인 onclick, 이미지 파일은 쓰지 않는다. `style="--val:46%"`, `style="--w:18"`처럼 커스텀 속성을 주입하는 것은 허용한다.
- SVG presentation attribute에 `var()`를 쓰지 않는다. 색은 CSS가 `currentColor`로 준다.

### 0-2. pages/*.html 의 body 순서 (앱 셸)

```html
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">…3-1 navbar…</header>
<div class="app">
  <aside class="sidebar" id="sidebar">…3-2 sidebar…</aside>
  <main class="app__main" id="main">…장면…</main>
</div>
<footer class="site-foot">…3-3 바닥글…</footer>
<div class="command" id="command" …>…3-4 커맨드…</div>
<!-- 장면별 모달·드로어는 여기 -->
<script src="../app.js"></script>
</body>
```
캔버스가 꽉 차야 하는 장면(kanban)은 `<main class="app__main app__main--canvas">`를 쓰고 안쪽 여백은 장면 CSS에서 준다.

### 0-3. index.html 의 body 순서

```html
<body id="top">
<a class="skip" href="#main">본문으로 건너뛰기</a>
<nav class="toolbar">…3-5 떠 있는 도구막대…</nav>
<div class="marquee">…</div>        <!-- 첫 화면 위 테이프 띠 (선택) -->
<main id="main">
  <section id="board-color">…</section> … <section id="board-scenes">…</section>
</main>
<footer class="site-foot">…3-3 바닥글 (index 경로)…</footer>
<div class="command" id="command" …>…</div>
<script src="app.js"></script>
</body>
```
index의 도구막대는 화면 위에 떠 있다(모바일은 아래). 첫 섹션에 `padding-top: 96px` 정도를 장면 CSS에서 주어 가리지 않게 한다. 모바일에서는 바닥 여백 88px을 준다.

---

## 1. 레이아웃 문법 — 점 격자 위의 클러스터 (base.css)

`body` 전체가 화이트보드(`--board`) + 24px 점 격자다. 장면에서 배경을 다시 깔지 않는다.

| 클래스 | 용도 |
|---|---|
| `.canvas` | 왼쪽 48px(모바일 16px)에서 시작하는 보드 면. 중앙 max-width는 없다. `--tight` `--flush-top` |
| `.cols` + `.span-3/4/5/6/7/8/9/12`, `.start-2/3` | 12단 비대칭 칸. `--loose`(칸 사이 96px), `--stretch`. ≤1024는 6단(3·4만 반폭), ≤640은 한 줄 |
| `.w-cells` + `style="--w:18"` | 폭을 24px 격자 칸 수로 고정(18칸 = 432px) |
| `.cluster` (`--center` `--apart`) / `.stack` (`--s` `--l` `--xl`) / `.row` / `.grow` | 클러스터 안은 촘촘하게(8–16px) |
| `.gap-cluster` | 클러스터 사이 넓은 간격(데스크톱 96px, 모바일 48px) |
| `.board-head` > `.board-head__title` + `.board-head__memo` | 섹션 제목. **왼쪽 위**에서 마커로 쓰고 옆에 메모("10/14 서윤")를 단다. 가운데 정렬 헤더는 금지 |
| `.board-break` > `.tape.tape--label` | 섹션 구분 = 보드 장 넘김. 손떨림 마커선과 테이프 이름표("보드 2 · 글씨") |
| `.h-scroll` | 가로 스크롤 + 오른쪽 페이드 힌트(app.js가 끝에 닿으면 `.is-end`) |

```html
<section class="canvas" id="board-type" aria-labelledby="bt">
  <div class="board-break"><span class="tape tape--label">보드 2 · 글씨</span></div>
  <div class="board-head">
    <h2 class="board-head__title" id="bt"><span class="scrawl" data-draw>사람 글씨 / 기계 글씨</span></h2>
    <span class="board-head__memo">10/14 서윤</span>
  </div>
  <div class="cols cols--loose"><div class="span-7">…</div><div class="span-5">…</div></div>
</section>
```

### 회전 위계
- 정보 영역(카드, 표, 폼, 모달, 달력, 입력 요소)은 **0deg**다. `.tilted`를 붙이지 않는다.
- 포스트잇은 `.pile` 안에서 nth-child로 −2.5 / 1.5 / −1 / 2 / −0.5deg를 순환한다. 낱장은 `.tilt-1`…`.tilt-5`로 준다.
- 주석·테이프는 −4~3deg. 모바일(≤640)은 토큰이 ±1deg로 자동으로 줄어든다.

### 글씨 유틸 — 사람 글씨 / 기계 글씨
| 클래스 | 폰트 | 쓰는 곳 |
|---|---|---|
| `.t-hero` `.t-1` `.t-2` `.t-3` | 마커(Balsamiq + Gaegu 700) | 보드 제목, 큰 수치(1,284) |
| `.memo` (`--l` `--s`, `--red` `--blue` `--soft`) | 메모(Nanum Pen Script) | 휘갈긴 메모. **24px 미만으로 쓰지 않는다**(`--fs-memo-s`가 하한) |
| `.memo-note` (`--blue` `--ink` `--flat`) | 메모, 빨강, −3deg | 동그라미 옆 화살표 메모 |
| `.lofi` | 마커 400 | 와이어 속 로파이 라벨 "[ 버튼 ]" |
| `.ui-xl` `.ui-l` `.ui-s` `.ui-xs` | IBM Plex Sans KR | 앱 UI·본문·데이터 |
| `.mono` | IBM Plex Mono | BRD-0412, hex, 단축키. **라틴·숫자에만** 쓴다 |
| `.soft` `.red` `.blue` `.green` `.amber` `.num` `.prose` | | 색·숫자 정렬·본문 폭 |

버튼·라벨·표·범례에는 손글씨를 쓰지 않는다. 한글 제목에 넓은 자간을 주지 않는다(마커는 크기별 `--ls-marker-xl/-l/(기본)` 큰 제목 −0.14 · 중제목 −0.13 · 24px 이하 −0.10em + 낱말 사이 +0.06em이 이미 걸려 있다).

### 시그니처 유틸
```html
<!-- A. 두 번 그은 윤곽 (임의의 상자) -->
<div class="ds ds--sheet">…</div>          <!-- --b / --c 모서리 변형, --dashed 미정·초안 -->

<!-- B. 동그라미 · 밑줄 · 형광펜 · 화살표 -->
<span class="circled">결정</span>           <!-- --blue --green --tight -->
<span class="scrawl scrawl--red">제목</span>
<span class="mark">버튼 4개로 간다</span>   <!-- 낮: 노란 띠 / 밤: 형광 글씨 + 밑줄 -->
<svg class="connector connector--red" viewBox="0 0 120 80" aria-hidden="true">
  <path pathLength="1" d="M4 10 C40 6 80 30 110 70"/>
  <path pathLength="1" d="M96 66 C101 68 106 70 111 71 C111 65 112 60 113 55"/>
</svg>
```
- `data-draw`를 붙인 요소(또는 조상)는 화면에 들어올 때 한 번 **그려진다**(선 560ms, 형광펜 360ms, stagger 80ms, 최대 8개). `.connector`의 각 `<path>`에 `pathLength="1"`이 꼭 있어야 한다.
- 화살표는 실제로 두 요소를 잇는 곳에만 둔다. 장식용 곡선은 쓰지 않는다. 모바일에서 가로 화살표는 장면 CSS가 아래 방향 path로 바꾼다.

### 재료
```html
<div class="pile pile--overlap">
  <div class="postit postit--m">빨강은 주석에만<span class="postit__meta">10/14 · 도현</span></div>
  <div class="postit postit--m postit--pink">손글씨는 22px 아래 금지</div>
  <div class="postit postit--s postit--mint"><span class="postit__big">46%</span>스프린트 24</div>
</div>
<div class="ds ds--sheet"><span class="tape tape--tl" aria-hidden="true"></span>…</div>  <!-- tape--top / --tl / --tr -->
<span class="lofi-img" style="min-height:120px" aria-hidden="true"></span>  <!-- X자 + 해칭 이미지 자리 -->
<div class="erased">…</div>   <!-- 지운 자국 해칭 -->
<span class="avatar avatar--pink" aria-hidden="true">서윤</span>  <!-- --s --l, --yellow --pink --mint (기본 파랑) -->
<span class="avatar-stack">…</span>
<span class="kbd">⌘K</span>
<span class="glyph" aria-hidden="true"></span>  <!-- 손그림 화살표 →. --arrow-l --chevron --caret --tick --cross --dot -->
```
- 포스트잇 색 = 의미: 노랑 기본·경고, 분홍 질문·이슈·실패, 민트 확정·완료, 파랑 정보·참고. 포스트잇 글씨는 양 모드에서 검정 잉크(`--on-postit`)다.
- 포스트잇 위 빨간 글씨는 `.red` / `.memo-note`를 쓰면 자동으로 `--on-postit-red`가 된다(대비 확보).
- 커피 얼룩, 별, 낙서 버스트, 압정, 터뷸런스 필터는 쓰지 않는다.

### 아이콘 (인라인 SVG, 24 격자, 손떨림 선)
`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>` — `.icon`(20) `.icon--sm`(16) `.icon--lg`(24). 아이콘만 있는 버튼은 `aria-label`을 단다. `more`(점 3개)의 굵기는 SVG 속성이 아니라 CSS로 준다(`.kanban__grip .icon { stroke-width: 3.5 }`, kanban.css). base.css `.icon` 의 stroke-width 가 속성보다 우선하기 때문이다.

| 이름 | 마크업 |
|---|---|
| `select` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5 L5.5 19 L9.5 15 L12.5 21 L15 19.8 L12 14 L18 13.5 Z"/></svg>` |
| `pen` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 L5 15.5 L15.5 5 C16.5 4 18 4 19 5 C20 6 20 7.5 19 8.5 L8.5 19 Z M14 6.5 L17.5 10"/></svg>` |
| `postit` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg>` |
| `arrow` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18 C8 14 12 10 19 5 M12.5 5 L19 5 L18.5 11.5"/></svg>` |
| `text` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6 C9 5.5 14 5.5 19 6 M12 6 L12 19.5 M9 19.5 L15 19.5"/></svg>` |
| `search` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4 C14.5 4 17 6.8 17 10.5 C17 14.3 14.2 17 10.5 17 C6.6 17 4 14.2 4 10.4 C4 6.7 6.8 4 10.5 4 Z M15.5 15.5 L20.5 20.5"/></svg>` |
| `sun` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8 C14.3 8 16 9.8 16 12 C16 14.3 14.2 16 12 16 C9.7 16 8 14.2 8 12 C8 9.8 9.8 8 12 8 Z M12 2.5 L12 4.5 M12 19.5 L12 21.5 M2.5 12 L4.5 12 M19.5 12 L21.5 12 M5.2 5.2 L6.6 6.6 M17.4 17.4 L18.8 18.8 M5.2 18.8 L6.6 17.4 M17.4 6.6 L18.8 5.2"/></svg>` |
| `moon` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5 C18 15.3 16.5 15.6 15 15.5 C11 15.2 8.5 12 8.6 8.2 C8.7 6.8 9.1 5.4 9.8 4.3 C6.3 5.3 3.8 8.5 4 12.3 C4.3 16.8 8.1 20.2 12.5 20 C15.6 19.8 18.3 17.6 19.5 14.5 Z"/></svg>` |
| `menu` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5 C9 6 15 6.2 20 6.5 M4 12 C9 12.3 15 11.8 20 12 M4 17.5 C9 17.2 14 17.6 20 17.3"/></svg>` |
| `home` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 L12 4 L20 11 M6 9.5 L6 20 L18 20 L18 9.5 M10 20 L10 14 L14 14 L14 20"/></svg>` |
| `comment` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5 L20 5.3 L19.7 16 L11 16 L6.5 20 L7 16 L4.2 16 Z"/></svg>` |
| `template` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5 L11 4.5 L11 11 L4 11 Z M13.5 4.5 L20 4.5 L20 11 L13.5 11 Z M4 13.5 L11 13.5 L11 20 L4 20 Z M13.5 13.5 L20 13.5 L20 20 L13.5 20 Z"/></svg>` |
| `tag` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5 L12 4 L20.5 12.5 L12.5 20.5 L4 12 Z M8.5 8.5 L8.6 8.6"/></svg>` |
| `settings` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7 L20 7 M4 17 L20 17 M9 4.5 L9 9.5 M15 14.5 L15 19.5"/></svg>` |
| `user` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 C14.2 4 15.8 5.7 15.8 8 C15.8 10.3 14.2 12 12 12 C9.8 12 8.2 10.3 8.2 8 C8.2 5.7 9.8 4 12 4 Z M4.5 20.5 C5.5 16.5 8.5 14.5 12 14.5 C15.5 14.5 18.5 16.5 19.5 20.5"/></svg>` |
| `flag` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21 L5 4 M5 4.5 C9 3 12 6.5 18.5 4.5 L18.5 13 C12 15 9 11.5 5 13"/></svg>` |
| `plus` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 C12.2 10 11.8 14 12 19 M5 12 C10 11.8 14 12.2 19 12"/></svg>` |
| `more` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12 L6 12 M11.8 12 L12.3 12 M18 12 L18.5 12"/></svg>` |
| `clock` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 C16.5 4 20 7.5 20 12 C20 16.5 16.5 20 12 20 C7.5 20 4 16.5 4 12 C4 7.6 7.5 4 12 4 Z M12 7.5 L12 12 L15 14"/></svg>` |
| `play` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5 L18.5 12 L7 19 Z"/></svg>` |
| `pause` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 L8 19 M16 5 L16 19"/></svg>` |
| `replay` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 C5 8 8 5 12 5 C16 5 19 8 19 12 C19 16 16 19 12 19 C9.5 19 7.6 17.8 6.4 16 M5 7.5 L5 12 L9.5 12"/></svg>` |
| `copy` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 8 L20 8.3 L19.8 20 L8.3 19.7 Z M5 15.5 L4.2 4.3 L15.5 4"/></svg>` |
| `trash` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5 L19.5 6.5 M9 6.5 L9.5 4 L14.5 4 L15 6.5 M6.5 6.5 L7.5 20 L16.5 20 L17.5 6.5"/></svg>` |
| `exit` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4.5 L4.5 4.5 L4.5 19.5 L10 19.5 M9.5 12 L20 12 M16 8 L20 12 L16 16"/></svg>` |
| `bell` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16.5 C7 14.5 6.5 11 7 9 C7.7 6 9.6 4.5 12 4.5 C14.4 4.5 16.3 6 17 9 C17.5 11 17 14.5 18 16.5 Z M10 19.5 C10.6 20.5 13.4 20.5 14 19.5"/></svg>` |
| `calendar` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6 L19.5 6.3 L19.3 20 L4.3 19.8 Z M4.5 10.5 L19.5 10.5 M8.5 3.5 L8.5 7.5 M15.5 3.5 L15.5 7.5"/></svg>` |
| `link` | `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 C11.5 15.5 13.5 15.5 15 14 L18.5 10.5 C20 9 20 7 18.5 5.5 C17 4 15 4 13.5 5.5 L12.5 6.5 M14 10 C12.5 8.5 10.5 8.5 9 10 L5.5 13.5 C4 15 4 17 5.5 18.5 C7 20 9 20 10.5 18.5 L11.5 17.5"/></svg>` |

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 무리 | 토큰 |
|---|---|
| 면 | `--board` `--board-dot` `--sheet` `--sheet-sunk` |
| 선·글 | `--ink` `--ink-soft` `--ink-faint`(장식 전용, 텍스트 금지) `--line` `--hatch` |
| 실행(파랑) | `--marker-blue` `--marker-blue-press` `--on-marker` `--link` |
| 주석·위험(빨강) | `--marker-red` `--marker-red-deep` `--danger-fill` `--danger-fill-hover` `--on-danger` `--focus` |
| 확정(초록) / 경고 | `--marker-green` `--marker-green-press` `--on-success` / `--marker-amber` |
| 포스트잇 | `--postit-yellow` `--postit-pink` `--postit-mint` `--postit-blue` `--postit-glue` `--on-postit` `--on-postit-soft` `--on-postit-red` |
| 형광펜 | `--highlighter` `--hl-bg` `--hl-text` `--hl-line` `--hl-row` `--hl-row-hover` `--on-hl-row` |
| 재료·그림자 | `--tape` `--on-tape` `--shadow-press` `--shadow-press-color` `--shadow-postit` `--shadow-lift` `--shadow-paper` `--backdrop` |
| 형상 마스크 | `--mask-circle` `--mask-ring` `--mask-underline` `--mask-rule` `--mask-vrule` `--mask-arrow-r/l` `--mask-tick` `--mask-cross` `--mask-dot` `--mask-scribble-1..3` `--clip-tape` `--clip-torn-left` |
| 크기·모서리·모션 | `--fs-*` `--sp-1..8` `--grid` `--gutter` `--r-wobble-a/b/c/s` `--r-blob` `--r-postit` `--tilt-1..5` `--ease-draw` `--ease-stick` `--ease-slide` `--dur-*` |

마스크로 그리는 손그림 모양은 `background: var(--marker-red); mask: var(--mask-circle) center / 100% 100% no-repeat;`처럼 색을 background로 칠한다.
다크 모드는 토큰이 알아서 바꾼다. 장면 CSS에 `[data-theme="dark"]` 분기를 쓰지 않는다. 꼭 필요하면 토큰을 먼저 추가한다.

---

## 3. 공통 셸 — 복사해서 쓰는 스니펫 (이 마크업 그대로, 고치지 말 것)

바꿔도 되는 것은 **현재 위치 표시뿐**이다. navbar 도구·검색·테마, 사이드바 항목·순서, 바닥글 링크는 모든 화면에서 같다.

**예외 1곳 — onboarding.html (신규 멤버 송예린 장면)**: navbar 아바타를 `<a class="nav__avatar" href="settings.html" aria-label="내 정보 — 송예린 (오늘 합류)"><span class="avatar avatar--s avatar--pink" aria-hidden="true">예린</span></a>`로 바꾸고, 사이드바 "최근 보드" `<ul>` 자리에 빈 상태를 둔다:
`<div class="empty empty--compact sidebar__empty"><div class="empty__body"><span class="memo memo--s empty__memo">아직 비어 있어요</span><p class="empty__text">템플릿을 고르면 예린 님의 첫 보드가 여기에 붙어요.</p></div></div>`.
팀 플랜 칸은 `<strong>팀 플랜</strong> · 오늘 8번째 자리<br>11월 2일 청구서에 일할 계산`. 나머지 셸은 그대로.

### 3-1. navbar — pages/*.html

```html
<header class="nav">
  <button class="btn btn--icon btn--s btn--ghost nav__menu" type="button" data-sidebar-toggle aria-controls="sidebar" aria-expanded="false" aria-label="보드 목록 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5 C9 6 15 6.2 20 6.5 M4 12 C9 12.3 15 11.8 20 12 M4 17.5 C9 17.2 14 17.6 20 17.3"/></svg></button>
  <a class="brand" href="dashboard.html" aria-label="끄적 — 워크스페이스 홈"><span class="brand__first">끄</span>적</a>
  <span class="nav__sep" aria-hidden="true"></span>
  <div class="menu-wrap">
    <button class="nav__ws" type="button" data-menu="ws-menu"><span class="nav__ws-mark" aria-hidden="true">모</span><span class="nav__ws-name">모락 프로덕트팀</span><span class="glyph glyph--caret" aria-hidden="true"></span></button>
    <div class="menu" id="ws-menu" hidden>
      <span class="menu__label">워크스페이스 · ws_morak</span>
      <button class="menu__item" type="button" role="menuitemradio" aria-checked="true">모락 프로덕트팀</button>
      <a class="menu__item" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7 L20 7 M4 17 L20 17 M9 4.5 L9 9.5 M15 14.5 L15 19.5"/></svg>워크스페이스 설정</a>
      <a class="menu__item" href="pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5 L12 4 L20.5 12.5 L12.5 20.5 L4 12 Z M8.5 8.5 L8.6 8.6"/></svg>팀 플랜 · ₩9,900/1인·월</a>
      <hr class="menu__sep">
      <a class="menu__item" href="onboarding.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 C12.2 10 11.8 14 12 19 M5 12 C10 11.8 14 12.2 19 12"/></svg>팀원 초대하기</a>
    </div>
  </div>
  <div class="nav__tools" role="toolbar" aria-label="그리기 도구" data-tool-group>
    <button class="nav__tool" type="button" aria-pressed="true" aria-label="선택" data-tip="선택" data-tip-kbd="V"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5 L5.5 19 L9.5 15 L12.5 21 L15 19.8 L12 14 L18 13.5 Z"/></svg></button>
    <button class="nav__tool" type="button" aria-pressed="false" aria-label="펜" data-tip="펜" data-tip-kbd="P"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 L5 15.5 L15.5 5 C16.5 4 18 4 19 5 C20 6 20 7.5 19 8.5 L8.5 19 Z M14 6.5 L17.5 10"/></svg></button>
    <button class="nav__tool" type="button" aria-pressed="false" aria-label="포스트잇" data-tip="포스트잇" data-tip-kbd="N"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg></button>
    <button class="nav__tool" type="button" aria-pressed="false" aria-label="화살표" data-tip="화살표" data-tip-kbd="A"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18 C8 14 12 10 19 5 M12.5 5 L19 5 L18.5 11.5"/></svg></button>
    <button class="nav__tool" type="button" aria-pressed="false" aria-label="글씨" data-tip="글씨" data-tip-kbd="T"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6 C9 5.5 14 5.5 19 6 M12 6 L12 19.5 M9 19.5 L15 19.5"/></svg></button>
  </div>
  <div class="nav__actions">
    <button class="nav__search" type="button" data-command-open aria-label="보드·카드 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4 C14.5 4 17 6.8 17 10.5 C17 14.3 14.2 17 10.5 17 C6.6 17 4 14.2 4 10.4 C4 6.7 6.8 4 10.5 4 Z M15.5 15.5 L20.5 20.5"/></svg><span class="nav__search-label">보드·카드 찾기</span><span class="kbd" aria-hidden="true">⌘K</span></button>
    <button class="theme-toggle" type="button" data-theme-toggle><svg class="icon icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8 C14.3 8 16 9.8 16 12 C16 14.3 14.2 16 12 16 C9.7 16 8 14.2 8 12 C8 9.8 9.8 8 12 8 Z M12 2.5 L12 4.5 M12 19.5 L12 21.5 M2.5 12 L4.5 12 M19.5 12 L21.5 12 M5.2 5.2 L6.6 6.6 M17.4 17.4 L18.8 18.8 M5.2 18.8 L6.6 17.4 M17.4 6.6 L18.8 5.2"/></svg><svg class="icon icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5 C18 15.3 16.5 15.6 15 15.5 C11 15.2 8.5 12 8.6 8.2 C8.7 6.8 9.1 5.4 9.8 4.3 C6.3 5.3 3.8 8.5 4 12.3 C4.3 16.8 8.1 20.2 12.5 20 C15.6 19.8 18.3 17.6 19.5 14.5 Z"/></svg><span class="theme-toggle__label" data-theme-label>낮 보드</span></button>
    <a class="nav__avatar" href="profile.html" aria-label="내 프로필 — 한서윤"><span class="avatar avatar--s avatar--pink" aria-hidden="true">서윤</span></a>
  </div>
</header>
```
- 그리기 도구 5개는 시연용 단일 선택(`data-tool-group`)이다. 화면마다 눌린 도구를 바꾸지 않는다.
- ≤1024에서 도구가 숨고 왼쪽 ☰(`data-sidebar-toggle`)이 나타난다. ≤640에서는 워크스페이스 이름과 검색 글자가 숨는다.

### 3-2. sidebar — pages/*.html

```html
<aside class="sidebar" id="sidebar" aria-label="워크스페이스 메뉴">
  <div class="sidebar__section">
    <nav class="sidebar__nav" aria-label="워크스페이스">
      <a class="sidebar__link" href="dashboard.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 L12 4 L20 11 M6 9.5 L6 20 L18 20 L18 9.5 M10 20 L10 14 L14 14 L14 20"/></svg><span class="sidebar__label">홈</span></a>
      <a class="sidebar__link" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5 L20 5.3 L19.7 16 L11 16 L6.5 20 L7 16 L4.2 16 Z"/></svg><span class="sidebar__label">코멘트함</span><span class="sidebar__count sidebar__count--alert">23</span></a>
      <a class="sidebar__link" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg><span class="sidebar__label">스프린트 24 보드</span></a>
      <a class="sidebar__link" href="product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5 L11 4.5 L11 11 L4 11 Z M13.5 4.5 L20 4.5 L20 11 L13.5 11 Z M4 13.5 L11 13.5 L11 20 L4 20 Z M13.5 13.5 L20 13.5 L20 20 L13.5 20 Z"/></svg><span class="sidebar__label">템플릿</span></a>
      <a class="sidebar__link" href="pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5 L12 4 L20.5 12.5 L12.5 20.5 L4 12 Z M8.5 8.5 L8.6 8.6"/></svg><span class="sidebar__label">요금제</span></a>
      <a class="sidebar__link" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7 L20 7 M4 17 L20 17 M9 4.5 L9 9.5 M15 14.5 L15 19.5"/></svg><span class="sidebar__label">설정</span></a>
    </nav>
  </div>
  <div class="sidebar__section">
    <div class="sidebar__folder"><span class="tape tape--label">최근 보드</span></div>
    <ul class="sidebar__nav" aria-label="최근 보드">
      <li class="sidebar__board"><a class="sidebar__link" href="kanban.html"><span class="sidebar__thumb " aria-hidden="true"></span><span class="sidebar__label"><span class="sidebar__board-id">BRD-0415</span><span class="sidebar__board-name">스프린트 24 회고</span></span><span class="sidebar__count">34</span></a></li>
      <li class="sidebar__board"><a class="sidebar__link" href="inbox.html"><span class="sidebar__thumb sidebar__thumb--b" aria-hidden="true"></span><span class="sidebar__label"><span class="sidebar__board-id">BRD-0412</span><span class="sidebar__board-name">픽업 주문 플로우 v3</span></span><span class="sidebar__count">86</span></a></li>
      <li class="sidebar__board"><a class="sidebar__link" href="dashboard.html#boards"><span class="sidebar__thumb sidebar__thumb--c" aria-hidden="true"></span><span class="sidebar__label"><span class="sidebar__board-id">BRD-0409</span><span class="sidebar__board-name">사장님 앱 정산 화면</span></span><span class="sidebar__count">57</span></a></li>
      <li class="sidebar__board"><a class="sidebar__link" href="profile.html#boards"><span class="sidebar__thumb " aria-hidden="true"></span><span class="sidebar__label"><span class="sidebar__board-id">BRD-0407</span><span class="sidebar__board-name">픽업 알림 푸시 와이어</span></span><span class="sidebar__count">42</span></a></li>
    </ul>
  </div>
  <div class="sidebar__foot">
    <p class="sidebar__plan"><strong>팀 플랜</strong> · 8명 · ₩79,200/월<br>다음 결제 11월 2일(월)</p>
    <button class="btn btn--icon btn--s btn--ghost sidebar__collapse" type="button" data-sidebar-collapse aria-label="사이드바 접기"><span class="glyph glyph--arrow-l" aria-hidden="true"></span></button>
  </div>
</aside>
```
- 현재 화면 링크 **하나에만** `aria-current="page"`를 단다. 위 스니펫은 dashboard 기준이다. kanban은 "스프린트 24 보드", inbox는 "코멘트함", product는 "템플릿", pricing은 "요금제", settings는 "설정"에 단다. profile·onboarding·404는 아무 데도 달지 않는다(navbar 아바타가 profile로 간다).
- 최근 보드 링크 대상: BRD-0415 → kanban.html, BRD-0412 → inbox.html(원본 보드 미리보기), BRD-0409 → `dashboard.html#boards`, BRD-0407 → `profile.html#boards`. 그래서 dashboard와 profile의 보드 묶음에는 `id="boards"`가 있어야 한다.
- 접기(72px)는 `data-sidebar-collapse`가 처리하고 localStorage `kkeujeok-sidebar`에 남는다. ≤1024에서는 ☰로 여는 오프캔버스가 된다(Esc·바깥 클릭으로 닫힘, 포커스 트랩).

### 3-3. 바닥글 — pages/*.html

```html
<footer class="site-foot">
  <div class="site-foot__row">
    <a class="brand site-foot__brand" href="../index.html" aria-label="끄적 UI 킷 보드"><span class="brand__first">끄</span>적</a>
    <p class="site-foot__info"><span>끄적랩 주식회사</span><span>서울특별시 성동구 성수이로 113, 4층</span><span>고객센터 평일 10:00–18:00 (점심 12:30–13:30)</span><span>help@kkeujeok.kr</span></p>
    <span class="memo memo--s memo--soft site-foot__memo">10/14 수 · 스프린트 24</span>
  </div>
  <nav class="site-foot__links" aria-label="모든 화면">
    <a href="../index.html">UI 킷 보드</a>
    <a href="dashboard.html">워크스페이스 홈</a>
    <a href="kanban.html">스프린트 보드</a>
    <a href="inbox.html">코멘트함</a>
    <a href="onboarding.html">시작하기</a>
    <a href="pricing.html">요금제</a>
    <a href="product.html">템플릿</a>
    <a href="profile.html">프로필</a>
    <a href="settings.html">설정</a>
    <a href="404.html">지워진 보드</a>
  </nav>
</footer>
```
현재 화면 링크에 `aria-current="page"`를 단다(빨간 글씨가 된다).

### 3-3'. 바닥글 — index.html (경로만 다르다)

```html
<footer class="site-foot">
  <div class="site-foot__row">
    <a class="brand site-foot__brand" href="index.html" aria-label="끄적 UI 킷 보드"><span class="brand__first">끄</span>적</a>
    <p class="site-foot__info"><span>끄적랩 주식회사</span><span>서울특별시 성동구 성수이로 113, 4층</span><span>고객센터 평일 10:00–18:00 (점심 12:30–13:30)</span><span>help@kkeujeok.kr</span></p>
    <span class="memo memo--s memo--soft site-foot__memo">10/14 수 · 스프린트 24</span>
  </div>
  <nav class="site-foot__links" aria-label="모든 화면">
    <a href="index.html">UI 킷 보드</a>
    <a href="pages/dashboard.html">워크스페이스 홈</a>
    <a href="pages/kanban.html">스프린트 보드</a>
    <a href="pages/inbox.html">코멘트함</a>
    <a href="pages/onboarding.html">시작하기</a>
    <a href="pages/pricing.html">요금제</a>
    <a href="pages/product.html">템플릿</a>
    <a href="pages/profile.html">프로필</a>
    <a href="pages/settings.html">설정</a>
    <a href="pages/404.html">지워진 보드</a>
  </nav>
</footer>
```

### 3-4. 커맨드 팔레트 (⌘K) — pages/*.html

```html
<div class="command" id="command" role="dialog" aria-modal="true" aria-label="보드·카드·명령 찾기" hidden>
  <div class="command__paper">
    <div class="command__search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4 C14.5 4 17 6.8 17 10.5 C17 14.3 14.2 17 10.5 17 C6.6 17 4 14.2 4 10.4 C4 6.7 6.8 4 10.5 4 Z M15.5 15.5 L20.5 20.5"/></svg><input class="command__input" type="text" placeholder="보드, 카드, 명령 찾기" aria-label="찾을 말"><span class="kbd">Esc</span></div>
    <div class="command__list">
      <div class="command__group" role="group" aria-label="보드">
        <span class="command__group-label" aria-hidden="true">보드</span>
        <a class="command__option" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg><span class="command__label">스프린트 24 회고</span><span class="command__id">BRD-0415</span></a>
        <a class="command__option" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg><span class="command__label">픽업 주문 플로우 v3</span><span class="command__id">BRD-0412</span></a>
        <a class="command__option" href="profile.html#boards"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4 L19.5 4.5 L19.5 14 L14 19.5 L4 19.5 Z M14 19.5 L14.2 14.2 L19.5 14"/></svg><span class="command__label">픽업 알림 푸시 와이어</span><span class="command__id">BRD-0407</span></a>
      </div>
      <div class="command__group" role="group" aria-label="카드">
        <span class="command__group-label" aria-hidden="true">카드</span>
        <a class="command__option" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6 C9 5.5 14 5.5 19 6 M12 6 L12 19.5 M9 19.5 L15 19.5"/></svg><span class="command__label">픽업 시간 선택 휠</span><span class="command__id">MRK-218</span></a>
      </div>
      <div class="command__group" role="group" aria-label="명령">
        <span class="command__group-label" aria-hidden="true">명령</span>
        <div class="command__option" data-toast="BRD-0415에 노란 포스트잇을 붙였어요" data-toast-tone="success" data-keywords="new postit"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 C12.2 10 11.8 14 12 19 M5 12 C10 11.8 14 12.2 19 12"/></svg><span class="command__label">새 포스트잇 붙이기</span><span class="command__hint"><span class="kbd">N</span></span></div>
        <div class="command__option" data-theme-toggle data-keywords="dark light 테마 다크"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5 C18 15.3 16.5 15.6 15 15.5 C11 15.2 8.5 12 8.6 8.2 C8.7 6.8 9.1 5.4 9.8 4.3 C6.3 5.3 3.8 8.5 4 12.3 C4.3 16.8 8.1 20.2 12.5 20 C15.6 19.8 18.3 17.6 19.5 14.5 Z"/></svg><span class="command__label">낮/밤 보드 바꾸기</span></div>
        <a class="command__option" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7 L20 7 M4 17 L20 17 M9 4.5 L9 9.5 M15 14.5 L15 19.5"/></svg><span class="command__label">설정 열기</span></a>
      </div>
      <div class="command__empty" hidden><p class="memo memo--s">"<span data-command-query></span>" 은(는) 보드에 없어요</p></div>
    </div>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 열기</span><span><span class="kbd">Esc</span> 닫기</span></div>
  </div>
</div>
```
index.html은 `href="pages/kanban.html"`처럼 앞에 `pages/`를 붙인다. 화면마다 옵션을 늘리지 않는다. ⌘K / Ctrl+K, `[data-command-open]`로 열고 Esc로 닫는다. 입력하면 걸러지고 ↑↓ Home End로 고르며 ↵로 연다(`aria-activedescendant`). `data-keywords`는 숨은 검색어다.

### 3-5. index 떠 있는 도구막대 (Excalidraw식 알약)

```html
<nav class="toolbar" aria-label="보드 이동">
  <a class="brand toolbar__brand" href="#top" aria-label="끄적 UI 킷 맨 위로"><span class="brand__first">끄</span>적</a>
  <span class="toolbar__sep" aria-hidden="true"></span>
  <div class="toolbar__links">
    <a class="toolbar__link" href="#board-color"><span class="toolbar__no" aria-hidden="true">①</span>마커</a>
    <a class="toolbar__link" href="#board-type"><span class="toolbar__no" aria-hidden="true">②</span>글씨</a>
    <a class="toolbar__link" href="#board-wire"><span class="toolbar__no" aria-hidden="true">③</span>와이어</a>
    <a class="toolbar__link" href="#board-open"><span class="toolbar__no" aria-hidden="true">④</span>펼친 상태</a>
    <a class="toolbar__link" href="#board-retro"><span class="toolbar__no" aria-hidden="true">⑤</span>회고 벽</a>
    <a class="toolbar__link" href="#board-states"><span class="toolbar__no" aria-hidden="true">⑥</span>상태 매트릭스</a>
    <a class="toolbar__link" href="#board-scenes"><span class="toolbar__no" aria-hidden="true">⑦</span>장면</a>
  </div>
  <span class="toolbar__sep" aria-hidden="true"></span>
  <button class="toolbar__k" type="button" data-command-open aria-label="보드·카드 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4 C14.5 4 17 6.8 17 10.5 C17 14.3 14.2 17 10.5 17 C6.6 17 4 14.2 4 10.4 C4 6.7 6.8 4 10.5 4 Z M15.5 15.5 L20.5 20.5"/></svg><span class="kbd" aria-hidden="true">⌘K</span></button>
  <button class="theme-toggle" type="button" data-theme-toggle><svg class="icon icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8 C14.3 8 16 9.8 16 12 C16 14.3 14.2 16 12 16 C9.7 16 8 14.2 8 12 C8 9.8 9.8 8 12 8 Z M12 2.5 L12 4.5 M12 19.5 L12 21.5 M2.5 12 L4.5 12 M19.5 12 L21.5 12 M5.2 5.2 L6.6 6.6 M17.4 17.4 L18.8 18.8 M5.2 18.8 L6.6 17.4 M17.4 6.6 L18.8 5.2"/></svg><svg class="icon icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5 C18 15.3 16.5 15.6 15 15.5 C11 15.2 8.5 12 8.6 8.2 C8.7 6.8 9.1 5.4 9.8 4.3 C6.3 5.3 3.8 8.5 4 12.3 C4.3 16.8 8.1 20.2 12.5 20 C15.6 19.8 18.3 17.6 19.5 14.5 Z"/></svg><span class="theme-toggle__label" data-theme-label>낮 보드</span></button>
</nav>
```
- index의 7개 보드 섹션 id는 위 `href`와 같아야 한다(`board-color` `board-type` `board-wire` `board-open` `board-retro` `board-states` `board-scenes`). 스크롤 위치에 따라 app.js가 해당 링크에 `aria-current`를 달고 빨간 동그라미를 그린다.
- 9개 페이지로 가는 길은 보드⑦과 바닥글이 맡는다.

---

## 4. 컴포넌트 32 (알파벳순)

### accordion — 회의록 줄노트
```html
<div class="accordion" data-accordion="single">           <!-- single: 하나만 열림(생략하면 여러 개) -->
  <div class="accordion__item">
    <h3><button class="accordion__trigger" type="button" aria-expanded="true" aria-controls="faq-1">
      <span class="accordion__label">픽업 시간은 30분 단위?</span><span class="accordion__meta">①</span></button></h3>
    <div class="accordion__panel" id="faq-1"><p>버튼 4개(6시 전 · 7시 전 · 8시 전 · 마감 전)로 가요.</p></div>
  </div>
</div>
```
`--compact`(48px 행). 열린 머리의 ▸는 빨강으로 90deg 돈다. 비활성은 `disabled`. 차트 아래 "데이터 표로 보기"도 이 컴포넌트로 접는다.

### alert — 보드에 붙인 포스트잇 알림
```html
<div class="alert alert--error" role="alert">
  <span class="alert__icon" aria-hidden="true">!</span>
  <div><strong class="alert__title">저장하지 못했어요</strong>
    <p class="alert__text">인터넷이 잠깐 끊겼어요. 포스트잇 3장은 이 기기에 남아 있어요.</p>
    <div class="alert__actions"><button class="btn btn--s" type="button">다시 저장</button></div></div>
  <button class="alert__close" type="button" aria-label="알림 떼기" data-dismiss><span class="glyph glyph--cross" aria-hidden="true"></span></button>
</div>
```
변형: `--info`(아이콘 `i`) `--warn`(`!`) `--error`(`!`, 빨간 고리) `--success`(아이콘 비움, 체크가 그려짐). `--flat`은 회전을 없앤다. `--wide`는 버튼을 오른쪽에 둔다. 정보·성공은 `role="status"`를 단다. `data-dismiss`는 떼기 모션 뒤 `hidden`이 된다.

### badge — 마커로 쓴 작은 라벨
```html
<span class="badge badge--ok">확정</span>        <!-- --ok --warn --danger --info --idle : 손그림 점 -->
<span class="badge badge--draft">초안</span>
<span class="badge badge--id">BRD-0412</span>
<span class="badge badge--count badge--blue">23</span>
<span class="badge badge--yellow">아이디어</span> <!-- --yellow --pink --mint --sky --blue --red --green -->
<span class="badge-new">새로</span>              <!-- "NEW" 대신 동그라미 친 손글씨 -->
<span class="badge badge--chip">와이어 중<button class="badge__x" type="button" aria-label="와이어 중 필터 빼기"><span class="glyph glyph--cross" aria-hidden="true"></span></button></span>
```

### breadcrumb
```html
<nav class="crumbs" aria-label="경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html">모락 프로덕트팀</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="kanban.html">스프린트 24</a></li>
  <li class="crumbs__item"><span class="crumbs__current" aria-current="page">픽업 주문 플로우 v3</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary" type="button"><svg class="icon" …/>포스트잇 붙이기</button>
<button class="btn" type="button">보드 공유</button>             <!-- secondary(기본) = 흰 종이 + 두 번 그은 윤곽 -->
<button class="btn btn--ghost" type="button">버전 기록</button>
<button class="btn btn--danger" type="button">보드 지우기</button>
<button class="btn btn--danger-line" type="button">워크스페이스 나가기</button>
<button class="btn btn--confirm" type="button">결정 확정</button>
<button class="btn btn--icon" type="button" aria-label="더 보기"><svg class="icon" …/></button>
<button class="btn" type="button" disabled>내보내기 (준비 중)</button>   <!-- 점선 = 아직 정해지지 않음 -->
<button class="btn btn--primary" type="button" aria-busy="true"><span class="btn__busy spinner" aria-hidden="true"></span>저장 중</button>
<a class="link-arrow" href="pricing.html">플랜 비교 <span class="glyph" aria-hidden="true"></span></a>
```
크기 `--s`(36, 터치 기기에서 44) / 기본 44 / `--l` 52, `--block`. 토글 버튼은 `aria-pressed`. `data-busy-demo="저장했어요"`를 달면 1.6초 동안 불러오기를 시연하고 토스트를 띄운다. 묶음은 `.btn-row`(`--end`).
빨강 면은 위험에만 쓴다. 꾸미려고 빨강 버튼을 쓰지 않는다.

### calendar — 손으로 그린 월간 격자
```html
<div class="cal" aria-label="2026년 10월">
  <div class="cal__head"><h2 class="cal__title">2026년 10월 <span class="memo">스프린트 24</span></h2>
    <button class="btn btn--icon btn--s btn--ghost" type="button" aria-label="9월"><span class="glyph glyph--arrow-l" aria-hidden="true"></span></button>
    <button class="btn btn--icon btn--s btn--ghost" type="button" aria-label="11월"><span class="glyph" aria-hidden="true"></span></button></div>
  <div class="cal__grid">
    <span class="cal__dow">일</span>…<span class="cal__dow">토</span>
    <span class="cal__day cal__day--muted cal__day--sun"><span class="cal__num">27</span></span>  <!-- 9/27–30 -->
    <button class="cal__day" type="button" aria-pressed="false"><span class="cal__num">1</span></button>   <!-- 10/1 = 목 -->
    <button class="cal__day" type="button" aria-pressed="false"><span class="cal__num">8</span><span class="cal__event cal__event--pink">디자인 리뷰날</span></button>
    <button class="cal__day" type="button" aria-current="date" aria-pressed="false"><span class="cal__num">14</span></button>
    …
  </div>
</div>
```
2026년 10월은 **1일이 목요일**이다(일요일 시작 격자에서 9/27–30 다음). 일요일 칸은 `cal__day--sun`, 쉬는 날은 `--off`(해칭), 미니 달력은 `.cal--mini`(+일정이 있는 칸에 `cal__day--has-event`). 클릭하면 `aria-pressed`가 하나만 켜지고, `.cal` 안의 `[data-cal-output]`에 `data-label`(없으면 숫자)이 들어간다. 일정 조각 `--pink --mint --blue`(기본 노랑). 모바일에서는 점으로 줄어든다.

### card — 와이어 프레임
```html
<a class="card card--link" href="kanban.html">
  <span class="card__thumb" aria-hidden="true"></span>
  <span class="card__body"><span class="card__eyebrow">BRD-0415</span><span class="card__title">스프린트 24 회고</span>
    <span class="card__meta"><span>포스트잇 34</span><span>12분 전</span></span></span>
</a>
<div class="card is-selected">…<div class="card__foot">…</div></div>
```
`.card-grid`(auto-fill 264px). 변형 `--draft`(점선) `--muted` `--row`(가로형). `__thumb--wire`는 안에 CSS로 로파이 레이아웃을 그릴 때, `__thumb--tall`은 3:4. 선택은 `aria-selected="true"` 또는 `.is-selected`(파랑 덧그림). `__title--hand`는 손글씨 제목(와이어 라벨). 이웃 카드의 모서리는 nth-child로 자동 순환한다.

### carousel — 스케치북 장 넘기기
```html
<div class="carousel" aria-label="TPL-031 와이어 화면">
  <div class="carousel__stage"><div class="carousel__rings" aria-hidden="true"></div>
    <div class="carousel__viewport"><div class="carousel__track">
      <div class="carousel__slide">…<p class="carousel__caption"><strong>01 반찬 목록</strong></p></div>
      …
    </div></div></div>
  <div class="carousel__controls">
    <button class="carousel__btn" type="button" data-carousel-prev aria-label="이전 장"><span class="glyph glyph--arrow-l" aria-hidden="true"></span></button>
    <div class="carousel__dots"></div>     <!-- 비워 두면 app.js가 점을 만든다 -->
    <button class="carousel__btn" type="button" data-carousel-next aria-label="다음 장"><span class="glyph" aria-hidden="true"></span></button>
    <span class="carousel__count"><span data-carousel-current>1</span><span class="soft"> / 48</span></span>
  </div>
</div>
```
←/→ 키와 스와이프로 넘긴다. 보이지 않는 장은 `inert`가 된다. 처음 장은 `.is-current`로 고를 수 있다.

### code — 테이프로 붙인 인쇄물
```html
<div class="code-wrap">
  <figure class="code">
    <div class="code__head"><span class="code__file">tokens.css</span>
      <button class="code__copy" type="button" data-copy="code-tokens"><svg class="icon icon--sm" …/><span data-copy-label>복사</span></button></div>
    <pre class="code__pre" id="code-tokens"><code><span class="code__line"><span class="tok-k">:root</span> {</span><span class="code__line code__line--mark">  <span class="tok-p">--marker-red</span>: <span class="tok-n">#D02B2B</span>;</span><span class="code__line">}</span></code></pre>
  </figure>
  <div class="code-wrap__memo" style="right:-40px; top:56px">…connector + memo-note…</div>
</div>
```
줄마다 `.code__line`(줄번호 자동). 토큰 색은 `.tok-k` 키워드, `.tok-s` 문자열, `.tok-n` 숫자, `.tok-p` 속성, `.tok-c` 주석. `--flat`은 회전을 없앤다. 본문 속 짧은 코드는 `.code-inline`.

### command — 3-4 참고
정적 견본(index 보드④)은 바깥 `.command` 없이 종이만 둔다.
```html
<div class="command__paper command__paper--static">
  <div class="command__search"><svg class="icon" …/><input class="command__input" type="text" value="픽업" aria-label="찾을 말"><span class="kbd">Esc</span></div>
  <div class="command__list" role="listbox" aria-label="찾은 것">
    <span class="command__group-label">보드</span>
    <div class="command__option" role="option" aria-selected="true">…<span class="command__label">픽업 주문 플로우 v3</span><span class="command__id">BRD-0412</span></div>
  </div>
</div>
<button class="btn" type="button" data-command-open>직접 열어 보기 <span class="kbd">⌘K</span></button>
```

### drawer — 찢은 가장자리의 긴 종이
```html
<div class="drawer" id="card-218" role="dialog" aria-modal="true" aria-labelledby="card-218-t" hidden>
  <div class="drawer__sheet">
    <div class="drawer__head"><h2 class="drawer__title" id="card-218-t">MRK-218 픽업 시간 선택 휠<span class="drawer__sub">와이어 중 · 담당 한서윤</span></h2>
      <button class="close-x drawer__close" type="button" data-close aria-label="닫기"></button></div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot"><button class="btn" type="button" data-close>닫기</button><button class="btn btn--primary" type="button">리뷰로 옮기기</button></div>
  </div>
</div>
<button class="btn" type="button" data-open="card-218">카드 열기</button>
```
`.drawer--left`는 왼쪽에서 나온다. 정적 견본은 `<div class="drawer__sheet drawer__sheet--static">`.

### empty — 지운 자국 위 빈 프레임
```html
<div class="empty">
  <div class="empty__frame"><svg class="connector connector--red empty__arrow" viewBox="0 0 92 70" aria-hidden="true" data-draw>
    <path pathLength="1" d="M88 8 C60 4 30 18 14 52"/><path pathLength="1" d="M6 40 C9 46 12 52 14 58 C20 54 26 51 32 50"/></svg></div>
  <div class="empty__body"><span class="memo memo--s empty__memo">여기에 첫 포스트잇을 붙여 보세요</span>
    <h3 class="empty__title">보관함이 비었어요</h3><p class="empty__text">지운 보드는 30일 동안 여기에 남아요.</p>
    <button class="btn btn--primary" type="button">새 보드</button></div>
</div>
```
`--compact`(프레임 없이, 칸반 칸·리스트 안). 버튼은 하나만 둔다.

### form
```html
<form class="form" data-validate data-success="알림 설정을 저장했어요" data-error-toast="빨간 동그라미 친 칸을 고쳐 주세요">
  <div class="field">
    <label class="field__label" for="email">알림 받을 이메일 <span class="req" aria-hidden="true">*</span></label>
    <span class="field__box"><input class="field__input" id="email" type="email" required aria-describedby="email-hint" data-msg-type="이메일 형식이 아니에요"></span>
    <span class="field__hint" id="email-hint">회의 알림이 여기로 가요</span>
    <span class="field__error"></span>
  </div>
  <div class="form-row">…두 칸…</div>
  <div class="field"><label class="field__label" for="role">역할</label>
    <span class="field__box"><select class="field__input" id="role">…</select><span class="field__caret glyph glyph--caret" aria-hidden="true"></span></span></div>
  <div class="field"><label class="field__label" for="bio">한 줄 소개 <span class="opt">선택</span></label>
    <span class="field__box field__box--area"><textarea class="field__input" id="bio"></textarea></span></div>
  <span class="field__box"><span class="field__affix">₩</span><input class="field__input" …><span class="field__affix field__affix--end">/ 월</span></span>
  <div class="choice-list"><label class="check"><input class="check__box" type="checkbox" checked> 코멘트 멘션 알림</label></div>
  <div class="choice-list choice-list--row" role="radiogroup" aria-label="보드 기본 색"><label class="radio"><input class="radio__dot" type="radio" name="color" checked> 노랑</label>…</div>
  <button class="switch" type="button" role="switch" aria-checked="true"><span class="switch__track" aria-hidden="true"></span>밤 11시 이후 알림 끄기 <span class="switch__state">켜짐</span></button>
  <div class="seg" data-mode-target="#plans"><label class="seg__opt"><input type="radio" name="bill" value="month" checked><span>월간</span></label><label class="seg__opt"><input type="radio" name="bill" value="year"><span>연간 · 2개월 무료</span></label></div>
  <div class="form-actions"><button class="btn btn--primary" type="submit">저장</button></div>
</form>
```
- 에러: `aria-invalid="true"`(또는 `.field--error`)이면 상자에 빨간 동그라미가 그려지고, `.field__error`가 화살표 + 손글씨로 나타나며 상자가 흔들린다. 정적 견본은 `aria-invalid="true"`와 `.field__error` 문구를 직접 쓴다.
- `data-validate`: 제출할 때 required / email / minlength / pattern을 검사한다. 메시지는 `data-msg-required` `data-msg-type` `data-msg-short`. 통과하면 제출 버튼이 0.9초 busy → 성공 토스트(`data-success-title` `data-success`).
- 비활성은 점선 상자, 읽기 전용은 눌린 면. 성공은 `.field--ok` + `<span class="field__ok">`.
- `.seg[data-mode-target]`: 고른 값이 대상의 `data-mode`로 들어간다(pricing 월/연간). 장면 CSS가 `[data-mode="year"]`로 가격을 바꾼다.
- `.check__text--strike`: 체크하면 마커로 그어 지운다(할 일 목록).

### kanban — 테이프 이름표 칸 + 포스트잇 카드
```html
<div class="kanban">
  <section class="kanban__col" aria-label="와이어 중" data-wip="6">
    <div class="kanban__head"><h2 class="tape tape--label kanban__name">와이어 중</h2><span class="kanban__count">7/6</span><span class="kanban__wip">한도 6</span></div>
    <p class="memo-note kanban__over-memo">한도 넘었어요!</p>
    <div class="kanban__list">
      <article class="kanban__card" id="mrk-218" aria-labelledby="mrk-218-t">
        <div class="kanban__card-top"><span class="kanban__id">MRK-218</span>
          <div class="menu-wrap"><button class="kanban__grip" type="button" data-menu="mrk-218-m" aria-label="MRK-218 옮기기 메뉴"><svg class="icon" …more…/></button>
            <div class="menu menu--end" id="mrk-218-m" hidden>
              <button class="menu__item" type="button" data-kanban-move="next">다음 칸으로 옮기기</button>
              <button class="menu__item" type="button" data-kanban-move="prev">이전 칸으로 옮기기</button>
              <hr class="menu__sep"><button class="menu__item menu__item--danger" type="button">포스트잇 떼기</button></div></div></div>
        <h3 class="kanban__title" id="mrk-218-t">픽업 시간 선택 휠</h3>
        <div class="kanban__meta"><span class="avatar avatar--s avatar--pink" aria-hidden="true">서윤</span><span><svg class="icon" …clock…/>10/16</span></div>
      </article>
      <button class="kanban__add" type="button"><svg class="icon icon--sm" …plus…/> 포스트잇 붙이기</button>
    </div>
  </section>
  …
</div>
```
- 카드 색 = 유형: 기본 노랑(아이디어·작업), `--pink`(질문·이슈), `--mint`(확정), `--blue`(참고). 완료는 `--done`, 늦음은 `.kanban__due--late`.
- `data-wip`가 있으면 app.js가 `.kanban__count`를 `n/한도`로 쓰고, 넘으면 `data-over="true"`(빨간 동그라미 + 메모)가 된다.
- 드래그 중 = 떼기(`.is-dragging`), 놓으면 붙이기. 정적으로 "들린" 카드는 `.kanban__card--lifted`. 키보드는 카드에 포커스를 두고 Alt+←/→를 누르거나 메뉴의 `data-kanban-move`를 쓴다(화면 낭독기에 알림).

### list — 줄노트 리스트
```html
<ul class="list" data-selectable>
  <li class="list__item list__item--unread"><button class="list__link" type="button">
    <span class="list__unread" aria-hidden="true"></span><span class="avatar avatar--s avatar--yellow" aria-hidden="true">도현</span>
    <span class="list__main"><span class="list__title">① 픽업 시간 휠은 30분 단위로?</span><span class="list__sub">박도현 · BRD-0412 · 12분 전</span></span>
    <span class="list__trail"><span class="badge badge--danger">미해결</span></span></button></li>
  <li class="list__item"><a class="list__link" href="kanban.html" aria-current="true">…</a></li>
  <li class="list__item list__item--done">…</li>
</ul>
```
`--plain`(위아래 굵은 선 없음) `--dense`(44px) `--numbered`(손글씨 번호). 선택(형광펜)은 `aria-current="true"`인 링크, `aria-selected="true"`, `.is-selected` 중 하나로 준다. `data-selectable` 안의 `button.list__link`는 클릭하면 하나만 선택되고 안 읽음 표시가 빠진다. `.list__title--clamp` `.list__sub--clamp`(2줄).

### marquee — 테이프 띠 위 손글씨 공지 (화면에 1곳만)
```html
<div class="marquee"><div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
  <span class="marquee__item"><strong>10/15(목) 오후 2시</strong> 기획 리뷰 — 망원 회의실</span>
  <span class="marquee__item">스프린트 24 회고는 10/23(금) 오후 4시</span>
  <span class="marquee__item">모락 앱 v2.3 출시 10/29(목)</span>
</div></div></div>
<button class="marquee__toggle" type="button" data-marquee-toggle><svg class="icon icon--pause" …pause…/><svg class="icon icon--play" …play…/></button></div>
```
그룹은 하나만 쓴다. 이음매용 복제는 app.js가 만든다. hover·포커스·정지 버튼으로 멈추고, reduced-motion이면 흐르지 않는다.

### menu — 포스트잇 크기 종이 드롭다운
```html
<div class="menu-wrap">
  <button class="btn" type="button" data-menu="board-menu">보드 메뉴 <span class="glyph glyph--caret" aria-hidden="true"></span></button>
  <div class="menu" id="board-menu" hidden>
    <span class="menu__label">BRD-0412</span>
    <button class="menu__item" type="button"><svg class="icon" …/>이름 바꾸기 <span class="menu__kbd">F2</span></button>
    <button class="menu__item" type="button" role="menuitemcheckbox" aria-checked="true">변경 알림 받기</button>
    <button class="menu__item" type="button" aria-disabled="true">템플릿으로 저장</button>
    <hr class="menu__sep">
    <button class="menu__item menu__item--danger" type="button">보드 지우기</button>
  </div>
</div>
```
`--end`(오른쪽 맞춤, 화면 밖으로 나가면 자동) `--up`. ↑↓ Home End로 움직이고 Esc를 누르면 트리거로 돌아간다. 정적 견본은 `<div class="menu menu--static" role="menu" aria-label="…">`. `menuitemradio`는 하나만 체크된다. `data-keep-open`이면 눌러도 닫히지 않는다.

### modal — 보드에 대는 종이 한 장
```html
<div class="modal" id="delete-board" role="dialog" aria-modal="true" aria-labelledby="delete-board-t" hidden>
  <div class="modal__paper">
    <div class="modal__head"><h2 class="modal__title" id="delete-board-t">BRD-0395를 지울까요?</h2>
      <button class="close-x modal__close" type="button" data-close aria-label="닫기"></button></div>
    <div class="modal__body"><p>결제 실패 예외 플로우 보드의 포스트잇 29장과 코멘트 11건이 함께 지워져요.</p><p class="soft">30일 동안 보관함에서 되살릴 수 있어요.</p></div>
    <div class="modal__actions"><button class="btn" type="button" data-close>그대로 두기</button><button class="btn btn--danger" type="button" data-close data-toast="BRD-0395를 보관함으로 옮겼어요">보드 지우기</button></div>
  </div>
</div>
<button class="btn btn--danger-line" type="button" data-open="delete-board">보드 지우기</button>
```
정적 견본은 `<div class="modal__paper modal__paper--static" role="dialog" aria-labelledby="…">`. 열면 첫 포커스가 `[autofocus]`나 `[data-initial-focus]`, 없으면 첫 버튼으로 간다. 닫으면 트리거로 돌아온다. `.modal--danger`는 제목이 빨강이다. 모바일에서는 아래에서 올라오고 버튼이 세로로 쌓인다.

### motion — 모션 문법 견본
```html
<div class="motion-board ds ds--sheet">   <!-- 한 장의 종이 위 가로 띠(콘티). 칸 폭은 내용만큼 -->
  <div class="motion-tile"><div class="motion-tile__stage"><svg class="mo-draw" viewBox="0 0 220 90" aria-hidden="true"><path pathLength="1" d="M40 20 C90 4 190 8 200 40 C208 70 140 86 90 84 C40 82 10 66 16 44 C20 26 60 12 140 14"/></svg></div>
    <p class="motion-tile__name">선 그리기</p><p class="motion-tile__spec">560ms · cubic-bezier(.6,.05,.3,1)</p>
    <div class="motion-tile__foot"><button class="replay" type="button" data-replay><svg class="icon" …replay…/>다시 재생</button></div></div>
  <div class="motion-tile">…<p class="mo-hl">결정: <span class="mark">버튼 4개로 간다</span></p>…형광펜 360ms</div>
  <div class="motion-tile">…<div class="postit mo-stick">붙였다!</div>…포스트잇 붙이기 280ms back.out(1.4)</div>
  <div class="motion-tile">…<button class="btn btn--primary" type="button">눌러 보기</button>…누르기 70ms linear</div>
  <div class="motion-tile">…<div class="field__box mo-jiggle">…</div>…흔들기 320ms</div>
  <div class="motion-tile">…<span class="spinner spinner--48"></span><div class="skel">…</div>…선 떨림 3프레임 8fps</div>
</div>
```
보드가 화면에 들어오면 한 번 재생한다. `data-replay`(값이 없으면 자기 타일, id를 주면 그 요소) 버튼으로 다시 재생한다. `.motion-spec`(dl)은 속도·이징 메모다.

### navbar — 3-1 참고. index는 3-5 도구막대.

### pagination
```html
<nav class="pager" aria-label="보드 목록 쪽"><ul class="pager__list">
  <li><a class="pager__step" href="dashboard.html" aria-disabled="true"><span class="glyph glyph--arrow-l" aria-hidden="true"></span><span class="pager__step-label">이전</span></a></li>
  <li><button class="pager__link" type="button" aria-current="page">1</button></li>
  <li><button class="pager__link" type="button">2</button></li>
  <li><button class="pager__link pager__link--far" type="button">3</button></li>   <!-- --far: 모바일에서 숨김 -->
  <li><span class="pager__gap" aria-hidden="true">…</span></li>
  <li><button class="pager__link" type="button">8</button></li>
  <li><a class="pager__step" href="dashboard.html"><span class="pager__step-label">다음</span><span class="glyph" aria-hidden="true"></span></a></li>
</ul><span class="pager__total">38개 · 한 쪽에 5개</span></nav>
```

### popover — 말풍선 종이 + 코멘트 핀
```html
<button class="pin" type="button" data-popover="pin-1" aria-label="코멘트 ① 박도현">1</button>
<div class="popover" id="pin-1" hidden>
  <div class="popover__head"><span class="avatar avatar--s avatar--yellow" aria-hidden="true">도현</span><span class="popover__who">박도현</span><span class="popover__when">12분 전</span></div>
  <p class="popover__body">휠보다 버튼 4개가 빠를 것 같아요.</p>
  <div class="popover__actions"><button class="btn btn--s" type="button">답글</button><button class="btn btn--s btn--confirm" type="button" data-popover-close>해결</button></div>
</div>
```
app.js가 트리거 위에(공간이 없으면 아래에) 띄우고 꼬리 위치를 맞춘다. 바깥 클릭이나 Esc로 닫힌다. 정적 견본은 `.popover--static`. 해결된 핀은 `.pin--resolved`(초록)다.

### progress
```html
<div class="progress">
  <div class="progress__row"><span class="progress__label">스프린트 24</span><span class="progress__value">46%</span></div>
  <div class="progress__track" role="progressbar" aria-valuenow="46" aria-valuemin="0" aria-valuemax="100" aria-label="스프린트 24 진행률"><span class="progress__fill" style="--val:46%"></span></div>
</div>
<span class="progress-ring" style="--val-num:46" role="img" aria-label="스프린트 24 진행률 46%"><svg viewBox="0 0 120 120" aria-hidden="true">
  <path class="progress-ring__base" d="M61 8 C90 8 112 30 112 60 C112 90 90 112 60 112 C30 112 8 89 9 59 C10 30 32 8 63 10"/>
  <path class="progress-ring__arc" pathLength="100" d="M60 9 C89 9 111 31 111 60 C111 89 89 111 60 111 C31 111 9 89 9 60 C9 31 31 9 60 9"/></svg>
  <span class="progress-ring__value">62<small>%</small></span></span>
```
변형 `--green` `--red` `--solid` `--s` `--indeterminate`. 링은 `--green` `--red`, 크기는 `style="--ring-size:160px"`. 포스트잇 안에 넣으면 검정 잉크 게이지가 된다.

### sidebar — 3-2 참고

### skeleton — 연필 음영
```html
<div class="skel__row"><span class="skel__circle"></span>
  <div class="skel"><span class="skel__line skel__line--title"></span><span class="skel__line" style="--w:90%"></span><span class="skel__line" style="--w:70%"></span></div></div>
<span class="skel__box" style="--ratio:4/3"></span>
```
감싸는 영역에 `aria-busy="true"`와 `<span class="sr-only">불러오는 중</span>`을 둔다.

### spinner
```html
<span class="spinner" role="status" aria-label="불러오는 중"></span>   <!-- --20 --48, --blue --red -->
<span class="spinner-wrap"><span class="spinner" aria-hidden="true"></span>보드 불러오는 중</span>
```

### steps — 점 격자 위의 손그림 길
```html
<ol class="steps">
  <li class="steps__item steps__item--done"><span class="steps__mark">1</span><span class="steps__text"><span class="steps__title">템플릿 고르기</span><span class="steps__sub">TPL-031</span></span></li>
  <li class="steps__item steps__item--current" aria-current="step"><span class="steps__mark">2</span><span class="steps__text"><span class="steps__title">팀 초대</span><span class="steps__sub">지금 여기</span></span></li>
  <li class="steps__item steps__item--todo"><span class="steps__mark">3</span><span class="steps__text"><span class="steps__title">첫 포스트잇 붙이기</span></span></li>
</ol>
```
`--error`는 막힌 단계다. `.steps--vertical`은 세로형이다. ≤640에서는 자동으로 세로가 되는데, 가로를 유지하려면 `.steps--keep`을 준다.

### table — 손으로 그은 표
```html
<div class="table-frame"><div class="table-scroll">
  <table class="table">
    <caption class="sr-only">모락 워크스페이스 보드 8개</caption>
    <thead><tr>
      <th scope="col" aria-sort="none"><button class="table__sort" type="button">보드</button></th>
      <th scope="col">담당</th>
      <th scope="col" class="num" aria-sort="descending"><button class="table__sort" type="button">포스트잇</button></th>
      <th scope="col">최근 수정</th><th scope="col">상태</th></tr></thead>
    <tbody>
      <tr><td><a href="kanban.html">스프린트 24 회고</a> <span class="mono soft">BRD-0415</span></td><td>박도현</td><td class="num">34</td><td class="soft">12분 전</td><td><span class="badge badge--info">진행</span></td></tr>
      <tr aria-selected="true">…</tr>
    </tbody>
  </table></div>
  <div class="table-foot"><span>보드 38개 중 8개</span><span class="mono">1,284장</span></div>
</div>
```
숫자 칸은 `.num`(모노, 오른쪽 정렬)이다. 정렬 버튼은 표시 텍스트를 숫자로 읽는다(₩·쉼표·%·장·건·명·개는 무시). 다르게 정렬하려면 `td`에 `data-value`를 준다. 행 선택 체크는 `<td class="table__check"><input class="check__box" type="checkbox" aria-label="…"></td>`(체크하면 행이 `aria-selected`). 빈 표는 `<tr class="table__empty"><td colspan="5">…empty--compact…</td></tr>`. 모바일은 최소 폭 560px로 가로 스크롤하고 오른쪽이 페이드된다(`.table--fit`은 풀기). `--dense`도 있다.

### tabs — 동그라미로 고르기
```html
<div class="tabs tabs--ruled">
  <div class="tabs__bar"><div class="tabs__list" role="tablist" aria-label="코멘트 보기">
    <button class="tabs__tab" role="tab" type="button" aria-selected="true" aria-controls="tab-open">미해결 <span class="badge badge--count">23</span></button>
    <button class="tabs__tab" role="tab" type="button" aria-selected="false" aria-controls="tab-done">해결됨</button>
    <button class="tabs__tab" role="tab" type="button" aria-selected="false" aria-controls="tab-arch" aria-disabled="true">보관함</button>
  </div></div>
  <div class="tabs__panel" id="tab-open">…</div><div class="tabs__panel" id="tab-done">…</div><div class="tabs__panel" id="tab-arch">…</div>
</div>
```
←/→ Home End로 움직인다. 넘치면 가로 스크롤 + 페이드가 생긴다. `--ruled`는 아래 마커선, `--s`는 작은 탭이다.

### timeline — 세로 마커선 + 날짜 메모 + 포스트잇 조각
```html
<ol class="timeline">
  <li class="timeline__item timeline__item--key"><span class="timeline__date">10/8 목</span>
    <div class="timeline__body"><div class="timeline__note timeline__note--pink"><p class="timeline__title">디자인 리뷰날!</p><p class="timeline__text">포스트잇 212장, 하루 최고</p></div></div></li>
  <li class="timeline__item"><span class="timeline__date">10/12 월</span><div class="timeline__body"><div class="timeline__note"><p class="timeline__title">스프린트 24 시작</p><p class="timeline__meta">카드 24장</p></div></div></li>
  <li class="timeline__item timeline__item--todo"><span class="timeline__date">10/15 목</span><div class="timeline__body"><p class="timeline__title">기획 리뷰</p><p class="timeline__text soft">오후 2:00–3:00 · 망원 회의실</p></div></li>
</ol>
```
`--key`는 빨간 동그라미이고 화면에 하나만 둔다. `--todo`는 아직 오지 않은 일(점선 점)이다. 조각 색은 `--pink --mint --blue`(기본 노랑)이고, 조각 없이 글만 둘 수도 있다.

### toast — 포스트잇이 붙는다
```js
window.kkToast({ title: '붙였어요', text: 'BRD-0412에 포스트잇을 붙였어요', tone: 'success' });   // tone: default | success | info | error
```
```html
<button class="btn" type="button" data-toast="BRD-0412에 포스트잇을 붙였어요" data-toast-title="붙였어요" data-toast-tone="success">붙이기</button>
<!-- 정적 견본 -->
<div class="toast toast--static toast--success" role="status"><p class="toast__title">결정 3건 확정</p><p class="toast__text">10/15 기획 리뷰 안건으로 옮겼어요.</p><button class="toast__close" type="button" aria-label="알림 떼기"></button></div>
```
4초 뒤 떨어진다(실패는 6초, 흔들기). hover하면 멈추고, 한 번에 3장까지 쌓인다. 컨테이너 `.toast-stack`(aria-live)은 app.js가 만든다.

### tooltip — 연필 회색 메모 종이
```html
<button class="btn btn--icon" type="button" aria-label="펜" data-tip="펜" data-tip-kbd="P"><svg class="icon" …pen…/></button>
<span class="tooltip tooltip--static">포스트잇 <span class="kbd">N</span></span>   <!-- 정적 견본 -->
```
400ms 뒤에 뜬다(포커스에도 뜬다). 위가 기본이고 공간이 없으면 아래로 간다. Esc로 닫힌다. `aria-describedby`는 app.js가 붙인다.

---

### chart (공용 — base.css)
dashboard 와 index 보드⑤ 가 **같은 마크업**을 쓴다(`<div class="chart" data-draw>` … `.chart__plot` · `.chart__grid` · `.chart__area` · `.chart__ink` · `.chart__pt` · `.chart__ring` · `.chart__memo` · `.chart__x` · `.chart__unit`). 3px `--marker-blue` 선, 해칭 면, 0 기준선, 오늘 점, 10/8 빨간 동그라미 + 피크 왼쪽 메모. 폭은 유동(min-width 금지) — `container-type: inline-size` 로 520px 아래에서 x축을 격일로 줄인다. 데이터 표 아코디언을 바로 아래에 둔다. 마크업 원본은 pages/dashboard.html.

### 주의 메모 (장면 작업자 공통)
- `.circled::after` inset 은 em 단위다. 큰 메모 글씨를 감쌀 때는 바깥 래퍼가 아니라 `.memo` 요소에 직접 단다.
- 표 `<caption>` 의 display 를 바꾸지 말 것(flex 로 바꾸면 thead 아래로 떨어진다). 보이는 머리줄이 필요하면 caption 은 sr-only 로 두고 표 바깥에 쓴다.
- 동그라미 고리는 글자를 가로지르면 안 된다: 두 줄 이상 블록에는 글자 없는 그림(썸네일·핀·숫자)에 친다. 입력창 에러는 테두리 바깥 4–6px 의 손그림 고리(form.css).
- 아바타: 겹치지 않는 단독 32px 원 = 두 글자 12px, 28px 원·겹친 줄(`.avatar-stack`) = 이름 끝 한 글자(겹침 -8px, 원마다 바탕색 2px 링). 색은 DIRECTION 팩트 시트의 인물별 색을 따른다.

## 5. app.js 훅 요약

| 속성 / API | 동작 |
|---|---|
| `[data-theme-toggle]` + `[data-theme-label]` | 낮/밤 보드. `?theme=` > localStorage `kkeujeok-theme` > 시스템. 라벨 "낮 보드/밤 보드" |
| `[data-open="id"]` / `[data-close]` | 모달·드로어·커맨드 열기/닫기. 포커스 트랩, Esc, 백드롭 클릭, 포커스 복귀, 스크롤 잠금 |
| ⌘K · Ctrl+K · `[data-command-open]` | `#command`(없으면 첫 `.command`) |
| `[data-menu="id"]` · `[data-popover="id"]` · `[data-popover-close]` | 메뉴 · 팝오버 |
| `[data-tip]` `[data-tip-kbd]` | 툴팁 |
| `role="tablist"` / `.accordion__trigger` | 탭 / 아코디언 (`data-accordion="single"`) |
| `[data-toast]` `[data-toast-title]` `[data-toast-tone]` · `window.kkToast()` | 토스트 |
| `[data-dismiss]` / `[data-dismiss="id"]` | 알림 떼기 |
| `.carousel` `[data-carousel-prev/next]` `[data-carousel-current]` | 캐러셀 |
| `.kanban` · `[data-kanban-move="next/prev"]` · `data-wip` | 칸반 드래그, 키보드 이동, 카운트·WIP |
| `form[data-validate]` · `data-msg-*` · `data-success*` · `data-error-toast` | 폼 검증 |
| `[data-busy-demo]` | 버튼 불러오기 시연 |
| `role="switch"` · `.switch__state` `data-on` `data-off` | 토글 |
| `[data-mode-target="selector"]` | 고른 radio 값을 대상의 `data-mode`로 넣는다 |
| `[data-tool-group]` | 안의 `aria-pressed` 버튼 중 하나만 눌림 |
| `.table__sort` · `.table tbody .check__box` | 표 정렬 · 행 선택 |
| `button.cal__day` · `[data-cal-output]` / `button.pager__link` / `[data-selectable] button.list__link` | 달력 · 페이지 · 리스트 선택 |
| `[data-draw]` | 화면에 들어오면 선 그리기·형광펜 1회 |
| `.motion-board` · `[data-replay]` | 모션 견본 재생 |
| `[data-copy="id"]` + `[data-copy-label]` | 코드 복사 |
| `[data-marquee-toggle]` | 공지 띠 멈춤 |
| `[data-sidebar-toggle]` · `[data-sidebar-collapse]` | 사이드바 오프캔버스 · 접기 |
| `.toolbar__link[href^="#"]` | index 도구막대 현재 보드 표시 |

---

## 6. 쓰지 말 것

- 랜딩 공식(eyebrow → 거대 헤드라인 → CTA 2개 → 칩), 가운데 정렬 섹션 헤더, 통계 4개 가로줄, 컴포넌트를 둥근 카드에 하나씩 담는 진열장.
- "§ 번호", 판권 정의 목록, 왼쪽 고정 목차 사이드바(index). index에는 3-5 도구막대만 쓴다.
- 24px 미만의 Nanum Pen Script. 버튼·라벨·표·범례의 손글씨. 한글에 넓은 자간이나 모노 폰트.
- 크림 종이 배경, 초록 칠판, 흐린 radial 얼룩, 인디고·보라 그라디언트, 이모지 아이콘, 커피 얼룩·별·압정 장식.
- 빨강을 주석·위험 말고 다른 데 쓰는 것. 한 뷰포트에 정적 동그라미를 3개 넘게 두는 것.
- 정보 영역(표·폼·모달·입력)을 회전하는 것.
- 팩트 시트에 없는 이름·날짜·가격. 새 값이 필요하면 DIRECTION.md 팩트 시트에 먼저 추가한다.

## 2차 수정 메모 (리뷰 반영)
- 칸반 미니: `.kanban.kanban--mini` + 칸마다 `data-rest="N"`(보드에 남은 장 수). app.js 가 `카드 수 + data-rest` 로 칸 수와 WIP 초과(빨간 동그라미)를 계산한다. 목록 끝에 `<a class="kanban__more" href="pages/kanban.html">+N장 더 <span class="glyph" aria-hidden="true"></span> 스프린트 보드</a>`.
- 가로 스크롤 표: `.table-frame` 바로 위에 `<p class="table-hint" aria-hidden="true">← 옆으로 밀어 보기</p>`(≤640에서만 보임). ≤640 에서 `.table-scroll` 은 끝에 닿기 전까지 오른쪽 15% 페이드.
- 코멘트 핀 `.pin`: ≤640 또는 `(pointer: coarse)` 에서 버튼 상자 44×44, 보이는 원 32px 는 `::before` 로 그린다. 색은 `--pin-bg / --pin-fg`.
- 아바타 겹친 줄 `.avatar-stack`: 32px · 겹침 -8px · 바탕색 2px 링(`--avatar-ring`, 종이 위 `--sheet`, 포스트잇 위 `--postit-bg`) · 이름 끝 한 글자.
- 포스트잇·색 면 위 hover 는 `--hover-on-postit`, 포스트잇 위 얇은 면은 `--postit-wash`, 일정 조각 그림자는 `--shadow-edge`(semantic.css 낮/밤).

