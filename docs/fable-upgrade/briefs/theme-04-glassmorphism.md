# 감사 브리프 — theme-04-glassmorphism (Aurora Glass)

- 감사일: 2026-07-04 · 감사자: 시니어 프로덕트 디자이너 감사관 (읽기 전용)
- 테마 경로: `design-systems/theme-04-glassmorphism/`
- HTML 파일 수: 10 (index.html + pages/ 9개)
- 구성: theme.css(진입점) → tokens.css / semantic.css / base.css / components/*.css(11개) + app.js(642줄, 바닐라)

---

## 1. DNA 요약

**정체성 1문장**: 바이올렛→블루→마젠타→시안 멀티컬러 오로라 메시 배경 위에, backdrop-filter로 배경을 굴절시키는 반투명 프로스티드 유리 패널이 떠 있는 "투명·부유·경쾌"의 글래스모피즘.

**명시된 규칙** (README.md / 토큰 주석):
- 3겹 깊이 레이어: ① 오로라 메시+블롭 배경(README.md:14, base.css:77–156) ② 유리 표면 = rgba alpha + blur 18/28px + 1px 라이트 림 + 상단 스페큘러 하이라이트(tokens.css:84–94, `--glass-edge` tokens.css:188–189) ③ 가독 레이어 — "텍스트는 항상 충분히 불투명한 `--glass-bg-strong` 위" (README.md:16)
- **금지**: "무겁고 불투명한 면은 쓰지 않습니다" (README.md:18)
- 시그니처 모션: hover = 글로우 강화 + `translateY(-2px)` 부유, 포커스 = 평평한 아웃라인이 아닌 **비비드 글로우 링**(README.md:19, base.css:310–314, tokens.css:200–207)
- 형태: 큰 라운드(radius-lg 24px), 알약 버튼(`--btn-radius: --radius-full`), 소프트 섀도 + 컬러 글로우
- 폴백 3종: `prefers-reduced-transparency`(semantic.css:257–275), `@supports not backdrop-filter`(semantic.css:278–288), `prefers-reduced-motion`(base.css:374–382)
- 시그니처 헤딩 처리: `.text-gradient` 오로라 워시(base.css:191–201)

이 테마의 DNA는 **투명 유리 + 비비드 오로라**이므로, 크림/종이/세리프 계열은 어떤 형태든 DNA 근거가 없다 (아래 3-3 참조).

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

1. **유리 레시피의 완전한 토큰화 + 3중 접근성 폴백** — `--glass-bg/strong/solid/border/highlight/inner/blur/saturate/tint`가 원시 토큰(tokens.css:84–94)으로 분리되고, 라이트/다크가 semantic.css:28–35/106–113에서 오버라이드되며, reduced-transparency·no-backdrop-filter 폴백(semantic.css:257–288)까지 갖춤. "유리 농도는 변수 2개로 조절"(README.md:171)이 실제로 작동하는 구조. **이 레시피 위에 광학 효과를 얹기만 하면 됨 — 구조는 건드리지 말 것.**
2. **분위기(atmosphere)가 이미 존재** — 고정 오로라 메시 + SVG fractalNoise 그레인으로 밴딩 제거(base.css:92–100) + 떠다니는 블롭 4개(각기 다른 주기 22/26/30/28s, base.css:112–147) + 옵트인 마우스 패럴랙스(base.css:150–156, app.js:61–94), 게다가 페이지가 배경 마크업을 빠뜨려도 app.js:46–59가 자동 주입. 30개 테마 중 "밋밋한 배경" 지문이 없는 드문 케이스. **여기서 멈추지 말고 스크롤/시간 연동 색상 연출로 확장할 것.**
3. **인터랙션 밀도와 상태 커버리지** — 버튼 5변형×3사이즈×hover/active/disabled/loading(buttons.css:35–136), 폼 invalid/valid/disabled(forms.css:50–61), 포커스 글로우 링 전면 적용(base.css:310–314 + 컴포넌트별 15곳), ⌘K 팔레트 키보드 내비+포커스 트랩(app.js:96–210), 칸반 DnD·위저드·카운터·정렬 테이블까지 642줄 바닐라 JS. 부가로 index 히어로의 **떠 있는 위젯 클러스터**(index.html:76–110 + 477–483)는 절대배치 오버랩 구도로, 이 테마가 이미 갖고 있는 "탈 그리드" 감각 — 더 과감하게 확대할 가치가 있음.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 3-1. 죽은 서재 세리프 잔재 + 폰트 로딩 이중화 (가장 명백한 지문)
- **tokens.css:11** — `@import`가 `Gothic A1 + Noto Sans KR + **Noto Serif KR(400;500;600;700)**`을 로드하는데, **Noto Serif KR은 테마 전체 어디에서도 사용되지 않음** (serif font-family 선언 0건 확인). 글래스모피즘에 세리프를 넣으려다 만 '서재 감성 관성'의 화석이며, 4웨이트 낭비 로드. → **import에서 제거.**
- 같은 줄의 모순: README.md:76은 "Google Fonts(Plus Jakarta Sans + JetBrains Mono)"라고 명시하지만 tokens.css의 import에는 둘 다 없고, 대신 각 HTML이 `<link>`로 따로 로드(index.html:11, pages/* 전부). 폰트 로딩 경로가 CSS/HTML 두 갈래로 갈라져 있음 → 한쪽으로 통일.

### 3-2. 예측 가능한 섹션 공식 (hero + 카드그리드 반복)
- 모든 마케팅형 페이지가 `eyebrow → h2 → .lead(max-width 640px) → 카드 그리드` 리듬을 동일하게 반복: index.html:118–122(토큰), 193–197(컴포넌트), 335–339(쇼케이스), pricing.html:145–149, 404.html:132–136. 간격도 전부 `.section-sm` 균질. 리듬 파괴 없음 = AI 티.
- **쇼케이스 카드 썸네일이 플랫 그라데이션 직사각형**(index.html:342 `thumb-dash` 등, 정의 496–504 — 하드코딩 hex 2색 linear-gradient 9개). "9개의 실제 화면"이라는 카피 아래 놓인 placeholder성 썸네일 — 성의 없는 filler의 전형.

### 3-3. 자기지시적 dev-tool 카피 + 농담 filler
- index.html:54 히어로 배지 "`v1.0 · 프로덕션급 글래스 시스템`", index.html:195 "`64개 컴포넌트, 전부 유리 기반`" — 제품 화면이어야 할 히어로가 자기 자신(디자인시스템)을 설명하는 메타 카피. 데모 허브라 어느 정도 허용되나, 히어로만큼은 가상 제품 톤으로.
- index.html:326 탭 리뷰 패널: `"마치 진짜 유리 같다" — 모든 리뷰어.` — 농담형 filler.
- 영문 eyebrow 잔재: pricing.html:50 "`PRICING`", 404.html:133 "`Empty States`" (한글 중심 시스템에서 근거 없는 영문 라벨).
- app.js:641 `console.log("%c✦ Aurora Glass ready", ...)` — 브랜딩 콘솔 이스터에그(무해하나 dev-tool 지문).

### 3-4. 인라인 스타일 범벅 (생성 코드 특유의 유틸리티 회피)
- index.html에 `style=""` 85개, product.html 73개, profile.html 45개 (grep 카운트). `max-width:1480px;margin-inline:auto`가 index.html에서만 8회 반복(19, 50, 117, 192, 334, 392행 등) — `.container-wide`가 이미 있는데 인라인으로 덮어씀(base.css:249는 1480px인데 또 인라인 지정). 프로 손이라면 클래스로 승격했을 부분.

**지문이 아닌 것 (오판 금지)**: 비비드 그라데이션·글로우·큰 라운드·블러는 전부 DNA다. 카피 자체는 대체로 한국어이고 구체적(₩ 단가, 주문번호, 실명 이메일)이라 filler 수준이 높지 않음.

---

## 4. 프로덕션 결함 (파일:라인 필수 근거)

### P0 — 렌더/기능 깨짐
1. **SVG 속성에 var() 직접 사용 (알려진 렌더 버그)** — `pages/dashboard.html:108` `<g stroke="var(--color-divider)" stroke-width="1">` (매출 추이 차트 그리드라인). SVG presentation attribute에서 var()는 깨진다. → `style="stroke:var(--color-divider)"` 또는 `stroke="currentColor"`+색 지정으로 교체. (테마 전체 grep 결과 이 1건뿐)
2. **769–900px 구간에서 앱 내비게이션 완전 소실** — layout.css:43–50이 `max-width:900px`에서 사이드바를 off-canvas(`translateX(-100%)`)로 숨기는데, 이를 여는 햄버거 버튼(dashboard.html:46 등)은 `.show-mobile`이라 base.css:369–371(`min-width:769px`에서 display:none)에 의해 **769–900px에서는 버튼도 사이드바도 안 보임**. dashboard/kanban/inbox/settings/profile 5개 앱 페이지 공통. → 브레이크포인트를 900px로 통일하거나 `.show-mobile` 기준을 900px로.
3. **마케팅 내비도 동일 문제** — navigation.css:40–43이 900px 이하에서 `.navbar-links`를 숨기고 `.navbar-toggle`을 표시하지만, **`.navbar-toggle` 요소가 어떤 HTML에도 존재하지 않음** (index.html:26–31, pricing.html:26–30). 모바일에서 내비 링크 접근 불가.

### P1 — 상태/UX 누락
4. **오프캔버스 사이드바에 스크림·닫기·ESC 없음** — 사이드바 열기는 `data-toggle-class`(app.js:632–637) 단순 클래스 토글이라, 바깥 클릭/ESC로 닫히지 않고 포커스 트랩도 없음 (drawer/modal은 갖춘 것과 대조적).
5. **⌘K 빈 결과 상태가 마크업에 없음** — app.js:178–179가 `.cmdk-empty`를 찾고 overlay.css:131에 스타일도 있으나, index.html:449–468 및 pages/* 어느 cmdk에도 해당 요소가 없음 → 검색 결과 0건이면 그냥 빈 목록.
6. **테이블 정렬이 마우스 전용** — app.js:446–464가 `th.sortable`에 click만 바인딩. `<th>`에 button/`tabindex`/`aria-sort` 초기값이 없어 키보드로 정렬 불가(dashboard.html:142–145).
7. **폼 에러 상태가 CSS에만 존재** — `.is-invalid`/`.field-error`(forms.css:17–18, 59–61) 데모가 HTML 어디에도 없음. 갤러리에 에러 필드 1개 이상 노출 필요.

### P2 — 토큰 우회·일관성
8. **하드코딩 색상**: buttons.css:87 `#fb5e7e`(danger 그라데이션 시작색 — 토큰 없음), controls.css:163 rating 별 `#f59e0b`(→ `--chart-5` 또는 전용 토큰), forms.css:66 select 화살표 data-URI `stroke='%237c5cff'`(다크 테마에서 primary는 violet-400으로 바뀌는데 화살표는 500 고정), index.html:496–504 썸네일 그라데이션 hex 18개, data-display.css:97–109 코드블록 팔레트 전부 hex(항상 다크인 표면이라 의도적일 수 있으나 토큰화 권장).
9. **`.sr-only` 3중 복제 vs 죽은 `.visually-hidden`** — base.css:51–57에 `.visually-hidden`이 있지만 HTML 사용 0건. 대신 pricing.html:403 / product.html:466 / onboarding.html:243이 각자 `.sr-only`를 로컬 정의. → base.css에 `.sr-only`로 통일.
10. **index.html:505의 `[data-reveal]` 로컬 스타일이 안전 게이트 우회** — base.css:336–343은 `.js-ready`에서만 숨기도록 고쳐놨는데(CHECKLIST 7-1 수정사항), index.html:505가 무조건 `transform: translateY(20px)`를 걸어 JS 실패 시 콘텐츠가 20px 밀린 채 남음(opacity는 1이라 치명적이진 않으나 수정 취지 위반).

### P3 — 대비/체감 품질
11. **"본문은 glass-bg-strong 위" 원칙이 실제로 미적용** — README.md:16·CHECKLIST:79 주장과 달리 `--card-bg: var(--glass-bg)`(semantic.css:191)라 카드 본문/`.card-subtitle`(muted #515a76)이 **alpha 0.16 유리** 위에 놓임. 라이트 테마에서 뒤에 진한 mesh-1(violet 0.55)이 지나가면 4.5:1 미달 가능. → 텍스트 밀도 높은 카드는 `card-bg-strong` 기본화 또는 카드 내부 가독 스크림 추가.
12. **다크 모드 FOUC** — `<html data-theme="light">` 하드코딩 + app.js가 body 끝에서 테마 적용 → 다크 선호 사용자에게 흰 화면 플래시. `<head>` 인라인 1줄 스크립트로 선적용 권장.
13. 깨진/어색한 링크: index.html:30·399–400의 `href="./README.md"` `./CHECKLIST.md` — 브라우저에서 raw 텍스트/다운로드로 떨어짐.

---

## 5. 대담화 기회 — "프로라면 여기까지 민다"

1. **진짜 유리의 광학: 스페큘러 스윕 + 색수차 엣지 (시그니처 한 방)** — 지금 유리는 정적인 rim+highlight뿐. hover/focus 시 패널 표면을 **사선으로 훑고 지나가는 빛줄기**(::after에 conic/linear gradient + transform 애니메이션, `--duration-slow` + `--ease-out`)와, 림 1px에 서브틀한 RGB 분리(색수차: box-shadow 두 겹을 violet/cyan으로 ±1px 오프셋)를 추가. 기존 `--glass-edge` 토큰 확장(`--glass-sweep`, `--glass-fringe`)으로 구현하면 전 컴포넌트에 일괄 전파됨.
2. **패널 3D 틸트 패럴랙스** — 패럴랙스 인프라(app.js:61–94, `--parx/--pary`)가 블롭에만 적용됨. 이를 히어로 위젯 클러스터(index.html:76–110)와 `.card-interactive`에 `perspective + rotateX/Y(±3°)`로 확장하면 "유리판이 공중에 떠서 기우는" 체감이 완성됨. reduced-motion 가드 기존 패턴 재사용.
3. **스크롤 연동 오로라 색상 시프트** — 스크롤 진행도에 따라 `--mesh-1..4`의 hue를 서서히 회전(JS로 `filter: hue-rotate` 또는 mesh 변수 보간). 랜딩 최상단은 violet 지배 → 하단은 cyan/magenta 지배로 이동해 '페이지가 하나의 오로라를 통과하는' 내러티브. 다크 모드에서 특히 극적.
4. **쇼케이스 썸네일을 미니어처 글래스 씬으로** — index.html:496–504의 플랫 그라데이션 9개를, 각 페이지의 축소 목업(미니 칸반 컬럼 3개, 미니 KPI+차트 곡선, 미니 3패널)을 유리 조각으로 얹은 씬으로 교체. 404.html의 `err-shard`(37–47행) 패턴을 재활용하면 코드 비용 낮음. AI 지문 3-2 해소와 대담화를 동시에.
5. **섹션 리듬 파괴** — 토큰 섹션(index.html:116–188)을 대각선 구도로: 컬러 램프를 45° 회전한 띠로 배경에 오버사이즈 배치하고 유리 카드가 그 위를 가로지르게. 최소 한 섹션은 좌우 비대칭(7:5) + 요소 하나가 섹션 경계를 침범(negative margin overlap)하도록.
6. **404를 '깨진 유리'로** — 404.html:90의 숫자를 shard들이 실제로 **가리고 굴절**시키도록 shard에 `backdrop-filter`를 살리고 숫자 위로 겹치기(현재 z-index:-1로 뒤에만 있음, 404.html:37). 숫자 일부가 유리 뒤에서 blur+tint되면 테마 서사('유리 파편')가 완성됨.
7. (하드닝 겸) 인라인 스타일 85개 → 유틸/컴포넌트 클래스 승격, `container-wide` 인라인 중복 제거 — 대담한 리팩터가 아니라 프로덕션 위생이지만, 위 1–6 작업의 선행 조건.

---

## 6. 한글 폰트 페어링 (현황 기록 + 판단)

**현재 스택** (tokens.css:121–124):
- sans: `"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Gothic A1", "Noto Sans KR", sans-serif`
- mono: `"JetBrains Mono", "SFMono-Regular", ui-monospace, "Menlo", "Consolas", "Noto Sans KR", monospace`
- 로드(tokens.css:11): Gothic A1 400/500/700 + Noto Sans KR 400/500/700 + **Noto Serif KR 400/500/600/700(미사용)**; Jakarta/JetBrains는 각 HTML `<link>`로 별도 로드.

**판단**:
- 방향(라틴 지오메트릭 라운드 산세 + 한글 고딕)은 DNA에 부합 — **산세리프 페어링은 보존**. 서재풍 세리프 강제 사례는 없음. 단 **미사용 Noto Serif KR import는 서재 관성 잔재이므로 제거 대상**(3-1과 동일 건).
- 결함 2건: ① 한글 폰트가 `-apple-system`/`system-ui` **뒤에** 위치해 macOS/Windows에서 시스템 한글 폰트가 먼저 잡힐 수 있음 — 의도한 페어링이라면 `"Gothic A1"`을 라틴 폰트 직후로 전진 배치. ② 시스템이 `--weight-extrabold: 800`(tokens.css:144, display/h1에 사용)을 쓰는데 한글은 700까지만 로드 → 한글 헤딩이 faux-bold 처리됨. Gothic A1 800(또는 Noto Sans KR 800/900) 웨이트 추가 로드 필요.
- 업그레이드 후보(선택): Plus Jakarta Sans의 둥근 모던 무드에는 Gothic A1보다 **SUIT** 또는 **Wanted Sans**가 라운드 터미널·기하 골격 면에서 더 정합. 교체 시 Phase2 페어링 기록 갱신 필수.

---

## 부록 — 구현 에이전트 작업 우선순위 제안

| 순위 | 작업 | 근거 |
|---|---|---|
| 1 | P0 3건 수정 (SVG var, 769–900px 내비, navbar-toggle 부재) | §4-1~3 |
| 2 | Noto Serif KR 제거 + 폰트 로딩 단일화 + 한글 800 웨이트 | §3-1, §6 |
| 3 | 카드 가독 표면 보정(P3-11) + 다크 FOUC(P3-12) | §4-11~12 |
| 4 | 시그니처 광학(스윕+색수차) + 패널 틸트 | §5-1~2 |
| 5 | 썸네일 미니어처 씬 + 섹션 리듬 파괴 + 404 굴절 | §5-4~6 |
| 6 | 카피 정리(메타 카피·영문 eyebrow·농담 filler) + 인라인 스타일 승격 + P1/P2 잔여 | §3-3~4, §4-4~10 |

**보존 금지선**: 토큰 계층 구조(원시→시맨틱→컴포넌트), 3중 접근성 폴백, 오로라 자동 주입, 알약 버튼·글로우 포커스 링, 한글 산세 페어링 방향.
