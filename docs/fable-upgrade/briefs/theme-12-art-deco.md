# 감사 브리프 — theme-12-art-deco "Maison Déco"

> 감사일: 2026-07-04 · 감사관: 시니어 프로덕트 디자이너 관점 전수 검사
> 테마 경로: `design-systems/theme-12-art-deco/` · HTML 10개 (index + pages 9)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 전부 명시했다.

---

## 1. DNA 요약

**정체성 한 문장**: 1920~30년대 개츠비/크라이슬러 빌딩의 글래머 — 블랙·딥네이비 위 메탈릭 골드 헤어라인, 에메랄드 보조, 크림 텍스트, 기하학 장식(선버스트·지구라트·셰브론·플루팅)이 "장식이 곧 구조"인 다크 정본 디자인 시스템.

### 명시된 규칙 (README.md / tokens.css 주석)
- **흑금이 정본**: 다크 기본. 블랙 `#0E0E10`·딥네이비 위에 골드 `#C9A24B`가 라인·테두리·강조 (README.md:16, tokens.css:8-9)
- **거의 직각**: 모서리 `2~4px` 또는 계단형 `--corner-step`. 둥근 디자인 지양 (README.md:20, tokens.css:243-248 "Art Deco = 거의 직각")
- **대칭 중심 정렬**: 히어로·헤더·모달은 중앙 정렬 + 골드 더블 헤어라인 마감 (README.md:21, base.css:333 "LAYOUT 유틸 — 대칭 중심 정렬 우선")
- **골드 위 흰색 금지**: 골드/에메랄드 면 위 텍스트는 항상 진한 fg 토큰(`--color-on-gold`, `--color-primary-fg`) — 4.5:1 확보 (README.md:204-205, semantic.css:34)
- **컴포넌트는 시맨틱 토큰만**: 원시 토큰 직접 참조 금지 (tokens.css:5-6, semantic.css:6)
- **장식은 전부 aria-hidden**: 의미는 텍스트로 전달 (README.md:206, base.css:177)
- **모션**: `--ease-emphasized` 페이드/라이즈, "화려하되 차분하게" + reduced-motion 전면 무력화 (README.md:22, tokens.css:329-337, base.css:414-427)

### 핵심 자산 (이 테마의 무기고)
- 장식 토큰 라이브러리: `--metal-gold`(7-스톱 메탈릭, tokens.css:92-100), `--ornament-sunburst/-full`(conic, 115-127), `--ornament-chevron`(130-137), `--ornament-ziggurat`(140-143), `--fluting/-tight`(146-158), `--corner-step`(clip-path 폴리곤, 161-164), `--grain`(data-URI SVG 노이즈, 167), `--gold-double`(110-112)
- 장식 유틸 클래스: `.deco-sunburst` `.deco-rays` `.deco-rule` `.deco-divider`(다이아 로젠지) `.deco-frame-double` `.deco-stepframe`(그라데이션 보더+스텝 클립) `.deco-corners` `.deco-chevron-rule` (base.css:181-330)
- 타이포: Cinzel(디스플레이 캡스) + Cormorant Garamond(본문 세리프) + Poiret One(UI 산세리프) + `--tracking-caps: 0.34em` (tokens.css:196-233)
- **주의**: 이 테마는 세리프·크림이 DNA 자체다. 세리프/크림 사용은 AI 지문이 아님. 지문 판별은 "무기력한 실행"과 "월드빌딩 붕괴" 쪽에서 찾아야 한다.

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 손으로 그린 인라인 SVG 상품 일러스트 (product.html:117-267)
시계 다이얼 4종(옵시디언 선버스트 정면 / 에메랄드 변형 / 케이스 측면 크라운·푸셔 / 케이스백 코트-드-제네브 무브먼트+루비 베어링)을 전부 순수 SVG로 직접 작도. 16갈래 선버스트 기요셰, 지구라트 러그, 로터까지 묘사 수준이 진짜 워치 브랜드 PDP급. 썸네일(279-290)까지 미니어처로 다시 그렸다. **이건 이 프로젝트 전체에서도 드문 자산 — 절대 건드리지 말고, 오히려 다른 페이지(온보딩·프로필 커버)로 이 일러스트 어법을 확산할 것.**

### ② 장식 토큰의 시스템화 (tokens.css:87-167 + base.css:176-330 + display.css:44-57)
선버스트/셰브론/지구라트/플루팅/스텝코너가 전부 재사용 가능한 CSS 커스텀 프로퍼티 + 유틸 클래스로 정리되어 있고, `card--ornate`는 gradient-border(mask-composite) + `clip-path: var(--corner-step)`를 결합한 고급 기법(display.css:49-57). StatCard 우상단 선버스트 마스크(display.css:70-76), 모달 헤더 선버스트(feedback.css:103-110)처럼 컴포넌트에 실제로 배선까지 됨. README §5.4에 "장식 강도 조절" 손잡이까지 문서화. **증폭 작업 시 새 장식을 추가하지 말고 이 토큰들을 더 크게·더 자주·더 대담하게 쓰는 방향이 정답.**

### ③ 개츠비 월드빌딩의 데이터 일관성
대시보드 예약자 명단이 Daisy Buchanan / Jordan Baker / Nick Carraway / Meyer Wolfsheim / Owl Eyes(dashboard.html:303-309), 알림이 "Krug Grande Cuvée 잔여 6병"(dashboard.html:417), 모달이 "웨스트 에그, 토요일 저녁 8시 갈라 디너"(index.html:476), 404 카피가 "엘리베이터가 없는 층에 내리셨습니다"(404.html:88-89), 푸터 저작권이 "© 1925–2026"(index.html:461). filler가 아니라 세계관이 있는 실데이터 — **이 톤을 기준선으로 삼고, 아래 3-③의 세계관 붕괴 지점(pricing)을 이 수준으로 끌어올릴 것.**

---

## 3. AI 지문 — DNA와 무관하게 배어든 'AI가 만든 티'

### ① 세계관 붕괴: 살롱 멤버십을 팔면서 SaaS 스펙을 나열 (심각도 상)
- pricing.html:81-84 히어로는 "당신의 무대를 선택하세요 · 실버~플래티넘 멤버십"인데, 피처 리스트가 **"프로젝트 5개 / 저장 공간 10GB / 이메일 지원"**(pricing.html:119-125), **"프로젝트 무제한 / 저장 공간 250GB / 팀 좌석 10석 / 커스텀 브랜딩"**(144-150). 1925년 메종 세계관에 클라우드 스토리지가 등장하는 순간 AI 보일러플레이트임이 폭로된다.
- 수정 방향: 갈라 디너 우선 예약 / 프라이빗 살롱 라운지 / 소믈리에 페어링 / 컨시어지 좌석 / 시즌 컬렉션 프리뷰 등 **메종 어휘로 전면 재작성**. 온보딩(onboarding.html "멤버십 온보딩")도 같은 기준으로 점검.

### ② 범용 대시보드 영어 라벨 (심각도 중)
- dashboard.html:144 `<p class="eyebrow">Overview</p>` — 세계관 영어("Lost in the Gilded Age", "Haute Horlogerie", "The Story")는 무드지만 "Overview"는 그냥 AI 대시보드 기본값.
- profile.html:369 badge "Recent", :424 badge "Timeline" — 카드 제목이 이미 "최근 항목/최근 활동"인데 영어 라벨을 중복으로 박음. 전형적 AI 장식성 영문.
- pricing.html:132 `MOST POPULAR` — 바로 아래 134행에 "가장 인기"가 또 있음(이중 표기). 유지하려면 하나로: 세계관에 맞는 `LA PLUS AIMÉE`나 "금세기의 선택" 같은 카피로 승격 권장.
- 404.html:114 "Empty States" eyebrow — 디자인시스템 내부 용어가 데모 화면에 노출. "빈 무대" 등 세계관 언어로.

### ③ index 히어로의 'AI 쇼케이스 공식' (심각도 중)
- index.html:86-89 — "68 컴포넌트 / 9 데모 화면 / AA 대비 준수 / 0 프레임워크" 4-스탯 스트립. hero + 숫자 자랑 스트립 + 카드 그리드는 AI 허브 페이지의 시그니처 공식. 숫자를 없애라는 게 아니라 **극장 개관 안내판·마퀴(marquee) 어법**으로 재연출할 것 (예: "SINCE 1925 · 68 PIECES · EST. WEST EGG").
- 같은 맥락: `eyebrow → fs-4xl 헤딩 → deco-chevron-rule 160px` 중앙 섹션 헤더 스탬프가 6회 이상 복붙됨 (index.html:97-101, 185-189, 218-221, 434-437, product.html:569-572, 404.html:113-117). 대칭 자체는 DNA지만 **매번 동일 크기·동일 장식**인 것이 템플릿 지문 — 섹션 위계에 따라 chevron-rule/deco-divider/deco-rule을 교차시키고 스케일을 차등화할 것.

### ④ dev-tool 유령 UI (심각도 하)
- index.html:463 푸터의 GitHub 아이콘 `<button>` — 1925 메종 세계관에 GitHub 버튼, 게다가 링크도 아닌 동작 없는 button. 제거하거나 세계관 아이콘(전보/축음기)으로 대체.

### ⑤ 균질 간격·타이밍 리듬 (심각도 하)
- base.css:407-412 `.animate-in .d1~.d6`이 정확히 80ms 등차 스태거 — 모든 페이지 히어로가 같은 박자로 등장. 지문까지는 아니나 시그니처 모션(§5-②)으로 교체하면 좋을 지점.
- 카드가 전부 동일한 1px 골드 헤어라인 + 동일 `--space-6` 패딩 → 위계 없는 균질함. §5-④ 참조.

**지문이 아닌 것 (오판 금지)**: 크림 텍스트(#F3ECDD)·세리프 본문(Cormorant/명조)·중앙 대칭 히어로는 전부 README에 명시된 DNA다. 이를 "서재풍"으로 오인해 제거하면 안 된다.

---

## 4. 프로덕션 결함 (파일:라인)

### ① [치명] SVG presentation attribute에 var() 직접 사용 — 렌더 깨짐 알려진 버그
CSS 커스텀 프로퍼티는 SVG의 HTML 속성(stroke=/fill=/stop-color=/font-family=)에서 해석되지 않는다 → 검정 fill/기본 stroke로 떨어짐. `style=""` 속성이나 `currentColor`로 이관 필수.
- **dashboard.html:211-212** `<stop stop-color="var(--color-primary)" …>` (goldArea 그라데이션 — 면적 차트 채움이 통째로 죽음)
- **dashboard.html:217-220** 격자선 `stroke="var(--chart-grid)"` ×4
- **dashboard.html:221-224** 축 라벨 `font-family="var(--font-mono)" fill="var(--color-text-subtle)"` ×4 (fill이 검정으로 → 다크 배경에서 안 보임)
- **dashboard.html:228** 2025 비교선 `stroke="var(--color-text-subtle)"`
- **dashboard.html:234** 2026 메인 라인 `stroke="var(--color-primary)"`
- **dashboard.html:236** 데이터 포인트 `<g fill="var(--color-primary)">`
- **profile.html:392, 397, 402, 407** 갤러리 썸네일 4개 — `fill="var(--color-bg-elevated)"`, `stroke="var(--color-primary)"`, `stroke="var(--emerald-400)"`
- 참고: product.html의 다이얼 SVG는 하드코딩 hex라 안전(상품 사진 성격이므로 그대로 두는 게 맞음).

### ② [상] 라이트 테마 골드 텍스트 AA 미달
- semantic.css:149 라이트의 `--color-primary: var(--gold-600)`(#9A742D) — 크림 배경(#F3ECDD) 대비 **약 3.6:1로 AA(4.5:1) 미달**. 이 토큰이 텍스트로 쓰이는 곳 전부 걸림: `a` 링크(base.css:58), `.eyebrow`(base.css:99-106, 12px 소형 텍스트라 더 치명), `.g-val`(dashboard.html:49), `.pc-num`(index.html:32) 등.
- 수정: 라이트에서 **텍스트 용도**의 골드만 `--gold-700`(#7A5B24, 약 6:1)으로 분리 (`--color-primary-text` 신설 권장). 보더/장식은 현행 유지 가능. README:204의 "4.5:1 확보" 선언과 어긋나는 상태.

### ③ [상] segmented 컨트롤의 ARIA 오용 — 전 페이지 8곳+
`.segmented`가 `role="tablist"` + 자식 `<button aria-selected>`인데 자식에 `role="tab"`이 없음 → `aria-selected`는 plain button에서 무효(스크린리더에 상태 전달 실패). 게다가 탭이 아니라 뷰/옵션 선택기라 tablist 자체가 오용.
- index.html:294-296(뷰), dashboard.html:149-154(기간), pricing.html:89-92, product.html:333-337 · 346-349 · 358-362(옵션 3종), kanban.html(뷰 전환, "보드/리스트")
- pricing.html:90-91은 한 버튼에 `aria-selected` + `aria-pressed`를 **동시에** 달았고, app.js:319-320이 둘 다 토글함 — 의미 충돌.
- 수정: `role="radiogroup"` + `role="radio" aria-checked` 또는 role 없는 group + `aria-pressed` 단일화. app.js:314-325 initSegmented도 함께 수정.

### ④ [중] 키보드 접근성 구멍
- **테이블 정렬**: `th.is-sortable`가 click 바인딩만 있고(app.js:400-420) tabindex/keydown 없음 → 키보드로 정렬 불가 (index.html:411-414, dashboard.html:296-300). th 내부를 `<button>`으로 감싸는 게 정석.
- **pagination**: `href="#"` 더미 링크 21곳 (index.html:423, dashboard.html:312 등) — 클릭 시 페이지 최상단 점프. 데모라도 `role="button"` + preventDefault 또는 `<button>`화 필요.
- **progress 바**: `role="progressbar"/aria-valuenow` 전무 — dashboard.html:271-280(목표 달성), 361-393(인기 메뉴), product.html:489-493(리뷰 분포), profile.html:331-342(스킬). 인접 %텍스트가 없는 인기 메뉴 쪽이 특히 문제.
- **kanban 카드**: `aria-grabbed`(kanban.html:192 등)는 deprecated ARIA. `aria-describedby`+라이브 리전 안내로 대체 권장 (키보드 이동 자체는 app.js에 구현되어 있음 — 좋음).
- `<span class="avatar" aria-label="…">`(kanban.html:123 등) — role 없는 span의 aria-label은 무시됨. `role="img"` 부여.

### ⑤ [중] 반쪽 별점 표기 불일치
- product.html:303-309 4.5점 레이팅은 `halfStar` 그라데이션으로 반별을 그렸는데, 같은 페이지 477-483의 4.5점은 빈 별 5개째(482) — 시각 4.0으로 보임. aria-label(4.5)과 시각 불일치.

### ⑥ [하] 기타
- index.html:56 `.searchbar`를 `<button>`으로 쓰며 inline `onclick="window.__cmdkOpen…"` + inline style — data-속성 어법(README §4)과 불일치. `data-cmdk-trigger`는 이미 붙어 있으니 app.js에서 위임 바인딩으로 통일.
- tokens.css:12 `@import` 폰트(한글 5패밀리) — @import는 렌더 블로킹. 각 HTML `<head>`의 `<link>`로 이동 권장 (라틴 폰트는 이미 link 방식, dashboard.html:10).
- base.css:23 `overflow-x: hidden`(body) — 가로 스크롤 버그를 가리는 안전핀. 대담화 작업(오버랩/브리드아웃) 시 실제 overflow 원인 점검 후 유지 여부 결정.
- pricing.html:25 `.plan--featured { transform: scale(1.03) }` — 서브픽셀 블러 위험. 골드 티켓 재설계(§5-⑤) 시 자연 해소.
- 라이트 테마에서 product 다이얼 SVG(하드코딩 다크 hex)는 다크 그대로 남음 — 상품 사진 성격이므로 결함 아님(명시적으로 의도 처리: `.dial-stage` 배경만 라이트 보정 확인).

### 상태 커버리지 평가 (양호)
hover/active/disabled/loading(buttons.css:34-119), input invalid(forms.css:19-22), empty state 5종(404.html:120-192), 포커스 링 전역(base.css:130-135) + slider thumb 개별(forms.css:235-236), reduced-motion 전면 대응(base.css:414-427) — 상태 설계는 프로덕션급. 위 ①~⑤만 메우면 된다.

---

## 5. 대담화 기회 — 프로 디자이너라면 밀어붙일 지점

### ① 히어로를 "극장 파사드"로 (index.html:70-92, base.css:181-197)
현재 `.deco-sunburst`는 opacity 0.7 배경 얼룩 수준. 개츠비 포스터처럼: 선버스트를 **뷰포트 전체 높이 방사형**으로 키우고(`--ornament-sunburst-full`, 마스크 반경 확대), 타이틀 상하로 `--gold-double` 더블 헤어라인 아치 + 좌우 대칭 지구라트 타워(404.html:66-71의 SVG 장식을 재사용 — 이미 자산이 있다!) 배치. 하단은 크라이슬러 크라운처럼 `--corner-step`을 변형한 계단형 섹션 경계(clip-path)로 다음 섹션과 접합. 대칭 DNA를 유지한 채 스케일만 3배로.

### ② 시그니처 모션: "금박 스윕(Gilded Sweep)"
- `.text-gold`(base.css:85-91)에 `background-size: 200%` + 진입 시 1회 background-position 스윕 → 금박이 빛을 훑는 shimmer. reduced-motion 예외 필수.
- `.btn--primary:hover`(buttons.css:50)에 현재 brightness 필터뿐 — 대각선 하이라이트 스윕(::before gradient 이동) 추가.
- 모달 오픈 시 `.modal-head::before`(feedback.css:103-110) 선버스트가 `conic-gradient` 각도 회전으로 펼쳐지는 reveal — "막이 오르는" 감각.
- `.deco-divider .lozenge`(base.css:258-264) 다이아가 스크롤 진입 시 45° 회전+글로우 점화 — data-reveal 훅(app.js:562-570)에 이미 배선 포인트가 있음.

### ③ 배경 분위기 증폭 (base.css:27-52)
현재 body::before 라디얼 3개는 알파 0.06~0.07로 사실상 안 보임. 다크: 상단에서 내려오는 **초대형(120vw) 초저알파 선버스트를 fixed로 상시 배치** + 네이비→블랙 수직 그라데이션으로 "밤의 연회장" 깊이. 그레인(body::after)은 0.5 유지하되 라이트에서도 0.4로. 섹션 배경 교차(`--color-bg` ↔ `--color-bg-elevated` + `.deco-fluting`, index.html:183·432에 이미 사용)를 pages/에도 확산.

### ④ 프레임 위계 시스템 — "균질 헤어라인" 탈출
카드 전부가 1px 골드 보더로 평등한 게 현재 가장 밋밋한 부분. 3등급 명문화: **일반 카드 = 단일 헤어라인 → 주요 카드 = `.deco-frame-double`(base.css:272-281) → 히어로 카드 = `.deco-stepframe`/`card--ornate`(스텝코너+그라데이션 보더+글로우)**. 대시보드에선 총매출 StatCard 1장만 ornate로 승격하고 `stat-value`를 `--text-4xl`→`--text-6xl` + `.text-gold` 클립 — 숫자 하나가 페이지의 "한 방"이 되게.

### ⑤ 가격표 Gold 플랜 = "금박 티켓" (pricing.html:131-152)
scale(1.03) 대신: Gold 카드 전체를 `--metal-gold` 배경 + `--color-on-gold` 블랙 텍스트로 **반전**(시스템에 이미 골드 위 대비 토큰이 준비되어 있음, semantic.css:66) + 상하 티켓 퍼포레이션(radial-gradient 점선 절취선) + 플래그를 마퀴 리본으로. "ADMIT ONE" 어법의 입장권 메타포 — 세계관 카피 재작성(§3-①)과 한 세트로.

### ⑥ 대시보드 차트의 데코화 (dashboard.html:207-244)
§4-① var() 버그 수정과 동시에: 데이터 포인트를 원 대신 **다이아몬드(rotate 45 rect)** 마커로, 면적 채움 위에 `--fluting` 세로 홈 패턴 오버레이, 마지막 포인트에 골드 글로우 + 값 라벨. 흔한 area chart가 "메종의 장부"가 된다.

### ⑦ 404를 엘리베이터 다이얼로 (404.html:60-103)
이미 카피가 "엘리베이터가 없는 층" — 시각도 따라가게: 반원 플로어 인디케이터(아르데코 엘리베이터의 부채꼴 바늘 게이지)를 `--ornament-sunburst`로 그리고 바늘이 4→0→4를 오가는 미세 애니메이션. err-num에 아웃라인 고스트 레이어(-webkit-text-stroke 골드 1px)를 뒤에 겹쳐 이중 깊이.

---

## 6. 한글 폰트 페어링 (현재 기록 + 판정)

### 현재 상태 (tokens.css:12 로드, :196-203 매핑)
| 슬롯 | 라틴 | 한글 폴백 | 로드 웨이트 |
|---|---|---|---|
| `--font-display` | Cinzel → Copperplate/Bodoni/Didot | **Gowun Batang** → Noto Serif KR | 400/700 |
| `--font-serif` | Cormorant Garamond → Didot/Georgia | **Nanum Myeongjo** → Noto Serif KR | 400/700/**800** |
| `--font-sans` | Poiret One → Century Gothic/Futura | **Gothic A1** → Noto Sans KR | 400/500/700 |
| `--font-mono` | DM Mono → SF Mono | Noto Sans KR | — |

### 판정
- **본문 Cormorant × Nanum Myeongjo**: DNA(세리프 본문)에 정합 — **보존**.
- **UI Poiret One × Gothic A1**: 기하학 산세리프끼리의 페어링, 캡스 라벨 무드 유지 — **보존**.
- **디스플레이 Cinzel × Gowun Batang은 약한 고리**: 한글 h1이 실제로 매우 많은데("살롱 대시보드" dashboard.html:145, "당신의 무대를 선택하세요" pricing.html:81, "제작 보드", "환경 설정" 등) Cinzel에 한글 글리프가 없어 전부 Gowun Batang 400/700으로 렌더됨. 고운바탕은 부드러운 '서정 서적' 인상이라 개츠비 캡스의 조각적 위엄(`--tracking-caps 0.34em`)을 못 받친다 — 서재풍 관성이 디스플레이 슬롯에 스민 사례. **교체 후보**: 이미 로드 중인 **Nanum Myeongjo 800(ExtraBold)** 을 display 폴백 1순위로 승격(추가 로드 0, 획 대비가 Didot 계열과 동조) — `--font-display`의 한글 폴백을 `"Nanum Myeongjo"`(weight 800 사용) → Noto Serif KR 700 순으로. 대안으로 무료 디스플레이 명조(예: 조선100년체 계열 등 고대비 명조)를 검토하되 라이선스 확인 필요. 최소 개입은 `.display`류에 한글일 때 `font-weight: 800` 보정.
- 한글 디스플레이의 0.34em 자간은 라틴 uppercase 기준 설계 — 한글에는 0.2em 안팎으로 별도 보정값을 두는 것을 권장(현재는 동일 적용).
- `--font-mono` 폴백의 Noto Sans KR은 mono 아님 — 실害 없으나 정합성 차원에서 메모.

---

## 부록: 구현 우선순위 제안
1. §4-① SVG var() 버그 (dashboard/profile — 차트·썸네일이 실제로 깨져 보이는 유일한 항목)
2. §4-②③ 라이트 골드 대비 + segmented ARIA
3. §3-① pricing 세계관 카피 재작성 (+ §5-⑤ 골드 티켓)
4. §5-①②③④ 히어로/모션/배경/프레임 위계 증폭
5. §6 디스플레이 한글 폴백 승격 (Nanum Myeongjo 800)
6. §4-④⑤⑥ 잔여 a11y·정리
