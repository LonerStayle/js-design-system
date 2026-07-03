# 감사 브리프 — theme-27-scifi-hud (`AETHER-HUD`)

- **테마 경로**: `design-systems/theme-27-scifi-hud/`
- **HTML 페이지 수**: 10 (index.html + pages/ 9개: dashboard, kanban, inbox, product, pricing, settings, onboarding, profile, 404)
- **파일 구성**: tokens.css(390) / semantic.css(262) / base.css(389) / components 7파일(1,548) / app.js(768) / README / CHECKLIST
- **주의**: 이 테마에는 `styles.css`가 없음. 컴포넌트 CSS는 `components/index.css`가 `@import`로 통합.

---

## 1 · DNA 요약

**정체성**: 함선/슈트의 홀로그래픽 헤드업 디스플레이(Iron Man / Halo 콕핏). "빛으로 그린 유리 위의 데이터" — 딥 네이비 보이드(`--navy-900 #060B16`) 위에 일렉트릭 시안(`--cyan-400 #22E0FF`) 글로우 라인, 앰버 경고, 알럿-레드, 시그널-그린의 규율 잡힌 신호 팔레트.

**README.md:16-25에 명시된 규칙(사실상 FORBIDDEN/필수)**:
- "Light, not paint" — 면은 거의 채우지 않고 얇은 글로우 라인 + 코너 브래킷으로 구조를 그림
- "Cut, never rounded" — 모서리는 `clip-path` 베벨/노치. **둥근/따뜻한/레트로 형태 금지** (CHECKLIST.md:42 "No warm/rounded/retro shapes ✅", tokens.css:231 "RADIUS mostly 0")
- "Data is the decoration" — 좌표 리드아웃, 텔레메트리 지터, 레티클, 게이지, 스캔라인이 곧 장식
- "Motion = system activity" — 스캔 스윕/레이더 회전/데이터 스트림은 '살아있는 기계'의 증거이며 `prefers-reduced-motion`에서 전부 정지 (base.css:369-381, app.js:16 `RM` 가드)
- 타이포: Orbitron(display) / Rajdhani(body) / Share Tech Mono(data) + 대문자·와이드 트래킹(`--tracking-wide…mega`)

**시그니처 모티프 토큰** (tokens.css:93-164): `--clip-bevel/-4/-tab`, `.bracket-frame`(base.css:226-262), `--hex-grid`·`--reticle`(data-URI SVG), `--scanline`, `--data-stream`, `--gauge`(conic), `--holo-wash`. 다크가 캐노니컬, 라이트는 "홀로 글라스"로 semantic.css:83-156에서 재매핑.

> 이 테마는 터미널/HUD 미학이 DNA다. 영문 모노 시스템 코드(`SYS//AETHER-HUD`, `MOD//BTN`, 좌표 리드아웃, boot console)는 지문이 아니라 DNA로 보존·강화 대상. **단, 본문 카피까지 전부 영문인 것은 별개 문제다(아래 3-1).**

---

## 2 · 강점 Top 3 (살리고 더 밀어붙일 것)

### 2-1. 모범적인 토큰 규율 — 하드코딩 색상이 사실상 0
- components/*.css 1,548줄 전체에서 토큰 우회 hex는 **단 1곳** (display.css:325 `.code-block { background:#050B14 }`). 나머지는 전부 `var()` 경유.
- 라이트 테마도 semantic 레이어에서만 재정의(semantic.css:83-156, 252-262) — README:183-197의 "브랜드 재스킨은 semantic만 덮으면 된다"는 주장이 실제로 성립하는 드문 케이스.
- **밀어붙이기**: 이 규율을 유지한 채 모티프의 밀도만 올리면 됨. 리스킨 안전성이 보장되어 있어 과감한 시각 실험 비용이 낮다.

### 2-2. 재사용 가능한 HUD 모티프 유틸 체계
- `.bracket-frame`/`.panel>.brackets`(base.css:226-262), `.scan-host`(288-297), `.stream-host`(300-309), `.coord-frame`(charts.css:73-78), `.reticle`(81-82), `.gauge/.radial/.meter/.readout/.ticker` — "데이터가 장식"이라는 원칙이 클래스 하나로 어느 요소에나 이식 가능한 형태로 구현됨.
- index.html 히어로(101-132)의 coord-frame 4모서리 텔레메트리 + boot console + 회전 레티클 조합은 실제 프로덕트 히어로급.
- **밀어붙이기**: 이 유틸들이 아직 '카드 내부'에만 머묾. 뷰포트 스케일(화면 전체 프레임, 가장자리 눈금자)로 승격하면 진짜 콕핏이 된다(§5).

### 2-3. 768줄 바닐라 인터랙션 엔진의 a11y 깊이
- app.js: focus trap + 포커스 복원(378-399), `aria-sort` 갱신(555-558), 탭 roving focus(108), ESC 계층 처리, `RM` reduced-motion 가드 5곳(16, 58, 70, 80, 471, 676-677).
- 버튼 hover 스캔 신(buttons.css:40-49), loading 스캔 상태(126-145), 토스트 진행바 RM 분기(app.js:471) — 상태 설계가 테마 서사("시스템이 살아있다")와 일치.
- **밀어붙이기**: 이 엔진 위에 시그니처 모션(부트 캐스케이드 전 페이지 확장, 브래킷 확장 호버)을 얹기만 하면 됨.

---

## 3 · AI 지문 (DNA와 무관하게 배어든 것)

### 3-1. ★최우선★ pages/ 9개 전부 한글 0자 — `lang="ko"` 선언과 100% 영문 본문의 모순
- 검증: 9개 페이지 전부 한글 문자 수 0 (grep 계수). 반면 index.html은 완전 한글화되어 있음.
- 모든 페이지가 `<html lang="ko">`(각 파일 2행)인데 본문·버튼·레이블·빈상태·토스트까지 전부 영문:
  - dashboard.html:25 "Skip to content", :55 "Command Dashboard", :85-88 "Active Units / Threat Index / Energy Output", :168 "Fleet Registry", :169 "Filter units…"
  - pricing.html:41 "Choose Your Clearance", :57 "For solo operators & evaluation.", :60-64 "Up to 5 units…"
  - product.html:82 영문 마케팅 문단, :127 영문 탭 본문
  - 404.html:32 "The sector you requested is outside known space…", :45-61 빈상태 3종 전부 영문
  - onboarding.html:46 "Register Identity" 등 4스텝 전부, :120 "Console online. Welcome aboard, Commander."
  - **app.js가 생성하는 카피도 영문**: 484 "Signal received.", 533 "executed.", 659 "COPIED / Buffer written to clipboard.", 267 `aria-label="Remove"`
- **처방**: 본문/버튼/레이블/빈상태/토스트/JS 생성 문구는 전부 한글화. 단 **HUD 시스템 코드는 영문 모노 유지가 DNA** — `SYS//`, `MOD//BTN`, `RDR//360`, 좌표(`LAT 37.5665`), boot console(`> INIT core.kernel`), 콜사인(`NX-Valkyrie`), 배지 코드(`TIER-5`)는 남긴다. 기준: "승무원이 읽는 말은 한글, 기계가 뱉는 코드는 영문 모노". index.html(108-131)이 정확히 이 균형의 레퍼런스다.

### 3-2. 죽은 서재 잔재 — Noto Serif KR을 import만 하고 어디서도 안 씀
- tokens.css:10 `@import`에 `Noto+Serif+KR:wght@400;500;600;700` 포함. 전체 코드베이스 grep 결과 사용처 0.
- 세리프는 이 테마의 명시적 금기 무드("warm/retro 금지")와 충돌하는 서재 관성의 흔적이며, 4개 웨이트 웹폰트 다운로드 낭비. **import에서 제거.**

### 3-3. 예측 가능한 대칭 카드그리드 관성 — HUD인데 레이아웃은 얌전한 관리자 템플릿
- index.html 01→07 섹션이 동일한 `gallery-section`(35행: 동일 padding-block) + `section-head` 패턴의 수직 반복 — 컴포넌트 진열대 공식. 쇼케이스 허브라 어느 정도 불가피하나 섹션 간 리듬 변화(폭·배경·밀도)가 전무.
- pricing.html:12-13 센터 정렬 히어로 + `repeat(3,1fr)` 대칭 3티어 — 어느 테마에나 있는 요금제 공식 그대로. HUD적 재해석(예: 클리어런스 등급 승인 콘솔, 등급별 스캔라인 밀도 차) 없음.
- dashboard.html도 kpi-grid → 2col → 3col → 테이블의 표준 어드민 적층. 대각선·오버랩·그리드 파괴가 0. "Cut, never rounded"가 컴포넌트 레벨에만 있고 **페이지 구도 레벨에는 없다.**

### 3-4. (경미) 균질 간격 리듬
- 카드 패딩(`--card-pad` 단일값), 섹션 패딩, 그리드 갭이 페이지 전반에서 균일 — 위계 강조 지점(히어로 게이지, 위협 패널)조차 같은 스케일. 긴장감 있는 크기 대비(초대형 숫자 리드아웃 vs 초소형 코드)가 index 히어로 밖에서는 약함.

> 참고: 크림/종이 톤, 세리프 헤딩, 문서형 배경 등 '서재 지문'은 3-2의 죽은 import 외에는 **없음**. 배경 분위기(hex-grid + scanline + radial gradient)도 이미 존재. 이 테마의 지문은 "언어"와 "구도 관성"에 집중되어 있다.

---

## 4 · 프로덕션 결함

### 4-1. ★알려진 렌더 버그★ SVG stroke/fill HTML 속성에 var() 직접 사용 — 3곳
- **pages/product.html:50** `<svg class="hero-svg" … stroke="var(--color-primary)" …>` → `style="stroke:var(--color-primary)"` 또는 `stroke="currentColor"` + 부모 color로 교체
- **pages/product.html:53** `<circle … fill="var(--color-primary)"/>` → 동일 교체
- **app.js:265** file-upload 파일행 아이콘 문자열 `stroke="var(--color-primary)"` → `stroke="currentColor"`로 바꾸고 `.file-row svg { color: var(--color-primary) }` CSS 추가
- (radial의 `style="stroke:var(--color-success)"`(onboarding.html:82)는 style 속성이라 정상 — 이 패턴이 올바른 형태)

### 4-2. 랜드마크/스킵링크 불일치
- dashboard.html:51 — `id="main"`이 `<div class="main-area">`. `<main>` 요소 없음 (product/settings/pricing/profile은 `<main id="main">`으로 올바름)
- 404.html:24 — `<div class="lost-wrap" id="main">`, `<main>` 없음
- onboarding.html — **skip-link 자체가 없고** `<main>` 랜드마크도 없음 (body 직속 div)
- kanban.html:31 — skip-link가 `#board`(navbar 포함 셸 전체)를 가리켜 스킵 효과 없음

### 4-3. 커스텀 라디오/선택 위젯 키보드 미지원
- product.html:87-89 `.opt-chip` — `<span role="radio" tabindex="0">`인데 클릭 리스너만 존재(product.html:152-154). Space/Enter/화살표 무반응 → 키보드 사용자는 옵션 변경 불가
- onboarding.html:60-63 `.choice` — 동일 패턴(:123 클릭만). role=radiogroup의 화살표 순회도 없음
- product.html:59-62 `.thumb` — `<div cursor:pointer>` + 클릭만, tabindex 없음 → 키보드 접근 자체가 불가

### 4-4. ARIA 참조/시맨틱 모순
- onboarding.html:45,57,68,79 — 위저드 패널 4개가 `role="tabpanel"`인데 대응하는 `tablist/tab`·`aria-labelledby`가 없음 → role 제거 or `aria-label` 붙인 순수 `<section>`으로
- product.html:71-77 — `role="img" aria-label="5 out of 5 stars"` 내부에 `<button tabindex="-1">` 5개 — img 역할 안에 인터랙티브 자식은 모순. 정적 표시는 button 대신 span으로

### 4-5. 라이트 테마 미보정 토큰 (semantic.css:83-156에 재정의 누락)
- `--reticle` — data-URI 안 `stroke='%2322E0FF'` 하드코딩. 라이트에서 밝은 시안 레티클이 흰 배경 위에 뜸(히어로·404에서 거의 안 보임). 라이트용 `#0892B5` 버전 필요 (hex-grid/scanline은 이미 152-153에서 재정의된 것과 대비되는 누락)
- `--data-stream` — `rgba(34,224,255,…)` 그대로 → `.scan-host`/`.stream-host` 스윕이 라이트에서 워시아웃
- `--ring-amber`(tokens.css:278-280) — 오프셋 링이 `var(--navy-900)` 고정. 라이트에서 흰 배경 위 검은 테두리 링 발생 (`--ring-cyan`은 147-149에서 재정의됨)
- `--glow-amber-md/--glow-red-md/--glow-green-md`, `--inset-glow`의 다크 기준 알파도 라이트 미세 보정 여지
- dashboard.html:98 — 차트 gradient `stop-color="#22E0FF"` 하드코딩 → 라이트 전환 시 area만 다크용 시안 유지. `stop-color`를 CSS로 옮기거나(`.chart stop { stop-color: var(--color-primary) }` — stop-color는 CSS 프로퍼티라 var 가능) 라이트 보정 추가

### 4-6. 취약한 차트 gradient 의존
- charts.css:20 `.chart .area { fill: url(#cyanArea); }` — 전역 컴포넌트가 **페이지 로컬 SVG id**에 의존. `#cyanArea`를 정의한 SVG가 없는 페이지에서 `.area`는 무채색/투명으로 조용히 깨짐. 컴포넌트 CSS에서 id 계약을 문서화하거나 `<defs>`를 공용 인라인 스니펫으로 승격 필요

### 4-7. 기타
- index.html:687 허브 캘린더 — 전월 날짜를 `31-first+i+1`로 산출(2026-06, 전월 31일 전제 magic number). 데모지만 월 바꾸면 즉시 틀림
- dashboard.html:66-79 ticker — `aria-hidden="true"`인데 실데이터 6종 포함. 장식 취급은 가능하나 동일 정보가 본문에 항상 존재하는지 확인 필요(현재 KPI와 일부만 중복). hover 일시정지(charts.css:66)는 잘 되어 있음
- 404.html:31 `.lost-sub`의 `⚠` 문자가 스크린리더에 "warning sign"으로 읽힘 — aria-hidden 스팬 분리 권장
- 상태 커버리지 자체는 우수: disabled/invalid/hover/focus-visible/empty/loading 모두 존재 (forms.css:66-71,146,167,192 / buttons.css:114-145 / display.css empty-state / 404.html 빈상태 3종)

---

## 5 · 대담화 기회 (프로 디자이너의 "한 방")

### 5-1. 뷰포트 스케일 콕핏 프레임 — 카드 속 HUD를 화면 전체 HUD로
지금 브래킷/coord-frame은 전부 카드 내부(§2-2). 모든 페이지 공통으로 **뷰포트 4모서리 고정 브래킷 + 가장자리 눈금자(ruler tick, 얇은 mono 눈금) + 상단 중앙 상태 스트립**을 `position:fixed; pointer-events:none; aria-hidden`레이어로 추가. 사용자가 '화면이라는 유리' 안쪽을 보고 있다는 착각이 완성됨. base.css의 atmosphere 레이어(70-95) 바로 위 z-index로 얹으면 됨.

### 5-2. 전 페이지 부트 시퀀스 승격 + 브래킷 마이크로인터랙션
- index 히어로에만 있는 `data-boot` 캐스케이드(app.js:80대, `hud-boot-flicker`)를 **모든 페이지의 진입 시그니처**로: 패널들이 순차적으로 flicker-in (reduced-motion 시 즉시 표시 — 가드 이미 존재).
- 카드/버튼 hover 시 `--bracket-size`가 14px→20px로 벌어지고 `--bracket-color` 글로우가 상승하는 트랜지션 — "타깃 락온" 감각. `.bracket-frame`에 transition 한 줄 + hover 변수 오버라이드로 구현 가능.

### 5-3. 위협 상태 글로벌 모드 — 팔레트가 서사를 입는 순간
헤더의 "THREAT DELTA"(dashboard.html:86)를 장식에서 **시스템 상태**로: `<html data-alert="amber|red">` 속성 하나로 `--color-primary`→앰버/레드 계열로 전환(semantic 레이어 오버라이드 — §2-1 덕분에 전체가 따라옴), 배너 klaxon 펄스 + 스캔라인 밀도 증가. 데모 토글(콘솔 잠금 옆) 하나로 "이 시스템은 재스킨이 아니라 상태 전이를 한다"를 증명 — 기억에 남는 한 방.

### 5-4. 404를 인터랙티브 수색 장면으로
현재 404는 센터 정렬 + 대칭 empty-card 3개(404.html:41-63)로 가장 얌전한 페이지. 레티클이 **포인터를 추적**(mousemove → transform, RM 시 고정)하며 화면을 수색하고, 지나간 자리에 hex-grid가 잠깐 밝아지는 스포트라이트 마스크. "신호를 찾는 중"이라는 카피와 행동이 일치하게 됨.

### 5-5. 구도 파괴 — 대각선 컷과 오버랩
- pricing: featured 티어를 `--clip-tab` 대각 컷 + 다른 티어보다 위로 오버랩(음수 마진) + 스캔 스윕 상시 가동으로 승격. 3열 대칭 공식 탈피
- dashboard: 게이지·레이더 위젯이 카드 경계를 뚫고 나오는 오버랩(카드 밖으로 -12px), KPI 숫자를 `--text-5xl` mono로 급격히 키워 크기 긴장 부여
- product: hero 스키매틱 SVG에 치수선·인출선(leader line)을 애니메이션으로 그려나가는 "분해도" 연출(이미 stroke-dasharray 인프라 존재, charts.css:25-26)

### 5-6. 홀로그램 수차(chromatic aberration) 디스플레이 타이틀
h1/디스플레이 텍스트에 ±1px 시안/마젠타 text-shadow 오프셋 + 간헐적 `hud-boot-flicker` 재생으로 '투사된 빛' 질감. RM에서 정적 섀도만 유지. 히어로·404·모달 타이틀에만 절제 적용.

---

## 6 · 한글 폰트 페어링

**현재 기록** (tokens.css:10 import / 190-192 스택):
| 역할 | 라틴 | 한글 페어 |
|---|---|---|
| `--font-display` | Orbitron, Rajdhani, Saira | **Do Hyeon** (+Noto Sans KR 폴백) |
| `--font-sans` | Rajdhani, Saira, Segoe UI | **Gothic A1** 400/500/700 (+Noto Sans KR) |
| `--font-mono` | Share Tech Mono, JetBrains Mono | **Nanum Gothic Coding** 400/700 (+Noto Sans KR) |

**판정**: 페어링 선택 자체는 DNA 적합 — Do Hyeon의 각진 컨덴스드 산세리프는 Orbitron의 테크 디스플레이 무드와 맞고, Nanum Gothic Coding은 텔레메트리 mono에 자연스러움. 서재풍 세리프 페어링 아님. **보존.** 단 3가지 결함 수정 필요:

1. **★폴백 순서 버그로 한글 무드 폰트가 사실상 무효★** — tokens.css:190-192에서 시스템 폰트가 한글 폰트보다 앞에 위치:
   - `--font-display`: `…'Saira', system-ui, "Do Hyeon", …` → **system-ui가 한글 글리프를 먼저 렌더**하므로 Do Hyeon 도달 불가
   - `--font-sans`: `…'Segoe UI', system-ui, -apple-system, "Gothic A1", …` → Gothic A1 동일하게 무효
   - `--font-mono`: `…ui-monospace, 'SFMono-Regular', Menlo, "Nanum Gothic Coding", …` → 시스템 mono는 한글 미포함이라 통과될 수 있으나 환경 의존적
   - **수정**: 한글 폰트를 라틴 웹폰트 바로 뒤, 시스템 폰트 앞으로 이동. 예: `'Orbitron','Do Hyeon','Rajdhani',system-ui,sans-serif`
2. **Noto Serif KR 죽은 import 제거** (tokens.css:10) — §3-2
3. **페이지에 한글이 0자라 페어링이 실제로 렌더된 적이 없음** — §3-1 한글화 후 Do Hyeon 헤딩의 트래킹(`--tracking-wider`가 한글에서 과할 수 있음 — 한글은 0.06~0.12em 수준으로 별도 보정 권장)과 Gothic A1 본문 가독성을 실기기에서 검증할 것. 한글 대문자 개념이 없으므로 `text-transform: uppercase` 요소들의 한글 대체 표기(굵기·트래킹으로 위계) 기준도 함께 정의 필요.

---

## 구현 우선순위 요약 (구현 에이전트용)

1. **P0** — pages/ 9개 + app.js 생성 문구 한글화 (§3-1, "승무원 말=한글 / 기계 코드=영문 mono" 기준 준수)
2. **P0** — 한글 폰트 폴백 순서 수정 + Noto Serif KR import 제거 (§6-1,2)
3. **P0** — SVG var() 3곳 교체 (§4-1)
4. **P1** — 랜드마크/skip-link 4건, 커스텀 radio 키보드, tabpanel/rating role 정리 (§4-2~4-4)
5. **P1** — 라이트 테마 누락 토큰(reticle/data-stream/ring-amber) + 차트 gradient (§4-5,4-6)
6. **P2** — 대담화: 뷰포트 콕핏 프레임, 전 페이지 부트 캐스케이드, 위협 모드, 404 레티클 추적, pricing/dashboard 구도 파괴 (§5)
