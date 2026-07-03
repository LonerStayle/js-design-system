# 감사 브리프 — theme-18-mid-century-modern (Atomic)

> 감사일 2026-07-04 · 감사자: 시니어 프로덕트 디자이너 관점 감사
> 대상: `design-systems/theme-18-mid-century-modern/` (HTML 10개 · CSS 13개 · app.js 1개)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 병기함. 라인 번호는 감사 시점 기준.

---

## 1. DNA 요약

**정체성**: 1945–1969 원자시대(Atomic Age)·임스(Eames) 시대의 "따뜻하고 낙관적인 복고 모던". 크림 바탕 위 굵은 플랫 컬러 블록 + 유기적 곡선 + 아토믹 모티프(스타버스트·아톰·부메랑·키드니)가 시그니처.

**명시된 규칙** (README.md / 주석 근거):
- README.md:11 — 무드를 "**차갑지 않게, 미니멀하지 않게, 네온틱하지 않게**" 옮긴다. (사실상의 FORBIDDEN 규칙)
- semantic.css:7 주석 — "**white text only on \*-600+ fills; mustard/cream blocks use ink**" (대비 원칙: 머스타드·크림 위에는 반드시 다크 잉크 `--color-text-on-accent`)
- tokens.css:4 — 원시 토큰 전용, 시맨틱 의미 금지 (레이어 분리 규칙)
- README.md:191 — 새 컴포넌트의 색·간격·라운드는 반드시 토큰 변수 사용, **하드코딩 금지**
- 팔레트 앵커(tokens.css:5-6): Mustard `#E0A526` · Teal `#2E8B8B` · Burnt Orange `#C65D34` · Avocado `#7A8B3C` · Cream `#F2E8D5` · Warm Brown
- 형태 시그니처: `--radius-md: 11px` (tokens.css:177), 키드니 곡선 `--curve-organic` (tokens.css:184), 하드 오프셋 인쇄 그림자 `--shadow-block` (tokens.css:206), 스프링 오버슈트 `--ease-emphasized` (tokens.css:228)
- 모티프 토큰 7종: `--motif-starburst/atom/boomerang`, `--shape-kidney`, `--pattern-retro/legs`, `--texture-grain` (tokens.css:97-115)
- 타이포: 지오메트릭 산세리프(Jost/Poppins) + 레트로 슬랩 액센트(Bitter) + Space Mono (tokens.css:16-19)

**⚠ 예외 규칙 판단**: 이 테마의 크림/종이 톤은 '서재 감성 관성'이 아니라 **DNA 그 자체**(미드센추리 인쇄 포스터·가구 카탈로그 미학)다. 크림 바탕·웜 그림자·인쇄 오프셋 블록은 지문이 아니므로 보존·강화 대상. 단, "프로 스튜디오가 만든 레트로 포스터" 수준으로 끌어올려야 하며 '얌전한 AI 리포트' 레이아웃은 지문으로 분류(§3).

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 모티프 토큰 시스템 (업계 수준의 체계화)
아토믹 모티프 7종이 전부 data-URI SVG **토큰**으로 정의되어 있고(tokens.css:97-115), 사용 유틸(base.css:222-249 `.motif-*`, `.has-starburst`), 섹션 디바이더(layouts.css:99-101 `.atomic-divider`), 아톰 스피너(feedback.css `.spinner`), 히어로 부유 장식+float 애니메이션(layouts.css:36-41)까지 일관되게 흐른다. README.md:184-185의 "모티프 한 줄 교체" 가이드도 실제로 성립. **→ 이 파이프라인을 그대로 두고 사용처만 3배로 늘리면 된다(§5).**

### ② 보장대비 컬러블록 + 인쇄 오프셋 언어 (진짜 MCM 그래픽 언어)
`--block-*-bg/-fg` 쌍으로 대비를 토큰 레벨에서 보장(semantic.css:74-79), `.block--*`(base.css:190-197), 카드 컬러블록 변형(cards.css:30-35), 하드 오프셋 `.card--print`(cards.css:38-39)와 물리적 프레스 인터랙션이 있는 `.btn--block`(buttons.css:78-84 — hover 시 -2px 이동+그림자 성장, active 시 +2px 눌림)은 실크스크린 포스터의 촉감을 코드로 옮긴 수작. **→ 시그니처 인터랙션으로 공식화하고 카드·모달에도 확장할 것.**

### ③ product.html의 아트 디렉션 (컴포넌트 진열이 아닌 '장면')
머스타드 유기곡선 프레임 안에 손으로 그린 임스 체어 실루엣 SVG(product.html:75-91), 컬러블록 썸네일 4종(93-105), 원목 스와치 라디오(142-148), 컬러블록 특징 카드 4장(222-225)까지 — 실제 가구 스토어의 밀도로 조립된 페이지. 404.html의 유기곡선 빈상태 3종(96-135)도 카피가 따뜻하고 구체적("새로운 소식이 도착하면 여기 별처럼 반짝일 거예요"). **→ 이 밀도를 index.html 히어로와 dashboard에도 전파할 것.**

(차점: app.js의 포커스 트랩+Esc+포커스 복원(60-99), 토스트 aria-live(140), 테이블 정렬 aria-sort(371-374) 등 인터랙션 a11y 기본기가 탄탄함.)

---

## 3. AI 지문 (DNA와 무관하게 배어든 'AI가 만든 티')

### 지문 1 — 분위기(atmosphere) 토큰을 만들어 놓고 한 번도 안 씀 → 결과적으로 '밋밋한 배경'
`--texture-grain`(tokens.css:114-115), `--pattern-retro`(108-109), `--pattern-legs`(111-112)와 유틸 `.grain::after`/`.pattern-retro`/`.pattern-legs`(base.css:229-236)가 정의만 되고 **HTML 10개 파일 전체에서 사용 0건** (grep 확인). 실제 배경은 body의 라디얼 그라데이션 워시 3개(base.css:19-23)뿐 — 균질하고 평평한, 전형적 AI 배경. 1950년대 인쇄물의 종이 그레인·리피트 패턴이라는 무기를 손에 쥐고 안 쓴 것.
**수정 지시**: body 또는 주요 섹션에 `.grain` 오버레이 상시 적용(다크에서는 opacity 하향), 히어로/푸터/빈 배경 영역에 `--pattern-retro`·`--pattern-legs` 워시 배치.

### 지문 2 — hero 공식 + 자기참조 통계 클러스터 + 균질 섹션 리듬
- index.html:82-96 — eyebrow → 대형 타이틀 → 리드 문단 → CTA 2개 → **"5 컬러 램프 / 60+ 컴포넌트 / 9 실데모 / AA"** 4-스탯 클러스터. 디자인시스템이 자기 스펙을 자랑하는 전형적 AI 랜딩 공식.
- 모든 섹션이 `.hub-section`(동일 padding) + eyebrow("01 — 디자인 DNA"…) + h2 + 카드 그리드의 동일 리듬 반복(index.html:101, 142, 190, 395). 404.html도 hero → 3카드 그리드(56-137), pricing.html도 hero → 3카드 그리드(66-146) — **hero+카드그리드 공식이 페이지마다 복제**됨.
- 장식(hero__deco 3종)이 좌상·우상·좌하에 '고르게' 흩뿌려진 대칭적 안전 배치(index.html:78-80, layouts.css:37-39) — 프로라면 크롭·오버랩·비대칭으로 긴장을 만든다.
**수정 지시**: §5-①·③ 참조. 특히 자기참조 스탯 4개는 삭제하거나 '1956 / Eames / Atomic'류 세계관 카피로 교체.

### 지문 3 — 이모지 아이콘 대용 + 영문 eyebrow 관성 + 인라인 스타일 폭주
- 이모지를 아이콘/아바타로 사용: index.html:451-452(🪑/🛋️ 아바타), product.html:445,458-459(동일), dashboard.html:56("안녕하세요, 진섭님 👋"). MCM이라면 가구 실루엣 라인 아이콘(이미 product.html에 그리는 실력을 증명함)으로 대체해야 함.
- 영문 dev-tool 문구 eyebrow: index.html:82 "Theme 18 · Atomic Age", 404.html:63 "Error 404 · Page Not Found", pricing.html:68 "Pricing" — 국내용 시스템에서 근거 없는 영문 라벨.
- 인라인 style 남발: index.html 104곳, product.html 92곳, profile.html 65곳 (grep 집계). 컬러·타이포 설정까지 style 속성으로 페이지를 조립 — AI 특유의 '한 파일에서 다 해결' 흔적이자 유지보수 결함. 반복 패턴(예: 푸터, 컬러 스와치 버튼)은 클래스로 승격할 것.

(참고: 크림 톤·세리프 계열 슬랩(Bitter)·인쇄 그림자는 이 테마에선 지문이 아니라 DNA. 오판 금지.)

---

## 4. 프로덕션 결함 (파일:라인)

### A. SVG stroke/fill HTML 속성에 var() 직접 사용 — **렌더 깨짐 알려진 버그, 최우선 수정**
- pages/product.html:192, 193, 194 — `<svg ... stroke="var(--color-success)" ...>` (혜택 리스트 체크 아이콘 3개)
- pages/kanban.html:76, 133, 179, 213 — `<circle ... fill="var(--mustard-500|--teal-500|--orange-500|--avocado-500)"/>` (컬럼 상태 점 4개)
**수정**: `style="stroke:var(--color-success)"` 형태의 style 속성으로 이동하거나, `stroke="currentColor"` + 부모에 color 지정.

### B. 브랜드 로고 SVG의 하드코딩 hex — 테마 교체·다크모드 미전파
- 네비/사이드바/푸터 브랜드 마크가 전 페이지에서 `stroke="#2E8B8B"` `fill="#C65D34"` 하드코딩: index.html:45-46, 421 (푸터는 `#E0A526`), pages/dashboard.html:23, pages/product.html:25-26, pages/404.html:25-26, 149 등 10개 파일 전부. README.md:171-176의 "램프만 바꾸면 전파" 약속이 로고에서 깨짐.
**수정**: `stroke="currentColor"`+클래스 색상, 또는 style 속성 var() 사용.

### C. 대시보드 바 차트 — 범례와 데이터 의미 불일치 (가짜 데이터 티)
- pages/dashboard.html:87 범례는 "틸=온라인 / 오렌지=오프라인" 2계열인데, 90-97의 바는 월별로 틸/오렌지/머스타드가 **임의로 섞인 단일 시퀀스**(8월은 범례에 없는 머스타드). 차트가 의미를 갖지 않음 — 프로덕션이라면 월별 2개 바(grouped) 또는 단일 계열로 정리해야 함. `.bar-chart--grouped`(misc.css:48)가 이미 있으므로 활용.
- 차트 전반(bar/donut) 스크린리더 대체 수단 없음: dashboard.html:89-98, 104 — `role="img"` + `aria-label`(수치 요약) 부여 필요.

### D. 인박스 3-pane 모바일에서 메일 목록 접근 불가
- components/layouts.css:78-79 — ≤1024px에서 `.mail-nav` display:none, ≤720px에서 `.mail-list`까지 display:none. 복귀 토글이 pages/inbox.html에 없음(grep 확인: sidebar 토글·알림 드로어만 존재). 모바일에선 읽기 패널만 남아 **다른 메일을 선택할 수 없음**.
**수정**: 모바일에서 목록↔읽기 전환 버튼 또는 드로어 패턴 도입.

### E. 자기 규칙 위반 대비 — 머스타드 위 흰 텍스트
- index.html:149 램프 표시에서 `--mustard-500`~`600` 스텝에 `color:#fff` (E0A526 위 흰색 ≈ 2.0:1, C28A1A 위 ≈ 2.6:1). semantic.css:7 "mustard는 잉크" 규칙 위반 — 토큰 레퍼런스 페이지가 나쁜 페어를 가르치는 셈. mustard 500/600은 다크 잉크로 변경.

### F. 컴포넌트 내부 API 누출
- pages/dashboard.html:35 — 사이드바 업그레이드 버튼이 buttons.css의 **비공개** 커스텀 프로퍼티를 인라인으로 주입: `style="--_bg:var(--neutral-900);--_fg:var(--cream);--_bg-hover:var(--neutral-800)"`. `.btn--brown` 같은 공식 변형으로 승격할 것.

### G. 기타 상태·a11y·아키텍처
- cmdk 옵션이 포커스 불가 div(role="option")이며 `aria-activedescendant` 배선 없음 — index.html:462-471, app.js는 `.is-active` 클래스로만 추적. 스크린리더가 활성 옵션을 못 읽음.
- 404.html:68 검색 폼 `onsubmit="return false"` — 제출해도 아무 피드백 없는 죽은 컨트롤. 최소한 토스트/결과 없음 안내 연결.
- index.html:36 배너 닫기 inline `onclick` — data-attribute 아키텍처(README §5)와 불일치.
- 페이지네이션 `.pagination__btn`·사이드바 아이템은 전역 :focus-visible(base.css:60-64)에 의존 — 동작은 하나 컴포넌트 링 시스템(`--ring-shadow-*`)과 스타일 불일치.
- product.html:145-147 원목 스와치 `background:#5C3A21/#A9743B/#D8B888` 하드코딩 — 콘텐츠 색이지만 최소 주석 또는 `--wood-*` 토큰화 권장. role="radiogroup"인데 키보드 이동(JS) 미구현 — 방향키 처리 필요.
- 깨진 링크/참조: 없음 (CHECKLIST.md:103 전수 확인과 일치, 감사 중 재확인).

### H. 한글 폰트 스택 순서 리스크 (§6과 연동)
- tokens.css:16-17 — `--font-display`/`--font-body`에서 `system-ui`가 한글 웹폰트("Do Hyeon"/"Gothic A1")보다 **앞**에 위치. macOS Safari 등 일부 환경에서 system-ui가 자체 CJK 캐스케이드(Apple SD Gothic Neo)로 한글을 해석해 뒤의 무드 한글폰트가 무시될 수 있음.
**수정**: 한글 웹폰트를 system-ui 앞으로: `"Jost","Do Hyeon","Futura",...,system-ui,sans-serif` 순서로 재배열.

---

## 5. 대담화 기회 — 프로 디자이너라면 밀어붙일 지점

### ① 히어로를 '미드센추리 여행 포스터' 구도로 재조판
현재(index.html:76-98)는 중앙정렬 텍스트 + 가장자리 장식 3개. 밀어붙이기: **화면 절반을 차지하는 거대한 선셋 아크**(기존 `.hero__sun`을 opacity 0.7 워시에서 솔리드 컬러 아크 밴드 3겹으로), 좌하단에 **화면 밖으로 크롭된 초대형 스타버스트**(현 160px → 480px+, 일부만 보이게), 타이틀은 부메랑 곡선을 따라 살짝 회전(-2~-3deg)시켜 배치. 키드니 셰이프를 `clip-path`로 쓴 일러스트 프레임을 텍스트와 **오버랩**. 자기참조 스탯 4개(92-95) 제거.

### ② 잠자는 질감 3종 즉시 배치 (§3-지문1의 해소)
- body 전역: `.grain` 오버레이(base.css:232-236 이미 완성) — 라이트 opacity 0.35, 다크 0.2.
- 히어로·푸터: `--pattern-legs` 대각 헤어라인 워시(가구 다리 메타포).
- 섹션 전환부·빈 상태 배경: `--pattern-retro` 타일을 8~12% opacity로.
효과: '인쇄된 종이' 물성이 생기며 AI 특유의 무결점 평면이 사라짐.

### ③ 대시보드 스탯 카드를 몬드리안식 비대칭 컬러블록으로
dashboard.html:66-82의 균등 4분할(col-3×4)을 깨서: 총 매출은 **2칸 폭 머스타드 블록**(잉크 텍스트, has-starburst), 나머지는 크기가 다른 틸/크림/브라운 블록, 그중 1개는 `.card--organic` 키드니 곡선. `--shadow-block`을 스탯 카드에도 적용해 인쇄 포스터의 물성 통일. 바 차트는 §4-C 수정과 함께 바 상단을 반원(radius-pill)로 만들어 가구 다리 실루엣처럼.

### ④ 시그니처 마이크로인터랙션 3종 공식화
1. **스타버스트 스핀**: `.has-starburst` 부모 hover 시 ::before가 `rotate(22.5deg)` + scale(1.08)로 살짝 회전(rays가 번쩍이는 느낌) — reduced-motion 대응 포함.
2. **프레스 인쇄 촉감의 전면화**: `.btn--block`의 눌림 물리(buttons.css:83-84)를 `.card--print`(이미 hover 이동은 있음, cards.css:39)와 모달 CTA에도 통일 적용해 "이 시스템은 눌리면 종이가 눌린다"는 규칙 확립.
3. **아톰 스피너 핵 펄스**: 스피너(feedback.css:57-60) 궤도 회전에 nucleus scale 펄스 키프레임 추가 — 로딩의 한 방.

### ⑤ 404의 '0'을 아톰 궤도로 치환
404.html:64의 그라데이션 텍스트 "404"에서 가운데 0을 인라인 SVG 아톰(궤도 3개 + 도는 전자 애니메이션)으로 교체. 기억에 남는 "한 방"이 되고, 모티프 시스템의 쇼케이스도 됨.

### ⑥ 타이포 대담화 — 슬랩 이탤릭 강조어 시스템
히어로/섹션 타이틀에서 강조어 1개만 `font-slab` 이탤릭 + 오렌지로 스위치(예: "따뜻한 미래, *원자시대*의 낙관"). 1950년대 광고 조판의 혼합 서체 관행을 규칙화(`.accent-word` 유틸 신설). 현재 Bitter는 blockquote/eyebrow에만 소극적으로 쓰임(base.css:101-107, 123-129).

### ⑦ 칸반 컬럼을 '선반 위 컬러 블록'으로
kanban.html의 컬럼 헤더를 각 상태색 솔리드 컬러블록 탭으로, 컬럼 하단에 `--pattern-legs` 헤어라인로 '가구 다리' 지지선을 깔아 보드 전체가 미드센추리 선반처럼 보이게. (§4-A의 fill=var() 수정과 동시 진행)

---

## 6. 한글 폰트 페어링 (현황 기록 — 원칙적 보존)

로드(tokens.css:9): `Do Hyeon` · `Gothic A1`(400/500/700) · `Nanum Myeongjo`(400/700/800) · `Noto Sans KR` · `Noto Serif KR`

| 역할 | 라틴 | 한글 페어 | 판정 |
|---|---|---|---|
| `--font-display` (tokens.css:16) | Jost/Futura | **Do Hyeon** (+Noto Sans KR 폴백) | ✅ 탁월 — 둥근 지오메트릭 제목체가 레트로 간판 무드와 정합. **보존** |
| `--font-body` (tokens.css:17) | Poppins | **Gothic A1** (+Noto Sans KR) | ✅ 적합. **보존** |
| `--font-slab` (tokens.css:18) | Bitter/Rockwell | **Nanum Myeongjo** (+Noto Serif KR) | ⚠️ 조건부 보존 — 슬랩세리프의 한글 대응이 명조로 빠져 '서재풍'으로 기울 수 있으나, 사용처가 blockquote·eyebrow(대부분 라틴 대문자)로 좁아 실해는 적음. 슬랩 사용을 한글 본문으로 확장할 계획이 없다면 유지. 확장한다면 '마루 부리' 등 부리형 대안 검토 |
| `--font-mono` (tokens.css:19) | Space Mono | Noto Sans KR 폴백 | ✅ 무난. **보존** |

**단, §4-H의 스택 순서 결함 필수 수정**: `system-ui`가 Do Hyeon/Gothic A1보다 앞이라 환경에 따라 무드 한글폰트가 적용되지 않을 수 있음. 한글 웹폰트를 라틴 폰트 바로 뒤·system-ui 앞으로 이동할 것. (교체가 아닌 순서 수정이므로 페어링 보존 원칙과 충돌 없음)

---

## 구현 우선순위 요약
1. **P0 (버그)**: §4-A SVG var() 7건 → style/currentColor 치환. §4-H 폰트 스택 순서. §4-D 인박스 모바일.
2. **P1 (정합성)**: §4-B 로고 하드코딩, §4-C 차트 의미·a11y, §4-E 머스타드 대비, §4-F 버튼 내부 API.
3. **P2 (탈지문·대담화)**: §5-② 질감 배치(효율 대비 효과 최대) → §5-①③ 히어로·대시보드 재조판 → §5-④⑤⑥⑦ 시그니처 모션·타이포·한 방. §3의 이모지·영문 eyebrow·인라인 스타일 정리 병행.
