# 감사 브리프 — theme-01-neo-brutalism

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-01-neo-brutalism/`
- 파일 규모: HTML 10개(index + pages 9), CSS 32개(tokens/semantic/base/styles + components 28), app.js 702줄
- 총평: **토큰 아키텍처·인터랙션 완성도는 30개 테마 중 상위권. 그러나 pages 9개 전부가 영문이고, 레이아웃이 '얌전한 수직 스택'에 갇혀 있어 브루탈리즘 DNA 대비 구도가 소극적. SVG var() 렌더 버그와 죽은 모바일 버거 버튼 등 명확한 프로덕션 결함 존재.**

---

## 1. DNA 요약

**정체성**: 날것 그대로의 구조 노출 — 플랫 색면 4종(전기 블루 `#2D5BFF` / 핫핑크 `#FF3D8B` / 라임 `#B6FF3D` / 옐로우 `#FFE000`) + `#111` 잉크 / `#FFF` 페이퍼 계약, 두꺼운 검정 보더(3–4px), 모서리 0–2px, 그리고 시그니처 **하드 오프셋 그림자(blur 0)와 프레스 물리**(hover 시 떠오르고 active 시 그림자 속으로 '쾅' 눌림).

**명시된 규칙(코드 주석 기준)**:
- `tokens.css:7-8` — "Rule: gradients/blur/soft-shadow are **FORBIDDEN**. Color is applied as flat planes. Shadows are ALWAYS blur-0 hard offsets."
- `tokens.css:174-182` — 하드 섀도우 5단계(`2px`→`14px`) 전부 `Npx Npx 0 0`, blur 0 강제.
- `README.md:18-28` — 디자인 철학 표: Raw & honest / Flat color planes / Hard offset shadow / Loud type(그로테스크 700–900 + 모노 UPPERCASE) / Stickers & structure(±2° 스티커, `semantic.css:200-201` `--tilt-cw/ccw`) / Accent focus rings(4px 솔리드, `base.css:382-385`).
- 다크 모드는 계약을 **반전**: 다크 서피스 + **흰 보더 + 흰 하드 섀도우** (`semantic.css:74-122`, 특히 `:90` `--shadow-color: var(--neutral-0)`).
- `CHECKLIST.md:12-21`에 DNA 자체 감사표 존재(블러/그라데이션 grep 0건 검증 이력).

이 테마는 인쇄·서적 미학 예외 규칙에 해당하지 않음 — 크림 톤/세리프는 어떤 형태로든 DNA 근거가 없다.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **3계층 토큰 아키텍처의 완결성** — primitives(`tokens.css`) → semantic(`semantic.css:10-122`) → component tokens(`semantic.css:127-202`, `--btn-* --card-* --input-*` 등). components/ 28개 파일에서 **하드코딩 hex 0건**(grep 검증 완료), 전부 토큰 소비. 다크 모드가 토큰 재지정만으로 자동 반전되는 구조(`README.md:154-163` 재스킨 가이드). → 고도화 시 이 규율을 절대 깨지 말 것. 새 스타일도 반드시 토큰 경유.

2. **프레스 물리 시그니처의 촉각적 완성도** — `components/button.css:40-48`(hover 시 `translate(-2px,-2px)` + 그림자 확대, active 시 `translate(3px,3px)` + `--btn-shadow-press: 0 0 0 0`으로 그림자 붕괴), `base.css:342-353` `.pressable` 유틸리티, `components/modal.css:187` `modal-slam` 키프레임. 이 "눌리는 물리"는 이 테마의 한 방 후보 — 페이지 레벨 모션으로 증폭할 가치가 있음(§5 참조).

3. **인터랙션·상태 커버리지** — `app.js` 702줄 바닐라: 포커스 트랩 모달/드로어, ⌘K 커맨드 팔레트, 탭 roving tabindex(`app.js:84`), reduced-motion 존중(`app.js:38`), disabled/loading 상태(`button.css:51-59`), 빈 상태 6종 쇼케이스(`pages/404.html:188` 이하). 전역 4px 포커스 링(`base.css:382-385`)도 일관 적용. → 재고도화 중 회귀시키지 말 것.

---

## 3. AI 지문 (DNA와 무관하게 배어든 'AI가 만든 티')

### 3-1. [최우선] pages 9개 전부 영문 — 한글 0줄
- 근거: `pages/404.html:2`~`pages/profile.html:2` 전부 `<html lang="en">`. 한글 포함 줄 수 grep 결과: **9개 페이지 모두 0줄**(settings.html만 `:223` `<option>한국어</option>` 1줄).
- 영문 dev-tool 문구·미국식 필러 데이터의 전형: `dashboard.html:476-512` 고객명 Aria Whitfield / Noor Hassan / Sloane Mercer + `$1,280.00` / `Visa ··4821` / `PayPal`, `profile.html:6` `<title>Profile · Mara Voss`, `inbox.html:370` "[design-system] PR #482 needs your review", `pricing.html:131` "Start free, ship fast…".
- index.html은 이미 한글화 완료 상태(2026-06-21 작업, pages는 당시 범위 밖) — **pages 9개를 index.html과 같은 규칙으로 전면 한글화할 것**: 보이는 텍스트·aria/alt·title·placeholder 한국어화 + `lang="ko"`, 인물명 한국식, 금액 ₩, 날짜 '6월 21일' 형식. 코드/클래스명/기술 약어/워드마크(NEO//BRUTAL)는 영문 유지.

### 3-2. 죽은 세리프 임포트 — 서재 관성의 잔재
- `tokens.css:11` — `Noto+Serif+KR:wght@400;500;600;700`을 Google Fonts로 로딩하지만, 어떤 `--font-*` 스택에도 세리프가 없음(grep 0건). 브루탈리즘에 세리프는 DNA 근거 제로. **임포트에서 제거**(네트워크 낭비 + '일단 세리프도 넣어두는' AI 관성 흔적).

### 3-3. hero + 카드그리드 반복 공식 / 얌전한 리포트형 레이아웃
- `index.html`: hero(좌정렬 텍스트 스택) → stat 4-grid(`:90-95`) → 토큰 섹션 → 탭 갤러리 → 페이지 카드 3-grid(`:491-501`). 전부 동일한 `.container` 폭 + `--space-12` 섹션 패딩(`base.css:292`)의 균질 수직 리듬.
- `pricing.html:127-266`: hero → 요금제 3장(가운데 강조) → 가짜 로고 스트립 → 비교 테이블 — 교과서적 SaaS 공식 그대로.
- 브루탈리즘인데 비대칭·오버랩·그리드 파괴가 거의 없음. 유일한 일탈이 ±2° 스티커. **이건 DNA 훼손이 아니라 DNA 미달** — §5에서 증폭.

### 3-4. 성의 없는 filler 장치
- `pricing.html:257-264` — "Trusted by 12,000+ teams" + `NORTHWIND / VERTEX⌁ / PAPERTRAIL / QUANTA / HELIX◆ / DRIFTWOOD` 가짜 로고 칩. AI가 찍어내는 전형적 신뢰 배지 패턴. 한글화하면서 실감 나는 국내 가상 브랜드로 교체하거나, 브루탈리즘답게 '스탬프 찍힌 도장' 형태로 재해석할 것.
- `index.html:206` "절대 공유하지 않습니다. 약속해요." 같은 카피는 좋은 편 — 이 톤을 pages까지 확장.

### 3-5. 참고 (지문 아님)
- 모노 UPPERCASE 라벨·`⌘K`·코드블록 등 dev-tool 표현은 이 테마에서는 DNA(Loud type, 구조 노출)의 일부이므로 유지. 단 **사용자-facing 문장**까지 영문인 것이 문제.

---

## 4. 프로덕션 결함

### 4-1. [P0] SVG stroke/fill HTML 속성에 var() 직접 사용 — 알려진 렌더 깨짐 버그
`style` 속성 또는 `currentColor`로 교체 필수:
- `pages/404.html:159-165` — 깨진 체인링크 일러스트: `<rect … fill="var(--lime-500)" stroke="var(--color-border)">` 외 7개 요소 전부.
- `pages/dashboard.html:423` `<g stroke="var(--color-border-subtle)">` (그리드라인), `:431` `<polyline stroke="var(--pink-500)">`, `:434` `<polyline stroke="var(--blue-500)">`, `:437` `<g fill="var(--color-surface)" stroke="var(--blue-500)">` (라인차트 도트).
- 참고: `pages/product.html:166,176-182`의 `data-fill="var(--blue-500)"`는 JS가 `main.style.background`에 대입(`product.html:520-527`)하므로 **문제 없음** — 오탐 주의.

### 4-2. [P0] 모바일 버거 버튼이 죽은 컨트롤 (5개 페이지)
`components/navbar.css:204-209`가 768px 이하에서 `.navbar__nav`를 숨기고 버거를 노출하는데:
- `pricing.html:117`, `product.html:143`, `kanban.html:86`, `inbox.html:242` — `data-sidebar-toggle`이지만 해당 페이지에 `[data-sidebar]` 요소 0건 → `app.js:556-561`에서 null이라 no-op.
- `profile.html:133` — 아예 핸들러 속성조차 없는 `<button class="navbar__burger">`.
- 결과: **모바일에서 내비게이션 접근 불가**. 모바일 메뉴(드로어 재활용 권장)를 실제로 연결하거나 버거를 제거할 것.

### 4-3. [P1] 한글 폰트 스택 순서 버그 — 무드 폰트가 죽어 있음
- `tokens.css:115-116` — `--font-display: "Space Grotesk", "Archivo", system-ui, -apple-system, "Segoe UI", "Black Han Sans", "Noto Sans KR", sans-serif` (sans도 동일 패턴).
- `system-ui`/`-apple-system`이 **한글 무드 폰트보다 앞**에 있어, macOS에선 한글 글리프가 Apple SD Gothic Neo에서 해석되어 **Black Han Sans에 도달하지 못함**(Windows Segoe UI는 한글 미포함이라 통과 → 플랫폼별 렌더 불일치까지 발생). Phase 2 규칙(Latin → 무드한글 → Noto → generic) 위반.
- 수정: `"Space Grotesk", "Archivo", "Black Han Sans", "Noto Sans KR", system-ui, sans-serif` 순서로 재배열 (sans는 Gothic A1 기준 동일 처리, mono도 `"Noto Sans KR"` 위치 확인).

### 4-4. [P2] 기타
- **Black Han Sans 단일 웨이트(400)**: `base.css:81-92`가 헤딩에 weight 900 지정 → 한글 헤딩은 브라우저 합성 볼드(faux bold)로 렌더. Black Han Sans는 자체가 초고밀도라 `font-synthesis: none` 지정 또는 한글 헤딩용 weight 분기 고려.
- **Google Fonts @import 2회 분산**: `tokens.css:11` + `base.css:9` — 직렬 렌더 블로킹. 한 곳으로 통합 권장(Noto Serif KR 제거와 함께).
- `index.html:423` — 테이블 select-all 체크박스에 인라인 핵 `style="appearance:auto;width:auto;height:auto"` → table용 체크박스 컴포넌트 스타일 부재의 증거. `components/table.css`에 정식 스타일 추가.
- `pages/404.html:179-183` — 검색 input이 `<form>` 없이 존재, Enter 시 무동작. 데모라도 `role="search"` + 폼 래핑 권장.
- `pages/404.html:386,390` — 인라인 JS 토스트/alert 메시지가 영문("Thanks — broken link #404 logged…") — 한글화 대상.
- 상태 커버리지는 전반적으로 양호(hover/active/disabled/loading/empty/error 존재; `form.css:21,66` invalid 상태 확인). focus-visible 전역 링 + `form.css`/`menu.css` 자체 링. **캐러셀 dots(app.js 동적 생성)의 aria-label 유무만 구현 시 재확인** 요망.
- 대비: 주요 쌍 검산 결과 통과(blue-500+white ≈5.2:1, pink-600+white ≈4.6:1, lime/yellow+ink 고대비). 문제 없음.

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 지점)

전제: 프레스 물리·플랫 색면·하드 섀도우라는 자산은 이미 훌륭. 부족한 건 **구도와 스케일의 배짱**.

1. **Hero 그리드 파괴 + 초대형 한글 타이포** — `index.html:77-97`의 좌정렬 얌전한 hero를 해체: 뷰포트를 꽉 채우는 Black Han Sans 워드마크(현재 최대 `--text-7xl`=80px에 그침 → `clamp(4rem, 14vw, 12rem)`급), 단어별로 accent 색면 블록을 서로 **오버랩**시키고 일부는 컨테이너 밖으로 crop. 아웃라인(스트로크) 타이포 + 채운 타이포 혼용. "대담하게 만들고 / 날것 그대로 출시" 카피 자체를 색면 블록으로 조립.

2. **마퀴(ticker) 스트립을 시그니처 장치로** — 섹션 경계마다 `border-4` 사이에 UPPERCASE 모노 텍스트가 흐르는 띠: `BUILD LOUD ✶ SHIP RAW ✶ NO BLUR ✶ NO GRADIENTS ✶`. hover 시 정지 + 배경 yellow 반전. reduced-motion에서는 정적 반복 텍스트로. 브루탈리즘 사이트의 관용구이면서 이 시스템에 없는 요소.

3. **스탬프(도장) 모션 시그니처** — 이미 있는 `modal-slam`(`modal.css:187`)을 전 시스템 시그니처로 승격: 스크롤 진입 시 스티커·배지가 위에서 '쾅' 찍히는 stamp-in(scale 1.4→1 + 하드 섀도우 0→6px, blur 없이), 토스트 등장도 동일 물리. 카드 hover 시 그림자가 잉크→accent 색으로 바뀌는 변주(`--shadow-color` 스왑만으로 가능 — 토큰 구조가 이미 지원).

4. **섹션 전체 색면 침수** — 현재 배경 장치가 `bg-dots`/`bg-grid`(opacity .5, `index.html:12`)로 소극적. 섹션 하나를 통째로 yellow-500 또는 blue-500 플랫 색면으로 채우고(테두리 `border-6`로 절단), 그 위에 ink 보더 카드가 흰 섀도우를 갖는 반전 구성 — 다크 모드 계약(흰 보더/흰 섀도우)을 라이트 모드 한복판에 국소 적용하는 셈. pricing의 Pro 플랜, 대시보드의 히어로 stat에 즉시 적용 가능.

5. **pages 레이아웃 비대칭화** — `pricing.html`: 3장 나란히 대신 Pro 카드를 2배 크기 + 15° 스티커 클러스터 + 나머지 둘을 겹쳐 배치. `404.html`: 이미 방향성 좋음(회전 숫자 + 스티커) — 숫자를 뷰포트 초과 스케일로. `dashboard.html`: stat 카드 4개 균등 그리드 대신 1개를 2×2 스팬 히어로 stat으로.

6. **한글 카피의 브루탈리즘화** — 한글화(§3-1)를 단순 번역이 아니라 톤 재설계로: 짧고 명령형("부수고. 만들고. 출시하라."), Black Han Sans 초대형 + `.highlight`(yellow 마커) 조합. 한글 자체가 이 테마의 시각 자산이 되게.

---

## 6. 한글 폰트 페어링

| 역할 | 현재 스택 (`tokens.css:115-117`) | 판정 |
|------|------|------|
| display | Space Grotesk / Archivo → (system-ui…) → **Black Han Sans** → Noto Sans KR | 페어링 자체는 **탁월 — 유지**. 임팩트 계열 무드 폰트로 브루탈리즘 DNA에 정확히 부합. 단 §4-3 스택 순서 버그로 현재 macOS에서 **실제로는 미적용** — 순서 수정 필수 |
| sans (본문) | Archivo / Space Grotesk → (system-ui…) → **Gothic A1** → Noto Sans KR | 유지 (동일 순서 수정 필요) |
| mono | JetBrains Mono → ui-monospace… → Noto Sans KR | 유지. 한글 모노 라벨은 Noto Sans KR로 낙하 — 허용 범위 |
| serif | **Noto Serif KR 임포트만 존재, 스택 미사용** (`tokens.css:11`) | **제거** — DNA 근거 없는 서재 관성 잔재 (§3-2) |

- 추가 권장: Black Han Sans 단일 웨이트 대응(`font-synthesis-weight: none` 또는 한글 헤딩 weight 분기), Google Fonts @import 1곳 통합.
- 교체 후보 검토 결과: 불필요. Black Han Sans + Gothic A1 조합은 30개 테마 중 이 테마에 가장 잘 맞는 페어링에 속함. 살리는 것이 목표.

---

## 구현 우선순위 요약 (구현 에이전트용)

1. **P0**: pages 9개 전면 한글화(`lang="ko"`, 인물·통화·날짜 현지화, 404 인라인 JS 문자열 포함) — §3-1
2. **P0**: SVG `fill/stroke="var()"` → style 속성 교체 (404.html, dashboard.html) — §4-1
3. **P0**: 모바일 버거 5곳 실동작 연결(모바일 메뉴 드로어) — §4-2
4. **P1**: 폰트 스택 순서 수정 + Noto Serif KR 임포트 제거 + @import 통합 — §4-3, §3-2
5. **P1**: 대담화 — hero 초대형 타이포/오버랩, 마퀴 스트립, 스탬프 모션, 색면 섹션 — §5 (DNA 규칙: blur/그라데이션 금지 유지, 전부 토큰 경유)
6. **P2**: table 체크박스 정식 스타일, 404 검색 폼, faux bold 대응 — §4-4
