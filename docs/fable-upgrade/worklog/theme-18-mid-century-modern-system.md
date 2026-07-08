# theme-18 (Mid-Century Modern · ATOMIC) — 시스템 레이어 고도화 워크로그

> 대상: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js
> pages/ 는 건드리지 않음. 아래는 **페이지 에이전트가 알아야 할 변경점 + 페이지에 일관 반영할 지침**.

---

## 1. 새/변경 토큰

### tokens.css
- **폰트 스택 순서 교정(§4-H)**: `--font-display`/`--font-body`에서 한글 무드폰트(Do Hyeon·Gothic A1·Noto Sans KR)를 `system-ui` **앞**으로 이동. (macOS에서 무드폰트 미적용 버그 해소. 라틴·숫자는 여전히 ①라틴폰트가 선점.)
- **폰트 로딩 단일화(§4-7)**: 모든 패밀리(라틴 Jost/Poppins/Bitter/Space Mono + 한글)를 tokens.css의 **단일 @import**로 통합. 모든 페이지가 tokens.css를 로드하므로 이게 유일 소스. → **페이지 `<head>`의 중복 폰트 `<link>`는 삭제해도 됨**(있어도 무해). preconnect만 유지 권장.
- **한글 조판 토큰 신설**: `--leading-heading-ko: 1.32` · `--leading-display-ko: 1.14`(0.95 금지) · `--leading-body-ko: 1.7` · `--tracking-caps-ko: 0.08em`.

### semantic.css (라이트+다크 모두 정의)
- `--grain-opacity` (light .5 / dark .28) — 고정 종이 그레인 레이어 세기.
- `--wash-legs` (light .5 / dark .42) · `--wash-retro` (light .10 / dark .08) — 패턴 워시 세기.
- `--color-brown` / `--color-brown-hover` / `--color-brown-fg` — **브라운 버튼 역할 토큰**(§4-F 사설 프로퍼티 누출 대체).

---

## 2. 새 유틸리티 / 컴포넌트 클래스 (페이지에서 그대로 사용)

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.btn--brown` | 웜 에스프레소 CTA. **대시보드 사이드바 업그레이드 버튼의 인라인 `--_bg` 누출을 이걸로 교체**(§4-F) | `<button class="btn btn--brown">업그레이드</button>` — 기존 `style="--_bg:..."` 삭제 |
| `.accent-word` | 헤딩 강조어 1개만 슬랩+오렌지. 한글은 자동으로 디스플레이체 유지+색만 스위치(명조 드리프트 없음), 라틴은 슬랩-이탤릭 | `<h1>따뜻한 곡선,<br><span class="accent-word">낙관의 색</span>.</h1>` |
| `.wash` / `.wash--retro` | 컨테이너에 대각 furniture-leg 헤어라인(또는 레트로 타일) 워시. 자식은 자동 z-raise | `<footer class="wash">…</footer>` |
| `.bento` + `.bento__hero`(2×2) / `.bento__wide` | 비대칭 벤토 그리드. **대시보드 KPI를 몬드리안식 비대칭으로**(§5-③). 반응형 내장 | `<div class="bento"><div class="card bento__hero">…</div>…</div>` |
| `.bar-chart--legs` | 막대 상단을 완전 라운드(가구 다리 실루엣) | `<div class="bar-chart bar-chart--legs">` |
| `.atom-orbit` + `__electron`/`__nucleus` | 궤도 도는 전자 + 펄스 핵. **404의 '0'을 아톰으로 치환할 때 사용**(§5-⑤). `<g class="atom-orbit__electron">`에 오프셋 `<circle>`을 넣으면 공전 | 인라인 SVG 조립 |
| `.hero--poster` | **index 전용** 2단 포스터 히어로 모디파이어. `.hero`에 붙이면 `.hero__inner`가 2단 그리드가 되고 장식이 대형 크롭됨. **일반 페이지(.hero)는 기존 중앙정렬 유지** | `<section class="hero hero--poster">` |

부속(포스터 히어로 전용): `.hero__arc`(선셋 아크 밴드) · `.hero__poster`/`__tag`/`__cap`(가구 실루엣 색블록 프레임) · `.hero__meta`(dl/dt/dd 세계관 마커 스트립 — 자기참조 스탯 대체).

---

## 3. 자동으로 전 페이지에 전파되는 시스템 변경 (페이지는 별도 작업 불필요)

- **종이 그레인 아뜨모스피어**: `body::after` 고정 레이어(콘텐츠 밑·배경 워시 위). 빈 거터에만 인쇄 질감이 배어 나옴 → 텍스트 대비 무영향. 다크는 screen 블렌드. **밋밋한 AI 배경 해소(§지문1).**
- **브랜드 아톰 마크 테마화(§4-B)**: `.navbar__brand-mark`/`.sidebar__brand svg`/`.brand-mark`의 `g`(orbits→`--color-primary`)·`circle`(nucleus→`--color-secondary`)를 CSS로 지정. **presentation-attr 하드코딩 hex를 CSS가 덮어씀** → 페이지의 `stroke="#2E8B8B"` 등은 그대로 둬도 자동 테마/다크 추종. (원하면 페이지에서 hex를 `currentColor`로 정리해도 됨.) 브라운 배경 등 국소 예외는 마크 SVG에 인라인 `style="stroke:var(--color-accent)"`로 오버라이드(인라인이 우선).
- **아톰 스피너**: `.spinner svg g/circle` 색을 primary/secondary로 테마화 + **핵 펄스**(`nucleus-pulse`) 추가. 페이지 스피너의 하드코딩 hex도 자동 테마.
- **한글 조판 레이어(§5-A)**: `:lang(ko)` keep-all·행간·faux-italic 제거·tabular 숫자. 전 페이지 자동. (`<html lang="ko">` 전제 — 페이지도 반드시 `lang="ko"`.)
- **리빌 모션 교체**: `.reveal`가 범용 fade-up → **스프링 세틀("인쇄물이 놓이는" 물성)**. `[data-reveal]`+app.js 스크롤 관측 그대로. reduced-motion 시 즉시 완성.
- **인쇄 프레스 촉감 통일**: `.card--print`에 `:active` 눌림 추가 → `.btn--block`과 동일 물성("눌리면 종이가 눌린다").
- **starburst hover 스핀**: `.has-starburst:hover::before` 회전+scale(스프링). reduced-motion 가드.
- **인박스 모바일(§4-D) 순수 CSS 해결**: ≤720px에서 `.mail-list`를 숨기지 않고 상단 42vh 스택으로 → 다른 메일 선택 가능. **inbox.html에 별도 토글 마크업 불필요.**
- **칸반 컬럼**: `.kanban-col::after`에 furniture-leg 헤어라인 지지선(미드센추리 선반 느낌).
- **포커스 링 정합**: `.pagination__btn`·`.sidebar__item`에 컴포넌트 링(`--ring-shadow-teal`) 부여.
- **steps 완료 도트**: 다크에서 흰 체크 대비 개선 위해 `--color-success-fg` 사용.

---

## 4. 페이지 에이전트가 직접 해야 할 잔여 항목 (시스템에서 못 건드림)

- **§4-A SVG presentation-attr `var()` — 페이지에 남아 있음**: `product.html`(혜택 체크 아이콘 `stroke="var(--color-success)"` 3건), `kanban.html`(컬럼 상태 점 `fill="var(--…-500)"` 4건). → `style="stroke:var(--color-success)"` 또는 `currentColor`+부모 color로 교체. **렌더 깨짐 P0.**
- **§4-C 대시보드 바 차트 의미 불일치**: 범례(틸=온라인/오렌지=오프라인) vs 임의 혼색 바. grouped(`.bar-chart--grouped`) 또는 단일 계열로 정리 + 차트에 `role="img"`+수치 요약 `aria-label`(또는 visually-hidden 표).
- **§4-F 대시보드**: 사이드바 업그레이드 버튼 `style="--_bg:var(--neutral-900);…"` → `class="btn btn--brown"`.
- **영문 eyebrow 한글화(§2-2)**: `404.html`("Error 404 · Page Not Found"), `pricing.html`("Pricing") 등 → 한국어 세계관 카피.
- **이모지 아이콘(§2-4)**: `dashboard.html`("…진섭님 👋"), `product.html` 아바타 등 → SVG 가구 라인아이콘(index 드로어 참고: 의자/테이블 글리프 인라인 SVG 예시 있음).
- **product.html 원목 스와치 하드코딩 hex**: `#5C3A21` 등 → `/* intentional: 콘텐츠 색 */` 주석 또는 `--wood-*` 토큰화 + 라디오그룹 방향키(JS) 보강.
- **404 '0' → 아톰(§5-⑤)**: `.atom-orbit` 유틸 사용해 시그니처 모먼트 완성.
- **일반 페이지 히어로 승격**: 404/pricing/onboarding은 기존 중앙정렬 `.hero` 유지 중. 2단 포스터로 올리려면 `.hero--poster` + `.hero__inner` 두 자식 구조 채택.

---

## 5. 데이터 정합(교차 페이지 통일 권장)
- 브랜드/세계관 정본: **ATOMIC = 미드센추리 모던 가구 컬렉션**, "오리지널 42점", "1956—", 대표 소재 "월넛·티크". 어체=**해요체/합니다체 실무 톤**(§5-C 실무·명료 군).
- index 히어로 카피에 dev-tool 스탯("60+ 컴포넌트/9 실데모") 제거 완료. 페이지도 자기참조 스탯·"프레임워크 0"류 금지.
- index 드로어 상품 정본: "Eames 라운지 체어 ₩1,890,000 / 월넛·부클레", "키드니 커피 테이블 ₩740,000 / 티크". product/inbox 등에서 값 어긋나지 않게.

---

## 6. 검증 상태
- §7-1 grep: SVG var()(index) 0 · lang=ko OK · 하드코딩 hex(components, intentional 제외) 0 · raw .md/href="#"/onclick(index) 0 · 인라인 grid-template-columns(index) 0 · 서구권 filler(index) 0 · keep-all 존재.
- 육안(로컬 http, 라이트): index 포스터 히어로 정상, 404 페이지 히어로 정상(공유 규칙 복원 확인, 그레인·마크 테마 전파 확인). **다크 육안은 공유 브라우저 경합으로 미확보 — 토큰 오버라이드는 정적 전수 확인(모든 다크 값 존재).** 페이지 에이전트가 다크 육안 1회 권장.
