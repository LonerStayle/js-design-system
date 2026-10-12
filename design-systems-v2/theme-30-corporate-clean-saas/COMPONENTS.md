# ledgerline · 컴포넌트 마크업 계약

다음 단계(index.html, pages/*.html) 에이전트는 이 문서만 보고 마크업한다. 세계관·카피 기준은 `DIRECTION.md`.
CSS 클래스는 BEM(`block__elem--mod`). 상태는 가능한 한 **ARIA 속성**으로 표현하고 CSS가 그 속성을 읽는다.
인라인 `style`은 CSS 변수 주입(`--value`, `--w` 등)에만 쓴다. 인라인 grid-template-columns, onclick, `href="#"`는 쓰지 않는다.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>결재함 · ledgerline</title>
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('ll-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../styles.css">        <!-- index 는 styles.css -->
<link rel="stylesheet" href="inbox.css">            <!-- 장면 전용 (index 는 index.css) -->
<script src="../app.js" defer></script>
</head>
```
- `localStorage` 키 `ll-theme`. URL `?theme=dark|light` 가 최우선(저장 안 함).
- 장면 CSS(`index.css`, `pages/<name>.css`)도 semantic 토큰만 쓴다(`--surface`, `--text-2`, `--line` …). 원시 램프(`--gray-*`)·hex 금지.

## 1. 토큰 요약 (semantic.css)

| 용도 | 토큰 |
|---|---|
| 면 | `--canvas` (앱 외곽·좌측 목차) `--surface` (본문) `--surface-raised` (오버레이) `--surface-sunken` (표 머리·코드 인라인) `--surface-hover` |
| 반전 면 | `--surface-ink` / `--on-surface-ink` `--on-surface-ink-2` `--on-surface-ink-link` (툴팁·토스트·일괄 액션바) |
| 괘선 | `--line` 1px 행 사이 · `--line-strong` 결재란·합계 · `--line-control` 입력 테두리 · `--rule-head` 장부 머리줄 2px |
| 글자 | `--text` `--text-2` `--text-3` `--placeholder` |
| 강조 | `--primary` (링크·선택·포커스) `--primary-hover` `--primary-tint` (선택 행) `--primary-fill`/`--on-primary-fill` (세그먼트 선택 채움) |
| 주요 버튼 | `--ink` `--ink-hover` `--on-ink` |
| 도장 전용 | `--stamp` `--stamp-tint` `--stamp-on-ink` — **도장 외 사용 금지** |
| 상태 | `--success(-tint)` `--warning(-tint)` `--danger(-tint)` `--info(-tint)` `--on-success` `--on-danger` |
| 차트 | `--chart-actual`(실선) `--chart-budget`(점선) `--chart-prev`(점선 4 3) `--chart-2` `--chart-3` `--chart-grid` |
| 오버레이 | `--scrim` `--overlay-border` `--shadow-overlay`(다크에서 none) |
| 스케일 | `--fs-display 56` `--fs-kpi 40` `--fs-h1 36` `--fs-h2 24` `--fs-h3 17` `--fs-body-lg 15` `--fs-body 14` `--fs-data 13` `--fs-caption 12` `--fs-micro 11` / `--sp-1..8` = 4·8·12·16·24·40·64·96 / `--r-badge 4` `--r-control 6` `--r-panel 8` / `--topbar-h 56` `--sidebar-w 232` |
| 모션 | `--dur-1 90` `--dur-2 160` `--dur-3 240` `--ease-out` `--ease-stamp` |

**SVG 차트**: presentation attribute 에 `var()` 금지. `<path style="stroke:var(--chart-actual)">` 또는 `stroke="currentColor"` + 부모 `color`.

## 2. base.css 프리미티브

| 클래스 | 설명 |
|---|---|
| `.t-display .t-kpi .t-h1 .t-h2 .t-h3 .t-body-lg .t-data .t-caption .t-micro` | 타입 스케일. `.t-2` `.t-3` 보조색, `.t-strong` |
| `.mono` `.tnum` | Geist Mono(문서번호·카드번호·시각) / tabular 숫자 |
| `.amount` `.amount--neg` `.amount--lg` `.amount--display` | 금액. 음수는 `−₩42,000` + `.amount--neg`(빨강 아님) |
| `.l-grid` + `.span-3/4/5/7/8/9/12` | 12단(거터 24/16). **4:8, 3:9, 5:7, 8:4 만**. ≤1024 에서 전폭 스택. `.span-md-4/6/8` 태블릿 |
| `.l-stack` (`--2/3/5/6/7`) `.l-row` (`--between/--end`) `.l-push` `.l-measure`(720) `.l-measure-wide`(1040) `.l-pad` | 스택·행·폭 |
| `.app` > `.navbar` + `.marquee`(선택) + `.sidebar` + `main.app__main` | 앱 셸 (상단바 56 + 사이드바 232) |
| `.page-head` > `.page-head__title`(crumbs + h1 + `.page-head__meta`) + `.page-head__actions` | 페이지 머리말: 제목(좌) ↔ 액션(우), 하단 괘선 |
| `.sec-head` (+`--hang`) > `.sec-num` + h2 | 행잉 섹션 번호 `§2.4` (데스크톱에서 64px 거터로 내어 닮) |
| `.ledger-head` `.ledger-rule` `.ledger-total` | 2px 머리줄 / 1px 괘선 / 합계 이중선 |
| `dl.kv` (`.kv--head`) > `dt` + `dd` (`dd.kv__left`, `.kv__total`) | 원장 정의목록: 라벨 좌 — 값 우 tnum |
| `[data-density="compact|default|roomy"]` | 하위 표·리스트 행 높이 `--row` 32/40/48 |
| `.avatar` (`--md` `--lg`, `data-tone="1..4"`) | 이니셜 사각 24px, radius 4. 내용은 이름 2자(`하늘`) |
| `.hide-sm` `.show-sm` (≤768) `.hide-md` `.show-md` (≤1024) `.sr-only` `.skip-link` `.truncate` `.dot` | 유틸 |

### 아이콘
`<span data-icon="search"></span>` → app.js 가 16px 라인 SVG(currentColor)로 채우고 `aria-hidden` 처리. `.icon--sm` 14 / `.icon--lg` 20.
이름: `search bell sun moon close chevron-left chevron-right chevron-down chevron-up check plus minus more grip menu info alert x-circle check-circle copy upload download pause play arrow-right arrow-left arrow-up-right doc receipt card inbox grid columns sliders user users calendar stamp filter lock help building code trash edit refresh chart link logout clock send paperclip external keyboard sort wallet`
아이콘만 있는 버튼은 반드시 `aria-label`. 이모지 금지.

### 시그니처 A — 결재란 `.apv` (base.css)
```html
<div class="apv" id="apv-0412" role="group" aria-label="EXP-2610-0412 결재란">
  <div class="apv__cell" data-status="approved"><span class="apv__role">담당</span><span class="apv__box"><span class="stamp">하늘</span></span><span class="apv__name">김하늘</span><time class="apv__time">10.27 09:12</time></div>
  <div class="apv__cell" data-status="delegated"><span class="apv__role">팀장</span><span class="apv__box"></span><span class="apv__name">최민재</span></div>
  <div class="apv__cell" data-status="current" data-name="박도윤"><span class="apv__role">재무</span><span class="apv__box"></span><span class="apv__name">박도윤</span></div>
  <div class="apv__cell" data-status="pending" data-name="이서진"><span class="apv__role">대표</span><span class="apv__box"></span><span class="apv__name">이서진</span></div>
</div>
```
- `data-status`: `approved`(도장) · `pending`(점선 원) · `current`(코발트 tint + 하단 2px, "차례") · `rejected`(`.stamp.stamp--reject` "반려") · `delegated`(전결 사선).
- 크기: 기본 64px 칸(≤768 자동 52px), `.apv--sm` 52px. `.apv--block` 은 block flex. 확대(index 해부도)는 장면 CSS에서 `--apv-cell-w` `--apv-head-h` `--apv-box-h` `--stamp-d` 재정의.
- 선택 머리칸: 첫 자식으로 `<span class="apv__title">결재</span>` (세로쓰기).
- 도장 `.stamp` 내용은 **이름 2자**. `.stamp--sm`(24) `.stamp--xs`(16) `.stamp--lg`(72) `.stamp--reject`. 인주색은 도장에만.
- 동작: `<button data-approve="apv-0412">` → current 칸에 도장 찍힘 모션 + 다음 pending 을 current 로 + 도장 토스트("승인 완료 · 다음 결재: 이서진"). 버튼 안 `<span data-label>` 가 있으면 최종 승인 후 "결재 완료"로 바뀌고 disabled. `data-toast`/`data-toast-text` 로 문구 덮어쓰기. `data-busy="800"` 을 같이 주면 로딩 후 실행.
- `<button data-reject="apv-0412" data-reason="참석자 명단 누락">` → 반려 인 + 위험 토스트.
- `<button data-stamp-play="apv-0412">` 도장 재생. 컨테이너에 `data-stamp-on-view` → 화면에 들어올 때 1회 순차 찍힘(index 문서 머리 결재란).

---

## 3. 컴포넌트 32종

### accordion — 괘선 행 펼침
```html
<div class="acc" data-single>           <!-- data-single: 하나만 열림. .acc--plain: 머리줄 1px. .acc--coded: 코드열 정렬 -->
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__trigger" aria-expanded="true" aria-controls="acc-811">
      <span class="acc__code">811</span><span class="acc__label">복리후생비</span><span class="acc__meta">1인 월 ₩100,000</span><span class="acc__sign"></span>
    </button></h3>
    <div class="acc__panel" id="acc-811"><p>…</p></div>
  </div>
</div>
```
app.js: 클릭 토글, `hidden` 동기화, ↑↓ Home End 이동. 비활성 = `disabled`.

### alert — 전폭 띠
```html
<div class="alert alert--warning" role="status">   <!-- --info --success --warning --danger --neutral, 상단 배너는 + .alert--banner -->
  <span class="alert__icon" data-icon="alert"></span>
  <div class="alert__body"><strong class="alert__title">영수증 37건 누락</strong><span class="alert__text">마감 전까지 첨부되지 않으면 11월로 이월됩니다.</span><a class="alert__action" href="kanban.html">누락 건 보기</a></div>
  <button class="alert__close" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button>
</div>
```
danger 는 `role="alert"`. `data-dismiss` (값 없으면 가장 가까운 `.alert` 제거, `data-dismiss="id"` 지정 가능).

### badge
```html
<span class="badge badge--progress">결재중</span>
```
상태: `--submitted`(제출됨) `--progress`(결재중) `--approved`(승인) `--rejected`(반려) `--paid`(지급완료) `--missing`(영수증누락) / 범용 `--info --success --warning --danger`. 형태 `--sm --outline --plain --mono --count`.
결재 진행형: `<span class="badge badge--apv"><span class="apv-mini" aria-hidden="true"><i data-s="done"></i><i data-s="done"></i><i data-s="current"></i><i></i></span>2/4 승인</span>` (`data-s`: done · current · rejected · skip). `.apv-mini--lg` 10px 칸.

### breadcrumb
```html
<nav class="crumbs" aria-label="경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html">㈜한결물산</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="inbox.html">결재함</a></li>
  <li class="crumbs__item"><span class="crumbs__code" aria-current="page">EXP-2610-0412</span></li>
</ol></nav>
```
≤560px 에서 첫·마지막 두 단계만 남고 "/ … /" 로 축약.

### button
```html
<button class="btn btn--primary">승인 <kbd class="btn__kbd">⌘↵</kbd></button>
```
변형 `--primary`(잉크 채움) · 기본(보조) · `--ghost` · `--danger` · `--danger-quiet` · `--approve` · `--link`. 크기 `--sm`(32) 기본 40 `--lg`(48) `--icon`(정사각, aria-label 필수) `--block`.
상태: `:disabled`/`aria-disabled` → sunken 면 · `aria-busy="true"` → 좌측 스피너(라벨 유지) · `aria-pressed="true"` → 선택(토글) · `data-state="error"` → 실패 표시. `<span class="btn__count">12</span>`. 묶음 `.btn-group`.
`data-busy="1200"` 클릭 시 해당 ms 로딩 시연. 모바일·터치에서 최소 44px.

### calendar — 10월 마감 달력
```html
<div class="cal">
  <div class="cal__head"><h3 class="cal__title">2026년 10월</h3><span class="cal__summary">412건 · ₩184,320,500</span>
    <button class="btn btn--ghost btn--icon btn--sm" aria-label="이전 달"><span data-icon="chevron-left"></span></button>…</div>
  <div class="cal__grid" role="group" aria-label="2026년 10월 날짜">
    <div class="cal__dow cal__dow--sun">일</div> … <div class="cal__dow cal__dow--sat">토</div>
    <div class="cal__day cal__day--muted"><span class="cal__date">28</span></div>        <!-- 이전 달: div -->
    <button class="cal__day has-items" data-date="2026-10-27" data-summary="10월 27일 · 9건 · ₩3,710,700" aria-label="10월 27일 9건">
      <span class="cal__date">27</span><span class="cal__count">9건</span><span class="cal__sum">₩3,710,700</span><span class="cal__bar" style="--v:42%"></span>
    </button>
    <button class="cal__day cal__day--deadline" …><span class="cal__flag">마감</span><span class="cal__date">31</span></button>
  </div>
  <p class="cal__legend"><span><i class="is-today"></i>오늘</span><span><i class="is-deadline"></i>마감</span><span><i class="is-selected"></i>선택</span><span data-cal-output></span></p>
</div>
```
오늘 `aria-current="date"`, 선택 `aria-pressed="true"`(app.js 단일 선택, ←→↑↓ Home End), 공휴일 `--holiday` + `.cal__flag`(개천절·한글날), 일/토 `--sun --sat`. 모바일(≤640)은 44px 칸 + 점(`has-items`). 2026-10-01 은 목요일. `.cal--mini` 날짜 선택기.

### card — 결재 문서 카드 (박스는 이것만)
```html
<article class="doc">                    <!-- a.doc 가능. .doc--compact / .doc--sheet(문서 전문) / aria-selected="true" 선택 / data-state="rejected" -->
  <div class="doc__head">
    <div class="doc__titles"><span class="doc__code">EXP-2610-0412</span><h3 class="doc__title">지출결의서 · 거래처 접대</h3><span class="doc__meta"><span>영업2팀 최민재</span><span>10.27 상신</span></span></div>
    <div class="apv apv--sm">…</div>
  </div>
  <div class="doc__body">
    <div class="doc__rows"><div class="doc__row"><span class="doc__row-label"><b>도담한정식 광화문</b>10.27 19:42 · CARD ****-4821</span><span class="doc__row-value">₩168,000</span></div>…</div>
    <div class="doc__total"><span>합계</span><span class="amount">₩186,000</span></div>
  </div>
  <div class="doc__foot"><span>계정과목 접대비 · 참석 4인</span><button class="btn btn--sm btn--primary" data-approve="…">승인</button></div>
</article>
```

### carousel — 감열지 영수증
```html
<div class="carousel">
  <div class="carousel__viewport" aria-label="EXP-2610-0412 영수증">
    <div class="carousel__slide" data-caption="도담한정식 광화문 · 10.27 19:42">
      <div class="receipt"><p class="receipt__shop">도담한정식 광화문</p><p class="receipt__center">사업자 104-81-23456</p><hr class="receipt__rule">
        <p class="receipt__row"><span>한정식 코스 B ×4</span><span>168,000</span></p><hr class="receipt__rule">
        <p class="receipt__row receipt__total"><span>합계</span><span>186,000</span></p><div class="receipt__barcode"></div>
        <span class="receipt__flag">흐림</span></div>
    </div>
    <div class="carousel__slide" data-caption="참석자 명단"><div class="receipt receipt--missing">참석자 명단 사진이<br>아직 없습니다</div></div>
  </div>
  <div class="carousel__bar"><span class="carousel__count"></span><span class="carousel__caption"></span>
    <button class="btn btn--icon btn--sm" data-carousel-prev aria-label="이전 영수증"><span data-icon="chevron-left"></span></button>
    <button class="btn btn--icon btn--sm" data-carousel-next aria-label="다음 영수증"><span data-icon="chevron-right"></span></button></div>
</div>
```
app.js: 스냅 스크롤 추적, `2 / 5` 카운터(aria-live), 캡션, 버튼 disabled, 뷰포트 ←→ Home End. `.carousel__dots` 빈 요소를 두면 점 자동 생성. 슬라이드 폭 `style="--slide-w:70%"`.

### code — 다크 패널
```html
<div class="code">
  <div class="code__head"><div class="code__tabs"><span class="code__file code__file--active">expense.approved.json</span></div><span class="code__lang">JSON</span>
    <button class="code__copy" data-copy><span data-icon="copy"></span><span data-copy-label>복사</span></button></div>
  <pre class="code__body" tabindex="0"><code><span class="tok-k">"type"</span><span class="tok-p">:</span> <span class="tok-s">"expense.approved"</span></code></pre>
</div>
```
토큰 `.tok-k`(키) `.tok-s`(문자열) `.tok-n`(숫자) `.tok-c`(주석) `.tok-p`(구두점). 줄번호: `pre.code__body--lines` + 각 줄 `<span class="ln">`(강조 `.ln.is-hl`). `data-copy="id"` 로 다른 요소 복사, `data-copy-text="…"` 직접 지정. 복사 후 1.5초 "복사됨".

### command — ⌘K 팔레트 (페이지당 1개, `id="command"`)
```html
<button class="command-trigger" data-command-open aria-label="검색 열기"><span data-icon="search"></span><span>문서번호·직원·가맹점 검색</span><kbd>⌘K</kbd></button>

<div class="command" id="command" hidden role="dialog" aria-modal="true" aria-label="문서 검색">
  <div class="command__panel">
    <div class="command__search"><span data-icon="search"></span><input class="command__input" autofocus placeholder="문서번호, 직원, 가맹점, 명령"><kbd>Esc</kbd></div>
    <div class="command__list">
      <div class="command__group"><p class="command__group-label">최근 문서</p>
        <a class="command__item" href="inbox.html"><span data-icon="doc"></span><span class="command__item-code">EXP-2610-0412</span><span class="command__item-label">도담한정식 광화문 · 최민재</span><span class="command__item-meta">₩186,000</span></a>
      </div>
      <div class="command__group"><p class="command__group-label">명령</p>
        <button class="command__item" type="button" data-keywords="일괄 승인 approve" data-toast="…"><span data-icon="stamp"></span><span class="command__item-label">결재 대기 일괄 승인</span><kbd>⌘↵</kbd></button>
      </div>
      <p class="command__empty" hidden>‘<strong data-command-query></strong>’에 맞는 문서·직원이 없습니다.</p>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 이동</span><span><kbd>↵</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></div>
  </div>
</div>
```
app.js: ⌘K/Ctrl+K 토글, combobox+listbox ARIA 자동, 입력 필터(라벨+`data-keywords`), 일치 부분 `<mark>`, 빈 그룹 숨김, ↑↓ Enter, 항목 실행 후 닫힘(`data-keep-open` 예외). 항목은 `a[href]` 또는 다른 data 훅(`data-open`, `data-toast`, `data-theme-toggle`)을 가진 button.

### drawer — 우측 480px 문서 상세
```html
<button class="btn" data-open="dr-0412" aria-controls="dr-0412" aria-expanded="false">상세</button>
<div class="drawer" id="dr-0412" hidden role="dialog" aria-modal="true" aria-labelledby="dr-0412-t">   <!-- .drawer--left: 좌측 목차 드로어(모바일) -->
  <div class="drawer__panel">
    <div class="drawer__head"><span class="drawer__code">EXP-2610-0412</span><h2 class="drawer__title" id="dr-0412-t">지출결의서</h2>
      <div class="drawer__head-actions"><button class="btn btn--ghost btn--icon" data-close aria-label="닫기"><span data-icon="close"></span></button></div></div>
    <div class="drawer__body"><p class="drawer__section-title">결재선</p><ol class="steps-apv apv" id="apv-d">…</ol><dl class="kv kv--head">…</dl></div>
    <div class="drawer__foot"><span class="drawer__foot-sum">결재 금액<span class="amount">₩186,000</span></span><button class="btn" data-reject="apv-d">반려</button><button class="btn btn--primary" data-approve="apv-d">승인</button></div>
  </div>
</div>
```

### empty — 빈 결재란 그림 + 한 줄 + 행동 1개 (좌측 정렬)
```html
<div class="empty">                 <!-- --search 검색 결과 없음 / --locked 권한 없음 / --stack 세로 -->
  <span class="empty__art"><span class="empty-apv" aria-hidden="true"><span data-role="담당"></span><span data-role="팀장"></span><span data-role="재무"></span><span data-role="대표"></span></span></span>
  <p class="empty__title">이번 달 제출한 경비가 없습니다</p>
  <p class="empty__text">법인카드 승인 내역이 들어오면 초안이 자동으로 만들어집니다.</p>
  <div class="empty__actions"><a class="btn btn--primary" href="onboarding.html">경비 직접 작성</a></div>
</div>
```

### form
```html
<form class="l-stack" data-validate data-success="지출결의서를 상신했습니다" data-success-text="EXP-2610-0413" novalidate>
  <div class="form-row">
    <div class="field"><label class="field__label" for="amt">사용 금액<span class="field__req">*</span></label>
      <div class="affix affix--amount"><span class="affix__pre">₩</span><input class="input" id="amt" data-format="krw" data-max="500000" required></div>
      <p class="field__hint">부가세 포함</p><p class="field__error" id="amt-err"></p></div>
    <div class="field"><label class="field__label" for="biz">사업자등록번호</label><input class="input input--mono" id="biz" data-mask="biz" placeholder="000-00-00000"><p class="field__error"></p></div>
  </div>
  <div class="field"><label class="field__label" for="acc">계정과목</label><div class="select"><select class="input" id="acc">…</select></div></div>
  <div class="field"><label class="field__label" for="memo">사용 목적 <span class="field__count" data-count-for="memo"></span></label><textarea class="input" id="memo" maxlength="200"></textarea></div>
  <div class="field"><span class="field__label">영수증</span>
    <label class="dropzone"><input class="dropzone__input" type="file" accept="image/*,.pdf" multiple data-max-mb="10"><span class="dropzone__icon" data-icon="receipt"></span>
      <span><span class="dropzone__title">영수증을 끌어다 놓거나 선택하세요</span><br><span class="dropzone__meta">JPG · PNG · PDF, 10MB 이하</span></span></label>
    <ul class="dropzone__files"></ul><p class="field__error"></p></div>
  <div class="check-group check-group--row">
    <label class="check"><input class="check__input" type="checkbox"><span>참석자 명단 첨부</span></label>
    <label class="check"><input class="check__input" type="radio" name="p"><span class="check__text">개인 부담 없음<span class="check__desc">설명</span></span></label>
    <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked><span>결재 알림</span><span class="switch__state"></span></label>
  </div>
  <div class="form-actions"><span class="form-actions__note">자동 저장 14:05</span><button type="button" class="btn">임시 저장</button><button class="btn btn--primary">상신</button></div>
</form>
```
- 입력 `.input` (`--sm --lg --mono --num`), 상태: `:focus` 코발트 링 · `aria-invalid="true"` / `.field--error` · `:disabled` · `[readonly]` · `.field--success`.
- `data-format="krw"` 천단위 콤마 · `data-mask="biz|card|phone|corp"` · `data-max` 금액 한도 검증 · `data-error="문구"` 커스텀 메시지 · `data-count-for` 글자 수.
- `form[data-validate]`: 제출 시 required·mask·pattern·email 검증 → `.field__error` 채움, 첫 오류 포커스, 통과 시 제출 버튼 aria-busy → `data-success` 토스트 + `ll:submit` 이벤트. 폼 상단 요약이 필요하면 `<div data-form-summary hidden>…<span data-form-summary-count></span></div>`.
- 묶음: `fieldset.form-section` > `legend.form-section__legend`. 범위 슬라이더: `<input type="range" class="range" data-range-output="out-id" data-range-unit="명">` + `.range-scale`.
- 위험 확인: `<input data-confirm-match="EXP-2610-0412">` 와 같은 `.modal`/`form` 안의 `<button data-confirm-target disabled>` 가 일치 시 활성.

### kanban — 정산 파이프라인
```html
<div class="kanban" aria-label="정산 파이프라인">
  <section class="kanban__col" data-name="증빙 확인">
    <div class="kanban__head"><h3 class="kanban__title">증빙 확인</h3><span class="kanban__sum"></span><span class="kanban__count"></span><span class="kanban__note">영수증 대조 중</span></div>
    <div class="kanban__list">
      <article class="kcard" data-amount="1240000" data-state="warn" data-name="바른인쇄 을지로">
        <div class="kcard__top"><span class="kcard__code">EXP-2610-0398</span><span class="kcard__apv"><span class="apv-mini" aria-hidden="true"><i data-s="current"></i><i></i><i></i></span>0/3</span></div>
        <p class="kcard__title">바른인쇄 을지로</p>
        <p class="kcard__meta"><span class="avatar">세린</span>오세린 · 도서인쇄비</p>
        <div class="kcard__badges"><span class="badge badge--sm badge--missing">영수증누락</span></div>
        <div class="kcard__amount"><span>10.24</span><span class="amount">₩1,240,000</span></div>
      </article>
      <p class="kanban__empty">이 단계에 있는 경비가 없습니다</p>   <!-- 카드가 있으면 자동 숨김 -->
    </div>
  </section>
</div>
```
app.js: `.kanban__count`(n건)·`.kanban__sum`(₩합계)를 `data-amount` 로 자동 계산. 마우스 드래그(점선 자리표시 + 열 하이라이트), 키보드 Space 집기 → ←→ 단계 / ↑↓ 순서 → Space 놓기, Esc 취소, ↑↓←→ 로 카드 간 이동. aria-live 안내 자동. 이동 시 `ll:kanban-move` 이벤트(detail.to). 모바일은 84% 폭 가로 스냅(컨테이너 안 스크롤).

### list — 괘선 행 리스트
```html
<ul class="list list--ledger" role="listbox" aria-label="받은 결재">   <!-- 선택형이 아니면 role 생략, 행은 a.list__row -->
  <li class="list__item"><div class="list__row is-unread" role="option" aria-selected="true" data-value="EXP-2610-0412">
    <span class="avatar" data-tone="1">민재</span>
    <span class="list__main"><span class="list__title"><span>도담한정식 광화문 거래처 접대</span></span>
      <span class="list__meta"><span class="mono">EXP-2610-0412</span><span>영업2팀 최민재</span><span>10.27</span></span></span>
    <span class="list__trail"><span class="list__amount">₩186,000</span><span class="apv-mini">…</span></span>
  </div></li>
</ul>
```
`.list__row--plain`(아바타 없음) · `.list__row--setting`(라벨 + 토글) · `.list__desc` · `.list__sub` · `.list__group`(날짜 머리, sticky) · `.list--compact`. 선택형은 클릭/↑↓ 로 단일 선택 + `ll:list-select`. 현재 페이지 링크는 `aria-current="page"`.

### marquee — 실시간 카드 승인 티커 (navbar 바로 아래)
```html
<div class="marquee" aria-label="실시간 법인카드 승인">
  <span class="marquee__label"><span class="dot"></span><span class="marquee__label-text">실시간 승인</span></span>
  <div class="marquee__viewport"><div class="marquee__track"><ul class="marquee__list">
    <li class="marquee__item"><span class="marquee__time">14:02</span><span class="marquee__who">영업2팀 최민재</span>도담한정식 광화문<span class="marquee__amount">₩186,000</span></li>
    <!-- --warn(한도 임박) / --neg(취소 −₩) -->
  </ul></div></div>
  <button class="marquee__toggle" aria-label="승인 티커 일시정지" aria-pressed="false"><span data-icon="pause"></span></button>
</div>
```
app.js: 목록 복제(aria-hidden)로 무한 루프, 길이 비례 속도, 토글 버튼(재생/정지 아이콘·라벨 교체), hover/focus 정지, reduced-motion 시 정지 + 가로 스크롤. `.app` 안에서는 사이드바 sticky 위치가 자동 보정된다.

### menu — 드롭다운 (role="menu")
```html
<button class="workspace" data-menu="ws-menu" aria-haspopup="menu" aria-expanded="false"><span class="workspace__logo">한</span><span class="workspace__name" data-menu-label>㈜한결물산</span><span class="workspace__caret"></span></button>
<div class="menu" id="ws-menu" role="menu" hidden aria-label="워크스페이스" data-align="start">
  <div class="menu__group" role="group"><p class="menu__label">워크스페이스</p>
    <button class="menu__item" role="menuitemradio" aria-checked="true" data-value="㈜한결물산"><span class="menu__item-label">㈜한결물산</span></button></div>
  <div class="menu__group"><button class="menu__item" role="menuitem"><span data-icon="edit"></span><span class="menu__item-label">이름 변경</span><kbd>R</kbd></button></div>
  <div class="menu__group"><button class="menu__item menu__item--danger" role="menuitem" data-open="m-delete"><span data-icon="trash"></span><span class="menu__item-label">문서 삭제</span></button></div>
</div>
```
메뉴 요소는 `body` 직속(또는 어디든) — `position: fixed` 로 트리거 아래 자동 배치(`data-align="end"` 우측 정렬). ↓↑ Home End 첫 글자, Esc(포커스 복귀), Tab 닫힘, 바깥 클릭 닫힘. `menuitemradio`/`menuitemcheckbox` 의 `aria-checked` 자동, `data-value` 는 트리거의 `[data-menu-label]` 에 반영. `ll:menu` 이벤트.

### modal
```html
<div class="modal" id="m-delete" hidden role="dialog" aria-modal="true" aria-labelledby="m-delete-t">   <!-- .modal--wide 760 / .modal--narrow 420 / .modal--danger 위험확인 -->
  <div class="modal__panel">
    <div class="modal__head"><div class="modal__titles"><span class="modal__code">WS-HANGYEOL</span><h2 class="modal__title" id="m-delete-t">워크스페이스 해지</h2></div>
      <button class="btn btn--ghost btn--icon modal__close" data-close aria-label="닫기"><span data-icon="close"></span></button></div>
    <div class="modal__body"><p>… <span class="modal__confirm-code">EXP-2610-0412</span> 를 입력하세요.</p>
      <div class="field"><label class="field__label" for="cf">확인 문구</label><input class="input input--mono" id="cf" data-confirm-match="EXP-2610-0412" autofocus></div></div>
    <div class="modal__foot"><span class="modal__foot-note">되돌릴 수 없습니다</span><button class="btn" data-close>취소</button><button class="btn btn--danger" data-confirm-target disabled>해지</button></div>
  </div>
</div>
```
열기 `data-open="m-delete"`. 루트(딤) 클릭·Esc·`data-close` 로 닫힘(`data-static` 이면 딤/Esc 무시), 포커스 트랩, 스크롤 잠금, 닫으면 트리거로 포커스 복귀. 첫 포커스는 `[autofocus]` → 첫 포커스 가능 요소. ≤600px 바텀시트.

### motion — 공용 키프레임 + 시연
- 키프레임: `ll-stamp` `ll-row-new` `ll-cell-clear` `ll-spin` `ll-pulse` `ll-fade-up` `ll-toast-in` `ll-marquee` …
- 표 행 추가 하이라이트: `ll.addRow(tbodyId, '<tr>…</tr>')` 또는 `<button data-add-row="tbody-id" data-add-row-template="tpl-id">` + `<template id="tpl-id"><tr>…</tr></template>`.
- 숫자 변경 밑줄: `ll.flash(el, '₩184,506,500')` 또는 `<button data-flash="kpi-id">` + `<span id="kpi-id" data-values="₩184,320,500|₩184,506,500">`.
- 시연 패널: `.motion-demo` > `.motion-demo__cell` > `.motion-demo__name` `.motion-demo__spec` `.motion-demo__stage`(`--rows`) + `.motion-demo__note`(reduced-motion 일 때만 보임: "모션 줄이기 설정으로 최종 상태만 표시합니다").

### navbar
```html
<header class="navbar">
  <button class="btn btn--ghost btn--icon navbar__menu" data-open="app-sidebar" aria-controls="app-sidebar" aria-expanded="false" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
  <a class="brand" href="../index.html"><span class="brand__mark" aria-hidden="true"></span><span class="brand__word"><b>ledger</b><span>line</span></span></a>
  <span class="navbar__sep" aria-hidden="true"></span>
  <button class="workspace" data-menu="ws-menu" …>…</button>              <!-- ≤480 숨김: 사이드바 머리에 같은 전환 버튼을 두라 -->
  <nav class="navbar__links" aria-label="문서"><a class="navbar__link" href="…" aria-current="page">컴포넌트</a></nav>   <!-- 선택(index 상단바용), ≤1024 숨김 -->
  <div class="navbar__end">
    <button class="command-trigger" data-command-open aria-label="검색 열기">…</button>
    <button class="btn btn--ghost btn--icon navbar__notify" data-popover="pop-notify" aria-label="알림 7건" aria-expanded="false"><span data-icon="bell"></span><span class="navbar__count">7</span></button>
    <button class="btn btn--ghost btn--icon" type="button" data-theme-toggle aria-label="다크 모드로 전환" data-tooltip="다크 모드"><span data-icon="moon" data-show-theme="light"></span><span data-icon="sun" data-show-theme="dark"></span></button>
    <button class="navbar__user" data-menu="user-menu" aria-haspopup="menu" aria-expanded="false"><span class="avatar" data-tone="1">하늘</span><span class="navbar__user-name">김하늘</span></button>
  </div>
</header>
```
워드마크 옆 태그 `.brand__tag`(예: `UI 2.4.0`). 테마 토글은 app.js 가 aria-pressed·aria-label 갱신.

### pagination
```html
<nav class="pager" data-total="1284" data-size="40" data-page="1" aria-label="페이지">
  <span class="pager__range"></span>
  <label class="pager__size">페이지당 <span class="select"><select class="input input--sm" data-pager-size><option>20</option><option selected>40</option><option>100</option></select></span></label>
  <div class="pager__nav">
    <button class="pager__btn pager__step" data-pager-prev><span data-icon="chevron-left"></span>이전</button>
    <ol class="pager__pages"></ol><span class="pager__compact"></span>
    <button class="pager__btn pager__step" data-pager-next>다음<span data-icon="chevron-right"></span></button>
  </div>
</nav>
```
app.js 가 `1–40 / 1,284건`, 번호(현재 = 잉크 채움, …생략), 모바일 `3 / 33` 을 렌더. `ll:page` 이벤트.

### popover — 가맹점 정보 / 알림
```html
<button class="btn btn--link" data-popover="pop-merchant" aria-expanded="false" aria-controls="pop-merchant">도담한정식 광화문</button>
<div class="popover" id="pop-merchant" hidden role="dialog" aria-labelledby="pop-merchant-t" data-align="start">   <!-- .popover--wide 400 -->
  <div class="popover__head"><div class="popover__titles"><p class="popover__title" id="pop-merchant-t">도담한정식 광화문</p><p class="popover__sub">한식 · 서울 종로구</p></div>
    <button class="btn btn--ghost btn--icon btn--sm" data-close aria-label="닫기"><span data-icon="close"></span></button></div>
  <div class="popover__body"><dl class="kv"><dt>사업자번호</dt><dd class="mono">104-81-23456</dd><dt>이번 달 사용</dt><dd>₩1,128,000 · 6건</dd></dl></div>
  <div class="popover__foot"><span>최근 승인 10.27</span><a href="…">거래 내역</a></div>
</div>
```
알림 목록형: `.popover__body` 대신 `<ul class="popover__list"><li><a class="list__row list__row--plain">…</a></li></ul>`. 바깥 클릭·Esc·포커스 이탈 시 닫힘, 포커스 복귀.

### progress
```html
<div class="progress"><div class="progress__head"><span class="progress__label">영업1팀 예산</span><span class="progress__value"><strong>62%</strong> · ₩12,400,000 / ₩20,000,000</span></div>
  <div class="progress__track" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="영업1팀 예산 소진율"><span class="progress__bar" style="--value:62%"></span></div></div>
```
- 예산 소진형: `.progress--budget` + 트랙 안 `<span class="progress__tick" data-label="80%"></span>` (위치 `style="--tick:80%"`).
- 수준: `data-level="warn"`(80%↑) / `"over"`(100%↑, 라벨 안 `<span class="progress__over-tag">초과</span>`).
- 결재 분절형: `.progress--seg` 트랙 안 `<i class="progress__seg" data-s="done|current|rejected"></i>` × n.
- `.progress--primary`(코발트) · `.progress--inline`(표 셀) · `.progress--indeterminate` · `.progress__foot`.

### sidebar
```html
<aside class="sidebar" id="app-sidebar" aria-label="주 메뉴">
  <div class="sidebar__head"><a class="brand" href="…">…</a><button class="btn btn--ghost btn--icon" data-close aria-label="메뉴 닫기"><span data-icon="close"></span></button></div>  <!-- ≤1024 에서만 보임 -->
  <nav class="sidebar__section" aria-label="경비"><ul class="sidebar__list">
    <li><a class="sidebar__link" href="dashboard.html" aria-current="page"><span data-icon="grid"></span><span class="sidebar__label">마감 현황</span></a></li>
    <li><a class="sidebar__link" href="inbox.html"><span data-icon="inbox"></span><span class="sidebar__label">결재함</span><span class="sidebar__count sidebar__count--alert">12</span></a></li>
  </ul></nav>
  <div class="sidebar__section"><p class="sidebar__heading">관리</p><ul class="sidebar__list">…</ul></div>
  <p class="sidebar__foot">10월 마감 <strong>D-3</strong> · 10월 31일(토)</p>
</aside>
```
≤1024px: 오프캔버스(`data-open="app-sidebar"` 로 열기, 딤·Esc·포커스 트랩·`data-close`). `.sidebar--inline` = 본문 안 서브내비(settings 좌측, index 목차), 오프캔버스 없음. 하위 항목 `.sidebar__link--sub`. 페이지 링크 현재 위치 = `aria-current="page"`, 스크롤스파이는 `aria-current="true"`.

### skeleton
```html
<div class="skeleton" aria-busy="true" aria-label="결재 대기 불러오는 중">
  <div class="skel-row skel-row--head"><span class="skel" style="--w:20%"></span><span class="skel skel--num" style="--w:15%"></span></div>
  <div class="skel-row"><span class="skel skel--check"></span><span class="skel" style="--w:28%"></span><span class="skel skel--num" style="--w:18%"></span></div>
</div>
```
`.skel--box`(아바타) `.skel--text` `.skel--title` `.skel--kpi` · 두 줄 행 `.skel-row--two` + `.skel-stack`.

### spinner
`<span class="spinner" aria-hidden="true"></span>` (`--sm --lg --primary --track`). 단독은 `<span class="loading" role="status"><span class="spinner"></span>불러오는 중</span>` (`.loading--block`, `.loading__meta`). 버튼 안은 스피너 대신 `aria-busy="true"`.

### steps
① 결재란 가로형(결재 진행):
```html
<ol class="steps-apv apv" id="apv-d" aria-label="결재선">
  <li class="apv__cell" data-status="approved"><span class="apv__role">담당</span><span class="apv__box"><span class="stamp">민재</span></span><span class="apv__meta"><span class="apv__name">최민재</span><time class="apv__time">10.27 14:02</time></span></li>
  <li class="apv__cell" data-status="current" data-name="박도윤"><span class="apv__role">재무</span><span class="apv__box"></span><span class="apv__meta"><span class="apv__name">박도윤</span><span class="apv__note">결재 차례</span></span></li>
</ol>
```
(칸이 가로 폭을 나눠 가짐. `data-approve` / `data-reject` 대상 id 로 그대로 사용 가능)

② 숫자형(온보딩):
```html
<ol class="steps" id="ob-steps">          <!-- .steps--row 가로 (≤768 세로) -->
  <li class="steps__item" data-status="done"><span class="steps__num">1</span><span class="steps__body"><span class="steps__title">회사 정보</span><span class="steps__desc">㈜한결물산 · 임직원 214명</span></span></li>
  <li class="steps__item" data-status="current" aria-current="step"><span class="steps__num">3</span>…</li>
  <li class="steps__item" data-status="todo">…</li>   <!-- error 도 가능 -->
</ol>
<div data-step-panels="ob-steps"><section data-step-panel>…</section><section data-step-panel hidden>…</section></div>
<button class="btn" data-step-prev="ob-steps">이전</button><button class="btn btn--primary" data-step-next="ob-steps">다음</button>   <!-- 특정 단계: data-step-go="ob-steps:2" -->
```
`ll.setStep('ob-steps', 2)`. 상태·aria-current·패널 표시 자동, `ll:step` 이벤트.

### table — 원장 표
```html
<div class="table-tools"><div class="affix table-tools__search"><span class="affix__pre" data-icon="search"></span><input class="input input--sm" placeholder="거래처·직원 검색" data-table-filter="t-pending" aria-label="결재 대기 검색"></div>
  <div class="seg" role="group" aria-label="행 밀도" data-density-target="#t-pending"><button class="seg__btn" aria-pressed="false" data-density="compact">촘촘</button><button class="seg__btn" aria-pressed="true" data-density="default">기본</button><button class="seg__btn" aria-pressed="false" data-density="roomy">여유</button></div></div>
<div class="table-wrap">
<table class="table table--stack" id="t-pending" data-bulk="bulk-pending">
  <caption class="sr-only">결재 대기 12건</caption>
  <thead><tr>
    <th class="table__check"><label class="check"><input class="check__input" type="checkbox" data-select-all aria-label="전체 선택"></label></th>
    <th aria-sort="none"><button class="table__sort">거래처</button></th><th>기안자</th><th class="hide-sm">계정과목</th><th>상태</th>
    <th class="num" aria-sort="none"><button class="table__sort">금액</button></th></tr></thead>
  <tbody>
    <tr data-amount="186000">
      <td class="table__check"><label class="check"><input class="check__input" type="checkbox" data-row-select aria-label="EXP-2610-0412 선택"></label></td>
      <td class="table__main">도담한정식 광화문<span class="sub">EXP-2610-0412 · 10.27</span></td>
      <td data-label="기안">최민재</td><td class="hide-sm" data-label="계정">접대비</td>
      <td class="table__status"><span class="badge badge--progress">결재중</span></td>
      <td class="num">₩186,000</td></tr>
    <tr class="table__empty" hidden><td colspan="6">‘<span data-empty-query></span>’에 맞는 경비가 없습니다.</td></tr>
  </tbody>
  <tfoot><tr><th colspan="5">합계 12건</th><td class="num">₩4,812,300</td></tr></tfoot>
</table>
<div class="table-bulk" id="bulk-pending" hidden><span class="table-bulk__count" data-bulk-count></span><span class="table-bulk__sum" data-bulk-sum></span><span class="table-bulk__sep"></span>
  <button class="btn btn--sm btn--invert">일괄 승인</button><button class="btn btn--sm btn--ghost">반려</button><button class="btn btn--sm btn--ghost" data-bulk-clear>선택 해제</button></div>
</div>
```
- 셀: `.num`(우측 tnum) · `.table__code`(문서번호 mono) · `.sub`(둘째 줄) · `.strong` · `.table__link` · `.table__actions`.
- 행 상태: `aria-selected`(체크 시 자동) · `data-state="error"` · `aria-disabled` · `.is-new`(하이라이트).
- 정렬: `th > button.table__sort` 클릭 → `aria-sort` 순환, 숫자 열(`th.num`)은 숫자 정렬, 셀 `data-sort-value` 우선.
- 일괄: `table[data-bulk=id]` + `tr[data-amount]` → 바 표시 `n건 선택 · 합계 ₩…`.
- 필터: `input[data-table-filter=tableId]` (+`data-filter-count=id` 결과 수).
- 밀도: `.table--compact/--roomy` 또는 상위 `data-density`. 두 줄 셀(`.sub`)이 있는 행은 자동으로 `--row-2`(48/56/60) 높이 + 위아래 8px.
- sticky 머리행: `.table-wrap`은 가로 스크롤 컨테이너라 세로 sticky도 래퍼 기준이다. 래퍼 안 표의 머리행은 `top: 0`으로 고정되며 `--sticky-top`은 **래퍼 없이 놓인 표에만** 쓴다(예: 페이지 상단바 아래 고정 → `style="--sticky-top:56px"`). 래퍼 안에서 머리행을 고정한 채 스크롤하려면 `.table-wrap--scroll`(+ `--table-max-h`).
- 행 상태: `tr[data-state="error"]` = 한도 초과·반려(위험색), `tr[data-state="warn"]` = 영수증누락·증빙 보완(경고색). ≤640 `.table--stack`에서도 tr 레벨로 유지된다.
- 모바일 원장 카드 행(≤640): `.table--stack` + 셀 클래스 `table__check / table__main / num / table__status / table__actions`, 나머지 셀은 `data-label` 로 "기안 · 최민재" 표시, 숨길 셀 `.hide-stack`.

### tabs
```html
<div class="tabs">                     <!-- .tabs--sm -->
  <div class="tabs__list" role="tablist" aria-label="결재함">
    <button class="tabs__tab" role="tab" aria-selected="true" aria-controls="tp-in">받은 결재 <span class="tabs__count">12</span></button>
    <button class="tabs__tab" role="tab" aria-controls="tp-rej">반려됨 <span class="tabs__count tabs__count--alert">2</span></button>
  </div>
  <div class="tabs__panel" id="tp-in">…</div><div class="tabs__panel" id="tp-rej" hidden>…</div>
</div>
```
app.js: 잉크 바 슬라이드(160ms), ←→ Home End 자동 활성화, 패널 hidden·tabindex·aria-labelledby 자동, `ll:tab`.
세그먼트형: `<div class="seg" role="group" aria-label="기간"><button class="seg__btn" aria-pressed="true" data-value="30d">30일</button>…</div>` (`.seg--block`, ←→ 이동, `ll:seg`). 패널 전환이 필요하면 `.seg` 에 `role="tablist"`, 버튼에 `role="tab" aria-selected aria-controls`.

### timeline — 결재 이력 (최신이 위)
```html
<ol class="timeline">
  <li class="timeline__item"><span class="timeline__node"><span class="stamp">민재</span></span>
    <div class="timeline__content"><p class="timeline__title"><b>최민재</b> <span class="timeline__role">영업2팀장</span> 승인</p><p class="timeline__body">누리바이오 구매팀 4인 미팅 확인했습니다.</p></div>
    <time class="timeline__time">10.27 14:02</time></li>
  <li class="timeline__item timeline__item--rejected"><span class="timeline__node timeline__node--rejected"></span>…</li>
</ol>
```
마디: 도장(승인) · `--pending`(점선 원) · `--current`(코발트 원) · `--rejected`(사각) · `--submitted`(잉크 사각) · `--comment`(점) · `--system`. 항목 `--pending`, `--rejected`, `.is-new`.

### toast — 하단 좌측
JS: `ll.toast({ title:'승인 완료', text:'EXP-2610-0412 · 다음 결재: 이서진', kind:'success'|'info'|'warning'|'danger', stamp:'도윤', action:'실행 취소', onAction(){}, duration:5000 })`.
선언형: `<button data-toast="임시 저장됨" data-toast-text="EXP-2610-0413 · 14:06" data-toast-kind="info" data-toast-action="실행 취소" data-toast-stamp="하늘">`.
5초 진행선, 호버/포커스 시 일시정지, 최대 3개, aria-live polite(danger 는 alert). 정적 시연(index): `.toast.toast--static` 마크업 직접(`.toast__icon .toast__body .toast__title .toast__text .toast__actions .toast__action .toast__close .toast__progress`). **자기 홍보 토스트 금지.**

### tooltip
`<button … data-tooltip="링크 복사" data-tooltip-kbd="⌘C" aria-label="링크 복사">` → 300ms 지연, hover·keyboard focus 표시, Esc 해제, `aria-describedby` 자동. 결재란 반려 칸 `apv__box` 에 `data-tooltip="반려 사유: …"` + `tabindex="0"`. 정적 시연: `<span class="tooltip tooltip--static">…</span>`.

---

## 4. 전역 동작 요약 (app.js)

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 라이트/다크 전환 + localStorage(`ll-theme`) |
| `[data-open="id"]` / `[data-close]` (`="id"`) | modal · drawer · command · sidebar 열기/닫기 |
| `[data-command-open]`, ⌘K / Ctrl+K | 커맨드 팔레트 |
| `[data-popover="id"]` / `[data-menu="id"]` | 플로팅 패널 토글 (fixed, 자동 위치) |
| `[data-approve="apvId"]` / `[data-reject="apvId"]` / `[data-stamp-play="id"]` / `[data-stamp-on-view]` | 결재란 시그니처 |
| `[data-toast]` `[data-busy]` `[data-copy]` `[data-dismiss]` `[data-flash]` `[data-add-row]` | 토스트 · 로딩 · 복사 · 닫기 · 숫자 표식 · 행 추가 |
| `[data-scrollspy]` (`data-scrollspy-select="selectId"`) | 목차 링크 `a[href^="#"]` 에 현재 섹션 `aria-current="true"`. 모바일 목차 셀렉트는 `select[data-toc-select]` (값 = `#id`) |
| `[data-density-target]` + `.seg__btn[data-density]` | 밀도 전환 |
| Esc | 툴팁 → 최상단 오버레이 순으로 닫기 |

이벤트: `ll:open` `ll:close` `ll:theme` `ll:tab` `ll:seg` `ll:density` `ll:menu` `ll:approve` `ll:reject` `ll:select` `ll:sort` `ll:page` `ll:kanban-move` `ll:list-select` `ll:date` `ll:step` `ll:submit` `ll:toast-action`.
API: `window.ll = { init(scope), toast, open, close, toggle, approve, reject, stamp, replayStamps, flash, addRow, setStep, fmtKRW, setTheme, icons, hydrateIcons }` — 동적으로 넣은 DOM 은 `ll.init(container)`.
금액 포맷: `ll.fmtKRW(-42000)` → `−₩42,000`.
