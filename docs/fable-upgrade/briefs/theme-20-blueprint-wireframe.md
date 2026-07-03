# 감사 브리프 — theme-20-blueprint-wireframe

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-20-blueprint-wireframe/`
- HTML 페이지 수: 10 (index.html + pages/ 9개)
- 파일 구성: tokens.css / semantic.css / base.css / components/ 9파일 / app.js(820줄) / README / CHECKLIST

---

## 1. DNA 요약

**"Drawn, not filled" — 건축 도면·CAD 와이어프레임의 언어.** 블루프린트 네이비 필드(`--navy-800 #0E2A47`) 위에 시안(`--cyan-400 #5BC8FF`)·화이트 1px 헤어라인으로만 그린다. 면(fill)·그라데이션·소프트 섀도·둥근 모서리는 명시적 금지이며, 깊이는 그림자가 아니라 **라인 굵기**로 표현한다.

### 명시된 규칙 (주석/README 근거)
| 규칙 | 근거 |
|---|---|
| 채움색 위주 디자인·그라데이션·소프트섀도·곡선 장식 **금지** | README.md:25 |
| `--shadow-* = none`, 유일한 엘리베이션 = `--ink-echo`(무블러 1px 링 + 오프셋 헤어라인) | tokens.css:212-220 |
| `--radius-* = 0` 직각 원칙, `--radius-full`은 진짜 원(점/노드)에만 예약 | tokens.css:192-197 |
| "Surfaces are NOT filled — everything is drawn with 1px hairline strokes" | tokens.css:5-8, semantic.css:17 (`--color-surface: transparent`) |
| 차트도 전부 라인 스트로크 ("the blueprint never fills an area solid") | components/charts.css:2-4 |
| 간격은 4px/20px 격자 모듈 정렬 (`--space-5 = 20px` = fine grid 1칸) | tokens.css:120-138 |
| 호버 = 시안 라인 하이라이트, 포커스 = 시안 2px 링 | components/buttons.css:3-4, tokens.css:224-228 |
| 모노스페이스 우선 (JetBrains Mono) + 기술 산세리프 라벨, 대문자 와이드 트래킹 | tokens.css:144-150, base.css:94-104 |

### 시그니처 모티프 어휘 (base.css)
- 엔지니어링 모눈 격자 `.bp-grid` (미세 20px + 굵은 기준선 100px, base.css:148-178)
- 치수선 `.bp-dim--h/--v` (양끝 틱 + 측정값 라벨, base.css:242-316)
- 주석 콜아웃 `.bp-callout` (지시선 + 노트 태그, base.css:318-353)
- 45° 단면 해치 `.bp-hatch` (base.css:355-372)
- 크로스헤어 프레임 `.bp-frame` / 등록 마크 `.bp-reg-mark` (base.css:180-240)
- 스케일 바 / 좌표 룰러 (base.css:374-397), 도면 표제란 `.title-block` (layout.css:75-85)
- JS 토글: 격자/치수선 표시 on·off (`data-toggle-grid` / `data-toggle-dims`) — "도면 레이어를 켜고 끈다"는 테마 고유 인터랙션

**주의: 이 테마의 영문 CAD 스탬프 어휘(SHEET 20/20, REV 1.0, FIG.01, SCR-01, NOTE A-01 등)는 도면 표기 관례로서 DNA다. '영문 dev-tool 문구 남발' 지문으로 오판해 제거하면 안 된다.** 한글 본문 + 영문 도면 스탬프의 이중 표기가 이 테마의 목소리다.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 모티프 유틸리티 시스템의 완성도 — 진짜 '제도 언어'로 UI를 설명한다
`.bp-dim`(치수선), `.bp-callout`(주석), `.bp-hatch`(해치), `.title-block`(표제란)이 장식이 아니라 **재사용 가능한 CSS 유틸리티 계층**으로 토큰화되어 있다(tokens.css:83-117 드래프팅 토큰 → semantic.css:52-59 `--motif-*` 라이트/다크 해석 → base.css §3-8 구현). 카드 상단 치수 태그 `.card--dim::after`(display.css:36-47), 추천 요금제의 `RECOMMENDED` 스탬프(layout.css:61-65), 드로어의 스펙 리스트(layout.css:93-99)까지 실제 컴포넌트에 침투해 있다. **이 어휘를 페이지 레벨 구도(섹션 간 치수 표기, 여백 자체를 측정하는 치수선)로 더 확장할 가치가 크다.**

### ② 콘텐츠가 세계관 안에 있다 — filler가 아니라 '도면 사무소'의 데이터
담당자 이름이 김설계/이도면/박치수(index.html:354-356), 테이블 데이터가 "A-101 평면도 / E-204 전기도 / P-330 배관도"(index.html:481-484), 404가 "미완성 도면 + SECTION MISSING 콜아웃 + 치수값 ???"(pages/404.html:31-52), 상품 페이지가 제도용 테이블 T-900의 실측 도면(pages/product.html:36-64)이다. 온·오프 카피 모두 도메인 어휘로 일관 — AI filler 카피 지문이 거의 없다. **이 세계관 밀도를 유지·강화할 것.**

### ③ 상태·인터랙션 골격이 실하다
버튼 5변형 × hover/active/disabled/loading + 호버 시 코너 틱 디테일 `.btn--tick`(buttons.css:108-120), 폼 invalid 상태(forms.css:22-25), empty/skeleton 갤러리(pages/404.html:66-107), 포커스 트랩 모달/드로어(app.js:218-229), aria-sort 정렬 테이블(app.js:568, table.css:44-47), 격자/치수선 토글의 aria-pressed 동기화(app.js:60-78). 정적 쇼케이스가 아니라 동작하는 시스템이다.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 지문 A — 죽은 세리프 임포트: 서재 관성의 잔재
- **tokens.css:11** — `@import`가 **Noto Serif KR 4웨이트(400;500;600;700)를 로드하지만 코드베이스 전체에서 단 한 번도 사용되지 않는다** (`--font-*` 어디에도 Serif 없음, grep 검증 완료). CAD·제도 테마에 세리프는 근거가 전혀 없다. '일단 세리프를 넣고 보는' AI 관성의 화석이며 로딩 낭비이기도 하다. → **임포트에서 제거.**
- 같은 줄에서 Noto Sans KR도 로드하는데 실제 한글 폴백 1순위는 Gothic A1/Nanum Gothic Coding이라 역할 중복. 웨이트 정리 여지 있음.

### 지문 B — "hero + 균질 카드그리드" 공식의 허브 페이지
- **index.html:135-197** — DEMO SCREENS 섹션이 9개의 **완전히 동일한 구조의 카드**(card-label → card-title → 설명 p → bp-dim)를 3열 그리드로 나열. 간격·크기·리듬이 균질한 전형적 AI 카드그리드다. 이 테마의 DNA라면 이 허브는 카드 진열대가 아니라 **'도면 등록 대장(drawing register)' 테이블**이나 **시트 번호가 매겨진 도면 인덱스 플레이트**여야 한다.
- **index.html:73-81** — hero 하단 "60+ 컴포넌트 / 9 데모 화면 / 2 테마 / AA+ 명암비" 통계 행: AI 디자인시스템 랜딩의 상투구. 이 정보는 표제란(title-block) 형식으로 녹이는 게 DNA에 맞다.

### 지문 C — 균질한 섹션 리듬 + 범용 fade-up 모션
- index.html의 모든 섹션이 동일한 `padding-block:var(--space-9)` + 동일한 `.section-head`(번호+제목+rule) 패턴 반복(index.html:53, 135, 200, 241, 272). 예측 가능한 수직 리듬 — 프로 도면이라면 시트마다 구획 밀도가 다르다.
- **base.css:560-571** — `.anim-reveal`이 40ms 균등 스태거의 범용 fade-up. 테마 고유의 `bp-draw-x`(line-draw), `bp-dash`(stroke-dashoffset) 키프레임이 이미 정의되어 있는데(base.css:545-558) **차트 1곳(charts.css:26)에서만 쓰인다.** '선이 그려지는' 모션이 이 테마의 시그니처가 되어야 하는데 범용 페이드가 자리를 차지한 상태.
- `[data-reveal]`도 translateY 페이드(base.css:583-585)로 동일한 범용 패턴.

### 지문이 아닌 것 (구분)
- 크림 톤 라이트 모드(`#f4f1e9`, semantic.css:66)는 서재 감성이 아니라 **드래프팅 벨럼(제도용지)** 재해석으로 DNA 근거가 있다. 유지.
- 영문 대문자 캡션 남발처럼 보이는 SHEET/REV/FIG/SCR 표기는 도면 표기 관례 = DNA. 유지·강화.

---

## 4. 프로덕션 결함

### 결함 1 — [치명·알려진 렌더 버그] SVG stroke/fill HTML 속성에 var() 직접 사용 (총 64건)
CSS 변수는 SVG presentation attribute에서 렌더가 깨진다(theme-07에서 확인된 버그). `style=""` 속성 또는 `currentColor`/CSS 클래스로 옮겨야 한다.
- **index.html:90-123** (26건) — hero 도면 일러스트 전체. 예: `<line ... stroke="var(--cyan-400)"/>` (94행), `<text ... fill="var(--cyan-300)">`(96행), pattern 내부 line(90행), `<g stroke="var(--neutral-50)">`(123행)
- **pages/product.html:38-69** (22건) — 제품 치수 도면 + 썸네일 버튼 3개(67-69행 `stroke="var(--color-primary)"`, `stroke="var(--neutral-400)"`)
- **pages/404.html:34-51** (15건) — 404 와이어프레임 숫자 도면 전체
- **pages/onboarding.html:76** (1건) — 완료 체크 아이콘 `stroke="var(--color-primary)"`
- 참고: product.html:40 `fill="var(--color-bg)"`, 404.html:50 `fill="var(--color-bg)"`도 동일 대상. dashboard/inbox/kanban 등의 차트는 CSS 클래스 방식(charts.css)이라 안전 — **이 방식으로 통일하는 것이 정답.**

### 결함 2 — [반응형 깨짐] 인라인 grid-template-columns가 모바일 미디어쿼리를 우회
base.css의 반응형 규칙(436-442행)은 `.grid-2/3/4`만 1열로 접는다. 아래 4곳은 인라인 스타일이라 **모바일에서도 2열 유지 → 320~560px에서 차트/카드가 짓눌림**:
- pages/dashboard.html:98 `style="grid-template-columns:2fr 1fr"` (차트+위젯)
- pages/dashboard.html:163 동일 (데이터그리드+타임라인)
- pages/profile.html:57 `style="grid-template-columns:1fr 2fr"`
- pages/product.html:32 `style="grid-template-columns:1.1fr 1fr"` (도면+구매 정보)
→ 클래스화(`.grid-main-side` 등) + `@media (max-width:820px){1fr}` 필요.

### 결함 3 — [기능 없음 + 잘못된 ARIA] Segmented Control이 완전히 죽어 있음
app.js에 segmented 클릭 핸들러가 없다(grep 0건 — `[data-tabs]`만 바인딩, app.js:87-88).
- pages/dashboard.html:62-64 — 기간 선택(일/주/월): `role="group"`의 plain `<button>`에 `aria-selected` 부여 = **유효하지 않은 ARIA**(aria-selected는 tab/option/row 등에서만 유효) + 클릭해도 아무 일 없음
- pages/product.html:99 — 마감 선택(내추럴 오크/월넛/블랙): 동일 문제. 커머스 페이지에서 옵션 선택이 안 되는 것
- index.html:333-337 — `role="tablist"`+`role="tab"`이지만 `data-tabs` 속성과 연결 tabpanel이 없어 핸들러 미바인딩·키보드 조작 불가
→ app.js에 segmented 토글(클릭+방향키) 추가, `aria-pressed`(group) 또는 정식 tablist 패턴으로 정리.

### 결함 4 — [a11y 대비] 라이트 모드 상태색 텍스트 대비 미달
semantic.css:90-93 — 라이트 모드 `--color-success: var(--lime-500 #5fb82f)` ≈ **2.2:1**, `--color-warning: var(--amber-500 #d4951f)` ≈ **2.3:1** (배경 #f4f1e9 기준). 이 색이 텍스트로 쓰이는 곳: alert 타이틀(feedback.css:26-29), badge 텍스트, inline-note, `.text-success/.text-warning`(base.css:114-115), stat-delta(display.css:75-76). 다크 모드는 통과하나 라이트 모드는 AA 미달 → 라이트 전용으로 더 어두운 값(예: lime 계열 #3d7a1c급, amber 계열 #8a5f0e급) 신설 필요.

### 결함 5 — [a11y 소소] 기타
- pages/product.html:67-69 — 썸네일 토글 버튼: 첫 번째만 `aria-pressed="true"`, 나머지 2개는 aria-pressed 자체가 없음(false여야 함). 또한 `<button class="card card--static">`으로 카드 클래스 재사용 — hover 상태가 죽는(card--static) 선택 컨트롤.
- 숨김 모달/드로어 내부의 `autofocus` 6건(index.html:555, pages/inbox.html:101, pricing.html:118, onboarding.html:47, settings.html:109, kanban.html:105) — `data-open="false"` 상태의 dialog 안에 있어 일부 브라우저에서 로드 시 포커스/스크롤 점프 유발 가능. JS 포커스 트랩이 이미 첫 포커스를 처리하므로 속성 제거가 안전.
- 칸반 DnD 키보드 대체 수단 없음(CHECKLIST.md:108에 자인) — 카드에 컨텍스트 메뉴 '왼쪽/오른쪽 열로 이동' 정도의 키보드 경로 제공 권장.
- index.html:87-127 hero SVG의 `font-family="monospace"` 하드코딩(96, 108, 112, 119-121행) — 토큰 폰트와 불일치. style 이관 시 `var(--font-mono)`로 함께 교정.

### 결함 아님 (확인 완료)
- components/*.css 하드코딩 hex 0건 (전부 토큰 경유) ✅
- 깨진 내부 링크 없음, 페이지별 cmdk/모달 id 중복 없음 ✅
- `--color-text-subtle`(#8597a8 on #0e2a47) ≈ 4.85:1로 다크 모드 본문 AA 통과 ✅

---

## 5. 대담화 기회 (프로라면 밀어붙일 지점)

### 제안 1 — 허브를 '도면 등록 대장'으로 재구성 (지문 B 제거와 동시 해결)
index.html의 9개 균질 카드(135-197행)를 버리고, 실제 설계사무소의 **drawing register**처럼: 좌측에 큰 시트 번호(SCR-01…09)가 세로로 흐르는 인덱스 테이블 + 각 행 호버 시 우측에 해당 화면의 와이어프레임 미니 프리뷰(라인 스트로크 SVG)가 그려지는(bp-dash) 비대칭 2단 구도. 표제란(.title-block) 어휘를 행 단위로 확장하면 컴포넌트 재사용도 된다. 히어로 통계 행(73-81행)도 title-block 셀로 흡수.

### 제안 2 — 시그니처 모션: "선이 그려진다"를 시스템 전체의 등장 문법으로
이미 존재하는 `bp-draw-x`·`bp-dash`(base.css:545-558)를 확장해 `[data-reveal]`의 기본 동작을 fade-up이 아니라 **선 드로잉**으로 교체: 카드는 테두리가 시계방향으로 그려진 뒤 내용이 나타나고(border 4변을 pseudo-element scaleX/Y 스태거), 치수선은 중앙에서 양끝으로 자라며 틱이 마지막에 찍힌다. 스탯 숫자는 CAD 좌표 판독처럼 숫자 롤링. `prefers-reduced-motion` 처리 골격은 이미 있음(base.css:535-542). **이거 하나로 "AI 페이드"가 "제도 애니메이션"이 된다.**

### 제안 3 — 페이지 여백을 '측정'하라 — 레이아웃 자체의 도면화
치수선이 지금은 카드 내부 장식(카드 하단 `bp-dim`)에 머문다. 대담하게: 데스크톱(≥1320px)에서 **뷰포트 좌측 가장자리에 세로 좌표 룰러(.bp-ruler 변형) 고정**, 섹션과 섹션 사이 간격에 실제 px값을 표기하는 수직 치수선 배치(예: hero와 다음 섹션 사이 "80 (SP-12)"), 컨테이너 폭에 "1080 GRID" 수평 치수. 격자 토글(data-toggle-grid)과 연동해 함께 사라지게 하면 '도면 레이어' 개념이 완성된다.

### 제안 4 — 다크 히어로에 '청사진 감광' 분위기 레이어
현재 배경은 균일한 네이비+격자라 다소 평평하다. 그라데이션 금지 규칙을 지키면서도: 히어로 plate에 등거리 동심 사각 라인(offset outline 반복), 모서리 좌표 라벨(A/B/C · 1/2/3 열 표기), 접힌 자국을 암시하는 1px 대각 헤어라인 2줄 정도의 **라인 기반 질감**을 추가할 수 있다. 모두 선이므로 DNA 위반이 아니다. 라이트(벨럼) 모드에는 같은 자리에 연필 가이드 라인 톤(`--motif-grid-*` 활용).

### 제안 5 — 404를 테마의 '한 방'으로: 커서가 제도 십자선
404·인덱스 등 쇼케이스 페이지 한정으로 커서 위치를 따라다니는 풀-뷰포트 십자선(가로/세로 1px 라인 + 교차점 좌표 판독 "X:1042 Y:388" 모노 라벨)을 `--z-cursor:9999`(이미 예약된 미사용 토큰, tokens.css:242)로 구현. CAD 툴을 쓰는 감각을 즉시 전달하는 기억점이 된다. 터치 디바이스·reduced-motion에서는 비활성.

### 제안 6 — 온보딩을 '도면 승인 워크플로우'로 각색
onboarding.html의 범용 계정 마법사 스텝을 도면 세계관(시트 생성 → 축척 지정 → 레이어 권한 → REV-A 승인 스탬프 찍기)으로 재서술하고, 마지막 단계에서 등록 마크가 도장처럼 찍히는 마이크로인터랙션(scale + 잉크 번짐 없는 크리스프 등장)을 넣으면 세계관 밀도(강점 ②)가 페이지 전체로 확장된다.

---

## 6. 한글 폰트 페어링

| 역할 | 현재 스택 | 판정 |
|---|---|---|
| `--font-mono` (본문·데이터·버튼) | JetBrains Mono → IBM Plex Mono → … → **Nanum Gothic Coding**(한글) → Noto Sans KR | ✅ 보존. 한글 코딩 폰트 페어링이 CAD 무드와 정확히 맞음 (tokens.css:145-147) |
| `--font-label` (기술 라벨) | IBM Plex Sans → … → **Gothic A1**(한글) → Noto Sans KR | ✅ 보존 (tokens.css:148-149) |
| `--font-display` | JetBrains Mono + Nanum Gothic Coding | ✅ 보존 (tokens.css:150) |
| (미사용) | **Noto Serif KR 400;500;600;700 — tokens.css:11 @import에서 로드만 되고 어디에도 안 쓰임** | ❌ **제거 대상** — 서재풍 세리프 관성 잔재 + 무의미한 폰트 페이로드 |

- 로딩 구조: 라틴(JetBrains Mono/IBM Plex)은 각 HTML `<head>` link(예: index.html:10), 한글은 tokens.css:11 @import — Serif KR 제거 외에는 유지. Noto Sans KR은 최후 폴백이므로 웨이트 축소(400;700) 여지 있음.
- 폰트 미로드 시 시스템 모노 폴백 확인됨(README.md:237) — 유지.

---

## 구현 우선순위 요약 (구현 에이전트용)

1. **P0** SVG attr var() 64건 → style/currentColor/CSS 클래스 이관 (index 26 · product 22 · 404 15 · onboarding 1) — charts.css의 클래스 방식으로 통일
2. **P0** 인라인 grid-template-columns 4건 반응형 수정 (dashboard 98·163, profile 57, product 32)
3. **P0** segmented control JS 구현 + ARIA 정정 (dashboard 62, product 99, index 333)
4. **P1** 라이트 모드 success/warning 텍스트 대비 AA 확보 (semantic.css:90-93)
5. **P1** Noto Serif KR 임포트 제거 (tokens.css:11)
6. **P1** 대담화: 허브 도면 등록 대장 재구성 + 선 드로잉 리빌 시스템 (제안 1·2)
7. **P2** 레이아웃 치수화·십자선 커서·온보딩 각색 (제안 3·5·6), autofocus 6건 제거, product 썸네일 aria-pressed 보완
