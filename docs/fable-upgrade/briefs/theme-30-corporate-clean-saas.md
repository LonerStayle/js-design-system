# 감사 브리프 — theme-30-corporate-clean-saas ("Aperture")

> 감사일: 2026-07-04 · 감사 범위: README/CHECKLIST/tokens/semantic/base/theme + components 6종 전체 + index.html + pages 대표(dashboard/inbox/pricing/onboarding/404) + app.js
> HTML 페이지 수: **10** (index.html + pages 9)
> 이 문서만 보고 구현 에이전트가 작업할 수 있도록 모든 지적에 파일:라인을 붙였다.

---

## 1. DNA 요약

**정체성**: Linear · Vercel · Notion 계열의 정통 B2B 제품 UI. "요란함의 제거와 위계의 명료함"(README.md:10). 인디고 프라이머리(#4F46E5, tokens.css:39) + 슬레이트 뉴트럴 + 화이트/라이트그레이 캔버스. 신뢰·산뜻·전문.

**명시된 규칙** (FORBIDDEN 주석은 없으나 README §1 표가 규칙 역할):
- 레트로/실험적 장식 배제 (README.md:14)
- 그라데이션은 **버튼 호버/헤더 한정** (README.md:16, CHECKLIST.md:17)
- 시그니처: `--radius-md: 9px`(tokens.css:186 "시그니처" 주석), 소프트 엘리베이션 그림자(tokens.css:200-214), 호버=미세 엘리베이션/틴트, 포커스=인디고 2px 링(base.css:59-64)
- 타이포: Inter 산세리프, 14px 본문(tokens.css:148), tabular-nums 데이터 친화(base.css:108)
- "접근성이 곧 품질"(README.md:21) — WCAG AA 대비, 상태=색+아이콘+텍스트 병행, 완전한 ARIA
- 토큰 규율: 컴포넌트는 시맨틱 레이어만 참조, 원시 램프 직접 참조 지양 (README.md:152, tokens.css:4-5)
- 라이트가 정본, 다크는 동일 위계 유지 (semantic.css:5)

이 테마는 **인쇄·서적 미학 예외 규칙에 해당하지 않는다**. 크림/세리프는 DNA가 아니며, 발견 시 지문이다(→ §3).

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 3-레이어 토큰 아키텍처의 완성도 — 30개 테마 중 상위권
- 원시(tokens.css) → 시맨틱(semantic.css:10-107) → **컴포넌트 토큰**(`--btn-* --card-* --input-* --table-* --toast-*`, semantic.css:108-177)까지 3단 정석 구조.
- 다크 모드가 컴포넌트 토큰 레벨까지 재매핑되고(semantic.css:258-297), `prefers-color-scheme` 자동 대응 블록도 별도 존재(semantic.css:300-330).
- 버튼이 `--_h/--_px` 로컬 커스텀 프로퍼티로 사이즈 변형을 처리(buttons.css:8-9, 39-40)하는 등 실무형 패턴.
- **→ 고도화 시 이 구조를 절대 훼손하지 말 것. 새 표현(배경 질감, 모션)도 토큰으로 추가.**

### ② 상태·인터랙션 커버리지가 "실제로" 있다
- 버튼 7변형 × hover/active/disabled/loading(buttons.css:32-35, 97-107), 폼 invalid/valid/disabled/focus 링(forms.css:41-51), 테이블 정렬·선택·필터 + 검색 빈 결과 행(dashboard.html:197 `data-empty-row`)까지.
- app.js 22개 모듈이 전부 바닐라로 실동작: focus trap(app.js:46-53), ESC/백드롭 닫기, 테마 토글의 `aria-pressed` 동기화(app.js:38), 탭 화살표 내비(app.js:166-172).
- **→ 이 커버리지는 유지하되, §4의 ARIA 오용부만 교정.**

### ③ 페이지가 컴포넌트 진열대가 아니라 실조립 제품 화면
- inbox 3패널의 `height: calc(100vh - var(--navbar-h) - …)` 스크롤 분리(inbox.html:13-19), onboarding 4단계 위저드 실전환, 404가 에러 페이지 + EmptyState 패턴 갤러리를 겸함(404.html:104+).
- 한국어 카피 품질이 높다: 메일 리스트의 "PR #482 리뷰 요청 — 결제 모듈 리팩터링"(inbox.html:223), "새 기기에서 로그인 감지됨"(inbox.html:258) 등 실서비스 문장.
- index.html 히어로의 미니 대시보드 프리뷰(index.html:107-148)는 "제품을 보여주는 히어로"로 방향이 옳다.
- **→ 프리뷰 윈도우 아이디어를 더 크게 밀어붙일 것(§5-②).**

---

## 3. AI 지문 (DNA와 무관하게 배어든 것)

### ★ 최악 1 — 서재 관성의 화석: 쓰지도 않는 Noto Serif KR 4웨이트 import + 폰트 전략 삼중 모순
- **tokens.css:9** — `@import` 가 **Gothic A1 + Noto Sans KR + Noto Serif KR(400/500/600/700)** 을 로드. 그런데:
  - **Noto Serif KR: 전체 코드베이스에서 사용처 0곳.** 세리프 선언이 단 한 줄도 없다. 순수한 '서재 감성 관성' 잔재이자 수백 KB 낭비.
  - **Noto Sans KR: import 되지만 `--font-sans` 스택(tokens.css:138-140)에 없음.** 엉뚱하게 `--font-mono` 스택(tokens.css:142) 안에 들어가 있다(모노 스택에 한글 산세리프가 monospace 앞에 위치 — 명백한 오배치).
  - 정작 스택 1순위인 **Inter는 tokens.css가 아니라 각 HTML이 개별 로드**(index.html:10, pages/*.html:9-10). `theme.css`만 링크하는 신규 페이지에서는 Inter가 안 뜬다.
- **수정 지침**: tokens.css:9 import를 정리 — Noto Serif KR 제거, 폰트 로드 전략을 한 곳으로 일원화(§6 참조).

### ★ 최악 2 — 전형적 AI SaaS 랜딩 공식 (index.html)
- 중앙정렬 히어로 + **그라데이션 텍스트**(`.grad-text` index.html:18, 90) + 체크마크 badge 나열(index.html:96-102) + "토큰/컴포넌트/페이지" 3단 균질 섹션 + auto-fill 카드 그리드(index.html:36, 40). 구조 자체가 hero+카드그리드 반복 공식.
- 참고: 그라데이션 텍스트는 README.md:16의 "그라데이션은 버튼 호버/헤더 정도만" 규칙의 경계선 위에 있다. 히어로(헤더)라 면죄부는 있지만, indigo→blue→violet 3색 그라데이션 텍스트는 2023년식 AI 랜딩 클리셰이므로 인디고 단색 강조 또는 훨씬 절제된 처리로 교체 권장.
- mac 신호등 dots 하드코딩(#ff5f56/#ffbd2e/#27c93f — index.html:109, display.css:146)도 'AI가 만든 브라우저 목업' 단골 소품. 쓰려면 토큰화 + 중립 처리.

### ★ 최악 3 — 필러 데이터의 국적 불명: Acme/Globex/Initech/Umbrella/Hooli/Pied Piper
- dashboard.html:191-196 거래처 테이블이 서구 가상기업 6종 세트. 국내용 B2B 제품 데모에서 실존감을 죽이는 전형적 AI 필러. billing/inbox의 한국어 카피 수준과 극단적으로 어긋난다.
- 영어 eyebrow 혼용: "PRICING"(pricing.html:69), "Compare Plans"(pricing.html:177), "Empty State Patterns"(404.html:104) — 본문은 전부 한국어인데 캡션만 영문 dev-tool 말투.

### 그 외 지문
- **균질 리듬**: 모든 페이지가 `.section`(pad 64px) + grid-3/4 + gap-4/5 조합의 예측 가능한 반복. 카드 밀도·크기 변화가 거의 없다(index.html #tokens/#components/#pages 3섹션이 사실상 같은 레이아웃).
- **분위기 장치의 단조로움**: 배경 장치가 `bg-grid` 도트(base.css:220-224) + `bg-gradient-hero`(base.css:225-229) 단 두 개이고, index/pricing/onboarding/404가 똑같은 조합을 재사용 → '분위기'가 아니라 '패턴 도장'.
- 크림 톤/세리프 헤딩/얌전한 리포트 레이아웃 같은 서재 지문은 **본문에는 없음** — 클린 SaaS DNA는 잘 지켜졌다. 위 import 잔재만 청산하면 된다.

---

## 4. 프로덕션 결함 (파일:라인)

### A. SVG 속성 var() 렌더 버그 — 알려진 치명 버그 2건
1. **pages/inbox.html:187** — `stroke="var(--color-amber)"`
   - (a) SVG 프레젠테이션 속성에서 var()는 무효 → 속성 무시.
   - (b) `--color-amber` 토큰 자체가 존재하지 않음(원시는 `--amber-*`, 시맨틱은 `--color-warning`). **이중 버그**로 별(중요 표시) 아이콘이 렌더되지 않는다.
   - 수정: `<svg … stroke="currentColor" style="color:var(--color-warning)">`.
2. **pages/dashboard.html:138** — `<stop stop-color="var(--chart-1)" …/>` ×2 (linearGradient `#areaGrad`)
   - stop-color 프레젠테이션 속성의 var() 무효 → stop이 검정으로 렌더, 매출 추이 area가 인디고 틴트 대신 검은 그라데이션이 된다.
   - 수정: `<stop offset="0%" style="stop-color:var(--chart-1)" stop-opacity="0.22"/>` 형태로 style 속성 이동.
   - 전수 grep 결과 `stroke=|fill=`의 var() 직접 사용은 위 1건, `stop-color` var()는 dashboard 1쌍뿐. 다른 아이콘은 전부 `currentColor`로 안전.

### B. 마크업/동작 버그
3. **index.html:390** — 드로어 안 토글: `<label class="toggle"><span>이메일 알림</span><span class="track">…</span><input type="checkbox" checked hidden/></label>`
   - input이 `.track` **뒤**에 있어 forms.css:171 `input:checked + .track` 인접 셀렉터가 불성립 → 체크 상태가 시각적으로 표시 안 됨(항상 꺼진 모양). input을 track 앞으로 이동(pricing.html:76-79가 올바른 순서의 참고 예).

### C. 반응형 깨짐 — 인라인 grid-template-columns (미디어쿼리로 이길 수 없음)
4. **index.html:159** `style="grid-template-columns: 1.2fr 1fr"` (토큰 섹션)
5. **pages/dashboard.html:128** `style="grid-template-columns: 1.6fr 1fr"` (차트 2분할)
6. **pages/billing.html:106** `style="grid-template-columns: 1fr 1.1fr"`
7. **pages/profile.html:149** `style="grid-template-columns:1.5fr 1fr"`
   - base.css의 반응형 유틸은 `.grid-2/.grid-3/.grid-4` 클래스만 축소(base.css:278-292) → 위 4곳은 모바일에서 2컬럼이 유지되어 차트/카드가 압착된다. 페이지 `<style>`의 클래스 + @media로 교체할 것.

### D. ARIA/키보드
8. **segmented 컨트롤의 aria-selected 오용**: `role="group"` 내부 button에 `aria-selected`(dashboard.html:89-92, kanban.html:91, inbox.html:168-171). aria-selected는 tab/option/row/gridcell 전용 → 유효성 위반. `aria-pressed`로 바꾸거나 tablist/tab 패턴으로 통일.
9. **index.html:317-320** — segmented가 `role="tablist"`인데 자식 button에 `role="tab"` 없음 + 연결된 tabpanel 없음(설정 페이지 settings.html:99는 올바른 tab 패턴이므로 참고).
10. **inbox.html:177 등** — `<button class="mail-row" role="listitem">`: role이 button 시맨틱을 덮어써 스크린리더에서 '누를 수 있음'이 사라진다. `role="list"` 컨테이너 + `<ul><li><button>` 구조 또는 listbox/option 패턴으로.
11. **cmdk-item이 전부 div** (index.html:409-416, dashboard.html:241-245): role="option"/listbox, `aria-activedescendant` 없음. 마우스 클릭+입력창 화살표로만 동작. 커맨드 팔레트를 시그니처로 승격한다면(§5-③) combobox 패턴 정식 구현 필요.
12. **툴팁**(overlays.css:87-89): hover/focus-within만으로 표시, ESC 해제 불가 → WCAG 1.4.13 미충족(경미).
13. **칸반 DnD 포인터 전용**(app.js:492+, CHECKLIST.md:102 자인) — 키보드 재정렬 대안 없음.

### E. 대비(라이트 기준)
14. `--color-text-subtle`(neutral-400 #94a3b8)이 흰 표면에서 **약 2.9:1** — 플레이스홀더는 허용 범위지만 **실텍스트**에 쓰인 곳이 문제: `.bar-label`(charts.css:27), `.stat-foot .vs`(display.css:39), `.dp-dow`(forbs — forms.css:278), `.step-sub`(navigation.css:69). neutral-500 이상으로 승급 필요.
15. README.md:21 "muted(slate-500) on white ≈ 4.6:1"은 흰 표면 기준으로만 참 — `--color-bg`(neutral-100) 위 muted 텍스트는 4.5:1 경계 아래로 내려갈 수 있다(page-sub 등). 검증 후 muted를 neutral-600으로 반단계 올리는 것 권장.

### F. 토큰 우회 하드코딩
16. display.css:146(#ff5f56/#ffbd2e/#27c93f), display.css:64(`color:#fff`), display.css:230(`color:#fff`), forms.css:168(`background:#fff` — 다크에서도 흰 썸, 의도적일 수 있으나 토큰화 필요), navigation.css:10(`color:#fff`), index.html:109(dots hex). `--color-static-white` 류 토큰 신설로 흡수.

### G. 기타
17. **폰트 로드 이원화**(§3-★1과 동일 원인): Inter/JetBrains Mono가 HTML별 `<link>`(10개 파일 중복)이고 tokens.css @import와 따로 논다. 한 곳(tokens.css 또는 전 페이지 공통 head 스니펫)으로 통일.
18. 깨진 링크는 발견되지 않았다(pages 상호 링크·`../theme.css`·`../app.js` 전부 유효). inbox 사이드바의 `href="#"` 다수(inbox.html:150-158)는 데모 한계로 허용 범위.

---

## 5. 대담화 기회 — "프로 디자이너라면 여기를 민다"

DNA(절제·신뢰·명료)를 깨지 않으면서 기억에 남게 만드는 방향. 네온·글리치 금지, Linear/Vercel이 실제로 쓰는 수법으로.

### ① 조리개(Aperture) 모티프를 시스템 시그니처로 승격 — "한 방"
브랜드 마크가 이미 조리개/셔터 형태(index.html:59). 지금은 28px 아이콘으로만 소비된다.
- 히어로 배경에 **대형 라인아트 조리개**(수백 px, 1px stroke, indigo-100 톤)를 우상단 비대칭 배치 — bg-grid 도트 대체.
- 로딩 스피너/스켈레톤 진입을 **조리개 개폐 모션**으로(clip-path 또는 SVG path 보간, `prefers-reduced-motion` 시 정적).
- 404의 나침반 일러스트(404.html:63-69)를 조리개 변형으로 교체해 브랜드 일관성 확보.

### ② 대시보드 KPI를 균질 4-grid에서 비대칭 벤토로
- 현재 grid-4 균등(dashboard.html:100). **핵심 KPI(총 매출) 1개를 2×2 대형 셀**로: 카운트업 숫자 + 카드 전폭 스파크라인(area) + 기간 비교. 나머지 3개는 컴팩트.
- index.html 히어로도 중앙정렬을 버리고 **좌 카피 / 우 프리뷰 윈도우가 살짝 화면 밖으로 걸치는(overflow 크롭) 12-col 비대칭**으로 — Vercel/Linear 상투 수법이지만 이 DNA에선 정공법.

### ③ ⌘K 커맨드 팔레트를 브랜드 경험의 중심으로
- 이미 전 페이지에서 동작한다(app.js:295+). 여기에: 최근 방문 섹션, **팔레트 안에서 테마·밀도 전환**, 페이지별 컨텍스트 명령, 첫 방문 시 1회 코치마크("⌘K를 눌러보세요").
- §4-11의 listbox/aria-activedescendant 정식 구현과 묶어서 "접근성이 곧 품질" DNA의 쇼케이스로.

### ④ 밀도 토글(Comfortable / Compact) — 진짜 B2B의 증표
- `[data-density="compact"]`에서 `--space-*`·`--btn-height-*`·테이블 패딩 리매핑. 토큰 아키텍처(강점①)를 자랑하는 가장 SaaS다운 데모. 대시보드 상단 segmented로 노출.

### ⑤ 표면에 깊이: 인디고 틴트 다층 배경 + 노이즈
- 히어로/온보딩 배경을 radial 2~3겹(indigo-50/blue-50) + **미세 노이즈 텍스처(data-uri, opacity 3~4%)**로. "밋밋한 흰 배경" 탈피하되 절제 유지. 다크에서는 indigo-950 글로우.

### ⑥ 모션 시그니처: 차트 draw-in + 스켈레톤 오케스트레이션
- 매출 라인차트 `stroke-dashoffset` 드로잉, 바 차트 스태거 성장(이미 `--ease-emphasized` 토큰 존재, tokens.css:259).
- 대시보드 진입 시 스켈레톤→실데이터 전환 시퀀스 데모(스켈레톤 컴포넌트가 이미 있음, display.css:156).

### ⑦ 데이터 국산화 (③번 지문 청산과 세트)
- 거래처를 실감나는 국내 가상기업으로(예: ㈜한빛물류, 두레페이, 세종에듀텍…), 금액 ₩ 병행. inbox 수준의 카피 밀도를 dashboard/billing 테이블에도.

---

## 6. 한글 폰트 페어링 (현황 기록 + 판정)

| 역할 | 현재 | 로드 경로 | 판정 |
|------|------|-----------|------|
| 라틴 본문/헤딩 | **Inter** 400–800 | 각 HTML `<link>` (index.html:10 등 10곳 중복) | 유지 (DNA 핵심) |
| 한글 본문/헤딩 | **Gothic A1** 400/500/700 | tokens.css:9 @import + `--font-sans` 폴백(tokens.css:140) | **조건부 유지** |
| 모노 | JetBrains Mono | HTML `<link>` | 유지 |
| (유령) | Noto Sans KR | import만 되고 sans 스택엔 없음 — 모노 스택(tokens.css:142)에 오배치 | **정리 필요** |
| (유령) | Noto Serif KR 4웨이트 | tokens.css:9 import, **사용처 0** | **삭제 필수** — 서재 관성 잔재 |

- 실제 렌더링: 라틴=Inter, 한글=Gothic A1(웹폰트) → Apple SD Gothic Neo/Malgun 폴백. 페어링 자체는 클린 SaaS 무드에 어긋나지 않는다.
- **판정**: 서재풍 세리프가 본문에 강제된 사례는 없음(교체 대상 아님). 단,
  1. **Noto Serif KR import 삭제** (tokens.css:9),
  2. Noto Sans KR을 삭제하거나 `--font-sans` 폴백으로 정위치,
  3. 가능하면 한글을 **Pretendard**로 승급 검토 — Inter와 메트릭 친화적이고 국내 B2B SaaS 사실상 표준. Gothic A1 유지도 허용되나, 헤딩 굵은 웨이트(700+)에서 Pretendard 쪽이 Inter의 타이트 트래킹과 더 맞물린다.
  4. 폰트 로드를 tokens.css 한 곳으로 일원화 (§4-17).

---

## 우선순위 요약 (구현 에이전트용)

| 순위 | 작업 | 근거 |
|------|------|------|
| P0 | SVG var() 버그 2건 수정 | inbox.html:187, dashboard.html:138 |
| P0 | 토글 마크업 순서 버그 | index.html:390 |
| P0 | 인라인 grid 반응형 깨짐 4곳 | index.html:159 / dashboard.html:128 / billing.html:106 / profile.html:149 |
| P1 | 폰트 전략 일원화 + Noto Serif KR 삭제 | tokens.css:9, 138-142 |
| P1 | ARIA 교정 (segmented/aria-selected, mail-row, cmdk listbox) | §4-8~11 |
| P1 | subtle/muted 대비 승급 | §4-14~15 |
| P2 | AI 지문 청산 (grad-text 절제, 필러 데이터 국산화, 영문 eyebrow 한글화, mac dots 정리) | §3 |
| P2 | 대담화: 조리개 시그니처 + 벤토 대시보드 + ⌘K 승격 + 밀도 토글 + 노이즈 배경 + 차트 draw-in | §5 |
