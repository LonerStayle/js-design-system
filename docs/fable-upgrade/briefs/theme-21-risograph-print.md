# 감사 브리프 · theme-21-risograph-print

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-21-risograph-print/`
- HTML 페이지 수: 10 (index + pages 9)
- 파일 구성: tokens.css(266) · semantic.css(232) · base.css(446) · styles.css(18, @import 진입점) · components/ 6파일 · app.js(836) · index.html(445) · pages 9종

---

## 1. DNA 요약

**정체성**: 형광 스폿 잉크 2~4도(플루오 핑크 `#FF48B0` · 블루 `#2B45FF` 주축 + 옐로/그린), 따뜻한 뉴스프린트 종이 위에 오버프린트(multiply)·미스레지스터(정합 어긋남)·하프톤 도트·그레인을 토큰화한 **인쇄소 진(zine) 미학**. "디지털의 매끈함을 거부"가 명시된 컨셉(index.html:54).

**명시된 규칙** (README/tokens 주석에 박제):
- **그라데이션·소프트(블러) 섀도 금지** — 깊이는 하드 오프셋 `--shadow-flat`으로만 (README.md:18, tokens.css:207-215). 유일한 예외는 `--shadow-press`(희미한 종이 눌림 inset).
- **오버프린트** = `mix-blend-mode: multiply`로 제3색 생성, 다크모드는 `screen`으로 발광 전환 (base.css:184-208, index.html:411,424).
- **미스레지스터** = 2/3/5px 어긋난 색 레이어, 호버 시 슬립 강조 (tokens.css:116-119, base.css:210-243).
- **하프톤** = 중간톤을 도트 밀도로 표현, `--halftone` + currentColor (tokens.css:121-127).
- **접근성 규칙 내장**: "형광 위 형광 금지, 형광 채움 위 텍스트는 잉크블랙/종이톤 고정, 본문 4.5:1" (semantic.css:8-10, README.md:111).
- **모션** = "프레스가 찍는" 짧고 기계적인 모션, `--ease-stamp` 오버슈트 (tokens.css:250-259).
- 이 테마는 **인쇄 미학이 DNA 그 자체**이므로 종이 톤 배경·mono 스탬프 라벨·인쇄 용어 카피는 지문이 아니라 자산이다. 문제는 "AI가 만든 문서" 느낌이 아니라 "프로 스튜디오 인쇄물" 수준으로 못 미치는 지점들(아래 3장).

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 리소 시그니처가 데코가 아니라 '시스템'으로 토큰화되어 있다
- `--grain-texture`(feTurbulence SVG data-URI) → `body::before` 전면 그레인 + 느린 드리프트 (tokens.css:107-111, base.css:77-99)
- `.overprint-*` / `.misregister` / `.misregister-block` / `.halftone-fill` / `.ink-edge--rough` 유틸 체계 (base.css:180-279)
- 다크모드에서 multiply→screen 자동 전환, 카드 오프셋 그림자가 잉크블랙→**형광 블루 잉크**로 캐스팅되는 디테일 (semantic.css:146-150) — 이건 진짜 프로다운 결정. **보존 + 확대**.

### ② CSS만으로 그린 리소 포스터 아트 (이미지 0장)
- product.html:19-63 `.poster` 시스템: 종이 스톡 + 오버프린트 블롭 2~3개 + 국소 그레인 + 대형 타이포로 상품 이미지를 통째로 '인쇄물'로 생성. 스폿 조합 변형 4종(`--pb/--yg/--gp/--bp`)을 커스텀 프로퍼티로 스위칭 (product.html:60-63). 캐러셀·썸네일·관련상품까지 재사용.
- 다크모드에서도 포스터는 밝은 종이 스톡을 유지해 multiply가 탁해지지 않게 처리 (product.html:97-100). **이 패턴을 다른 페이지(프로필 배너, 대시보드 히어로)로 수출할 것.**

### ③ '프레스 감각' 마이크로인터랙션이 이미 시그니처 수준
- 버튼: hover 시 색분리 고스트가 2px 슬립(`::before` multiply), active 시 스탬프처럼 눌리며 그림자 붕괴 (buttons.css:39-61)
- `data-reprint` 재인쇄 플래시(크로마틱 미스레지스터 필터 애니메이션, base.css:430-437), `data-misregister-auto` 호버 슬립, `--ease-stamp` 오버슈트
- 인프라도 견고: 오버레이 스택+포커스 트랩+포커스 복원(app.js:58-99,772-776), aria-sort 정렬(app.js:381-384), reduced-motion 전면 대응(base.css:397-410), no-JS/FOUC 방어(`html.js [data-reveal]`, base.css:417-427)

---

## 3. AI 지문 (DNA와 무관하게 배어든 것) — 파일:라인 근거

### ③-1. [심각] 한글 타이포가 사실상 'AI 기본값'으로 렌더된다 — 무드 폰트가 죽어있음
- tokens.css:18 에서 Do Hyeon·Gothic A1·Noto Sans KR·**Noto Serif KR**를 임포트하지만,
- 폰트 스택에서 한글 폰트가 전부 `system-ui` **뒤**에 배치됨 (tokens.css:27-31):
  ```
  --font-display: "Bricolage Grotesque","Archivo","Helvetica Neue","Arial Narrow",system-ui,"Do Hyeon","Noto Sans KR",sans-serif;
  --font-sans: "Archivo","Helvetica Neue",Helvetica,system-ui,"Gothic A1","Noto Sans KR",sans-serif;
  ```
  macOS/Windows에서 `system-ui`가 한글 글리프를 먼저 공급(Apple SD Gothic Neo/맑은 고딕)하므로 Do Hyeon·Gothic A1은 **도달 불가능한 죽은 코드**. 한글 제목·본문이 시스템 고딕으로 찍힘 → "진 포스터"가 아니라 "기본 웹앱" 타이포.
- **Noto Serif KR(4웨이트)은 어떤 스택에서도 참조되지 않는 완전 미사용 임포트** (tokens.css:18) — 서재풍 세리프 관성의 잔재이자 로딩 낭비. 제거 대상.

### ③-2. [중] 복붙 데이터·공식형 페이지 구성이 그대로 노출
- **대시보드와 프로필의 스탯이 동일 수치 복붙**: "총 인쇄 부수 48,210 / +12.4%"가 dashboard.html:87-88 과 profile.html:165-166 에 그대로 반복. 스파크라인 폴리라인 좌표도 dashboard.html:89 ↔ profile.html:171 이 사실상 동일 계열. 실데이터처럼 보이려면 페이지별 수치·기간을 어긋나게 할 것.
- 모든 앱 페이지가 "4-스탯카드 행 → split 차트 → 테이블" (dashboard.html:84-192), "배너 → 4-스탯카드 → 탭" (profile.html:115-198)의 균질 공식. pricing은 3플랜+월/연 토글+비교표+FAQ 아코디언의 교과서 공식 (pricing.html 전체). 리듬 파괴 없음.
- 간격 리듬 균질: 섹션 전부 `--space-12`, 카드 갭 전부 `--space-6`, 대칭 grid--2/3/4 (base.css:324-349). 비대칭 그리드는 `.poster-grid`(1.6fr 1fr) 단 하나.

### ③-3. [중] 얌전한 히어로 구도 — 블롭이 전부 오른쪽 구석에 정렬
- index.html:408-410 히어로 블롭 3개가 모두 `right:` 기준으로 우상단·우하단에만 모여 있고 본문 텍스트 영역과 전혀 겹치지 않음. 404는 사방 배치(404.html:26-29)로 더 낫지만 여전히 콘텐츠와 오버랩 없음. "정합이 어긋난 인쇄"를 말하면서 레이아웃은 한 치도 안 어긋나 있는 자기모순.

### ③-4. [경미] 영문 dev-tool 문구·라벨 잔재
- 404.html:137,153,168,186 — 빈 상태 카드 배지가 `Search` / `Inbox` / `Editions` / `Error` 영문 그대로.
- profile.html:118 — eyebrow가 `EDITION · CREATOR PROFILE` (한국어 UI 안에서 영문 문장).
- index.html:27 내비게이션 `문서` 링크와 index.html:329 푸터가 **README.md / CHECKLIST.md 원본 파일로 직링크** — 브라우저에선 마크다운 소스가 그대로 노출되거나 다운로드됨. 데모 제품이 아니라 '개발 산출물'임을 자백하는 링크. (mono 스탬프 영문 라벨 `PRINTED, NOT RENDERED` 같은 인쇄 카피는 DNA로 허용)

---

## 4. 프로덕션 결함 — 파일:라인

### ④-1. [버그 확정] SVG stroke/fill HTML 속성에 var() 직접 사용 — 렌더 깨짐 알려진 버그 (8곳)
`style="stroke:var(...)"` 또는 CSS 클래스/currentColor로 교체할 것:
- pages/dashboard.html:89 `stroke="var(--fluoro-pink-500)"` (스파크라인)
- pages/dashboard.html:100 `stroke="var(--fluoro-blue-500)"`
- pages/profile.html:171 `stroke="var(--fluoro-pink-500)"`
- pages/profile.html:177 `stroke="var(--fluoro-blue-500)"`
- pages/settings.html:433 `stroke="var(--color-danger-ink)"` (위험 영역 경고 아이콘)
- pages/inbox.html:202 `stroke="var(--ink-black)"` (별표 아이콘)
- pages/inbox.html:241 `stroke="var(--ink-black)"`
- pages/inbox.html:320 `fill="var(--fluoro-yellow-500)" stroke="var(--ink-black)"` (fill·stroke 둘 다)

### ④-2. [FOUC] 다크 테마 사용자에게 흰 화면 플래시
- 테마 복원이 `app.js`(defer) 의 `Theme.init`(app.js:22-32)에서 실행됨. index.html:8 인라인 스크립트는 `js` 클래스만 세팅. localStorage에 dark가 저장된 사용자는 매 페이지 로드마다 라이트→다크 플래시. `<head>`에 3줄짜리 인라인 테마 복원 스니펫을 10개 HTML 전부에 추가할 것.

### ④-3. [대비] AA 경계·미달 지점
- **danger 버튼**: 라이트 모드 `--color-danger: var(--fluoro-pink-600)`(#e5269a) 위 `--color-danger-fg: paper-white` (semantic.css:61-62) ≈ **4.2:1** — 버튼 텍스트는 14px bold uppercase(large text 기준 미달)라 AA 4.5:1 실패. pink-700(#b81b7b, 흰 글자 대비 ≈6.0:1)로 낮추거나 fg 재검토.
- **`--color-text-subtle`**(#8a8369, semantic.css:27)이 라이트 배경(#f4f1e6) 위 ≈ **3.3:1** — placeholder(semantic.css:195), `.screen-no`(index.html:432), sidebar 섹션 라벨(navigation.css:57) 등에 사용. 장식·placeholder라 치명적이진 않으나 neutral-600 쪽으로 한 단계 어둡게 조정 권장.
- CHECKLIST.md:79 자체 인정: axe/Lighthouse 정량 재검증 미실시. 전면 그레인(`body::before`, opacity 0.5 multiply, base.css:87-88)이 콘텐츠 **위에** 깔리므로 측정 도구 기준으로 대비가 추가 하락할 수 있음 — 검증 필요.

### ④-4. [상태/컴포넌트 누락]
- **입력 에러 상태가 정의만 되고 시연이 0곳**: `.input[aria-invalid="true"]`·`.field__error` 정의(forms.css:20-26,61-66)는 있으나 10개 HTML 어디에도 `aria-invalid`/`field__error` 사용 예 없음. 온보딩·설정 폼에 에러 시나리오 1개 이상 배치할 것.
- **칸반 키보드 재정렬 불가** (kanban.html:148-181 포인터 드래그 전용) — CHECKLIST.md:80 에서 자인. 최소한 카드에 ↑/↓ 이동 키 핸들러 또는 컨텍스트 메뉴 제공 권장.
- **product.html:222-229 평점 표시가 인터랙티브 위젯**: 읽기 전용이어야 할 상품 평점(4.0)이 `data-rating` 입력 위젯이라 클릭하면 평점이 바뀜. 표시용 정적 별로 교체.

### ④-5. [기타]
- **깨진 성격의 링크**: index.html:27,329 의 README.md/CHECKLIST.md 직링크 (③-4와 동일 항목, 수정 필수).
- **차트 축 라벨 정렬 붕괴**: dashboard.html:127-129 — 12개 막대 아래 5개 라벨(1/3/6/9/12월)을 `justify-content:space-between`으로 흩뿌려 실제 막대 위치와 안 맞음. 12칸 grid로 정렬하거나 라벨 수 일치.
- **한글 mono 폴백 부적절**: `--font-mono` 폴백이 `"Noto Sans KR", monospace` (tokens.css:30-31) — 문제까진 아니나 스탬프 라벨의 한글이 mono 톤을 잃음.
- **성능**: `body::before` 그레인이 200%×200% fixed 레이어로 상시 애니메이션 (base.css:77-90) — 저사양 모바일에서 페인트 비용. `will-change: transform` 지정 또는 모바일에서 드리프트 정지 고려. reduced-motion 대응은 이미 있음.
- 하드코딩 색상은 사실상 없음(components/*.css 전수 grep 결과 0건). semantic.css 다크 모드의 원시 hex(#0f0e0a 등)는 토큰 정의부라 정상.

---

## 5. 대담화 기회 — 프로 디자이너라면 밀어붙일 지점

### ⑤-1. 한글 진 포스터 타이포 부활 (최우선, ③-1과 연동)
- Do Hyeon(옛 간판·등사 감성의 콘덴스드 디스플레이체)을 `--font-display` 스택에서 라틴체 바로 뒤·system-ui **앞**으로 이동 → 한글 헤드라인이 즉시 진 포스터가 됨. 더 과감하게는 Black Han Sans·Paperlogy 검토.
- 히어로가 현재 영문 "RISOGRAPH PRINT"뿐 (index.html:53). 한글 초대형 헤드라인("등사 인쇄" / "형광 2도" 등)을 misregister와 함께 세우면 국내용 정체성의 '한 방'이 생김.

### ⑤-2. 인쇄소 크롬(chrome)을 시그니처로 격상
- 이미 씨앗 있음: `.reg-mark` 모서리 정합 마크 (shell.css:93-99), eyebrow 스탬프, "PRINTED, NOT RENDERED" 카피.
- 추가: **컬러 캘리브레이션 바**(형광 스폿 4색+하프톤 계조 스트립)를 푸터/페이지 헤더의 고정 시그니처로, **에디션 넘버링 도장**("№ 047/200", 살짝 회전+잉크 번짐)을 카드·히어로에, **크롭 마크·재단선**을 섹션 경계에. 모두 CSS만으로 가능.

### ⑤-3. 그리드 파괴 — "정합이 어긋난 레이아웃"
- 히어로 블롭을 좌우로 흩고 텍스트와 **오버랩**시키기(mix-blend multiply라 가독성 유지됨), 섹션 넘버(`.section-head__no`)를 초대형 아웃라인 숫자로 키워 카드 뒤로 겹치기, 스크린 카드 몇 장에 ±1.5deg 회전(404 `empty__art`의 rotate, kanban-card:active의 -1.5deg 회전이 이미 선례 — display.css:288, 404.html:55-58).
- pricing 추천 플랜을 위로 밀어올리는 수준을 넘어 **도장 찍힌 듯 기울이고 형광 스티커 배지**로.

### ⑤-4. 하프톤 포토 트리트먼트
- 아바타·프로필 배너·상품 관련 이미지에 하프톤 도트 마스크(기존 `--halftone` + radial mask, `.avatar--halftone` 선례 display.css:131-135)를 확대 적용 → 사진조차 '인쇄물'이 되는 일관성. `.halftone-fade`(base.css:254-261)는 정의만 되고 거의 안 쓰임 — 차트·히어로에 활용.

### ⑤-5. 시그니처 모션: "판이 순서대로 찍힌다"
- 페이지 로드 리빌을 지금의 fade+translateY(범용적, base.css:417-427)에서 **2도 인쇄 시퀀스**로 교체: 핑크판이 먼저 어긋나게 찍히고 → 블루판이 겹치며 정합이 맞아가는 등장. `data-reprint` 플래시(이미 있음)와 세트로 테마 유일의 기억점이 됨. reduced-motion 시 정적 유지.

### ⑤-6. 다크모드 = 야광 잉크 에디션
- 이미 형광 블루 오프셋 그림자(semantic.css:147-149)와 screen 블렌드 전환이 있음. 여기서 더: 다크에서 블롭에 미묘한 glow(하드 오프셋 원칙을 지키려면 blur 대신 screen 블렌드 이중 레이어), 배지·버튼의 형광이 살짝 '번지는' 스프레드. "밤의 인쇄소" 컨셉 카피와 함께.

---

## 6. 한글 폰트 페어링 (현재 기록 + 판정)

| 역할 | 라틴 | 한글(의도) | 실제 렌더 | 판정 |
|---|---|---|---|---|
| Display | Bricolage Grotesque | **Do Hyeon** | 시스템 고딕 (system-ui가 선점) | 페어링 자체는 DNA 적합 — **스택 순서만 고쳐 활성화** |
| Body | Archivo | **Gothic A1** (400/500/700) | 시스템 고딕 | 동일 — 활성화 필요 |
| Mono | Space Mono | Noto Sans KR 폴백 | 시스템 고딕 | 허용. 한글 mono 톤 원하면 별도 검토 |
| (미사용) | — | **Noto Serif KR 400~700** | 로드만 되고 미참조 | **제거** — 서재풍 세리프 관성 잔재 + 로딩 낭비 (tokens.css:18) |

- 임포트 위치: tokens.css:18 (한글 4종 @import) + 각 HTML `<head>` link (라틴 3종, 예: index.html:11).
- **권고**: ① Noto Serif KR 임포트 삭제 ② `--font-display`에서 `"Do Hyeon"`을, `--font-sans`에서 `"Gothic A1"`을 system-ui **앞**으로 이동 (tokens.css:27-31) ③ 한글 @import를 tokens.css 체인이 아닌 HTML `<link>`로 승격하면 로딩도 빨라짐. Do Hyeon은 웨이트 1개(400)뿐이므로 초대형 한글 헤드라인에서 굵기가 부족하면 Black Han Sans 추가 검토.
- 이 항목은 "교체"가 아니라 **"의도된 페어링의 활성화"**임 — 기존 선택 자체는 보존 가치 있음.

---

## 구현 우선순위 요약 (구현 에이전트용)

1. **P0**: SVG var() 8곳 수정(④-1) · 한글 폰트 스택 순서 수정 + Noto Serif KR 제거(③-1/6) · 다크 FOUC 인라인 스니펫 10개 HTML(④-2) · README.md 직링크 제거(③-4)
2. **P1**: danger 대비 보정(④-3) · 에러 상태 시연 추가(④-4) · 복붙 스탯 데이터 차별화(③-2) · 영문 배지/eyebrow 한글화(③-4) · 차트 축 라벨 정렬(④-5) · product 평점 정적화(④-4)
3. **P2 (대담화)**: 한글 포스터 헤드라인(⑤-1) · 인쇄소 크롬 시그니처(⑤-2) · 히어로 오버랩·그리드 파괴(⑤-3) · 2도 인쇄 리빌 모션(⑤-5) · 하프톤 포토(⑤-4) · 다크 야광 강화(⑤-6)

**절대 훼손 금지**: 오버프린트/미스레지스터/하프톤/그레인 토큰 체계, 하드 오프셋 그림자 원칙(블러 금지), 형광 위 형광 금지 규칙, 프레스 스탬프 버튼 인터랙션, 다크모드 형광 잉크 그림자, CSS 포스터 시스템.
