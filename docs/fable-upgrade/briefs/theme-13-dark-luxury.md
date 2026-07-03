# 감사 브리프 — theme-13-dark-luxury (AURUM)

> 감사일: 2026-07-04 · 감사관: 시니어 프로덕트 디자이너 출신 감사관 (읽기 전용 감사)
> 테마 경로: `design-systems/theme-13-dark-luxury/`
> HTML 파일 수: **10** (index.html + pages/ 9개: dashboard·kanban·inbox·product·pricing·settings·onboarding·profile·404)

---

## 1. DNA 요약

**정체성**: 하이엔드 패션·시계 메종의 미니멀 다크 럭셔리. "여백이 곧 럭셔리다" — 딥 차콜 보이드 위에 소프트 웜 화이트 타이포, 그리고 아주 가끔의 골드 헤어라인.

**핵심 값** (tokens.css):
- 배경 `--neutral-900: #0C0C0E` / 표면 `--neutral-880: #141416` / 텍스트 `--neutral-100: #EDEAE3` (tokens.css:22–35)
- 골드 `--gold-500: #BFA06A` (다크 위 ≈7.9:1, tokens.css:45) + 샴페인 `--champagne-500: #CBB994` (tokens.css:59)
- 상태색 전부 저채도: 세이지/브래스/옥스블러드/슬레이트 (tokens.css:66–91)

**명시된 규칙 (스펙으로 못 박힌 것 — 구현 시 절대 위반 금지)**:
- tokens.css:7–8 헤더 주석: *"Space is the luxury. Hairlines, not boxes. Slow, quiet motion."*
- tokens.css:183: **radius는 "near-square. md ≤ 4px (spec)"** — md=3px. 라운드 키우기 금지.
- tokens.css:98: 상위 스페이싱 의도적 확대 — `--space-20: 30rem`은 "cathedral whitespace" (tokens.css:122)
- README.md §1: 골드는 CTA·포커스·키커·구분선 등 "의도된 순간에만", 무채색 90%
- CHECKLIST.md §2: "장식·패턴·요란한 색·과한 모션 배제" ✅로 자가검증됨
- semantic.css:5: **다크가 정본(canonical)**, 라이트는 웜 아이보리 변형
- 모션: `--ease-emphasized: cubic-bezier(0.16,1,0.3,1)` 느린 slow-out (tokens.css:259), reduced-motion 전체 정지 (base.css:281–289)

**중요 판별**: 이 테마의 **세리프 디스플레이(Cormorant Garamond)와 라이트 모드의 웜 아이보리는 '서재 감성 관성'이 아니라 DNA 그 자체**다(하이엔드 메종 = 고대비 세리프 + 아이보리 인쇄물 미학). 제거 대상이 아니라 증폭 대상. 단, "AI가 만든 문서"가 아니라 "메종 캠페인/룩북" 수준으로 끌어올려야 한다.

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 토큰 규율이 거의 교과서급 — 리스킨 가능한 진짜 시스템
- `components/*.css` 10개 파일 전체에 하드코딩 hex **0건** (grep 검증 완료). 원시(tokens) → 시맨틱(semantic.css:15–190) → 컴포넌트 토큰(semantic.css:195–279) 3계층이 실제로 지켜짐.
- 버튼 변형이 `--_bg/--_fg/--_bd` 로컬 커스텀 프로퍼티 패턴으로 구현 (buttons.css:6–9) — 프로덕션 코드 냄새가 난다(좋은 의미).
- **지시**: 이 규율을 깨지 말 것. 대담화 작업도 전부 토큰 경유로.

### ② 시그니처 디테일이 이미 '메종 문법'을 쓰고 있음 — 증폭 1순위
- eyebrow 앞 골드 헤어라인 프리픽스 (base.css:102–105), `a.link` 골드 언더라인이 좌→우로 자라는 호버 (base.css:127–134), `.tick` 골드 다이아 (base.css:198)
- hero의 초대형 로마숫자 "XIII" 워터마크 (index.html:51, 스타일 index.html:516 — opacity 0.03)
- profile.html:517–527 커버의 골드 사선 헤어라인 컴포지션, product.html:398–407의 이미지-제로 플레이스홀더(골드 라인드로잉 + 헤어라인 프레임 + "AURUM" 모노그램) — 이미지 없이 부티크 무드를 만든 발상이 탁월.
- **지시**: 이 어휘(헤어라인이 그어지는 모션, 모노그램 워터마크, 골드 틱)를 전 페이지 시그니처로 승격.

### ③ 카피와 인터랙션 골격이 filler가 아님
- 전 페이지가 "AURUM 메종" 단일 세계관: 캐시미어 코트 PDP, 청담 부티크 재고, VIP 프라이빗 채널, 평생 수선 멤버십 (product.html:220–222, dashboard.html:352–377). 404의 빈 상태 카피도 정중한 메종 톤 (404.html:100, 113).
- app.js: 오버레이 스택 + 포커스 트랩 + lastFocus 복원 (app.js:59–95), 테이블 정렬 시 aria-sort 부여 (app.js:437–440), 골드 focus-visible 전역 링 (base.css:235–240).
- **지시**: 카피 톤은 그대로 유지. 재작성 시 이 수준 이하로 떨어뜨리지 말 것.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 지문 A — 서브페이지 내비게이션의 영문 dev-tool 잔재 【심각】
- pages/* 전체의 navbar 링크가 영문 그대로: `Dashboard / Kanban / Inbox / Pricing / Settings` (dashboard.html:24–28, product.html:24–28, 그 외 pages/ 공통). **index.html의 같은 navbar는 한글**(파운데이션/컴포넌트/화면/문서, index.html:24–27) — 한 시스템 안에서 톤이 갈라져 있음.
- dashboard.html:122 `<h1 class="dash__title">Overview</h1>` — 바로 아래 부제는 한글("2026년 6월 · 메종 전 채널…").
- 404.html:44 eyebrow "Page Not Found", 404.html:87 "Patterns", 404.html:150 "Errors" — 데모 섹션 라벨이 영문 개발용어.
- **처방**: 두 갈래 중 하나로 통일. (a) 전부 한글화, 또는 (b) 럭셔리 브랜드 문법의 **의도된 라틴 카피**로 승격(예: eyebrow는 "MAISON · COLLECTION"처럼 브랜드성 있는 것만 영문 대문자, 기능 네비·페이지 제목은 한글). "Overview", "Patterns" 같은 dev-tool 단어는 어느 쪽이든 제거.

### 지문 B — index.html의 hero+카드그리드 진열대 공식 【심각】
- 구조가 전형적 AI 쇼케이스 공식: hero → 철학 2col → 토큰 → **균질 2열 컴포넌트 카드 그리드**(index.html:228–411, `.gallery` grid-template-columns: repeat(2,1fr) — index.html:530) → **완전 균질 3×3 screen-card 그리드**(index.html:422–432) → 중앙정렬 CTA.
- 모든 섹션 헤더가 기계적으로 동일: `eyebrow--muted "0X — 라벨"` + h2 + lead (index.html:82, 103, 223, 418, 438) — 번호식 목차의 예측 가능한 리듬.
- "여백이 럭셔리"라 선언한 테마가 정작 카드들을 빈틈없이 진열함. 럭셔리 매장은 선반을 꽉 채우지 않는다.
- **처방**: §5 대담화 ②③ 참조.

### 지문 C — hero 스탯바 클리셰 【중간】
- index.html:65–73 `hero__stats`: "컴포넌트 54+ · 데모 화면 9 · 토큰 240+ · 의존성 0" — AI가 만든 디자인시스템 랜딩 특유의 '숫자 자랑 지표 바'. 메종 캠페인 히어로에 SaaS 스탯바가 붙은 격.
- **처방**: 삭제하거나 메종 세계관의 수치로 치환(예: "EST. MMXIII · 헤어라인 1px · 골드 7.9:1" 같은 크래프트 스펙 표기).

### 지문 D — 분위기(atmosphere)의 소심함 【중간】
- `--bg-atmosphere` (semantic.css:86–88)가 gold-900 22% 라디얼 + 뉴트럴 라디얼 각 1개 — 실화면에서 거의 식별 불가. hero 워터마크도 opacity 0.03 (index.html:516). "장식 배제" 규칙을 핑계로 무드 형성 자체를 포기한 상태. 밋밋한 단색 배경은 AI 지문이다.
- **처방**: §5 대담화 ① 참조 (질감·깊이는 3% 이하 오파시티 안에서도 충분히 가능).

### 지문 E — 팔레트 외 색 무단 반입 【경미하나 명백】
- inbox.html:104 `style="background: #9a8bbd"` — **보라색**. 저채도 무채+골드 팔레트에 아무 근거 없는 색. inbox.html:99 `#6f9c8d`도 토큰 우회(세이지 유사색을 직접 하드코딩).
- **처방**: `var(--color-info)`, `var(--color-success)` 또는 champagne/gold 램프로 치환. 보라는 이 테마에 존재해선 안 된다.

---

## 4. 프로덕션 결함

### P1 — SVG `stop-color="var()"` 렌더 버그 【알려진 버그 패턴 · 최우선 수정】
- **dashboard.html:206–207**:
  ```html
  <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.22"/>
  <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/>
  ```
  SVG presentation attribute에서는 var()가 파싱되지 않아 stop-color가 기본값(검정)으로 fallback → 매출 차트의 "골드 에어리어 필"이 실제로는 **검정 그라데이션**으로 렌더됨(다크 배경이라 안 보였을 뿐 골드 필은 죽어 있음).
  **수정**: `style="stop-color: var(--color-primary)"`로 옮기거나 CSS에서 `#goldFill stop { stop-color: var(--color-primary); }` 지정.
- 그 외 stroke/fill HTML 속성의 var() 사용은 전 파일 grep 결과 0건 (아이콘은 전부 CSS/currentColor 경유 — 양호). product.html:549의 `svg.style.fill = 'var(--color-primary)'`는 style 프로퍼티라 정상.

### P2 — :focus-visible 커버리지 갭
- grep 결과: focus-visible이 controls.css(3)·buttons.css(1)·base.css(2)에만 존재. **card.css, badge.css, data.css, disclosure.css, navigation.css, overlay.css, feedback.css, inputs.css = 0건.**
- base.css:235–239 전역 골드 outline이 안전망이지만, `.navbar__link`(밑줄 애니메이션이 hover에만), `.tabs__tab`, `.accordion__trigger`, `.menu__item`, `.screen-card` 등 시그니처 인터랙티브 요소들이 전역 링에만 의존 — 컴포넌트별 의도된 포커스 스타일(예: 골드 헤어라인 언더라인을 focus-visible에도 동일 적용)이 없음.
- **수정**: 최소한 navbar__link/tabs__tab/accordion__trigger/menu__item에 `:focus-visible`을 hover와 동급으로 추가.

### P3 — README.md로 향하는 제품 내 링크 (file:// 에서 깨진 경험)
- index.html:27 navbar "문서", index.html:442 CTA "문서 읽기", index.html:506 cmdk "문서 열기" → `href="README.md"`. 더블클릭(file://) 실행이 스펙(README.md:8)인데 .md는 브라우저에서 raw 텍스트/다운로드로 열림 — 사실상 깨진 링크.
- **수정**: 링크 제거 또는 문서 소개 섹션/모달로 대체.

### P4 — product.html 썸네일↔캐러셀 동기화의 느슨한 계약
- product.html:530–541: 캐러셀 **click 이벤트만** 청취해 dots의 is-active를 역추적. app.js 캐러셀은 키보드 조작을 지원하므로(CHECKLIST §5) 방향키 조작 시 썸네일 활성 상태가 어긋남. `.carousel__dots > *`의 클래스 규약 의존도 취약.
- **수정**: app.js 캐러셀이 커스텀 이벤트(예: `carouselchange`)를 dispatch하고 페이지는 그것만 구독.

### P5 — 유효하지 않은 stray 속성
- index.html:44 `<div class="nav-mobile" data-nav-menu hidden-mobile-note>` — `hidden-mobile-note`는 표준도 data-도 아닌 개발 흔적 속성. 제거.

### P6 — 페이지 로컬 하드코딩 색 (토큰 우회)
- inbox.html:99, 104 (§3-E와 동일 건).
- product.html:400–403, 488: 플레이스홀더 radial-gradient의 `#2a2a2d #18181a #0f0f10` 등 — 뉴트럴 램프 근사값의 수동 하드코딩. 라이트 모드 전환 시 이 영역만 다크로 남는 부작용도 있음(의도라면 주석 필요). `color-mix(in srgb, var(--neutral-800) …)` 계열로 토큰화 권장.
- 색상 스와치 `--chip: linear-gradient(135deg,#b9ac93,#7c715c)` 등(product.html:167–182)은 상품 고유색이므로 허용 범위 — 단 주석으로 의도 명시 권장.

### P7 — 웹폰트 로드 과다 (성능)
- tokens.css:14에서 한글 4패밀리(Nanum Myeongjo·Gothic A1·Noto Sans KR·Noto Serif KR) + base.css:9에서 라틴 3패밀리 = 총 7패밀리. 폴백 체인상(tokens.css:130–135) **Noto Serif KR·Noto Sans KR은 Nanum Myeongjo·Gothic A1보다 뒤라 사실상 도달 불가 = 죽은 로드**.
- **수정**: @import에서 Noto 2종 제거(스택의 문자열 폴백으로만 유지) — 체감 로딩 크게 개선.

### P8 — 기타
- 정렬 테이블: app.js:437–440이 aria-sort를 부여하나 **초기 마크업에는 없음** + th가 button이 아니라서 키보드로 정렬 불가(th 클릭 핸들러만) — th 내부에 button 래핑 또는 tabindex+keydown 필요 (index.html:392, dashboard.html:306–310).
- product.html:191 "사이즈 가이드" `href="#"` — 데드 링크. 모달 연결 권장(§5-⑤).
- 대비 검증 필요 지점: `--color-text-subtle`(=neutral-500 #6E6A61)이 #0C0C0E 위 약 4.0:1 추정 — 12px 이하 라벨(`.spec__tag` 0.625rem 등)에 subtle 사용처는 muted로 승격 검토.

---

## 5. 대담화 기회 — 프로 디자이너라면 밀어붙일 것

### ① 배경에 '메종의 공기'를 넣기 (분위기 증폭)
- `--bg-atmosphere`(semantic.css:86–88)를 3층으로: (1) 현행 골드 풀 라디얼을 30~35%로 증폭, (2) **초저오파시티 노이즈 그레인**(SVG feTurbulence data-URI, opacity 0.02–0.03 — 필름 그레인 질감), (3) 하단 비네트. "장식·패턴 배제" 규칙과 충돌하지 않는 '질감'의 영역.
- 섹션 경계는 현행 1px 보더 유지하되, 표면 위 `--shadow-inset-hair`(tokens.css:213 — 이미 정의돼 있으나 활용도 낮음)를 카드·모달 전반에 적용해 다크 위 면의 깊이를 만들 것.

### ② index.html 히어로를 '캠페인 오프닝'으로 재구성
- 현행: 좌정렬 텍스트 + 우측 흐릿한 XIII (index.html:50–76). 제안: **display-hero를 뷰포트 폭 전체에 오프그리드로 확대**(글자가 컨테이너를 살짝 벗어나는 크롭), XIII 워터마크는 opacity 0.03 → 골드 헤어라인 아웃라인 텍스트(-webkit-text-stroke: 1px var(--color-border-gold), fill transparent)로 바꿔 '음각' 느낌.
- 시그니처 인트로 모션: 이미 있는 `reveal-line`(base.css:268)을 확장 — **페이지 로드 시 세로 골드 룰이 위→아래로 그어진 뒤 텍스트가 rise**하는 2박자 시퀀스. 이것을 전 페이지 공통 오프닝 시그니처로.
- hero 스탯바(§3-C)는 크래프트 스펙 표기로 치환.

### ③ 컴포넌트 갤러리를 진열대 → 룩북으로
- 균질 2열 그리드(index.html:530)를 **12컬럼 위 비대칭 배치**로: 버튼/테이블 같은 큰 스펙은 7~8컬럼, 뱃지/컨트롤은 4~5컬럼, 서로 베이스라인을 어긋나게. 섹션 넘버(01–04)를 현행 eyebrow에서 **Cormorant 라이트 초대형 워터마크 숫자**로 승격해 각 섹션의 '챕터 표지'화.
- 갤러리 중간에 product.html의 에디토리얼 밴드(editorial, product.html:274–310) 같은 **풀블리드 브레이크 섹션** 1개 삽입 — "한 마리 양에서 단 200그램의 결" 수준의 카피로 시스템 철학을 서술. 진열의 단조로움을 끊는 호흡.

### ④ 시그니처 마이크로인터랙션 — "헤어라인이 그어진다"
- 현재 `.btn--primary:hover`는 밝기+글로우만 (buttons.css:34). 제안: **secondary/ghost 버튼 호버 시 하단 골드 헤어라인이 좌→우 스윕**(a.link와 동일 문법 — base.css:129–134 재사용), 카드 호버 시 **네 모서리에 골드 코너 틱**(luxury corner marks)이 페이드인 (::before/::after + border 조합).
- dashboard KPI 숫자(stat-card__value)를 뷰포트 진입 시 카운트업 — 단 `--ease-emphasized`의 느린 감속으로, reduced-motion 시 즉시 표시.

### ⑤ product.html PDP를 하이엔드 이커머스 문법으로
- 갤러리 컬럼을 `position: sticky` 풀하이트로, 정보 컬럼만 스크롤(더 로우/셀린느 문법). 현행 grid(product.html:395)에서 한 줄 수정으로 가능.
- pdp__price(product.html:426 — 이미 display serif 대형)는 좋음. **"사이즈 가이드"를 실측표 모달로 연결**(P8 데드 링크 해소 겸).
- 품절 사이즈(size--out)에 재입고 알림 마이크로 인터랙션(토스트 연동) 추가.

### ⑥ dashboard를 '시계 메종 다이얼' 감성으로
- P1 수정(골드 필 부활)과 함께: 차트 위 **현재값 마커에 미세 골드 글로우 펄스**(reduced-motion 제외), KPI 카드 4개 중 첫 카드(stat-card--accent)만 골드 헤어라인 프레임 + 나머지는 뉴트럴 — 위계로 시선 유도. h1 "Overview" → 한글 or 메종 카피로(§3-A).

### ⑦ pricing 3플랜 그리드 파괴 (소폭)
- 가운데(추천) 플랜을 `transform: translateY(-var(--space-4))` + 골드 헤어라인 프레임 + 상단 골드 룰로 살짝 띄워 균질 3열의 단조로움을 깰 것. 럭셔리 문법 안에서 허용되는 최소한의 그리드 파괴.

---

## 6. 한글 폰트 페어링 (현행 기록)

| 역할 | 라틴 | 한글 폴백 (실제 적용) | 로드 위치 |
|---|---|---|---|
| 디스플레이/헤딩 | Cormorant Garamond (300–600, italic) | **Nanum Myeongjo** (400/700/800) → Noto Serif KR | base.css:9 / tokens.css:14 |
| 본문 | Archivo (300–700) | **Gothic A1** (400/500/700) → Noto Sans KR | base.css:9 / tokens.css:14 |
| 모노 | IBM Plex Mono (400/500) | Noto Sans KR | base.css:9 |

**판정: 보존.** 명조(Nanum Myeongjo) × 고딕(Gothic A1) 페어링은 "고대비 세리프 디스플레이 + 차분한 산세리프 본문"이라는 DNA에 정확히 부합 — 서재풍 억지 세리프가 아니라 메종 미학의 정당한 세리프다.

**보완 지시 2건**:
1. **웨이트 불일치**: 라틴 히어로는 Cormorant **Light 300**(base.css:85 `--weight-light`)인데 Nanum Myeongjo 최저 웨이트는 400 — 한글 대형 디스플레이("고요한 럭셔리," index.html:55)가 라틴 대비 무겁게 보임. 대형 한글 디스플레이에 한해 `font-weight: 400` 고정 + `letter-spacing` 미세 확대(-0.03em → -0.01em)로 시각 무게 보정하거나, 더 가는 명조 계열(예: MaruBuri Light, Gowun Batang) 페어링 검토 가능.
2. **죽은 로드 정리** (P7): @import에서 Noto Serif KR·Noto Sans KR 제거(스택 폴백 문자열은 유지).

---

## 구현 우선순위 요약 (구현 에이전트용)

| 순위 | 작업 | 근거 |
|---|---|---|
| 1 | dashboard.html:206–207 stop-color var() 버그 수정 | P1 — 렌더 결함 |
| 2 | pages/* 영문 네비/제목 톤 통일 (한글화 or 의도된 라틴 승격) | 지문 A |
| 3 | inbox.html:99,104 팔레트 외 색 제거 | 지문 E / P6 |
| 4 | README.md 링크 3곳·href="#"·stray 속성 정리 | P3, P5, P8 |
| 5 | focus-visible 컴포넌트 커버리지 보강 | P2 |
| 6 | 배경 분위기 증폭 + 히어로 캠페인화 + 갤러리 룩북화 | 지문 B·C·D / §5 ①②③ |
| 7 | 시그니처 마이크로인터랙션(헤어라인 스윕·코너 틱) | §5 ④ |
| 8 | 폰트 로드 정리 + 한글 디스플레이 웨이트 보정 | P7 / §6 |

**절대 보존**: 토큰 3계층 규율 · radius ≤4px · 골드 절제 원칙(무채 90%) · 세리프×명조 페어링 · 느린 emphasized 모션 · 메종 세계관 카피 · reduced-motion/포커스트랩 접근성 골격.
