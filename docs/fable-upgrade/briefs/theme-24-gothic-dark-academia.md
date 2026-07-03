# 감사 브리프 — theme-24-gothic-dark-academia (Folio · XXIV)

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-24-gothic-dark-academia/`
- 파일 구성: tokens.css / semantic.css / base.css / components 5종(buttons·forms·display·feedback·navigation) / app.js / index.html + pages 10장 (HTML 총 11개). **styles.css는 이 테마에 존재하지 않음** (base.css가 그 역할).
- ⚠️ 예외 규칙 적용 테마: **인쇄·서적 미학이 곧 DNA**. 크림/양피지 톤, 세리프, 드롭캡, 골드 괘선, 얌전한 문서 감성 자체는 지문이 아니라 정체성이다. 목표는 "AI가 만든 문서" → "프로 스튜디오가 장정한 인쇄물"로의 격상.

---

## 1. DNA 요약

**정체성**: 촛불이 켜진 옥스퍼드 서재·가죽 장정 폴리오. 다크(잉크 `#141210` / 차콜 `#211d19`)가 캐노니컬이고, 라이트 테마는 "같은 폴리오를 낡은 양피지에 인쇄한 판본"(semantic.css:91-155). 옥스블러드 버건디 `#5C1A1B`(주조) · 헌터 그린 `#22372B`(성공) · 에이지드 골드 `#A6843C`(유일 강조) · 차콜↔양피지 웜 뉴트럴(tokens.css:17-76).

**명시된 규칙(주석·README에 성문화됨 — 구현 시 반드시 준수)**:
- 블랙레터(UnifrakturCook)는 **"LARGE DECORATIVE ONLY. Never body copy."** — base.css:165, tokens.css:92-93, README §1·§8
- radius 상한 4px: `--radius-md: 4px; /* cap — nothing bigger by convention */`, pill은 아바타·왁스씰 전용 — tokens.css:157-160
- 모든 장식은 `aria-hidden`, 의미는 항상 텍스트로 — README §8
- "Illuminated, not decorated" / "Never bright, neon, minimal-startup or casual" — README §1
- 모션은 느린 촛불 페이드(`--duration-slow` 480ms 등), 포커스는 골드 링(`--ring-gold`) — tokens.css:193-208
- 장식 토큰(`--fleur`, `--flourish`, `--rule-ornate`, `--corner-ornament`, 양피지 텍스처)이 "the soul of the theme"로 토큰 레이어에 공식 편입 — tokens.css:237-273

**구조**: tokens(원시) → semantic(의미·다크/라이트) → component 토큰(semantic.css:160-223) 3계층이 일관됨. 재스킨 가이드(README §7)까지 갖춘 모범적 아키텍처.

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 장식이 '토큰'이다 — 오너먼트 시스템 (tokens.css:237-273, base.css:146-302)
`--fleur`/`--flourish`/`--rule-ornate`/`--corner-ornament`가 전부 인라인 SVG data-URI 토큰이고, `hr`은 자동으로 장식 괘선이 되며(base.css:146-155), `.has-dropcap::first-letter` 드롭캡(base.css:207-229), `.frame-corners` 필리그리(base.css:262-271), `.wax-seal`(base.css:294-302)까지 유틸리티화되어 있다. 장식을 일회성 마크업이 아니라 시스템 자산으로 만든 것 — 프로 스튜디오 방식이다. **더 확장할 것**(방주 유틸, 채식 이니셜 변형, 장서표(ex-libris) 프레임 등).

### ② 촛불 글로우가 일관된 인터랙션 언어 (tokens.css:184-188 외)
`--glow-candle`/`--glow-candle-sm` 토큰 → 링크 hover 시 금박 밑줄이 그어지며 text-shadow 글로우(base.css:102-115), 버튼 hover 글로우(buttons.css:34,51), `candle-flicker` 키프레임(base.css:368-372), `.spinner--candle`(feedback.css:133-134), 타임라인 도트 글로우(display.css). "촛불이 다가온다"는 은유가 컴포넌트 전반에 정합적으로 흐른다. 시그니처 모션으로 승격시킬 재료가 이미 있다.

### ③ article.html '리딩 룸' — 진짜 편집 레이아웃 (pages/article.html)
TOC/본문/방주(marginalia) 3컬럼 그리드(article.html:329-345), 스크롤 읽기 진행바(:522-525), 각주 왕복 링크, 손으로 그린 서가 동판화 히어로 SVG(:560-680), 카탈로그 블록(:373-390). 컴포넌트 진열이 아니라 콘텐츠 맥락 속에서 시스템이 작동하는 페이지다. 이 페이지의 밀도·서사를 다른 9장의 기준선으로 삼을 것.

---

## 3. AI 지문 (DNA와 무관하게 배어든 것)

> 크림 톤·세리프·드롭캡·문서 레이아웃은 이 테마에선 DNA이므로 지문으로 취급하지 않는다. 아래는 순수 지문.

### 🔴 A. 데모 페이지 10장 전부가 100% 영어 (치명)
`grep`으로 한글 문자 수 계측 결과 **pages/ 10개 파일 모두 한글 0자**. index.html만 한글화되어 있다. 국내용·한글 중심 프로젝트 방침 정면 위반이자, 전형적인 "AI가 영어로 뽑고 만" 흔적.
- 근거: pages/article.html:6 `<title>The Quiet Vice of the Marginalia`, pages/dashboard.html:6 `Analytics Dashboard`, pages/settings.html:6 `Preferences & Estate` 등 전부
- 등장인물·기관도 전부 서구 가상 인물: "Dr. Eleanor Margrave, Fellow of Merton College, Oxford"(article.html:696-697), "Dr. Evander Blackthorn"(profile.html:6)
- 그런데 전 페이지가 `<html lang="ko">`(각 파일 2행) — lang 선언과 콘텐츠 언어 불일치(a11y 문제이기도 함)
- **처방**: 10개 페이지 전면 한글화. 세계관은 유지하되 한국 맥락으로 번안(예: 고서점·장서각·규장각 아카이브 느낌의 인물/기관명). 라틴어 장식구(MMXXVI 등)는 장식으로만 잔존 허용.

### 🔴 B. app.js가 한글 UI 라벨을 영어로 덮어씀 + 영어 dev 문구 하드코딩
- app.js:28 `lab.textContent = mode === 'light' ? 'Candlelight' : 'Parchment'` — index.html:90의 한글 라벨 `양피지`가 **로드 즉시 영어로 교체**됨(실동작 버그이자 지문)
- app.js:39 토스트 `'Aged parchment' / 'Candlelit hall' / 'Theme changed.'`
- app.js:175 토스트 기본 타이틀 `'Notice'`, app.js:184 `aria-label="Dismiss"`, app.js:194 기본값 `'Inscribed'`
- **처방**: app.js 내 사용자 노출 문자열 전부 한글화(테마 어휘로: 양피지/촛불, "기록되었습니다" 등)

### 🟡 C. hero + 균질 카드그리드 공식
- index.html:102-123 중앙정렬 히어로 → :421-433 `grid-3` 균질 페이지 카드 10장 나열. 디자인시스템 허브라 카탈로그성은 허용되나, 균등 3열 반복은 관성
- pricing.html:80-108 — 3열 균등 plan-grid + 가운데 카드 `scale(1.03)` featured. 전형적인 AI 요금제 공식
- base.css:317-321 `grid-2/3/4` 균등 그리드 외에 비대칭 레이아웃 프리미티브가 전무 — 전 페이지가 예측 가능한 리듬
- **처방**: §5 대담화 참조(폴리오 스프레드 비대칭 그리드)

### 🟡 D. 로마숫자 cosplay가 usability 영역까지 침투
- dashboard.html:257-260 날짜 범위 세그먼트가 `VII Days / XXX Days / Quarterly / Annual`, :252 `Anno Domini MMXXV`, :276 `Q III MMXXV`
- 분위기 장식(폴리오 번호 I~X 등)은 DNA지만, **데이터 컨트롤·수치 라벨의 로마숫자는 사용성 훼손이자 '테마 코스프레' 지문**. 장식 위치(번호·연호)에만 남기고 컨트롤은 한글로("7일/30일/분기/연간")

### 🟡 E. 오프팔레트 색 — "그 테마 색 비슷한 아무 색"
- dashboard 차트가 램프에 없는 `#c9a84c / #7b2d3e / #4a7c59 / #8b0000(css darkred)` 사용(§4-C 상세) — AI가 팔레트를 안 보고 "금색 비슷한 것"을 뽑은 전형적 흔적
- article.html 히어로 판화의 골드가 `#a8863c`(진짜 골드 `#a6843c`와 두 글자 다른 오타성 값) 39회 + `#ffd700`(순금 원색, DNA의 "aged" 골드와 충돌) — article.html:651-659
- product.html에 `#1A1A2E`(네이비!), `#2D5A27`, `#722F37`, `#b8960c` 등 175개 hex 산재(product.html:140-142 스와치 등)

---

## 4. 프로덕션 결함 (파일:라인)

### 🔴 A. SVG 표현 속성에 var() 직접 사용 — 렌더 깨짐 (알려진 버그)
HTML 표현 속성 `stroke=""`/`fill=""`에서 `var()`는 **fallback 포함 전체가 무효 처리**되어 stroke가 none이 된다. `style=""` 속성 또는 `currentColor`로 교체 필수.
- pages/404.html:227, 247, 279 — **404 히어로 일러스트 3종(책더미·빈 서가·꺼진 촛불) 전체가 안 보임**. :283의 `fill="color-mix(...)"`도 동일 무효
- pages/dashboard.html:290, 304, 318, 332 — 스탯카드 스파크라인 4개 전부 `stroke="var(--color-accent,#c9a84c)"` → **보이지 않음**
- pages/onboarding.html:842-844 (플러리시 path·circle), :880 (`fill="var(--color-accent)"` 플뢰르)
- pages/profile.html:1026-1028 (푸터 플뢰르)
- pages/settings.html:982, 1030 (위험구역 경고 아이콘 2개)
- 참고: base.css:51 `svg { fill: currentColor }`가 전역 적용되므로 교체 시 fill 상속 부작용도 함께 점검할 것

### 🔴 B. 미정의 토큰 참조 (조용히 스타일 소실)
- `--font-body` — 정의 없음(실제 토큰은 `--font-serif`): pages/article.html:148, 197
- `--color-surface-raised` — 정의 없음(실제로는 `--color-surface-2`): pages/article.html:96, 239, 692, 991 / pages/pricing.html:43 / pages/onboarding.html:120, 156 → 블록쿼트·빌링토글 등의 배경이 투명으로 소실
- `--color-surface-1` — 정의 없음: pages/inbox.html:37, 326
- `--text-muted` — 오기(정답 `--color-text-muted`): pages/dashboard.html:151, 351, 354, 357, 592, 607, 622, 637, 652, 667 → 색이 inherit로 새어나감
- **처방**: semantic.css에 alias를 추가하지 말고, 페이지 쪽 오참조를 정식 토큰명으로 일괄 치환

### 🔴 C. 토큰 우회 하드코딩 색상
- pages/dashboard.html: 차트·범례 전반 `#c9a84c`(:352,371-372,415-423,466,481,704,858), `#7b2d3e`(:355,374-376,433,471), `#4a7c59`(:358,378-380,439,476,599...), `#8b0000`(:644) — 전부 램프 밖. `--gold-500`/`--burgundy-500`/`--forest-400`/`--color-danger`로 정렬
- pages/article.html: 히어로·figure SVG의 `#a8863c` 39회, `#ffd700`(:651-652,658-659), 배경 `#0d0a07`/`#141008`/`#2a1f14`(:563-564,759,768) — 골드는 `#a6843c` 계열로 통일, 촛불 불꽃은 `--ember-300 #e8a24a`가 이미 존재
- pages/product.html: hex 175개(최다). 상품 변형 스와치 `#722F37/#2D5A27/#1A1A2E`(:140-142 — 네이비는 팔레트 정면 충돌), 판화 SVG `#b8960c` 70회
- components/display.css:222 `#0a0908`(코드바) — 경미, `--code-bg`보다 어두운 전용 토큰 추가 권장
- semantic.css:23, 94-99 등의 리터럴(`#38322a`, `#ece2cb`…)은 토큰 정의 계층이므로 허용

### 🟠 D. 접근성
- **대비 미달** (CHECKLIST.md:65의 "contrast ≥ 4.5:1 ✅" 주장과 불일치):
  - `--color-text-subtle #837861` on surface `#211d19` = **3.85:1** — 12px 안팎 메타텍스트에 광범위 사용(card__subtitle, byline 등)
  - `--color-danger #b5524c` on bg `#141210` = **3.81:1** — 하락 스탯 델타 텍스트(dashboard.html:312-315)
  - 차트 축 라벨 `rgba(201,168,76,0.5)` ≈ **2.4:1**(dashboard.html:386-406) — 데이터 의미를 담는데 사실상 안 보임
- **칸반 드래그앤드롭 키보드 대체 수단 전무**: 카드가 `draggable="true"` div(kanban.html:323 외 다수), tabindex·키 핸들러 없음(kanban.html:900-1021 인라인 스크립트) — 키보드/스크린리더 사용자는 카드 이동 불가
- **테이블 정렬이 클릭 전용**: `th.sortable`에 click만 바인딩(app.js:372-373), th는 포커스 불가 → 키보드 정렬 불가. th 내부를 button으로 감싸야 함
- **커맨드 팔레트 ARIA 부정합**: `.cmdk__item`이 `role="option"`인데 조상에 `role="listbox"` 없음, input에 `aria-activedescendant`/`role="combobox"` 미적용(index.html:494-503, app.js:198-260)
- `lang="ko"` + 전체 영어 본문(§3-A와 동일 사안) — 스크린리더 발음 붕괴

### 🟠 E. 기타
- 사이드바 죽은 링크 `href="#"` 다수: dashboard.html:210, 214, 218, 228, 232 (Volumes/Manuscripts/Search 등)
- article.html:353-355 — 900px 이하에서 TOC `display:none`, 모바일 대체 내비(디스클로저 등) 없음
- cmdk 아이템 2개는 `data-href`/`data-action` 없이 장식용(index.html:501-502 "북마크/PDF 내보내기") — 눌러도 무반응
- 폰트가 Google Fonts `@import` 2곳(tokens.css:11, base.css:12) — 오프라인 폴백은 준비되어 있으나(CHECKLIST 인정) FOUT 관리·preconnect 없음

### 상태 커버리지 (대체로 양호)
버튼 hover/active/disabled/loading(buttons.css:34-36,89-98), 인풋 focus/disabled/error(forms.css:37-45), 스위치·체크 focus-visible(forms.css:111,134), EmptyState(display.css, 404.html 갤러리), 스켈레톤 존재. 전역 `:focus-visible` 골드 링(base.css:354-358), `prefers-reduced-motion`(base.css:385-393) 확보. — 이 골격은 보존.

---

## 5. 대담화 기회 (프로라면 밀어붙일 지점)

### ① "촛불이 커서를 따른다" — 시그니처 라이트 인터랙션
다크모드 body 배경에 커서 위치를 따라가는 따뜻한 radial 광원(candle pool of light)을 1개 얹는다(JS ~10줄, `--mx/--my` CSS 변수 + `radial-gradient`). hover 대상 근처만 밝아지는 촛불 은유의 완성형. `prefers-reduced-motion`/터치 기기에서는 고정 vignette로 대체. 기존 `--glow-candle` 토큰과 결이 같아 DNA 훼손 없음.

### ② 폴리오 스프레드 그리드 — 균질 grid-3 파괴
index의 페이지 카드 10장을 책 펼침면(verso/recto) 메타포로 재조판: 12컬럼 위 비대칭 스팬(5/4/3 등), 카드 밖으로 삐져나오는 대형 로마숫자 폴리오 번호(blackletter, 기존 .num 확장), 골드 괘선이 카드들을 물리적으로 관통·연결, 홀수 카드는 baseline을 아래로 어긋나게. pricing 3열도 동일하게 — 가운데 featured를 scale이 아니라 **판형 자체가 큰 특장본**(높이·장식 프레임 차등, `.card--illuminated` + `.frame-corners` 활용)으로.

### ③ 다크모드 전환 = "촛불을 불어 끈다"
테마 토글 시 0.5s 시퀀스: 화면 중앙 상단에서 촛불 훅— 꺼지는 연기 한 줄(기존 404.html 연기 path 재활용) + 크로스페이드. 라이트→다크는 성냥 점화 플래시(80ms 골드 글로우). 토스트 문구도 "촛불을 밝혔습니다 / 양피지를 폈습니다"로. reduced-motion 시 즉시 전환.

### ④ 방주(marginalia)를 시스템 유틸로 승격
article.html에만 있는 여백 주석을 `.margin-note` 공용 컴포넌트로 승격해 dashboard(스탯카드 옆 사서의 손글씨 코멘트), settings(위험구역 옆 붉은 잉크 경고), product(감정가의 감정평)에 배치. 한글 손글씨 폰트(예: Nanum Pen Script) + 버건디 잉크. "문서 진열"이 아니라 "누군가 읽고 있던 문서"로 바뀐다.

### ⑤ 대시보드 차트를 '동판화 인포그래픽'으로
이미 "hand-drawn charts" 컨셉(README §6)인데 색만 오프팔레트 일반 차트다. area fill을 crosshatch/stipple SVG 패턴으로, 데이터 포인트를 잉크 방울·플뢰르 마커로, 축 라벨을 한글 명조 소형 캡션으로. 팔레트 정렬(§4-C)과 동시에 진행하면 "손으로 새긴 장부" 한 방이 나온다.

### ⑥ 왁스씰 마이크로인터랙션
`.wax-seal`(base.css:294-302)을 인터랙션으로: 폼 제출/확인 버튼 프레스 시 밀랍이 눌리는 스케일+이너섀도, 성공 토스트에 인장이 '쿵' 찍히는 스탬프 모션(scale 1.4→1 + 미세 회전). 온보딩 마지막 단계 "입학 허가서에 봉인" 연출로 서사 완결.

---

## 6. 한글 폰트 페어링 (기록 — 원칙적 보존)

- 로드: tokens.css:11 — `Song Myung`, `Nanum Myeongjo`(400/700/800), `Noto Sans KR`(400/500/700), `Noto Serif KR`(400-700)
- 스택(tokens.css:89-94):
  - `--font-serif`(본문): EB Garamond → … → **"Nanum Myeongjo", "Noto Serif KR"**
  - `--font-display`(헤딩): Cinzel → … → **"Song Myung", "Noto Serif KR"**
  - `--blackletter`: UnifrakturCook 계열 — **한글 대응 없음(의도적, 라틴 장식 전용 유지)**
  - `--font-mono`: Courier Prime → **"Noto Sans KR"** ← 모노 스택에 sans 폴백은 어색하나 실용적 타협
- **평가: DNA 정합 — 보존.** 명조 계열(Song Myung의 옛 활판 표정 + Nanum Myeongjo 본문)은 고딕 아카데미아의 '인쇄물' 미학과 정확히 맞는다. 서재풍 세리프가 '억지로' 쓰인 경우가 아니라 DNA 그 자체이므로 교체 불필요.
- **실질 문제**: 페이지에 한글이 0자라 이 페어링이 index.html에서만 작동 중(§3-A). 한글화가 곧 이 페어링의 활성화다. 한글화 시 Cinzel의 widest tracking(`--tracking-widest: 0.18em`)을 한글 헤딩에 그대로 적용하면 어색하므로 한글엔 `--tracking-wide` 이하로 완화 권장.
- 선택 제안: 방주·손글씨 연출용 한글 필기체 1종(예: Nanum Pen Script) 추가 후보 — §5-④와 연동. 필수 아님.

---

## 구현 우선순위 요약

| 순위 | 항목 | 근거 절 |
|---|---|---|
| P0 | SVG 속성 var() 16곳 교체(렌더 깨짐) | §4-A |
| P0 | 미정의 토큰 4종 오참조 수정 | §4-B |
| P0 | 페이지 10장 전면 한글화 + app.js 문자열 한글화 | §3-A·B |
| P1 | 오프팔레트 hex 정렬(dashboard/article/product) | §4-C |
| P1 | 대비 미달 3건 · 칸반 키보드 · 테이블 정렬 버튼화 · cmdk ARIA | §4-D |
| P2 | 대담화: 커서 촛불 / 폴리오 스프레드 / 촛불 전환 / 방주 유틸 / 동판화 차트 / 왁스씰 | §5 |
