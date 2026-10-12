# COMPONENTS — 모양학교 v2 마크업 계약

index.html · pages/*.html 담당 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값은 `DIRECTION.md`(특히 팩트 시트)에 있다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `disabled`)으로 표시한다. CSS가 그 속성을 읽는다.

**이 시스템의 문법 세 줄**
1. **칸딘스키 대응** — ○ 파랑 = 하나의 것·완결 / □ 빨강 = 구조·멈춤·경고 / △ 노랑 = 방향·움직임·주의. 짝은 절대 바꾸지 않는다(노랑 사각·파랑 삼각 금지).
2. **막대와 축** — 굵기는 16px 막대 · 6px 표시 막대 · 2px 구조선 · 1px 작도선뿐. 활성 = 6px 막대. 회전 활자는 90°만.
3. **0 아니면 원** — 반경은 0 또는 50%. 그림자·그라디언트·blur·중간 반경 없음. hover는 0ms 색 반전.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>모양학교 — 교무 6주차 판</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('moyang-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600;700;800;900&family=Do+Hyeon&family=Gothic+A1:wght@400;500;700;800&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">…</header>               <!-- 셸 A (5절) -->
<main id="main">…</main>
<div class="marquee">…</div>                  <!-- 셸 B: 바닥글 바로 위 -->
<footer class="site-foot">…</footer>          <!-- 셸 B -->
<!-- 오버레이: 셸 C(드로어 #site-menu + 커맨드 #command) + 장면 전용 모달 -->
<script src="app.js"></script>                <!-- pages: ../app.js -->
</body>
</html>
```

- `<title>` 형식: `모양학교 — <장면 이름>` (예: `모양학교 — 수료전 설치 보드`, index는 `모양학교 — 「점·선·면」 수료전 · 교본`).
- `localStorage` 키 `moyang-theme`. `?theme=dark|light`가 최우선(스크린샷 검증용).
- 화면 글자는 한국어. 예외: `MOYANG` 워드마크, `VORKURS 12` 같은 학교 고유 라틴 표기, ID(`MY12-07`, `WS-1017-04`, `MS-K27`), 코드.
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만**(2절) 쓴다. raw hex 금지, 인라인 `grid-template-columns` 금지. `style="--val:58%"`, `style="--x:10%;--y:20%;--w:40%"` 같은 **커스텀 속성 주입만** 허용.
- 날짜·수치·이름은 DIRECTION 팩트 시트 값만. 기준일 **2026년 10월 14일 (수) 15:20**, 로그인 사용자 **임소정(교무 매니저)**.

---

## 1. 레이아웃 문법 (base.css)

### 1-1. `.plate` — 구성판 (정사각 모듈 6단 · 4단 · 2단, 거터 0)
```html
<section class="plate" aria-labelledby="ch-circle">
  <div class="plate__grid">
    <div class="cell c-2 r-2 cell--blue cell--center">…</div>
    <div class="cell c-4">…</div>
    <div class="cell c-1 cell--yellow">…</div>
    <div class="cell c-3">…</div>
  </div>
</section>
```
- 열 수: ≥1200 **6단**, 768–1199 **4단**, <768 **2단**. 행 높이 하한 = 모듈(정사각). 내용이 많으면 행이 늘어난다.
- 블록끼리 **틈 없이 맞닿고** 경계는 2px 선 하나(outline 겹침 — 이중선 없음).
- 스팬: `c-1 … c-6`(열), `r-1 … r-4`(행). 자동 매핑 — 태블릿: `c-5/c-6 → 4`, `c-3 → 2` · 모바일: `c-1 → 1`, 나머지 전부 2, 행 스팬 해제.
  덮어쓰기: 태블릿 `tc-1…tc-4`, `tr-1…tr-3` · 모바일 `mc-1/mc-2`, `mr-1/mr-2`. 모바일 전용 숨김 `m-hide`, 데스크톱 숨김 `m-only`.
- **한 행의 스팬 합은 반드시 열 수와 같게**. 남는 칸은 원색 면 또는 도형 하나로 채운다(빈 종이 칸은 판당 1개까지). 모바일에서 `c-1`은 반드시 두 개씩 짝지어 놓는다.
- `.plate`는 container(레이아웃 격리)다. **안에 `position: fixed` 오버레이(실제 모달·드로어·커맨드)를 두지 말 것** — body 끝(셸 C 옆)에 둔다. 정적 견본(`--static`)은 괜찮다.
- `.plate__grid--dense`(자동 빈칸 메우기), `.plate__grid--free`(정사각 하한 해제 — 표·달력 판).
- 칸 수식: `cell--flush`(패딩 0) `cell--clip`(넘치는 큰 도형·활자 자르기) `cell--end` `cell--between` `cell--center`(**원 안의 글자에만** 가운데 정렬) `cell--surface` `cell--sunken` `cell--red` `cell--yellow` `cell--blue` `cell--solid`(낮=먹 면, 밤=raised 면 + 위 6px 분필 막대).
- 한 판에 원색 면은 **최대 2개**, 그중 하나는 판 면적의 1/6 이상. 작은 색 점 흩뿌리기 금지.
- 칸 안 블록 번호표: `<span class="ex-label"><span class="ex-label__no">07</span> 버튼</span>` (숫자만 모노).

### 1-2. `.spread` — 교본 펼침면 (왼쪽 2단 글 | 접지선 4px | 오른쪽 4단 도판)
```html
<section class="spread" id="gyobon" aria-labelledby="gb1">
  <div class="spread__page">… <span class="spread__folio">14</span></div>
  <div class="spread__page">… <span class="spread__folio">15</span></div>
</section>
```
쪽 번호는 각 쪽 아래 바깥 모서리. 태블릿 1:1, 모바일 세로로 쌓이고 접지선은 위 4px.

### 1-3. `.with-side` — 사이드바가 있는 교무 화면 (dashboard · inbox · kanban · settings)
```html
<div class="with-side">
  <aside class="scroll-host"> 셸 D 사이드바 </aside>
  <div class="with-side__main"> 장면 본문 </div>
</div>
```
1023px 이하에서 사이드바는 위쪽 가로 띠(스크롤 + 노랑 △ 힌트)로 접힌다.

### 1-4. `.page-head` — 페이지 머리 (왼쪽 16px 세로 막대 + 1모듈 세로 축 제목)
```html
<header class="page-head">
  <div class="page-head__axis">
    <span class="axis">교무실</span>                       <!-- 한글 세로쓰기 장 제목 -->
    <span class="latin-label muted">VORKURS 12</span>
  </div>
  <div class="page-head__main">
    <nav class="crumbs" aria-label="현재 위치"><ol>
      <li><a href="../index.html">모양학교</a></li>
      <li aria-current="page"><span>교무 6주차 판</span></li>
    </ol></nav>
    <h1 class="page-head__title">6주차 판</h1>
    <p class="page-head__note">10월 14일 (수) 15:20 기준 — 한 문장으로 쓴다(라벨-값 정의 목록 금지)</p>
  </div>
  <div class="page-head__fig comp" data-assemble aria-hidden="true">   <!-- 1200 미만에서 숨김 -->
    <span class="shape shape--circle" data-piece style="--x:-30%;--y:8%;--w:110%"></span>
    <span class="shape shape--square" data-piece style="--x:30%;--y:52%;--w:56%"></span>
    <span class="shape shape--tri" data-piece style="--x:52%;--y:30%;--w:30%"></span>
  </div>
</header>
```
- 모바일에서 세로 막대·축은 위쪽 가로 띠(6px 막대 + 가로 라벨)로 접힌다.
- `page-head__lead`(부연 한 문단, 선택). eyebrow·CTA 쌍 금지.
- 장 제목 축의 도형 구성은 그 페이지 성격의 도형을 주인공으로(교무 ○, 보드 □, 신청 △).
- **이 틀은 dashboard · profile 정도에만 쓴다.** 페이지 머리 구도는 페이지마다 바꾼다:
  - kanban — 머리 판 없음. 「오늘부터 폐막까지」 타임라인 판 아래 먹 막대(`.kb-titlebar`) 안에 제목 + 오른쪽 빨강 정사각 41.
  - inbox — 높이 148px 낮은 띠. 제목이 파랑 원(읽지 않음 3) 안에 들어간다(원 안 가운데 정렬 허용).
  - pricing — 머리 판 없음. 제목 「2027 봄 시간표」는 시간표 판의 왼쪽 위 모서리(`.tt__head`)에서 시작.
  - settings — 머리 판이 계정 판과 합쳐진다(파랑 원 `소정` 옆 h1 「설정」, 오른쪽은 바로 계정 양식).
- 메타는 라벨-값 `dl` 칸으로 반복하지 않는다 — 문장 한 줄(`.page-head__note`)이나 타임라인으로 흡수.

### 1-5. 머리 방식 (판마다 다르게 — "작은 라벨 → 제목 → 부제" 3단 헤더 금지)
| 방식 | 마크업 |
|---|---|
| 막대 머리(16px 막대 위, 제목 오른쪽 끝) | `<header class="bar-head"><h2 class="bar-head__title">사각의 장 — 구조</h2></header>` · 왼쪽 정렬은 `bar-head--start` |
| 세로 축(판 왼쪽 1모듈 띠) | 칸 하나에 `<h2 class="axis t-a4">교본 02 형</h2>` · 라틴은 `axis--latin` |
| 띠(먹 막대 안 종이색 제목) | `<div class="band"><h2 class="band__title">교본 03 활자</h2>…</div>` |
| 도형 안(원 안 가운데 · 삼각 안 왼쪽 아래) | `cell--blue cell--center` 안 제목, 또는 `.comp` 위에 겹친 제목 |

### 1-6. 유틸
`.stack`(세로 16px) `.stack--tight`(8) `.stack--loose`(32) · `.row`(가로 줄바꿈 12) `.row--between` `.row--end` `.push` · `.wrap`(바깥 여백만) · `.prose`(본문 38em) · `.sr-only` · `.muted` `.text-red` `.strong` · `.rule-bar`(16px) `.rule-mark`(6px) `.rule-hair`(1px).

### 1-7. 활자
| 클래스 | 쓰임 |
|---|---|
| `.ko-display` | 한글 디스플레이(Do Hyeon 400 고정). 크기는 `.t-a0 … .t-a6` |
| `.latin-display` | 라틴 대문자 디스플레이(League Spartan 800) — `MOYANG`, `VORKURS` |
| `.latin-label` | 라틴 대문자 작은 라벨(자간 .08em). **한글에 쓰지 말 것** |
| `.mono` `.num` | 숫자·ID·금액·코드(Space Mono) · 표 숫자 정렬. **한글을 모노로 쓰지 말 것** |
| `.date` | 날짜·시각(League Spartan 700, tabular-nums). 한글 요일과 한 줄에 놓이는 숫자는 모노 대신 이것 — `<span class="date">11.28</span> 토` |
| `.t-a0`(90–256px) `.t-a1`(64–181) `.t-a2`(45–128) `.t-a3`(32–90) `.t-a4`(26–45) `.t-a5`(32/24) `.t-a6`(22/20) `.t-small` `.t-cap` | DIN √2 사다리 |

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 토큰 | 낮(light) | 밤(dark) |
|---|---|---|
| `--bg` `--surface` `--surface-sunken` `--surface-raised` | 종이 · 밝은 종이 · 가라앉은 종이 · 밝은 종이 | 밤 벽 · 한 단 밝게 · 밤 벽 · 두 단 밝게 |
| `--text` `--text-muted` `--text-red` | 먹 · 흑연 · 빨강 글자 | 분필 · 흐린 분필 · 밝은 빨강 |
| `--line`(2px) `--hairline`(1px) `--fold`(접지 4px) | 먹 · 연필 · 먹 | 분필 · 흐린 선 · 분필 |
| `--bar`(16px 막대 면) `--bar-edge`(막대 위 2px) | 먹 · 먹 | raised `#2A2925` · 분필 — **16px 막대를 흰 띠로 뒤집지 않는다** |
| `--mark`(6px 이하 표시 막대 · 활성 표시) | 먹 | 분필 (분필 흰색은 여기에만) |
| `--figure-ink`(포스터·404·교본 구성의 먹 도형) | 먹 | 분필(밤 도면) |
| `--accent-red/--on-red` `--accent-yellow/--on-yellow` `--accent-blue/--on-blue` | 원색 면 + 그 위 글자 — **두 모드 값 동일** | 동일 |
| `--solid` `--on-solid` | 먹 면 + 종이 글자 | **파랑 면 + 흰 글자**(primary 버튼 · 활성 행 · hover) |
| `--primary-hover-*` | 파랑 면 | 밤 벽 면 + 분필 글자 + 파랑 테 |
| `--inverse-bg` `--inverse-text` `--inverse-bar` | 먹 띠 | raised 면(흰 띠로 뒤집지 않는다) + 분필 막대 |
| `--select-bg` `--select-text` | 파랑 면 + 흰 글자 | 동일 |
| `--focus` | 파랑 | 노랑 |
| `--link` `--link-bar` `--link-bar-w` | 파랑 글자 + 2px 파랑 밑막대 | 분필 글자 + 4px 파랑 밑막대(밤엔 파랑 글자 금지) |
| `--tri-edge` `--edge-ink` `--shape-ring` | 작은 삼각 외곽 먹 · 고정 먹 · 없음 | 작은 삼각 외곽 없음(노랑) · 고정 먹 · 작은 원·사각에 분필 링 |
| `--dim` | 오버레이 딤(단색) | 동일 |
| 간격 `--s-1…--s-9`(4·8·12·16·24·32·48·64·96) · `--page-m` · `--cell-pad` · 굵기 `--w-bar/--w-mark/--w-fold/--w-line/--w-hair` · 모션 `--dur-0…4` `--ease-snap` `--ease-out` · 서체 `--font-display` `--font-display-ko` `--font-body` `--font-mono` | | |

**작품 도판 `.plate-art`**: 수강생 도판·교구 그림 컨테이너(`kb-card__fig` `card__plate` `car-plate` `pf-task__fig` `ib-plate__fig` …)에 붙인다. 안쪽 토큰을 낮의 종이 + 먹으로 고정해 밤에도 '벽에 걸린 인쇄물'로 보인다 — 작품이 모드에 따라 바뀌지 않는다.

**밤 장면 규칙**: 큰 파랑 면은 그대로 파랑 판. 파랑을 글자색으로 쓰지 않는다. 노랑 면 위 글자는 언제나 먹(`--on-yellow`).

---

## 3. 시그니처 도형 · 아이콘

### 3-1. 도형 `.shape` (칸딘스키 대응)
```html
<span class="shape shape--circle"></span>           <!-- ○ 파랑 채움 -->
<span class="shape shape--ring"></span>             <!-- ○ 파랑 외곽 -->
<span class="shape shape--square"></span>           <!-- □ 빨강 채움 -->
<span class="shape shape--box"></span>              <!-- □ 선 외곽(중립) -->
<span class="shape shape--tri"></span>              <!-- △ 노랑 + 먹 외곽 (위 방향) -->
<span class="shape shape--tri shape--right"></span> <!-- 방향: --right · --down · --left -->
```
- 크기: 기본 16px, `shape--sm`(12) `shape--md`(20), 또는 `style="--s:28px"`. 큰 구성용은 `.comp` 안에서 `--w`로.
- 방(페이지)·항목의 **성격** 표시에는 `.shape`, **상태** 표시에는 `.mark`(3-2)를 쓴다.

### 3-2. 상태 표지 `.mark` (12px, 색만으로 신호하지 않음)
| 클래스 | 도형 | 뜻 | 예 |
|---|---|---|---|
| `mark--info` | ○ 파랑 외곽 | 정보·진행 중(열린 것) | 강평 중, 작업 중 |
| `mark--done` | ● 파랑 채움 | 완료·성공 | 제출, 강평 완료, 설치 완료 |
| `mark--warn` | ▲ 노랑 + 먹 외곽 | 주의·마감 임박 | T06 마감 임박, 캡션 지연 |
| `mark--danger` | ■ 빨강 | 오류·위험·미제출 | 미제출, 결제 실패 |
| `mark--idle` | □ 선 외곽 | 중립·대기 | 시작 전, 예정 |

라벨과 함께: `<span class="status"><span class="mark mark--done"></span>제출</span>`(표) 또는 배지(4절 badge).

### 3-3. 구성판 `.comp` (도판·포스터·404의 CSS 그림)
```html
<div class="comp" style="--ratio:1" aria-hidden="true">
  <span class="shape shape--circle" style="--x:-12%;--y:-8%;--w:72%"></span>
  <span class="comp__ink comp__ink--circle" style="--x:40%;--y:40%;--w:20%"></span>  <!-- 겹친 부분 = 먹 도형으로 따로 -->
  <span class="shape shape--square" style="--x:40%;--y:40%;--w:44%"></span>
  <span class="shape shape--tri" style="--x:62%;--y:18%;--w:26%"></span>
  <span class="comp__bar" style="--x:4%;--y:88%;--w:90%"></span>                    <!-- 16px 막대 -->
  <span class="comp__bar comp__bar--v" style="--x:8%;--y:0;--h:70%"></span>           <!-- 세로 막대 -->
  <span class="comp__bar comp__bar--diag" style="--x:0;--y:10%;--w:120%"></span>       <!-- 45° — index 포스터·404에서만 -->
</div>
```
`--ratio`(기본 1, 예: `1.414`, `auto`), 자식 `--x --y --w`(%). `mix-blend-mode`·투명도 겹침 금지 — 겹친 면은 `comp__ink`로 그린다. 큰 삼각은 두 모드 모두 먹 외곽.

### 3-4. 아바타 `.avatar` (사람 = ○)
`<span class="avatar">은호</span>` · `avatar--sm`(28) `avatar--lg`(96) `avatar--xl`(200, Do Hyeon) `avatar--ink`. 링크면 `<a class="avatar" href="…" aria-label="임소정 계정 설정">소정</a>`.

### 3-5. 아이콘 `.ico` (도형 + 막대만, `stroke: currentColor`)
`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">…</svg>` · `ico--lg`(24). 채움 부분은 `<path class="fill" …>`. **presentation attribute에 var() 금지.**

| 이름 | 내용 |
|---|---|
| 검색 | `<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/>` |
| 닫기 | `<path d="M6 6l12 12M18 6L6 18"/>` |
| 메뉴 | `<path d="M4 6h16M4 12h16M4 18h16"/>` |
| 더하기 · 빼기 | `<path d="M12 5v14M5 12h14"/>` · `<path d="M5 12h14"/>` |
| 설정 | `<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>` |
| 메시지 | `<path d="M4 5h16v11H10l-4 4v-4H4z"/>` |
| 달력 | `<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>` |
| 올리기 | `<path d="M12 21V10"/><path class="fill" d="M12 3l6 7H6z"/>` |
| 내려받기 | `<path d="M12 3v11"/><path class="fill" d="M12 21l6-7H6z"/>` |
| 알림 | `<circle cx="12" cy="11" r="6"/><path d="M12 2v3M8 21h8"/>` |
| 사람 | `<circle cx="12" cy="8" r="4"/><path d="M4 21v-4h16v4"/>` |
| 장바구니 | `<path d="M4 5h16v10H4z"/><circle cx="8" cy="19" r="2"/><circle cx="16" cy="19" r="2"/>` |
| 복사 | `<path d="M8 8h12v12H8zM4 16V4h12"/>` |
| 지우기 | `<path d="M5 7h14M9 7V4h6v3M7 7v13h10V7"/>` |
| 멈춤 · 재생 | `<path d="M8 5v14M16 5v14"/>` · `<path class="fill" d="M7 4l13 8-13 8z"/>` |
| 방향(다음·이전·펼침) | 아이콘 대신 `<span class="shape shape--tri shape--right"></span>` |

---

## 4. 컴포넌트 32 (알파벳순)

> 공통 상태: hover = 0ms 색 반전, active = 2px 눌림, focus-visible = 3px `--focus` + 2px 간격, disabled = 가라앉은 면 + 흐린 글자, loading = `aria-busy="true"`(원 안 노랑 △), error = 빨강 □ + 빨강 글자, selected = 파랑 면(`aria-selected` / `aria-pressed` / `aria-current`).

### accordion — 노랑 △가 90° 돈다, 열린 항목은 왼쪽 6px 막대
```html
<div class="acc" data-single>                         <!-- data-single: 하나만 열림(선택) -->
  <div class="acc__item">
    <h3 class="acc__h"><button class="acc__head" type="button" aria-expanded="true" aria-controls="faq-1">
      <span class="acc__no">01</span><span class="acc__title">조기 신청 할인은 언제까지인가요?</span>
      <span class="shape shape--tri acc__tri" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="faq-1" role="region"><p>2026년 12월 31일 (목)까지 ₩1,152,000입니다.</p></div>
  </div>
  <!-- 닫힌 항목: aria-expanded="false" + 패널 hidden. 비활성: aria-disabled="true" -->
</div>
```

### alert — 왼쪽 정사각 색면(상태 도형) + 오른쪽 본문
```html
<div class="alert alert--warn" role="status">       <!-- --info ○ · --done ● · --warn ▲ · --danger ■(role="alert") · --idle □ -->
  <span class="alert__sign" aria-hidden="true"></span>
  <div class="alert__body">
    <p class="alert__title">T06 마감까지 2일 2시간 40분</p>
    <p class="alert__text">24명 중 14명 제출(58%). 미제출 9명에게 알림을 보낼 수 있습니다(연장 요청 1명 제외).</p>
    <div class="alert__actions"><button class="btn" type="button">알림 보내기</button></div>   <!-- 선택 -->
  </div>
  <button class="icon-btn icon-btn--bare alert__close" type="button" data-dismiss aria-label="알림 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
판 폭 띠형: `alert--band`.

### badge — 도형 + 한글 라벨 (알약 금지) · count — 빨강 □ 숫자
```html
<span class="badge"><span class="mark mark--done"></span>제출</span>
<span class="badge badge--plain"><span class="mark mark--warn"></span>마감 임박</span>   <!-- 테두리 없음 -->
<span class="badge badge--blue"><span class="mark mark--done"></span>출품 확정</span>    <!-- --blue · --red · --yellow · --solid -->
<span class="badge badge--latin">VORKURS 12</span>                                       <!-- 라틴 고유 표기만 -->
<span class="count">3</span>  <span class="count count--muted">24</span>  <span class="count count--dot" aria-label="새 소식"></span>
```

### breadcrumb — 구분자 노랑 △, 현재 위치 6px 밑막대
```html
<nav class="crumbs" aria-label="현재 위치"><ol>
  <li><a href="../index.html">모양학교</a></li>
  <li><a href="dashboard.html">교무</a></li>
  <li aria-current="page"><span>수료전 설치 보드</span></li>
</ol></nav>
```

### button — 사각, 아이콘 단독만 원
```html
<button class="btn btn--primary" type="button">과제 제출</button>   <!-- 먹 면(밤: 분필 면) → hover 파랑 -->
<button class="btn" type="button">임시 저장</button>                 <!-- 2px 외곽 → hover 먹 반전 -->
<button class="btn btn--signal" type="button">관람 예약</button>     <!-- 노랑 면 + 먹 글자(포스터 단 1개) -->
<button class="btn btn--danger" type="button">계정 비활성화</button>  <!-- 빨강 □ -->
<button class="btn btn--ghost" type="button">나중에</button>
<a class="btn btn--primary btn--lg" href="pages/onboarding.html">13기 입학 신청</a>   <!-- --lg 52px · --block 전폭 -->
<!-- 상태 -->
<button class="btn" type="button" disabled>마감됨</button>
<button class="btn btn--primary" type="button" aria-busy="true">올리는 중</button>
<button class="btn is-error" type="button">다시 보내기</button>
<button class="btn" type="button" aria-pressed="true">선택됨</button>
<!-- 아이콘 단독 = 원 (aria-label 필수) -->
<button class="icon-btn" type="button" aria-label="닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
<button class="icon-btn icon-btn--blue" type="button" aria-label="다음 도판"><span class="shape shape--tri shape--right"></span></button>
<!-- 붙은 묶음(세그먼트) -->
<div class="btn-group" data-choose="pressed" role="group" aria-label="기간">
  <button class="btn" type="button" data-choice="week" aria-pressed="true">주간</button>
  <button class="btn" type="button" data-choice="month" aria-pressed="false">월간</button>
</div>
```
원색 칸(`cell--red`/`cell--blue`) 안의 `.btn`은 자동으로 흰 외곽이 된다. 다른 원색 컨테이너에는 `.on-color`. 불러오는 중 시연: `data-busy-demo="저장했습니다"`.

### calendar — 7열 정사각 칸, app.js가 그린다 (월요일 시작)
```html
<div class="cal" data-calendar data-month="2026-10" data-today="2026-10-14" data-closed="1"
     data-marks='{"2026-10-09":{"kind":"due","label":"T05 마감"},"2026-10-16":{"kind":"due","label":"T06 마감"},"2026-10-17":{"kind":"event","label":"공방 개방일"},"2026-10-18":{"kind":"event","label":"색채 2회"}}'>
  <div class="cal__head">
    <p class="cal__title" data-cal-title>10월</p>
    <div class="cal__nav">
      <button class="icon-btn" type="button" data-cal-prev aria-label="이전 달"><span class="shape shape--tri shape--left"></span></button>
      <button class="icon-btn" type="button" data-cal-next aria-label="다음 달"><span class="shape shape--tri shape--right"></span></button>
    </div>
  </div>
  <div class="cal__dow" aria-hidden="true"></div>
  <div class="cal__grid"></div>
  <div class="cal__legend"><span><span class="mark mark--done"></span>오늘</span><span><span class="mark mark--warn"></span>마감</span><span><span class="sw"></span>월 휴관</span></div>
  <p class="sr-only" aria-live="polite" data-cal-output></p>     <!-- 선택한 날 읽어 주기(선택) -->
</div>
```
`kind`: `due`(노랑 △ 모서리) · `event`(파랑 ○) · `stop`(빨강 라벨). 월요일 = 휴관(가라앉은 면, 라벨 `휴관`). 오늘 = 파랑 원. 날 클릭 = 파랑 면(`aria-pressed`) + `cal:select` 이벤트. 방향키로 이동. 라벨은 모바일에서 숨는다.

### card — 도판 카드 (위 도판 + 아래 정보, 오른쪽 모서리 90° 번호)
```html
<a class="card" href="profile.html">
  <div class="card__plate comp" aria-hidden="true">                <!-- --din(1:√2) · --wide · --blue · --red · --yellow -->
    <span class="shape shape--circle" style="--x:10%;--y:10%;--w:60%"></span>
    <span class="shape shape--square" style="--x:45%;--y:45%;--w:45%"></span>
  </div>
  <span class="card__no">도판 112</span>
  <div class="card__body">
    <p class="card__kicker"><span class="mark mark--info"></span>T06 · 작업 중</p>
    <p class="card__title">보색 대비, 원 안의 사각</p>
    <p class="card__meta"><span>차은호</span><span class="mono">MY12-07</span></p>
    <div class="card__foot"><span class="card__price">₩28,000</span><button class="btn" type="button">담기</button></div>  <!-- 선택 -->
  </div>
</a>
```
- 링크 카드는 hover 시 정보 면이 0ms 반전. 버튼을 넣을 카드는 `<article class="card">`(링크 중첩 금지).
- 상태: `is-selected`(파랑 6px 테두리) · `is-disabled` · `is-planned`(도판을 1px 작도선 윤곽으로 — 예정 과제).
- 가로형 `card--row`. 맞물림 그리드: `<div class="cards cards--4">`(`--3` · 기본 auto-fill), 카드끼리 거터 0.

### carousel — 한 장씩, 원 버튼 안 노랑 △, 파랑 원 점
```html
<div class="carousel" aria-label="T06 도판 넘겨 보기">
  <div class="carousel__viewport"><div class="carousel__track">
    <div class="carousel__slide" aria-label="도판 112 — 보색 대비">…</div>
    <div class="carousel__slide" aria-label="도판 113 — 명암 대비">…</div>
  </div></div>
  <div class="carousel__bar">
    <span class="carousel__count">01 / 07</span>
    <div class="carousel__dots"></div>                  <!-- 비워 두면 app.js가 점을 만든다 -->
    <button class="icon-btn carousel__btn" type="button" data-carousel-prev aria-label="이전 도판"><span class="shape shape--tri shape--left"></span></button>
    <button class="icon-btn carousel__btn" type="button" data-carousel-next aria-label="다음 도판"><span class="shape shape--tri shape--right"></span></button>
  </div>
  <p class="carousel__caption"><strong>도판 112</strong> 보색 대비 — 차은호</p>   <!-- 선택 -->
</div>
```
←/→ 키, 끌어 넘기기 지원.

### code — 먹 면 + 위 6px 노랑 막대, 줄번호
```html
<div class="code">
  <div class="code__head"><span class="code__file">badge.html</span><button class="code__copy" type="button" data-copy>복사</button></div>
  <pre><code><span class="line"><span class="tk-c">&lt;!-- 상태 배지 --&gt;</span></span><span class="line">&lt;span <span class="tk-k">class</span>=<span class="tk-s">"badge"</span>&gt;…</span></code></pre>
</div>
```
`tk-k`(키·노랑) `tk-s`(값·밝은 빨강) `tk-c`(주석) `tk-b`(굵게). 본문 속 인라인 `<code>`는 자동 스타일.

### command — ⌘K 팔레트 (셸 C에 1개, 정적 견본은 `command--static`)
정본 마크업은 **5절 셸 C**. 구조:
```html
<div class="command" id="command" data-layer role="dialog" aria-modal="true" aria-label="찾기" hidden>
  <div class="command__dim" data-close></div>
  <div class="command__panel">
    <div class="command__field"><svg class="ico" …검색…></svg><input class="command__input" placeholder="방, 수강생, 동작 찾기" aria-label="찾을 말"><kbd>Esc</kbd></div>
    <div class="command__list">
      <div class="command__group"><p class="command__group-head"><span class="shape shape--circle shape--sm"></span>방</p>
        <a class="command__item" href="…" data-keywords="대시보드 교무"><span class="command__label">교무 대시보드</span><span class="command__meta">01</span></a>
      </div>
      <!-- □ 수강생 · △ 동작 그룹. 동작은 <button class="command__item" type="button" data-toast …> 또는 data-theme-toggle · data-open -->
      <p class="command__empty" hidden>맞는 결과가 없습니다.</p>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 고르기</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></div>
  </div>
</div>
```
⌘K / Ctrl+K로 열고 닫는다. 입력으로 거르고 ↑↓ Enter. 선택 행 = 파랑 면. 정적 견본(index 오버레이 판): 같은 마크업에 `class="command command--static"`, `data-layer`·`hidden`·`id` 빼고, 딤 없이.

### drawer — 오른쪽에서 직진, 왼쪽 16px 막대 손잡이
```html
<div class="drawer" id="cart" data-layer role="dialog" aria-modal="true" aria-labelledby="cart-t" hidden>   <!-- 왼쪽에서: drawer--left -->
  <div class="drawer__dim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head"><h2 class="drawer__title" id="cart-t">장바구니</h2>
      <button class="icon-btn" type="button" data-close aria-label="닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot"><button class="btn btn--primary" type="button">주문하기 ₩64,000</button></div>
  </div>
</div>
<button class="btn" type="button" data-open="cart">장바구니 <span class="count">1</span></button>
```
정적 견본: `class="drawer drawer--static"`(칸 안에 꽉 차게, `id`·`data-layer`·`hidden` 빼고).

### empty — 조립 전 흩어진 세 도형 + 한 줄 + 버튼 1개
```html
<div class="empty">                                 <!-- 좁은 칸: empty--compact -->
  <div class="empty__fig" aria-hidden="true"><span class="shape shape--circle"></span><span class="shape shape--square"></span><span class="shape shape--tri"></span></div>
  <div class="empty__body">
    <p class="empty__title">아직 올린 도판이 없습니다</p>
    <p class="empty__text">T06 도판을 올리면 여기에 놓입니다.</p>
    <button class="btn btn--primary" type="button">도판 올리기</button>
  </div>
</div>
```

### form — 사각 입력, 오류 = 빨강 □ + 6px 빨강 막대
```html
<form class="form" data-validate data-success="과제 6을 제출했습니다" data-success-msg="민하율 강사에게 알림이 갔습니다.">
  <div class="form-grid">                                         <!-- 2열, 모바일 1열. 전폭 칸: field--wide -->
    <div class="field">
      <label class="field__label" for="name">이름 <span class="field__req">필수</span></label>
      <input class="input" id="name" name="name" required autocomplete="name">
      <p class="field__hint">입학 서류와 같은 이름으로 적어 주세요.</p>
      <p class="field__error"></p>                               <!-- app.js가 문구를 채운다(data-error 우선) -->
    </div>
    <div class="field">
      <label class="field__label" for="sid">수강생 번호</label>
      <input class="input input--mono" id="sid" value="MY12-07" readonly>
    </div>
    <div class="field field--wide">
      <label class="field__label" for="mail">이메일 <span class="field__req">필수</span></label>
      <input class="input" id="mail" type="email" required data-error="이메일 형식을 확인해 주세요. 예: office@moyang.school">
      <p class="field__error"></p>
    </div>
    <div class="field"><label class="field__label" for="task">과제</label>
      <span class="select"><select id="task"><option>T06 이텐의 색 대비 7종</option></select></span></div>
    <div class="field"><label class="field__label" for="fee">금액</label>
      <div class="input-group"><span class="input-group__add">₩</span><input class="input input--mono" id="fee" value="1,152,000"></div></div>
    <div class="field"><label class="field__label" for="cnt">도판 수</label>
      <div class="control" aria-busy="true"><input class="input" id="cnt" value="7"></div></div>   <!-- 불러오는 중 -->
    <div class="field field--wide"><label class="field__label" for="memo">강평 요청 <span class="field__opt">선택</span></label>
      <textarea class="textarea" id="memo"></textarea></div>
  </div>
  <fieldset class="fieldset"><legend>함께 올릴 것</legend>
    <div class="choice-list choice-list--row">
      <label class="check"><input type="checkbox" checked> 원본 도판</label>      <!-- □ → ■ 빨강 -->
      <label class="radio"><input type="radio" name="tone" checked> 밝은 판</label>  <!-- ○ → ● 파랑 -->
    </div>
  </fieldset>
  <label class="switch"><input type="checkbox" role="switch" checked><span class="switch__track" aria-hidden="true"></span>마감 24시간 전 알림</label>
  <label class="drop"><input type="file" accept=".png,.pdf"><span class="shape shape--tri"></span>
    <span class="drop__text"><strong>도판 파일을 끌어 놓거나 고르세요</strong><span class="muted" data-file-name data-empty="PNG · PDF, 최대 20MB">PNG · PDF, 최대 20MB</span></span></label>
  <div class="row"><button class="btn btn--primary" type="submit">과제 제출</button></div>
</form>
<!-- 수량 스테퍼 -->
<div class="stepper"><button type="button" data-step="-1" aria-label="하나 빼기">−</button><input type="number" value="1" min="1" max="9" aria-label="수량"><button type="button" data-step="1" aria-label="하나 더하기">+</button></div>
```
- 오류 상태를 정적으로 보이려면 입력에 `aria-invalid="true"` + `.field__error`에 문구. `:disabled`, `[readonly]` 지원.
- 보내면: 오류 → 첫 칸 포커스 + 빨강 토스트 / 통과 → 제출 버튼 `aria-busy` 0.9초 → 완료 토스트(`data-success`).

### kanban — 맞물림 열, 열 머리 위 6px 막대 + 상태 도형
```html
<div class="kanban" aria-label="수료전 설치 보드">
  <section class="kanban__col" aria-labelledby="col-1">
    <header class="kanban__head"><span class="mark mark--idle"></span><h3 class="kanban__title" id="col-1">출품 접수</h3><span class="kanban__count">02</span></header>
    <div class="kanban__list">
      <article class="kb-card" id="card-17">
        <div class="kb-card__fig" aria-hidden="true"><span class="shape shape--circle" style="--s:30px;left:6px;top:6px"></span></div>
        <span class="kb-card__id">점선면-17</span>
        <p class="kb-card__title">차은호 「원 안의 사각」</p>
        <div class="kb-card__meta"><span class="avatar avatar--sm">채원</span>윤채원 · <span class="mono">11.06</span> 캡션</div>
      </article>
      <!-- 지연 카드: kb-card--late -->
      <p class="kanban__empty" hidden>끌어 놓으면 이 열로 옮겨집니다.</p>
    </div>
  </section>
  …
</div>
```
끌어 옮기기 + 키보드(카드 포커스 후 Alt+←/→ 열 이동, Alt+↑/↓ 순서). 개수(`kanban__count`)는 자동 갱신(두 자리).

### list — 1px 작도선 행, 왼쪽 도형, 오른쪽 모노 수치
```html
<ul class="list list--interactive" data-choose="current" aria-label="강평 메시지">
  <li><button class="list__item is-unread" type="button" data-choice="m1" aria-current="true">
    <span class="list__marker"><span class="mark mark--done"></span></span>
    <span class="list__main"><span class="list__title">민하율 · T06 보색 대비 칸 순서 다시 볼게요</span><span class="list__sub">도판 112 첨부</span></span>
    <span class="list__value">15:02</span>                  <!-- 한글 값은 list__value-ko -->
  </button></li>
</ul>
```
정적 목록은 `<ul class="list">` + `<li class="list__item">`(button 없이). `list--plain`(위아래 선 없음) `list--compact`. 상태: `is-unread` `is-muted` `aria-disabled`.

### marquee — 바닥글 위 안내 띠 (셸 B)
정본은 5절 셸 B. 구분자는 ○ □ △ 순환(`marquee__sep shape …`). hover·focus 정지, 일시정지 버튼, 움직임 줄이기면 정적 목록.

### menu — 위 6px 막대 패널, hover 0ms 반전
```html
<span class="menu-anchor">
  <button class="btn" type="button" data-menu="plate-menu">도판 112 <span class="shape shape--tri shape--down"></span></button>
  <div class="menu" id="plate-menu" aria-label="도판 112">               <!-- 오른쪽 맞춤: menu--end · 위로: menu--up (자동 보정) -->
    <p class="menu__label">도판 112</p>
    <a class="menu__item" role="menuitem" href="…"><span class="menu__text">크게 보기</span><span class="menu__kbd">⌘O</span></a>
    <button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span class="menu__text">강평 받기</span></button>
    <button class="menu__item" role="menuitem" type="button"><span class="menu__text">다른 과제로 옮기기</span><span class="shape shape--tri"></span></button>
    <button class="menu__item" role="menuitem" type="button" aria-disabled="true"><span class="menu__text">출품하기 (11/6 이후)</span></button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button"><span class="menu__text">도판 삭제</span></button>
  </div>
</span>
```
열면 첫 항목에 포커스, ↑↓ Home End, Esc는 닫고 트리거로 복귀, 바깥 클릭 닫힘. 정적 견본: `menu menu--static`(`id`·트리거 없이, `role="menu"` 직접).

### modal — 머리 16px 막대 + 파랑 면 흰 제목
```html
<div class="modal" id="submit-t06" data-layer role="dialog" aria-modal="true" aria-labelledby="submit-t06-t" hidden>   <!-- 위험: modal--danger(빨강 머리) · 넓게: modal--wide -->
  <div class="modal__dim" data-close></div>
  <div class="modal__panel">
    <div class="modal__head"><h2 class="modal__title" id="submit-t06-t">과제 6 제출</h2>
      <button class="icon-btn" type="button" data-close aria-label="닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="modal__body"><p>이텐의 색 대비 7종 도판 7장을 제출합니다. 마감 10월 16일 (금) 18:00.</p></div>
    <div class="modal__foot"><button class="btn" type="button" data-close>취소</button><button class="btn btn--primary" type="button" data-close data-toast data-toast-kind="done" data-toast-title="과제 6을 제출했습니다">제출</button></div>
  </div>
</div>
<button class="btn btn--primary" type="button" data-open="submit-t06">과제 6 제출</button>
```
Esc·딤 클릭 닫힘, 포커스 가두기, 트리거로 복귀, 배경 스크롤 잠금. 모바일에서는 아래쪽에 붙는다. 정적 견본: `class="modal modal--static"`(`id`·`data-layer`·`hidden`·딤 빼고).

### motion — 조립 시연 블록
```html
<div class="motion-demo">
  <div class="motion-demo__stage" id="assemble-demo" data-assemble aria-hidden="true">
    <span class="shape shape--circle" data-piece></span><span class="shape shape--square" data-piece></span><span class="shape shape--tri" data-piece></span>
    <span class="comp__bar"></span>
  </div>
  <div class="motion-demo__bar"><button class="btn" type="button" data-replay="assemble-demo">다시 조립</button><span class="motion-demo__state" data-motion-state></span></div>
</div>
<div class="motion-spec">
  <div class="motion-spec__row"><span class="motion-spec__name">assemble</span><span class="motion-spec__what">도형이 90° 돌며 제자리에 맞물림 · 화면당 1회</span><span class="motion-spec__val">420ms · back.out 1.4</span></div>
</div>
```
- **조립 모션 쓰는 법(모든 장면)**: 컨테이너에 `data-assemble`, 움직일 조각에 `data-piece`(순서대로 80ms 지연, `style="--i:2"`로 직접 지정 가능, `--ax/--ay`로 출발점). 뷰포트 진입 시 1회. **화면당 1곳만.**
- 막대 채움: 컨테이너에 `data-fill`(안의 `.progress__fill` · `.bullet__bar`가 진입 시 0 → 값).
- 펼침 회전 견본: `<span class="turn-demo">… <span class="shape shape--tri"></span></span>`(hover·focus 시 90°).

### navbar — 셸 A (5절). 모바일 메뉴 드로어는 셸 C의 `#site-menu`.

### pagination — 44px 정사각 쪽, 현재 = 빨강 □
```html
<nav class="pager" data-pager data-total="5" aria-label="쪽 넘김">
  <ul class="pager__list">
    <li><button class="pager__btn" type="button" data-page-prev aria-label="이전 쪽"><span class="shape shape--tri shape--left"></span></button></li>
    <li><button class="pager__btn" type="button" data-page="1">1</button></li>
    <li><button class="pager__btn" type="button" data-page="2" aria-current="page">2</button></li>
    <li class="is-far"><button class="pager__btn" type="button" data-page="3">3</button></li>   <!-- is-far: 480px 이하 숨김 -->
    <li><span class="pager__gap">…</span></li>
    <li><button class="pager__btn" type="button" data-page-next aria-label="다음 쪽"><span class="shape shape--tri shape--right"></span></button></li>
  </ul>
  <p class="pager__info"><span class="mono" data-pager-info>2 / 5</span> 쪽</p>
</nav>
```
링크 방식이면 `<a class="pager__btn" href="…">`, 현재 쪽 `aria-current="page"`, 끝 쪽에서 이전/다음은 `aria-disabled="true"`.

### popover — 2px 외곽 + 노랑 △ 꼬리
```html
<span class="popover-anchor">
  <button class="btn" type="button" data-popover="ws-1017-04">WS-1017-04</button>
  <div class="popover" id="ws-1017-04" aria-label="공방 예약">           <!-- popover--end · popover--up (자동 보정) -->
    <p class="popover__title">활판 공방 · WS-1017-04</p>
    <p class="popover__text">10월 17일 (토) 14:00–17:00, 고태린 담당.</p>
    <dl class="popover__dl"><dt>예약률</dt><dd>91%</dd></dl>
    <div class="popover__actions"><button class="btn" type="button">예약 바꾸기</button></div>
  </div>
</span>
```
정적 견본: `popover popover--static`(꼬리가 위를 향한 채 흐름 속에 놓임).

### progress — 16px 막대 · 원형 · 와플 · 불릿
```html
<div class="progress" data-fill>                                   <!-- --warn(노랑) --danger(빨강) --ink(먹) --thin -->
  <p class="progress__label">T06 제출 <span class="muted">14 / 24명</span></p>
  <div class="progress__track" role="progressbar" aria-label="T06 제출률" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100"><div class="progress__fill" style="--val:58%"></div></div>
  <span class="progress__value">58%</span>
</div>
<!-- 모름(불러오는 중): .progress 에 aria-busy="true" -->

<div class="ring-wrap" style="--ring:140px">
  <svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring__track" cx="60" cy="60" r="50"/><circle class="ring__value" cx="60" cy="60" r="50" pathLength="100" style="--val:96.2"/></svg>
  <span class="ring__label"><span class="ring__num">96.2</span><span class="ring__sub">누적 출석률 %</span></span>
</div>

<div class="waffle" role="img" aria-label="T06 제출 24명 중 14명">   <!-- 칸 = 수강생 1명, 기본 8열(style="--cols-w:6") -->
  <span class="waffle__cell waffle__cell--done"></span>             <!-- --done ● · --miss □ · --late ▲ · --stop ■ -->
  …(24칸)
</div>
<p class="waffle-legend"><span><span class="mark mark--done"></span>제출 <span class="mono">14</span></span><span><span class="mark mark--idle"></span>미제출 <span class="mono">10</span></span></p>

<div data-fill>
  <div class="bullet-row"><span class="bullet-row__name">목공</span>
    <div class="bullet" role="img" aria-label="목공 예약률 82%, 목표 80%"><span class="bullet__bar" style="--val:82%"></span><span class="bullet__target" style="--target:80%"></span></div>
    <span class="bullet-row__val">82%</span></div>
</div>
```
불릿 `bullet--hot`(파랑 막대 — 목표 초과 강조).

### sidebar — 셸 D (5절)

### skeleton — 도형 윤곽, 반짝임 없음
```html
<div class="skel-card" aria-busy="true" aria-label="도판 불러오는 중">
  <span class="skel skel--plate"></span>
  <div class="skel-card__body"><span class="skel skel--title"></span><span class="skel skel--text"></span><span class="skel skel--text" style="--w:60%"></span></div>
</div>
<div class="skel-row"><span class="skel skel--circle" style="--s:28px"></span><span class="skel skel--text"></span></div>
```

### spinner — 원 안 노랑 △, 4방위
```html
<span class="loading" role="status"><span class="spinner spinner--sm" aria-hidden="true"></span>불러오는 중</span>   <!-- spinner(36) · --sm(20) · --lg(64) -->
```
글자 "불러오는 중"을 항상 함께 둔다(움직임 줄이기면 스피너가 멈춘다).

### steps — 완료 ● · 현재 굵은 ○ · 예정 □, 완료 구간 6px 막대
```html
<ol class="steps steps--lg" aria-label="입학 신청 단계">          <!-- --lg(입학 신청) · --vertical -->
  <li class="steps__item is-done"><span class="steps__node">1</span><span class="steps__label">기본 정보</span><span class="steps__sub">완료</span></li>
  <li class="steps__item is-current" aria-current="step"><span class="steps__node">2</span><span class="steps__label">칸딘스키 설문</span></li>
  <li class="steps__item"><span class="steps__node">3</span><span class="steps__label">반 · 조기 신청</span></li>
</ol>
```
오류 단계 `is-error`. 세로형은 `steps__node` 옆에 `<span class="steps__text">라벨+설명</span>`.

**단계 마법사(onboarding)**
```html
<div data-wizard data-success="13기 입학 신청을 마쳤습니다" data-success-msg="합격 발표는 2027년 2월 5일 (금)입니다.">
  <ol class="steps steps--lg">…3개…</ol>
  <section data-wizard-step><h2>기본 정보</h2> …필드(required)… </section>
  <section data-wizard-step hidden><h2>칸딘스키 설문</h2> … </section>
  <section data-wizard-step hidden><h2>반 · 조기 신청</h2> … </section>
  <div class="row"><button class="btn" type="button" data-wizard-prev>이전</button><span class="mono" data-wizard-now>1 / 3</span><button class="btn btn--primary" type="button" data-wizard-next>다음</button></div>
</div>
```
다음 단계로 갈 때 현재 패널의 필수 칸을 검사한다. 마지막 단계 next = 완료 토스트 + `wizard:done`.

**칸딘스키 칠하기(onboarding 2단계)** — 장면 CSS가 `[data-color="yellow|red|blue"]` 칠을 그린다.
```html
<div data-paint data-solved="1923년 칸딘스키 수업의 답과 같습니다." data-unsolved="정답은 없습니다. 이 짝이 당신의 첫 구성입니다.">
  <div class="btn-group" role="group" aria-label="고를 색">
    <button class="btn" type="button" data-swatch="yellow">노랑</button><button class="btn" type="button" data-swatch="red">빨강</button><button class="btn" type="button" data-swatch="blue">파랑</button>
  </div>
  <button type="button" data-paint-target data-answer="yellow" data-name="삼각형" aria-label="삼각형 — 아직 칠하지 않음">…</button>
  <button type="button" data-paint-target data-answer="red" data-name="사각형" aria-label="사각형 — 아직 칠하지 않음">…</button>
  <button type="button" data-paint-target data-answer="blue" data-name="원" aria-label="원 — 아직 칠하지 않음">…</button>
  <p aria-live="polite" data-paint-result></p>
  <div data-assemble>…모두 맞으면 다시 조립…</div>
</div>
```

### table — 헤더 위 6px 막대, 행 1px 작도선, 숫자 오른쪽 모노
```html
<div class="table-wrap">
  <table class="table table--hover table--stack" data-row-select>   <!-- --hover(행 반전) · --stack(모바일 블록) · --compact -->
    <caption>12기 T06 제출 현황 <span class="muted">10월 14일 15:20 기준</span></caption>
    <thead><tr>
      <th scope="col" data-sort="text"><button class="table__sort" type="button">수강생 <span class="shape shape--tri"></span></button></th>
      <th scope="col">번호</th>
      <th scope="col" class="num" data-sort="num"><button class="table__sort" type="button">출석률 <span class="shape shape--tri"></span></button></th>
      <th scope="col">T06</th>
    </tr></thead>
    <tbody>
      <tr><th scope="row">차은호</th><td class="id" data-label="번호">MY12-07</td><td class="num" data-label="출석률" data-value="97.9">97.9%</td>
          <td data-label="T06"><span class="status"><span class="mark mark--info"></span>작업 중</span></td></tr>
      <tr class="is-flag">…</tr>                                  <!-- is-flag: 첫 칸 왼쪽 빨강 6px 막대(미제출 등) -->
    </tbody>
  </table>
</div>
```
- 정렬: `th[data-sort="num|text"]` + `.table__sort`, `aria-sort` 자동. 값은 `td[data-value]` 우선.
- 행 선택: `table[data-row-select]`(클릭/Enter로 `aria-selected` 토글 → 파랑 면). 체크박스 열은 `<td class="col-check">`.
- `table--stack`은 767px 이하에서 행을 블록으로 쌓는다 — 각 `td`에 `data-label` 필수.

### tabs — 활성 = 위 6px 막대, 넘치면 노랑 △ 힌트
```html
<div class="tabs">
  <div class="tabs__bar scroll-host">
    <div class="tabs__list" role="tablist" aria-label="수강생 보기" data-scroller>
      <button class="tabs__tab" role="tab" type="button" aria-selected="true" aria-controls="tab-submit">제출 현황 <span class="count">10</span></button>
      <button class="tabs__tab" role="tab" type="button" aria-selected="false" aria-controls="tab-attend">출석</button>
      <button class="tabs__tab" role="tab" type="button" aria-selected="false" aria-controls="tab-review" disabled>수료 평가</button>
    </div>
  </div>
  <div class="tabs__panel" id="tab-submit">…</div>
  <div class="tabs__panel" id="tab-attend" hidden>…</div>
  <div class="tabs__panel" id="tab-review" hidden>…</div>
</div>
```
←/→ Home End. 패널 위 여백 없애기: `tabs--flush`.

### timeline — 세로 2px 선 + 마디 도형, 날짜 모노 왼쪽
```html
<ol class="timeline">
  <li class="timeline__item is-done"><span class="timeline__date">10.09</span><span class="timeline__node"><span class="mark mark--done"></span></span>
    <div class="timeline__body"><p class="timeline__title">T05 제출</p><p class="timeline__text">색의 무게 — 강평 완료</p></div></li>
  <li class="timeline__item is-now"><span class="timeline__date">10.14</span><span class="timeline__node"><span class="mark mark--info"></span></span>…</li>
  <li class="timeline__item"><span class="timeline__date">10.16</span><span class="timeline__node"><span class="mark mark--warn"></span></span>…</li>  <!-- 지연 ▲ -->
  <li class="timeline__item is-cancel"><span class="timeline__date">10.17</span><span class="timeline__node"><span class="mark mark--danger"></span></span>…</li>  <!-- 취소 ■ -->
  <li class="timeline__item"><span class="timeline__date">11.27</span><span class="timeline__node"><span class="mark mark--idle"></span></span>…</li>  <!-- 예정 □ -->
</ol>
```
`is-done` 구간은 6px 막대로 이어진다. 한글 날짜는 `timeline__date-ko`.

### toast — 왼쪽 정사각 색면 + 본문, 왼쪽 아래 쌓임, 5초 막대
```html
<button class="btn" type="button" data-toast data-toast-kind="done" data-toast-title="과제 6을 제출했습니다" data-toast-msg="민하율 강사에게 알림이 갔습니다.">제출</button>
<!-- JS: Moyang.toast({ kind:'info|done|warn|danger', title:'…', msg:'…' }) -->
<!-- 정적 견본 -->
<div class="toast toast--static toast--done"><span class="toast__sign" aria-hidden="true"></span>
  <div class="toast__body"><p class="toast__title">과제 6을 제출했습니다</p><p class="toast__msg">민하율 강사에게 알림이 갔습니다.</p></div>
  <button type="button" class="icon-btn icon-btn--bare toast__close" aria-label="알림 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <span class="toast__timer" aria-hidden="true"></span></div>
```
hover·focus 시 멈춘다. 최대 4개.

### tooltip — 먹 면 + 노랑 △ 꼬리
```html
<span class="tip">                                   <!-- --below(아래) · --start(왼쪽 맞춤) · --end · --static(항상 보임) -->
  <button class="icon-btn" type="button" aria-label="휴관일 안내">?</button>
  <span class="tip__bubble">월요일은 공방 정비로 휴관합니다</span>
</span>
```
hover·focus 시 0ms 표시, Esc로 숨김. 첫 자식이 대상(aria-describedby 자동). 화면 가장자리 근처는 `tip--start`/`tip--end`.

---

## 5. 셸 스니펫 — 복사해서 그대로 쓴다 (모든 화면 같은 한 벌)

**방 번호표(정본)** — navbar·드로어·커맨드·바닥글·배치도 어디서나 같은 번호·이름·도형을 쓴다.

| 번호 | 이름 | 파일 | 도형 |
|---|---|---|---|
| 01 | 교무 대시보드 | `pages/dashboard.html` | ○ `shape--circle` |
| 02 | 메시지함 | `pages/inbox.html` | ○ `shape--circle` |
| 03 | 수료전 설치 보드 | `pages/kanban.html` | □ `shape--square` |
| 04 | 입학 신청 | `pages/onboarding.html` | △ `shape--tri` |
| 05 | 수강료 | `pages/pricing.html` | □ `shape--square` |
| 06 | 교본 상점 | `pages/product.html` | □ `shape--square` |
| 07 | 차은호 포트폴리오 | `pages/profile.html` | ○ `shape--circle` |
| 08 | 설정 | `pages/settings.html` | □ `shape--square` |
| 09 | 길 잃은 도형 | `pages/404.html` | △ `shape--tri` |

index의 장 앵커(정본): 포스터 `#poster` · 교본 `#gyobon` · 연습 문제 `#yeonseup` · 전시장 배치도 `#jeonsijang`.

**aria-current 규칙**: navbar 링크 — product → `상점`에 `aria-current="page"`, dashboard → `교무`에 `aria-current="page"`, inbox·kanban·settings → `교무`에 `aria-current="true"`(같은 구역). index·onboarding·pricing·profile·404 → navbar 링크에는 없음. 바닥글·드로어 방 목록 — 현재 페이지의 방에 `aria-current="page"`.

### 셸 A — navbar

**index.html**
```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="index.html" aria-label="모양학교 처음으로">
      <span class="trio" aria-hidden="true"><span class="shape shape--tri"></span><span class="shape shape--square"></span><span class="shape shape--circle"></span></span>
      MOYANG <span class="nav__brand-ko">모양학교</span>
    </a>
    <nav class="nav__links" aria-label="주 메뉴">
      <a class="nav__link" href="#gyobon">교본</a>
      <a class="nav__link" href="#yeonseup">연습 문제</a>
      <a class="nav__link" href="#jeonsijang">전시장</a>
      <a class="nav__link" href="pages/product.html">상점</a>
      <a class="nav__link" href="pages/dashboard.html">교무</a>
    </nav>
    <div class="nav__tools">
      <button type="button" class="cmd-trigger" data-open="command" aria-label="찾기 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/></svg>
        <span>찾기</span><kbd>⌘K</kbd>
      </button>
      <button type="button" class="theme-toggle" data-theme-toggle><span class="theme-toggle__shape" aria-hidden="true"></span></button>
      <a class="avatar" href="pages/settings.html" aria-label="임소정 계정 설정">소정</a>
      <button type="button" class="icon-btn nav__burger" data-open="site-menu" aria-label="전체 메뉴 열기">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```

**pages/*.html** (예: dashboard — `aria-current`만 규칙대로 바꾼다)
```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="../index.html" aria-label="모양학교 처음으로">
      <span class="trio" aria-hidden="true"><span class="shape shape--tri"></span><span class="shape shape--square"></span><span class="shape shape--circle"></span></span>
      MOYANG <span class="nav__brand-ko">모양학교</span>
    </a>
    <nav class="nav__links" aria-label="주 메뉴">
      <a class="nav__link" href="../index.html#gyobon">교본</a>
      <a class="nav__link" href="../index.html#yeonseup">연습 문제</a>
      <a class="nav__link" href="../index.html#jeonsijang">전시장</a>
      <a class="nav__link" href="product.html">상점</a>
      <a class="nav__link" href="dashboard.html" aria-current="page">교무</a>
    </nav>
    <div class="nav__tools">
      <button type="button" class="cmd-trigger" data-open="command" aria-label="찾기 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/></svg>
        <span>찾기</span><kbd>⌘K</kbd>
      </button>
      <button type="button" class="theme-toggle" data-theme-toggle><span class="theme-toggle__shape" aria-hidden="true"></span></button>
      <a class="avatar" href="settings.html" aria-label="임소정 계정 설정">소정</a>
      <button type="button" class="icon-btn nav__burger" data-open="site-menu" aria-label="전체 메뉴 열기">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```
navbar는 sticky(위 16px 막대 + 64px 줄 + 2px 선 = 82px), `z-index: var(--z-nav)` = 70 — 열린 상태 견본(메뉴·팝오버 60)보다 위, 실제 오버레이(모달·드로어·커맨드 80)보다 아래. 1023px 이하 링크 숨김 → 햄버거, 767px 이하 찾기는 원 버튼·아바타 숨김.
밤 모드의 위 16px 막대는 흰 띠가 아니라 `--bar`(raised #2A2925) 면 + 위 2px 분필선(`--bar-edge`)이다.

**셸 A′ — 공개 페이지 변형** (onboarding · pricing · product): 교무 매니저 아바타 `소정` 자리에 '로그인' 원 버튼을 둔다. 방문자가 보는 페이지에 로그인 사용자가 떠 있지 않게 하기 위함. 나머지 마크업은 셸 A와 같다.
```html
      <a class="nav__login" href="dashboard.html">로그인</a>
```

### 셸 B — 안내 띠(marquee) + 바닥글 — `</main>` 바로 뒤

**index.html** (pages는 아래 표대로 경로만 바꾼다)
```html
<div class="marquee" role="region" aria-label="학교 소식">
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__run">
    <span class="marquee__item">수료전 「점·선·면」 <span class="date">11.27</span> 금 <span class="date">19:00</span> 개막</span><span class="marquee__sep shape shape--circle" aria-hidden="true"></span>
    <span class="marquee__item">관람 무료 · 사전 예약 <span class="mono">612</span>명</span><span class="marquee__sep shape shape--tri" aria-hidden="true"></span>
    <span class="marquee__item">13기 모집 <span class="date">11.2</span> 월 접수 시작</span><span class="marquee__sep shape shape--square" aria-hidden="true"></span>
    <span class="marquee__item">교본 01 『점·선·면』 재입고</span><span class="marquee__sep shape shape--circle" aria-hidden="true"></span>
    <span class="marquee__item">10월 17일 토 공방 개방일</span><span class="marquee__sep shape shape--tri" aria-hidden="true"></span>
  </div></div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-label="안내 띠 멈추기">
    <svg class="ico i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
    <svg class="ico i-play" viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M7 4l13 8-13 8z"/></svg>
  </button>
</div>
<footer class="site-foot">
  <div class="site-foot__grid">
    <div class="site-foot__block">
      <p class="site-foot__h"><span class="shape shape--square shape--sm" aria-hidden="true"></span>찾아오는 길</p>
      <p>서울 종로구 창신길 41, 모양학교<br>1층 구성실 · 2층 강의실 · 3층 공방 · 4층 교무실<br>동대문역 3번 출구에서 도보 6분</p>
    </div>
    <div class="site-foot__block">
      <p class="site-foot__h"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>운영 시간</p>
      <p>화–토 10:00–21:00 · 일 10:00–18:00<br>월 휴관(공방 정비)<br>수료전 관람 화–일 11:00–19:00</p>
    </div>
    <div class="site-foot__block">
      <p class="site-foot__h"><span class="shape shape--tri shape--sm" aria-hidden="true"></span>연락</p>
      <p><a href="tel:027651923">02-765-1923</a><br><a href="mailto:office@moyang.school">office@moyang.school</a></p>
    </div>
  </div>
  <nav class="site-foot__rooms" aria-label="방 목록">
    <a class="site-foot__room" href="pages/dashboard.html"><span class="site-foot__room-no"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>01</span>교무 대시보드</a>
    <a class="site-foot__room" href="pages/inbox.html"><span class="site-foot__room-no"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>02</span>메시지함</a>
    <a class="site-foot__room" href="pages/kanban.html"><span class="site-foot__room-no"><span class="shape shape--square shape--sm" aria-hidden="true"></span>03</span>수료전 설치 보드</a>
    <a class="site-foot__room" href="pages/onboarding.html"><span class="site-foot__room-no"><span class="shape shape--tri shape--sm" aria-hidden="true"></span>04</span>입학 신청</a>
    <a class="site-foot__room" href="pages/pricing.html"><span class="site-foot__room-no"><span class="shape shape--square shape--sm" aria-hidden="true"></span>05</span>수강료</a>
    <a class="site-foot__room" href="pages/product.html"><span class="site-foot__room-no"><span class="shape shape--square shape--sm" aria-hidden="true"></span>06</span>교본 상점</a>
    <a class="site-foot__room" href="pages/profile.html"><span class="site-foot__room-no"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>07</span>차은호 포트폴리오</a>
    <a class="site-foot__room" href="pages/settings.html"><span class="site-foot__room-no"><span class="shape shape--square shape--sm" aria-hidden="true"></span>08</span>설정</a>
    <a class="site-foot__room" href="pages/404.html"><span class="site-foot__room-no"><span class="shape shape--tri shape--sm" aria-hidden="true"></span>09</span>길 잃은 도형</a>
  </nav>
  <div class="site-foot__base">
    <a class="site-foot__mark" href="index.html" aria-label="모양학교 처음으로"><span class="trio" aria-hidden="true"><span class="shape shape--tri"></span><span class="shape shape--square"></span><span class="shape shape--circle"></span></span>MOYANG</a>
    <span>© 2026 모양학교 · 기초조형 학교</span>
  </div>
</footer>
```
**pages 경로 차이**: 방 링크 `pages/xxx.html` → `xxx.html`, 바닥 워드마크 `index.html` → `../index.html`. 현재 페이지의 방 링크에 `aria-current="page"`. 그 외 글자·순서는 한 글자도 바꾸지 않는다.

### 셸 C — 오버레이(전체 메뉴 드로어 + 커맨드 팔레트) — `<script>` 바로 앞

**index.html**
```html
<div class="drawer" id="site-menu" data-layer role="dialog" aria-modal="true" aria-labelledby="site-menu-t" hidden>
  <div class="drawer__dim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head">
      <p class="drawer__title" id="site-menu-t">모양학교</p>
      <button class="icon-btn" type="button" data-close aria-label="메뉴 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="drawer__body">
      <nav class="nav-drawer__list" aria-label="전체 메뉴">
        <a class="nav-drawer__link" href="#gyobon"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>교본</a>
        <a class="nav-drawer__link" href="#yeonseup"><span class="shape shape--square shape--sm" aria-hidden="true"></span>연습 문제</a>
        <a class="nav-drawer__link" href="#jeonsijang"><span class="shape shape--tri shape--sm" aria-hidden="true"></span>전시장</a>
        <a class="nav-drawer__link" href="pages/dashboard.html">교무 대시보드<span class="nav-drawer__no">01</span></a>
        <a class="nav-drawer__link" href="pages/inbox.html">메시지함 <span class="count">3</span><span class="nav-drawer__no">02</span></a>
        <a class="nav-drawer__link" href="pages/kanban.html">수료전 설치 보드<span class="nav-drawer__no">03</span></a>
        <a class="nav-drawer__link" href="pages/onboarding.html">입학 신청<span class="nav-drawer__no">04</span></a>
        <a class="nav-drawer__link" href="pages/pricing.html">수강료<span class="nav-drawer__no">05</span></a>
        <a class="nav-drawer__link" href="pages/product.html">교본 상점<span class="nav-drawer__no">06</span></a>
        <a class="nav-drawer__link" href="pages/profile.html">차은호 포트폴리오<span class="nav-drawer__no">07</span></a>
        <a class="nav-drawer__link" href="pages/settings.html">설정<span class="nav-drawer__no">08</span></a>
      </nav>
    </div>
  </div>
</div>

<div class="command" id="command" data-layer role="dialog" aria-modal="true" aria-label="찾기" hidden>
  <div class="command__dim" data-close></div>
  <div class="command__panel">
    <div class="command__field">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/></svg>
      <input class="command__input" type="text" placeholder="방, 수강생, 동작 찾기" aria-label="찾을 말" autocomplete="off">
      <kbd>Esc</kbd>
    </div>
    <div class="command__list">
      <div class="command__group">
        <p class="command__group-head"><span class="shape shape--circle shape--sm" aria-hidden="true"></span>방</p>
        <a class="command__item" href="pages/dashboard.html" data-keywords="교무 대시보드 6주차"><span class="command__label">교무 대시보드</span><span class="command__meta">01</span></a>
        <a class="command__item" href="pages/inbox.html" data-keywords="메시지 강평"><span class="command__label">메시지함</span><span class="command__meta">02</span></a>
        <a class="command__item" href="pages/kanban.html" data-keywords="수료전 설치 칸반 출품"><span class="command__label">수료전 설치 보드</span><span class="command__meta">03</span></a>
        <a class="command__item" href="pages/onboarding.html" data-keywords="입학 13기 신청 칸딘스키"><span class="command__label">입학 신청</span><span class="command__meta">04</span></a>
        <a class="command__item" href="pages/pricing.html" data-keywords="수강료 가격 시간표"><span class="command__label">수강료</span><span class="command__meta">05</span></a>
        <a class="command__item" href="pages/product.html" data-keywords="상점 교본 블록 MS-K27"><span class="command__label">교본 상점</span><span class="command__meta">06</span></a>
        <a class="command__item" href="pages/profile.html" data-keywords="포트폴리오 차은호"><span class="command__label">차은호 포트폴리오</span><span class="command__meta">07</span></a>
        <a class="command__item" href="pages/settings.html" data-keywords="설정 알림 계정"><span class="command__label">설정</span><span class="command__meta">08</span></a>
        <a class="command__item" href="pages/404.html" data-keywords="404 길 잃은"><span class="command__label">길 잃은 도형</span><span class="command__meta">09</span></a>
      </div>
      <div class="command__group">
        <p class="command__group-head"><span class="shape shape--square shape--sm" aria-hidden="true"></span>수강생</p>
        <a class="command__item" href="pages/profile.html" data-keywords="차은호 은호"><span class="command__label">차은호</span><span class="command__meta">MY12-07</span></a>
        <a class="command__item" href="pages/dashboard.html" data-keywords="육서빈 미제출"><span class="command__label">육서빈 · T05 미제출</span><span class="command__meta">MY12-12</span></a>
        <a class="command__item" href="pages/dashboard.html" data-keywords="엄하진"><span class="command__label">엄하진</span><span class="command__meta">MY12-09</span></a>
      </div>
      <div class="command__group">
        <p class="command__group-head"><span class="shape shape--tri shape--sm" aria-hidden="true"></span>동작</p>
        <button class="command__item" type="button" data-theme-toggle data-keywords="다크 밤 낮 테마"><span class="command__label">낮 · 밤 바꾸기</span></button>
        <button class="command__item" type="button" data-toast data-toast-kind="done" data-toast-title="T06 미제출 9명에게 알림을 보냈습니다" data-toast-msg="마감 10월 16일 (금) 18:00" data-keywords="알림 미제출"><span class="command__label">T06 미제출 9명에게 알림 보내기</span></button>
      </div>
      <p class="command__empty" hidden>맞는 결과가 없습니다. 방 이름이나 수강생 번호(MY12-07)로 찾아 보세요.</p>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 고르기</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></div>
  </div>
</div>
```
**pages 경로 차이**: `#gyobon` → `../index.html#gyobon`(연습 문제·전시장도 같게), `pages/xxx.html` → `xxx.html`. 드로어의 현재 페이지 링크에 `aria-current="page"`. 그 외 동일.

### 셸 D — 사이드바 (dashboard · inbox · kanban · settings 전용, pages 경로)
```html
<div class="with-side">
  <aside class="scroll-host">
    <nav class="side" aria-label="교무 메뉴" data-scroller>
      <div class="side__head">
        <span class="side__axis" aria-hidden="true">교무</span>
        <div class="side__info"><strong>임소정</strong><span>교무 매니저</span><span>12기 · 6주차</span></div>
      </div>
      <div class="side__group">
        <p class="side__label">교무</p>
        <a class="side__link" href="dashboard.html" aria-current="page"><span class="shape shape--circle shape--sm" aria-hidden="true"></span><span class="side__text">6주차 판</span></a>
        <a class="side__link" href="inbox.html"><span class="shape shape--circle shape--sm" aria-hidden="true"></span><span class="side__text">강평 메시지함</span><span class="count" aria-label="읽지 않음 3건">3</span></a>
        <a class="side__link" href="kanban.html"><span class="shape shape--square shape--sm" aria-hidden="true"></span><span class="side__text">수료전 설치 보드</span></a>
        <a class="side__link" href="settings.html"><span class="shape shape--square shape--sm" aria-hidden="true"></span><span class="side__text">설정</span></a>
      </div>
      <div class="side__group">
        <p class="side__label">학교</p>
        <a class="side__link" href="onboarding.html"><span class="shape shape--tri shape--sm" aria-hidden="true"></span><span class="side__text">입학 신청</span></a>
        <a class="side__link" href="pricing.html"><span class="shape shape--square shape--sm" aria-hidden="true"></span><span class="side__text">수강료</span></a>
        <a class="side__link" href="product.html"><span class="shape shape--square shape--sm" aria-hidden="true"></span><span class="side__text">교본 상점</span></a>
        <a class="side__link" href="profile.html"><span class="shape shape--circle shape--sm" aria-hidden="true"></span><span class="side__text">차은호 포트폴리오</span></a>
      </div>
      <p class="side__foot">수료전까지 <span class="mono">D-44</span></p>
    </nav>
  </aside>
  <div class="with-side__main">
    <!-- 페이지 머리(1-4) + 장면 본문 -->
  </div>
</div>
```
`aria-current="page"`는 현재 페이지 링크 하나에만 둔다. 사이드바 페이지에서는 `.page-head`를 `with-side__main` 안에 넣는다.

---

## 6. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮 ↔ 밤(○ ↔ □ 모핑), localStorage `moyang-theme` |
| `[data-open="id"]` / `[data-close]` | `[data-layer]` 루트(모달·드로어·커맨드) 열고 닫기. Esc · 딤 클릭 · 포커스 가두기 · 복귀 |
| ⌘K / Ctrl+K | `.command[data-layer]` 열기/닫기 |
| `[role=tablist]` | 탭 전환·키보드 |
| `.acc__head` | 아코디언(`.acc[data-single]`) |
| `[data-toast]` · `Moyang.toast({})` | 토스트 |
| `[data-menu="id"]` · `[data-popover="id"]` | 메뉴·팝오버(바깥 클릭·Esc·위치 보정) |
| `.tip` | 툴팁 aria-describedby·Esc |
| `.carousel` · `[data-carousel-prev/next]` | 캐러셀 |
| `th[data-sort]` · `table[data-row-select]` | 표 정렬·행 선택 |
| `[data-calendar]` | 달력 그리기·선택·달 이동 |
| `.kanban` | 끌어 옮기기·Alt+방향키 |
| `form[data-validate]` | 검증·오류 문구·완료 토스트 |
| `.stepper` | 수량 |
| `[data-wizard]` | 단계 마법사 |
| `[data-paint]` | 칸딘스키 칠하기 |
| `.marquee` · `[data-marquee-toggle]` | 띠 복제·일시정지 |
| `[data-assemble]` + `[data-piece]` · `[data-fill]` · `[data-replay="id"]` | 조립·막대 채움(진입 1회)·다시 재생 |
| `[data-copy]` | 코드 복사 |
| `[data-choose="pressed|current|selected"]` + `[data-choice]` | 묶음 안 하나만 선택 |
| `[data-toggle="id"]` (`data-toggle-class`) | 펼침/클래스 토글(예: 교구 치수 도면 켜기) |
| `.scroll-host` (+ `[data-scroller]`) | 가로 넘침 시 노랑 △ 힌트 |
| `[data-busy-demo="완료 문구"]` | 1.4초 불러오는 중 시연 |
| `[data-pager]` | 쪽 넘김 |
| `[data-dismiss]` | 알림 닫기 |
| `[data-motion-state]` | 움직임 줄이기 설정 표기 |

이벤트: `layer:open` `layer:close` `cal:select` `wizard:step` `wizard:done` `choose` `page`.

---

## 7. 쓰지 말 것

- 그림자(소프트·하드 오프셋 모두), 그라디언트, blur, 4·8·12px 같은 중간 반경, 점·격자 배경 패턴, 투명도로 색 섞기, 15°·-8° 같은 회전(사선은 index 포스터 45° 막대 1개와 404만).
- 알약 버튼·알약 배지, 우하단 원형 FAB.
- 노랑 사각·파랑 삼각 등 칸딘스키 짝 어긋남. 노랑 면 위 흰 글자. 밤 장면의 파랑 글자.
- 다크에서 표 헤더·띠를 흰색으로 뒤집기(inverse는 raised 면 + 6px 분필 막대).
- Do Hyeon 굵게(합성 볼드), 한글에 넓은 자간·모노·대문자 라벨.
- 섹션 머리 가운데 정렬, "작은 라벨 → 제목 → 부제" 3단 헤더, "§ 번호 + 제목" 반복, eyebrow + 헤드라인 + CTA 2개 + 칩.
- 같은 크기 카드를 균일하게 진열하는 갤러리(구성판은 블록 크기를 내용에 맞춰 1×1 ~ 4×2로 다르게).
- `href="#"`, 인라인 onclick, 인라인 `grid-template-columns`, 이모지, 외부 아이콘, 이미지 파일.
- SVG `stroke="var(--x)"` 같은 presentation attribute 속 var().
