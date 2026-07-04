# theme-02-swiss-international — 시스템 레이어 변경 노트 (페이지 에이전트용)

작성: 2026-07-04 · 대상: tokens/semantic/base/components/app.js/index.html (pages/ 미접촉)

DNA 불변: 그라데이션·radius·그림자 금지, 이동 모션 금지(페이드·밑줄·선긋기만), flush-left,
헤어라인 = 유일한 구분. 아래 신규 요소는 전부 이 규율 안에서 동작한다.

---

## 1. 전 페이지 공통 계약 (반드시 반영)

### 1-1. FOUC + 모션 게이트 (head 최상단, `<html lang="ko">` — data-theme 하드코딩 금지)
`data-theme="light"` 같은 하드코딩 속성을 `<html>`에서 제거하고 아래 한 줄을 head 최상단에.
`classList.add('js')`가 **핵심** — 이게 있어야 스크롤 리빌(§3)이 켜지고, 없으면 리빌 요소가 그냥 정적으로 보인다(안전).
```html
<script>(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('swiss-theme');if(t)r.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme: dark)').matches)r.setAttribute('data-theme','dark');}catch(e){}})();</script>
```
- localStorage 키는 반드시 `swiss-theme` (app.js와 동일).
- 스킵 링크 `<a class="skip-link" href="#main">본문으로 건너뛰기</a>` + `<main id="main">` 유지.

### 1-2. 언어/표기 (pages 9개 전부 영문 → 한글화가 이번 최우선)
- `lang="en"` → `lang="ko"`, `<title>` 한글화, aria-label/alt/placeholder 한글화.
- 통화 `€`/`$` → `₩` (예: `₩4,800만`, `₩2.48억`). 인명 유럽식(Elena Kessler 등) → 한국 성명(김민준·이서연·박지후 결).
- **살릴 것(DNA 윙크)**: Zürich/Basel/Bern, Helvetica/Univers/Akzidenz-Grotesk, "Neue Grafik" 등 스위스 타이포 레퍼런스는 영문 유지.
- 어체: **선언·명령형** (단문·명사형 종결). "질서." "정밀함." 결. 한 페이지 안에서 어체 혼용 금지.

### 1-3. navbar/footer의 raw 파일 링크 제거
- navbar `문서 → ../README.md`, 푸터의 `tokens.css`/`semantic.css`/`README.md` **직링크 전부 제거**
  (index.html에서 이미 제거함 — 푸터는 콜로폰으로 대체, 아래 4-3 참고).
- 인라인 `onclick`/`onsubmit="return false"`(404.html) 금지 — data-attribute 위임만.

---

## 2. 토큰 변경 (tokens.css / semantic.css)

### 신규 토큰
| 토큰 | 정의처 | 값·용도 |
|---|---|---|
| `--leading-display-ko` | tokens | 1.12 — 초대형 한글 디스플레이 행간 (0.95 직행 금지) |
| `--leading-heading-ko` | tokens | 1.3 — 다행 헤딩 |
| `--leading-body-ko` | tokens | 1.7 — 본문 |
| `--tracking-caps-ko` | tokens | 0.08em — 한글 모노 라벨 자간 상한 |
| `--color-inverse-border` | semantic (L/D) | 잉크 패널(page-plate/section-break) 위 헤어라인 |
| `--color-accent-text` | semantic (L/D) | **red를 "텍스트"로 쓸 때** 전용 — 라이트 red-600(≈6:1)/다크 red-400(≈5.4:1) |
| `--color-data-mid` | semantic (L/D) | 차트 비율바 중간 세그먼트 (구 raw `--neutral-400` 흡수) |

- **red 텍스트는 무조건 `--color-accent-text`**, red를 **면/마크(플레인·블록·마크)**로 쓸 땐 `--color-accent`.
  잉크 배경(page-plate 등) 위에서는 semantic.css가 accent-text를 자동 반전(라이트↔다크 대응)하므로 그대로 쓰면 된다.
- `--font-sans` 스택 순서 교정: `"Inter","Gothic A1","Noto Sans KR",…,system-ui,…` (Gothic A1이 system-ui **앞**). 폰트는 tokens.css 단일 `@import`로 통합(Inter·JetBrains·Gothic A1 400/500/700/**800**·Noto Sans KR). **Noto Serif KR 임포트 삭제**(세리프 DNA 아님). base.css의 폰트 @import 제거됨.
- `--input-placeholder`: `--color-text-faint`(2.3:1) → `--color-text-subtle`(≈4.5:1)로 상향.

### base.css `:lang(ko)` 자동 레이어 (페이지에서 직접 만질 일 없음)
`keep-all`·행간(display/heading/body-ko)·faux-italic 차단·tabular 숫자를 자동 적용. 페이지는 `lang="ko"`만 걸면 상속.

---

## 3. 시그니처 모션 — rule-draw + 페이드 (신규, app.js 엔진 공용)

DNA상 **이동 금지** → 두 문법만: `[data-reveal]`(불투명도 페이드), `[data-rule-draw]`(헤어라인이 왼→오 scaleX로 **그어짐**).
IntersectionObserver 1개가 공용 엔진. reduced-motion·no-JS·IO미지원 시 즉시 완성 상태(안전).

```html
<!-- 콘텐츠 블록: 스크롤 진입 시 페이드 -->
<section class="page-section" data-reveal> … </section>

<!-- 선(헤어라인/구분선)만: 왼→오로 그어짐. 텍스트에는 절대 걸지 말 것(scaleX가 글자를 찌그러뜨림) -->
<div class="rule rule--accent" data-rule-draw aria-hidden="true"></div>
```
- **전제**: 1-1의 `js` 클래스가 head에서 걸려 있어야 숨김 상태가 적용됨(FOUC 안전).
- 남용 금지 — 섹션당 페이드 1~2개 + 시그니처 룰드로우 1개 수준. 페이지 상단 page-plate 아래 accent rule 하나를 draw하면 "선이 그어지고 내용이 뜨는" 스위스 시그니처가 완성된다.

---

## 4. 신규 컴포넌트 — poster.css (components/index.css에 배럴 등록 완료)

전부 **정적 구도**(회전·겹침은 배치이지 모션 아님). 장식 레이어는 `aria-hidden="true"` + `pointer-events:none`.
씬 노브: `<body data-scene="focus">`(교정지 마크 45%) / `="mute"`(0%, 폼·읽기 화면). 기본은 100%.

### 4-1. 잉크 플레이트 페이지 헤드 `.page-plate` — **9개 페이지 공통 기억점 (강력 권장)**
현재 pages의 흰 바탕 `.page-head`는 화면 간 구별점이 없음. 전폭 잉크-블랙 밴드 + red 인덱스 숫자로 교체하면
9개 화면이 "같은 잡지의 다른 스프레드"로 읽힌다.
```html
<header class="page-plate">
  <div class="container page-plate__inner">
    <div class="page-plate__index" aria-hidden="true">01</div>
    <div>
      <p class="page-plate__kicker">Analytics</p>
      <h1 class="page-plate__title">여름 캠페인 대시보드</h1>
    </div>
    <div class="page-plate__meta">
      <span>2026.07 마감주간</span><span>담당 · 마케팅팀</span><span>12컬럼 · 8px</span>
    </div>
  </div>
</header>
```
플레이트 내부는 헤어라인/서브텍스트가 자동으로 반전(inverse-border) 스코프됨. 페이지 번호는 index.html 화면 목록 순서(대시보드 01 … 404 09)와 맞출 것.

### 4-2. 포스터 히어로 `.poster-hero` (index.html 히어로 = 레퍼런스 구현)
초대형 인덱스 숫자 bleed + red 대각 플레인 + 한글 포스터 워딩. 404(`pages/404.html`)에 특히 강하게 재사용 권장 — 숫자가 화면을 뚫고 잘리게.
```html
<section class="poster-hero" aria-labelledby="h">
  <div class="poster-hero__numeral" aria-hidden="true">404</div>
  <div class="poster-hero__plane" aria-hidden="true"></div>
  <div class="container poster-hero__content">
    <h1 class="poster-hero__display" id="h"><span>길을</span><span>잃었<span class="dot">다.</span></span></h1>
    <p class="lead">…</p>
  </div>
</section>
```
- 히어로는 `.container` **밖**(전폭)에 두고, 내부에 `.container.poster-hero__content`를 다시 감싼다(numeral full-bleed용). `overflow:clip`이 자체적으로 가로 스크롤을 막으므로 `body{overflow-x:hidden}` 쓰지 말 것.
- `.poster-hero__display > span`은 블록 = 카피를 2~6자 어절로 끊어 줄 단위 `<span>`. 마지막 마침표만 `.dot`(유일한 red).

### 4-3. 등록 대장 `.registry` — 카드 그리드 대체 (허브/목록 위계용)
`.page-card` 균질 그리드 대신 "열람표" 위계. 잉크 플레이트 위·백지 위 모두 동작, 행 전체가 링크.
```html
<div class="registry">
  <a class="registry__row" href="…"><span class="registry__num">01</span>
    <span class="registry__main"><span class="registry__title">제목</span><span class="registry__desc">설명</span></span>
    <span class="registry__trail">SCREEN</span></a>
</div>
```

### 4-4. 교정지 마크 (구조적 질감, 텍스처 아님 → DNA 정합)
- `.crop-frame` : 블록 모서리 재단선(좌상+우하 L). `position:relative`인 카드/섹션에 클래스만 추가.
- `.reg-cross` / `.reg-cross--accent` : 레지스트레이션 십자(원형 금지 DNA 준수).
- `.dim-note` : 모노 치수/스펙 주석(예: `88px / 0.95lh`). `aria-hidden`, 데코.
- `.section-break` : 풀블리드 잉크 반전 브레이크 섹션(페이지당 1개 이상 권장 — 균질 리듬 파괴).

### 4-5. 허브 전용 유틸 `.hero-spec` (index.html `<style>` 스코프)
표제란형 스펙 dl. 페이지에서 필요하면 poster/registry로 충분하므로 이건 index 전용으로 봐도 됨.

---

## 5. app.js 인터랙션 — 신규/변경 훅

| 훅 | 동작 |
|---|---|
| `[data-reveal]` / `[data-rule-draw]` | §3 리빌 엔진 (자동) |
| `role="radiogroup"` + `role="radio"` 세그먼트 | **segmented는 tablist 금지 → radiogroup으로**. 클릭·방향키(←→↑↓/Home/End)로 `aria-checked`+roving tabindex 자동 동기화. 빌링 토글(월/연)·기간 범위(일/주/월) 전부 이 패턴. |
| `[data-rating][role="radiogroup"]` | 별점 입력 = radiogroup+radio. 클릭+방향키 지원, `aria-checked`·`aria-label`(“별점 N점 / 5점”) 자동. **표시 전용 별점은 `<span>`으로**(인터랙티브 금지). |
| `button[data-kanban-move="prev|next"]` (card 안) | **칸반 키보드 대체 수단**. 카드에 "← 이전 열 / 다음 열 →" 버튼 추가하면 열 이동+카운트 갱신+SR 안내 자동. 열에 `data-kanban-name="검토"`(또는 `.kanban-col__title`) 부여 권장. |
| `Swiss.announce(msg)` / `#sr-live` | 공용 polite 라이브 리전. 커스텀 안내가 필요할 때 호출. |
| 토스트 | 컨테이너 `role="status"`+`aria-live="polite"`로 교정(스크린리더 낭독). app.js 내장 문자열 전부 한글화(닫기/복사됨/실행됨/설정 완료 등), 캘린더 한글(월/화…, "2026년 7월", 이전/다음 달). |

기존 tabs(진짜 패널 전환)만 `role="tablist"/tab/tabpanel` 유지. 세그먼트·별점은 위 규칙으로.

---

## 6. pages 잔여 결함 (페이지 에이전트가 반드시 처리 — 시스템 레이어 밖)

1. **dashboard 사이드바 반전**: `.sidebar hide-md`(768+에서 숨김 = 데스크톱 소멸) → `show-md`로 뒤집고, 모바일은 드로어 진입점 제공(오버레이 계약 §4-3 준수).
2. **inbox 모바일 3-pane**: ≤900px에서 folders+reading 둘 다 display:none → 메일 열람 불가. 목록↔읽기 스택 전환 또는 드로어 승격.
3. **pricing 가운데 정렬 hero** → flush-left + 비대칭 컬럼(4/8)로 재구성. 추천 플랜 후광은 `data-scene`/`.section-break`로.
4. 반응형: 미디어쿼리 경계 빈틈·중복 금지(901~1199px 콘텐츠 증발 주의). `100dvh` 사용, 인라인 `grid-template-columns` 금지(클래스+브레이크포인트).
5. CHECKLIST.md는 아직 `lang="en" ✅` 등 낡은 상태 — 페이지 한글화 완료 후 최종 갱신(근거 없는 "all pass" 기록 금지).

---

## 7. 검증 결과 (시스템 레이어, 정적)
- SVG presentation attr `var()` = 0 · components 하드코딩 hex = 0 · 인라인 grid-template-columns(HTML) = 0 · €/$/filler(index) = 0 · raw .md/.css 링크(index) = 0 · href="#" 더미(index) = 0.
- 토큰 참조↔정의 diff: 미정의 0 (`--fx-marks`는 poster.css `:root` 인라인 정의, `--h`는 인라인 바 높이 데이터).
- app.js `node --check` 통과 · HTML 태그 밸런스 OK.
- **육안 검증 미완**: 브라우저가 병렬 페이지 에이전트에 점유되어 스크린샷 미수행. 4뷰포트×2테마 육안(특히 poster-hero 다크·360px 낙하, rule-draw, reduced-motion)은 페이지 작업과 함께 최종 확인 요망.
