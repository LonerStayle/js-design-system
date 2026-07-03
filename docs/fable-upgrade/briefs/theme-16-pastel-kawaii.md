# 감사 브리프 — theme-16-pastel-kawaii

- 감사일: 2026-07-04
- 테마 경로: `design-systems/theme-16-pastel-kawaii/`
- 파일 규모: index.html(647줄) + pages 9개 + components 6개 CSS + app.js(600줄), HTML 총 10개
- 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 전부 명시했다. **원본 스냅샷 대비 DNA(파스텔·라운드·모티프·바운스)는 절대 훼손 금지.**

---

## 1. DNA 요약

**정체성 한 줄**: "둥근 모든 것 위에 반짝이가 떠다니고, 누르면 통통 튀며 반짝인다" (README.md:21) — 하이키 파스텔 × 통통한 라운드 × 하트/별/반짝이 스티커 미학의 일본 카와이 감성.

핵심 규칙(README.md:10-21, tokens.css 주석 기준):

| 축 | 규칙 | 근거 |
|---|---|---|
| 색 | 6램프(핑크/민트/라벤더/피치/스카이/버터) × 50~900, 뉴트럴은 **차가운 회색 금지 → warm plum-gray** | tokens.css:19-102 (`--neutral-*` 주석 "not cold gray, keeps kawaii warmth") |
| 형태 | 아주 큰 라운드(`--radius-lg: 24px` "DNA 핵심: 20~28"), 버튼/배지 알약형 `--radius-full` | tokens.css:196-203 |
| 모티프 | 하트·별·반짝이·큐트페이스 인라인 SVG data-URI 토큰 + 도트/깅엄/컨페티 패턴 | tokens.css:108-132 |
| 모션 | 호버=통통 바운스(overshoot `--ease-emphasized`), active=눌림(`--shadow-inset`), 클릭=반짝이 버스트 | tokens.css:282-285, buttons.css:36-56, app.js:47-76 |
| 타이포 | Baloo 2(display) + Quicksand(body), 둥근 폴백 `ui-rounded` | tokens.css:158-159 |
| 접근성 강제 | 파스텔 위 텍스트는 700~900 진한 톤(4.5:1↑), 파스텔 위 파스텔 텍스트 금지, reduced-motion 전면 대응 | semantic.css:6, base.css:397-408, CHECKLIST.md:97-121 |

**주의**: 이 테마의 DNA는 인쇄·서적 미학이 아니다. 크림/종이 톤, 세리프 헤딩, 얌전한 문서 레이아웃은 어떤 형태로든 DNA 근거가 없으며 발견 즉시 지문으로 취급한다(→ 3장 Noto Serif KR 임포트 참조).

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 시그니처 마이크로인터랙션이 이미 '시스템'으로 존재
- 클릭 반짝이 버스트: `app.js:47-76` (`burst()`, `data-sparkle` 글로벌 트리거, `prefersReduced` 존중 app.js:12,49)
- 버튼 호버 시 코너 스파클 등장: `buttons.css:44-56` (`.btn::after`에 `--motif-sparkle`)
- 토글 켤 때 버스트(app.js:330-332), 스텝퍼 증가 시 미니 버스트(app.js:374), 별점 클릭 버스트(app.js:390)
- FAB float-bob + 호버 rotate: `buttons.css:172-190`
→ 단발 장식이 아니라 "누르면 반짝인다"는 규칙이 전 컴포넌트에 깔려 있음. **이걸 테마의 간판으로 더 증폭할 것** (5장 ①).

### ② 모티프·패턴까지 토큰화한 촘촘한 3계층 아키텍처
- 원시(tokens.css) → 시맨틱(semantic.css:9-171) → 컴포넌트 토큰(semantic.css:80-171) 완전 분리, 모티프/패턴/그라데이션까지 전부 CSS 변수(tokens.css:108-132, 243-249)
- 다크모드가 단순 반전이 아니라 "뮤트 플럼-네이비 위 파스텔 포인트"로 재설계됨(semantic.css:176-289) — 다크에서도 카와이 유지
- warm plum-gray 뉴트럴(tokens.css:91-102), 핑크 기 도는 보더(semantic.css:45-48) — 회색 오염 없는 일관된 온도. 프로다운 선택.

### ③ 세계관 몰입형 실데이터 카피 (filler 없음)
- product.html: "모찌상점" 세계관으로 리뷰 4건(작성자·날짜·옵션 뱃지까지, product.html:339-377), 장바구니 합계 계산(product.html:502-513), 카드할인가·재고·배송정책(product.html:176-247)
- 404.html: 빈 상태 4종이 각각 상황별 안내 + 다음 액션 2개씩(404.html:152-213)
- 대시보드 "오늘의 살림살이 ♡"(dashboard.html:155), 한국어 큐트 톤 일관("길을 잃었나 봐요 🥺" 404.html:106)
→ 30개 테마 중에서도 카피 완성도가 높은 편. 리라이트 금지, 유지·확장만.

---

## 3. AI 지문 (DNA와 무관하게 배어든 'AI가 만든 티')

### 지문 A — 안 쓰는 Noto Serif KR 4웨이트 임포트 (서재 감성 관성의 잔재)
- `tokens.css:9` — `@import`에 `Noto+Serif+KR:wght@400;500;600;700` 포함. **전체 코드베이스에서 사용처 0건** (font 스택 tokens.css:158-160 어디에도 없음).
- 카와이 DNA에 세리프는 근거가 전혀 없다. 성능 낭비 + "일단 세리프를 넣고 보는" AI 관성의 화석.
- **조치**: 임포트에서 Noto Serif KR 제거.

### 지문 B — 모든 섹션이 동일한 '센터 정렬 eyebrow + h2 + p → 카드 그리드' 리포트 공식
- index.html:91-94(`기초`), 176-179(`라이브러리`), 501-504(`쇼케이스`) — 세 섹션 모두 `.section-head`(base.css:367-369, 중앙정렬 고정) + `.eyebrow`(base.css:119-126, **uppercase + tracking-widest** — 카와이가 아니라 SaaS 리포트 문법) + 균질 카드 그리드.
- 404.html:97, 147, 222의 eyebrow는 심지어 영문("Oops · …", "Empty States", "Maybe you're looking for…") — 국내용·한글 중심 원칙과 어긋나는 dev-tool 습관.
- **조치**: eyebrow를 uppercase 영문 라벨 대신 기울어진 스티커 배지·리본 조각 등 카와이 어휘로 교체하고, 섹션 헤더 구도에 비대칭/오버랩 도입(5장 ②).

### 지문 C — 일러스트 전면 이모지 대체 (플레이스홀더 아트)
- index.html:638 페이지 카드가 "그라데이션 박스 + 3rem 이모지"(📊🗂️✉️…) 공식으로 JS 주입, product.html:136-144 상품 갤러리도 🐰🧸🎀, 굿즈 카드도 🐻🔑📔(product.html:398-442).
- 카와이 무드에 이모지가 어울리긴 하나, OS마다 렌더가 다르고 "일러스트 만들 능력이 없어 이모지로 때움"이라는 전형적 AI 티. 자체 모티프 토큰(하트/별/페이스)이 있는데 정작 히어로·상품 아트에 활용 안 됨.
- **조치**: 시그니처 SVG 마스코트 1종(모찌 토끼) 제작해 히어로/404/빈상태/상품 갤러리에 표정 변형으로 배치(5장 ③).

### 지문 D — 균질한 간격·구조 리듬 + 인라인 스타일 남발
- 스탯 카드 4개가 완전히 동일한 내부 구조·크기(dashboard.html:197-245), 리듬 파괴 요소 0.
- 인라인 `style=` 사용: index.html 81곳, profile.html 62곳, dashboard/product 각 52곳 — "프로덕션급 토큰 시스템" 표방(README.md:171-180)과 모순되는 원샷 생성 흔적. 반응형 결함의 직접 원인이기도 함(4장 ⑦).
- **조치**: 반복 인라인 스타일을 유틸/컴포넌트 클래스로 승격(특히 grid-template-columns, stat-value 타이포).

---

## 4. 프로덕션 결함 (파일:라인 필수 수정 목록)

### ④-1 [렌더 깨짐] SVG stroke/fill HTML 속성에 var() 직접 사용 — 9곳
알려진 버그: SVG presentation attribute에서 `var()`는 동작하지 않음 → fill 검정/stroke 미적용으로 렌더 깨짐. `style="fill:var(...)"` 또는 `currentColor`+부모 color로 교체할 것.
- `index.html:317` — `<path fill="var(--pink-500)">` (스티커 카드)
- `pages/dashboard.html:286` — `fill="var(--pink-500)"`
- `pages/settings.html:214` — `fill="var(--pink-500)"`, `pages/settings.html:625` — `stroke="var(--color-danger)"`
- `pages/inbox.html:405` — `fill="var(--butter-400)" stroke="var(--butter-500)"`, `:466` — `stroke="var(--pink-600)"`, `:471` — `stroke="var(--mint-600)"`, `:519` — `stroke="var(--pink-800)"`
- `pages/profile.html:204` — `stroke="var(--pink-600)"`

### ④-2 [반응형 깨짐] 인라인 grid-template-columns가 미디어쿼리를 무력화
- `pages/dashboard.html:248` `style="grid-template-columns:1.6fr 1fr;"`, `:444` `1.4fr 1fr` — 인라인이라 base.css:384-394의 브레이크포인트가 못 덮음 → 모바일(≤680px)에서도 2열 유지, 바차트/도넛 압착. 페이지 `<style>`(dashboard.html:12-66)에도 override 없음.
- **조치**: 페이지 CSS 클래스로 옮기고 1024px/680px에서 1열 전환.

### ④-3 [깨진 참조]
- `pages/404.html:135` → `../index.html#orders`, `:137` → `../index.html#settings` — index.html에 해당 앵커 없음(존재 id: tokens/components/pages/main 뿐).
- `pages/404.html:35` — `var(--radius-3xl, 2.5rem)`: `--radius-3xl` 토큰 미존재(tokens.css 최대 `--radius-2xl`). 폴백으로 살아있지만 토큰 정합성 위반 → `--radius-2xl`로 교체.

### ④-4 [a11y] 포커스 가능한 요소가 aria-hidden 안에 갇힘
- `pages/product.html:454-460` — `.carousel-dots`에 `aria-hidden="true"`인데 내부는 `aria-label` 붙은 `<button>` 5개. 키보드 포커스는 닿는데 스크린리더에는 숨겨짐(WCAG 위반). aria-hidden 제거하거나 dots를 표시 전용으로.

### ④-5 [a11y] 테이블 정렬 키보드 접근 불가
- `app.js:463-479` — `th.sortable`에 click만 바인딩. `components/data.css:26`도 cursor:pointer만. th에 tabindex/버튼/keydown 없음 → 키보드 사용자는 정렬 불가. th 내부에 `<button>` 래핑 or `tabindex="0"`+Enter/Space 처리 + `aria-sort`는 이미 있음(app.js:470).

### ④-6 [a11y] segmented 컨트롤 ARIA 오용 + 페이지 간 불일치
- `index.html:210`, `pages/kanban.html:148`, `pages/inbox.html:229` — `role="tablist"`인데 자식 button에 `role="tab"` 없음(무효 ARIA 트리).
- `pages/product.html:200`, `pages/dashboard.html:255`, `pages/settings.html:547`, `pages/pricing.html:92` — `role="group"`인데 자식에 `aria-selected` 사용(`aria-selected`는 tab/option/row 전용, group 내 button에는 `aria-pressed`가 맞음). app.js:338-349의 initSegmented도 aria-selected만 토글.
- **조치**: radiogroup(role="radio"+aria-checked) 또는 aria-pressed 패턴으로 통일.

### ④-7 [a11y] 별점 위젯 키보드 조작 불가 + role 오용
- `index.html:281` — `.rating`에 `role="slider" aria-valuenow=…` 선언했으나 app.js:382-395 initRatings는 mouseenter/click만 바인딩, 화살표 키 처리 없음. slider role은 화살표 조작을 약속함 → 거짓 ARIA. 개별 button 방식(각 별이 aria-label 가진 버튼)으로 role 정리 or keydown 구현.

### ④-8 [기능 누락] 알림 배너 닫기 버튼이 죽어 있음
- `pages/dashboard.html:191-193` — `.alert-close` 버튼 존재, overlays.css:20-21에 스타일도 있으나 **app.js 어디에도 핸들러 없음**(grep 0건) → 클릭해도 안 닫힘. `[data-dismiss]` 델리게이션 1줄 추가로 해결.

### ④-9 [a11y] 모달 포커스 트랩 부재
- `app.js:131-148` — openOverlay가 첫 focusable에 focus만 주고 Tab 순환 트랩 없음(`"Tab"` keydown 처리 0건). `aria-modal="true"`(index.html:540) 선언과 불일치 — Tab이 배경 콘텐츠로 새어나감.

### ④-10 [다크모드] 라이트 고정색 패턴이 다크에서 그대로 노출
- `--pattern-dots`(tokens.css:126, #FFD1E3/#E2D5FF 고정)·`--pattern-gingham`(tokens.css:129, 흰 바탕 하드코딩)이 semantic.css 다크 블록(176-289)에서 재정의되지 않음. `.surface-soft`(base.css:190-194)·`.bg-gingham` 사용 구간이 다크에서 라이트 패턴 그대로 → 위화감/대비 붕괴. 다크용 `--bg-pattern` 오버라이드 추가할 것.
- 부수: 하드코딩 색 다수는 경미하나 토큰 우회 — display.css:108,206,216,238 / forms.css:123,191,243,251 / overlays.css:73 / buttons.css:145.

### ④-11 [폰트 로딩] 한글 폰트가 실제로는 거의 적용되지 않는 스택 순서
- `tokens.css:158-159` — Jua/Gowun Dodum이 `'Segoe UI', system-ui` **뒤에** 위치. Safari 등에서 system-ui가 시스템 폴백 캐스케이드로 한글(Apple SD Gothic Neo)을 그려버려 무드 한글폰트가 무력화됨. 6장 참조(스택 순서 교정 필수).
- 또한 pages의 Google Fonts `<link>`(예: product.html:9)는 Baloo 2/Quicksand만 로드 — 한글 폰트는 tokens.css의 @import(렌더 블로킹)에만 의존. `<link>`로 통일 권장.

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 지점)

### ① 버스트를 '모티프 파티클'로 승격 + 미사용 커서 토큰 회수 — 시그니처 한 방
- 현재 버스트 파티클은 **단색 사각형/원**(app.js:59-63)이다. 하트/별/반짝이 모티프 토큰(tokens.css:114-120)이 있는데 정작 간판 인터랙션이 안 쓴다. 버스트 파티클을 `--motif-heart/star/sparkle` SVG로 교체하면 "누르면 하트가 터진다"는 진짜 카와이 시그니처가 완성됨.
- `--z-cursor: 900`(tokens.css:262)이 **정의만 되고 전 코드베이스에서 미사용** — 원래 계획했던 커스텀 커서/포인터 트레일의 유령 토큰. 마우스 이동 시 은은한 반짝이 트레일(reduced-motion 시 정지)로 회수하면 토큰 부채도 해소.
- 기억점: "이 테마는 클릭할 때마다 하트가 터지고 커서 뒤로 별가루가 남는다."

### ② 히어로·섹션 헤더의 그리드 파괴 — '스티커북/캔디샵' 구도
- 현재 히어로(index.html:50-86)는 중앙정렬 배지+제목+버튼+숫자 4개의 전형적 AI 공식. 데코 5개(51-55)는 절대좌표로 얌전히 흩어놓은 수준.
- 제안: (a) 오버사이즈 마스코트/모티프가 화면 우측 하단을 크게 침범하는 비대칭 구도, (b) 통계 4개를 각기 다른 각도로 기울어진(rotate -6°~8°) 다이컷 스티커 카드로 오버랩, (c) 섹션 경계를 직선 border(index.html:174) 대신 물결(scalloped) SVG 마스크로 — 카와이 문법으로 그리드를 부수는 것.
- `.sticker`(display.css:31-43)는 이미 rotate(8deg) 스티커 개념이 있음 — 흰 다이컷 외곽선(`--border-3` 4px는 "스티커 외곽선 느낌"이라고 토큰 주석에 명시, tokens.css:210)을 실제로 쓰는 곳이 없다. 카드/배지에 다이컷 흰 테두리+drop-shadow를 입혀 스티커북 미학을 전면화.

### ③ 이모지 아트 → 자체 모찌 토끼 마스코트 SVG 시스템
- `--motif-face`(tokens.css:123)를 확장해 표정 3~4종(기본 ^^, 놀람, 시무룩 404용, 하트눈)을 가진 마스코트 SVG를 만들고: 히어로 메인 아트, 404의 face 슬롯(404.html:101 — 이미 face 모티프 자리 있음), 빈 상태 4종, product 갤러리(🐰 대체)에 투입. OS 이모지 의존 제거 + 브랜드 각인.

### ④ 배경 분위기 레이어 — '별사탕 하늘'
- 현재 body 배경은 radial 3개 고정(base.css:29-33)으로 평면적. 제안: (a) 섹션별로 도트/깅엄/컨페티 패턴 로테이션(현재 `--pattern-confetti`는 footer 한 곳뿐, index.html:513), (b) 스크롤에 살짝 다른 속도로 움직이는 구름/캔디 blob 레이어 1장(transform 기반, reduced-motion 제외), (c) **다크모드 전용 '밤하늘 별사탕' 배경**(진플럼 위 twinkle 별 — @keyframes twinkle은 이미 base.css:249-252에 존재하나 다크 배경에 미활용).

### ⑤ 히어로 타이포 젤리 로고타입
- `.display`(base.css:111-117)는 크기만 큰 평범한 제목. 카와이 로고타입 문법대로 글자별 미세 rotate/translateY 오프셋(span 분해 or CSS :nth-child)+호버 시 글자가 개별 pop-bounce, 강조 단어 아래 물결 squiggle 언더라인(SVG). Jua가 실제 적용되면(4장 ④-11 수정 후) 한글 제목의 통통함이 살아나 효과가 배가됨.

### ⑥ 온보딩/프라이싱에 '뽑기(가챠)' 모먼트
- pricing 월/연 토글(pricing.html:92)이나 onboarding 완료 단계에서 캡슐토이가 열리며 혜택/축하 모티프가 쏟아지는 1회성 딜라이트 연출(기존 burst 재사용) — 테마 데모의 클라이맥스로 기억에 남는 장면 1개 확보.

---

## 6. 한글 폰트 페어링

| 역할 | 현재 스택 (tokens.css:158-160) | 판정 |
|---|---|---|
| display | Baloo 2 → Quicksand → ui-rounded → Segoe UI → system-ui → **Jua** → Noto Sans KR | 페어링 자체는 탁월(Jua = 통통 라운드 한글, Baloo 2와 무드 일치). **순서 결함** |
| body | Quicksand → Varela Round → ui-rounded → Segoe UI → system-ui → **Gowun Dodum** → Noto Sans KR | 동일 — Gowun Dodum(둥근 고딕)도 무드 적합. **순서 결함** |
| mono | Cascadia Code → Fira Code → ui-monospace → … → Noto Sans KR | 무난, 유지 |

- **보존**: Jua(디스플레이) + Gowun Dodum(본문) 페어링은 카와이 DNA에 정확히 맞음. 교체 불필요.
- **필수 수정 1 (순서)**: 한글 폰트를 `system-ui`/`Segoe UI` **앞**으로 — `'Baloo 2', 'Jua', 'Quicksand', 'Noto Sans KR', ui-rounded, system-ui, sans-serif` / `'Quicksand', 'Gowun Dodum', 'Noto Sans KR', ui-rounded, system-ui, sans-serif`. 현재 순서로는 Safari 등에서 시스템 한글 폴백이 먼저 잡혀 무드 폰트가 사실상 미적용(4장 ④-11).
- **필수 수정 2 (죽은 세리프)**: `tokens.css:9`의 Noto Serif KR 4웨이트 임포트 삭제 — 사용처 0, 서재 감성 관성의 잔재(3장 지문 A).
- **권장**: 한글 폰트도 각 HTML의 `<link>` 프리로드로 이관(@import 렌더 블로킹 제거), `display=swap` 유지.

---

## 부록 — 수정 우선순위 요약 (구현 에이전트용)

1. **P0 렌더/기능**: SVG var() 9곳(④-1) · 한글 폰트 스택 순서(④-11/6장) · 대시보드 인라인 그리드(④-2) · alert-close 핸들러(④-8) · 깨진 앵커/토큰(④-3)
2. **P1 a11y**: carousel-dots aria-hidden(④-4) · th 정렬 키보드(④-5) · segmented ARIA 통일(④-6) · rating role 정리(④-7) · 모달 포커스 트랩(④-9) · 다크 패턴 오버라이드(④-10)
3. **P2 지문 제거**: Noto Serif KR 삭제(A) · eyebrow 영문/uppercase 탈피(B) · 인라인 스타일 클래스 승격(D)
4. **P3 대담화**: 모티프 파티클 버스트+커서 트레일(①) → 스티커북 히어로 구도(②) → 마스코트 SVG(③) → 밤하늘 다크 배경(④) → 젤리 로고타입(⑤) → 가챠 모먼트(⑥)
