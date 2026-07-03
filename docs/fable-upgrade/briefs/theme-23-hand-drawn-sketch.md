# 감사 브리프 — theme-23-hand-drawn-sketch (손그림 스케치)

> 감사일: 2026-07-04 · 대상 경로: `design-systems/theme-23-hand-drawn-sketch/`
> HTML 10개 (index + pages 9) · CSS 7개 (tokens/semantic/base + components 5... theme.css 엔트리) · app.js 782줄
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 명시함.

---

## 1. DNA 요약

**정체성: "스케치북에서 찢어낸 페이지" — 크림 노트지 위에 네이비 펜 잉크로 그린, 일부러 삐뚤빼뚤한 손그림 UI. 형광펜 3색(옐로/핑크/민트)이 유일한 강조 수단.**

핵심 시스템:
- **팔레트**: 종이 `--paper-200 #F7F1E3` / 잉크 `--ink-700 #243042` / 형광펜 `#FFE45C`·`#FF9EC4`·`#9EE6C4` / 펜 6색(red/blue/green/orange/purple/teal) — tokens.css:20-90
- **명시 규칙(주석)**: tokens.css:7-10 — "ROUGH wobbly borders (**never perfect straight lines**) … **No slick vectors, no gradients, no high gloss**". 이 3금지는 DNA 헌법으로 취급할 것.
- **손그림 박스 트릭**: 불규칙 border-radius 4값+슬래시 (tokens.css:235-244, `--radius-md-alt`로 이웃 박스 복제감 방지, `--radius-round` 유기적 blob) + 2~2.5px 잉크 보더 + 미세 회전
- **스케치 섀도**: blur 없는 오프셋 그림자만 (tokens.css:160-165) — 매끈한 elevation 금지
- **모티프 토큰**: 줄노트/도트/모눈 배경, 해칭/크로스해칭, 형광펜 스와이프(`--highlighter-mark`), 물결 밑줄, doodle 화살표/동그라미/별, `#roughpaper` turbulence 필터(`.rough-edge`) — tokens.css:92-157
- **다크 = 칠판(chalkboard)**: 단순 반전이 아니라 슬레이트 그린 + 분필 화이트로 재해석, `--ink`를 분필색으로 재지정, 형광펜은 반투명화 — semantic.css:158-230
- **타이포**: Caveat(마커 display) + Patrick Hand(본문 hand) + Inter(밀집 데이터) + JetBrains Mono. 한글 fallback: Gaegu / Nanum Pen Script / Gothic A1 — tokens.css:195-199
- **모션**: 젠틀 wobble·pop-in, `--ease-wobble` 오버슈트, reduced-motion 완비 — base.css:306-355

**중요 구분**: 이 테마의 크림 종이 톤·종이 질감은 '서재 관성 지문'이 아니라 **DNA 그 자체**다. 걷어낼 것은 종이가 아니라 '얌전함'이다. 반면 세리프는 이 테마 DNA에 없다(§3-4 참조).

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **불규칙 radius + 회전 + 순환 변주의 '반(反)복제' 시스템** — tokens.css:235-244(`--radius-md-alt`, 주석 "use on neighbours so boxes don't look cloned"), base.css:153-156(`.panel-alt/.panel-tilt`), kanban.html:53-55(컬럼별 다른 회전/radius)·116-144(카드 nth-child 회전 순환 + 포스트잇 3색 tint + 테이프 accent 색 교차). AI가 흔히 만드는 '복붙 카드 그리드'를 시스템 차원에서 거부하는 설계. **→ 이 변주 밀도를 페이지 레이아웃 차원(크기·겹침)까지 확장할 가치가 있음.**
2. **다크모드의 '칠판' 재해석** — semantic.css:158-230. `--ink`→분필 화이트 재지정(179), 형광펜 반투명화(205), 도트 분필가루 질감(165-166). 토큰 아키텍처(ink 별칭)를 이용해 러프 보더가 다크에서도 전부 살아있게 만든 프로급 사고. **→ 칠판 전용 모티프(분필 번짐, 지우개 자국)로 더 밀 수 있음.**
3. **테마 언어로 그린 자체 SVG 일러스트 + 시그니처 doodle burst** — 404.html:87-108(보물지도 doodle: 점선 길 + X + 나침반), product.html:84-98(펼친 스케치북 일러스트), app.js:40-88(클릭 시 손낙서 버스트, reduced-motion 존중). filler 스톡이미지 대신 테마 어휘로 일러스트를 그렸음. **→ 이 일러스트 어휘를 dashboard 차트·빈 상태·hero까지 확대.**

보너스: 인터랙션 진용이 실제로 완동(커맨드팔레트 필터/방향키, 모달 포커스트랩, 테이블 정렬, 칸반 DnD — app.js 전반). "그림만 예쁜 킷"이 아니라는 점 자체가 강점.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 3-1. [치명] 데모 페이지 9개 전부 영어 — 한글 0줄
- 전수 확인: `pages/404.html`·`dashboard.html`·`inbox.html`·`kanban.html`·`onboarding.html`·`pricing.html`·`product.html`·`profile.html`·`settings.html` 모두 `<html lang="en">`(각 파일 2행) + 한글 문자 0줄 (settings.html의 유일한 한글은 언어 셀렉트 옵션 "한국어" 1건, settings.html:300). index.html만 한글(lang="ko").
- 영어 filler 카피 예: dashboard.html:181 "your sketchbook, last 30 days" / kanban.html:194 "Pin ideas, drag notes, ship the redraw." / 404.html:111 "this page wandered off"
- 외국 인명 데이터: dashboard.html:284-316 (Mara Whitfield, Theo Nakamura, Priya Anand, Luca Fontaine, Dani Okonkwo), profile.html:136 "Jin Park"
- 영문 dev-tool 문구: 전 페이지 "Skip to content"(예: dashboard.html:153), "Type a command…"·"No results."(cmdk, 예: dashboard.html:344·358), breadcrumb "Home"(174)
- **조치**: 9개 페이지 전면 한글화(lang="ko" 포함). index.html의 카피 톤("스케치가 벽에 붙었어요", "픽셀이 아닌 펜으로 만들었어요")이 이미 좋은 기준이므로 그 톤으로 통일. 인명·보드명·메일 제목까지 한국 로컬 데이터로.

### 3-2. Noto Serif KR 무근거 import (서재 관성 잔재)
- tokens.css:13에서 `Noto+Serif+KR` 4웨이트 import — **전체 코드베이스에서 사용처 0** (grep 확인: serif 계열 font-family 지정 없음). 손그림 테마에 세리프는 DNA 근거가 없음. **조치: import에서 제거** (로딩 비용 절감 겸).
- 참고: 폰트 @import가 tokens.css:13과 base.css:11 두 곳으로 분산 — 한 곳으로 정리 권장.

### 3-3. 균질·예측 가능한 리포트형 리듬
- dashboard.html:194-215 — 완전 등분 `grid-4` stat 카드 4장, 동일 크기·동일 구조. '벽에 붙인 메모' 테마인데 배치는 얌전한 관리자 리포트. index.html:17·20-21의 kit-grid/gallery/pages-grid도 전부 균등 auto-fit 그리드.
- 카드 자체의 미세 회전 변주(강점 §2-1)가 있음에도 **레이아웃 골격은 hero → 균등 카드그리드 반복 공식** 그대로. §5-1로 해소.

### 3-4. 분위기(atmosphere) 미완
- `--margin-color`(빨간 마진선, tokens.css:98) 토큰이 정의만 되고 **어디에도 사용되지 않음** — 줄노트의 빨간 세로 마진선은 이 테마 최고의 분위기 장치인데 방치됨. 배경이 `--paper-ruled` 가로줄만으로 밋밋.
- 페이지 여백이 텅 빔: 낙서·커피 얼룩·모서리 접힘 같은 '사용된 노트' 흔적이 hero 일러스트 외엔 없음.

---

## 4. 프로덕션 결함

### 4-1. [P0 · 알려진 렌더 버그] SVG stroke/fill HTML 속성에 var() 직접 사용 — 36건
presentation attribute에는 var()가 무효 → 렌더 깨짐. **style 속성 또는 currentColor로 전환 필수.**
- index.html:70-76 (hero 일러스트 7건)
- pages/404.html:89-107 (보물지도 12건)
- pages/product.html:84-98, 103-112, 259-289 (제품/썸네일 일러스트 17건)
- 확인 명령: `grep -rn 'stroke="var(\|fill="var(' --include="*.html" .` → 36 hit
- 참고: progress-ring의 `.pr-track/.pr-fill`은 CSS에서 stroke를 지정하므로 문제 없음. **일러스트의 계조(surface/border/muted)를 유지하려면 각 요소에 `style="stroke:var(--color-border)"` 식으로 옮기는 방식 권장** (다크모드 자동 추종 유지).

### 4-2. [P1] 대비 미달 — README/CHECKLIST의 "AA 준수(≥4.5:1)" 주장은 과장
- `.stat-delta.up { color: var(--color-success) }` (display.css:129) = pen-green `#5a9367` on `--card-bg`(paper-50) ≈ **3.5:1** — 14px 텍스트 AA 미달
- `.badge.green/.blue/.red` 텍스트가 pen 원색 그대로 (display.css:21-24): green `#5a9367` on `#e3efe4` ≈ 3.2:1, red `#e2503b` on `#f8e0db` ≈ 3.2:1, blue `#3e7cb1` on `#dde9f2` ≈ 3.6:1 — 12px 배지 전부 미달
- `.btn-danger`: paper-50 텍스트 on pen-red `#e2503b` ≈ **3.9:1** (semantic.css:54, buttons.css:106-109)
- `.btn-secondary`: paper-50 on pen-blue `#3e7cb1` ≈ 4.4:1 — 경계선 미달
- **조치**: 텍스트 용도에는 `--pen-*-dark` 계열(tokens.css:81-86, 이미 존재!)로 재매핑. 예: `--color-success`(텍스트 역할)→`--pen-green-dark #3f7049`(≈5.3:1), danger 버튼 배경→`--pen-red-dark`. 상태색을 "bg용/텍스트용" 세만틱으로 분리하는 것이 정석.

### 4-3. [P1] `.btn-danger` hover/active 상태 부재
- buttons.css:106-109 — 다른 모든 variant는 `:hover/:active` 배경 변화가 있으나(66-104) danger만 없음. `--color-danger-hover/-press` 토큰 자체가 semantic.css에 없음. settings.html DANGER ZONE의 핵심 버튼인데 상태 피드백 결손.

### 4-4. [P1] btn-group 모서리 radius 무효
- buttons.css:221-229 — `border-top-left-radius: var(--btn-radius)` 식으로 **4값+슬래시 축약형을 롱핸드에 대입** → invalid at computed-value time → 0으로 떨어져 첫/끝 버튼 모서리가 각짐. `--btn-radius`(= `--radius-md` "16px 10px 14px 12px / 12px 14px 9px 16px")는 축약형 전용. **조치**: 그룹 컨테이너(.btn-group)에 radius+overflow:hidden을 주거나, 모서리용 단일값 토큰(예: `--radius-corner-a: 16px 12px`) 신설.

### 4-5. [P1] 모바일(≤540px) 내비가 본문을 가림
- navigation.css:149-163 — `.nav-links`가 `position:absolute; top:var(--navbar-h)`로 항상 펼쳐진 스트립이 되는데, 본문에 보정 패딩이 없어 breadcrumb/콘텐츠 상단을 덮음 (모든 pages/* `main`은 `padding-block:var(--space-7)`=32px뿐, 예: dashboard.html:173). 토글도 없음. **조치**: 스트립 높이만큼 body 상단 패딩 보정 또는 navbar 내 2단 flow 배치로 변경.

### 4-6. [P2] 커맨드팔레트 a11y
- 각 페이지 cmdk 마크업(예: dashboard.html:342-361) — `.cmdk-item`이 `<div>` + hover 스타일(feedback.css:543-565)뿐. `role="listbox"/option`, `aria-activedescendant` 없음, 개별 포커스 불가(방향키는 app.js가 처리하나 SR에는 구조가 안 보임). 또한 `.cmdk-empty`가 `style="display:none"` 인라인 토글 — `aria-live` 없음.

### 4-7. [P2] 칸반 드래그 키보드 대안 부재
- kanban.html:214 등 `draggable="true"` 카드 — 마우스 전용. 최소한 카드에 컨텍스트 메뉴/버튼으로 "칼럼 이동" 대안 제공 필요 (README의 "full keyboard support" 주장과 불일치).

### 4-8. [P2] 다크 테마 FOUC
- app.js:23-29의 저장 테마 적용이 body 끝 스크립트에서 실행 → 다크 저장 사용자에게 크림색 플래시. **조치**: `<head>`에 3줄 인라인 스니펫(localStorage 읽어 data-theme 세팅) 추가.

### 4-9. [P2] doodle burst 색상 하드코딩 → 칠판에서 저대비
- app.js:52 `DOODLE_COLORS = ["#e2503b","#3e7cb1",…]` — 다크(칠판)에서 네이비/그린 낙서가 안 보임. getComputedStyle로 `--chart-*`를 읽거나 다크용 파스텔 세트 분기.

### 4-10. [P2] 폼 에러/검증 상태 데모 부재
- `.is-invalid`(forms.css:107-109)·`.field-error`(forms.css:39-48) 정의는 있으나 **10개 HTML 어디에도 사용 예 0** (grep 확인). 상태 진열이 아니라 실제 맥락(settings 저장 실패, onboarding 필수값)에 넣을 것.

### 4-11. [P3] 기타
- semantic.css:37 `--color-secondary-press: #234c70` — primitive 우회 직접 hex (pen-blue 램프에 추가하는 게 일관적)
- forms.css:819, display.css:796 — rgba 하드코딩 2건 (display.css:796 스켈레톤 shimmer는 흰색 고정 → 칠판 다크에서 이질적)
- kanban.html:194 — `.doodle-circle` 스팬 **안에** 텍스트 배치. base.css:212 계약("size on parent; place over a target")과 불일치, background-size 미지정이라 링이 텍스트와 안 맞음. kanban.html:359 `.doodle-arrow`에 "↳" 문자 중복(이미지+글자 이중 렌더).
- pages 한글화 시 `lang="en"` → `lang="ko"` 일괄 수정 (9개 파일 2행)

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 것)

1. **[레이아웃 한 방] '벽에 붙인 콜라주' 그리드 파괴** — dashboard의 등분 grid-4 stat 카드(dashboard.html:194-215)를 크기 불균등 + 미세 겹침 + 회전 강화 + 테이프/압정 고정의 메모 콜라주로 재구성. 카드 사이를 손그림 화살표(`--doodle-arrow`)가 실제로 연결("여기가 급증 ↗" 주석). index.html hero도 좌우 2단 대신 화이트보드 위 산개 배치로. 이미 있는 `.tape/.panel-tilt/--radius-md-alt` 어휘만으로 구현 가능 — 시스템 확장 불필요, 배치의 용기만 필요.
2. **[분위기] 마진 낙서(marginalia) 레이어** — 방치된 `--margin-color`(tokens.css:98)로 줄노트 좌측 빨간 마진선을 살리고, 페이지 여백에 aria-hidden 고정 낙서(커피링 자국, 작은 별, "중요!" 스크리블, 모서리 접힘)를 페이지당 2~3개 배치. '새 공책'이 아니라 '쓰던 스케치북'의 물성. 다크에서는 분필 얼룩/지우개 자국으로 변주.
3. **[시그니처 모션] 선이 그려지는(draw-in) 등장** — `draw-dash` 키프레임(base.css:319-321)이 정의만 되고 사실상 미사용. hero 일러스트·hand-underline·404 지도 점선 길을 stroke-dasharray 드로잉 애니메이션으로 "지금 펜으로 그리는 중" 연출. 스크롤 리빌(data-reveal)과 결합, reduced-motion 시 완성 상태로 정지.
4. **[차트 DNA화] 손그림 차트 승격** — dashboard 바 차트는 현재 직사각 div+해칭(dashboard.html:223-231). SVG 손떨림 윤곽(약간 삐뚠 path) + 크레용 질감 채움 + `.rough-edge` 필터로, 링 차트는 손으로 돌려 그린 불균일 stroke 원으로. 값 라벨은 Caveat 스크롤. ⚠️ 이때 SVG 색은 반드시 style/currentColor로(§4-1 버그 회피).
5. **[물성 한 방] 스프링 제본/찢은 가장자리** — 페이지(또는 주요 카드) 상단에 스프링 노트 펀치 구멍 행 또는 찢어진 종이 마스킹(clip-path 지그재그) — README의 "page torn from a sketchbook" 선언을 문자 그대로 시각화. 404·onboarding처럼 감성 여유가 있는 페이지부터.
6. **[마이크로인터랙션] 형광펜 긋기** — `.mark`의 background-size를 0%→100%로 트랜지션시켜 hover/등장 시 형광펜을 실제로 '긋는' 효과. 이미 background-image 방식(base.css:179-192)이라 2줄로 구현 가능. + 전역 연필 커서(cursor: url(data:svg)) 검토.

---

## 6. 한글 폰트 페어링 (기록 · 원칙적 보존)

| 역할 | 라틴 | 한글 fallback | 판정 |
|---|---|---|---|
| `--font-display` (tokens.css:195) | Caveat | **Gaegu** | 손글씨 마커 무드 정합 — **보존** |
| `--font-hand` 본문 (tokens.css:196-197) | Patrick Hand | **Nanum Pen Script** | 무드 정합 — 보존. 단 Nanum Pen Script는 소형·세선이라 **본문 장문 가독성 주의**: 한글화 후 본문만 Gaegu 400으로 올리는 옵션 검토 가능(구현 에이전트 재량, 라벨/짧은 UI 텍스트는 현행 유지) |
| `--font-sans` 데이터 (tokens.css:198) | Inter | Gothic A1 → Noto Sans KR | 표/숫자용 — **보존** |
| `--font-mono` (tokens.css:199) | JetBrains Mono | (Noto Sans KR) | 보존 |
| ~~Noto Serif KR~~ (tokens.css:13 import) | — | — | **사용처 0, 서재 관성 잔재 → import 제거** (§3-2) |

- 임포트 위치: tokens.css:13 (한글 5종) + base.css:11 (라틴 4종) — 이중 @import, 한 곳 통합 권장.
- 9개 페이지 한글화(§3-1) 후 실제 한글 렌더는 전부 fallback 체인을 타므로: Gaegu는 Caveat보다 글자가 커 보임 → 한글화 후 `--text-4xl~6xl` 히어로 스케일과 `letter-spacing` 시각 재점검 필수.

---

## 우선순위 요약 (구현 순서 제안)

1. §4-1 SVG var() 36건 교체 (렌더 버그) + §4-2 대비 재매핑(pen-*-dark)
2. §3-1 페이지 9종 전면 한글화 (lang 포함, index 톤 기준) + §3-2 Serif import 제거
3. §4-3~4-5 (danger 상태 / btn-group radius / 모바일 내비 겹침)
4. §5-1 콜라주 레이아웃 + §5-2 마진 낙서 + §5-3 draw-in 모션 (테마 대담화 본편)
5. §4-6~4-11 잔여 a11y·FOUC·에러상태 데모
