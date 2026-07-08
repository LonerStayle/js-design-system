# theme-20 blueprint-wireframe — 시스템 레이어 변경 노트 (페이지 에이전트용)

작업자: 시스템 레이어 리드 · 대상: tokens/semantic/base/components/*, index.html, app.js (pages/ 는 미수정)

---

## 1. 새/변경 토큰

### tokens.css
- `@import` 에서 **Noto Serif KR 완전 제거** (CAD 테마에 세리프 무근거·미사용 화석). Noto Sans KR 웨이트도 400;700 로 축소. 한글 페어링은 그대로: 데이터/버튼=Nanum Gothic Coding, 라벨=Gothic A1.
- 상태색 라이트 전용 진한 잉크 신설: `--lime-700 #3d7a1c`(4.7:1) · `--amber-700 #8a5f0e`(5.0:1) · `--coral-600 #b83a2b`(5.1:1). 전부 벨럼 배경 #f4f1e9 기준 실측 AA 통과.
- 한글 조판 토큰: `--leading-heading-ko:1.3` · `--leading-display-ko:1.14` · `--tracking-caps-ko:0.08em`.

### semantic.css (라이트 블록만)
- `--color-success/--color-warning/--color-danger` 를 라이트에서 **위 진한 잉크로 재매핑**. 다크는 그대로(lime-400/amber-400/coral-400). 즉 상태색을 텍스트/보더로 쓰면 라이트에서 자동 AA. 페이지에서 별도 하드코딩 금지.

## 2. 새 컴포넌트 · 유틸리티

### 도면 등록 대장 `.register` (components/layout.css) — index 허브에서 카드그리드 대체
```html
<nav class="register" data-reveal aria-label="...">
  <div class="register-head" aria-hidden="true"><span>SHEET</span><span>TITLE · 화면</span><span>REF</span></div>
  <a class="register-row register-row--cover" href="...">      <!-- 첫 행=커버 시트(강조) -->
    <span class="register-sheet"><span class="bp-reg-mark" aria-hidden="true"></span><span class="no">SCR-01</span></span>
    <span class="register-body"><span class="register-title">제목</span><span class="register-desc">설명</span></span>
    <span class="register-ref">REF<span class="arrow" aria-hidden="true">→</span></span>
  </a>
  <a class="register-row" href="...">…</a>
</nav>
```
- 반응형: ≤640 에서 자동 2행 스택(SHEET+REF 상단, 본문 하단). `register-body` 는 flex 컬럼(제목/설명 세로 스택).
- 리스트형 인덱스가 필요한 페이지(예: profile 활동, settings 목록)에 재사용 권장.

### 스키매틱 SVG 색상 클래스 `.bp-schematic` (base.css) — SVG var() 금지 준수의 정본
인라인 SVG 도면 일러스트는 stroke/fill 속성에 `var()` 를 **절대 넣지 말 것**. 대신 부모에 `.bp-schematic` 붙이고 요소에 클래스:
`.s-ink`(=color-text) · `.s-cyan`(=color-primary) · `.s-cyan2`(=color-info) · `.s-ghost`(=color-text-subtle) · `.s-faint`(=color-border-strong) · `.f-cyan2` `.f-label` `.f-ink`(fill).
- 전부 **시맨틱 토큰 바인딩 → 라이트/다크 자동 재잉킹**. (pages/404·product·onboarding 의 SVG var() 64건 중 잔여분은 이 클래스 방식으로 이관할 것 — 404:15, product:22, onboarding:1 남아있음. 그라데이션 stop 은 `style="stop-color:var(...)"` 패턴.)
- 로드 시 stroke-dashoffset 로 "그려지는" 인킹 애니메이션 자동(html.js gated, reduced-motion 시 즉시 완성).

### 제도 십자선 커서 `.bp-crosshair` (base.css + app.js `initCrosshair`)
- `body[data-crosshair]` 있으면 JS가 풀뷰포트 십자선 + `X:1042 Y:0388` 좌표 판독 라벨 생성. `--z-cursor:9999`.
- `pointer:coarse`(터치)·`prefers-reduced-motion` 에서 **비활성**. 쇼케이스 성격 페이지(404 등)에 `<body … data-crosshair>` 추가 시 즉시 동작. 데이터 밀집 업무 페이지(dashboard/inbox 등)에는 넣지 말 것(정밀 클릭 방해).

### 시그니처 리빌 = "플로터가 그린다" (base.css + app.js `initReveal`)
- **범용 fade-up 폐기.** `[data-reveal]` 컨테이너의 **직계 자식**들이 `bp-plot`(clip-path 좌→우 와이프 = 플로터 드로잉)으로 스태거 등장(nth-child 1~9, 55ms 간격).
- 숨김은 `html.js [data-reveal] > *` 로 **JS-gated**(app.js 최상단 `root.classList.add("js")`). JS-off/실패 시 콘텐츠 정상 노출. IO 미지원 시 전부 즉시 표시. reduced-motion 시 즉시 완성.
- **주의(페이지 영향):** pages 의 기존 `[data-reveal]` 도 이 문법으로 자동 적용됨(컨테이너 페이드→자식 플로터 와이프로 변경). `[data-reveal]` 는 **"그려질 단위"들의 직계 부모**에 두는 게 의도대로 보임. table `<tbody>`·sticky 요소 직상위엔 붙이지 말 것.
- **선-드로잉 보강 (base.css, `bp-draw-x` 점화):** `.section-head .rule` 과 `.datum-line`(수평 기준선)이 **로드 시 좌→우로 그려짐**("Drawn, not filled" 을 기준선에 직접 구현). 희소 타깃만(섹션 룰·데이텀 라인) — 카드 내부 `bp-dim` 다수엔 미적용(화면이 번잡해지지 않게). html.js gated + reduced-motion 정지. 페이지에서 `.section-head`+`.rule` 마크업만 쓰면 자동 적용. (죽어있던 `bp-draw-y` 키프레임은 정직한 소비처가 없어 삭제 — 정의만 있고 미사용 키프레임 0.)

### 세그먼트 컨트롤 (app.js `initSegmented` 신설 + forms.css)
- **죽어있던 세그먼트 살림.** `.segmented` 전부 클릭+방향키 동작. CSS 는 `aria-checked`/`aria-pressed`/`aria-selected`/`.is-active` 모두 활성 스타일 지원.
- **정본 마크업(권장):** `role="radiogroup"` + 자식 `role="radio" aria-checked` + 방향키 로빙 tabindex. index 의 "보기 모드" 를 이 패턴으로 교정 완료.
- **페이지 숙제:** dashboard:62 · onboarding:49,64 · settings:71,72 · product:99 의 세그먼트가 아직 `role="group"` + plain button `aria-selected`(**무효 ARIA**). radiogroup/radio 로 변환할 것. (변환 전에도 initSegmented 가 클릭 동작+`is-active`는 제공하므로 기능은 살아있음.)
  - **settings 테마 세그먼트 주의:** 버튼에 `data-toggle-theme` 2개 → initTheme 이 둘 다 "토글"로 처리(라디오 아님). 실제 테마와 세그먼트 활성표시 동기화하려면 페이지에서 명시 set 방식으로 재배선 필요.

### 정렬 헤더 키보드화 (table.css `.th-sort` + app.js)
- 정렬 `th.sortable` 안에 `<button class="th-sort">라벨…</button>` 넣으면 키보드 조작 가능(클릭 버블링으로 기존 정렬 JS 그대로 동작). `th` 에 `aria-sort="none"` 초기값. JS가 정렬 시 활성 th=ascending/descending, 나머지 sortable=none 로 동기화. **모든 정렬 테이블에 이 버튼 래핑 적용 권장.**

### 히어로 플레이트 `.plate`
- 제도 시트 이중 테두리(무블러 inset box-shadow 헤어라인 = 라인웨이트 깊이, 섀도 금지 원칙 준수) 추가. ≤560 에서 패딩 축소. 히어로 워드마크는 `.hero-title` (clamp 유동 크기)로 모바일 잘림 해소.

## 3. 페이지에 일관 반영할 지침

- **FOUC:** 모든 페이지 `<head>` 최상단에 index 와 동일한 동기 스니펫 필요(storage key = `"bp-theme"`, 기본 dark). `<html>` 의 `data-theme` 하드코딩 제거하고 스크립트가 세팅하게 할 것. (index 는 완료.)
- **자기참조/dev-tool 카피 금지:** "60+ 컴포넌트 / 제로 프레임워크 / 순수 CSS" 류 전부 제거 대상. 수치가 필요하면 도면 제원(SCALE·GRID·UNIT·REV·SHEET)이나 title-block 셀로. 푸터는 콜로폰(제도/검도/승인 서명 — 담당자명 정본 아래 참조)으로.
- **정본 담당자명(교차 페이지 통일):** 제도 **김설계** · 검도 **이도면** · 승인 **박치수**. 아바타 이니셜은 KS/LD/PC(2자). combobox 담당자 옵션과 일치.
- **정본 화면 목록(등록 대장 = index 정본):** SCR-01 분석 대시보드 / 02 칸반 보드 / 03 이메일 인박스 / 04 상품 상세 / 05 가격표 / 06 설정 / 07 온보딩 위저드 / 08 프로필·계정 / 09 404·빈 상태. 페이지 제목·브레드크럼을 이 명칭/번호와 일치시킬 것.
- **날짜:** 요일 병기 지양(달력 오정합 방지). 상대표현("6월 마감 주간","어제") 또는 `2026-07-08` 형식. 통화 ₩+콤마.
- **한글 조판:** base.css 하단 `:lang(ko)` 레이어가 keep-all·행간·tabular-nums 자동. 페이지에서 별도 처리 불필요.
- **상태 시연:** settings 저장실패 토스트·invalid 필드, 검색 0건, 재고소진 등 CSS 정의 상태를 장면 속에 최소 1회 노출.
- **SVG 색:** presentation 속성 var() 전면 금지. `.bp-schematic` 클래스 또는 `currentColor`/`style=""` 로. (pages 잔여 SVG var(): 404·product·onboarding — 미해결, 처리 요망.)

## 4. 검증 결과 (index/시스템 레이어)
- SVG attr var() in index: **0** · 인라인 grid-template-columns: 0 · autofocus: 0 · 하드코딩 hex(components): 0 · Noto Serif: 0 · 무효 aria-selected(plain button): 0(잔여는 role=option/tab 정상) · keep-all: 존재 · 콘솔 에러: 0(favicon 404 무관).
- 육안: 1440/1280/375 × dark/light 확인 — 가로스크롤 0, 히어로/등록대장/토큰/모티프/컴포넌트/푸터 정상, 스키매틱 라이트 재잉킹 확인, 십자선 z=9999, 세그먼트 aria-checked 동기 OK.
