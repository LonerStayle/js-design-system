# 감사 브리프 — theme-02-swiss-international

- 테마 경로: `design-systems/theme-02-swiss-international/`
- HTML 파일 수: **10** (index.html + pages/ 9종: dashboard·kanban·inbox·product·pricing·settings·onboarding·profile·404)
- CSS 계층: tokens.css(211줄) → semantic.css(199줄) → base.css(507줄) → components/ 19파일(2,707줄), theme.css가 단일 진입점
- JS: app.js 795줄, data-attribute 구동, 의존성 0

---

## 1. DNA 요약

**International Typographic Style(1950s 스위스 — Müller-Brockmann, Hofmann, Ruder, Neue Grafik).**
"타이포그래피와 그리드가 곧 디자인이다." 흰 바탕 + 잉크 블랙(#0A0A0A) + 단 하나의 강조색 **Swiss Red #E2231A**. 위계는 색이 아니라 크기·굵기·자간으로만 만든다.

### 코드에 명문화된 금지/필수 규칙 (구현 시 절대 침범 금지)
| 규칙 | 근거 |
|------|------|
| 그라데이션·둥근모서리·그림자 **전면 금지** — radius/shadow 토큰 전부 0/none으로 강제 | tokens.css:6, tokens.css:133-148 |
| 유일한 "엘리베이션"은 1px 헤어라인 (`--shadow-hairline`) | tokens.css:147-148 |
| 아바타조차 정사각 (`--radius-full: 0` — "Swiss is square. Even avatars.") | tokens.css:136 |
| 유일 원형 예외 = 기능적 스피너의 border-radius:50% | components/button.css:103, CHECKLIST.md:117-118 |
| 모션: 페이드·밑줄 전환만, translate/bounce 금지 | tokens.css:181-183 |
| 포커스 = red 2px 아웃라인(색이 "움직이는" 유일한 순간), hover = 밑줄 or red 시프트, 절대 이동 없음 | tokens.css:174-178, base.css:63-69, button.css:3 |
| **왼쪽 정렬, 오른쪽 흘리기(flush-left, ragged-right)** | README.md:21, base.css:91 |
| 12컬럼 그리드 + 24px 거터 + 8px 베이스라인, `g`키 그리드 오버레이 | tokens.css:191-198, base.css:437-472 |
| 컴포넌트는 시맨틱 변수만 참조, raw ramp 직접 사용 금지 | semantic.css:4-6, README.md:87 |
| 시그니처: 모노 넘버링 섹션 라벨(`01 —`), 대형 디스플레이 숫자, 넓은 자간 대문자 모노 라벨 | base.css:138-169 |
| 블러 금지 (`--overlay-blur: 0px; /* no blur, ever */`) | semantic.css:188 |
| 상태색(green/amber/blue)은 저채도로 존재만, 위계 구축에 사용 금지 | tokens.css:50-57 |

⚠️ 이 테마는 "인쇄 미학 = DNA" 예외에 해당한다. 헤어라인·모노 라벨·포스터 타이포는 지문이 아니라 DNA다. 문제는 이 DNA를 **덜** 밀어붙인 데 있다.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **토큰 규율이 거의 완벽한 3계층 아키텍처.** 컴포넌트 19파일 전체 grep 결과 raw ramp 우회가 **단 1건**(components/chart.css:59), 하드코딩 hex/rgba **0건**. radius/shadow를 토큰 레벨에서 0으로 강제해 DNA가 구조적으로 깨질 수 없게 만든 설계(tokens.css:133-148)는 30개 테마 중 모범 사례. 다크모드도 시맨틱 재매핑만으로 완결(semantic.css:68-135).
2. **헤어라인 규율의 인쇄물급 정밀함.** btn-group의 -1px 마진 공유 헤어라인(button.css:126-136), prop-bar의 세그먼트 간 1px 배경색 구분(chart.css:53-59), 테이블 헤드 잉크 룰(semantic.css:177), repeating-linear-gradient로 그린 차트 격자(chart.css:14-20)까지 — 전부 "박스가 아닌 선"으로 일관. 상태 커버리지도 촘촘함(버튼: hover/active/disabled/loading 전부, button.css:42-112).
3. **순수 CSS/SVG 차트 + 시그니처 디테일 시스템.** SVG stroke를 전부 CSS 클래스로 처리해 var()-in-attribute 렌더 버그가 **없음**(chart.css:38-44 — grep 검증 0건). tabular-nums(base.css:172-173), 모노 넘버링 섹션 라벨(base.css:156-168), `g`키 그리드 오버레이+베이스라인 라인(base.css:437-472)은 이 테마만의 기억점 — 증폭 대상.

---

## 3. AI 지문 (구체 근거 필수)

### 3-1. 【치명】 9개 페이지 전부 100% 영문 — 한글화가 index.html에서 멈춤
- 한글 문자 수 실측: index.html **1,743자**, pages/ 9개 파일 **전부 0자**.
- 전 페이지 `lang="en"` (pages/dashboard.html:2, pages/pricing.html:2, pages/404.html:2 등 9곳 전부). index.html:2만 `lang="ko"`.
- `<title>`도 전부 영문 (pages/dashboard.html:7 "Analytics — Swiss International" 등).
- skip-link조차 "Skip to content"(pages/dashboard.html:38) vs index의 "본문으로 건너뛰기"(index.html:60).
- 국내용·한글 중심 프로젝트에서 **가장 큰 AI 지문**: "허브만 번역하고 끝낸 기계적 작업 흔적". 9개 페이지 전체 한글화 + `lang="ko"` 전환이 최우선 과제.

### 3-2. 유령 세리프 import — 서재 관성의 잔재
- tokens.css:13이 **Noto Serif KR 4개 웨이트**를 import하지만, 어떤 font stack(--font-sans/--font-mono)에도 세리프가 없음 → 수백 KB 죽은 로드이자, 산세리프-only DNA인 테마에 서재풍 세리프를 습관적으로 끼워 넣은 흔적. **import에서 제거할 것.**

### 3-3. DNA 위반형 관성: 가운데 정렬 hero
- pricing.html:16 `.pricing-hero { text-align: center }` + :18 `margin-inline: auto`, pricing.html:45 `.cta-band { align-items: center; text-align: center }` — README.md:21과 base.css:91이 명시한 "flush-left, ragged-right" 원칙 정면 위반. "요금제 = 가운데 정렬 hero + 3카드"라는 AI 공식이 DNA를 이긴 자리. 왼쪽 정렬 + 비대칭 컬럼(예: 4/8 분할)로 재구성할 것.

### 3-4. 유럽 SaaS 데모 데이터 클리셰
- 인명 Elena Kessler(dashboard.html:109)/Elena Brandt(profile.html:7)/J. Müller(dashboard.html:406), 회사 "Acme"(dashboard.html:110), 통화 전부 €(dashboard.html:151, pricing.html:109 등), "Winter Grid Launch" 같은 filler 캠페인명(dashboard.html:303).
- 단, Zürich/Basel/Bern(index.html:260-263), Helvetica/Univers/Akzidenz-Grotesk(index.html:255, 411-412) 같은 스위스 타이포 레퍼런스는 **DNA 윙크이므로 유지**. 한글화 시 인명·회사·통화(₩)는 국내 맥락으로, 스위스 서체·도시 레퍼런스는 살릴 것.
- index.html의 데모 데이터는 이미 김민준/이서연/박지후(index.html:397-399)로 잘 로컬라이즈됨 — 이 결을 pages/로 확산.

### 3-5. 균질·예측 가능한 리듬 (약한 지문)
- 모든 섹션이 동일한 `padding-block: var(--space-12)`(index.html:19 `.sec`), hero→카드그리드→테이블→카드그리드의 안전한 수직 나열. 스위스 포스터의 긴장감(스케일 대비, 비대칭, 여백 몰아주기)이 없는 "얌전한 리포트" 배열. §5에서 해결.
- 배경이 전면 균일 백색 — DNA상 장식은 금지지만, 크로스헤어·재단선·치수선 같은 **구조적** 질감은 스위스 인쇄물의 정당한 어휘인데 전혀 사용 안 됨.

---

## 4. 프로덕션 결함

### 반응형 (심각)
1. **dashboard 사이드바 반전 의심 — `hide-md` 오용.** pages/dashboard.html:69 `<aside class="sidebar hide-md">` + base.css:422-426 (`.hide-md`는 **768px 이상에서 숨김**) → 결과: 데스크톱에서 사이드바 완전 소멸(내부의 collapse 토글 버튼도 함께), 모바일(360px)에서는 17rem=272px 고정폭 사이드바(semantic.css:184)가 flex row(dashboard.html:16 `.dash-body{display:flex}`)에서 본문을 ~88px로 압살. `show-md`로 뒤집고 모바일용 드로어 진입점을 추가해야 함.
2. **inbox 모바일에서 메일을 열 수 없음.** pages/inbox.html:100-104 — ≤900px에서 `.inbox__pane--folders`와 `.inbox__pane--reading`을 **둘 다 display:none** → 목록만 남고, 목록 항목을 눌러도 읽기 창을 볼 방법이 없음. 폴더 접근 수단도 없음. 모바일 3-pane 전환 로직(목록→읽기 스택 전환 or 드로어) 필요.

### a11y
3. **토스트가 스크린리더에 안 읽힘.** app.js:171-173 토스트 컨테이너가 `role="region"`뿐 — `role="status"`/`aria-live="polite"` 필요. aria-label "Notifications"도 영문(한글화 대상, app.js 내 영문 UI 문자열 전수 점검).
4. **placeholder 대비 미달.** semantic.css:173 `--input-placeholder: var(--color-text-faint)` = neutral-400 `#a8a8a8`(tokens.css:27) on white ≈ **2.3:1**. neutral-500(#7a7a7a, ≈4.7:1)로 상향 권장. components/input.css:41-42 적용점.
5. **rating 위젯 ARIA 충돌.** index.html:292 `role="img"` 컨테이너 안에 interactive `<button>` 5개 — role="img"는 자식을 presentational로 플래튼하므로 버튼이 접근 트리에서 사라질 수 있음. radiogroup 패턴으로 교체.
6. **segmented를 tablist로 오용.** pages/dashboard.html:130-134(날짜 범위), pages/pricing.html:91(빌링 토글) — `role="tablist"/tab`인데 대응 tabpanel 없음. `radiogroup` 또는 `aria-pressed` 버튼 그룹으로.
7. **칸반 DnD 키보드 대체 수단 없음.** pages/kanban.html:153 `[data-kanban]` HTML5 드래그만 존재 — 카드 이동용 메뉴/단축키 없음.
8. **다크모드 red 텍스트 경계 대비.** `--color-accent`(red-500 #E2231A) on black #0a0a0a ≈ **4.2:1** — `.text-accent`를 다크모드 본문 크기에 쓰면 미달. 다크에서 accent 텍스트 역할만 red-400으로 올리는 재매핑 검토(semantic.css:88-95는 primary-hover만 조정).

### 링크/참조·일관성
9. **raw .md / .css로 향하는 내비 링크.** 전 페이지 navbar "Docs"→`../README.md`(pages/dashboard.html:49 등 9곳 + index.html:69), index 푸터의 `tokens.css`/`semantic.css` 링크(index.html:562) — file://에서 plain text/다운로드로 떨어짐. 제거하거나 문서 페이지로 대체.
10. **CHECKLIST.md 낡음.** CHECKLIST.md:90 "`lang="en"` ✅ all pages"를 통과 항목으로 기재 — index는 이미 ko, 프로젝트 기준으로는 결함. 고도화 후 문서 갱신 필요.
11. **인라인 핸들러 원칙 위반 1건.** pages/404.html:108 `onsubmit="return false"` — app.js data-attribute 원칙(README.md:168) 위반.
12. **시맨틱 우회 1건.** components/chart.css:59 `.prop-bar__seg--mid { background: var(--neutral-400) }` — 시맨틱 토큰 신설(예: `--color-data-mid`)로 흡수.
13. dashboard.html:100 `href="../pages/settings.html"` — 동작은 하나 `settings.html`이어야 정상(경로 관성 흔적).

### SVG var() 버그
- **해당 없음 (통과).** stroke/fill HTML 속성에 var() 직접 사용 0건 — 차트는 전부 CSS 클래스 스트로크(components/chart.css:38-44), 아이콘은 currentColor.

---

## 5. 대담화 기회 (프로 디자이너라면 여기를 민다)

현재 상태는 "규칙을 지킨 스위스"지, "포스터를 만든 스위스"가 아니다. Müller-Brockmann 포스터의 긴장감 — 초대형 스케일, 대각선, 비대칭, 잘려나가는 타이포 — 이 전부 빠져 있다. DNA 규칙(그림자·그라데이션·radius 금지, 이동 없는 hover) 안에서 다음을 민다:

1. **포스터급 히어로 재구성 (index.html:90-113).** 현재 hub-hero는 얌전한 2/7/3 컬럼 나열. 제안: `02` 숫자를 뷰포트 절반 높이(clamp 20rem~40vw)로 키워 우측 그리드 밖으로 **bleed + overflow crop**, 타이틀 "Swiss International"을 숫자 위에 **오버랩**(z-index, 겹침은 이동이 아니므로 DNA 합법), Swiss Red 사각 플레인 하나가 화면을 대각으로 관통(transform: rotate는 정적 구도이므로 허용 — 모션 금지지 대각 금지가 아님. Müller-Brockmann 'Beethoven' 참조). 404 페이지(pages/404.html:98 err-hero__numeral)도 같은 문법으로 — 숫자가 화면을 뚫고 잘리게.
2. **구조적 질감: 재단선·크로스헤어·치수선 시스템.** 균일 백색 배경 대신, 섹션 모서리에 인쇄 재단선(crop marks)·registration cross를 ::before/::after 헤어라인으로 삽입하고, 히어로 타이포 옆에 모노 치수선("88px / 0.95lh" 식 스펙 표기)을 단다. "프로 스튜디오의 인쇄 교정지" 무드 — 장식이 아니라 그리드 시스템의 가시화이므로 DNA 정합. 그리드 오버레이(base.css:437)를 히어로 영역 한정 기본 ON으로 트리밍하는 변형도 유효.
3. **시그니처 모션: rule-draw.** 스크롤 진입 시 섹션 헤어라인(.section-label border-bottom, .rule)이 왼→오로 **그어지는** scaleX 애니메이션(transform-origin:left, IntersectionObserver, prefers-reduced-motion 시 즉시 완성 상태). "선이 그려지는 질서"는 이 테마 유일의 합법적 모션 시그니처가 됨. 탭 밑줄(red 2px)도 슬라이드 전환으로 통일.
4. **한글 디스플레이 타이포 증폭.** 페이지 한글화와 동시에, 히어로·page-head를 한글 초대형 세팅(Gothic A1 800~900, tracking-tighter, 두 줄 스택)으로 — 한글 자소의 기하학은 그로테스크와 가장 잘 맞는 문자 체계. "질서."/"정밀함."/"객관성." 같은 한 단어 포스터 워딩이 filler 카피를 대체한다.
5. **잉크 플레이트 페이지 헤드.** 각 pages/ 상단에 Neue Grafik 표지 문법의 **전폭 잉크-블랙 밴드**(bg-inverse) + 흰 초대형 타이틀 + red 인덱스 숫자 — 현재 page-head(base.css:481-489)는 흰 바탕 텍스트뿐이라 화면 간 기억점이 없음. 9개 화면이 "같은 잡지의 다른 스프레드"처럼 읽히게 됨.
6. **데이터 밀도 과시.** dashboard stat-strip을 `--text-7xl`(120px, tokens.css:101 — 정의만 있고 화면에서 미사용) 숫자로 재조판, 칸반 컬럼 헤더에 대형 tabular 카운터. "대형 디스플레이 숫자"는 README.md:24가 명시한 시그니처인데 정작 데모가 소극적.

---

## 6. 한글 폰트 페어링

**현재 기록: Inter(라틴 그로테스크) + Gothic A1(한글 그로테스크) + Noto Sans KR(폴백) / JetBrains Mono(모노)** — Gothic A1은 Helvetica 대응 한글 그로테스크로서 **페어링 선택 자체는 DNA에 정확히 부합, 보존**. 단 배선 결함 3건:

1. **유령 세리프 제거**: tokens.css:13의 Noto Serif KR import는 어디서도 미사용(전 파일 grep 0건) — 삭제. (§3-2와 동일 건)
2. **스택 순서 취약**: tokens.css:86 `--font-sans`에서 Gothic A1/Noto Sans KR이 `system-ui` **뒤에** 위치 — 플랫폼별 시스템 폰트 캐스케이드가 한글 글리프를 먼저 잡으면 Gothic A1이 무력화될 수 있음. `"Inter", "Gothic A1", "Noto Sans KR", "Helvetica Neue", …` 순으로 한글 폰트를 앞당길 것(라틴은 Inter가 선점하므로 부작용 없음).
3. **디스플레이 웨이트 누락**: 시스템이 `--weight-black: 800`(tokens.css:124)을 히어로·page-head(base.css:104, base.css:488)에 상시 사용하는데 Gothic A1/Noto Sans KR은 400/500/700만 로드(tokens.css:13) → 한글 헤드라인이 faux-bold 합성됨. Gothic A1 **800(또는 900) 웨이트 추가 로드** 필수. §5-4의 한글 디스플레이 증폭의 전제 조건.
4. (참고) --font-mono(tokens.css:87)의 한글 폴백이 Noto Sans KR(비례폭) — 모노 라벨의 한글은 비례폭으로 렌더됨. 허용 가능한 타협이나, 라벨 한글화 시 자간(tracking-widest)이 한글에 과하게 벌어지지 않는지 확인할 것.

---

## 구현 우선순위 요약 (이 순서로)

1. pages/ 9개 전체 한글화 + `lang="ko"` + 영문 title/aria-label/JS 문자열 정리 (§3-1, §4-3)
2. 반응형 2건 수정: dashboard 사이드바 반전, inbox 모바일 읽기 창 (§4-1, §4-2)
3. 폰트 배선 3건: Serif 제거·스택 순서·800 웨이트 (§6)
4. 대담화: 포스터 히어로 + 잉크 플레이트 헤드 + rule-draw 모션 + 재단선 질감 (§5)
5. a11y 잔여: 토스트 live region, placeholder 대비, rating/segmented ARIA, 칸반 키보드 (§4)
6. pricing 가운데 정렬 → flush-left 재구성, raw .md/.css 링크 정리, CHECKLIST 갱신
