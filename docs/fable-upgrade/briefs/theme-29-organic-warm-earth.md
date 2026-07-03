# 감사 브리프 — theme-29-organic-warm-earth (Organic Warm Earth)

> 감사일: 2026-07-04 · 대상 경로: `design-systems/theme-29-organic-warm-earth/`
> HTML 10개 (index + pages 9) · CSS 6개 계층 (tokens → semantic → base → components/*) · app.js 617줄
> 쇼케이스 브랜드: **Terraforma** — 가상의 수제 도자기 스튜디오

---

## 1. DNA 요약

**정체성**: 햇볕에 말린 점토·회벽·사막 모래. 물레로 빚은 듯한 비대칭 블롭, 굽이치는 물결 디바이더, 손에 닿는 그레인 질감. "차갑고 디지털하고 날카로운 것"의 정반대를 지향하는 대지(大地)의 디자인 언어. (README.md:3-5)

**핵심 시각 요소** (모두 토큰화되어 있음):
- **6개 흙빛 램프** 50→900: terracotta(프라이머리, key `#C66B47`), sand, clay/ochre, neutral(크림→에스프레소 — "쿨 그레이 절대 금지"), olive(성공), brick(위험), dusty teal(정보). 순백/순흑 대신 크림 `#F3E9D9` + 에스프레소 `#211B14`. (tokens.css:17-107)
- **유기적 셰이프 토큰**: `--blob-radius-1..4` (비대칭 border-radius, 조약돌/물방울), `--pebble(-sm)` (버튼·인풋용 스퀘어클), `--wave-divider` (마스크 기반 물결 경계). tokens.css:113-135 — 주석에 "the soul of the theme"이라 명시.
- **질감 3종**: `--clay-texture` / `--sand-texture` / `--plaster-texture` — SVG fractalNoise data-URI. 테마별 `--texture-blend`(light=multiply, dark=soft-light) + `--texture-opacity` 노브. (tokens.css:126-138, semantic.css:67-70·136-138)
- **타이포**: 디스플레이 = **Fraunces** (variable, `--fraunces-soft: "SOFT" 60, "WONK" 0` — tokens.css:211), 본문 = **Hanken Grotesk**, 모노 = Spline Sans Mono. → **이 테마의 세리프는 '서재 관성'이 아니라 DNA 명시 요소임** (README.md:23 "warm humanist serif").
- **그림자**: 브라운 틴트 (`rgba(74,53,35,…)`) — "sunlight on clay, not a cold drop-shadow" (tokens.css:238-249)
- **모션**: `--ease-emphasized` 부드러운 오버슈트, blob-morph 16s, floatBob — "Nothing snappy or mechanical" (tokens.css:260-270)

**명시된 규칙** (README·주석 기준):
- 텍스트/배경 전 조합 WCAG AA(4.5:1) 목표, 상태는 색+아이콘 병용, 테라코타 포커스 링 상시 노출 (README.md:25)
- `prefers-reduced-motion` 시 blob-morph/float/전환 전부 중화 (base.css:299-307)
- 순수 CSS + 바닐라 JS, file:// 더블클릭 동작, 외부 리소스는 Google Fonts뿐
- 라이트=크림 캔버스 / 다크=에스프레소·구운 점토 지반 + 테라코타 점광

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 셰이프가 '토큰 레벨'로 시스템화된 유기성
`--blob-radius-1..4`·`--pebble`·`--wave-divider`가 원시 토큰으로 존재하고(tokens.css:113-135), base.css:195-268에서 `.blob-*`/`.pebble`/`.wave-divider`/`.blob-morph`/`.blob-mask` 유틸로 노출, 컴포넌트 토큰 `--btn-radius: var(--pebble)`(semantic.css:188)까지 관통한다. 버튼 하나하나가 미세하게 비대칭인 조약돌 — 흉내 낸 유기성이 아니라 구조화된 유기성. **이 축을 히어로·레이아웃 스케일로 증폭하는 것이 고도화의 정답.**

### ② 이미 존재하는 '분위기(atmosphere)' 레이어
body에 radial "sun pools" 3개 + 페이지 전면 sand grain 오버레이(base.css:44-71), 서피스별 clay/plaster/has-grain 질감(base.css:213-247), 다크모드에서 blend·opacity 자동 전환. 밋밋한 단색 배경이라는 전형적 AI 지문이 **이 테마에는 없다.** 현재는 매우 절제된 상태(body grain opacity 0.10)라 증폭 여지가 크다.

### ③ 물성(物性) 있는 인터랙션 디테일
`.btn:active`에 `--shadow-inset`(눌린 점토, buttons.css:50 + tokens.css:247), hover는 -2px 리프트, `--ease-emphasized` 오버슈트, 카드 hover 리프트, 잘 만든 캐러셀/칸반 DnD/cmdk까지 vanilla 617줄로 위임 처리(app.js). Fraunces의 SOFT/WONK 광학축을 토큰으로 노출한 것(tokens.css:211)도 프로급 발상 — **WONK 축은 아직 0으로 잠자고 있다. 쓸 것.**

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

> 전제: 크림 톤·세리프 헤딩·질감은 이 테마에선 지문이 아니라 DNA다(§1 참조). 아래는 그것과 무관한 진짜 지문.

### 🔴 A. 페이지 9개 전부 영문 콘텐츠 — 최대 결함
한글 문자 수 실측: `index.html=1,094자`, **pages/ 9개 = 0자** (settings.html만 3자). 전 페이지가 `<html lang="ko">`(예: dashboard.html:2)를 달고 콘텐츠는 100% 영어다.
- dashboard.html:25 `Skip to content` (index.html:40은 "본문으로 건너뛰기" — 같은 시스템 안에서 불일치)
- dashboard.html:35-47 사이드바 전체 영문(Studio/Overview/Board/Inbox/Kiln credits), :69 "Autumn glaze collection is live", :132-135 타임라인 영문
- product.html:125 "Speckled Stoneware Mug", :148-151 상품 설명 영문, :186 "Add to basket — $38" (통화도 $)
- pricing.html:78 "Plans that grow with your studio", patterns.css:88 `content:"MOST LOVED"` (CSS content로 박힌 영문 리본), pricing.html:94 "SAVE 20%"
- 404.html:91 "This shelf is empty"
- cmdk 플레이스홀더 dashboard.html:177 "Type a command…" vs index.html:348 "명령어를 입력하거나 검색하세요…"
**국내용·한글 중심 요구와 정면 충돌.** tokens.css:10에 한글 폰트 4종을 로드해 놓고 정작 한글이 등장할 페이지가 없다. → **전 페이지 한글화가 1순위 과제.** (Terraforma 세계관·카피 퀄리티 자체는 좋으므로 '번역'이 아니라 같은 밀도의 한국어 카피로 재집필: 통화 ₩, 지명 제주/서울 유지 등. index.html의 한글 톤이 기준.)

### 🟠 B. hero + 균질 카드그리드 공식
- index.html 구성이 전형적 공식: hero → wave → 토큰(grid-3) → 셰이프(grid-4) → 컴포넌트 갤러리(grid-3, 9개 동일 크기 `.gallery-card` 진열장) → 페이지 링크(grid-3, 9개 동일 구성 `.page-link-card`: pl-num+h4+p 반복, index.html:291-301).
- pricing 3열 대칭(pricing.html:100-), dashboard stat-card 4열 등포 — 모든 그리드가 `repeat(n, 1fr)` 균등분할. "결코 네모나지 않다"는 테마가 **레이아웃은 완벽한 직교 격자**라는 자기모순.

### 🟠 C. 이모지 남발
- index.html:92-96 feature-pills `🪴 💧 🌾 🌗 ♿` — AI 특유의 이모지 태그 나열
- index.html:336-337 / product.html:334-342 장바구니 아바타 `🏺 🥣 🌿`, 404.html:93 `🏺💨`
→ 이 테마는 인라인 SVG 아이콘 체계가 잘 갖춰져 있으므로(브랜드 잎사귀·머그 SVG 등) 이모지는 전부 SVG로 교체.

### 🟡 D. 잔여 dev-tool 흔적
- dashboard.html:143 "Sortable · selectable" (컴포넌트 스펙을 사용자 UI에 노출), index.html:119 주석 "ramps rendered by inline script for brevity"
- 페이지 하단 "Back to design system"(product.html:322) 등은 쇼케이스 특성상 허용 가능하나 한글화 대상.

---

## 4. 프로덕션 결함 (파일:라인)

### 🔴 P1. SVG 속성에 var() 직접 사용 — 렌더 깨짐 알려진 버그
presentation attribute에는 CSS `var()`가 동작하지 않는다. `style=""` 또는 `currentColor`로 이전 필수:
- **pages/dashboard.html:87** — `<stop stop-color="var(--color-primary)">` ×2 (라인차트 그라데이션 → 영역 채움 소실)
- **pages/dashboard.html:99-103** — 도넛차트 `<circle stroke="var(--color-surface-sunk)">`, `stroke="var(--chart-1..4)"` ×5 (도넛 전체 안 그려짐)
- **pages/product.html:115** — 썸네일 `<svg stroke="var(--clay-800)">`
- **pages/404.html:82** — 깨진 도자기 균열 `<path stroke="var(--brick-500)">`
(참고: patterns.css:60 `.chart-line .area { fill: url(#areaGrad); }` — 컴포넌트 CSS가 특정 페이지의 SVG id에 의존. 차트를 다른 페이지에서 재사용하면 조용히 깨짐. 수정 시 함께 정리.)

### 🔴 P2. 대비 AA 미달 (README의 "전 조합 4.5:1" 주장과 불일치)
실측 대비:
- `--color-text-subtle`(#8C7B62) on 크림 bg = **3.41:1** (semantic.css:28). `.text-subtle`(base.css:124)이 본문에, `--input-placeholder`(semantic.css:218)로도 사용. → neutral-600 계열로 상향 필요.
- `.badge-warning` = clay-600(#9A6F49) on clay-100 = **3.42:1** (display.css:80 + semantic.css:57-58). 뱃지는 텍스트 11px라 AA 4.5 필요 → warning fg를 clay-700(#79573A, 3.4→약 4.9)으로.
- index.html:32 `.pl-num` — terracotta-500 + `opacity:.5` = 유효 대비 약 1.7:1. 장식이지만 실제 텍스트 노드("01").

### 🟠 P3. 죽은 코드/오타
- **semantic.css:92-93** — `--color-surface: #2A211896;` 선언 직후 다음 줄 `--color-surface: #2A2118;`로 즉시 덮어씀. 8자리 hex 잔재 삭제.
- **product.html:123** — `<div class="stack" data-reveal data-reveal="80">` 중복 속성.
- **dashboard.html:69** — 인라인 `onclick="this.closest('.alert').remove()"`. 나머지 전부 data-* 위임인데 여기만 인라인 JS.

### 🟠 P4. 접근성
- **테이블 정렬 키보드 불가**: `th.sortable`에 click만 바인딩(app.js:431-448), th는 포커스 불가·role/tabindex/버튼 없음 (dashboard.html:153-156). → th 내부에 `<button>` 삽입이 정석.
- **segmented control ARIA 오용**: `role="tablist"` + 자식 button에 `role="tab"` 없이 `aria-selected` 사용 (index.html:217, dashboard.html:83, product.html:168, settings.html:309). aria-selected는 tab/option/gridcell 전용. → `role="radiogroup"`+`aria-checked` 또는 자식에 role="tab" 부여.
- **product.html:114-119 썸네일**: `role="tablist"`인데 자식 `.thumb`에 role="tab" 없음 (동일 오용).
- **칸반 DnD 키보드 대안 없음**: 마우스 draggable만 (app.js:587). 최소한 카드 포커스 + 화살표/단축키 이동 or 메뉴 제공.
- 도넛/라인 차트 `role="img"+aria-label`은 있으나 수치 대체 텍스트 없음 (dashboard.html:86-104) — sr-only 데이터 요약 권장.

### 🟡 P5. 토큰 우회 하드코딩
- buttons.css:79 `--_fg:#FFF8EF`, :118 `color:#fff !important` 계열 (다크모드에서도 #fff 강제)
- patterns.css:132 `.shape-tile { color:#fff }`, display.css:261 copy-btn hover `#fff`
- display.css:251 다크 코드블록 `#15100A`/`#2A2118` 직접 기입 — 다크 팔레트 토큰으로 승격 권장.

### 🟡 P6. 반응형 기능 소실
- **patterns.css:122** — 960px 이하에서 inbox 3-pane 중 `.inbox-folders`·`.inbox-reading`을 `display:none`. 모바일에서 **이메일을 읽을 수단 자체가 사라짐** (리스트만 남음). 리스트 탭 → 읽기 뷰 전환 패턴 필요.
- dashboard.html:80·116 인라인 `grid-template-columns:1.6fr 1fr` 등 — 미디어쿼리 없는 인라인 그리드라 모바일에서 2열 유지로 찌그러질 소지. (`.grid` 축소 규칙은 grid-2/3/4 클래스에만 걸려 있음, base.css:170-178)

### 상태 커버리지 (대체로 양호)
버튼 hover/active/disabled/loading 완비(buttons.css:104-118), 인풋 hover/focus/disabled/is-invalid/is-valid(forms.css:37-47), check/radio/switch focus-visible+disabled(forms.css:100-123), pagination disabled(navigation.css:82), EmptyState·Skeleton 존재(display.css:277-). 다만 **`.field-error`가 정의만 있고(forms.css:16) 실제 페이지 사용례 0** — 온보딩/설정 폼에 에러 상태 시연 1곳 이상 추가할 것.

---

## 5. 대담화 기회 — 프로 디자이너라면 밀어붙일 지점

### ① 히어로를 '물레 위 시연'으로 (그리드 파괴 + 한 방)
현재 히어로(index.html:72-105)는 좌 텍스트/우 blob-art의 안전한 2열. →
- 대형 blob이 **헤딩 뒤→앞을 관통**하는 오버랩 구도(z-index 레이어링, 텍스트 일부를 blob이 살짝 가림), 히어로 한정 `font-variation-settings`에 **WONK 1** 적용해 Fraunces의 삐딱한 손맛 해방.
- deco-blob들을 화면 가장자리에서 **크게 잘려나가게**(오버플로) 배치 — 지금은 전부 얌전히 안쪽에 있음.
- 물레 동심원(concentric ring) 패턴을 conic/radial-gradient로 히어로 배경에 깔아 "회전" 암시.

### ② 균질 그리드 파괴 — "손으로 놓은 물건들"
- index.html pages-grid(:291-301) 9개 동일 카드 → **모자이크**: 대표 1~2개는 2×2 대형(스크린샷/일러스트 포함), 나머지는 소형. 카드마다 `rotate(-1.2°~1.5°)` 미세 회전 + hover 시 0°로 정렬 — 도예 선반에 놓인 그릇들.
- 컴포넌트 갤러리(:191-277)는 등폭 3열 대신 밀도 다른 2열+1열 혼합, 섹션마다 wave-divider 진폭·방향 변주.

### ③ 시그니처 마이크로인터랙션 — "지문을 남기다"
- 버튼 press: 기존 inset 그림자에 더해 클릭 지점에서 **radial '엄지 자국' 리플**(::after radial-gradient scale) — 점토를 누른 손자국.
- `.blob-morph`를 hover 반응형으로: 카드/아바타 hover 시 blob-radius가 다음 프리셋으로 흐르듯 전이(현재 16s 자동 루프만 존재, base.css:205-210).
- wave-divider 2겹(전경/배경 색·속도 차이)으로 스크롤 패럴랙스 — 지평선의 깊이.

### ④ 다크모드 = '가마 속' 연출
다크가 현재 라이트의 색반전 수준. 다크 한정으로 body 하단 radial에 **ember glow**(terracotta-600 8~12%)를 깔고, `--shadow-glow`를 불씨 색으로 미세 강화 — "밤의 가마" 서사. semantic.css:150-155 그림자 리튠이 이미 있으므로 배경 레이어만 추가하면 됨.

### ⑤ 한글화와 동시에 '도예 낙관(落款)' 모티프 도입
전 페이지 한글화(§3-A) 때 단순 번역이 아니라:
- 히어로/섹션 이용부에 **세로쓰기 한 줄**(`writing-mode: vertical-rl`) — "흙, 물, 불, 그리고 손" 같은 카피를 Gowun Batang으로. 도자기 옆면 서명처럼.
- "MOST LOVED" 리본 → 붉은 **도장(印) 형태 뱃지**(pebble radius + brick 색 + 한글 "인기")로 교체. brand에도 낙관형 심볼 적용 가능.
- product.html 유약 스와치 선택 시 `product-media` 배경 그라데이션이 해당 유약 색으로 전환(JS 몇 줄) — 이미 `data-glaze` 훅 존재(product.html:157-161).

### ⑥ 질감 한 단계 증폭
`--texture-opacity` 0.42는 안전 지대. 섹션 경계·빈 상태·404에 **갈라진 건조 점토(crackle)** SVG 패턴 1종 추가, 히어로 blob-art에는 유약 드립(수직 그라데이션 흘림) 오버레이 — 질감 어휘를 3종→5종으로.

---

## 6. 한글 폰트 페어링

**현재 상태** (tokens.css:10 @import + :168-170 스택):
| 역할 | 라틴 | 한글 폴백 | 판정 |
|------|------|-----------|------|
| 디스플레이 | Fraunces (SOFT 60) | **Gowun Batang** → Noto Serif KR | ✅ **보존.** 고운바탕의 붓맛·둥근 획이 hand-thrown 무드와 정합. 서재풍 억지 세리프 아님(Fraunces 자체가 DNA 명시) |
| 본문 | Hanken Grotesk | **Gowun Dodum** → Noto Sans KR | ✅ **보존.** 둥근 휴머니스트 산세리프 페어로 적절 |
| 모노 | Spline Sans Mono | Noto Sans KR 폴백 (tokens.css:170) | 🟡 유지 가능. 한글 코드 주석 등장 시 무해 |

**단, 치명적 공백**: 페어링은 완성돼 있으나 **pages/ 9개에 한글이 0자**라 실사용 검증이 전혀 안 된 상태. 전 페이지 한글화 후 확인할 것:
1. Gowun Batang은 웨이트가 400/700뿐 — Fraunces의 300~900 스펙트럼(특히 `--weight-black:900` display-1, base.css:108-111)과 매칭 시 **한글만 얇거나 가벼워 보이는 구간** 발생. 히어로 대형 한글은 700 고정 + `letter-spacing` 미세 조정 필요.
2. 한글 긴 줄에서 `--leading-tight:1.18`(base.css:82)은 받침 겹침 위험 — 한글 히어로는 1.28~1.35 권장.
3. index.html 등 페이지 `<link>`(index.html:10)에는 라틴 3종만 있고 한글 폰트는 tokens.css @import 경유 — 동작하나, 한글화 후 FOUT가 거슬리면 `<link>`로 승격 검토.

---

## 구현 우선순위 요약

| 순위 | 작업 | 근거 절 |
|------|------|---------|
| 1 | pages/ 9개 전면 한글화 (index.html 톤 기준, 통화 ₩, "MOST LOVED"→도장 뱃지) | §3-A, §5-⑤ |
| 2 | SVG `var()` 4개 파일 수정 (style=""/currentColor) | §4-P1 |
| 3 | 대비 수정: text-subtle·badge-warning·pl-num | §4-P2 |
| 4 | ARIA 정정(segmented/thumb)·테이블 정렬 키보드·inbox 모바일 읽기뷰 | §4-P4·P6 |
| 5 | 히어로 오버랩+WONK, 그리드 모자이크+미세 회전, 낙관 모티프 | §5-①②⑤ |
| 6 | 마이크로인터랙션(엄지 리플·hover morph)·다크 ember·질감 증폭 | §5-③④⑥ |
| 7 | 이모지→SVG, 죽은 코드 정리(semantic.css:92, 인라인 onclick, 중복 data-reveal), 하드코딩 #fff 토큰화 | §3-C, §4-P3·P5 |
