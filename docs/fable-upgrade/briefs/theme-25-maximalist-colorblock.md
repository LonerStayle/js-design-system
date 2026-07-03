# 감사 브리프 — theme-25-maximalist-colorblock (`COLOR/CLASH`)

감사일: 2026-07-04 · 감사자: 시니어 프로덕트 디자이너 관점 정밀 감사
테마 경로: `design-systems/theme-25-maximalist-colorblock/`
HTML 파일 수: 10 (index.html + pages/ 9종) · CSS: tokens/semantic/base/theme + components 9종 · app.js 774줄

---

## 1. DNA 요약

**정체성 한 문장**: 풀채도 8휴(핫핑크·일렉트릭블루·네온라임·오렌지·퍼플·시안·레드·옐로)의 거대 색면이 부딪히고 겹치고 대각으로 갈라지는 "충돌·에너지·과잉"의 맥시멀리스트 컬러블록 시스템.

**명시된 규칙** (파일 근거):
- `tokens.css:5-7` 헤더 주석에 FORBIDDEN 상당 선언: *"No minimalism, no whitespace worship, no grayscale dominance."* — 미니멀·여백 숭배·무채색 지배 금지.
- `README.md:16` — **"패턴이 아니라 색면"**: 화면을 큰 단색 면으로 분할(대각/기하), 색면 겹침/레이어가 핵심. 잔무늬·텍스처가 아님.
- `README.md:17` — 보더보다 **색 대비**로 구분. 중간 라운드(8px) 또는 직각, 블록 경계는 또렷.
- `README.md:21-25` + `tokens.css:149-158` — **색-온-색 접근성 규율**: 색면 위 텍스트는 사전 검증된 `--block-combo-1..8`(WCAG AA 4.5:1↑)만 사용. 상태는 색+아이콘+형태(`.status-dot--*` 원/다이아몬드/사각/물방울) 병행.
- 시그니처 인터랙션: 호버 = 색면 시프트(translate -2,-2 + 오프셋 섀도), 포커스 = 보색 솔리드 링(라이트=시안 `semantic.css:49`, 다크=옐로 `semantic.css:103`).
- 타이포: 디스플레이 Archivo Black(한글 Black Han Sans), 본문 Space Grotesk(한글 Gothic A1 의도), `--text-7xl`은 화면을 채우는 14rem clamp (`tokens.css:201`).
- 다크 모드 = 블랙 캔버스 위 네온 블록 (`semantic.css:66-116`).

이 테마는 인쇄·서적 미학 예외 규칙에 해당하지 않음 — 세리프/크림 톤이 나오면 전부 지문이다.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 검증된 색-온-색 combo 토큰 아키텍처 — 이 테마의 심장
- `tokens.css:149-158`: `--block-combo-1..8-bg/-fg` 8쌍 전부 대비 수치가 주석으로 기록됨(5.07~15.9:1). 램프 단계별 white-safe/black-safe 경계도 주석으로 명시(`tokens.css:22,28-29,50-53,63-64,88,106,111-114`).
- `components/colorblock.css:1-6`: `.plane-*`/`.combo-*`를 **의도적으로 마지막 로드**시켜 `.card` 배경을 이기게 한 로드순서 설계 — 주석으로 이유까지 문서화. 프로덕션 사고방식의 증거.
- **밀어붙일 방향**: combo를 "안전장치"에서 "표현 문법"으로 승격 — combo 간 인접 배치 규칙(어떤 색면끼리 부딪혀야 가장 요란한가)을 토큰화하면 충돌 미학이 시스템化됨.

### ② 시그니처 물리감(색면이 밀리는 인터랙션)의 일관성
- `components/buttons.css:33-40` hover translate(-2px,-2px)+5px 오프셋, active translate(2px,2px)+섀도 0 — "눌리는 블록".
- `index.html:37` `.page-tile:hover` 8px 오프셋, `components/display.css:17` `.card--hover`, `display.css:143` `.kanban-card:hover`, `pages/onboarding.html` `.opt-card:hover` — 전부 같은 문법. 변형별 오프셋 색상도 보색으로 지정(`buttons.css:55-58`: primary→블루, secondary→옐로).
- **밀어붙일 방향**: 이 문법을 내비/탭/테이블 행 등 아직 밋밋한 곳까지 확장 + 오프셋 색이 hover 중 hue 시프트하는 "클래시 플립".

### ③ 색면 히어로 구성력 — 페이지마다 실제로 색면을 씀
- `index.html:15-22` 히어로 4색면 그리드 + clip-path, `pages/404.html:13-18` 6×4=24칸 색면 그리드(이 테마 최고의 화면), `pages/pricing.html:12` 3색 대각 그라디언트 히어로, `pages/profile.html:12` 3색 커버, `pages/onboarding.html` 온보딩 aside 3색 사선.
- 오버사이즈 타이포 시스템도 견고: `base.css:87-98` `.headline-mega`(line-height 0.85) / `.headline-stroke`, `display.css:42` StatCard 거대 숫자(text-5xl).
- **밀어붙일 방향**: 아래 5절 — 지금은 히어로에만 색면 구도가 있고 본문은 얌전한 그리드.

(보너스 강점: `base.css:237-245` 색맹 대응 상태 형태 4종, `app.js` 774줄 의존성 0의 포커스트랩·키보드 내비 구현 — 유지.)

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 티)

### 지문 A — 색면 유틸리티가 "정의만 되고 안 쓰임": 겉만 맥시멀, 구도는 리포트형
가장 치명적인 지문. DNA의 핵심 어휘가 전부 사장(死藏)돼 있다:
- `.clip-diagonal / .clip-diagonal-rev / .clip-wedge / .clip-slash / .clip-corner` (`base.css:107-111`, 토큰 `tokens.css:138-142`) — **HTML 10개 파일 어디에서도 미사용** (grep 0건. 404의 유사 clip은 페이지 로컬 CSS).
- `.overlap`, `.layer-shift`(색면 겹침, `base.css:126-141`), `--block-overlap/-lg/-sm`(`tokens.css:145-147`) — **미사용**.
- `.headline-mega`, `.headline-stroke`(`base.css:87-98`) — **미사용** (index.html:22,378은 클래스 대신 인라인 `-webkit-text-stroke` 재작성).
- `.block-strip`(`base.css:152-154`) — 미사용. `.split-diagonal`은 index 푸터 1곳뿐.
- 결과: "겹침·레이어·대각 분할"이 README에만 있고, 실제 페이지는 **hero → 4-stat 그리드 → 카드 → 테이블**의 예측 가능한 리포트 공식 (`pages/dashboard.html:77-187`, `pages/profile.html:48-97` 동일 골격). 색만 요란한 AI 대시보드 템플릿의 전형.

### 지문 B — 죽은 흰 배경 (분위기 부재)
- 색면 밖 영역은 전부 `--color-bg: neutral-50`(`semantic.css:16`)의 플랫 캔버스. 맥시멀리즘 선언과 달리 섹션 사이 배경에 질감·워터마크·색 기운이 전무. 섹션 경계도 전부 수평 직선 보더(`index.html:132` `border-block`) — "충돌" 테마인데 사선 경계가 히어로 밖엔 없다.

### 지문 C — 인라인 style 남발 + 클래스 재정의 복붙 (비체계 반복)
- 인라인 style 개수: dashboard.html 40 · index.html 30 · pricing.html 25 · product.html 24 · profile.html 22.
- 대표 사례: `.section-tag` 클래스가 있는데 `pages/404.html:50`, `pages/pricing.html:36`에서 동일 스타일 전체를 인라인으로 재작성. `dashboard.html:80,85,89` `style="color:#fff"` 3연속 복붙(combo 위 delta 색은 컴포넌트가 해결해야 할 일). `#fff` 하드코딩 총 46곳(토큰 `--white` 우회).

### 지문 D — 영문 dev-tool 문구 잔재
- `app.js:60` toast region `aria-label="Notifications"` — 스크린리더가 읽는 문자열이 영문 (한글 제품).
- `app.js:35` 테마 라벨 텍스트 `"Dark"/"Light"`.
- `pages/pricing.html:36` "PRICING", `pages/404.html:50` "EMPTY STATES" 등 section-tag 영문 일변도 (마퀴의 "● HOT PINK…"는 그래픽 요소로서 DNA로 인정 가능하나, UI 라벨 영문은 지문).
- placeholder `hong@colorclash.dev`(index.html:167), `jinsup@colorclash.dev`(onboarding.html).

### 지문 E — 서재 관성의 흔적: 미사용 Noto Serif KR import
- `tokens.css:14` Google Fonts import에 `Noto+Serif+KR:wght@400;500;600;700` 포함 — **어느 폰트 스택에도 등장하지 않음** (grep 0건). 근거 없는 세리프가 다운로드 낭비로만 남은 전형적 AI 잔재. 제거 대상.

(크림 톤·세리프 헤딩·얌전한 문서 레이아웃 관성은 색 체계 차원에서는 없음 — 이 테마의 지문은 "문서 감성"이 아니라 **"선언한 과잉을 실행 안 함"**이다.)

---

## 4. 프로덕션 결함 (파일:라인)

### P0 — 렌더 깨짐
1. **SVG stroke에 var() 직접 사용 → 체크 아이콘 미렌더** (알려진 버그): `pages/pricing.html:58,59,60,86,87,88,89,90` — `<svg ... stroke="var(--color-success)">` 8곳. SVG 프레젠테이션 속성은 var()를 해석하지 못해 stroke가 무효 → `fill="none"`과 겹쳐 스타터/엔터프라이즈 플랜의 기능 체크마크가 **보이지 않음**. `style="stroke:var(--color-success)"` 또는 `stroke="currentColor"`+부모 color로 교체할 것.

### P1 — 접근성/대비
2. **자체 규칙 위반 대비**: `components/display.css:92` `.avatar--p1 { background: var(--pink-500); color:#fff; }` — `tokens.css:28` 주석이 명시한 "hot pink — **black text only**" 위반. 흰 글자 대비 ≈3.7:1로 AA 미달. `avatar--sm`(12px 이니셜)로 dashboard.html:34,141, kanban.html:79,89 등 다수 사용. → pink-600 배경 또는 black 텍스트로.
3. **반투명 badge 대비 위험**: `pages/pricing.html:67` `style="background:rgba(255,255,255,.25);color:#fff"` — pink-600 위에 흰 25% 합성 시 배경이 밝아져 흰 텍스트 대비가 5.07:1 아래로 추락(약 3.2:1 추정).
4. **칸반 DnD 키보드 대체 수단 없음**: `pages/kanban.html:163-193` 인라인 스크립트가 마우스 드래그만 처리. `.kanban-card`는 `draggable="true"`지만 tabindex/키보드 이동/ARIA(grab) 전무. CHECKLIST.md:38 "키보드 조작 ✅" 주장과 불일치.
5. **모바일 내비 단절**: `pages/dashboard.html:21` `@media(max-width:760px){ .sidebar{display:none} }` — 사이드바가 사라진 뒤 대체 내비(햄버거→드로어)가 없음. `data-sidebar-toggle`(dashboard.html:28)은 접힘 토글일 뿐 모바일에서 무력. 페이지 간 이동이 ⌘K에만 의존.
6. **에러 상태 시연 0건**: `components/forms.css:17-21` `.error-text`, `forms.css:47-50` `[aria-invalid="true"]` 스타일은 존재하나 **10개 HTML 어디에도 사용 예 없음** (grep 0건). 폼 검증 실패 상태를 보여주는 화면이 하나도 없다 — settings/onboarding에 에러 케이스 추가 필요.

### P2 — 토큰 우회/유지보수
7. `#fff` 하드코딩 46곳 (HTML 인라인) + `components/display.css:92,93,96`, `components/interactive.css:136` `.cal-event{color:#fff}` — `var(--white)` 또는 combo 클래스로 정규화.
8. `pages/pricing.html:14,16` `.plan.featured` 셀렉터 중복 정의 (transform과 margin이 분리 선언) — 통합.
9. **한글 본문 폰트 사장**: `tokens.css:186` `--font-body`에서 `system-ui`가 `"Gothic A1"`보다 앞 — macOS에선 system-ui가 한글(Apple SD Gothic Neo)을 흡수해 import한 Gothic A1이 영원히 안 쓰임. 순서를 `"Space Grotesk", "Gothic A1", "Noto Sans KR", system-ui, sans-serif`로.
10. `tokens.css:14` 미사용 Noto Serif KR 로드 (지문 E와 동일) — 폰트 요청 낭비 제거.
11. 폰트 로딩 이원화: 한글은 `tokens.css:14` CSS @import(렌더 블로킹 체인), 라틴은 각 HTML `<link>`(index.html:10 등) — 한 경로(HTML link)로 통일 권장.

### 참고 (통과 확인된 것)
- 정렬 테이블 th 키보드: `app.js:358` tabIndex=0 + Enter/Space + aria-sort 처리 — 정상.
- 툴팁 `:focus-within` 노출(`interactive.css:18`), 모달/드로어/cmdk 포커스트랩(`app.js:93-103`), `prefers-reduced-motion`(`base.css:248-255`) — 정상.
- 다크모드: combo/plane은 고정 vivid이며 fg도 고정이라 다크에서 대비 유지 — 설계 의도대로.

---

## 5. 대담화 기회 (프로라면 밀어붙일 지점)

### ① 히어로를 진짜 "충돌"로 — 사장된 clip/overlap 어휘 회수 (최우선)
- `index.html` 히어로: 현재 얌전한 2×2 그리드(`index.html:15-19`). `--block-divide-wedge/slash/corner`(tokens.css:140-142)로 화면을 5~6조각 **사선 파편**으로 분할하고, 헤드라인 "컬러가 충돌한다"가 색면 경계를 **가로질러 겹치게**(글자 절반은 `.headline-stroke` 아웃라인, 절반은 solid — 경계에서 갈라지는 연출). `.layer-shift`(base.css:134-141)를 hero-card에 적용해 겹침 오프셋 실사용.
- 각 데모 페이지 헤더에도 최소 1개의 대각 분할/오버랩 적용 — 유틸리티 사용률 0% → 페이지당 1+ 규칙화.

### ② 죽은 배경 살리기 — "색이 새어 나오는" 캔버스
- 섹션 배경 코너에 `.clip-corner` 색면 웨지 삽입, 섹션 뒤에 `text-7xl` 아웃라인 워터마크(예: "CLASH", "SYSTEM" 대신 한글 "충돌") — `.headline-stroke` 재활용.
- 섹션 경계를 수평 보더 대신 사선 경계(clip-path 또는 skew된 `.block-strip`)로. `.block-strip`(base.css:152)을 페이지 상단 컬러 틱커 바(8휴 스트립)로 전 페이지 공통 시그니처화.

### ③ 시그니처 모션 — "클래시 플립"
- 버튼/타일 hover 시 오프셋 섀도 색이 보색으로 **순간 전환**(예: 핑크→시안, `--duration-instant` 80ms) — 색면이 부딪히는 순간의 스파크. 이미 있는 `--ease-bounce`(tokens.css:296) 활용.
- 404 색면 그리드(`pages/404.html:36`)에 호버 인터랙션: 마우스가 지나간 칸의 색이 옆 칸과 뒤바뀜(swap) — 기억에 남는 "한 방"으로 승격.
- 페이지 로드 리빌(`base.css:286-297`)을 색면답게: 지금은 translateY 페이드(어느 테마에나 있는 모션). 색면이 **왼쪽에서 와이프**(clip-path inset 애니메이션)되며 잔상 색이 한 프레임 남는 연출로 교체.

### ④ 대시보드 차트를 색면 언어로 재설계
- `pages/dashboard.html:104-115` 막대 12개가 plane-1~8 무작위 순환 — 색이 데이터 의미를 잃음(장식적 무지개 = AI 티). 단일 휴 램프(예: blue-200→600)로 통일하고 **최고값 1개만 핫핑크로 클래시** — "충돌은 강조점에서 폭발"하는 문법. 범례(dashboard.html:117-121)도 실제 시리즈와 무관한 상태 — 정합화.

### ⑤ 거대 타이포의 한글 주인공화
- 통계 숫자·헤드라인이 죄다 라틴/숫자(₩284.7M, 48.2K). 한 화면쯤은 한글 자체를 색면으로: 히어로 "충돌"의 글자별 배경을 combo 1~4로 분할(글자당 색면 박스), Black Han Sans의 각진 골격을 전면에.
- 마퀴(`index.html:92-95`)를 영문 색이름 대신 "핫핑크 ● 일렉트릭블루 ● …" 한글 병기 또는 한글 전용으로 — 지문 D 해소와 동시 진행.

### ⑥ 프라이싱 featured 카드의 진짜 오버랩
- `pages/pricing.html:14` `scale(1.03)`은 소심함. featured 카드를 양옆 카드 **위로 물리적으로 겹치게**(negative margin + `--block-overlap`, z-index) 하고 오프셋 섀도 `--shadow-offset-lg`를 blue→yellow 이중으로 — "가장 인기"가 시각적으로 충돌의 중심이 되게.

---

## 6. 한글 폰트 페어링

| 역할 | 라틴 | 한글(의도) | 실효 상태 |
|------|------|-----------|----------|
| 디스플레이 | Archivo Black | **Black Han Sans** | 정상 동작 (`tokens.css:185`, Helvetica Neue에 한글 없어 폴백 도달) |
| 본문 | Space Grotesk | **Gothic A1** (+Noto Sans KR) | **사장됨** — `tokens.css:186`에서 `system-ui`가 Gothic A1보다 앞이라 macOS에서 한글이 Apple SD Gothic Neo로 렌더 |
| 모노 | JetBrains Mono | Noto Sans KR | 동작하나 mono 맥락에 Sans 폴백 (허용 범위) |

**판정**:
- **Black Han Sans는 DNA 적합 — 보존·강화 대상.** 초고중량 단일 웨이트의 각진 디스플레이체로 맥시멀 컬러블록의 한글 목소리로 최적. (서재풍 세리프 아님)
- **Gothic A1도 페어링 의도 자체는 적합**(기하학적 그로테스크, Space Grotesk와 결) — 단 `--font-body` 스택 순서 수정 필수: `"Space Grotesk", "Gothic A1", "Noto Sans KR", "Inter", "Segoe UI", system-ui, sans-serif` (결함 #9).
- **Noto Serif KR은 미사용 서재 잔재 — import에서 제거** (`tokens.css:14`, 지문 E/결함 #10).
- 대담화 제안: 본문 강조 위계에 Gothic A1 700을 적극 사용해 "본문마저 굵은" 맥시멀 텍스처 확보. 디스플레이 한글은 letter-spacing을 라틴(`--tracking-tightest`)보다 살짝 풀어(-0.01em~0) Black Han Sans 특유의 뭉침 방지.

---

## 구현 우선순위 요약 (구현 에이전트용)

1. **P0**: pricing.html SVG var() 8곳 교체 (체크마크 미렌더).
2. **P1 결함**: avatar--p1 대비 / 모바일 내비 / 칸반 키보드 / 에러 상태 시연 / body 폰트 스택 순서 / Noto Serif KR 제거.
3. **지문 제거**: 인라인 style 정규화(#fff 46곳, section-tag 재정의), 영문 UI 문자열 한글화(app.js:35,60 포함), placeholder 도메인.
4. **대담화**: 사장된 clip/overlap/headline-* 유틸 회수(히어로·섹션 경계·배경 웨지) → 클래시 플립 모션 → 404 색면 스왑 → 차트 색 문법 → featured 오버랩 → 한글 타이포 주인공화.
5. **불변 조건**: combo 1..8 대비 수치 유지(새 색면 조합은 검증 후 combo-9+로 추가), 상태=색+형태 병행, prefers-reduced-motion, file:// 동작, 외부 프레임워크 0.
