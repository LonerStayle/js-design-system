# theme-06-claymorphism — 재고도화 감사 브리프

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-06-claymorphism/`
- 파일 규모: HTML 10개(index + pages 9), CSS 12개(tokens/semantic/base/theme + components 9), app.js 721줄
- 감사 범위: README.md, CHECKLIST.md, tokens.css, semantic.css, base.css, theme.css, index.html 전체 + pages/dashboard.html·product.html·404.html 전체 + kanban/onboarding/pricing 부분 + components/ grep 스캔 + app.js 스캔

---

## 1. DNA 요약

**"말랑·통통·생기" — 점토처럼 부풀어 오른 캔디 컬러 인터페이스.**

명시된 규칙 (README.md·tokens.css 주석 기준):

| 규칙 | 근거 |
|---|---|
| **입체 공식 = 3겹 그림자**: ① 외부 소프트 드롭(`--clay-shadow`) + ② 내부 상단 라이트 inset(`--clay-inset-light`) + ③ 내부 하단 다크 inset(`--clay-inset-dark`) → 합성 `--shadow-clay` | tokens.css:96-137, README.md:15-32 |
| 보더 거의 금지 — "클레이는 그림자로 경계를 만든다" | tokens.css:247-249 (주석 명시) |
| 매우 큰 라운드: sm 14 / md 22 / lg 34 / xl 48px, 버튼·칩은 알약형 `--radius-full` | tokens.css:239-245 |
| 밝은 파스텔 배경(#f1ecfb 라벤더) + 채도 있는 솔리드 캔디 5색(coral/violet/mint/yellow/sky) | semantic.css:15-21, tokens.css:20-78 |
| 모션 = 통통 스프링: hover 부풀음(scale 1.025 + 섀도↑), active 눌림(scale 0.97 + inset), 오버슈트 easing(`--ease-emphasized`, `--ease-spring`) | tokens.css:291-305, buttons.css:31-32 |
| 아이콘 전부 인라인 SVG, 둥근 스트로크(stroke-linecap: round, 2.4px) | base.css:330-341 |
| 인풋 = "안으로 파인 클레이 well" (`--shadow-clay-pressed`, `--input-shadow`) | semantic.css:104-117 |
| 다크 테마 = 딥 톤 배경 + 채도 유지 + **그림자 재계산**(드롭은 짙은 블랙, 하이라이트는 은은한 보라) | semantic.css:198-224 |
| 컬러 클레이 전용 그림자 5종(`--shadow-clay-coral` 등, 상단 흰 틴트 + 하단 짙은 동색 inset) | tokens.css:139-169 |

이 테마는 **인쇄·서적 미학 예외에 해당하지 않음** — 세리프/크림 톤이 나오면 전부 지문. (다행히 본문·표면에는 없음. 3-③의 죽은 폰트 import 참고.)

---

## 2. 강점 Top 3 — "살리고 더 밀어붙일 것"

### ① 3겹 클레이 그림자 '공식'이 진짜 토큰 시스템으로 구현됨
- tokens.css:96-169 — 그림자 ingredient(`--clay-cast`, `--clay-glow`)를 RGB 채널 변수로 분리해 놓아 다크 모드에서 채널만 갈아끼우는 구조 (semantic.css:199-231). 이것은 흉내가 아니라 실제 리테마 가능한 설계.
- index.html:174-183 — 허브 페이지에서 공식을 ①/②/③/합성으로 **분해 시각화**까지 함. 디자인 시스템 문서화 수준이 높음.
- 컴포넌트 전부가 합성 토큰만 참조 (`--btn-shadow`, `--card-shadow`… semantic.css:75-117). **→ 증폭 방향**: 이 공식을 더 극단으로(두께감 강화 프리셋 `--shadow-clay-xl`, 컬러 클레이의 하단 다크 inset 강화)로 밀어붙여도 시스템이 견딤.

### ② 물성(physicality) 있는 인터랙션 언어가 전 컴포넌트에 일관됨
- buttons.css:31-32 (hover 떠오름 / active 눌림), cards.css:76 (칸반 카드 드래그 시 `rotate(-2deg) scale(1.03)` — 집어든 느낌), navigation.css:81-82 (page-btn 통통), base.css:280-308 (`clay-pop-in` + `[data-stagger]` 순차 등장), buttons.css:131-136 (`btn-bounce` CTA).
- `prefers-reduced-motion` 전면 대응 (base.css:346-356). **→ 증폭 방향**: 5-①의 스쿼시&스트레치로 "점토 눌림"을 한 단계 더 물리적으로.

### ③ 404 점토 캐릭터 + 진짜 한국어 카피 보이스
- 404.html:49-67, 125-136 — 비대칭 border-radius(`48% 52% 55% 45% / …`) 블롭 캐릭터가 "0" 자리를 대신하고, 볼터치(`clay-char__cheek`)·떠다니는 태그까지. 이 테마에서 가장 기억에 남는 장면.
- 카피가 filler가 아님: "주소가 바뀌었거나 점토 속으로 쏙 들어가 버린 것 같아요"(404.html:141), "말랑한데, 타건은 또렷하게 떨어집니다"(product.html:280), 리뷰 4건 전부 실제 구매평 톤(product.html:354-390). 해요체 보이스 일관.
- **→ 증폭 방향**: 이 캐릭터를 1회성으로 두지 말고 시스템 마스코트로 승격(5-② 참고).

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### ③-1. [최우선] 이모지를 아트워크 대용으로 남발 — "일러스트 그리기 귀찮았던 흔적"
- product.html:162-175 — 상품 메인 이미지·썸네일 5개가 전부 이모지(⌨️ 🎹 🔋 ✨ 📦). 관련 상품 4개도 이모지(🖱️ 🎨 🧈 🔌, product.html:410-446). product.html에서만 14회.
- kanban.html 5회, index/inbox/onboarding/settings 등 총 9개 파일에 산재 (🫧 남발 포함: index.html:64 "결과가 없어요 🫧", index.html:373 "우클릭 해보세요 🖱️", product.html:401 "함께 보면 좋아요 🫧").
- 이모지는 OS마다 렌더가 다르고, 클레이 DNA(3겹 그림자·비비드 캔디)와 시각적으로 이질적. 프로 스튜디오라면 이 테마의 기존 기법(비대칭 border-radius 블롭 + 컬러 클레이 그림자 + 인라인 SVG)만으로 '점토 키보드', '점토 마우스' 일러스트를 직접 만든다. 404.html의 clay-char가 이미 그 증명.
- **수정 지침**: 상품/썸네일/빈상태 아트워크를 clay-char 방식의 CSS+SVG 점토 일러스트로 교체. 최소한 product.html 메인 갤러리 5종은 필수.

### ③-2. 죽은 서재풍 폰트 import — 근거 없는 Noto Serif KR
- tokens.css:13 — `Noto Serif KR` 4웨이트 + `Noto Sans KR` 3웨이트를 Google Fonts로 로드하지만, **Noto Serif KR은 코드 전체에서 단 한 번도 사용되지 않음**(전 파일 grep 확인). Noto Sans KR도 mono 폴백(tokens.css:200)에만 등장.
- 전형적인 "AI가 한글 대응 보일러플레이트를 복붙한" 흔적이자 성능 결함(불필요한 폰트 다운로드 수백 KB).
- **수정 지침**: tokens.css:13에서 `Noto+Serif+KR` 제거. `Noto+Sans+KR`은 mono 폴백 유지 목적이면 400 단일 웨이트로 축소하거나 제거.

### ③-3. 4페이지에 동일 레시피로 복붙된 코너 블롭 장식
- index.html:14-18, 404.html:35-39, onboarding.html:24-28, pricing.html:14-16 — 코랄/민트/옐로/스카이 원형 블롭 4개를 코너에 뿌리고 `clay-float 5.5~7s`를 거는 **완전히 동일한 패턴**이 반복됨. 크기·딜레이 숫자만 다름.
- 첫 페이지에선 분위기지만 4번째부터는 "생성 규칙"이 보임. 프로라면 페이지 성격마다 배경 연출을 다르게 변주함(온보딩=거대 블롭이 카드 뒤로 겹침, 프라이싱=플랜 뒤 후광 등).
- **수정 지침**: 페이지별 배경 연출 차별화. 최소한 블롭의 형태(정원→비대칭 blob radius), 스케일(거대 오버플로우), z-겹침(콘텐츠 뒤로 일부 가림)을 페이지마다 다르게.

### ③-4. 균질·예측 가능한 그리드 리듬
- dashboard.html:60-81 — stat 4등분 → 차트 1.55fr:1fr → 테이블 1.5fr:1fr → 위젯 1:1. 전부 카드 + 동일 gap(--space-5/6)의 얌전한 리포트형 배치. 클레이 DNA면 스탯 카드 크기가 값의 중요도에 따라 들쑥날쑥해도(bento 변형) 좋음.
- index.html 히어로도 "배지 → H1 → 문단 → 버튼 2개 → 신뢰 노트 3개"의 교과서 공식. 블롭이 우측에 떠 있을 뿐 텍스트 컬럼은 완전 정형.
- **수정 지침**: 5-④·⑤ 참조.

### ③-5. (경미) 랜딩 신뢰 배지 3종 세트
- index.html:159-163 — "대비 4.5:1+ 준수 / 키보드·ARIA 완비 / reduced-motion 대응" 3개 아이콘+문구 나열은 dev-tool 랜딩의 관성. 디자인 시스템 허브라는 맥락상 허용 가능하지만, 표현을 클레이 보이스로 바꾸면 좋음.

> **지문이 아닌 것 (오판 주의)**: 파스텔 배경 `#f1ecfb`는 크림 종이 톤이 아니라 라벤더 캔디 톤으로 DNA 적합. 세리프 헤딩 없음(전부 Baloo 2/Jua 라운드). 영문 filler 카피 거의 없음(카피 품질은 30테마 중 상위권으로 추정). 이 테마의 지문은 '서재 관성'이 아니라 **'이모지 대체 + 장식 복붙 + 균질 그리드'** 유형.

---

## 4. 프로덕션 결함 (구현 에이전트 필수 수정 목록)

### ④-1. [치명·a11y] 전역 focus ring이 컴포넌트 box-shadow에 덮여 **버튼류에서 키보드 포커스가 안 보임**
- base.css:314-319 — `:focus-visible { box-shadow: <ring 2겹> }` (특이도 0,1,0).
- 그런데 theme.css 로드 순서상 components/*.css가 base.css **뒤에** 로드되고, `.btn`(buttons.css:6-23), `.page-btn`(navigation.css:75-80), `.tab`(navigation.css:94-99), `.sidebar__item`(navigation.css:49-53), `.kanban-card`(cards.css:69-75), `.cmdk__item` 등이 같은 특이도(0,1,0)로 `box-shadow`를 선언 → **cascade 순서로 컴포넌트 쪽이 승리, 포커스 링이 통째로 사라짐**. `:focus`의 `outline: none`(base.css:313)까지 걸려 있어 대체 표시도 없음.
- forms.css:49-51, selection.css:49-117처럼 자체 `:focus-visible`을 가진 컴포넌트(인풋/체크/스위치/슬라이더)만 정상.
- README.md:204 "또렷한 컬러 포커스 링" 및 CHECKLIST.md:104 주장과 실제 불일치.
- **수정 지침**: 각 그림자 보유 컴포넌트에 `.btn:focus-visible { box-shadow: var(--btn-shadow), 0 0 0 var(--ring-offset) var(--color-surface), 0 0 0 calc(...) var(--color-ring); }` 식으로 클레이 그림자+링 합성 규칙 추가(버튼/페이지네이션/탭/사이드바 아이템/카드 interactive/cmdk 아이템/아코디언 트리거/캐러셀 버튼 전수). 또는 base.css의 전역 규칙을 컴포넌트 로드 이후 레이어로 옮기고 그림자 합성.

### ④-2. [치명·렌더] SVG 속성에 var() 직접 사용 — 알려진 렌더 깨짐 버그
- pages/dashboard.html:382 — `<path ... stroke="var(--violet-500)" .../>` (라인 차트 트렌드 라인)
- pages/dashboard.html:373-374 — `<stop offset="0%" stop-color="var(--violet-400)" .../>` ×2 (영역 그라데이션)
- HTML 속성 형태의 stroke/fill/stop-color에서는 var()가 해석되지 않아 라인이 검정/무색으로 깨짐 (theme-07 차트에서 동일 버그 확인된 전례).
- **수정 지침**: `style="stroke:var(--violet-500)"` 또는 CSS 클래스(`.linechart__line { stroke: var(--violet-500); }`)로 이동. stop-color도 `style="stop-color:var(--violet-400)"`로.

### ④-3. [a11y·시맨틱] 커맨드 팔레트 `<button href="…">` — 유효하지 않은 HTML
- index.html:51-59 — `<button class="cmdk__item" ... href="pages/dashboard.html">` ×9. `href`는 button의 유효 속성이 아님. app.js:322에서 `getAttribute("href")`로 동작은 하지만 스크린리더는 링크로 인지 못 함.
- 함께: cmdk 리스트에 `role="listbox"` 없음, 아이템에 `role="option"` 없이 `aria-selected`만 부여(app.js:287-289) → ARIA 규격 위반.
- **수정 지침**: `data-href`로 변경 + `.cmdk__list`에 `role="listbox"`, 아이템에 `role="option"` 부여(또는 페이지 이동 항목은 `<a role="option">`).

### ④-4. [a11y·UX] data-rating 위젯이 읽기전용 모드 없이 전부 클릭 가능한 버튼
- app.js:368-384 — `role="radiogroup"` 안에 role 없는 `<button>`들(radio 아님) 생성. 리뷰 표시용 별점(product.html:188, 331, 350, 362…)까지 클릭하면 값이 바뀜.
- product.html:188 — 평균 4.7점인데 `data-rating="5"`로 별 5개가 꽉 채워짐(aria-label은 4.7이라고 말함 → 시각/보조기기 정보 불일치).
- **수정 지침**: `data-readonly` 지원(버튼 대신 span, tabindex 제거) + 소수점 별(부분 채움) 렌더 지원. role 구조를 radio 패턴(`role="radio"` + `aria-checked`)으로 교정.

### ④-5. [a11y·대비] sky-500 위 흰 글자 = 3.62:1 (텍스트 기준 미달)
- pages/dashboard.html:142 — `.rank--2 { background: var(--sky-500); color: #fff; }` — 랭킹 숫자 "2"는 텍스트이므로 4.5:1 필요. sky-500(#1187f5) 대 흰색 ≈ 3.6:1.
- CHECKLIST.md:93은 버튼/표면을 sky-600으로 보정했다고 기록했으나 이 지점은 누락. (cards.css:56 `.stat__icon--sky`와 404.html:85 `empty__art--sky`는 아이콘 = 그래픽 3:1로 통과)
- **수정 지침**: `.rank--2`를 `var(--sky-600)` 배경으로 변경 (버튼 보정과 동일 원리).

### ④-6. [경미] 토큰 우회/미정의 토큰
- pages/onboarding.html:42 — `var(--dur-2, .18s)`: `--dur-2`는 어디에도 정의 안 됨(폴백으로 동작). `var(--duration-fast)`로 교체.
- pages/pricing.html:272-278 — CTA 밴드에 `color:#fff`, `rgba(255,255,255,.9)` 하드코딩 3곳. clay-violet 배경 위라 대비는 통과하지만 토큰(`--color-primary-fg` 계열) 우회.
- components/cards.css:48,96 / data-display.css:104 — `#fff` 하드코딩 소수. 다크 모드에서도 유색 배경 위라 실害는 없으나 토큰化 권장.

### ④-7. [경미] 다크 모드 첫 페인트 플래시
- 전 HTML이 `data-theme="light"` 하드코딩(10개 파일) + app.js:42-46 initTheme가 로드 후 localStorage/OS 선호로 덮어씀 → 다크 사용자에게 라이트 플래시 발생. `<head>` 초입에 3줄 동기 스크립트로 테마 선적용 권장.
- README.md:93 "미지정 시 OS 선호를 따릅니다"라는 설명과 실제 마크업(항상 light 지정)이 불일치.

### ④-8. [확인 필요] 상태 커버리지 소결
- disabled: buttons.css:102-111, forms.css:69-70, selection.css:57·86, navigation.css:84 — 커버 양호.
- empty: cards.css:118-128(.empty), forms.css:200, overlays.css:134 — 커버 양호.
- error: forms.css `.is-invalid`(index.html:263-265에서 데모) — 양호.
- hover/active: 전면 구현. **유일한 구멍이 ④-1의 focus-visible.**

---

## 5. 대담화 기회 (프로 디자이너의 "한 방")

### ⑤-1. 시그니처 모션: 스쿼시&스트레치 점토 물리
현재 active는 균일 `scale(0.97)`(tokens.css:305). 진짜 점토는 **누르면 옆으로 퍼짐**. `:active { transform: scale(1.06, 0.9); }`처럼 X/Y 비대칭 스쿼시 + 떼면 `--ease-spring`으로 출렁이며 복귀(keyframes 2-3 스텝 오버슈트). 버튼·페이지네이션·스위치 thumb에 일괄 적용하면 이 테마만의 촉감이 됨. 토글 스위치는 thumb가 이동 중 가로로 늘어났다 붙는 "젤리 드래그" 연출. (reduced-motion 가드 유지)

### ⑤-2. clay-char를 시스템 마스코트로 승격
404.html:50-62의 블롭 캐릭터(비대칭 radius + 볼터치 + float)를 컴포넌트化(`.clay-mascot` + 표정 변형: 기쁨/멍/슬픔/축하)해서 — 온보딩 각 스텝의 안내자, 빈 상태 6종(404.html:201-303)의 아트워크, 토스트 success의 아이콘 자리, 로딩 스피너 대체(반죽되는 점토 블롭 morph)에 재사용. "빈 상태마다 같은 원형 아이콘" 대신 캐릭터가 상황 연기를 하면 기억에 남는 한 방이 됨.

### ⑤-3. 살아있는 블롭 형태 언어 — 정원(正圓) 탈피
장식 블롭·아트워크·page-thumb에 비대칭 border-radius(`60% 40% 55% 45% / 50% 60% 40% 50%`)와 **border-radius 자체를 keyframes로 모핑**하는 `clay-morph` 애니메이션(8-12s 슬로우)을 도입. 히어로의 blob--1~4(index.html:15-18)부터 적용하면 "복붙 원 4개"(③-3)가 "숨 쉬는 점토 덩어리"로 바뀜. 배경 메시(base.css:56-62)에도 초대형 블롭 1-2개를 콘텐츠 뒤에 -z로 겹쳐 깊이 부여.

### ⑤-4. 히어로·상품 페이지의 구도 파괴
- index.html 히어로: 텍스트 왼쪽 정렬 유지하되, 우측에 **실제 클레이로 빚은 UI 부품 더미**(버튼·토글·별점이 3D처럼 겹쳐 쌓인 콜라주, 각각 다른 rotate/scale + 개별 float 딜레이)를 배치해 "이 시스템의 부품들이 점토로 존재한다"는 오브제 연출. 지금의 빈 원 4개보다 훨씬 제품답게.
- product.html: 갤러리 메인(⌨️ 이모지)을 CSS 점토 키보드 일러스트(키캡 그리드 = 알약 div들 + 컬러 클레이 그림자)로 교체하고, 색상 segmented 선택 시 키캡 색이 실시간으로 바뀌게 — 기존 JS 훅(product.html:489-501)이 이미 있어 저비용 고효과.
- dashboard: stat 4등분(dashboard.html:60-63)을 값 중요도 기반 bento(총매출 2×2 대형 + 나머지 소형)로, 대형 카드엔 배경 초대형 숫자 워터마크.

### ⑤-5. "푹신 스티커" 타이포 한 방
h1/히어로 숫자에 다층 text-shadow(아래로 2-3겹 동색 딥톤 + 미세 하이라이트)로 **글자 자체를 부풀어 오른 점토 스티커**처럼. `.text-candy`(base.css:166-171) 그라데이션과 결합하면 404의 거대 "4 0 4"(404.html:43-47)와 pricing 가격 숫자가 시그니처 장면이 됨. 로드 시 글자별 stagger pop-in(이미 있는 `clay-pop-in` 재사용).

### ⑤-6. 인터랙션 잔흔 — "지문이 남는 점토"
클릭 지점에 радial-gradient 눌림 자국(dent)이 0.6s 정도 남았다 서서히 차오르는 마이크로 인터랙션(::after + JS 좌표). 칸반 카드 드롭 시 컬럼이 살짝 출렁(`clay-wiggle` 재사용, base.css:290-294 — 정의만 있고 현재 미사용). 정의해 놓고 안 쓰는 `clay-wiggle`을 살릴 것.

---

## 6. 한글 폰트 페어링 (현재 기록)

| 역할 | 스택 | 실제 한글 렌더 |
|---|---|---|
| display (`--font-display`) | "Baloo 2" → Quicksand → ui-rounded → Hiragino Maru → **"Jua"** → Apple SD Gothic Neo (tokens.css:196-197) | **Jua** (주아체 — 통통 붓글씨 라운드) |
| body (`--font-body`) | "Nunito" → Quicksand → ui-rounded → **"Gowun Dodum"** → Apple SD Gothic Neo (tokens.css:198-199) | **Gowun Dodum** (고운돋움) |
| mono (`--font-mono`) | "Fira Code" → … → "Noto Sans KR" (tokens.css:200) | 코드 내 한글은 Noto Sans KR |

**판정**:
- **Jua(display)는 이 테마 최적 페어링 — 반드시 보존.** 라틴 Baloo 2와 무게·라운드감이 잘 붙음.
- **Gowun Dodum(body)은 보존 가능하나 재고 후보.** 단일 400 웨이트라 body의 500/700 사용(base.css:33, fw-bold 다수)이 전부 브라우저 가짜 볼드로 렌더됨 + 성격이 다소 서정적·차분해서 "통통 캔디" DNA보다 한 톤 얌전함. 교체 시 후보: **NanumSquareRound**(라운드 산세리프, 4웨이트 — DNA 부합도 최고) 또는 SUITE. 서재풍 세리프 아님이므로 강제 교체 대상은 아님 — 구현 에이전트 재량.
- **정리 필수**: tokens.css:13의 **Noto Serif KR import는 미사용 죽은 코드 — 제거** (③-2). Jua·Gowun Dodum 모두 단일 웨이트이므로 import의 Noto Sans KR 웨이트도 축소 가능.

---

## 부록 — 구현 우선순위 제안

1. ④-1 focus ring 복구 (a11y 치명)
2. ④-2 dashboard SVG var() 버그 (렌더 깨짐)
3. ③-1 이모지 → 점토 일러스트 교체 (product 갤러리 최우선) + ⑤-2 마스코트化
4. ④-3/④-4 cmdk·rating ARIA 교정
5. ③-2 죽은 폰트 import 제거, ④-5 rank--2 대비, ④-6 토큰 우회
6. ⑤-1 스쿼시 모션 + ⑤-3 블롭 모핑 + ⑤-5 스티커 타이포 (대담화)
7. ③-3/③-4 페이지별 배경 변주 + dashboard bento (구도)
