# 감사 브리프 — theme-09-y2k-frutiger-aero

- 테마 경로: `design-systems/theme-09-y2k-frutiger-aero/`
- 파일 구성: index.html + pages/ 9종 (총 HTML 10개), CSS 4계층(tokens/semantic/base/components 10개), app.js(806줄, 의존성 0)
- 총평: **30개 테마 중 상위권 완성도.** 토큰 아키텍처·상태 커버리지·한국어 실데이터 카피가 모두 수준급. 다만 **empty.html의 SVG 속성 var() 버그(52건)로 시그니처 일러스트가 통째로 깨져 렌더**되는 치명 결함이 있고, 한글 폰트 배선이 어긋나 있으며, 레이아웃 구도가 "얌전한 센터 정렬 공식"에 머물러 DNA 대비 대담함이 부족하다.

---

## 1. DNA 요약

**"2003년이 상상한 미래" — 하늘·물·잎 + 하이글로스 젖은 유리(wet glass).**

- **팔레트**: 스카이 블루 `#39B6FF` · 아쿠아 `#00D6C8` · 라임 `#9BE15D` · 화이트. 뉴트럴도 죽은 회색 금지, 블루 틴트 슬레이트 (tokens.css:58 주석 "never dead grey").
- **명시된 금지 규칙**: tokens.css:10 `NO greyscale-matte-sharp. Everything is wet, rounded, luminous.` — 무채색·매트·날카로운 모서리 금지. README.md:64 "무채색·매트·날카로움을 금지합니다."
- **시그니처 기법(토큰화됨)**: `--gloss-shine`(상단 화이트 샤인) / `--gloss-reflection`(하단 반사) / `--rim-light`(가장자리 라이트 림) / `--gloss-inset`(내부 베벨) / `--bubble-tint`(물방울) / `--bg-sky`(하늘 그라데이션) / `--flare`(렌즈 플레어) / `--glow-aqua`(포커스 글로우) — tokens.css:93~152.
- **형태**: 알약형 버튼(`--btn-radius: --radius-full`), 라운드 14~40px, 날카로운 모서리 없음.
- **모션**: 호버 시 부상(lift)+샤인 증폭, active 시 가라앉음(settle), 아쿠아 글로우 포커스 링, 배경에 떠오르는 버블 필드(app.js initBubbles, reduced-motion 시 스킵).
- **타이포**: 휴머니스트 산세리프 Mulish+Hind(Frutiger 대용). 다크 모드 = 딥 틸·네이비 물 위의 아쿠아 글로스.

이 테마는 인쇄·서적 미학 예외에 해당하지 **않는다**. 세리프·크림 톤·문서 감성은 전부 지문으로 간주할 것.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 시그니처 이펙트의 완전한 토큰화 — 업계 수준의 3계층 아키텍처
- tokens.css:93~152에 글로스/버블/플레어/글로우가 **재사용 가능한 원시 토큰**으로 승격돼 있고, semantic.css:77~81에서 `--surface-gloss-top/bottom`, `--surface-rim`으로 역할 매핑, 다크 모드(semantic.css:244~256)에서는 샤인을 약화하고 림을 아쿠아 틴트로 바꾸는 정교함까지 갖췄다.
- 컴포넌트 CSS의 하드코딩 hex는 사실상 0에 수렴 (grep 결과: badge.css:102 대비용 1건, mask용 #000, carousel 캡션 #FFF 정도).
- → **더 밀어붙이기**: 이 토큰 체계를 그대로 두고 위에 "커스틱(수면 빛 일렁임)", "크롬 텍스트", "젤리 스쿼시 모션" 토큰을 증설하면 된다. 구조가 이미 받쳐준다.

### ② 버튼·컴포넌트 상태 설계가 DNA 자체를 연기함
- components/buttons.css:167~214 — hover에서 `translateY(-2px)` + `::before` 샤인이 55%→60%로 팽창, active에서 settle + 샤인 48%로 수축, loading 스피너(변형별 색 보정 :279), disabled 3중 셀렉터. "젖은 젤리를 누른다"는 물성 서사가 상태 체계에 녹아 있다.
- 상태 커버리지 grep: forms-advanced.css hover 18/focus 12/disabled 18, overlay.css focus-visible 20건 등 전 컴포넌트 고른 분포.
- → **더 밀어붙이기**: 여기에 스프링 이징(`--ease-spring` 이미 존재, tokens.css:273)을 활용한 squash&stretch를 추가하면 시그니처 모션이 완성된다.

### ③ 실데이터 한국어 카피 + 커스텀 SVG 일러스트 (filler 제로)
- dashboard.html:402 "₩ 4.82억", :448 차트 aria-label에 실제 서사("38백만원에서 시작해 … 6월 82백만원으로 상승"), pricing.html:310~313 "₩19,000 / 연간 ₩15,800 · 2개월 무료", inbox/product(AquaPod Pro)까지 전부 맥락 있는 실데이터.
- empty.html:202~266 "버블에 갇힌 종이배" 404 일러스트 + 빈상태 4종(돋보기·봉투·종·구름) 전부 손수 그린 SVG — 테마 서사와 완벽히 일치하는 오리지널 아트.
- → **더 밀어붙이기**: 이 일러스트들은 var() 버그만 고치면(§4-1) 이 테마의 최대 자산이다. 배경 분위기 레이어로도 재활용할 것.

---

## 3. AI 지문 (DNA와 무관하게 배어든 티)

### ③-1. 서재 감성 잔재: 미사용 세리프 폰트 import — **tokens.css:15**
```css
@import url("...family=Do+Hyeon&family=Noto+Sans+KR...&family=Noto+Serif+KR:wght@400;500;600;700&display=swap");
```
`Noto Serif KR`(4웨이트)는 **어떤 폰트 스택에도, 어떤 파일에도 참조가 없다** (전체 grep 결과 import 라인 1건뿐). "일단 세리프도 불러두는" AI 관성의 전형. 수백 KB 낭비이자 DNA(휴머니스트 산세리프 온리)와 정면 모순. → **import에서 제거.**

### ③-2. 센터 정렬 히어로 + 4-stat 스트립 + 센터 section-head + 균질 카드그리드 공식 — **index.html**
- index.html:147~196 — 중앙 배지 → 중앙 대형 타이틀 → 중앙 서브카피 → CTA 3개 → 4칸 스탯 스트립. 그 아래 :66~68 `.section-head { text-align:center }`가 모든 섹션에 반복, :84 `gallery-grid: repeat(auto-fit, minmax(320px,1fr))`로 60개 컴포넌트를 **동일 크기 유리 진열대**에 나열.
- 페이지 자체는 허브라 진열이 목적이긴 하나, 히어로·섹션 구도가 대칭·예측 가능·수직 나열 100%로, "AI가 만든 랜딩" 실루엣 그대로다. (개선안은 §5-1, §5-2)

### ③-3. 이모지 아이콘 — 자체 원칙("아이콘=인라인 SVG") 위반
- index.html:522~526, pages/dashboard.html:762~769, inbox.html:938~945, empty.html:528~535 — 커맨드 팔레트 항목이 전부 `📊 🗂️ ✉️ 💎 🌙` 이모지. index.html:170 토스트 메시지 "…환영합니다! ✨", inbox.html:830,869 "메일을 보냈어요 ✉️".
- CHECKLIST.md:110 "아이콘 = 인라인 SVG (아이콘 폰트·외부 이미지 0) ✅"와 모순. 플랫폼별 이모지 렌더 편차 + AI 특유의 이모지 습관. → 팔레트 항목 아이콘을 기존 인라인 SVG 세트로 교체.

### ③-4. 영문 dev-tool 문구
- 테마 토글 라벨이 모든 페이지에서 영어 "Dark"/"Light" (index.html:137, app.js:64 `theme === 'dark' ? 'Light' : 'Dark'`). 한국어 UI 안에서 유일하게 튀는 영문 컨트롤. → "다크"/"라이트" 또는 아이콘(해/달 SVG)으로.

### ③-5. 카피 과장(구현 없는 기능 광고)
- index.html:556 칸반 페이지 카드 설명 "**드래그 가능한 카드**와 진행 컬럼" — app.js·kanban.html 어디에도 drag 구현이 없다(grep 0건). CHECKLIST.md:75는 정직하게 드래그 언급 없음. → 카피 수정 또는 드래그 구현(§5 참조).

### ③-6. (경미) 인라인 `onclick` 이원화
- index.html:522~525 등 커맨드 팔레트가 `onclick="location.href=..."` — 나머지 전부가 data-* 훅 패턴인 것과 비일관. AI가 "빨리 때운" 흔적.

---

## 4. 프로덕션 결함

### ④-1. ★★★ 치명 — SVG 프레젠테이션 속성에 var() 직접 사용 (알려진 렌더 깨짐 버그)
**empty.html에 52건, dashboard.html에 3건.** `fill=` / `stroke=` / `stop-color=` HTML 속성 안의 `var()`는 파싱 실패 → 검정(fill 기본값)·무색으로 렌더된다. **테마의 최대 자산인 404 일러스트와 빈상태 4종이 통째로 깨진 상태.**

- empty.html — 그라데이션 stop: :173~174, :206~228(bubble-fill/rim, wave-1/2, boat-sail/hull), :309~315, :351~360, :398~404, :435~439 등 stop-color 32건
- empty.html — 도형 fill/stroke: :233~234(플레어 원), :253~257(종이배 mast/sail/hull), :318, :329, :363~375(봉투), :407~414(종), :443~453(구름) 등 20건
- dashboard.html — :462 `color="var(--color-text-subtle)"`(그리드선 g), :469 · :518 `fill="var(--color-text-subtle)"`(차트 축 라벨 텍스트) → 라이트에서 검정으로 뭉개지고 **다크 모드에서는 검정 라벨이 배경에 묻혀 안 보임.**
- 수정 방법: `fill="var(--x)"` → `style="fill:var(--x)"` (stop-color도 `style="stop-color:var(--x)"`), 단색 아이콘은 `currentColor` + 부모 CSS color. (프로젝트 메모리: theme-07에서 동일 버그 확인됨)
- 부수: empty.html:453 `var(--warning-700, #B45309)` — `--warning-700`은 tokens.css에 미정의(400/500/600만 존재). style로 옮길 때 정의된 토큰으로 교체할 것.

### ④-2. sticky 내비게이션 무력화 — dashboard.html:255~288
`.navbar--sticky`가 header만 감싸는 `<div class="container-wide">` 안에 있고 그 div가 :288에서 바로 닫힘 → sticky 이동 범위가 0이라 **스크롤 시 내비가 그냥 사라진다.** (inbox.html:423은 `.mail-shell`이 전체를 감싸 정상 동작; index.html은 body 직계라 정상.) → wrapper 제거 또는 wrapper에 페이지 전체 포함. 또한 pricing/settings 등은 sticky 미적용으로 페이지 간 내비 동작이 비일관.

### ④-3. 한글 폰트 스택 배선 오류 — tokens.css:159~163
```css
--font-sans: 'Mulish', 'Hind', 'Segoe UI', 'Helvetica Neue', system-ui,
  -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
```
tokens.css:15에서 **Noto Sans KR을 로드하지만 `--font-sans`에 없다.** 한글 본문이 OS별 시스템 고딕(Apple SD Gothic Neo/맑은 고딕)으로 제각각 렌더 → import는 낭비, 크로스 플랫폼 일관성 상실. `--font-display`(:161)에서는 "Do Hyeon"이 "Noto Sans KR"보다 앞이라 한글 헤딩은 Do Hyeon으로 정상 동작. → `--font-sans`의 'Apple SD Gothic Neo' 앞에 `'Noto Sans KR'` 삽입, Noto Serif KR import 제거(§3-1).

### ④-4. ARIA 오용 — pricing.html:260
`<label class="switch" data-pricing-toggle aria-pressed="false">` — role 없는 `<label>`에 `aria-pressed`는 유효하지 않은 ARIA. 내부 checkbox가 이미 상태를 전달하므로 `aria-pressed` 제거(또는 button+role="switch" 패턴으로 통일). app.js가 이 속성을 토글한다면 함께 정리.

### ④-5. 취약한 cross-SVG 그라데이션 참조 — index.html:471
푸터 로고 `<svg><circle fill="url(#lg)"/></svg>`가 **navbar SVG(:115) 안에 정의된 `#lg`를 참조.** 지금은 렌더되지만 navbar 로고를 수정/제거하면 푸터가 검정 원이 된다. dashboard(:261 `logoG`, :300 `sbLogo`)처럼 자체 defs를 갖거나 공용 심볼로.

### ④-6. 기타 (우선순위 낮음)
- empty.html:317 `<circle cx="60" cy="98" rx="34" r="0" fill="none"/>` — circle에 존재하지 않는 `rx` 속성 + r=0의 죽은 요소. 삭제.
- base.css:61 스크롤바가 `var(--sky-400)` 원시 토큰 직접 참조 — "컴포넌트는 시맨틱 토큰만" 원칙(README.md:217)의 예외. 시맨틱 토큰 경유 권장.
- dashboard.html:535~536 차트 범례 hex 하드코딩(`#5CC2FF,#1E94E6` 등) — 장식 허용 범위이나 다크 모드에서 라인 그라데이션(defs 고정 hex)과 함께 톤 재검토.
- semantic.css:85 `--color-backdrop-blur: 8px` — color- 네임스페이스에 길이값(네이밍 오염). `--surface-blur` 등으로.
- index.html:174 스탯 스트립에 `role="list"/listitem` — div에 부여할 바엔 ul/li 시맨틱 태그 권장(경미).
- 접근성 전반은 우수: 포커스 트랩/Esc/방향키(app.js), aria-live 토스트(app.js:182), skip-link, reduced-motion 시 버블 생성 자체 스킵(app.js:34) 모두 확인됨.

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 지점)

### ⑤-1. 배경을 "그라데이션+버블"에서 **Frutiger Aero 풍경**으로 승격 — 한 방 후보
현재 분위기 레이어는 `--bg-sky` 그라데이션 + 랜덤 버블 + 플레어뿐(base.css:79~139). 진짜 Frutiger Aero의 상징은 **초원 언덕 + 수평선 + 물의 커스틱(caustics)**이다.
- 하단에 라임 그라데이션 잔디 언덕 실루엣 SVG 밴드(bliss 벽지 오마주)를 `.aero-sky::after`로 추가, 다크 모드에서는 수면 반사 밴드로 전환.
- 수면 커스틱: `feTurbulence + feDisplacementMap` SVG 필터를 입힌 반투명 라이트 레이어를 느리게 애니메이션(reduced-motion 시 정지). empty.html의 물결 path(:237~241)를 그대로 재활용 가능.
- 스크롤에 따라 언덕/버블이 다른 속도로 움직이는 2단 패럴랙스(JS 10줄).

### ⑤-2. index 히어로를 대칭 나열에서 **z-깊이 오버랩 구도**로
- 히어로 타이포가 거대한 유리 오브(`hero__orb`)를 **뚫고 지나가게**: 오브 1개를 타이틀 위(z 앞), 1개를 뒤로 배치하고 오브에 backdrop-filter 굴절을 주면 "유리 뒤의 글자"가 왜곡돼 보인다 — 이 테마만 할 수 있는 연출.
- 스탯 스트립 4칸 균등 그리드 → 크기가 다른 버블형 캡슐들이 비대칭으로 떠 있는 구성으로(큰 버블=핵심 수치). `--radius-full` + `--bubble-tint` 재사용.
- 컴포넌트 갤러리를 균질 minmax 그리드 대신 2:1:1 변주 그리드로, 대표 컴포넌트(버튼·스위치)는 2배 크기 "히어로 데모" 셀로.

### ⑤-3. 시그니처 모션: **젤리 물성 시스템**
- 버튼 active에 squash&stretch: `transform: scale(1.03, 0.94)` → 릴리즈 시 `--ease-spring`(이미 존재)으로 복원. 스위치 토글 시 썸이 물방울처럼 살짝 늘었다 붙는 keyframes.
- 클릭 지점에서 퍼지는 원형 리플(물결) 1회 — `::after` + JS 좌표 주입, 토스트 등장을 "수면 위로 떠오르는" translateY+blur 해제로.
- 카드 호버 시 gloss 하이라이트가 포인터를 따라 이동: `pointermove`로 `--mx/--my` 갱신 → `.glass::before`에 radial-gradient 위치 바인딩. (전 페이지 공통 적용 가능한 10~15줄)

### ⑤-4. 대시보드 차트의 아쿠아화 + var() 버그 수정을 겸한 업그레이드
- 라인에 `filter: drop-shadow(0 0 6px rgba(0,214,200,.6))` 글로우, 데이터 점을 물방울(작은 radial 버블)로, 영역 채움 하단에 미세한 물결 마스크.
- 축 라벨을 class+CSS(`fill: var()` in CSS는 정상 동작)로 옮기면 ④-1 다크모드 버그가 동시에 해결된다.

### ⑤-5. 데모 페이지에 **Aqua/Vista 윈도우 크롬** 프레임
- 각 pages/* 콘텐츠를 "유리 타이틀바(신호등 오브 3개 or 글로시 minimize/max/close) + 림 라이트 프레임" 안에 넣으면 '2003년의 OS' 서사가 완성된다. 이미 있는 `.glass` + `--rim-light`로 저비용 구현.
- 칸반에는 실제 드래그&드롭(HTML5 DnD ~60줄)을 넣어 ③-5의 카피 과장을 해소하고, 드롭 시 젤리 바운스 모션(⑤-3)과 연결.

---

## 6. 한글 폰트 페어링

| 슬롯 | 현재 | 상태 |
|---|---|---|
| 디스플레이(헤딩) | **Do Hyeon** (`--font-display`, tokens.css:161) | 로드·연결 정상. 한글 헤딩에 실제 적용됨 |
| 본문 | **Noto Sans KR** 의도 (tokens.css:15에서 로드) | **배선 누락** — `--font-sans`(:159)에 없음. 실제로는 Apple SD Gothic Neo/맑은 고딕 렌더 (④-3) |
| (잔재) | **Noto Serif KR** 400~700 | **완전 미사용 dead import** — 서재풍 세리프 관성, 제거 대상 (③-1) |

**판정과 권고**
1. (필수) `--font-sans`에 `'Noto Sans KR'` 삽입 + `Noto Serif KR` import 제거 — 페어링 "Do Hyeon + Noto Sans KR"을 실제로 성립시키는 배선 수리.
2. (보존 원칙, 단 검토 여지) Do Hyeon은 각지고 콘덴스드한 레트로 간판체라 "둥글고 젖은 젤리" DNA와 온전히 합치되진 않는다. 원칙상 보존하되, 대담화 과정에서 히어로 임팩트가 부족하면 **라운드 계열(Jua, 혹은 BM Jua 계열/Gowun Dodum)** 을 디스플레이 교체 후보로 — 알약 버튼·버블 모티프와 곡률 언어가 일치한다. 교체 시 `--font-display` 한 줄 + import 한 줄만 수정하면 되는 구조.
3. `--font-mono`(:162)의 `"Noto Sans KR"`(monospace 앞)은 코드 내 한글 대응용으로 유지 무방.

---

## 구현 에이전트용 우선순위 요약

1. **[P0]** empty.html 52건 + dashboard.html 3건 SVG 속성 var() → `style=""` 속성/CSS 클래스/currentColor로 전환 (④-1). 전환 후 라이트/다크 양쪽 렌더 확인.
2. **[P0]** tokens.css:15 폰트 import 정리(Noto Serif KR 제거) + :159 `--font-sans`에 'Noto Sans KR' 삽입 (④-3, ⑥).
3. **[P1]** dashboard.html sticky wrapper 수리(④-2), pricing label aria-pressed 제거(④-4), index 푸터 SVG 자체 defs(④-5), 커맨드 팔레트 이모지→인라인 SVG(③-3), 테마 토글 한글화(③-4), "드래그 가능" 카피 해소(③-5: 카피 수정 or DnD 구현).
4. **[P2 대담화]** 배경 풍경 레이어(⑤-1) → 히어로 오버랩 구도(⑤-2) → 젤리 모션 시스템(⑤-3) → 차트 아쿠아화(⑤-4) → 윈도우 크롬(⑤-5) 순서 권장. 모두 기존 토큰(`--bubble-tint`, `--rim-light`, `--ease-spring`)만으로 구현 가능하도록 설계돼 있다.
