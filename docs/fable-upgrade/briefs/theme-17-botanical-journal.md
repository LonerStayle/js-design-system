# 감사 브리프 — theme-17-botanical-journal (보태니컬 저널)

> 감사일: 2026-07-04 · 감사 범위: README.md, CHECKLIST.md, tokens.css, semantic.css, base.css, components/* (7파일), app.js, index.html + pages/dashboard.html·pricing.html·404.html 정밀, 나머지 페이지 grep 스캔
> HTML 파일 수: **10개** (index.html + pages/ 9개)

---

## 1. DNA 요약

**정체성**: 빅토리아 시대 압화(押花) 야외 채집 일지 — *Herbarium digitalis*. 크림 양피지(`--parchment-100 #f4eedf`) 위에 세이지→이끼 그린(`--green-500 #8a9a6b` / `--green-600 #6e7a52`)과 세피아 잉크(`--ink-600 #4a3f2e`), 머스터드 꽃가루(`--bloom-500`)·마른 장미(`--rose-500`) 악센트. **이 테마는 "예외 규칙" 대상**: 인쇄·서적 미학(크림 종이, 올드스타일 세리프, 얌전한 잉크 헤어라인)이 DNA 그 자체이므로 이 표현들은 AI 지문이 아니라 보존·증폭 대상이다.

**명시된 규칙** (README.md:16-28, tokens.css 주석):
- 네온·순수 검정·차가운 회색 **금지** — 그림자조차 갈색 톤(`tokens.css:201-209` "never neutral grey")
- 라디우스 4–8px 소형 고정("Pressed corners, not bubbles", tokens.css:184-190)
- 상태 표시는 색 + 아이콘 + 텍스트 3중(README.md:25)
- 장식 모티프는 전부 `aria-hidden`(README.md:23)
- 모션은 "책장 넘기듯" 조용하게(`--ease-standard`, tokens.css:240-248), `prefers-reduced-motion` 전면 준수
- 잉크-온-양피지 대비 4.5:1 이상 (semantic.css:8-9에 계산치 주석: ink-600≈8.9:1, ink-500≈6.7:1, green-700≈5.5:1)

**시그니처 장치**: 펜 선 식물 모티프 데이터URI 토큰(`--motif-leaf/fern/flower/vine/sprig`, tokens.css:99-107), 표본 라벨 `.specimen-tag`(끈 구멍 + -1.2° 기울기, display.css:75-88), 이중 잉크 룰(`.rule-double`), feTurbulence 종이 결(`--paper-texture`, tokens.css:110), 이탤릭 학명 `.binomial`, 스몰캡스 라벨.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **모티프의 토큰화 + 다크 재염색 시스템** — 식물 일러스트 5종을 데이터URI CSS 토큰으로 정의하고(tokens.css:99-107), 다크 테마에서 스트로크를 크림색으로 통째로 재정의(semantic.css:156-157). 코너 스프리그/워터마크/룰 장식이 전부 이 토큰을 소비(base.css:293-313). 장식이 시스템의 1급 시민인 드문 구조 — 이 파이프라인 위에 모티프 종류·활용처를 2~3배 늘려도 비용이 거의 없다.
2. **종이 물성 스택의 완성도** — 전역 종이 결 오버레이(base.css:34-45, multiply/screen 블렌드 테마별 전환) + 갈색 톤 그림자 5종 + `--shadow-paper`(흰 종이 모서리 하이라이트, tokens.css:209) + 상단 비네트(semantic.css:80) + 괘선 종이 `.ruled`(base.css:282-291). "분위기 없는 밋밋한 배경"과 정반대 지점에 이미 서 있다. 여기서 한 단계 더(데클 엣지, 얼룩, 테이프)로 밀 것.
3. **카피라이팅의 세계관 일관성** — 404 "This page has gone to seed"(404.html:75), 빈 받은편지함 "Clear as a spring morning"(404.html:158), 에러 "We couldn't grow that"(404.html:178), 토스트 제목 "무언가 시들었습니다"(index.html:453). filler가 아니라 세계관 안에서 쓴 카피다. **문제는 이 좋은 카피가 9개 페이지에서 전부 영어라는 것** — 이 감성 그대로 한국어로 옮기는 게 4번 항목의 핵심 과제.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

⚠️ 먼저 구분: 크림 종이 톤·세리프 헤딩·잉크 헤어라인·문서적 레이아웃은 **이 테마의 DNA이므로 지문이 아니다.** 아래는 DNA와 무관한 진짜 지문.

### 3-1. [치명] pages/ 9개 전부 100% 영어 — 국내용 프로젝트에서 최악의 지문
- 증거: `index.html`만 `lang="ko"`(한글 2,224자), **pages/ 9개 전부 `lang="en"` + 한글 0자** (dashboard.html:2, pricing.html:2, 404.html:2, inbox·kanban·onboarding·product·profile·settings 동일)
- tokens.css:11에서 한글 폰트 4종(Gowun Batang, Nanum Myeongjo, Noto Sans/Serif KR)을 로드해 놓고 9개 페이지에서 단 한 글자도 쓰지 않는다 — 죽은 페이로드
- app.js의 UI 문자열도 영어: 테마 토글 라벨 `'Dusk'/'Daylight'`(app.js:28), cmdk 폴백 토스트 `'Command run'`(app.js:250) — 한글 허브(index.html)에서 ⌘K로 임의 명령 실행 시 영어 토스트가 뜬다
- **조치**: 9개 페이지 전면 한글화(`lang="ko"`), 단 학명(binomial)·"Herbarium digitalis" 같은 라틴어는 세계관 요소로 유지. index.html의 카피 온도("압화 및 분류 완료", "무언가 시들었습니다")를 기준 삼아 채집 일지 말투로 통일. app.js 문자열 한글화('황혼'/'주간', '명령 실행됨')

### 3-2. [중] 균질·예측 가능한 섹션 리듬 (진열대 나열)
- index.html의 모든 섹션이 `eyebrow → h2 → p.text-muted → grid` 4단 공식 반복(index.html:144-149, 224-229, 257-262, 284-285, 315-316, 401-402, 441-442, 463-464, 505-506, 519-520). 대칭 그리드(`grid-3`/`grid-4`)에 컴포넌트를 무맥락 진열
- pages 카드 9장도 완전 동일한 카드 반복(index.html:521-531) — 번호만 다른 hero+카드그리드 공식
- **조치**: 5번 항목의 "도판(Plate) 시스템"으로 재구성 — 섹션마다 구도를 다르게(비대칭 2단, 오버랩 표본 라벨, 마지널리아)

### 3-3. [중] dev-tool 노출 및 관성 흔적
- index.html:63 내비게이션에 `href="README.md"`(가이드), index.html:545 푸터에 `CHECKLIST.md` 링크 — 프로덕션 UI에서 raw 마크다운 파일로 직행. 404.html:44에도 `../README.md`
- pricing.html:23 `var(--radius-full, 999px)`, pricing.html:30 `var(--text-3xl, 2rem)` — 존재하지 않는 토큰명 + 폴백(실제 토큰은 `--radius-pill`, `--text-3xl`은 존재하는데도 폴백을 담). 자기 토큰 체계를 안 믿는 전형적 생성 흔적
- dashboard.html:231-232 `<span class="label">Pressings by month</span>` 바로 아래 `<h2>Pressings by month</h2>` — 라벨과 제목이 동일 문자열 중복(295-296도 동일 패턴 "Collection by family" 2회)
- 분위기 장치를 정의만 하고 방치: `@keyframes bj-draw`(base.css:340)·`bj-sway`(base.css:342) **사용처 0곳**, `--ink-blot`(semantic.css:79) **사용처 0곳**, `.watermark`(base.css:308-313)는 inbox 1곳뿐 — "만들어는 놨다" 지문

---

## 4. 프로덕션 결함

### 4-1. [치명] SVG stroke/fill HTML 속성에 var() 직접 사용 — 알려진 렌더 깨짐 버그, 50+건
`style=""` 속성이나 `currentColor`로 전환 필요. 전체 목록(grep `stroke="var(|fill="var(` 기준):
- **index.html**: 101-103, 107, 110 (히어로 플레이트), 122 (배경 잎), 411 (카드 미디어)
- **pages/pricing.html**: 95, 96, 334, 335 (히어로/CTA 스프리그)
- **pages/profile.html**: 165, 172, 177, 181, 184 (커버 일러스트 전체)
- **pages/product.html**: 218, 222, 232, 321, 533, 550, 567, 584, 601, 618 (제품 갤러리·관련상품 일러스트 전부)
- **pages/inbox.html**: 391 (별표 아이콘)
- **pages/onboarding.html**: 353-354, 358-359 (완료 일러스트)
- **pages/404.html**: 58, 61, 63, 67, 69-70, 114-118, 134-136, 152-154, 174 (404 히어로 + 빈 상태 4종 전부)
- **pages/settings.html**: 207, 348
- 참고: 같은 파일들의 `stroke="currentColor"` 사용처는 정상 — var() 직접 참조만 교체

### 4-2. [상] 스타일 미정의 클래스 — `.footer`가 공유 CSS에 없음
- `.footer`는 index.html:43과 pricing.html:54, settings.html에만 페이지 로컬 `<style>`로 정의. **404.html:190, kanban.html, profile.html, product.html은 정의 없이 `class="footer"` 사용** → 이 4개 페이지 푸터는 상단 이중 룰·패딩 없이 맨몸으로 렌더. 조치: `.footer`를 base.css로 승격

### 4-3. [상] 잘못된 HTML — `<hr>` 안에 콘텐츠
- 404.html:96-98: `<hr class="rule-sprig">` + SVG + `</hr>`. hr은 void 요소라 SVG는 DOM에서 밖으로 밀려나고 `.rule-sprig`의 flex 구조(::before/::after 사이 svg)가 깨짐 → 스프리그 없는 빈 줄 + 고아 SVG. `<div class="rule-sprig" role="separator">`로 교체

### 4-4. [상] 키보드 접근성 구멍
- **드롭존**: `role="button" tabindex="0"`(index.html:390)인데 app.js:470-476에 keydown 핸들러 없음 → Enter/Space로 파일 선택 불가
- **cmdk 항목**: `<div class="cmdk__item" href="...">`(index.html:587-594, dashboard.html:539-545) — div에 href 속성(무효 HTML), 포커스 불가, `role="option"`/`aria-activedescendant` 없음. 마우스와 Enter(JS)로만 동작
- **칸반 DnD**: HTML5 드래그 전용(app.js:492-), 키보드 대체 수단 없음(CHECKLIST.md:108-109가 터치 폴백만 언급)
- **레이팅**: `aria-label="2"`, `"3"`(index.html:381-384) — "잎 2개" 등 의미 있는 라벨 필요

### 4-5. [중] 대비 경계선 위반
- `--color-text-faint` = ink-400 `#7c6b51` on parchment-100 `#f4eedf` ≈ **4.4:1** — 11px `.bars__label`(charts.css:28), 드롭존 캡션(index.html:393), 푸터 등 소형 텍스트에 사용 중. AA(4.5:1) 미달. ink-500으로 올리거나 faint 용도를 장식으로 한정할 것
- index.html:23 `.ramp__swatch` 흰 텍스트 `rgba(255,255,255,0.85)`가 green-400/500 스와치 위에서 대비 부족(10px)

### 4-6. [중] 토큰 우회 하드코딩
- settings.html:510-514 액센트 스와치 `#6b7d4a #c69a3a #b07a78 #7a6446 #5a6f78` — 전부 램프에 없는 임의 색(green-600은 `#6e7a52`인데 `#6b7d4a` 사용). 토큰 참조로 교체
- settings.html:474-488 테마 카드 스와치 `#f4eedf/#181d12/#cdd9bf/#3c4a2c` 하드코딩(앞 2개는 토큰 존재)
- semantic.css:125-126 `--color-hairline` 중복 선언(`#4a543600` 찌꺼기 줄 — 삭제 필요)
- display.css:169 `#11150c` 하드코딩(다크 코드블록 — 허용 가능하나 토큰화 권장)

### 4-7. [중] 차트 접근성 비대칭
- 도넛은 `role="img"` + aria-label 제공(dashboard.html:301) — 좋음. 반면 막대 차트 3개는 `aria-hidden="true"`(dashboard.html:243, 257, 271)로 데이터 자체가 스크린리더에서 증발. `visually-hidden` 데이터 표 또는 role="img"+label 요약 추가
- 진행률 바에 `role="progressbar"`/`aria-valuenow` 전무(dashboard.html:319-331, index.html:456)

### 4-8. [하] 기타
- index.html:63·545, 404.html:44 raw `.md` 링크(3-3과 중복 — UI에서 제거하거나 안내 페이지로)
- 폰트 @import 이중화: tokens.css:11(한글 4종) + base.css:9(라틴 3종) — 페이지당 2회 왕복. 통합 권장
- dashboard.html:265 주간 뷰 8번째 막대 `height:0%` + 라벨 "—" — 7일 데이터를 8칸 틀에 억지로 맞춘 흔적

---

## 5. 대담화 기회 (프로 디자이너의 "한 방")

1. **히어로를 진짜 '표본 대지(mounting sheet)'로** — 지금 히어로(index.html:98-119)는 원 안에 식물 SVG를 얌전히 놓은 수준. 실제 헤르바리움 시트 문법을 전부 동원할 것: 식물을 고정하는 **린넨 테이프 조각**(반투명 흰 사선 스트립, CSS gradient + 미세 회전), 우하단 **채집 라벨**(이미 있는 .specimen-tag 확대), 붉은 **수납 도장**(accession stamp — `--rose-600` 원형 스탬프, 잉크 번짐 텍스처, 15° 회전), 연필 필기체 주석("압화 №17, 상태 양호"), 시트 모서리 접힘. 카드 그리드가 아니라 A2 대지 한 장이 화면을 채우는 구도로.
2. **잠자는 모션 자산 깨우기 — 잉크 드로잉 애니메이션** — `bj-draw` 키프레임(base.css:340)이 정의만 되고 미사용. 히어로 플레이트·404 일러스트·빈 상태 SVG의 path에 `stroke-dasharray` + `bj-draw`를 걸어 **페이지 진입 시 펜이 식물을 그려나가는** 시그니처 모션으로. `.specimen-tag`에는 `bj-sway`(base.css:342)를 transform-origin 상단(끈 구멍)으로 걸어 매달린 라벨이 살짝 흔들리게. reduced-motion 폴백은 기존 패턴 재사용
3. **아카이브 물성 한 단계 더 — 얼룩·데클·세월** — 미사용 `--ink-blot`(semantic.css:79)을 실제로 배치: 섹션 모서리에 잉크 번짐, 커피/물 얼룩 링(radial-gradient 링 1~2개, opacity 0.04), 카드 상단에 **데클 엣지**(mask-image 불규칙 톱니), 오래 눌린 꽃 자국(모티프를 blur+multiply로 종이에 배어든 듯). `.watermark`(inbox 1곳)를 대시보드·프로필에도 확산
4. **저널 스프레드 비대칭 레이아웃 + 마지널리아** — index 허브의 4단 공식(3-2)을 깨고: 컴포넌트 섹션을 **양쪽 펼침면**(중앙 거터 그림자)으로, 여백 칼럼에 손글씨풍 **마지널리아**(회전된 주석, 별표, 화살표, "cf. Tab. VII" 참조), 표본 라벨이 카드 경계를 **가로질러 겹치게**(-1.2° 기울기 활용). 섹션 헤더는 `Tab. XVII` 식 **로만 숫자 도판 넘버링**으로 — 진열대가 아니라 도감의 도판(plate)이 된다
5. **한글 세로쓰기 표본 라벨** — 한글화(3-1)와 결합해 `.specimen-tag`에 `writing-mode: vertical-rl` 변형 추가: 옛 식물도감·한적(韓籍) 라벨 느낌의 세로 한글 + 가로 라틴 학명 병기. 국내용 테마만이 가질 수 있는 차별점이며 이 테마의 '기억에 남을 한 방' 후보
6. **다크(황혼) 테마의 밤 채집 연출** — 다크가 현재 라이트의 색만 바꾼 수준. 달빛 비네트(상단 차가운 크림 글로우), 모티프 스트로크에 은은한 인광(text-shadow 아님, drop-shadow 1px), 반딧불 점(bloom-300 2~3개 미세 깜빡임, reduced-motion 시 정지) — "밤에 등불 켜고 쓰는 일지"로 서사 부여

---

## 6. 한글 폰트 페어링

**현재 상태** (tokens.css:11, 122-125):
- `@import`: Gowun Batang(400/700) + Nanum Myeongjo(400/700/800) + Noto Sans KR(400/500/700) + Noto Serif KR(400/500/600/700)
- `--font-display`: Cormorant Garamond → EB Garamond → (로컬 세리프) → **"Gowun Batang" → "Noto Serif KR"** → serif
- `--font-body`: EB Garamond → (로컬 세리프) → **"Nanum Myeongjo" → "Noto Serif KR"** → serif
- `--font-label`: EB Garamond → Georgia → **"Nanum Myeongjo" → "Noto Serif KR"** → serif
- `--font-mono`: IBM Plex Mono → **"Noto Sans KR"** → monospace

**판정: 보존.** 이 테마는 세리프가 DNA 그 자체(예외 규칙 대상)이므로 서재풍 세리프가 '억지'가 아니다. 고운바탕(디스플레이의 붓 감성)·나눔명조(본문 가독)는 압화 일지 무드와 정합. 교체 불필요.

**단, 구현 시 3가지 주의**:
1. **현재 한글 폰트는 index.html에서만 실제 렌더됨** — pages/ 한글화(3-1) 완료 전까지는 페어링이 사실상 미검증. 한글화 후 디스플레이 크기(--text-4xl 이상)에서 고운바탕 굵기(700)가 Cormorant 600 대비 무겁지 않은지 확인
2. **이탤릭 함정**: `.binomial`(base.css:117)과 이탤릭 강조가 한글에 걸리면 faux-oblique로 왜곡됨. 학명은 라틴 문자로 유지하고, 한글에는 이탤릭 대신 `--color-text-muted` + 고운바탕 전환으로 목소리를 구분할 것
3. **스몰캡스 무효**: `.label`/`.btn`/`.eyebrow`의 `font-variant: small-caps`(base.css:120-130, buttons.css:18)는 한글에 효과 없음 → 한글 라벨은 `letter-spacing: var(--tracking-widest)` + 크기 축소(`--text-2xs~xs`) + 명조로 별도 보정 규칙 필요 (`:lang(ko)` 또는 한글 라벨 전용 클래스)

---

## 구현 우선순위 요약

| 순위 | 작업 | 근거 항목 |
|---|---|---|
| 1 | pages/ 9개 전면 한글화 + app.js 문자열 한글화 | 3-1 |
| 2 | SVG var() 50+건 → style/currentColor 치환 | 4-1 |
| 3 | `.footer` base.css 승격, hr 마크업 수정, semantic.css 중복 선언 제거 | 4-2, 4-3, 4-6 |
| 4 | 키보드 a11y(드롭존/cmdk/레이팅) + faint 대비 + 차트 대체텍스트 | 4-4, 4-5, 4-7 |
| 5 | 표본 대지 히어로 + bj-draw/bj-sway 활성화 + 얼룩·데클 물성 | 5-1, 5-2, 5-3 |
| 6 | 도판 넘버링·마지널리아 레이아웃 + 세로쓰기 라벨 + 황혼 연출 | 5-4, 5-5, 5-6 |
