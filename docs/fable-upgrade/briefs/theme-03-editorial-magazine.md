# 감사 브리프 — theme-03-editorial-magazine ("The Editorial")

> 감사일: 2026-07-04 · 감사관: 시니어 프로덕트 디자이너 관점 전수 감사
> 테마 경로: `design-systems/theme-03-editorial-magazine/`
> HTML 11개 (index + pages 10) · CSS: tokens/semantic/base + components 11파일 · app.js 727줄

---

## 1. DNA 요약

**정체성 한 문장**: 잡지 스프레드를 화면으로 옮긴 인쇄 미학 — 종이 크림(`#F7F3EC`) 위 잉크 블랙(`#1A1714`), 단 하나의 버건디(`#8E2A2A`), 위계는 색이 아니라 타이포그래피와 여백으로.

**⚠ 예외 규칙 적용 테마**: 이 테마의 DNA 자체가 인쇄·서적 미학이다. 크림 톤 배경, 세리프 헤딩, 헤어라인 룰, 문서적 레이아웃은 **AI 지문이 아니라 DNA**다. 목표는 "AI가 만든 문서"가 아니라 "프로 스튜디오가 만든 인쇄물" 수준으로 밀어붙이는 것.

명시된 규칙 (README.md·tokens.css·CHECKLIST.md에 기록):
- **단일 액센트**: 버건디 `--crimson-600` 하나만. README.md:125 "이 테마의 정체성은 단일 버건디다". danger조차 crimson 램프 재사용 (tokens.css:56 주석).
- **모서리 ≤2px**: `--radius-md`=2px (tokens.css:141 "≤ 2px 규칙 준수"), README.md:132 "올려도 ≤4px".
- **그림자 금지에 준하는 절제**: "종이 한 장 두께의 미세 소프트만" (tokens.css:146-150, CHECKLIST.md:11 "네온/하드섀도/요란한 그라디언트 없음").
- **상태색은 저채도 잉크톤**: 올리브/머스타드/슬레이트 잉크 (tokens.css:44-56).
- **에디토리얼 시그니처 필수**: 드롭캡·풀쿼트·키커/바이라인 스몰캡스·멀티컬럼+하이픈네이션·피겨 캡션·대형 에디토리얼 넘버·비대칭 매거진 레이아웃 (README.md:17).
- **종이 그레인**: 인라인 SVG fractalNoise, 라이트/다크 강도 자동 (base.css:36-53, semantic.css:59,105).
- **모션은 우아한 페이드만**: "과한 이동 금지" (tokens.css:183).
- **하드코드 색 금지**: "반드시 시맨틱 토큰만 사용" (README.md:136).
- 폰트: Fraunces(디스플레이) / Newsreader(본문) / Inter(라벨) / IBM Plex Mono + 한글 페어링(§6).

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 진짜 조판 지식이 배어 있는 타이포그래피 시스템 — 이 테마의 심장
- 본문 old-style 숫자 `font-feature-settings: "onum" 1` (base.css:33) vs 대형 넘버·스탯은 lining/tabular로 전환 `"lnum" 1, "tnum" 1` (base.css:293 `.edit-number`, display.css:42 `.statcard__value`) — 인쇄 조판 관습을 정확히 아는 디테일.
- 리드 단락 첫 줄 스몰캡스 `.lead-smallcaps::first-line { font-variant-caps: small-caps }` (magazine.css:62), 드롭캡 `::first-letter` 4.6em 버건디 (base.css:202-213), 풀쿼트 상단 굵은 룰 + 하단 헤어라인 비대칭 (base.css:215-229).
- 멀티컬럼 본문: `column-rule` 헤어라인 + justify + hyphens + 단락 들여쓰기 `text-indent: 1.4em` + 첫 단락 제외 (base.css:328-344) — 잡지 본문 조판 문법 그대로.
- **→ 증폭 방향**: 이 수준의 디테일을 컴포넌트 전반(테이블 숫자, 가격, 캘린더)에 일관 확산하고, article.html을 넘어 index 허브 자체를 "조판 견본첩(specimen)"으로 승격.

### ② article.html 쇼피스의 완결성
- ArticleHeader(키커→제목→덱→바이라인) → 도판1(캡션+크레딧) → 드롭캡 리드 → 2단 멀티컬럼 → 센터 풀쿼트 → 섹션 넘버 → 비대칭 6/6 도판+자형분석 → 3단 멀티컬럼 → 인용 블록 → 각주(`#fn1`↔`#fnref1` 왕복 링크, article.html:95,144-146) → 읽기 진행 바(article.html:20).
- 오프라인 SVG 도판(인쇄기 라인 일러스트 + 해칭 패턴, article.html:50-65)이라는 발상 자체가 좋음.
- **→ 증폭 방향**: 이 밀도를 기준선으로 삼아 다른 9개 페이지를 끌어올릴 것 (지금은 article만 잡지고 나머지는 SaaS 관리화면 톤).

### ③ 절제가 시스템으로 강제된 색·형태 규율
- 단일 버건디 + danger 통합 결단 (tokens.css:56), 저채도 잉크톤 상태색, radius 2px, 그림자 3단 미세 소프트 — 규칙이 토큰 레벨에서 물리적으로 강제됨.
- 대비 측정값이 CHECKLIST.md:49-65에 수치로 기록되어 있고, 미달값을 보정한 이력까지 남김 (muted `#6E6252`, 다크 primary `#CB6457`) — 프로덕션 감각.
- 페이지네이션·버튼그룹 선택 상태를 색이 아닌 **잉크 반전**(`--color-text` 배경 + `--color-bg` 글자)으로 처리 (table.css:69, buttons.css:120-124) — 인쇄물다운 해법.
- **→ 증폭 방향**: 이 "잉크 반전" 언어를 선택/활성 상태의 시그니처로 더 과감하게 통일.

---

## 3. AI 지문 (DNA와 무관하게 배어든 것) — 우선 제거 대상

크림 톤·세리프·헤어라인은 DNA이므로 지문 아님. 아래가 진짜 지문이다.

### 3-1. "글 Claude" — AI가 자신을 필진으로 크레딧 (최우선 제거)
- index.html:113 `글 Claude · 2026`, index.html:462 `글 — Claude · 사진 — Unsplash · 편집 — 편집국`
- article.html:42 `글 <strong>Claude</strong>`, article.html:157 관련기사 메타 `Claude · 5분`
- dashboard.html:180,200 테이블 필자 `Claude`, kanban.html:293 담당자 셀렉트 `<option>Claude</option>`
- **처방**: 국내 매거진 맥락의 실감나는 한국 필진명으로 전면 교체 (예: 편집장 서지원, 문화부 한예리, 과학부 김도현 등). 함께 있는 영문 가상 필진 `E. Marsh`(dashboard.html:185, article.html:155, kanban.html:294, profile.html:134), `A. Lindel`(dashboard.html:190, kanban.html:295, profile.html:135), `R. Koenig`(dashboard.html:195, kanban.html:296)도 국내 매체 설정에 맞게 한국 이름 위주로 재배치(외국인 객원 1명 정도는 허용). 섹션 키커의 영문(Culture/Politics/Essay)은 잡지 관습이므로 유지 가능.

### 3-2. 허브(index.html)의 "컴포넌트 진열대 + 균질 카드그리드" 공식
- index.html:180-450 `.gallery-grid`(layout.css:101 `auto-fill minmax(20rem,1fr)`) 안에 demo-card 13장을 무맥락 나열 — 30개 테마 공통의 AI 진열대 공식. 잡지라면 컴포넌트도 "지면"으로 조판되어야 함.
- index.html:502-513 데모 페이지 링크가 똑같은 `grid--3` 카드 10장 — 잡지의 **목차(Contents) 조판**(점선 리더 + 우측 페이지 번호 + 섹션 위계)으로 바꿀 절호의 기회를 놓치고 있음.
- 12컬럼 `mag-grid`(base.css:347-352)가 있는데 실사용은 span 7/5, span 6/6 정도의 얌전한 2분할뿐 (index.html:55-76, article.html:99-117) — README가 약속한 "비대칭 매거진 레이아웃"이 사실상 미이행.

### 3-3. 전 테마 공통 fade-up 스태거 모션 (시그니처 부재)
- base.css:426-440 `.reveal`/`reveal-1~6` = translateY(12px) 페이드업 스태거 — 어느 테마에나 있는 기본 모션. 인쇄 무드의 시그니처 모션(잉크 번짐, 활자 찍힘, 하이라이트 스와이프)이 아님. article-card 밑줄 스와이프(display.css:29-30)만이 유일한 테마 고유 모션.

### 3-4. 동일 SVG 플레이스홀더 커버 12회 반복
- `¶ § & N°2 Æ №` 대형 글리프 + `--color-surface-2` 배경의 같은 패턴이 article.html:155-157, profile.html:118-123, product.html:236-248, index.html:405-407에 반복. 아이디어(활자 글리프 표지) 자체는 ownable하니 버리지 말고, 표지마다 조판을 다르게(배경 잉크 반전, 버건디 판, 크롭된 초대형 글리프, 규칙선 조합) 변주할 것.

### 3-5. 디자인시스템 셀프-레퍼런스 카피
- index.html:69-73 스펙 나열("200+ 디자인 토큰/60+ 컴포넌트/제로 디펜던시"), index.html:526 푸터 "© 2026 · 순수 CSS & 바닐라 JS · 제로 디펜던시" — 잡지가 아니라 dev-tool 랜딩 문구. 잡지 **콜로폰(판권면)** 형식(발행인/편집인/인쇄소/ISSN/정가)으로 재작성하면 지문 제거와 DNA 증폭을 동시에 달성.
- 404.html:68 "Issue not found · plate missing"은 무드에 맞아 유지 가능.

---

## 4. 프로덕션 결함

### 4-1. 🔴 SVG stroke/fill HTML 속성에 var() 직접 사용 — 렌더 깨짐 알려진 버그 (총 33곳, 4파일)
presentation attribute에서는 `var()`가 무효 → **stroke는 none(선 소실), fill은 black(검정 뭉개짐)** 으로 렌더된다. `style="stroke:var(--…)"` 또는 `currentColor`+부모 color로 전량 교체할 것.
- **article.html**: 52(해칭 패턴 line stroke), 55(인쇄기 일러스트 g stroke — 히어로 도판 선 전체 소실), 58, 61, 64(캡션 텍스트 fill), 102-104(자형 다이어그램 'A' fill·기준선 stroke·라벨 fill), 155-157(관련기사 글리프 fill) — 11곳
- **product.html**: 52-58(메인 갤러리 rect fill·아트 stroke·글리프/캡션 fill), 62,65,68,71(썸네일 4개), 236,242,248(관련 상품) — 11곳
- **profile.html**: 60(커버 장식 stroke), 64(커버 텍스트 fill), 118-123(기사 카드 글리프 6개) — 8곳
- **index.html**: 405-407(캐러셀 표지 텍스트 fill 3개) — 3곳
- 참고: charts는 CSS 클래스(`.line`, `.donut__seg`)로 칠하므로 정상 (charts.css:32-47). 이 방식이 올바른 선례.

### 4-2. 🔴 ARIA 오용 — segmented / rating
- `.segmented`가 `role="group"`인데 자식 button에 `aria-selected` 부여 (dashboard.html:61-65, kanban.html:62, settings.html:186) — `aria-selected`는 group 하위 button에 무효. `role="radiogroup"`+`role="radio"`+`aria-checked` 또는 button `aria-pressed`로 교체. app.js:381-396 `bindSegmented`도 함께 수정 필요.
- index.html:242-246 segmented가 `role="tablist"`/`role="tab"`인데 대응 tabpanel·`aria-controls` 없음 — 가짜 탭 시맨틱.
- rating: `role="radiogroup"` 안이 일반 button (index.html:265-271) — `role="radio"`+`aria-checked` 없음. app.js:438-453은 `.is-on` 클래스만 토글하고 `aria-checked`를 갱신하지 않음 (CSS는 `[aria-checked="true"]` 셀렉터를 이미 준비해 둠, forms.css:194).

### 4-3. 🔴 Drawer 접근성 — 닫힌 서랍이 탭 순서에 남음 + 포커스 트랩 없음
- `.drawer`는 `transform: translateX(100%)`로만 숨김 (overlays.css:95-102) — `visibility`를 안 바꿔서 **닫힌 상태에서도 내부 컨트롤이 Tab으로 도달 가능**. index.html:553의 drawer는 `aria-modal="true"`인 채 상시 DOM 노출.
- app.js:183-202 `bindDrawers`는 모달과 달리 `trapFocus` 미적용, 열릴 때 포커스 이동도 없음.
- 처방: 닫힘 시 `visibility:hidden`(transition에 visibility 추가) 또는 `inert`, 열림 시 포커스 이동+트랩.

### 4-4. 🟠 테이블 정렬이 키보드로 불가능
- `th.sortable`은 클릭 핸들러만 (app.js:594) + 포커스 불가 요소 (table.css:36) — 키보드 사용자 정렬 불가. th 내부에 button을 넣거나 `tabindex="0"`+keydown 처리.
- 컨텍스트 메뉴도 마우스 우클릭 전용 (app.js:664) — 트리거 영역에 tabindex는 있으나(index.html:444) 키보드 열기(Shift+F10/메뉴키) 미지원.

### 4-5. 🟠 토큰 우회 하드코딩
- display.css:149-150 다크 코드블록 토큰색 `#9fb27f`, `#8aa3b6` — 잉크톤 램프 밖 즉흥값 (README.md:136 "하드코드 색 금지" 위반).
- forms.css:55 select 캐럿 data-URI에 `stroke='%23847762'`(warm-neutral-600) 고정 — **다크 모드에서 캐럿이 어두운 세피아로 남아 시인성 저하**. `[data-theme="dark"] .select`용 밝은 캐럿 오버라이드 필요.
- semantic.css 다크 표면색들(`#15120F`, `#1E1A16`, `#CB6457` 등 semantic.css:66-105)이 tokens 램프에 없는 즉흥값 — 시맨틱 레이어라 치명적이진 않으나 램프 원칙과 어긋남. 정리 권장.

### 4-6. 🟠 반응형 깨짐 의심
- index.html:56 `grid-column: span 7` — `.mag-grid`가 768px 이하에서 6컬럼으로 줄어드는데(base.css:352) span 7이 그대로면 암시적 트랙이 생겨 의도한 스택 배치가 깨짐. 모바일에서 `span 6`/full로 떨어지는 유틸 또는 인라인 미디어 대응 필요 (article.html:100은 span 6이라 안전).
- layout.css:43 inbox 3패널 `height: calc(100vh - var(--nav-height))` — 모바일 주소창 100vh 문제. `100dvh` 권장.
- base.css:337 `.multicol > * { break-inside: avoid-column }` — 모든 단락이 컬럼 경계에서 분할 금지라 긴 단락에서 컬럼 하단 공백/불균형 발생. 잡지 본문은 단락이 컬럼을 넘어 흘러야 자연스러움. 제거 또는 figure류에만 한정할 것.

### 4-7. 🟡 기타
- article.html:155-157 관련 기사 링크 `href="#"` — 죽은 링크 (article.html로 연결하거나 제목만 남길 것).
- article.html:20 읽기 진행 바 div에 `aria-hidden="true"` 없음 (장식 요소).
- 팝오버 트리거에 `aria-expanded`/`aria-haspopup` 미부여 (app.js:290-304는 메뉴와 달리 세팅 안 함, index.html:347).
- 툴팁이 `aria-describedby`로 연결 안 됨 (index.html:353-356 — role="tooltip"은 있으나 id 연결 없음).
- app.js:147-161 `trapHandler`가 전역 단일 변수 — 오버레이 A 열림→B 열림 시 A의 핸들러 참조가 유실되어 removeEventListener 불발 가능(핸들러 누적). 요소별 WeakMap 권장.
- 칸반 DnD는 HTML5 drag 전용 — 키보드 대안 없음(알려진 한계, 최소한 카드에 이동 메뉴 제공 고려).
- index.html:598, dashboard.html:235, 404.html:148 인라인 `onclick` — data-속성 바인딩 원칙과 불일치 (동작엔 문제 없음).
- 깨진 참조·ID 정합성은 양호 (CHECKLIST.md:81 0오류 주장과 일치, 이번 감사에서도 발견 못함).

---

## 5. 대담화 기회 (프로라면 밀어붙일 지점)

### ① index.html을 "디자인시스템 랜딩"에서 "창간호 표지 + 목차"로 재조판 (한 방)
- 히어로를 진짜 잡지 표지로: 초대형 세로/가로 제호, 발행 정보 라인(Issue N°03 · 2026년 7월호 · ₩18,000), 바코드/ISSN 블록, 버건디 스탬프(살짝 회전) — 이미 있는 `.masthead`(magazine.css:9-12)를 표지급으로 증폭.
- 데모 페이지 목록(index.html:502-513)을 **목차 조판**으로: `제목 ……… 24` 점선 리더 + 우측 정렬 페이지 번호 + 섹션 그룹(FEATURES / DEPARTMENTS). CSS만으로 가능 (`::after` dotted leader 또는 flex + border-bottom dotted).
- 푸터를 **콜로폰(판권면)** 으로 (§3-5 연계).

### ② 12컬럼 그리드를 실제로 깨기 — 오버랩·침범·회전
- article.html 도판2 구역(99-117)에서 헤드라인/풀쿼트가 이미지 위로 살짝 겹치게 (`grid-row` 겹침 + `margin-top` 음수), 풀쿼트가 멀티컬럼의 column-rule을 가로지르는 `column-span: all` 변형 추가 (`.span-all`은 이미 존재, base.css:342 — 실사용 0회).
- 대형 에디토리얼 넘버를 지금의 text-2xl(magazine.css:52)에서 **배경 워터마크 크기**(text-7xl, 저대비 크림/버건디 5~8% 오퍼시티)로 — 섹션 뒤에 깔리는 접힌 숫자. README가 약속한 "대형 에디토리얼 넘버"의 실현.
- 통계·가격 등 데이터 페이지에 `.stat-inline`(magazine.css:57-59)을 본문 사이에 끼워 넣는 "인용 통계" 조판 확산 — 이미 만들어 놓고 페이지에서 안 씀.

### ③ 시그니처 모션 — "잉크"의 물성
- 드롭캡/제호 진입: `filter: blur(2px)+opacity` → 선명해지는 **잉크 마름** 효과 (기존 fade-up 스태거 대체).
- 링크·강조 호버: article-card의 밑줄 스와이프(display.css:29-30)를 전역 `.prose a`, navbar__link로 확장하고, 중요 강조에는 버건디 형광펜 하이라이트 스와이프(`background-size` 0%→100%, 두께 0.4em) 추가.
- 읽기 진행 바(article.html:20)를 버건디 "잉크가 차오르는 룰"로 유지하되, 페이지 상단에 재단선(crop mark) 장식과 결합.

### ④ 분위기 배경 — 종이의 물성 한 단계 위로
- 현재 그레인이 이중 적용(body background-image + body::before, base.css:37-53)인데 체감이 약함. ::before 하나로 정리하고 `--grain-opacity`를 살짝 올리는 대신, **가장자리 비네팅**(종이 바램: 아주 옅은 radial-gradient 세피아)과 **재단 십자선/레지스트레이션 마크**를 컨테이너 모서리에 배치 (인쇄 교정쇄 무드).
- 다크 모드를 "야간 인쇄소" 컨셉으로: 그레인 강도 이미 차등(semantic.css:105) — 여기에 다크 전용 룰 색·도판 반전 디테일 추가.
- 섹션 구분에 옥스퍼드 룰(굵은선+가는선 이중, `.rule--double`은 존재하나 index.html:79 1회만 사용) 위계를 체계화: 챕터=double, 섹션=strong, 항목=hairline.

### ⑤ SVG 표지 시스템을 "가짜 이미지"에서 "조판 오브제"로
- §3-4의 반복 글리프 커버를 4~5종 변주 템플릿으로: (a) 잉크 반전 판, (b) 버건디 별색 판, (c) 초대형 크롭 글리프, (d) 규칙선+숫자 조합, (e) 해칭 패턴 판 (article.html:52의 해칭 재활용). var() 버그 수정(§4-1)과 동시 진행.

---

## 6. 한글 폰트 페어링 (현황 기록 + 판단)

- 로드: tokens.css:8 — Gowun Batang(400/700) · Nanum Myeongjo(400/700/800) · Gothic A1(400/500/700) · Noto Sans KR · Noto Serif KR
- 스택 (tokens.css:86-89):
  - `--font-display`: Fraunces → … → **Gowun Batang** → Noto Serif KR (한글 디스플레이 = 고운바탕)
  - `--font-serif`: Newsreader → … → **Nanum Myeongjo** → Noto Serif KR (한글 본문 = 나눔명조)
  - `--font-sans`: Inter → … → **Gothic A1** → Noto Sans KR (한글 라벨 = 고딕 A1)
  - `--font-mono`: IBM Plex Mono → … → Noto Sans KR

**판정: DNA 부합 — 보존.** 세리프·명조 계열은 이 테마에서 억지 서재풍이 아니라 DNA 그 자체다. 나눔명조 본문 + 고딕 A1 라벨 조합은 국내 매거진 관습과 일치.

**단, 프로덕션 이슈 1건**: 디스플레이·제호·헤드라인이 `--weight-black`(900)을 광범위하게 사용 (base.css:117,127; magazine.css:10,17,52,58; layout.css:22,66,82,98; display.css:42; navigation.css:18,46) — **Gowun Batang은 최대 700**이라 한글 헤드라인이 브라우저 합성 볼드(faux bold)로 렌더되어 잉크가 뭉개지고 Fraunces Black과 대비 밀도가 어긋난다. 처방 택1:
1. (권장) 한글 디스플레이 폴백을 **Nanum Myeongjo 800**으로 승격 (`--font-display`에서 Gowun Batang보다 앞에 배치하거나 교체) — 이미 로드되어 있어 비용 0.
2. 고대비 디스플레이 명조 신규 도입 검토 (예: MaruBuri Bold 등) — 단 오프라인 폴백 체계 유지 조건.
Gowun Batang은 풀쿼트·이탤릭 대체·리드 단락처럼 400~700 구간의 우아한 자리로 강등해 계속 활용.

---

## 구현 우선순위 요약 (구현 에이전트용)

| 순위 | 작업 | 근거 |
|---|---|---|
| P0 | SVG 속성 var() 33곳 전량 style/currentColor로 교체 | §4-1 (렌더 깨짐) |
| P0 | "Claude"·영문 가상 필진 → 한국 필진명 교체 | §3-1 |
| P1 | segmented/rating ARIA 교정 + app.js 동기화 | §4-2 |
| P1 | Drawer visibility/inert + 포커스 트랩 | §4-3 |
| P1 | 한글 디스플레이 900 문제 — Nanum Myeongjo 800 승격 | §6 |
| P2 | index.html 표지+목차+콜로폰 재조판 | §5-①, §3-2, §3-5 |
| P2 | 대형 넘버 워터맵크·span-all 풀쿼트·오버랩 등 비대칭 증폭 | §5-② |
| P2 | 잉크 시그니처 모션 (fade-up 스태거 대체) | §5-③, §3-3 |
| P3 | 테이블 정렬 키보드, 하드코딩 색 정리, span 7 반응형, multicol break-inside, 100dvh, 죽은 링크 | §4-4~4-7 |
| P3 | SVG 표지 변주 시스템, 비네팅/재단선 분위기 | §5-④⑤, §3-4 |
