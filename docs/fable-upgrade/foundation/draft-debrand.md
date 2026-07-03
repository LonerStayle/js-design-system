# 기저 스펙 드래프트 — AI 지문 제거 + 대담화 (De-brand & Amplify)

> 작성일: 2026-07-04 · 근거: `docs/fable-upgrade/briefs/` 감사 브리프 23종 전수 분석
> 대상: 30개 테마 전체 재고도화 작업의 **공통 기저 규칙**. 테마별 브리프와 함께 사용한다.
> 이 문서는 "무엇을 지울 것인가(§2)"와 "그 자리를 무엇으로 채울 것인가(§3~5)"를 다룬다.

---

## 0. 대원칙 (충돌 시 우선순위)

1. **DNA > 이 스펙.** 테마 DNA(각 테마 README/tokens 주석에 명문화된 금지·필수 규칙)와 이 문서가 충돌하면 **항상 DNA가 이긴다.**
   - 예: 스위스(02)·바우하우스(11)·블루프린트(20)는 "그라데이션·소프트섀도 금지"가 헌법 — §3의 어떤 기법도 이를 우회할 수 없다.
   - 예: 미니멀 모노크롬(14)은 "노이즈/그레인 금지" 명시 — §3-B의 그레인 처방을 적용하지 않는다. 무기는 명도·스케일·헤어라인뿐이다.
2. **인쇄·서적 미학 예외 규칙.** 크림 톤·세리프·문서형 조판이 DNA인 테마(03 에디토리얼, 12 아르데코, 13 다크럭셔리, 15 휘게, 17 보태니컬, 18 미드센추리, 20 블루프린트-벨럼, 21 리소, 23 손그림-종이 등)에서는 그 표현이 **지문이 아니라 자산**이다. 걷어낼 것은 종이·세리프가 아니라 **'AI가 만든 문서' 같은 무기력한 실행**이다. 목표는 "프로 스튜디오가 만든 인쇄물".
3. **접근성·토큰 규율은 절대 후퇴 금지.** 감사에서 확인된 강점(3계층 토큰, 포커스 트랩, reduced-motion, 실측 대비 기록)은 대담화 작업의 전제 조건이다. 새로 넣는 모든 요소도 같은 계약(시맨틱 토큰만 소비, 대비 4.5:1, reduced-motion 가드)을 따른다.
4. **지문/DNA 오판 금지.** 아래는 감사에서 반복 확인된 "지문처럼 보이지만 DNA인 것" — 제거하면 안 된다:
   - 터미널(07)·인더스트리얼(19)·블루프린트(20)의 영문 대문자 시스템 라벨(`UPTIME`, `SHEET 20/20`, `kernel.panic`) — 명판/도면/로그 픽션은 DNA
   - 베이퍼웨이브(08)의 Cormorant 세리프 — 그리스 조각상 키치의 정식 어휘
   - 멤피스(10)의 크림 캔버스 — 멤피스 라미네이트 시그니처
   - 다크럭셔리(13)의 세리프 디스플레이·아이보리 — 메종 미학
   - 단, 이들 테마도 **사용자-facing 본문·aria-label·토스트 문구는 한국어**여야 한다 (이중 언어 구조: 장식/시스템 = 영문 픽션 허용, 읽는 텍스트 = 한글).

---

## 1. 진단 요약 — 감사 23종에서 드러난 공통 지문 분포

| 지문 | 발생 테마 수 (23 중) | 심각도 |
|---|---|---|
| 미사용 Noto Serif KR @import (서재 관성 화석) | **17+** (사실상 전수) | 중 (성능+관성 증거) |
| pages 9개 영문 `lang="en"` + 한글 0줄 | 10+ | **치명** (프로젝트 방향 위반) |
| hero+카드그리드 공식 / 자기참조 스탯 스트립 | 사실상 전수 | 상 |
| 균질 섹션 리듬(동일 padding·동일 section-head) | 사실상 전수 | 상 |
| 범용 fade-up 스태거 리빌 (시그니처 모션 부재) | 대다수 | 상 |
| 분위기 장치 "정의만 하고 미사용" | 10+ | 상 (기회이기도 함) |
| SVG 속성 `var()` 렌더 버그 | 15+ (최대 64건/테마) | **치명** (렌더 깨짐) |
| 한글 무드 폰트 스택 순서 버그(system-ui 선점) | 8+ | 상 (무드 폰트 사망) |
| 이모지 아이콘/아트워크 대체 | 7+ | 중 |
| README.md/CHECKLIST.md raw 링크 노출 | 10+ | 중 |
| 인라인 스타일 남발 (50~133개/페이지) | 6+ | 중 |
| segmented/rating ARIA 오용 | 12+ | 상 (a11y) |
| 다크모드 FOUC | 6+ | 중 |
| 서구권 인명·$/€ 통화 filler 데이터 | 10+ | 상 |

---

## 2. AI 지문 카탈로그 + 제거 지침

각 항목: **판별법(grep 가능) → 왜 지문인가 → 제거 지침**.

### 2-1. 서재·문서 감성 관성

#### A. 죽은 세리프 임포트
- **판별**: `grep -rn "Noto+Serif+KR" tokens.css` 후 `grep -rn "Noto Serif KR" **/*.css`로 폰트 스택 참조 0건이면 화석.
- **왜**: "한글 대응 = 일단 세리프도"라는 보일러플레이트 복붙 흔적. 수백 KB 죽은 로드.
- **지침**: DNA에 세리프 근거가 없는 테마(브루탈리즘, 뉴모피즘, 클레이, 카와이, 터미널, 코믹 등)는 **임포트에서 삭제**. 세리프가 DNA인 테마(03, 12, 13, 15, 17)는 스택에 실제로 배선돼 있는지 확인하고 미배선분만 정리.

#### B. 근거 없는 크림/종이 톤·세리프 헤딩
- **판별**: 테마 README의 팔레트 선언과 대조. 선언에 없는 `#F7F3EC`류 웜 크림, 세리프 `font-family`가 헤딩에 스며 있으면 지문.
- **지침**: 해당 테마의 정본 팔레트·타이포로 환원. §0-2 예외 테마는 건드리지 않는다.

#### C. 리포트형 얌전한 레이아웃 (아래 2-3과 연동)
- 위계 없는 균질 카드, 좌정렬 텍스트 스택, 안전한 2단 분할만 반복하는 페이지는 세리프가 없어도 '문서 감성'이다. §3-A로 해소.

### 2-2. 언어·데이터 지문

#### A. 영문 데모 페이지
- **판별**: `grep -l 'lang="en"' pages/*.html` + 한글 문자 수 카운트.
- **지침**: **전면 한글화가 P0.** `lang="ko"`, `<title>`, aria-label/alt/placeholder, JS 내장 문자열(app.js의 토스트 기본값, 캘린더 월/요일, 테마 토글 라벨, "Slide n", "Notifications")까지 전수. 단순 번역 금지 — **각 테마 index.html이 이미 잡아 놓은 보이스로 번안**한다(예: 카와이 "길을 잃었나 봐요 🥺", 클레이 "점토 속으로 쏙 들어가 버린 것 같아요", 아르데코 "엘리베이터가 없는 층에 내리셨습니다" 수준).
- 유지 대상: 테마 DNA인 영문 장식(§0-4), 코드/클래스명/기술 약어/워드마크, 라틴 학명, CAD 스탬프.

#### B. 서구권 filler 데이터
- **판별**: "Aria Whitfield / Elena Kessler / Sofie", `$1,280.00`, `€`, "Acme", "Winter Grid Launch", 가짜 로고 스트립("Trusted by 12,000+ teams" + NORTHWIND/VERTEX…).
- **지침**: 한국 인명(김서연·박지후…), ₩ 통화, '6월 21일' 날짜 형식, 국내 서비스 맥락의 캠페인명("여름 신규가입 캠페인"). 세계관 인명(멤피스 그룹 멤버, 개츠비 인물)은 **세계관 자산이므로 한국어 문맥 안에서 유지 가능**. 가짜 신뢰 배지는 삭제하거나 테마 어법으로 재해석(브루탈리즘=스탬프 도장, 아르데코=마퀴 안내판).

#### C. 자기참조 dev-tool 카피
- **판별**: "60+ 컴포넌트 / 9 데모 화면 / 0 의존성" 스탯 스트립, "© 2026 · 순수 CSS · 프레임워크 없음" 푸터, "v1.0 프로덕션급 시스템" 배지, "Overview"/"Pricing"/"Empty States" 영문 eyebrow.
- **왜**: 디자인시스템이 자기 스펙을 자랑하는 것은 AI 허브의 시그니처 공식. 제품은 자신을 설명하지 않는다.
- **지침**: 삭제하거나 **세계관 수치로 치환** — 인더스트리얼: 제품 스펙(정격 하중·규격), 아르데코: "SINCE 1925 · EST. WEST EGG", 다크럭셔리: 크래프트 스펙("헤어라인 1px · 골드 7.9:1"), 블루프린트: 표제란(title-block) 형식. 푸터는 테마 어법의 콜로폰/명판/판권면으로.

#### D. raw .md 링크
- **판별**: `grep -rn 'href=".*\.md"' *.html pages/*.html`
- **지침**: 전부 제거 또는 데모 내 소개 섹션/모달로 대체. file://에서 raw 텍스트로 떨어지는 깨진 경험.

### 2-3. 구조 지문 — hero+카드그리드 공식과 균질 리듬

#### A. AI 히어로 공식
- **판별**: `eyebrow 배지 → 그라데이션/대형 h1 → lead(max-width 640px) → CTA 2개 → 4-스탯 스트립`이 그대로 있으면 공식. 가운데 정렬이면 가중.
- **지침**: 히어로는 테마마다 "**포스터/표지/파사드/관제반**"으로 재조판한다(§3-A, §5 유형별 예시). 스탯 스트립은 2-2-C 처방.

#### B. 균질 카드그리드 진열대
- **판별**: `repeat(auto-fill, minmax(320px,1fr))` + 전 카드 동일 패딩·동일 라운드·동일 밀도.
- **지침**: 갤러리 자체는 디자인시스템 허브의 정당한 목적 — **진열을 없애는 게 아니라 위계를 만든다.** 대표 컴포넌트는 2×2 스팬 히어로 셀, 소형 컴포넌트는 조밀한 멀티컬럼, 최소 한 요소는 그리드를 침범(오버랩/rotate/bleed). 테마 어법의 갤러리 재해석: 잡지=목차 조판, 도면=도면 등록 대장, 미술관=타입 스페시멘 도록, 몬드리안 구획, 틸링 윈도우 매니저.

#### C. 균질 섹션 리듬
- **판별**: 모든 섹션이 동일 `padding-block: var(--space-12)` + 동일 section-head 스탬프 복붙.
- **지침**: 섹션 간 **의도된 강약** — 넓게(호흡) → 빽빽(밀도) → 초대형 여백+전폭 룰(전환). 섹션 번호를 eyebrow 소문자에서 **초대형 워터마크 숫자/챕터 표지**로 승격. 중간에 풀블리드 브레이크 섹션(색면 침수, 에디토리얼 밴드, 반전 섹션) 1개 이상 삽입.

### 2-4. 성의 없는 실행 지문

#### A. 이모지 아트워크/아이콘
- **판별**: 상품 갤러리·cmdk 항목·빈 상태에 `📊🗂️✉️⌨️🐰` 등.
- **지침**: 시스템의 기존 일러스트 어휘로 교체 — 각 테마가 이미 증명한 자산을 확산한다(클레이 clay-char, 휘게 코티지 라인아트, 아르데코 시계 다이얼 SVG, 손그림 보물지도). 마스코트/스팟 일러스트 시스템으로 승격. 카와이처럼 이모지가 무드에 맞는 테마도 **자체 SVG 모티프**가 정답(OS 렌더 편차 제거 + 브랜드 각인).

#### B. 동일 장식 복붙
- **판별**: 코너 블롭 4개·radial glow 레시피가 4개+ 페이지에 좌표만 다르게 반복.
- **지침**: **페이지별 씬 변주 시스템** — `data-scene` 속성 또는 페이지 스코프 토큰으로 배경 연출을 페이지 성격에 맞게 차별화(대시보드=데이터가 주인공인 절제 씬, 프라이싱=추천 플랜 뒤 후광, 404=무너진/기울어진 씬). 같은 엔진, 다른 연출.

#### C. 인라인 스타일 폭주
- **판별**: 페이지당 `style=` 50개 이상, 동일 인라인 패턴 반복(테이블 체크박스 해킹, `max-width:1480px` 8회 등).
- **지침**: 반복 패턴을 컴포넌트 변형/유틸 클래스로 승격. **대담화 작업의 선행 위생 조건** — 인라인 그리드는 반응형 미디어쿼리를 무력화하는 실버그이기도 하다.

#### D. "만들어 놓고 안 쓰는" 죽은 자산
- **판별**: 정의만 있고 사용 0건인 토큰/키프레임/유틸 — `--noise-opacity`, `.grid-texture`, `bj-draw`, `clay-wiggle`, `--margin-color`, `--shadow-yellow`, `--z-cursor`, `.grid-modular`, `.span-all` 등 (감사 브리프에 테마별 목록 있음).
- **지침**: **삭제가 아니라 점화가 기본.** 이 죽은 자산들이 대부분 그 테마 대담화의 정답이다(§3 참조). 점화가 불가능하면 삭제.

### 2-5. 모션 지문 — 범용 fade-up

- **판별**: `[data-reveal] { opacity:0; transform: translateY(12~24px) }` + 등차 스태거. 모든 테마에 똑같이 있다.
- **지침**: **테마 물리로 교체**한다. fade-up은 폴백으로만 남긴다. §3-C 참조.

### 2-6. 클리셰 팔레트·장식

- 보라 그라데이션 배경클립 텍스트, Tailwind 원값 유출(`#6366f1` indigo-500 등), GitHub Dark 코드블록 팔레트 차용 — **자기 램프로 환원**. 판별: 페이지 하드코딩 hex를 테마 tokens.css 램프와 대조.
- DNA 금지 기법의 밀수: 멤피스 skeleton의 linear-gradient 샤인, 뉴모피즘의 그라데이션 잉크 — 테마 어법으로 교체(candy-stripe 흐름, pressed 각인).

---

## 3. 채움 원칙 — 프로 디자이너의 4대 무기

> 공통 문법: 아래 기법은 전부 **토큰 경유**로 구현하고, 신규 값은 시맨틱 레이어에 등록한다.
> 모든 모션에 `prefers-reduced-motion` 가드, 모든 장식에 `aria-hidden="true"`.

### 3-A. 대담한 구도 (비대칭 · 오버랩 · 대각선 · 스케일 대비)

**원칙**: 페이지당 최소 1곳, 그리드가 "깨진" 지점을 만든다. 깨는 방식은 테마 어법을 따른다.

1. **초대형 타이포 + bleed/crop** — 히어로 타이틀을 컨테이너 밖으로 밀어낸다.
```css
.hero-display {
  font-size: clamp(4rem, 14vw, 12rem);   /* 기존 --text-7xl(80~120px)에서 한 단계 초과 */
  line-height: 0.95;
  margin-inline: calc(var(--space-6) * -1); /* 컨테이너 침범 */
}
.hero-display .ghost {                     /* 아웃라인 고스트 레이어 */
  -webkit-text-stroke: 1px var(--color-border);
  color: transparent;
  position: absolute; z-index: -1;
}
.hero { overflow: clip; }                  /* 잘려나가는 크롭 — overflow-x:hidden 전역핵 금지 */
```

2. **오버랩(z-교차)** — 요소가 서로를 물고 올라오게 한다. 이동 모션이 금지된 테마(스위스)에서도 **정적 겹침은 합법**.
```css
.hero-figure { grid-row: 1 / 3; z-index: 0; }
.hero-title  { grid-row: 2; z-index: 1; margin-top: calc(var(--space-10) * -1); }
/* 카드가 섹션 경계를 침범 */
.break-out { margin-bottom: calc(var(--space-12) * -1); position: relative; z-index: 2; }
```

3. **비대칭 벤토 위계** — 균등 4칸 stat 그리드 금지. 핵심 지표 하나를 2×2 히어로 셀로.
```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas: "hero hero a b" "hero hero c d";
}
.stat--hero { grid-area: hero; }
.stat--hero .stat__value { font-size: var(--text-6xl); } /* 숫자가 페이지의 '한 방' */
```

4. **대각선·회전** — 섹션 절단(clip-path), 마퀴/테이프 스트립, 스티커 회전.
```css
.section--cut { clip-path: polygon(0 0, 100% 4rem, 100% 100%, 0 calc(100% - 4rem)); }
.sticker { rotate: var(--tilt-ccw, -2deg); }         /* 이웃끼리 --tilt 값 교차 */
.tape-strip { rotate: -45deg; width: 140vw; margin-inline: -20vw; } /* 풀블리드 대각 띠 */
```

5. **세로쓰기·조판 변주** — 한글 테마의 무기.
```css
.vertical-label { writing-mode: vertical-rl; }        /* 바우하우스 포스터, 보태니컬 세로 라벨 */
.indent-line2 { padding-inline-start: 18%; }          /* 두 번째 줄 비대칭 들여쓰기 */
```

**금지선**: 구도 파괴가 가독성·키보드 순서·반응형을 깨면 안 된다. 오버랩 요소는 모바일에서 스택 폴백을 반드시 정의.

### 3-B. DNA에 맞는 분위기 배경 (질감 · 패턴 · 깊이 · 빛)

**원칙**: "밋밋한 단색 배경 = AI 지문". 단, 무엇을 깔지는 DNA가 결정한다. 이미 각 테마에 씨앗(토큰)이 있다 — 새로 발명하지 말고 **점화**하라.

1. **노이즈/그레인** (터미널, 다크럭셔리, 미드센추리, 리소, 휘게-리넨) — SVG feTurbulence data-URI, 초저알파.
```css
.atmosphere::after {
  content: ""; position: fixed; inset: 0; pointer-events: none;
  background-image: var(--grain-texture);   /* data:image/svg+xml;…feTurbulence */
  opacity: var(--grain-opacity, 0.03);       /* 테마/다크모드별 노브 */
  z-index: var(--z-atmosphere);
}
```
2. **구조적 질감** (그리드 금욕 테마의 합법 어휘) — 재단선/크로스헤어/치수선/모눈. 도트·텍스처가 금지된 스위스·모노크롬에서도 1px 선은 DNA 정합.
```css
.crop-mark::before, .crop-mark::after {
  content: ""; position: absolute; width: 16px; height: 1px;
  background: var(--color-border-subtle);
}
.graph-bg { background-image:
  linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
  background-size: 24px 24px; }
```
3. **깊이·빛** — 테마 광학으로: 오로라 스크롤 색상 시프트(04), 촛불 halo(15), 선버스트 fixed 120vw(12), 밤하늘 별사탕(16 다크), 페이지별 색 온도(07 채널). 공통 패턴:
```css
/* 섹션 스코프 분위기 노브 — 페이지별 변주의 기반 */
[data-scene="midnight"] { --fx-sun: 0; --fx-star-opacity: .8; }
[data-scene="dawn"]     { --fx-sun: 1; --fx-grid-floor: .3; }
```
4. **배경 레이어 계약**: `pointer-events:none` + `aria-hidden` + 콘텐츠 대비 재검증(그레인이 텍스트 위에 깔리면 실측 대비가 떨어진다 — 리소 감사에서 확인). 라이트/다크 각각 오버라이드 필수(라이트에서 소멸하는 흰 라인 텍스처 사례 있음).

### 3-C. 고임팩트 모션 — 시그니처 모션 시스템

**원칙**: 테마당 **시그니처 모션 1문법**을 정하고, 로드 스태거·스크롤 리빌·호버가 모두 그 문법의 변주가 되게 한다. "어느 테마에나 있는 fade-up"을 그 문법으로 대체한다.

1. **페이지 로드 스태거** — 방향·물리를 테마화:
```css
/* 예: 스탬프(브루탈리즘/코믹/인더스트리얼) — 위에서 '쾅' 찍힘 */
@keyframes stamp-in {
  0%   { opacity: 0; transform: scale(1.18) rotate(-2deg); }
  70%  { opacity: 1; transform: scale(.98); }
  100% { transform: scale(1); box-shadow: var(--shadow-flat); }
}
/* 예: 선 드로잉(블루프린트/스위스/손그림) — 테두리가 그려진 뒤 내용 등장 */
.card[data-reveal]::before { transform: scaleX(0); transform-origin: left;
  transition: transform .5s var(--ease-out); }
.card[data-reveal].is-in::before { transform: scaleX(1); }
/* 예: 2도 인쇄(리소) — 핑크판 어긋남 → 블루판 정합 */
/* 예: 잉크 마름(에디토리얼) — blur(2px)+opacity → 선명 */
```
2. **스크롤 트리거** — IntersectionObserver 1개를 공용 엔진으로, 효과만 data-속성으로:
```js
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
}), { threshold: 0.2 });
document.querySelectorAll("[data-reveal]").forEach(el => {
  if (REDUCED) { el.classList.add("is-in"); return; }  /* 즉시 완성 상태 */
  io.observe(el);
});
```
3. **놀라움 있는 hover** — 명도 스왑을 넘어 물리로: 프레스(그림자 붕괴), 스쿼시&스트레치(`scale(1.06,.9)`), 색수차 더블 섀도(`-2px 0 0 magenta, 2px 0 0 cyan`), 빛 스윕(::after gradient 이동), 헤어라인 좌→우 성장, 잉크 필(`background-size 0%→100%`).
```css
.btn--primary { background-image: linear-gradient(var(--color-ink), var(--color-ink));
  background-size: 0% 100%; background-repeat: no-repeat;
  transition: background-size .2s var(--ease-out); }
.btn--primary:hover { background-size: 100% 100%; }
```
4. **모션 안전 계약** (전 테마 공통 헌법):
   - `prefers-reduced-motion: reduce` → 즉시 완성 상태(숨김 상태로 방치 금지)
   - 3Hz 초과 플래시 금지(광과민), 반복 스트로브 금지 — 글리치·플리커는 1회성
   - JS 실패 시 콘텐츠가 opacity:0으로 남지 않게 `html.js [data-reveal]` 게이트 필수
   - 이동 모션 금지 테마(스위스)에서는 페이드·선긋기·밑줄 슬라이드만

### 3-D. 시그니처 모먼트 설계법

**정의**: "이 테마는 ___한다"라고 한 문장으로 기억되는 장면 1개. 감사가 찾아낸 각 테마의 씨앗을 승격한다.

설계 절차:
1. **씨앗 찾기** — 이미 있는 최고 자산(대개 404, 모달, 버튼 물리, 죽은 토큰)을 찾는다. 예: 클레이 404 캐릭터, 브루탈 modal-slam, 카와이 burst(), 리소 data-reprint.
2. **시스템 승격** — 1회성 장식을 컴포넌트/전역 문법으로: modal-slam → 전 시스템 stamp-in, clay-char → 표정 변형 마스코트, burst 사각 파티클 → 하트/별 모티프 파티클.
3. **클라이맥스 배치** — 히어로 오프닝, 404, 온보딩 완료, 테마 토글 중 1~2곳에 최대 강도로. 테마 토글은 특히 좋은 무대다: 촛불 점등(15), 도형 모핑 원↔사각(11), 나이프 스위치(19), View Transition 원형 잠식(14).
4. **한 방 검증 질문** — "스크린샷 1장으로 이 테마를 다른 29개와 구별할 수 있는가? 3초 시연으로 '오' 소리가 나는가?"

---

## 4. 하드 규칙 — 전 테마 공통 구현 계약 (감사 반복 결함의 예방)

대담화 작업 중 아래를 위반하면 리젝이다.

1. **SVG 색은 절대 presentation attribute의 var()로 지정하지 않는다.**
```html
<!-- ❌ 렌더 깨짐 (stroke 소실 / fill 검정) -->
<path stroke="var(--color-primary)" />
<stop stop-color="var(--magenta-400)" />
<!-- ✅ style 속성 또는 currentColor -->
<path style="stroke: var(--color-primary)" />
<g style="color: var(--color-primary)"><path stroke="currentColor" /></g>
<stop style="stop-color: var(--magenta-400)" />
<!-- ✅ 최선: CSS 클래스에서 지정 (charts.css 방식) -->
```
2. **한글 폰트 스택 순서**: `라틴 폰트 → 한글 무드 폰트 → Noto Sans/Serif KR → system-ui → generic`. `system-ui`/`-apple-system`이 한글 폰트보다 앞이면 macOS에서 무드 폰트가 영원히 미적용(8개+ 테마에서 확인된 버그).
```css
--font-display: "Space Grotesk", "Black Han Sans", "Noto Sans KR", system-ui, sans-serif;
```
3. **한글 웨이트 정합**: 헤딩이 800/900을 쓰면 해당 한글 웨이트를 실제로 로드하거나(`Gothic A1 800`), 단일 웨이트 폰트(Jua, Do Hyeon, Black Han Sans)에는 `font-synthesis-weight: none` + 크기/자간으로 위계 보정. faux-bold 방치 금지.
4. **한글 타이포 특칙**: 이탤릭 금지(faux-oblique 왜곡 — 색/굵기 강조로 대체), `small-caps` 무효(자간+크기 보정으로 대체), 라틴 기준 0.3em급 자간은 한글에서 0.15~0.2em으로 별도 토큰.
5. **폰트 로드 단일화**: @import 이중화(tokens.css+base.css) 금지 — 한 곳 또는 HTML `<link>`로 통합. 미사용 패밀리·웨이트 제거.
6. **다크모드 FOUC 방지**: `<head>` 최상단 3줄 동기 스니펫으로 저장 테마 선적용.
```html
<script>
  try { var t = localStorage.getItem("theme");
    if (t) document.documentElement.dataset.theme = t;
    else if (matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.dataset.theme = "dark"; } catch(e) {}
</script>
```
7. **ARIA 패턴 통일**: segmented/토글 그룹은 `role="radiogroup"`+`role="radio"`+`aria-checked` 또는 `aria-pressed` 단일화. plain button에 `aria-selected` 금지. rating은 radio 패턴 또는 읽기전용 정적 표시(별점 수치·시각·aria 3자 일치). 정렬 th는 내부 `<button>`으로 키보드 조작 보장.
8. **오버레이 계약**: 닫힘 상태 `visibility:hidden`(투명 클릭 차단 버그 예방), 포커스 트랩+복원, ESC, 스크림. 모바일 내비는 실제로 열리는지 375px에서 검증(죽은 버거 버튼·버튼 부재가 6개+ 테마에서 확인).
9. **토큰 규율**: 신규 스타일도 시맨틱 토큰만 소비. 페이지 인라인 hex·Tailwind 원값·타 팔레트 차용 금지. 신규 효과는 토큰(`--glass-sweep`, `--grain-opacity`)으로 등록해 시스템 전파.
10. **반응형**: 인라인 `grid-template-columns` 금지(미디어쿼리 무력화의 주범) — 클래스로 승격. `100vh` 대신 `100dvh`.

---

## 5. 테마 DNA 유형별 적용 가이드

30개 테마를 4유형으로 묶고, §3의 무기를 유형별로 번역한다. (테마별 세부는 각 브리프 §5가 우선)

### 유형 1 — 그래픽 강렬형
*01 네오브루탈리즘 · 02 스위스 · 08 베이퍼웨이브 · 10 멤피스 · 11 바우하우스 · 22 코믹 팝아트*

- **구도**: 이 유형의 본질은 구도의 무정부성/포스터성인데 감사 결과 전원이 "컴포넌트만 요란하고 레이아웃은 얌전"했다. → 초대형 타이포 bleed, 색면 오버랩, 대각선 절단, 만화 판형(크기 제각각 패널+breakout), 몬드리안 구획을 **기본값**으로.
- **배경**: 플랫 색면 침수(섹션 통째 원색), 지그재그/물결 clip-path 경계, 하프톤 비네트, 모듈러 제도 그리드. 그라데이션·블러 금지 테마가 많으므로 질감은 패턴·색면·선으로만.
- **모션**: 하드 물리 — 스탬프/슬램/프레스(blur 0 그림자 유지), 1회성 글리치, 컨페티/의성어 버스트, 마퀴 스트립. 오버슈트 easing.
- **시그니처 모먼트 예**: 브루탈=마퀴+스탬프, 멤피스=컨페티 팝 파티클, 코믹=한글 의성어 버스트("쾅!", "펑!"), 스위스=rule-draw(헤어라인이 그어지는 질서), 바우하우스=원↔사각 모핑 테마 토글.

### 유형 2 — 소재 질감형
*04 글래스 · 05 뉴모피즘 · 06 클레이 · 09 Y2K 아쿠아 · 15 휘게 · 16 카와이 · 23 손그림*

- **구도**: 재질의 물성으로 깬다 — 유리판이 글자를 굴절시키며 겹침(backdrop-filter), 배경에 조각된 초저대비 릴리프 지형, 벽에 붙인 콜라주(회전+테이프+겹침), 떠 있는 위젯 클러스터.
- **배경**: 재질 그 자체 — 리넨 직조 불규칙화, 별사탕 밤하늘, 커스틱 수면 빛, 마진 낙서/커피 얼룩(쓰던 공책), 눌러 새긴 기하 릴리프. 재질 노브(`--grain-opacity`, `--texture-*`)를 섹션 스코프로 변주.
- **모션**: 소재의 물리 시뮬레이션 — 스쿼시&스트레치(점토/젤리), 스프링백 오버슈트, 리플(수면), 빛 스윕+색수차 엣지(유리), 포인터 추적 gloss, draw-in(펜 선). "만지고 싶은 UI"가 목표.
- **시그니처 모먼트 예**: 클레이=마스코트 승격+지문 남는 dent, 뉴모피즘=파인 그릇 속 구슬 404, 글래스=스크롤 오로라 시프트+404 유리 굴절, 휘게=촛불 점등 테마 토글, 카와이=모티프 파티클 버스트+커서 별가루.

### 유형 3 — 인쇄·서적형 (예외 규칙 적용)
*03 에디토리얼 · 12 아르데코 · 13 다크럭셔리 · 17 보태니컬 · 21 리소그래프 · (+02 스위스, 20 블루프린트 겸업)*

- **방향**: 크림·세리프·룰은 유지·강화. 끌어올릴 것은 **조판의 밀도와 인쇄 물성** — "AI 문서"와 "프로 인쇄물"의 차이는 목차 조판(점선 리더+페이지 번호), 콜로폰, 도판 넘버링(Tab. XVII), 드롭캡·풀쿼트·마지널리아, 표본 라벨·수납 도장, 재단선·레지스트레이션 마크, 캘리브레이션 바, 에디션 넘버링("№ 047/200") 같은 **업계 관례 어휘의 유무**다.
- **구도**: 12컬럼을 실제로 깨기 — column-span 풀쿼트, 워터마크 초대형 넘버(5~8% 오퍼시티), 헤드라인이 도판 위로 겹침, 양쪽 펼침면+거터, 비대칭 4/8 분할.
- **배경**: 종이의 세월 — 그레인+비네팅(바램), 데클 엣지, 얼룩 링, 야간 인쇄소/황혼 다크 모드 서사.
- **모션**: 잉크의 물성 — 잉크 마름(blur→선명), 형광펜/금박 스윕, 판이 순서대로 찍히는 2도 리빌, 매달린 라벨 sway, 펜 드로잉 draw-in. 전부 조용하고 우아하게.
- **시그니처 모먼트 예**: 에디토리얼=창간호 표지+목차, 아르데코=금박 티켓 프라이싱+선버스트 파사드, 보태니컬=표본 대지 히어로+세로쓰기 한글 라벨, 리소=misregister 오버랩 히어로+에디션 도장.

### 유형 4 — 테크·터미널형
*07 사이버펑크 · 13 다크럭셔리(다크 정본 겸업) · 14 미니멀 모노크롬 · 19 인더스트리얼 · 20 블루프린트*

- **방향**: 영문 시스템 라벨·로그 픽션은 DNA — 지우지 말고 **세계관 밀도를 균일하게**(약한 페이지=pricing·onboarding·settings를 강한 페이지 수준으로). 본문·aria는 한국어.
- **구도**: 기능이 곧 구도 — 틸링 윈도우 매니저 배치(pane 좌표 라벨), 관제반 벤토(주 계기 2×2 + 위성 게이지), 도면 등록 대장 테이블, 반전 섹션(순흑 전시실).
- **배경**: 장비의 물성 — CRT 베젤+노이즈+페이지별 색 온도, 체커 플레이트/브러시드 메탈 바닥, 청사진 감광 라인 질감, 모눈+좌표 룰러. 모노크롬(14)은 헤어라인·명도 계단만.
- **모션**: 기계 스냅 — 부팅 시퀀스/타이핑/스크램블, 명령행 페이지 전환(`> cd ~/pages/…`), 게이지 바늘 jitter, LED 명멸, 나이프 스위치, 선 드로잉 리빌, 커서 십자선+좌표 판독. 광과민 3Hz 규칙 엄수.
- **시그니처 모먼트 예**: 사이버펑크=CRT 베젤+명령행 내비, 인더스트리얼=차단기 레버 토글+스탬프 CTA, 블루프린트=제도 십자선 커서+치수선이 여백을 측정, 모노크롬=흑백 원형 잠식 테마 전환.

---

## 6. 작업 순서 템플릿 (테마당)

1. **P0 위생**: SVG var() 전수 교체 → 한글화(pages+app.js) → 폰트 스택 순서/죽은 임포트 → FOUC → 죽은 컨트롤(버거/닫기 버튼) → 인라인 그리드 반응형.
2. **P1 결함**: 테마 브리프 §4의 ARIA/대비/키보드 항목.
3. **P2 탈지문**: 자기참조 스탯·raw .md 링크·이모지·filler 데이터·복붙 장식 제거(§2).
4. **P3 대담화**: 분위기 점화(죽은 토큰 회수) → 히어로 재조판 → 시그니처 모션 교체 → 시그니처 모먼트 1개 완성(§3, §5).
5. **검증**: 라이트/다크 × 375/768/1280 → reduced-motion → 키보드 전 경로 → 대비 실측(변경분) → "스크린샷 1장 구별 테스트".

---

## 부록 — 빠른 판별 grep 세트

```bash
# 죽은 세리프 임포트
grep -rn "Noto+Serif+KR" --include="*.css" .
# SVG var() 버그
grep -rn 'stroke="var(\|fill="var(\|stop-color="var(' --include="*.html" .
# 영문 페이지
grep -l 'lang="en"' pages/*.html
# raw md 링크
grep -rn 'href="[^"]*\.md"' --include="*.html" .
# 무효 ARIA (plain button aria-selected)
grep -rn 'aria-selected' --include="*.html" . | grep -v 'role="tab"\|role="option"'
# 인라인 그리드 (반응형 무력화)
grep -rn 'style="[^"]*grid-template-columns' --include="*.html" .
# 자기참조 스탯
grep -rn '컴포넌트\|의존성 0\|프레임워크 없음' --include="*.html" . | grep -i 'stat\|hero'
```
