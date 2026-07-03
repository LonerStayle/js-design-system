# 감사 브리프 — theme-26-gradient-mesh-modern

> 감사일: 2026-07-04 · 대상 경로: `design-systems/theme-26-gradient-mesh-modern/`
> HTML 10개 (index + pages 9) · CSS 4계층(tokens/semantic/base/components 7파일) · app.js(자체 초기화 바닐라 JS)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 최대한 명시함.

---

## 1. DNA 요약

**정체성**: "Soft, modern, alive" — 2026년 SaaS/AI 스타트업 감성. 네 개의 컬러 블롭(퍼플·블루·핑크·틸) + 오로라 워시가 천천히 흐르는 **애니메이션 메시 배경** 위에, 거의 불투명한 매트 카드가 떠 있는 시스템. 그라디언트는 장식이 아니라 **행동(action)과 강조(emphasis)의 신호**로만 사용.

명시된 규칙 (README.md / tokens.css / base.css 주석):
- **"Mesh, not flat"** — 배경은 항상 살아있는 메시. 단, ambient하고 절대 산만하지 않게. "Matte — not glassy" (글래스모피즘과 구분) — README.md:13
- **"Gradient as signal"** — 그라디언트는 primary 버튼, active 상태, 차트, 대형 헤드라인에만. 서피스는 near-solid 유지 — README.md:14
- `--gradient-vivid`는 **"decorative ONLY (large gradient headlines)"** — tokens.css:105, base.css:146 (`.text-gradient` — "LARGE headings only — a11y")
- `--gradient-primary`는 **white-text safe** 조건으로 딥 스톱(#6A47E8→#C0277E) 고정 — tokens.css:99-103
- **Soft depth**: radius 12–24px 밴드(tokens.css:214 "mid–large rounding is part of the DNA"), 확산형 저대비 그림자, 헤어라인 보더
- **Calm motion**: 260–480ms emphasized easing, 메시 드리프트 28s/오로라 40s (tokens.css:261 "smooth, slow, flowing — never snappy/harsh"), `prefers-reduced-motion` 시 메시 전면 동결 — base.css:299-315
- 컴포넌트는 semantic/component 토큰만 읽고 raw 램프 직접 참조 금지 — semantic.css:5-6, README.md:136

한 문장: **"살아 숨쉬는 메시 배경 + 매트 카드 + 신호로서의 그라디언트"가 이 테마의 삼위일체.**

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **메시/오로라 배경 엔진의 완성도** — `body::before`(블롭 드리프트) + `body::after`(오로라 회전) + `.mesh-grain`(SVG 노이즈 그레인, base.css:64-99) 3중 레이어. 블롭 위치가 CSS 변수(`--mesh-pos-1…5`)로 노출되고 app.js:71-90의 포인터 패럴랙스가 rAF로 이를 실시간 구동. reduced-motion + 수동 모션 토글(data-motion-toggle)까지 지원. **이 구조는 30개 테마 중에서도 드문 '살아있는 배경' 인프라 — 증폭 1순위.**
2. **모범적인 4계층 토큰 아키텍처와 인터랙션 커버리지** — tokens→semantic→component 토큰 파생이 교과서적(semantic.css:192-273의 `--btn-*`/`--card-*`/`--input-*`). app.js는 focus trap(184-196), 탭 roving focus(95-127), aria-sort(362-364), aria-live 토스트 리전(223) 등 실동작 a11y가 실제 코드로 구현됨. 재스킨 가이드(README.md §5)도 실질적.
3. **그라디언트 규율(discipline)** — 프라이머리 버튼의 background-position 이동 호버(components/buttons.css:46-60), `.text-gradient`의 `@supports` 폴백(base.css:155-157), 커스텀 포커스 링 토큰(`--ring`, tokens.css:250-258)까지 "그라디언트를 신호로만 쓴다"는 원칙이 코드 레벨에서 지켜지고 있음. 이 절제력은 유지하되, 아래 §5처럼 '한 방'이 되는 지점에서는 오히려 더 과감하게 터뜨려야 함.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

이 테마는 다행히 **서재·문서 감성(크림 톤/세리프) 오염은 없음**. 대신 아래 지문이 짙다.

### 3-1. 데모 페이지 9개 전부 영문 — 국내용 프로젝트에서 최악의 지문
- `pages/*.html` 9개 모두 `<html lang="en">` (dashboard.html:2, kanban.html:2, inbox.html:2, product.html:2, pricing.html:2, settings.html:2, onboarding.html:2, profile.html:2, 404.html:2) — **한글 0자** (settings.html의 언어 셀렉트 옵션 '한국어' 3자가 유일). index.html만 `lang="ko"` + 완전 한글화 상태.
- 예: dashboard.html:57-58 "Analytics overview / Welcome back, Jin — here's how Mesh UI is performing this month.", pricing.html:41-42 "Simple pricing that scales with you / Start free, upgrade when you're ready.", 404.html:33 "This page drifted away", onboarding.html "Create your account / Let's get the basics set up."
- **조치**: 9개 페이지 전부 `lang="ko"` + 한글 카피로 전환. index.html의 어휘 톤(예: "부드러운 그라디언트 모션으로 디자인하다")을 기준 톤으로 삼을 것.

### 3-2. app.js 내장 UI 문자열 영문 (모든 페이지에 공통 노출)
- 커맨드 팔레트: placeholder "Type a command or search…"(app.js:279), 푸터 "navigate/select/close"(app.js:284), 빈 결과 "No results for …"(app.js:300 부근), 기본 명령 "Go to Dashboard/Toggle dark mode…"(app.js:262-269), 데모 토스트 "It works! Command executed."(app.js:269)
- 토스트 기본값: title "Notification"(app.js:227), fallback "Saved"(app.js:249), 닫기 aria-label "Dismiss"(app.js:235), 팔레트 aria-label "Command palette"(app.js:273)
- **조치**: 전부 한글화 ("명령을 입력하거나 검색…", "이동/선택/닫기", "'…'에 대한 결과 없음", "저장됨", "닫기" 등).

### 3-3. Placeholder-브랜드/filler 데이터 클리셰
- Acme Inc./Globex/Initech/Umbrella/Hooli/Soylent (dashboard.html:169-174, index.html:507-509, index.html:231) — AI가 만든 SaaS 데모의 전형. 국내 SaaS 맥락의 실감나는 한글 고객명(예: 그린랩스/두들린/센드버드류의 가상 한국 기업명)으로 교체.
- pricing.html:132 "Join 12,000+ teams building soft, modern products" — 근거 없는 숫자 자랑 filler.
- profile.html:67-70 "jin@meshui.dev / Seoul, South Korea / Joined March 2024" — 영문 프로필 관성.

### 3-4. hero(중앙정렬)+통계4개+카드그리드 공식
- index.html:94-111 — 중앙정렬 hero + `hero__stats` 4개("60+ 컴포넌트/9 데모 페이지/200+ 디자인 토큰/2 라이트&다크") + 균질 카드 그리드. "시스템이 스스로를 소개하는 숫자 진열"은 AI 특유의 자기서술 패턴. §5-1의 비대칭 구도로 해체 권장.
- 갤러리(index.html:185-532)는 디자인시스템 허브 특성상 컴포넌트 나열 자체는 정당하나, 모든 카드가 같은 크기·같은 리듬으로 반복됨 → 실사용 맥락 클러스터(예: "결제 플로우 한 장면", "알림 센터 한 장면")로 2~3개 대형 조합 데모를 섞으면 진열대 느낌이 사라짐.

### 3-5. 죽은 코드/스캐폴드 잔재
- base.css:112 `@keyframes blob-float-1 { 0%,100%{ } } /* reserved hook */` — 빈 keyframe 잔재. 삭제 또는 실제 구현.
- components/display.css:21 `.tag { /* removable tag = chip variant */ }` — 빈 룰.
- tokens.css:12 — **Noto Serif KR 4웨이트를 import하지만 어디에서도 사용 안 함**(전체 grep 결과 0회). 무거운 세리프 폰트가 로드만 되는 상태. '서재풍 세리프' 관성이 import 라인에만 남은 화석 — 제거할 것.

---

## 4. 프로덕션 결함

### P1 — SVG stroke 속성에 var() 직접 사용 (렌더 깨짐 알려진 버그) · 16곳
HTML 속성 `stroke="var(--…)"`는 SVG 프레젠테이션 속성에서 CSS 변수를 해석하지 못해 깨진다. `style="stroke:var(--…)"` 또는 `stroke="currentColor"` + 부모 color로 교체할 것.
- pages/pricing.html:107, 108, 109 (비교 테이블 체크/마이너스 아이콘, 행마다 3개)
- pages/profile.html:67, 68, 69, 70 (연락처 아이콘 4개)
- pages/product.html:97, 98, 99 (혜택 체크 3개)
- pages/inbox.html:119, 120 (첨부파일 아이콘 2개)
- pages/settings.html:98, 99, 100, 129 (세션/결제 아이콘 4개)
- 참고: pricing.html의 plan 카드 쪽(57-92행)은 `class="feat-yes"` + CSS `color` + `stroke="currentColor"` 방식으로 올바르게 처리되어 있음 — 이 패턴으로 통일하면 됨.

### P2 — 중복 `data-toast` 속성으로 토스트 본문 유실 · 4곳
`data-toast data-toast-title="…" … data-toast="본문"` 형태 — HTML 파서는 중복 속성 중 **첫 번째**를 채택하므로 `data-toast=""`가 되어 본문 텍스트가 조용히 사라짐 (app.js:249 `text: b.dataset.toast || ""`).
- index.html:364, pages/dashboard.html:62, pages/kanban.html:119, pages/product.html:90
- 조치: 본문을 `data-toast-text`(신규 속성)로 옮기고 app.js의 초기화(app.js:243-252)를 `b.dataset.toastText` 우선으로 수정.

### P3 — 커맨드 팔레트 기본 명령의 href가 pages/ 내부에서 깨짐
app.js:262-266 기본 명령이 `href: "pages/dashboard.html"` 등 **index 기준 상대경로**로 하드코딩. pages/*.html에서 ⌘K로 실행하면 `pages/pages/dashboard.html` → 404. `window.GMM_COMMANDS` 오버라이드는 어떤 페이지에도 없음(전체 grep 0회).
- 조치: app.js에서 현재 문서 경로를 감지해 프리픽스를 계산하거나, 각 페이지에 `GMM_COMMANDS`를 주입.

### P4 — 배지 텍스트 대비 미달 (WCAG 4.5:1)
12px semibold 배지에서:
- `.badge--accent` 흰 글자 on `--gradient-accent`(#14B8A6 시작) — 틸 구간 **약 2.5:1** (components/display.css:13, 사용처: index.html:317, pricing.html:45, dashboard.html:172 등)
- `.badge--warm` 흰 글자 on #EC4899 시작 — **약 3.5:1** (display.css:12)
- `.badge--warning` #D97706 글자 on 라이트 warning-weak 배경 — **약 3.1:1** (display.css:15 + semantic.css:66)
- 조치: 배지용은 딥 스톱 그라디언트 변형(`teal-700→blue-700` 등)을 별도 토큰으로 만들거나 글자색을 진하게. `--color-warning` 계열은 라이트 모드에서 #B45309 수준으로 하향. (semantic.css:66-68의 `--color-warning-fg:#FFFFFF`도 #D97706 위 3.1:1 — 사용처가 생기는 순간 터지는 지뢰.)

### P5 — 오로라 레이어 회전 시 모서리 노출
base.css:77-88 `body::after`는 `inset: 0`인데 `aurora-spin`으로 360° 회전 — 회전 중 사각형이 뷰포트 모서리를 덮지 못해 오로라가 모서리에서 끊김(다크 모드에서 특히 감지됨). `body::before`처럼 오버사이즈 필요.
- 조치: `inset: -50%` (또는 width/height 200vmax 원형 레이어)로 확장.

### P6 — index 갤러리 `grid-column: span 2` 모바일 오버플로 의심
index.html:496, 517 (테이블·캐러셀 카드)이 `repeat(auto-fill, minmax(330px,1fr))` 그리드(index.html:38)에서 `span 2` — 컨테이너가 1열만 수용하는 폭(≈760px 미만)에서 암시적 트랙을 강제 생성해 가로 오버플로/찌그러짐 발생 가능. `@media`에서 `grid-column: auto`로 해제하거나 `span 2`를 `grid-column: 1/-1`로.

### P7 — 상태·토큰 규율 소결함
- **focus-visible 공백**: 전역 링(base.css:178-182)이 있어 치명적이진 않으나, `feedback.css`(0회)·`navigation.css`(0회)·`display.css`(0회)는 자체 focus 스타일이 없음. 특히 base.css:181의 `border-radius: var(--radius-sm)`가 포커스 시 원형 요소(FAB, `.carousel__nav`, pagination 버튼)의 radius를 덮어쓸 수 있음(로드 순서상 대부분 컴포넌트 룰이 이기지만 클래스 없는 요소는 각지게 변형됨). `:focus-visible`에서 radius 지정을 제거하고 필요한 곳만 개별 지정 권장.
- **raw 램프 직접 참조** (semantic 우회, README.md:136 원칙 위반): pages/kanban.html:67-89 인라인 `border-left:3px solid var(--blue-400|--pink-400|--purple-500|--teal-500)` — 우선순위 시맨틱 토큰(`--priority-low/mid/high` 등) 신설로 흡수. components/forms.css:219 별점 `#F59E0B` 하드코딩(램프 외 색), components/buttons.css:88 danger 그라디언트 하드코딩(semantic 토큰화 권장), dashboard.html:114-117 도넛 범례 `background:#7C5CFF` 등 하드코딩(→ `var(--chart-1…4)`).
- **`--font-mono` 스택에 "Noto Sans KR"** (tokens.css:178) — 모노 스택에 프로포셔널 한글 산세리프가 끼어 있음. 한글 모노 필요 시 "Nanum Gothic Coding" 또는 그냥 시스템 mono 폴백.
- **kanban 드래그**: `draggable="true"`인데 드롭 로직 없음(CHECKLIST.md:92에 의도 명시 — OK). 단 드래그 시작만 되고 아무 일도 없는 것은 데모 품질상 아쉬움 → dragover 시 컬럼 하이라이트+DOM 이동 정도의 최소 구현 가치 있음.
- index.html:608 템플릿에 `data-reveal data-reveal="${i*40}"` 중복 속성(첫 번째 빈 값 채택, 딜레이 값 무시됨).
- index.html:73 navbar "문서" 링크가 `README.md` 원문 파일로 연결 — 브라우저에서 raw 텍스트/다운로드로 열림. 데모 품질상 제거 또는 in-page 문서 섹션으로 대체 권장.

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 것)

1. **Hero 비대칭 해체 + '메시 오브' 시그니처 비주얼** — 현재 index hero(index.html:94-111)는 중앙정렬 배지+제목+CTA+숫자 4개의 전형적 공식. 좌측 60%에 초대형 한글 디스플레이(`--text-7xl`, `.text-gradient`)를 좌정렬로 몰고, 우측에 **화면 밖으로 잘려나가는 대형 메시 구체(conic+radial 그라디언트 원)**를 오버랩. 숫자 스탯은 구체 위에 매트 글래스 칩으로 흩뿌려 비대칭·오버랩 구도로. 메시 배경이 DNA이므로 "배경의 메시가 전경 오브젝트로 응축된다"는 스토리가 생김.
2. **포인터-반응 카드 블룸 (Linear/Vercel식 spotlight)** — app.js에 이미 rAF 포인터 파이프라인(71-90)이 있음. 카드에 `--mx/--my` 변수를 흘려 `card--hover`에서 `radial-gradient(240px at var(--mx) var(--my), rgba(124,92,255,.12), transparent)` 하이라이트 + 보더 글로우가 커서를 따라오게. "hover lifts and blooms"(README.md:15)를 문자 그대로 구현하는 시그니처 마이크로인터랙션.
3. **회전 그라디언트 보더 빔** — pricing의 featured 플랜(pricing.html:66 `card--gradient-edge` + scale 1.03뿐)에 `@property --angle` + conic-gradient 마스크로 **천천히 도는 그라디언트 테두리 빔**을. FAB·primary 버튼 focus에도 응용. reduced-motion 시 정지. "Gradient as signal" 원칙의 최상급 표현.
4. **섹션별 메시 무드 시프트 (컬러 저니)** — `--mesh-blob-*`가 이미 변수이므로, 스크롤/페이지별로 지배 색을 전환: 대시보드=퍼플·블루, 프라이싱=핑크·퍼플(warm), 온보딩=틸·블루. IntersectionObserver(이미 initReveal에 존재, app.js:586)로 body에 `data-mood` 클래스만 토글하면 CSS 전환으로 구현 가능. "페이지마다 배경이 다른 감정을 갖는다"는 기억점.
5. **테마 토글 오로라 스윕** — 다크↔라이트 전환(app.js Theme, 22-49)을 View Transitions API로 감싸 원형 클립 스윕 또는 오로라가 화면을 쓸고 지나가는 600ms 전환. 미지원 브라우저는 현행 즉시 전환 폴백.
6. **404를 '길 잃은 블롭' 인터랙티브 씬으로** — 404.html:32의 정적 그라디언트 "404" 숫자를, 커서를 피해 다니는 메시 블롭 3개 + 눌러서 터뜨리는 인터랙션으로. 지금은 "trio of empty-state cards"가 아래 붙은 리포트형 구성 — 한 화면짜리 장면(scene)으로 승격.
7. **차트 gradient-stroke 대형 수치** — dashboard KPI(dashboard.html:68-85)의 값 숫자를 `--text-4xl` gradient clip으로 키우고, 스파크라인을 각 카드 하단에 흐르게(이미 `.sparkline` 스타일 존재, data.css:104-106 — 실사용 0회로 방치됨).

---

## 6. 한글 폰트 페어링

- **현재 스택** (tokens.css:173-178): display/body = `"Plus Jakarta Sans" → "Gothic A1" → "Noto Sans KR"` / mono = `"JetBrains Mono" (+ 잘못 끼어든 "Noto Sans KR")`
- **로드** (tokens.css:12): Gothic A1 400/500/700 + Noto Sans KR 400/500/700 + **Noto Serif KR 400/500/600/700(미사용 — 삭제 대상)**; base.css:11: Plus Jakarta Sans + JetBrains Mono
- **평가**: 기하학적 영문 산세리프(Plus Jakarta Sans)에 Gothic A1을 한글 짝으로 붙인 것은 이 테마의 모던 SaaS DNA에 **적합 — 보존**. 서재풍 세리프가 실제 렌더에 쓰인 곳은 없음(지문은 import 라인 하나뿐).
- **권장 조치**:
  1. tokens.css:12에서 Noto Serif KR 제거 (4웨이트 낭비 + 세리프 관성 화석).
  2. 페이지 한글화(§3-1) 후 한글 디스플레이 타이포가 무게감을 잃으면 Gothic A1에 800 웨이트 추가 로드(현재 `--weight-extra: 800`이 한글에서 700으로 강등됨 — display-1/2가 `--weight-extra` 사용, base.css:166-169).
  3. `--font-mono`에서 "Noto Sans KR" 제거.
  4. 한글 디스플레이에 `letter-spacing: var(--tracking-tighter)`(-0.04em)가 그대로 적용되면 과밀 — 한글 헤딩은 -0.01~-0.02em 수준으로 보정하는 `:lang(ko)` 규칙 검토.

---

## 구현 우선순위 요약

| 순위 | 작업 | 근거 |
|---|---|---|
| 1 | pages 9개 전면 한글화 (lang·카피·데이터) + app.js UI 문자열 한글화 | §3-1, §3-2 |
| 2 | SVG `stroke="var()"` 16곳 교체 | §4-P1 |
| 3 | data-toast 중복 속성 4곳 + cmdk 경로 버그 + 배지 대비 | §4-P2/P3/P4 |
| 4 | 오로라 모서리·grid span 2 반응형·focus radius | §4-P5/P6/P7 |
| 5 | 대담화: hero 해체 + 카드 블룸 + 보더 빔 + 무드 시프트 | §5 |
| 6 | 폰트 정리 (Noto Serif KR 제거, Gothic A1 800 추가) | §6 |
