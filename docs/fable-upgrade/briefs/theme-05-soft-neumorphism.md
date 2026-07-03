# 감사 브리프 — theme-05-soft-neumorphism

> 감사일: 2026-07-04 · 감사관: 시니어 프로덕트 디자이너 관점 정밀 감사
> 테마 경로: `design-systems/theme-05-soft-neumorphism/`
> HTML 파일 수: **10** (index.html + pages/ 9개)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 전부 명시했다.

---

## 1. DNA 요약

**"배경과 표면이 하나의 재질. 깊이는 색·보더가 아니라 오직 이중 그림자에서 태어난다."**

- **표면 = 배경의 법칙**: `--color-bg === --color-surface` (semantic.css:11-12, 주석 "this is the law"). 카드는 색으로 칠하지 않고 그림자로 *조각*한다.
- **이중 그림자 합성 시스템**: 좌상단 고정 광원. raised = 밝은 하이라이트(TL) + 어두운 그림자(BR), pressed = 같은 그림자의 inset 반전 (tokens.css:38-60). `--nm-distance`/`--nm-blur` 두 값만 바꾸면 시스템 전체가 재튜닝된다 (tokens.css:24-30).
- **명시된 금지 기법**: 하드 보더·요란한 색·하드 섀도 금지 (README.md:15 "요란한 색·하드 섀도·하드 보더 금지"), 보더는 "거의 보이지 않게 — 형태는 stroke가 아니라 shadow에서" (tokens.css:181).
- **명시된 필수 기법**: 접근성 예외 조항 — 소프트 룩의 저대비 약점을 보완하기 위해 텍스트 ≥4.5:1, Primary/상태는 솔리드 채움, 포커스 링은 "일부러 요란하게" (tokens.css:186 "must be loud", README.md:18). CHECKLIST.md:14-46에 라이트/다크 실측 대비값 표 보유.
- **물리 인터랙션 문법**: rest=raised → hover=raised-lg → active=pressed(inset). 인풋은 파인 홈(well), 토글은 물리 스위치, 슬라이더는 파인 트랙+솟은 핸들 (forms.css 전체).
- **형태 언어**: 큰 라운드(16/24/32/44), "조약돌" 실루엣 (tokens.css:171-179). 둥근 산세리프 Quicksand(디스플레이)+Nunito(본문).
- **다크 모드**: 베이스 3색만 재정의하면 그림자 로직이 자동 재계산 (tokens.css:234-246).

이 테마는 인쇄·서적 미학 예외에 해당하지 **않는다**. 세리프·크림 종이 톤이 나타나면 전부 지문이다.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

1. **그림자 합성 토큰 아키텍처 — 이 테마의 심장이자 업계 수준의 설계.**
   `--nm-base/light/dark` 3색 + `--nm-distance/blur` 2치수에서 7종 합성 그림자(`flat/raised/raised-sm/raised-lg/pressed/pressed-sm/float`)가 파생되고(tokens.css:19-64), semantic.css:43-48이 elevation 별칭으로, 컴포넌트 토큰(`--btn-shadow-hover` 등, semantic.css:54-119)이 상태 매핑으로 이어진다. 다크 모드는 3색 교체만으로 전체가 재합성(tokens.css:239-246). **증폭 방향**: 이 시스템을 믿고 깊이 단계를 더 과감하게 벌려도 된다(현재 distance 6px는 안전빵 — hero급 요소엔 lg 이상 커스텀 깊이 사용 여지).

2. **"물리 하드웨어" 폼 컨트롤 세트 — DNA가 컴포넌트 말단까지 관통.**
   눌린 인풋 well(forms.css:20-39), 파인 베드+솟은 노브 스위치(forms.css:132-154), 파인 트랙+링 핸들 슬라이더(forms.css:176-205), 한 홈을 공유하는 ButtonGroup "carved bed"(buttons.css:113-135), 눌린 칸반 트랙 위 솟은 카드(kanban.html:15, cards.css:57-64). 컴포넌트마다 "이건 촉각 기계다"라는 일관된 스토리가 있다. **증폭 방향**: 이 물리 감각을 마이크로인터랙션(스프링, 디텐트)으로 확장.

3. **접근성 실측 문화 — 소프트 룩의 약점을 문서화된 수치로 방어.**
   CHECKLIST.md:14-55에 WCAG 대비 실측표 + 보정 이력(어떤 색을 왜 심화했는지)이 있고, 코드 주석에도 근거가 산다(tokens.css:76, 88, 104-106, buttons.css:58-59, semantic.css:129-131). 포커스 링은 "loud, deliberate exception"으로 명문화(base.css:75-85). 모달 포커스 트랩/Esc/복귀(app.js:91-131), 탭 화살표 내비(app.js:293-304), ⌘K 팔레트까지 바닐라 JS로 구현. **증폭 방향**: 이 수준은 유지가 곧 강점 — 고도화 후에도 실측표를 갱신할 것.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 'AI가 만든 티')

### 3-1. Tailwind 기본 팔레트 유출 (가장 치명적인 지문)
- **product.html:163-166** — 색상 스와치가 Tailwind 원값 그대로: `#6366f1, #4338ca`(indigo-500/700), `#5eead4, #2dd4bf`(teal-300/400), `#f8fafc, #e2e8f0`(slate-50/200), `#475569, #1e293b`(slate-600/800). 테마 자체 램프(`--indigo-*`, `--mint-*`, `--neutral-*`)를 두고 Tailwind를 하드코딩.
- **product.html:24-25** — `rgba(99,102,241,…)` = Tailwind indigo-500 `#6366f1`. 테마의 indigo-500은 `#5b66e8`(tokens.css:87)로 다른 색. 갤러리 글로우가 브랜드와 미묘하게 어긋난다.
- 참고: primary 앵커 `#4f46e5`/`#4338ca`(tokens.css:88-89)도 Tailwind indigo-600/700 원값. 램프 전체 교체는 리스크가 크니 최소한 **페이지 하드코딩만이라도 테마 토큰으로 회수**할 것.

### 3-2. 정형화된 'AI 허브 히어로' 공식
- **index.html:104-121** — eyebrow 배지 + 그라데이션 텍스트 h1 + lede + CTA 2개 + 4칸 스탯 행("60+ 컴포넌트/9 실데모/2 라이트·다크/0 외부 프레임워크"). 전형적인 AI 디자인시스템 허브 템플릿. 특히 스탯 플렉스 행은 관성 그 자체.
- **index.html:14,106 / not-found.html:25-26** — `linear-gradient` 배경클립 텍스트. 이 테마의 깊이는 "그림자로만" 태어나야 하는데(README.md:3), 잉크에 그라데이션을 칠하는 건 DNA 외부에서 수입한 generic 장식이다. 404의 큰 숫자는 그라데이션 잉크 대신 **베이스에 눌러 새긴(pressed) 각인**이나 **솟은 양각**으로 표현하는 게 DNA 순혈.

### 3-3. 균질·복붙 리듬
- `[data-reveal]{opacity:0;transform:translateY(24px)…}` 동일 블록이 페이지마다 복붙됨 (index.html:62-63, product.html:10-11, kanban.html:33-34, not-found.html:46-47). base.css로 승격해야 할 코드가 흩어져 있는 전형적 생성 흔적.
- base.css:218-224 stagger가 12개까지 등차 0.06s — 모든 페이지가 같은 속도·같은 방향(translateY 24px)으로 떠오른다. 예측 가능한 모션 리듬.
- 데모 데이터 네이밍 "Aurora·Nimbus·Pebble·Lumen·Drift" (index.html:460-463, dashboard.html:195-199) — AI가 즐겨 쓰는 가상 영문 코드네임 패턴. 국내향이면 실제 한국 서비스 맥락의 캠페인명이 더 프로덕션답다.

### 3-4. 서재·문서 감성 잔재 (DNA 근거 없음)
- **tokens.css:10** — `Noto Serif KR` 4웨이트를 import하지만 **어떤 폰트 스택에서도 참조되지 않는다**(tokens.css:115-120 확인). 세리프 관성의 죽은 잔재 + 무의미한 네트워크 로드. 즉시 제거 대상.
- 크림/종이 톤 남용은 **없음** — 블루그레이 단일 재질이 DNA대로 잘 지켜졌다. 이 항목은 클린.

### 3-5. 그 외
- 페이지 로컬 `<style>`에 유틸이 될 레이아웃(`.page-head`, `.section-head`)이 페이지마다 미묘하게 다른 값으로 재정의됨(dashboard.html:9-10 vs kanban.html:9-10 vs product.html:73-74) — 시스템化 누락.

---

## 4. 프로덕션 결함 (파일:라인 필수 수정 목록)

### P0 — 동작을 깨뜨리는 결함
1. **닫힌 모달/⌘K 패널이 투명한 채로 클릭을 가로챈다.**
   `.modal { pointer-events:none }`이지만 자식 `.modal-dialog`가 `opacity:0; pointer-events:auto`로 항상 화면 중앙에 존재(overlays.css:17-28, `visibility:hidden` 없음). `.cmdk-panel`도 동일(overlays.css:86-97). → 모든 페이지에서 뷰포트 중앙(540px 폭)과 상단 중앙(620px 폭)의 보이지 않는 사각형이 밑의 콘텐츠 클릭을 차단한다. **수정**: 닫힘 상태에 `visibility:hidden` 추가(스크림 .overlay:7-14, 메뉴패널 :54-62와 동일 패턴으로) 또는 `.modal:not(.is-open) .modal-dialog { pointer-events:none; visibility:hidden }`.
2. **드로어가 스크림 없이 열리는 경우.**
   app.js:107 스크림 탐색이 `wrap.previousElementSibling`에 의존 → 드로어가 `.overlay` 바로 다음이 아니면(index.html:562-587 overlay→modal→drawer 순서, dashboard.html:219-240 동일) 이전 형제가 모달이라 스크림이 안 켜진다. 배경 미차단 + 바깥클릭 닫기 불능(Esc만 동작). **수정**: `$(".overlay")` 전역 폴백 추가.
3. **SVG 속성에 var() 직접 사용 — 알려진 렌더 깨짐 버그.**
   product.html:380 `<circle … fill="var(--color-surface)"/>` ×3. SVG presentation attribute에서 var()는 무효. **수정**: `style="fill:var(--color-surface)"` 또는 `currentColor`로 교체. (전 테마 공통 이슈 — 이 테마는 이 1곳뿐.)

### P1 — 다크 모드 대비 붕괴
4. **inline-note 4종이 다크에서 저대비로 붕괴.**
   feedback.css:39-42가 `--green-700/--amber-700/--red-700/--blue-700`을 텍스트색으로 쓰는데, 다크 블록(tokens.css:267-270)은 `-100/-500/-600`만 재정의하고 **-700은 라이트용 심색이 그대로 남는다**. 예: 다크에서 `#0c5f3d`(짙은 초록 글자) on `#14352a`(짙은 초록 배경) ≈ 2:1 미만. 사용처: index.html:374, product.html:237,436. **수정**: 다크 블록에 -700 재정의(예: green-700→`#4fd79e` 계열) 또는 inline-note가 다크에서 -500을 참조하도록.
5. **codeblock 문자열 토큰 다크 대비 미달.** data-display.css:139 `.tok-str { color: var(--mint-600) }` — mint 램프는 다크에서 미재정의(#0c8a78 on #262a32 ≈ 2.7:1). **수정**: 다크용 mint-500/600 밝은 톤 추가.

### P2 — a11y/시맨틱
6. **`aria-selected`를 role 없는 버튼에 남발.**
   segmented가 `role="group"`인데 버튼에 `aria-selected`(무효 조합): dashboard.html:93-97, kanban.html(보기 전환 segmented), pricing.html:83-85, product.html:173-177. index.html:286-290은 반대로 `role="tablist"`인데 자식에 `role="tab"`/tabpanel이 없다. app.js:210-211은 aria-selected와 aria-pressed를 무조건 둘 다 세팅. **수정**: 토글 그룹은 `role="group"`+`aria-pressed`로 통일(app.js에서 tablist 문맥일 때만 aria-selected).
7. **아코디언 패널 max-height 600px 하드캡** (data-display.css:97) — 콘텐츠가 길면 잘린다. grid-rows(0fr→1fr) 전환 또는 JS scrollHeight 방식 권장.
8. **toast가 title/text를 innerHTML로 삽입** (app.js:74-77) — 데모 범위라 낮음이지만 textContent 조립으로 바꾸는 게 안전.

### P3 — 토큰 위생·기타
9. **유령 토큰 참조**: onboarding.html:40 `var(--color-border-soft, rgba(0,0,0,.05))` — 미정의 토큰(폴백으로 연명). not-found.html:20 `var(--ease-in-out, ease)` — 미정의(존재하는 건 `--ease-standard/soft/out`). **수정**: 실제 토큰으로 교체.
10. **Noto Serif KR 죽은 import** (tokens.css:10) — §3-4 참조. 제거.
11. **한글 폰트 스택 순서 버그**: tokens.css:115-118에서 `"Gowun Dodum"`이 `system-ui` **뒤**에 위치. macOS의 system-ui는 내부적으로 한글(Apple SD Gothic Neo)까지 해석하므로 Gowun Dodum이 한글에 도달하지 못한다 → 무드 한글폰트가 사실상 미적용. **수정**: `"Gowun Dodum"`을 `"Segoe UI", system-ui` 앞으로 이동 (라틴 전용 Quicksand/Nunito 뒤, 시스템 제네릭 앞).
12. **폰트 @import 이원화**: tokens.css:10(한글) + base.css:9(라틴) 두 곳 — 한 곳으로 합치고 문서화.
13. **테마 FOUC**: 모든 페이지가 `data-theme="light"` 하드코딩 + app.js(body 끝)에서 저장 테마 적용 → 다크 사용자에게 라이트 플래시. `<head>` 인라인 1줄 스크립트로 조기 적용 권장.
14. **hero-orb가 1024px 이하에서 통째로 display:none** (index.html:28) — 모바일에서 시그니처 비주얼 상실. 축소·재배치가 옳다.

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 것)

> 원칙: 모든 장식은 "한 재질 + 이중 그림자" 문법 **안에서** 과감해질 것. 색·보더를 새로 들이지 말고 깊이(depth)를 표현 수단으로 쓴다.

1. **"조각된 배경" — 분위기 있는 깊이 지형 만들기.**
   현재 배경은 평평한 베이스 + 희미한 비네트(base.css:24-40)뿐. 히어로/섹션 뒤에 **베이스에 눌러 새긴 초저대비 대형 기하 릴리프**(거대한 pressed 원/캡슐이 화면 밖으로 잘려나가는 구도, `--shadow-pressed`의 blur만 키운 커스텀 그림자)를 깔아 "한 덩어리 재질을 조각한 페이지"라는 서사를 시각화하라. 아주 미세한 노이즈 그레인(2-3% 불투명 SVG turbulence, data URI)을 얹으면 재질감이 산다. 지금의 hero-orb(index.html:21-28)는 이 지형의 일부로 통합.

2. **시그니처 인터랙션: "진짜 눌리는" 촉각 모션.**
   `--ease-soft`(오버슈트, tokens.css:198)가 이미 있는데 활용이 소극적. (a) 히어로 오브를 **클릭 가능한 물리 버튼**으로 — 누르면 raised→pressed로 푹 꺼졌다 스프링백(오버슈트), 코어가 출렁. (b) 전역 버튼 :active에 스케일+inset 블룸을 스프링 커브로. (c) 테마 토글을 물리 스위치처럼 노브가 미끄러지며 광원이 바뀌는 연출로. "만지고 싶은 UI"가 이 테마의 한 방이다.

3. **깊이를 구도 언어로 — 대시보드 벤토 비대칭화.**
   dashboard.html:11-14의 균등 4칸 KPI + 2:1 그리드는 리포트형 관성. **핵심 KPI 하나를 XXL 크기의 '파인 우물(pressed well)' 안에 새겨진 거대 숫자**로 승격하고, 나머지를 raised 위성 카드로 비대칭 배치. 깊이 3단(pressed 존/flat/raised-lg)을 정보 위계로 쓰면 뉴모피즘만 가능한 레이아웃이 된다. 차트 막대도 파인 트랙 안에 솟은 막대(현재 progress 문법 재사용)로.

4. **404를 기억에 남는 장난감으로.**
   not-found.html의 오브+그라데이션 404를: 404 숫자를 **베이스에 각인(pressed 타이포그래피 — text-shadow 이중 조합으로 눌린 글자)** 처리하고, 오브는 **파인 그릇(pressed bowl) 안에서 굴러다니는 구슬**로 — 마우스 따라 살짝 기울고 그림자가 이동(단, 광원은 좌상단 고정 유지 — 구슬 위치만 이동). 소형 JS 20줄로 가능.

5. **가격표: 추천 플랜을 '물리적으로 융기'시켜라.**
   pricing의 featured가 링 2px(cards.css:78)로 표시되는 건 이 테마 문법에서 반칙(보더 금지 원칙과 충돌). 대신 **featured만 scale(1.04)+raised-lg+주변에 pressed 해자(moat)**를 파서 "이 플랜만 표면에서 더 높이 솟았다"로 표현. 월/연 토글은 이미 물리 스위치 문법이 있으니 실제 스위치 컴포넌트로 교체.

6. **슬라이더 디텐트·스테퍼 바운스 — 하드웨어 디테일.**
   슬라이더 트랙에 눈금 홈(notch, 미세 inset 점들)을 파고 값이 눈금에 스냅될 때 핸들이 살짝 통통 튀게. 스테퍼 값 변경 시 숫자가 스프링으로 bump. "파인 홈" 문법의 자연 연장.

7. **카피 톤 정리**: "Aurora 6월 프로모션" 같은 반영반한 데이터를 국내 실무 맥락(예: "여름 신규가입 캠페인", "6월 멤버십 리텐션")으로 교체하면 데모의 실재감이 급상승.

---

## 6. 한글 폰트 페어링

| 역할 | 현재 | 평가 |
|---|---|---|
| 라틴 디스플레이 | Quicksand (base.css:9 import, tokens.css:115) | 둥근 기하 산세리프 — DNA 적합, 유지 |
| 라틴 본문 | Nunito (tokens.css:117) | 둥근 휴머니스트 — DNA 적합, 유지 |
| 한글 무드 | **Gowun Dodum** (tokens.css:10 import, 스택 내 폴백) | 둥글고 온화한 조형 — 뉴모피즘 무드에 **잘 맞는 선택**. 단 §4-11의 스택 순서 버그로 macOS에서 실제 적용이 안 되고 있음 → 순서 수정이 최우선 |
| 한글 안전망 | Noto Sans KR 400/500/700 (tokens.css:10) | 유지 |
| ~~세리프~~ | **Noto Serif KR (미사용 import)** | **서재 관성 잔재 — 제거 대상** (tokens.css:10). 어떤 스택도 참조 안 함 |

**권고**: 페어링 자체(Quicksand+Nunito / Gowun Dodum+Noto Sans KR)는 보존. 작업 항목은 ① Noto Serif KR import 제거, ② Gowun Dodum을 system-ui 앞으로 이동, ③ (선택) 대담화 시 디스플레이 한글로 'Jua' 같은 둥근 디스플레이체를 h1 한정 검토 가능하나 필수 아님 — Gowun Dodum 정상 적용만으로 무드 충분.

---

## 부록 — 파일 지도
- 토큰: tokens.css(271줄, 라이트+다크) → semantic.css(141줄) → base.css(253줄) → components/ 8파일 → theme.css(@import 번들)
- JS: app.js 529줄 (테마·토스트·오버레이·탭·아코디언·세그먼트·스테퍼·평점·칩·테이블 정렬/선택·컨텍스트메뉴·캐러셀·⌘K·리빌)
- 페이지: dashboard(276) · inbox(395) · kanban(418) · not-found(266) · onboarding(402) · pricing(351) · product(466) · profile(384) · settings(368)
