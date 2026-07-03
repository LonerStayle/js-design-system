# 감사 브리프 — theme-08-vaporwave

- **감사일**: 2026-07-04
- **테마 경로**: `design-systems/theme-08-vaporwave/`
- **파일 규모**: HTML 10개 (index + pages 9) · CSS 16개(tokens/semantic/base/styles + components 12) · app.js 873줄
- **핵심 판정 요약**: 씬(scene) 연출·토큰 설계·접근성 엔지니어링은 30개 테마 중 상위권 수준. 그러나 **데모 페이지 9개 전부가 100% 영문**(한글 0줄)이라는 치명적 프로젝트 방향 위반과, **SVG 속성 var() 렌더 깨짐 버그 30여 곳**, **모바일 레이아웃 미대응 4개 페이지**가 프로덕션 결함으로 존재. 대담화 여지는 "씬은 훌륭하나 페이지 구도가 얌전하다"에 집중됨.

---

## 1 · DNA 요약

**정체성**: 80·90년대 소비자 테크 낙관주의를 VHS 테이프와 신스웨이브 노을로 필터링한 "인터페이스로 구현한 향수". 페이지 배경 자체가 하늘(노을 그라디언트)이고, 그 위에 원근 그리드 바닥·밴딩된 선 디스크·별·스캔라인·필름 그레인이 고정 씬으로 깔린다 (README.md §1, base.css:188-328, app.js:27-48 자동 주입).

**명시된 규칙 (주석/README에 박혀 있는 것 — 구현 시 반드시 준수)**:
- "Sunset, not flat color — **Never a flat fill**" (README.md:38) — 배경은 항상 그라디언트 하늘.
- "**No flat grey shadows**" (tokens.css:263) — 그림자는 전부 컬러 네온 글로우(`--shadow-glow-*`, `--glow-*`).
- 그라디언트/크롬 텍스트는 "**LARGE headings only — never body**" (base.css:140, semantic.css:34 "never gradient for body") — 본문은 항상 고대비 단색.
- 반경은 8–12px 글로시 미디엄 라운드, "no hard brutalist corners" (tokens.css:244-253, `--radius-md:10px`).
- `prefers-reduced-motion`에서 그리드 스크롤·선 상승·스캔라인·크롬 shimmer·aberration 전부 정지 (base.css:440-459, 12개 컴포넌트 파일 전체에 개별 블록 존재).
- 다크(황혼)가 기본 무드, 라이트는 "pastel dawn" (semantic.css:8-11).

**시그니처 기법 재고 목록**: `.text-neon`/`.text-chrome`(크롬 shimmer 애니메이션)/`.text-aberration`(색수차 고스트+호버 지터) (base.css:140-186), `.glass` 상단 시엔 글로시 표면 (base.css:333-349), Win95 레트로 `.window` 스킨 (card.css, index.html:461-474), 마젠타/시안 네온 포커스 링 (tokens.css:293-300), 포인터 패럴랙스 (app.js:51-66).

---

## 2 · 강점 Top 3 (살리고 더 밀어붙일 것)

1. **풀 앰비언트 씬 아키텍처** — 별+선+지평선 글로우+원근 그리드+스캔라인+그레인+비네트를 6개 레이어로 합성하고(base.css:191-325), app.js가 모든 페이지에 자동 주입(app.js:27-48), 테마별 FX 노브(`--fx-grid-floor`, `--fx-scanline`, `--fx-star-opacity` 등, semantic.css:73-81/145-151)로 다크/라이트 무드가 통째로 전환된다. 30개 테마 기준 "분위기 있는 배경"의 모범 사례. **이 씬 시스템을 페이지별 변주(variant)로 확장하는 것이 대담화의 지렛대.**
2. **효과가 전부 토큰화되어 있음** — 색수차 오프셋, 스캔라인 불투명도/피치, 그레인, 그리드 스크롤 속도까지 노브화(tokens.css:154-172, 317-320). README §6 "3줄로 cyber-lime 재스킨" 예시(README.md:197-204)가 실제로 성립하는 구조. 증폭 작업 시 CSS 재작성이 아니라 토큰 튜닝+신규 유틸 추가로 안전하게 밀어붙일 수 있다.
3. **접근성 엔지니어링의 밀도** — 라이트 테마에서 primary 채도를 일부러 700레벨로 떨어뜨려 AA를 확보한 흔적(semantic.css:116 주석, CHECKLIST.md:61-62 "magenta-400 fill failed at 2.5:1 before the fix"), CSS-only 요금 토글에도 `#billing:focus-visible ~ .row .switch__track { box-shadow: var(--ring-pink) }`(pricing.html:37)까지 챙김, 모달/드로어/⌘K 포커스 트랩+복원(app.js:99-180). 대담화 작업이 이 수준을 후퇴시키면 안 된다.

---

## 3 · AI 지문 (테마 DNA와 무관하게 배어든 것)

### 3-1. [치명] 데모 페이지 9개 전부 영문 — 프로젝트 방향(국내용·한글 중심) 정면 위반
- pages/*.html 9개 모두 `<html lang="en">`이고 **한글이 단 한 줄도 없음** (grep 검증: 404/dashboard/inbox/kanban/onboarding/pricing/product/profile/settings 전부 hangul-lines=0). index.html만 `lang="ko"` 한글화 완료.
- 인물·데이터도 전부 서구권: "Ava Reyes / Growth Lead"(dashboard.html:85-86), "Mira Kovač, Devon Tran, Sofia Lindqvist…"(dashboard.html:373-429), "Nova Reyes / nova@neonride.io"(onboarding.html:74-81), "Aurora Platform"(profile.html:200,295-296).
- **조치**: 9개 페이지 전면 한글화(lang="ko", 한국 인명·원화 표기·국내 서비스 맥락). 단 vaporwave 장식 텍스트(SUNSET.EXE, OUTRUN, 카타카나 등)는 DNA이므로 유지.

### 3-2. [높음] JS·컴포넌트 내장 문구가 영문 dev-tool 톤
- app.js:82 `lbl.textContent = t === "light" ? "Dawn" : "Dusk"` — index.html:543의 한글 라벨 `<span data-theme-label>저녁</span> 모드`를 테마 토글 시 **영문 "Dusk 모드"로 덮어써 한/영 혼종 발생 (실버그)**.
- app.js:245-246 토스트 기본값 "Signal received / Transmission logged to the grid", app.js:431 ⌘K placeholder "Type a command or search…", app.js:433 "No matching commands", app.js:406-417 커맨드 팔레트 그룹/라벨 전부 영문("Navigate", "Fire a test toast"), app.js:198 toast region `aria-label="Notifications"`, app.js:218 `aria-label="Dismiss"`.
- **조치**: app.js 내 사용자 노출 문자열 전부 한글화(무드는 유지: "신호 수신됨 · 그리드에 기록되었습니다" 식으로 vaporwave 카피로).

### 3-3. [중간] hero + 카드그리드 공식의 반복 · 균질 리듬
- index.html 구조가 정확히 "센터 정렬 hero(50-77) → 토큰 카드 그리드(89-176) → 컴포넌트 카드 나열(190-507) → 3×3 데모 카드 그리드(519-529)". 모든 카드가 같은 radius(`--card-radius`)·같은 그림자(`--card-shadow`)·같은 `--space-5/6` 간격이라 씬은 화려한데 **전경 구도는 리포트처럼 얌전함**. stat-card 4종 그리드는 index.html:299-324와 dashboard.html:166-210에 거의 동일 패턴으로 중복.
- 모든 데모 페이지가 "사이드바(또는 navbar) + 카드 그리드" 동일 골격. 오버랩·비대칭·대각선 요소가 전무 (씬의 sun disc만 예외).
- **조치**: §5 대담화 항목으로 해소.

### 3-4. [낮음] 인라인 스타일 남발 — 페이지가 컴포넌트 진열대라는 방증
- index.html 인라인 style 133개, product.html 91개, pricing.html 78개, inbox.html 72개. 테이블 체크박스는 `style="position:static;opacity:1;width:16px…"` 해킹이 12회 이상 복붙(index.html:416-427, dashboard.html:361-428) — `.checkbox--table` 같은 변형 클래스가 없어서 생긴 지문.
- **조치**: 반복 인라인 패턴(테이블 체크박스, 카드 서브타이틀 폰트 크기 등)을 컴포넌트 변형으로 승격.

### 3-5. [판정 유보 — 지문 아님] Cormorant Garamond 세리프 악센트
- `display-serif` 이탤릭(base.css:132-138)은 언뜻 '서재 관성'으로 보이나, vaporwave는 그리스 조각상·로만 세리프 키치가 정식 미학 요소이므로 **DNA로 판정, 유지**. 단 현재는 "우아한 부제" 용도로만 얌전하게 쓰여서(index.html:56, 404.html:36) 키치함이 없음 — §5-4처럼 조각상/클래시컬 키치 방향으로 과감하게 재해석할 것.

---

## 4 · 프로덕션 결함

### 4-1. [P0 — 렌더 깨짐] SVG 프레젠테이션 속성에 var() 직접 사용 (알려진 버그)
CSS var()는 SVG의 HTML 속성값에서 무효 → 속성 자체가 무시됨. `stroke` 기본값은 none이라 **아이콘이 통째로 안 보이고**, `stop-color` 무효 시 그라디언트가 검정으로 깨진다.
- **dashboard.html:231-232** `<stop … stop-color="var(--magenta-400)">` / `stop-color="var(--cyan-400)"` — 매출 차트 라인 그라디언트 깨짐.
- **dashboard.html:235-236** areaGrad의 stop-color 2개 — 면 채움 깨짐.
- **dashboard.html:268** `<g fill="var(--cyan-400)">` 데이터 포인트, **:270** 마지막 포인트 `stroke="var(--magenta-400)"`.
- **pricing.html:138,142,146,182,186,190,194,198,225,229,233,237,241** 플랜 기능 목록 체크 아이콘 `stroke="var(--mint-400)"` 13곳 + **:287-336** 비교 테이블 체크 아이콘 `stroke="var(--mint-400)"` 11곳 — 체크마크 전멸 위험.
- **수정 방법**: `style="stroke:var(--mint-400)"` 또는 `stroke="currentColor"` + 부모에 `color:var(--mint-400)`; `<stop>`은 `style="stop-color:var(--magenta-400)"`로.

### 4-2. [P0 — 반응형 깨짐] 고정 컬럼 인라인 그리드에 모바일 대응 부재
nav.css의 @media 768 블록(nav.css:599-644)은 **navbar만** 접고 `.sidebar`는 어떤 브레이크포인트에서도 접히지 않음. 페이지 로컬 `<style>`도 profile.html(:10-16, 900px에서 1컬럼)과 pricing.html 둘뿐.
- **dashboard.html:14** `grid-template-columns:var(--sidebar-width) 1fr` — 390px 폰에서 248px 사이드바가 화면 63% 점유.
- **kanban.html:14** 동일 패턴.
- **inbox.html:59** `grid-template-columns:220px 360px 1fr` 3-pane — 모바일에서 완파.
- **product.html:60** `1.1fr 1fr`, **:219** `280px 1fr` — 폴백 없음.
- **dashboard.html:213** `1.7fr 1fr` 차트 2컬럼 — 동일.
- CHECKLIST.md:102 "All responsive ✅" 주장은 **허위** — 감사에서 반증됨.
- **수정 방법**: profile.html 방식의 페이지 로컬 @media 또는 base.css에 `.app-shell` 레이아웃 유틸 신설 + 768px에서 사이드바 오버레이 드로어화.

### 4-3. [P1 — 깨진 링크] kanban.html:39 `href="calendar.html"`, :43 `href="team.html"` — 존재하지 않는 파일. (pages/ 전체 href 목록 대조로 확인. 조치: `#` 처리 + `aria-disabled` 또는 실제 존재 페이지로 연결.)

### 4-4. [P1 — 잘못된 HTML] index.html:419 `<th class="is-sortable" data-sort="number" class="table__cell--num">` — **class 속성 중복**. 두 번째가 무시되어 MRR 컬럼 우측 정렬 상실.

### 4-5. [P1 — 한/영 혼종 실버그] app.js:82가 index.html:543의 한글 테마 라벨을 "Dawn/Dusk"로 덮어씀 (§3-2와 동일 항목, 결함으로도 등재).

### 4-6. [P2 — 대비 의심] `--color-text-subtle`(#9c8bc4, 다크 4.7:1)이 카드 밖 **그라디언트 하늘 바로 위**에서 사용되는 곳: 404.html:164-173 푸터, index.html:538 푸터, dashboard.html:505-507 푸터. 다크 노을 그라디언트는 하단이 #ff6ad5(핫핑크, tokens.css:115)까지 밝아지므로 페이지 하단 푸터에서 AA 미달 가능. 뷰포트가 짧거나 스크롤 위치에 따라 배경 명도가 변하는 구조라 **solid 배경 패널 위로 옮기거나 text-muted로 승격 필요**.
- 같은 이유로 `--ring-pink`의 오프셋 색 `rgba(12,8,24,0.9)`(tokens.css:295-300)이 라이트 테마에서도 어두운 헤일로로 남음 — 라이트에서 오프셋을 밝은 색으로 재정의하는 게 정석.

### 4-7. [P2 — 포커스 시 반경 뭉개짐] base.css:78-84 전역 `:focus-visible { border-radius: var(--radius-sm) }` — pill 버튼(`--radius-pill`)·스위치 트랙·아바타(원형)에 키보드 포커스 시 6px 모서리 링이 씌워져 형태 불일치. 컴포넌트별 focus 규칙이 있는 곳은 덮이지만 없는 곳(뱃지 tabindex=0, index.html:393 툴팁 영역 등)에서 노출.

### 4-8. [P3 — 잔결함 모음]
- base.css:120 `var(--weight-500, 500)` — `--weight-500` 토큰은 미정의(실제는 `--weight-medium`). 폴백으로 살아있으나 오타.
- dashboard.html:363 `.table__sort`에 "▲" 하드코딩 vs index.html:417은 빈 span+CSS — 정렬 인디케이터 구현 불일치.
- dashboard.html:228 차트 y/x 라벨 `font-family="monospace"` 속성 하드코딩 — 토큰(`--font-mono`) 우회.
- tokens.css:181 `--font-body` 첫 항목 "Chillax"는 어디서도 로드되지 않는 유령 폰트(웹폰트 import에 없음).
- onboarding.html:85 데모 비밀번호 `value="Sunset2049!"` 하드코딩 노출 + CHECKLIST.md:145 인정대로 강도 미터가 정적(가짜) — 데모 관례상 허용 범위이나 라이브 스코어링 훅이 있으면 좋음.
- 상태 커버리지 자체는 우수(전 컴포넌트 hover/active/disabled/focus-visible/loading, empty state 6종 별도 페이지) — 누락 없음 확인.

---

## 5 · 대담화 기회 (프로 디자이너라면 밀어붙일 것)

1. **VHS 삽입 시퀀스 — "한 방"**: 페이지 최초 로드 시 1회, hero 영역에 VHS 트래킹 에러 글리치(가로 슬라이스 2~3개가 ±4px 어긋났다 복구 + 색수차 순간 증폭 `--aberration-offset-strong`)와 모노 폰트 OSD 오버레이(`▶ PLAY · SP 0:00:00 · 1988.06.21`)를 띄웠다가 사라지게. 이미 있는 `--aberration-*`, `--scanline-*` 토큰과 `.text-aberration` 지터 keyframe(base.css:175-180)을 재사용하면 저비용. `prefers-reduced-motion`에선 OSD 정적 표시만. 모든 페이지에 공통 적용하면 시스템 전체의 시그니처 모션이 된다.
2. **페이지별 씬 변주 시스템**: 지금은 10개 페이지가 완전히 동일한 씬(중앙 sun + 46% 그리드). `data-scene="dusk|midnight|dawn|lost"` 속성 하나로 변주: dashboard=태양 없는 midnight(별+그리드만, 데이터가 주인공), pricing=sun disc가 추천 플랜 카드 **바로 뒤에** 겹치도록 위치 이동(카드가 태양을 등진 실루엣 연출), 404=태양이 지평선에 절반 가라앉은 상태 + 그리드 라인 일부 끊김. `--fx-*` 노브가 이미 준비돼 있어 semantic.css에 scene별 오버라이드 블록만 추가하면 됨.
3. **그리드 파괴·오버랩 구도**: (a) pricing 추천 플랜을 `rotate(-1.5deg)` + 이웃 카드 위 12px 오버랩 + `--shadow-glow-lg`로 띄우고 "RECOMMENDED" 크롬 리본을 카드 밖으로 삐져나가게. (b) index hero의 "NEW RETRO" 타이포를 `--text-7xl`(112px) 이상으로 키우고 sun disc와 텍스트가 서로 겹치게 z-순서 재배치(텍스트가 태양을 가로지르는 아웃런 포스터 구도). (c) profile 배너에 그리스 조각상 라인아트(inline SVG) + 세로쓰기 카타카나 장식을 우측 오버플로우로 배치.
4. **Vaporwave 정통 코드 주입 (한글화와 병행)**: 본문은 한글로 전환하되, 장식 레이어에 전각 라틴(`ＶＡＰＯＲＷＡＶＥ`), 카타카나(`ニュー・レトロ`), `Ｗｉｎｄｏｗｓ９５` 윈도우 타이틀, "지금 재생 중 ▶ 시티팝" 같은 한글+아이콘 카피를 심는다. `.display-serif`는 조각상 pull-quote 전용으로 승격: 404 페이지에 대리석 흉상 SVG + Cormorant 이탤릭 인용구 풀블리드 섹션 추가 — §3-5의 세리프를 '키치'로 재무장하는 작업.
5. **호버 색수차의 전면화**: button.css 헤더 주석(:7-8)은 "faint magenta/cyan chromatic-aberration shadow"를 시그니처로 선언했지만 실제 구현은 글로우뿐. `.btn--primary:hover`에 `box-shadow: -2px 0 0 rgba(255,106,213,.5), 2px 0 0 rgba(45,226,230,.5)` 계열의 RGB 스플릿 더블 섀도를 추가하고, 카드 인터랙티브 호버에는 로컬 스캔라인 오버레이(::after에 repeating-gradient) 강화 — "호버=신호 간섭"이라는 일관된 마이크로인터랙션 언어 완성.
6. **차트를 네온 오실로스코프로**: dashboard 차트(4-1 수정과 함께)에 CRT 잔광 효과 — 라인 아래 동일 path를 blur(8px)+opacity 0.4로 한 겹 더, 데이터 포인트에 `--glow-cyan` 펄스(reduced-motion 제외). y축 라벨을 `--font-mono` 토큰으로 통일.

---

## 6 · 한글 폰트 페어링

**현재 기록** (tokens.css:13 import / :177-184 스택):
| 역할 | 라틴 | 한글 페어링 | 판정 |
| --- | --- | --- | --- |
| 디스플레이 | Orbitron (+Audiowide) | **Do Hyeon** (도현) | ✅ 탁월 — 도현의 각진 레트로 간판체가 Orbitron의 와이드 지오메트릭과 무드 일치. 보존. |
| 세리프 악센트 | Cormorant Garamond italic | **Nanum Myeongjo** 400/700/800 | ✅ 보존 — vaporwave 조각상 키치 맥락에서 정당(§3-5). 단 이탤릭 부재하므로 한글엔 weight 대비로 표현할 것. |
| 본문 | Outfit | **Gothic A1** 400/500/700 (+Noto Sans KR 폴백) | ✅ 보존 — 중립적이고 가독 안정. |
| 모노 | IBM Plex Mono | Noto Sans KR 폴백 (tokens.css:183) | ⚠️ 허용 — 숫자·코드가 주 용도라 실害 적음. 여유 있으면 Nanum Gothic Coding 검토(선택). |

**핵심 문제는 페어링이 아니라 사용처**: 페이지 9개에 한글이 없어서 이 페어링이 index.html에서만 동작 중. 한글화(§3-1) 완료 시 자동으로 전면 가동되는 구조(스택에 이미 포함)이므로 **폰트 교체 불필요, 페이지 한글화가 선행 과제**. 참고: `--font-display` 스택에서 한글 글리프는 ui-sans-serif/system-ui(한글 미보유)를 지나 Do Hyeon에 도달하는 per-glyph 폴백에 의존 — 의도대로 동작하나, 확실성을 위해 Do Hyeon을 system-ui 앞으로 당기는 것도 안전한 선택.

---

## 구현 우선순위 제안 (이 브리프만 보고 작업할 때)

1. **P0**: §4-1 SVG var() 30여 곳 수정 (dashboard 6곳 + pricing 24곳) — 렌더 깨짐.
2. **P0**: §3-1/§3-2 페이지 9개 + app.js 문자열 전면 한글화 (`lang="ko"`, 한국 맥락 데이터, app.js:82 라벨 "새벽/저녁").
3. **P0**: §4-2 dashboard/kanban/inbox/product 모바일 레이아웃 (profile.html:10-16 패턴 참조).
4. **P1**: §4-3 깨진 링크, §4-4 중복 class, §4-7 포커스 반경.
5. **대담화**: §5-1 VHS 삽입 시퀀스 → §5-2 씬 변주 → §5-3 구도 파괴 → §5-5 호버 색수차 순.
6. **불변 조건**: §1의 명시 규칙(플랫 필 금지, 회색 그림자 금지, 그라디언트 텍스트=대형 헤딩 한정, reduced-motion 전면 대응, AA 대비)과 §2의 접근성 수준은 어떤 작업에서도 후퇴 금지.
