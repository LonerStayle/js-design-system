# theme-15 Scandinavian Hygge — 시스템 레이어 고도화 워크로그

> 대상: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js
> pages/ 는 건드리지 않음. 이 문서는 **페이지 에이전트가 일관 반영할 지침** 중심.
> DNA 재확인: 크림·소프트세리프·리넨 질감은 지문이 아니라 **자산**. 걷어낸 건 얌전함, 채운 건 "오후 햇살 드는 방 + 촛불".

---

## 1. 새/변경 토큰 (pages 에서 이걸 써야 함)

### 조판 — 한글 (tokens.css) — base.css `:lang(ko)` 레이어가 자동 소비
- `--leading-heading-ko: 1.32` · `--leading-display-ko: 1.14` · `--leading-body-ko: 1.72` · `--leading-ui-ko: 1.5`
- `--tracking-caps-ko: 0.08em` · `--tracking-display-ko: -0.01em`
- **자동 적용됨** — 페이지는 `<html lang="ko">`만 유지하면 keep-all·행간·faux-italic 억제·tabular 숫자가 전부 걸린다. 별도 CSS 불필요.

### 분위기 / 촛불 (tokens.css + semantic.css)
- `--glow-warm-rgb: 201 139 107` (촛불 불꽃) · `--glow-sage-rgb: 157 174 150` (창빛) · `--glow-cream-rgb`(토글 빛번짐) — **rgb 트리플릿**이라 어떤 알파로도 합성. `rgb(var(--glow-warm-rgb) / var(--glow-alpha))` 형태로.
- `--glow-alpha` / `--glow-alpha-strong` : **씬 노브**(라이트 .10/.16, 다크 .18/.28). 다크에서 촛불이 더 밝게 타도록 자동 상향.

### 상태·표면 색 (semantic.css) — 하드코딩 대체
- `--color-code-surface` / `--color-code-border` / `--color-code-fg` : 코드블록용(라이트=웜다크, 다크=`#15120D`). **`#15120D` 하드코딩 제거**. 페이지가 코드 패널 색 손대지 말 것.
- `--color-primary-soft-hover` : 소프트 버튼/칩 hover 한 단계 짙은 tint.
- `--color-accent-active` (terracotta-700/200) · `--color-danger-active` (clay-800/200) : 버튼 `:active` 색. **accent/danger 버튼의 press 색은 이걸로 통일**.

### 포커스 링 (tokens.css) — 회귀 주의
- `--ring-*` 4종을 **반투명 .45 → .85(700레벨)** 로 상향. 예전 .45 링은 크림 위 ~2:1 로 3:1 미달이었다. 다크 링도 .55→.85. 페이지에서 `:focus` 에 `outline:none` 단독 금지, 커스텀 링도 이 토큰 경유.

### 폰트 (tokens.css)
- `@import` 를 **tokens.css 한 곳으로 통합**(base.css 임포트 제거 — 렌더 블로킹 직렬 해소). Fraunces/Hanken/Spline + Gowun Batang/Dodum + Noto Sans/Serif KR 한 요청.
- 페어링(Fraunces↔고운바탕, Hanken↔고운돋움) **보존**. 스택 순서 이미 정상(라틴무드 먼저 → 숫자 tabular 유지).

---

## 2. 새 컴포넌트·유틸리티 (pages 에서 재사용)

### 촛불 시그니처 (base.css) — "불을 켜다" = 시스템 은유
- **`.candle-cta`** : 히어로/핵심 CTA에 붙이면 `::before` 로 따뜻한 halo 가 5.5s 주기로 **숨쉰다**(candle-flicker). reduced-motion 시 정지·정적 유지. box-shadow 채널 안 씀 → 포커스 링과 충돌 없음. **남용 금지 — 페이지당 히어로 CTA 1개**.
- **테마 토글 = 촛불 점등** : `[data-theme-toggle]` 클릭 시 클릭 지점에서 **따뜻한 빛이 iris 로 퍼진다**(`.theme-flash`, app.js 자동 마운트/제거). cmdk '다크 모드 전환'도 동일. reduced-motion 시 스킵. **페이지가 따로 할 일 없음** — app.js 가 처리.
- 다크 히어로 halo : index 히어로는 `--glow-*` 로 "창가 램프" 2개 + 사선 빛줄기. 페이지 히어로도 같은 어법으로 배경 구성 가능(라이트=코너 워시+beam, 다크=warm radial halo).

### `.linen` — 스코프 리넨 질감 (base.css)
- 전역 body 질감은 fixed 라 섹션별 농도 변주가 안 된다. 특정 밴드/섹션에 **`.linen`** + `--linen-opacity`(기본 .6) 를 주면 그 요소에만 직조 질감이 깔린다(히어로는 진하게 .85, 콘텐츠는 옅게). 장식·비인터랙티브(`z-index:-1`, `isolation`). **카드 표면엔 넣지 말 것**(표면 위계 유지).
- 전역 질감 자체도 prime 간격(5/7/13/17px)으로 재직조 → 균일 도트 모아레 제거.

### `.em-warm` — 한글 강조 (base.css)
- 한글엔 이탤릭이 없다. `<em>`/기울임 대신 **`<em class="em-warm">`**(색=primary + semibold, `font-style:normal`). `:lang(ko) em,i,cite` 도 자동으로 이탤릭 억제됨. 히어로/프로즈 강조는 전부 이걸로.

### `.th-sort` — 키보드 정렬 헤더 버튼 (data-display.css)
- 정렬 가능한 표는 **`<th class="sortable" aria-sort="none"><button class="th-sort">컬럼명</button></th>`** 패턴 권장. aria-sort 는 th 에 유지, 포커스+Enter/Space 는 버튼이. (버튼 없이 `th.sortable` 만 두면 app.js 가 `tabindex=0`+keydown 을 자동 부여하는 폴백도 있으나, **버튼 래핑이 정석**.)

### 버튼 (buttons.css)
- `.btn-soft`·`.btn-accent`·`.btn-danger`·`.btn-danger-ghost` **`:active` 전부 보완** + soft hover 의 `filter:brightness` 를 토큰 tint 로 교체. 페이지는 전 변형에서 hover/active/focus 무료로 얻음.

---

## 3. 인터랙션·a11y 계약 (app.js — 페이지가 알아야 할 것)

- **별점**: 입력용은 `role="radiogroup"` + `button[role="radio"][aria-checked][tabindex]`(초기 선택만 tabindex=0). app.js 가 클릭·방향키(←→↑↓/Home/End)·aria-checked·roving tabindex 동기화. **표시용(product 리뷰 평점 등)은 반드시 `data-readonly` 또는 `role="img"` + `<span>` 별**(클릭 불가) — 그래야 app.js 가 안 건드린다. (감사 ④-2 rating role 버그 해소.)
- **정렬 표**: `.th-sort` 버튼 또는 폴백 tabindex 로 키보드 조작 가능. `localeCompare(…, "ko")` 로 한글 정렬. (감사 ④-3.)
- **드롭다운 메뉴**: `role="menu"` + item `role="menuitem"`/`.menu-item` 이면 열릴 때 첫 항목에 포커스, **↑↓/Home/End/ESC 자동**(item 이 a/button 아니면 tabindex 자동 부여). 대시보드 알림 드롭다운 등에 그대로 적용됨. (감사 ④-4.)
- **칸반 키보드 대안**: 카드에 `<button data-kanban-move="prev|next">` 두고, 컬럼을 `[data-kanban-col][data-kanban-name]`, 드롭영역을 `[data-kanban-list]` 로 마크업하면 app.js 가 카드 이동 + `#hygge-live` 라이브리전 안내를 처리. (감사 ④-5 DnD 키보드 무수단 해소.)
- **app.js 문자열 전면 한글화**: 토스트 기본 제목("알림")·닫기·region aria, cmdk placeholder/aria/빈결과/기본항목·기본 토스트 전부 한국어. (콘솔 로그만 영문 유지 — 화면 아님.)

---

## 4. 페이지 에이전트 필수 작업 (시스템 레이어가 못 하는 것)

1. **FOUC 스니펫** — 각 page `<head>` **최상단**(스타일시트 앞)에 아래 삽입 + `<html>` 의 `data-theme="light"` 하드코딩 **제거**(안 지우면 `:root:not([data-theme])` 폴백이 죽는다). 키는 **`hygge-theme`**.
   ```html
   <script>(function(){try{var t=localStorage.getItem("hygge-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
   ```
2. **전면 한글화**(감사 🔴A, P0) — 9개 page `lang="en"`→`ko`, 인명·상품·통화 국내화(김서연/원목 사이드테이블/₩), 단순번역 금지 → **한국형 휘게 카피**(해요체, '님' 호칭). 어체는 한 페이지 단일. 예: "Good morning, Sofie 🌿" → "좋은 아침이에요, 서연 님".
3. **이모지 → 라인아트**(감사 🟠B) — 헤딩/eyebrow/plan명 이모지(🌱🪵🏡🍵🕯️ 등) 전량 제거, **not-found.html 코티지 라인아트 언어**(3px 라운드 스트로크)로 새싹/장작/오두막 스팟 아이콘 그려 교체. 토스트 카피 이모지는 **1~2곳만** 선별 유지(index 에서 주전자·촛불 2곳만 남김 — 페이지는 이 예산 안에서).
4. **stroke="#fff" 하드코딩**(감사 토큰 7, settings.html:726~746 5건) — `stroke="currentColor"` + 부모 `color` 또는 CSS 클래스로.
5. **product 리뷰 평점** — 표시용이므로 `data-readonly` 부여(위 §3).
6. **교차 페이지 정합**(공통 규칙) — 인명·상품명·가격·수치를 정본 하나로 통일(dashboard/product/pricing/profile). $ → ₩, 반올림 수치(50%/12,000)는 측정된 듯한 값으로.
7. **씬 변주**(감사 🟠C, §5-③) — 히어로 3-blob 복붙 금지. index 처럼 라이트=코너워시+사선 beam, 다크=`--glow-*` warm halo. 404 는 기울어진/꺼진 촛불 씬. `.candle-cta` 는 히어로 CTA 1곳만.
8. **손그림 시스템 확장**(§5-①) — empty-state 6종·onboarding 4스텝·dashboard 인사말에 코티지 라인아트 스팟 일러스트. 이모지·범용 원형 아이콘 대신.

---

## 5. 검증 결과 (grep + 브라우저 육안, 시스템 레이어 + index.html)
- SVG presentation-attr var() : index 0건 ✓
- index `lang="ko"` ✓ / FOUC 스니펫 삽입 + `data-theme` 하드코딩 제거 ✓
- components/*.css 하드코딩 hex : `#15120D` 토큰화 ✓, 잔여 `#000` 은 mask 용(`intentional` 주석 부여) ✓
- 폰트 @import : tokens.css 1곳 통합 ✓ / 미사용 패밀리 0 (Noto Serif KR 는 display 폴백에 실배선) ✓
- 인라인 grid-template-columns(index) 0건 ✓ (`.grid-2` 로 승격) / raw .md·href="#"·onclick 0건 ✓
- 서구권 filler(index) : `$240`→`24만원`, README/CHECKLIST .md 링크·dev-tool 푸터 카피 제거 ✓
- 미정의 토큰 참조 0건 ✓ (신규 토큰 전수 정의 확인) / CSS 중괄호 밸런스 전 파일 ✓ / app.js `node --check` 통과 ✓
- 램프 filler 셀 3개 제거(`grid-auto-flow:column` 으로 10/11 stop 자동) ✓
- **브라우저 육안**(1280px, http): 라이트 히어로(고운바탕 초대형 한글 + em-warm 세이지 + 기울어진 콜라주 + 창빛 beam) ✓ · 다크 히어로("warm cabin" + CTA 촛불 halo + 창가 램프 halo, 순흑 없음) ✓ · 콘솔 에러 0(favicon 404 만) ✓
- **미확인(후속 QA)**: 360/768/1024px 반응형 육안, reduced-motion 실측, 신규 링 색 대비 정밀 실측(설계상 ~5:1 목표), theme-flash/candle-flicker 모션 안전 실측.
