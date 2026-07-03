# 감사 브리프 — theme-15-scandinavian-hygge

> 감사일: 2026-07-04 · 감사 범위: README.md / CHECKLIST.md / tokens.css / semantic.css / base.css / components 6종 / index.html / pages 9종 (dashboard·product·not-found 정독, 나머지 grep 훑기) / app.js
> HTML 파일 수: **10** (index.html + pages 9)
> 테마 경로: `design-systems/theme-15-scandinavian-hygge/`

---

## 1. DNA 요약

**"오후 햇살이 드는 덴마크식 거실"** — 크림 캔버스(#F6F2EC) 위에 세이지·테라코타·더스티블루·클레이의 머티드 어스 팔레트, 12px 기본 라운딩, 브라운 톤 저채도 그림자, 리넨 그레인 텍스처, Fraunces(소프트 세리프 디스플레이) + Hanken Grotesk(휴머니스트 산세리프 본문)로 구성된 **따뜻한 미니멀리즘** 시스템.

**주의 — 예외 규칙 해당**: 이 테마에서 크림 톤·세리프 헤딩·종이 질감은 AI 지문이 아니라 **DNA 그 자체**다(README.md:12-22에 명시). 고도화 시 크림/세리프를 걷어내면 안 되고, "AI가 만든 얌전한 문서"가 아니라 **"코펜하겐 스튜디오가 만든 브랜드"** 수준으로 밀어붙여야 한다.

명시된 규칙 (README.md:17-22, tokens.css 주석, CHECKLIST.md §A·§C):
- **금지**: 네온, 하드 콘트라스트, 차가운 그레이, 순수 블랙 그림자, purple-on-white, 하드 블랙 보더 (tokens.css:6-7, CHECKLIST.md:72-73)
- **필수**: 본문/레이블 텍스트 ≥4.5:1 (머티드 팔레트임에도 — CHECKLIST.md §A에 실측치 기록), 상태는 색+아이콘/텍스트 병행, `prefers-reduced-motion` 전면 존중, 웜 브라운 그림자(tokens.css:181-195), 어스톤 포커스 링(tokens.css:199-205)
- 다크 테마 컨셉: "warm cabin at dusk" — 브라운 차콜, 순흑 금지 (semantic.css:144-147)
- 토큰 3레이어 강제: primitives → semantic → component, 마크업은 semantic/component 토큰만 소비 (README.md:72-74)

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 검증된 3레이어 토큰 아키텍처 + "따뜻함의 물리학"
- tokens.css:184-195 — 그림자를 순흑이 아닌 **웜 브라운 rgb(30 24 18)** 저알파로 정의. "lit-room glow" 주석까지. 프로다운 디테일.
- CHECKLIST.md:17-38 — 모든 텍스트 쌍의 대비율을 **실측 수치로 기록**(예: soft-fg on soft bg 6.73:1). 30개 테마 중 드물게 접근성 근거가 문서화됨.
- semantic.css 라이트/다크 대칭이 정확하고, 컴포넌트 CSS에 하드코딩 색이 거의 없음(전체 grep 결과 위반 3건뿐 — §4 참조).
- **더 밀어붙이기**: 이 토큰 규율을 유지한 채 표현 레이어만 대담하게.

### ② 순수 CSS 리넨 텍스처 + "warm cabin" 다크 테마 = 분위기의 씨앗이 이미 존재
- base.css:43-59 — 이미지 없이 radial dot + repeating-linear 실 패턴으로 리넨/종이 그레인을 전면 오버레이. 다크에서는 잉크 색만 반전(semantic.css:224-225).
- semantic.css:148-236 — 다크가 흔한 "회색 반전"이 아니라 **브라운 차콜 오두막**이라는 서사를 가짐(#1E1A15, 액센트를 300/400대로 리프트).
- **더 밀어붙이기**: 현재 텍스처는 3~11px 균일 반복이라 가까이 보면 기계적. §5-2 참조.

### ③ not-found.html의 손그림 코티지 일러스트 — 이 테마의 숨은 "한 방"
- pages/not-found.html:117-140 — 굴뚝 연기·창가 램프·잎사귀까지 그린 커스텀 라인아트 SVG(`nf-illus`). `clamp(6rem,22vw,13rem)` Fraunces 404 타이포(라인 44-53)와 함께 이 시스템에서 가장 "사람이 그린" 순간.
- 부수 강점: product.html:29-70의 sticky 갤러리 + 그라디언트 소재 아트, settings.html:700-755의 액센트 컬러 피커(choice-card/swatch 패턴), app.js의 포커스트랩·ESC·arrow-key 탭 등 인터랙션 완성도.
- **더 밀어붙이기**: 이 일러스트 언어가 404에만 갇혀 있음. 시스템 전체의 시그니처로 확장(§5-1).

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 🔴 A. [최우선] 데모 페이지 9개 전부 영어 — 국내용·한글 중심 요구 위반
- **pages/*.html 9개 모두 `<html lang="en">` + 한글 0줄** (grep 실측: dashboard.html:2, inbox.html:2, kanban.html:2, not-found.html:2, onboarding.html:2, pricing.html:2, product.html:2, profile.html:2, settings.html:2 — 각 파일 한글 라인 수 0).
- index.html만 `lang="ko"` + 한글 카피(149줄). 허브는 한국어인데 클릭해 들어가면 전부 "Good morning, Sofie 🌿"(dashboard.html:91), "Astrid Holm"(dashboard.html:196), "Oak Side Table — Fjord"(product.html:6), "$48,290"(dashboard.html:108) — 영문 dev-tool 데모 관성의 전형.
- **수정 방향**: 9개 페이지 전면 한글화(`lang="ko"`), 인명·상품·통화도 국내 맥락으로(예: 김서연, 원목 사이드 테이블, ₩ 표기). 단순 번역이 아니라 한국형 휘게 카피로 번안할 것(§5-5).

### 🟠 B. 이모지 남발 — 아이콘 시스템 대신 이모지로 때운 카피
- pricing.html:128 `🌿 Plans & pricing`, :149 `Seedling 🌱`, :179 `Cabin 🪵`, :211 `Homestead 🏡`, :367 `🍵 Questions`, :442 `🕯️ Make it cosy`
- dashboard.html:91 `Good morning, Sofie 🌿`, kanban.html 8곳(169,210,236,249,315,436,462,503), inbox.html 4곳, index.html:368(토스트),403(툴팁),495(모달)
- 시스템에 훌륭한 인라인 SVG 아이콘 세트가 있는데 헤딩·eyebrow·plan명에 이모지를 얹은 것은 "AI가 분위기 내는 법". 프로라면 not-found의 라인아트 언어로 잎사귀·초·오두막 아이콘을 그려 넣는다.
- **수정 방향**: 헤딩/eyebrow/plan명 이모지 전량 제거 → 커스텀 라인아트 스팟 아이콘으로 교체. 토스트 카피 속 이모지는 1~2곳만 선별 유지 가능.

### 🟠 C. hero + 3-radial-blob 배경 + 카드그리드 공식 반복
- index.html:22-32 hero 배경 = radial-gradient 3개(좌상 sage + 우상 terracotta + 하단 dusty-blue). not-found.html:27-31도 **완전히 같은 3-blob 공식**(success-soft/accent-soft/info-soft로 색만 교체).
- pricing.html 구조 = 센터 hero(eyebrow+h1) → 3-plan 카드 그리드 → 비교 테이블 → FAQ 아코디언 → CTA 밴드. 교과서적 AI 랜딩 공식.
- index.html 전체 = hero → 토큰 진열 → 컴포넌트 진열대(demo-pad 그리드) → 쇼케이스 카드 그리드. "컴포넌트를 진열대처럼 나열"의 전형 — 라이브 데모라는 점은 좋으나 구도가 전부 대칭 그리드.
- **수정 방향**: §5-3(비대칭·오버랩·사선 빛) 참조.

### 🟡 D. 자기-홍보 스탯과 dev 문서 링크가 제품 UI에 노출
- index.html:121-126 hero-meta: "5 컬러 램프 / 50+ 컴포넌트 / 9 데모 화면 / AA+ 명암비" — 디자인시스템 쇼케이스라 허용 범위지만 "AA+"는 마케팅 어휘.
- index.html:92 내비 "문서"→`README.md`, :474-475 푸터 README/체크리스트 링크 — file://에서 raw 마크다운이 열리는 dev-tool 흔적.
- **수정 방향**: 내비·푸터의 .md 직링크 제거 또는 시스템 소개 섹션으로 대체.

### 🟡 E. 램프 진열의 filler 셀 — 성의 없는 마감
- index.html:202, 218, 234 — 11칸 그리드에 10-stop 램프를 맞추려고 `<div class="stop" style="background:var(--sage-900);opacity:.7">·</div>` 더미 셀 삽입. 육안으로 900이 두 칸으로 보임.
- **수정 방향**: 램프별 `grid-template-columns` 분리 또는 warm-neutral(11 stop 포함 150)과 나머지(10 stop)를 다른 컬럼 수로.

### (지문 아님 — 오판 주의)
- 크림 배경·Fraunces 세리프·종이 질감·느슨한 행간 = README에 근거한 DNA. 제거 금지.
- 데모 페이지의 app-shell(사이드바+탑바) 반복은 디자인시스템 데모 특성상 허용. 단 page-head 구성이 9페이지 동일한 것은 페이지별 개성으로 완화 가능.

---

## 4. 프로덕션 결함

### a11y / 시맨틱
1. **[치명] lang="en" 문제** — §3-A와 동일 건. 한글화 시 반드시 `lang="ko"`로. 스크린리더 발음 규칙에 직결.
2. **Rating 위젯: `role="img"` 안의 `<button>`들이 접근성 트리에서 소멸** — index.html:322 `<div class="rating" role="img" aria-label="5점 만점에 4점">` 내부에 별 버튼 5개(`aria-label="별 1개"`…). `role="img"`는 자식을 presentational로 만들어 클릭 가능한 버튼이 AT에 노출되지 않음. 읽기전용이면 버튼 대신 span, 입력용이면 radiogroup 패턴으로. product.html의 rating(라인 76 `.pdp-rating-row .rating button { cursor: default; }`)도 동일 점검 필요.
3. **정렬 테이블 키보드 접근 불가** — app.js:439-457 `th.addEventListener("click", …)`만 존재. `th.sortable`에 tabindex/버튼/keydown 없음(grep 확인: pages와 app.js에 sortable 관련 tabindex 0건). `<th>` 안에 `<button>`을 넣고 `aria-sort`를 유지하는 패턴으로 교체해야 함. 사용처: dashboard.html:186-189 등.
4. **`role="menu"`/`menuitem`인데 화살표 키 내비 없음** — dashboard.html:73-79 알림 드롭다운, app.js에는 dropdown 토글/외부클릭 닫기만 구현(app.js:325 부근). role을 쓰면 ↑↓ 키 이동이 기대됨. 화살표 내비를 추가하거나 role을 일반 리스트로 완화.
5. **칸반 DnD 키보드/터치 대안 없음** — kanban.html의 카드들이 `tabindex="0" draggable="true"`(라인 208 외 다수)로 포커스는 받지만 키보드로 옮길 수단이 없음. CHECKLIST.md:144-145에서 스스로 인정. 최소한 카드 컨텍스트 메뉴("다음 컬럼으로 이동")라도 제공 권장.

### 다크모드 / FOUC
6. **모든 페이지 `<html data-theme="light">` 하드코딩** — index.html:2, pages/*.html:2. semantic.css:239-241의 `prefers-color-scheme` 폴백은 `:root:not([data-theme])` 조건이라 **영원히 발동 불가**(JS 없으면 죽은 코드). app.js의 Theme.init()(app.js:52-56)이 실행되기 전까지 OS-다크 사용자는 크림 화면 플래시를 봄. `<head>` 최상단 인라인 스크립트로 localStorage/OS 판정 후 즉시 `data-theme`를 세팅하거나, HTML에서 속성 제거.

### 토큰 우회 / 하드코딩
7. **settings.html:726, 731, 736, 741, 746 — `stroke="#fff"` 하드코딩 5건** (액센트 스와치 체크 아이콘). `var(--white)`도 우회한 유일한 하드코딩 묶음. `stroke="currentColor"` + 부모에 `color:#fff` 스타일 또는 CSS 클래스로 이관.
8. components/data-display.css:121 — 다크 코드블록 배경 `#15120D` 직접 하드코딩(토큰 아님). 토큰화 권장. (feedback.css:168-169의 `#000`은 mask 용도라 무해.)
9. **SVG stroke/fill HTML 속성에 var() 직접 사용: 0건 (전 파일 grep 확인)** — 알려진 렌더 버그 해당 없음. 차트류(_shell.css:57-59, dashboard.html:148-152)는 `currentColor` + CSS color 방식으로 이미 안전. ✅

### 상태 누락
10. **buttons.css `:active` 누락 변형** — `.btn-soft`(라인 79-80: hover만, brightness 필터), `.btn-accent`(97-103: hover만), `.btn-danger`(82-92: hover+focus만), `.btn-danger-ghost`(94-95: hover만). primary/secondary/ghost만 3단 완비(63-77). 공통 `--_bg` 패턴이라 각 1줄이면 보완 가능.
11. `.btn-soft:hover`의 `filter: brightness(0.97)`(buttons.css:80)은 토큰 체계(색 토큰 교체) 밖의 유일한 hover 기법 — `--color-primary-soft`보다 한 단계 짙은 tint 토큰으로 통일 권장.

### 링크 / 참조
12. index.html:92 `href="README.md"`, :474-475 CHECKLIST.md 링크 — 깨진 건 아니나 제품 내 raw .md 노출(§3-D).
13. product.html:172-175 내비 `href="#"` 3개, :203 breadcrumb `href="#"` — 데모 관성. 실링크가 없으면 `aria-disabled` 처리 또는 실제 앵커로.

### 반응형
14. 큰 깨짐 의심 지점 없음(CHECKLIST.md:113-115에 1320px 가로 오버플로 0px 실측 기록, grid 폴백도 base.css:196-204에 존재). 단 `.ramp`(index.html:55-58)의 11컬럼은 360px대에서 라벨 7px로 판독 불가 — 모바일에선 stop 라벨 숨김 권장.

---

## 5. 대담화 기회 (프로 디자이너의 "한 방")

### ① 손그림 라인아트를 시스템 시그니처로 승격 [최우선 추천]
not-found.html:117-140의 코티지 일러스트 언어(3px 라운드 스트로크, 유기적 곡선, opacity 위계)를 일러스트 토큰으로 정의하고 확장:
- **empty-state 6종**(not-found.html 하단 갤러리)에 각각 전용 스팟 일러스트(빈 서랍, 꺼진 초, 찻잔 등)
- **onboarding 4스텝** 각 단계 헤더에 스텝별 일러스트(문 열기 → 가구 배치 → 초대장 → 불 켜진 창)
- **dashboard 인사말 영역**(dashboard.html:91)에 시간대별 일러스트(아침 햇살 창/저녁 램프)
- **pricing 플랜 3종**의 이모지(🌱🪵🏡)를 같은 언어의 새싹/장작/오두막 라인아트로 교체
이것 하나로 "AI 데모"에서 "브랜드 있는 제품"으로 넘어간다.

### ② 촛불 시그니처 모션 — "불을 켜다"를 시스템 은유로
이미 카피에 씨앗이 있음(index.html:485 "초에 불을 켤까요?", :495 "초에 불을 켰어요 🕯️").
- **다크모드 토글 = 촛불 점등**: 토글 시 클릭 지점에서 warm radial glow가 퍼지며 전환(View Transition API 또는 clip-path circle 애니메이션, `prefers-reduced-motion` 시 즉시 전환). 토글 아이콘도 달→촛불로.
- **primary CTA에 아주 느린 candle-glow**: 4~5s 주기로 box-shadow의 warm 알파가 0.06→0.10으로 숨쉬는 idle 애니메이션(hero CTA 한정, 남용 금지).
- **다크 테마 hero/카드에 촛불 halo**: 고정 radial-gradient 1~2개를 "창가 불빛"처럼 배치(semantic.css 다크 블록에 `--glow-*` 토큰 신설).

### ③ 구도 파괴 — "손으로 놓은 물건들"의 비대칭
현재 모든 섹션이 정직한 그리드. 휘게는 "정돈됐지만 손맛 있는" 공간이므로:
- **index hero collage**(index.html:129-158)의 타일들을 `rotate(-1.2deg)/rotate(0.8deg)` + 미세 오버랩으로 "테이블 위에 놓인 카드"처럼. 스와치 스택은 도자기 쌓듯 어긋나게.
- **hero 배경의 3-blob을 "창살 햇살"로 교체**: 45° 사선의 부드러운 빛줄기(linear-gradient 2~3줄 + blur) + 리넨 텍스처 농도를 hero에서만 1.5배 — "오후 햇살이 드는 방"을 구도로 직접 표현. not-found와 배경 공식 중복도 해소.
- **product.html**: 갤러리 이미지가 pdp-grid 상단 경계를 살짝 뚫고 올라오는 오버랩(negative margin) + 가격을 Fraunces 대형(현재 --text-4xl → 5xl)으로.
- **profile 커버**(profile.html:205-207): 커버 배너에 우븐 패턴을 사선으로 크게, 아바타 오버랩 폭 확대.

### ④ 리넨 텍스처 고도화 — 균일 도트에서 진짜 직물로
base.css:52-57의 7px/11px 균일 반복을:
- 스레드 간격에 소수(prime) 오프셋을 섞어(예: 3px/7px/13px) 모아레 없는 불규칙성 부여
- 섹션별 농도 변주: hero/footer는 진하게(0.7), 콘텐츠 영역은 옅게(0.35) — `--texture-opacity`를 섹션 스코프로
- 카드 표면에는 텍스처를 빼서(현재 body 전면 고정) 표면 위계를 만들 것

### ⑤ 한글화를 "번역"이 아니라 "한국형 휘게 카피라이팅"으로
§3-A 수정과 결합: "Good morning, Sofie" → "좋은 아침이에요, 서연 님 — 오늘도 따뜻하게 시작해요". 상품은 "피오르 오크 사이드 테이블", 통화 ₩, 리뷰어 한국 이름. 플랜명은 "새싹/오두막/온 집" 같은 번안. Gowun Batang의 붓맛이 Fraunces의 soft serif와 정서적으로 정합하므로 한글 카피가 늘수록 테마가 오히려 살아난다. 단 index.html:113 `<em>집중</em>` — 한글엔 이탤릭이 없어 faux-italic이 됨. em은 색상(현재 primary)+weight로만 강조하고 `font-style: normal` 처리 권장.

### ⑥ 숫자의 hygge화
stat-value·가격·404 등 큰 숫자는 이미 Fraunces인데, 대시보드 차트가 평범한 사각 바. bar를 상단 완전 라운드(pill) + 손그림 느낌의 미세 높이 편차, 라인차트에 부드러운 dot 마커(currentColor 유지)로 — "차트마저 뜨개질 같은" 인상.

---

## 6. 한글 폰트 페어링 (현재 기록)

- **임포트**: tokens.css:10 — `Gowun Batang(400,700) + Gowun Dodum + Noto Sans KR(400,500,700) + Noto Serif KR(400~700)` (Google Fonts)
- **디스플레이**: `--font-display`(tokens.css:119) = Fraunces → (라틴 폴백들) → **Gowun Batang → Noto Serif KR** → serif
- **본문/UI**: `--font-body`(tokens.css:120-121) = Hanken Grotesk → (시스템 산세리프) → **Gowun Dodum → Noto Sans KR** → sans-serif
- **모노**: `--font-mono`(tokens.css:122-123) = Spline Sans Mono → … → Noto Sans KR → monospace

**판정: 보존.** Fraunces(부드러운 옵티컬 세리프) ↔ 고운바탕(붓맛 있는 따뜻한 바탕체), Hanken Grotesk ↔ 고운돋움(둥글고 친근한 돋움체) 페어링은 휘게 DNA(따뜻함·손맛·편안함)와 정확히 정합. 서재풍 억지 세리프가 아니라 DNA 기반 세리프이므로 교체 불필요.
유의사항 2가지:
1. 현재 페이지 카피가 전부 영어라 이 한글 페어링이 **index.html에서만 실동작** — 한글화(§3-A)가 완료되어야 페어링이 의미를 가짐. 한글화 후 Gowun Batang 굵기(400/700 두 단계뿐)로 디스플레이 위계가 성립하는지 확인 필요(Fraunces는 400~700 4단계).
2. 한글 이탤릭 부재 — `.hero h1 em`(index.html:36) 등 italic 강조는 한글에서 faux-italic으로 왜곡됨. 한글 구간은 `font-style: normal` + 색/굵기 강조로 대체할 것.

---

## 구현 우선순위 요약 (구현 에이전트용)

| 순위 | 작업 | 근거 위치 |
|---|---|---|
| P0 | pages 9개 전면 한글화(`lang="ko"`, 인명·상품·통화 국내화, 휘게 카피 번안) | 전 pages/*.html:2 외 전체 |
| P0 | 다크모드 FOUC 수정(head 인라인 스크립트 or data-theme 하드코딩 제거) | 전 html:2, semantic.css:239, app.js:52 |
| P1 | 이모지 → 라인아트 스팟 아이콘 교체 | pricing.html:128,149,179,211,367,442 등 §3-B 목록 |
| P1 | 손그림 일러스트 시스템 확장 (§5-①) | not-found.html:117-140 언어 기준 |
| P1 | a11y: rating role 구조, 정렬 th 버튼화, menu 화살표 내비, 칸반 키보드 대안 | index.html:322 / app.js:439 / dashboard.html:73 / kanban.html:208 |
| P2 | 촛불 시그니처 모션 + hero 사선 햇살 배경 + collage 비대칭 (§5-②③) | index.html:22-32,129-158 |
| P2 | 버튼 :active 보완, stroke="#fff"·#15120D 토큰화, ramp filler 셀 제거, .md 링크 정리 | buttons.css:79-103 / settings.html:726-746 / data-display.css:121 / index.html:202,218,234,92,474 |
| P3 | 리넨 텍스처 불규칙화·농도 변주, 차트 hygge화 (§5-④⑥) | base.css:45-59 / _shell.css:36-59 |
