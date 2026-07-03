# 감사 브리프 — theme-11-bauhaus

> 감사관: 시니어 프로덕트 디자이너 출신 · 감사일: 2026-07-04
> 대상 경로: `design-systems/theme-11-bauhaus/` (HTML 10개: index + pages 9개, CSS 11개, app.js 1개)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 병기함. **테마 파일은 읽기 전용으로만 감사했음.**

---

## 1 · DNA 요약

**"형태는 기능을 따른다" — 순수 원색(빨강/노랑/파랑/검정/흰색) + 원·삼각형·사각형 도형 알파벳 + 엄격한 모듈러 그리드의 1919 바우하우스 미학.**

명시된 규칙(주석/문서에 박혀 있는 계약 — 고도화 시 절대 훼손 금지):

| 규칙 | 근거 |
|---|---|
| 그라디언트 금지, 소프트 섀도 금지 — 유일한 그림자는 하드 오프셋 | `tokens.css:183-189` "SHADOW — flat by mandate. Only hard-edge geometric offsets allowed", `README.md:17` |
| 앵커 원색 고정: red `#E63027` · yellow `#F7C200` · blue `#1E4FCC` · black `#1A1A1A` | `tokens.css:12-13`, `README.md:18` |
| 기하학적 이원성: 각진 것은 radius 0, 둥근 것은 완전한 원 — 중간값 없음 | `tokens.css:164-169`, `README.md:20` (체크박스=사각/라디오=원, 완료 스텝=원 `navigation.css:119`) |
| 지오메트릭 산세리프(Jost=Futura 대체) + 대문자·와이드 트래킹 헤딩 | `tokens.css:125-127`, `base.css:7` |
| 12컬럼 모듈러 그리드, 8px 베이스 모듈, 굵은/얇은 룰 라인, 비대칭 | `tokens.css:236-242`, `base.css:118-134,190-195` |
| 절제된 모션: hover=도형 회전/색 플립/오프셋 리프트, focus=원색 솔리드 아웃라인, reduced-motion 존중 | `README.md:23`, `base.css:100-104,286-293` |
| **노랑 위 흰 텍스트 금지** (항상 검정) | `semantic.css:22` "black on yellow — never white" |
| red-500(4.36:1)은 장식 전용, 흰 텍스트가 얹히는 롤은 red-600(5.64:1)으로 라우팅 | `README.md:91-95`, `semantic.css:31,58` |
| 상태는 색+도형 이중 신호(원=info, 삼각형=warning, 사각형=error) — green 없음, success=blue | `semantic.css:48-51`, `feedback.css:5,26-35` |
| 다크모드 = 검정 필드 + 동일 원색 블록, 하드 섀도는 흰색으로 플립, 포커스 링은 노랑 | `semantic.css:88-157` |

**예외 규칙 판정**: 이 테마는 인쇄·서적 미학 테마가 아님. 크림 톤·세리프가 나오면 전부 지문. (실제로 크림 톤은 없고, 세리프는 import 잔재만 존재 — 3절 참조.)

---

## 2 · 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 도형 알파벳의 전면 침투 — 시스템 전체가 하나의 언어를 말한다
- 아이콘 26종 전부 CSS mask + `currentColor` 인라인 SVG로 통일(`shapes.css:11-50`) — 외부 아이콘 폰트 0, 다크모드 자동 대응, SVG var() 버그 원천 차단.
- 상태를 색+도형 이중 신호로: alert 원/삼각형/사각형(`feedback.css:26-35`), status 칩(`index.html:264-266`), 타임라인 노드(`dashboard.html:650-687`), field__error 앞 삼각형(`forms.css:23`).
- 이원성의 위트: 위저드 완료 스텝이 사각형→원으로 변신(`navigation.css:119`), 체크박스=사각/라디오=원.
- 로고마크 자체가 원·삼각·사각 3도형(`shapes.css:104-110`).
→ **판정: 이 테마 최고의 자산. 고도화 시 이 어휘로 모든 신규 요소를 말하게 할 것.**

### ② 하드 오프셋 그림자 + 이동 인터랙션의 일관 시스템
- btn hover: `translate(-2px,-2px)` + `--shadow-flat`, active에서 원위치(`buttons.css:37-38`) — "종이가 들리는" 물리감.
- card-hover(`cards.css:21`), page-card(`index.html:31-32`), FAB hover 90도 회전(`buttons.css:169`), motif-trio 도형별 개별 회전(`shapes.css:59-62`).
- 다크모드에서 하드 섀도가 흰색으로 플립되는 디테일(`semantic.css:155-156`).
→ **판정: 시그니처 모션의 뼈대가 이미 있음. 5절에서 증폭 제안.**

### ③ 브랜드 순수성과 AA를 동시에 지킨 토큰 설계 (프로급 판단)
- red-500을 버리지 않고 "장식 전용"으로 격리, 텍스트 롤만 red-600으로 라우팅(`semantic.css:31,58`, `README.md:91-95`) — 주석으로 대비 수치까지 문서화.
- green을 도입하지 않고 success=blue-600으로 해결(`semantic.css:48-51`) — 바우하우스 3원색 팔레트 순수성 유지.
- 히어로 오버랩 컴포지션(`shapes.css:64-83`)과 geo-404 숫자 뒤 도형 겹치기(`404.html:409-414`)는 이미 과감한 구도의 씨앗.

---

## 3 · AI 지문 (테마 DNA와 무관하게 배어든 것)

### 🔴 A. 언어 이원화 — 최우선 교정 대상
국내용·한글 중심 프로젝트인데 **pages/ 9개 전부 `lang="en"` + 한글 0줄** (전수 grep 확인: 404/dashboard/inbox/kanban/onboarding/pricing/product/profile 한글 0줄, settings는 `<option>한국어</option>` 1줄뿐).
- `pages/dashboard.html:2` `lang="en"`, 전체 영문 SaaS 카피("Your analytics report is being generated and will be ready shortly." `:233`)
- index.html만 한국어(`index.html:2` `lang="ko"`) — 허브와 데모의 언어가 분열됨.
- `app.js`도 영어 기본값: `'Notification'`(`app.js:161`), `'Saved'`(`:183`), `'Setup complete!', 'Welcome aboard.'`(`:582`), `'Copied to clipboard'`(`:643`), 캘린더 월/요일 영문 `MONTHS`/`DOW`(`:526-527`), `'Slide '`(`:508`), toast region `aria-label:'Notifications'`(`:156`).
→ **조치: 9개 페이지 전부 한글화(lang="ko") + app.js 문자열/캘린더 한글화. 이때 Do Hyeon 디스플레이가 실전 검증됨(6절).**

### 🔴 B. 서재 관성 잔재 — 근거 없는 세리프 로드
- `tokens.css:8`이 **Noto Serif KR 4개 웨이트를 import하지만 어느 폰트 스택에서도 사용하지 않음**(tokens/base/semantic/components 전체 grep 결과 폰트 스택 등장 0회). 바우하우스 DNA에 세리프 근거 전무. 네트워크 낭비 + '일단 세리프 넣고 보는' AI 관성의 화석.
→ **조치: `@import`에서 `Noto+Serif+KR` 제거.**

### 🟠 C. 균질 리듬 + hero/카드그리드 공식
- index.html 모든 섹션이 동일한 `padding-block: var(--space-12)`(`index.html:21`) — 예측 가능한 리포트 리듬. 바우하우스는 비대칭이 DNA(`README.md:22`)인데 정작 페이지 리듬은 대칭.
- 히어로가 "좌 텍스트 + 우 일러스트" 표준 2단(`index.html:85-109`), 데모 허브는 9장 카드가 얌전한 균일 3col 그리드(`index.html:412-422`). `base.css:123-128`에 `.grid-modular`(비대칭 모듈러)와 `.row-2/.row-3`(`:134`)이 **정의만 되어 있고 index에서 미사용** — 도구를 만들고 안 쓴 전형적 AI 패턴.
- `.grid-texture`(모듈러 그리드 배경, `base.css:242-245`)도 정의만 있고 어느 페이지에도 미적용 → 배경 분위기 부재.

### 🟠 D. filler 카피 · 가짜 데이터 클리셰
- dashboard 표준 SaaS 4종 세트: Revenue $48.2K / Active Users / Orders / Conversion(`dashboard.html:248-286`).
- 다양성 템플릿 인명: Sarah Alderton, Priya Lakshmi, Fatima Okafor, Tom Nakamura...(`dashboard.html:506-608`) — 국내 서비스 맥락과 무관.
- pricing 3단 플랜 + "Most popular" 뱃지 공식(`pricing.html:271-273`).
- dev-tool풍 placeholder: "e.g. Implement dark mode tokens"(`kanban.html:823`), "Product designer & front-end developer... Based in Seoul."(`settings.html:297`).
→ **조치: 한글화하면서 국내 SaaS/스튜디오 맥락의 진짜 같은 데이터로 교체(인명·금액 ₩·날짜 형식 포함).**

### 🟡 E. 무맥락 진열대 성향 (경미)
- index 컴포넌트 갤러리는 디자인시스템 허브라 진열 자체는 정당. 다만 `demo-cell`이 전부 동일 프레임·동일 밀도(`index.html:26`) — 바우하우스 포스터처럼 셀 크기 위계를 주면 갤러리조차 작품이 됨(5절 ②).

---

## 4 · 프로덕션 결함

### 🔴 P1. 다크모드에서 시스템 전체 윤곽선 소실 — 구조적 버그
컴포넌트 CSS가 시맨틱 `var(--color-border)` 대신 **`var(--black)`을 직접 하드코딩**. 다크모드에서 `--color-border`는 흰색(`semantic.css:121-123`)으로 플립되지만 하드코딩된 `#1A1A1A` 테두리는 그대로 → 배경 neutral-950/surface neutral-900 위에서 사실상 보이지 않음.
- 발생 규모: `solid var(--black)` — forms.css 16곳(입력창 `forms.css:36`), data-display.css 14곳, overlays.css 12곳, feedback.css 9곳, navigation.css 8곳(navbar `:14`, sidebar `:42`), cards.css 7곳(`:12`), buttons.css 3곳(segmented `:128`), shapes.css 2곳, index.html 인라인 4곳. **base.css만 올바르게 `--color-border` 사용(7곳).**
- CHECKLIST.md:91-96이 "브라우저 스모크 테스트 미실행"을 자인 — 이 버그가 정적 검증(var 해석 여부만 체크)을 통과한 이유.
→ **조치: 구조 테두리 전부 `var(--color-border)`(또는 `--border-color`를 semantic에서 테마별 재정의)로 치환 후 다크모드 육안 검증. 단, 색면 블록 위 검정 테두리(예: 노랑 블록 프레임)는 의도된 것이므로 선별 치환.**

### 🔴 P2. 404.html 렌더 버그 2건
- `404.html:398` **중복 `style` 속성**: `style="right:6%; top:14%; opacity:0.15;" style="animation-delay:2s;"` — HTML 파서는 첫 속성만 채택, animation-delay 무시됨.
- `404.html:86-87` `filter: drop-shadow(0 0 0 3px var(--black))` — drop-shadow는 spread 인자를 지원하지 않음 → **선언 전체 무효**, 노랑 삼각형의 검정 윤곽 미렌더. (조치: 검정 삼각형을 살짝 크게 뒤에 겹치거나 clip-path 이중 레이어로.)

### 🟠 P3. 테마 토글 아이콘 의미 불일치
아이콘 세트에 sun/moon 계열 글리프 부재(`shapes.css:25-50` 전수 확인) → 테마 토글이 `ico-home`(`index.html:78`), `ico-gear`(`dashboard.html:201-203`), cmdk 다크모드 항목도 `ico-home`(`index.html:57`)을 임시로 사용. 5절 ③의 "원↔사각 도형 토글"로 해결하면 결함이 시그니처가 됨.

### 🟠 P4. pricing 미포함 기능에 체크 아이콘
`pricing.html:253-263` 등 `price-card__feat--muted`(aria-label "— not included")에 `ico-check` 사용 — 스크린리더는 "미포함", 눈은 "체크됨"으로 읽는 모순. → 미포함은 `ico-x` 또는 빈 사각형 도형으로.

### 🟠 P5. 유효하지 않은 breadcrumb 마크업
`product.html:262-270` — `<ol>` 직계 자식으로 `<span class="breadcrumb__sep">` 배치(ol의 유효 자식은 li/script/template). dashboard는 span 기반 nav라 무관. → sep을 li 내부로 이동하거나 CSS `::after`로.

### 🟠 P6. 깨진/어색한 링크
- `index.html:73` 내비 "문서" → `README.md` 원문 링크: file:// 환경에서 raw 텍스트/다운로드로 열림. → 제거 또는 스타일 가이드 페이지로 대체.

### 🟡 P7. SVG 관련
- **`var()` 직접 사용 버그 0건** (전 파일 grep 확인 — progress-ring은 CSS 클래스에서 stroke 지정하는 올바른 패턴, `feedback.css:94-95`). 유지할 것.
- 다만 `product.html:282-358` 상품 일러스트 SVG는 `#1A1A1A`/`#E63027` 등 하드코딩 — 다크모드에서 외곽 프레임 `rect stroke="#1A1A1A"`(`:283,313`)가 어두운 배경에 묻힘. '상품 사진'으로 간주 가능하나, 프레임 stroke만 `currentColor`화 권장.

### 🟡 P8. 기타
- `404.html:428` 인라인 `onclick="history.back()"` — 전체가 data-속성 초기화 패턴인데 유일한 인라인 핸들러(일관성/CSP).
- `shapes.css:81-83` 모바일 hero-composition `transform: scale(0.78)` — transform은 레이아웃 박스를 줄이지 않아 우/하단 유령 여백 의심. min-height 조정 + 실제 크기 축소로 교체 권장.
- `feedback.css:32-33` warning 삼각형 yellow-500(#E0AD00) on white ≈ 2:1 — 비텍스트 상태 지표 3:1(WCAG 1.4.11) 미달. 삼각형에 검정 윤곽(겹침 기법) 부여 권장.
- 상태 커버리지: `:active`가 buttons 외 전무, cards/data-display/navigation/overlays에 자체 `:focus-visible` 0건(전역 `base.css:100-104`가 커버하므로 치명적이진 않으나 `overflow:hidden` 카드 내부 요소의 아웃라인 잘림 가능성 점검 필요). `field__error`/`is-invalid` 스타일은 존재(`forms.css:22-23,51`)하나 실데모 노출 빈약.
- 테이블 `th`에 `scope="col"` 부재(`dashboard.html:480-494`).

---

## 5 · 대담화 기회 (테마 DNA 증폭 — 프로 디자이너의 밀어붙임)

### ① 히어로를 '바우하우스 전시 포스터'로 재조판
현재 좌 텍스트+우 컴포지션의 표준 2단(`index.html:85-109`). 실제 1923 바우하우스 전시 포스터 문법으로:
- "FORM FOLLOWS FUNCTION"(또는 한글 "형태는 기능을 따른다")을 **90도 세로 조판 + 대각선 배치** — `writing-mode: vertical-rl`과 `transform: rotate()` 조합.
- `hero-composition` 색면 블록을 텍스트와 **오버랩**시키고(z-index 교차), 블록이 뷰포트 가장자리까지 bleed.
- 현재 히어로 아래 분리된 마퀴(`index.html:113-124`)를 히어로를 가로지르는 **대각선 스트립**으로 삽입.

### ② 데모 허브를 몬드리안 구획으로
9장 카드 균일 그리드(`index.html:412-422`) → 이미 정의된 `.grid-modular` + `.row-2/.row-3`(`base.css:123-134`)을 사용해 01 대시보드는 `col-8 row-2` 대형 색면 카드, 02·03은 `col-4`... 식의 비대칭 구획. `page-card__no`를 `--text-6xl`로 키워 숫자 자체를 그래픽 요소로, 카드마다 원/삼각/사각 대형 모티프를 절반 잘린 채 배치.

### ③ 테마 토글을 도형 언어로 — 결함 P3의 한 방 해결
sun/moon 대신 **원(라이트) ↔ 사각형(다크) 도형 모핑 토글**: border-radius `--radius-full` ↔ `0` 전환 + 노랑↔파랑 색 플립, `--ease-spring` 사용. "기하학적 이원성" DNA를 인터랙션으로 발화하는 시그니처. cmdk 항목 아이콘도 동일 적용.

### ④ 배경 분위기 — '제도판 위의 구성'
- 미사용 자산 `.grid-texture`(`base.css:242-245`)를 index 파운데이션/갤러리 섹션 배경에 적용해 모듈러 제도 그리드 위에 컴포넌트가 놓인 느낌.
- 페이지 모서리에 대형 quarter-arc 색면(`--clip-quarter-*` 토큰 활용, `tokens.css:86-89`)을 스크롤과 무관하게 고정 배치 — 투명도 장난 없이 순수 색면으로(DNA 준수).
- 다크모드는 한 발 더: **블루프린트 모드** — surface에 blue-900 기운 + 흰 룰 라인, 이미 흰색 하드 섀도가 있어(`semantic.css:155-156`) 자연스럽게 어울림.

### ⑤ 섹션 리듬 파괴 (3절 C 교정과 동시)
섹션마다 `space-12` 고정 대신: 파운데이션(넓게) → 갤러리(빽빽) → 쇼케이스(초대형 여백 + rule-thick 4px 검정 바 전폭) 식의 의도된 강약. 섹션 번호 `01/02/03`(`index.html:130`)을 여백에 초대형 아웃라인 숫자로 흘리기.

### ⑥ 404를 움직이는 시계로
geo-404 구도는 이미 좋음(`404.html:409-414`). product.html의 시계 SVG(`product.html:282-303`)를 재활용해 **초침이 실제로 도는** 시계를 0 자리에 — "잘못된 시간에 도착한 페이지" 내러티브. reduced-motion 시 정지.

### ⑦ 스탯카드 숫자를 도형 카운터로
statcard 델타(`dashboard.html:250`)의 ▲▼를 이미 있는 삼각형 도형 어휘로 통일하고, hover 시 배경 모티프 도형이 값에 비례해 커지는 마이크로 인터랙션(`cards.css` statcard__shape 활용).

---

## 6 · 한글 폰트 페어링

**현재 기록** (`tokens.css:125-127`, import: `tokens.css:8` + `base.css:7`):

| 롤 | 스택 |
|---|---|
| display | `'Jost' → 'Poppins' → 'Futura' → 'Century Gothic' → "Do Hyeon" → "Noto Sans KR" → sans-serif` |
| body | `'Jost' → 'Poppins' → system-ui → "Gothic A1" → "Noto Sans KR" → sans-serif` |
| mono | `'IBM Plex Mono' → 'Space Mono' → ui-monospace → "Noto Sans KR" → monospace` |

**평가**:
- **Do Hyeon(디스플레이) — 보존.** 각지고 기하학적인 자형이 바우하우스 DNA와 정확히 맞는 페어링. 라틴은 Jost가 먼저 잡고 한글만 Do Hyeon으로 떨어지는 스택 순서도 올바름.
- **Gothic A1(본문) — 보존.** 중립적 그로테스크, 3웨이트 로드로 충분.
- **문제 3건**:
  1. `tokens.css:8`의 **Noto Serif KR import는 미사용 + DNA 무관 서재 관성** → 제거 (3절 B와 동일 건).
  2. Do Hyeon은 **400 단일 웨이트**인데 헤딩이 `--weight-bold`(700, `base.css:53`)/`.display`가 900(`base.css:67`)을 지정 → 한글 렌더 시 브라우저 faux-bold(뭉개진 합성 볼드). 한글 디스플레이 요소에는 `font-weight: 400` + `letter-spacing`/크기로 위계를 잡는 보정 규칙 필요.
  3. 현재 pages/가 전부 영문이라 **한글 페어링이 실전 미검증** — 3절 A의 한글화 작업과 함께 대형 한글 헤드라인(예: "형태는 기능을 따른다")을 히어로에서 육안 검증할 것.

---

## 우선순위 요약 (구현 에이전트용)

1. **P1 다크모드 테두리 소실 수정** (`var(--black)` → `var(--color-border)` 선별 치환, 71곳)
2. **pages 9개 + app.js 전면 한글화** (lang="ko", 국내 맥락 데이터, ₩/한글 날짜)
3. **Noto Serif KR import 제거** + Do Hyeon faux-bold 보정
4. 404 렌더 버그 2건, 테마 토글 도형 모핑(P3+대담화③), pricing 체크 모순, breadcrumb 마크업, README 링크
5. 대담화: 포스터 히어로 ① → 몬드리안 허브 ② → 배경 분위기 ④ → 섹션 리듬 ⑤ 순으로 적용 (DNA 명시 규칙 — 그라디언트/소프트섀도 금지, 노랑 위 흰 텍스트 금지, red-500 장식 전용 — 절대 준수)
