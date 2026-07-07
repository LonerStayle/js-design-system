# theme-13-dark-luxury — 시스템 레이어 고도화 워크로그

> 대상: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js
> 페이지(pages/*) 미수정. 아래는 **페이지 에이전트가 반영해야 할 변경/계약** 요약.

---

## 1. 폰트 로딩 (P7) — 페이지는 폰트 @import 추가 금지
- 폰트는 **tokens.css 단일 @import 한 곳**으로 통합. base.css의 @import는 제거됨.
- 죽은 로드였던 `Noto Serif KR`·`Noto Sans KR`는 @import에서 제외(스택 폴백 문자열로만 유지).
- 페이지는 `theme.css`만 링크하면 전 폰트 상속됨. **head에 별도 폰트 link/@import 넣지 말 것.**

## 2. 신규 토큰
tokens.css:
- `--leading-heading-ko: 1.32` · `--leading-display-ko: 1.14` · `--leading-body-ko: 1.75`
- `--tracking-caps-ko: 0.1em` (와이드 라벨 한글 상한) · `--tracking-display-ko: -0.01em`
- `--grain-image` (필름 그레인 SVG data-URI)

semantic.css (테마별):
- `--grain-opacity` (다크 0.05 / 라이트 0.028) · `--grain-blend` (다크 soft-light / 라이트 multiply)
- `--bg-atmosphere` 증폭: 상단 골드 풀 + 우상단 워시 + 하단 비네트 3층 (다크/라이트/OS-light 폴백 전부 갱신)

## 3. 한글 조판 레이어 (base.css 하단, 전역 자동 적용)
- `:lang(ko)` → `word-break: keep-all` + heading/body 행간 + **대형 한글 디스플레이 weight 400 고정**(Nanum Myeongjo가 Cormorant Light 대비 무거워 보이는 문제 해소) + 와이드 라벨 자간 0.24em→0.1em로 완화.
- **페이지 주의**: 한글 라벨/eyebrow/badge의 극단 자간은 자동으로 눌러짐. 페이지에서 억지로 `letter-spacing` 크게 주지 말 것. 대문자 변환(uppercase)은 유지(라틴 캡스 = DNA, 한글엔 무효).
- `.display-italic`(골드 이탤릭 강조어)는 DNA 시그니처로 유지 — 한글에도 적용됨(의도된 플로리시).

## 4. 신규 재사용 유틸리티 (base.css → 전 페이지 사용 가능)
- **`.corner-marks`** — hover/focus 시 골드 등록마크(좌상·우하 틱) 페이드인. 인터랙티브 카드에 부착 권장:
  `<article class="kanban-card corner-marks">`, `<a class="card card--interactive corner-marks">`, 상품 타일 등. `is-selected` 클래스로도 켜짐.
- **`.chapter` / `.chapter__no` / `.chapter__head`** — 섹션 챕터 표지(초대형 Cormorant 넘버 워터마크). 페이지 섹션 헤더도 이 패턴으로 통일 권장(§6-5 밀도 균일화):
  ```html
  <header class="chapter">
    <span class="chapter__no" aria-hidden="true">02</span>
    <div class="chapter__head stack-3"><p class="eyebrow eyebrow--muted">…</p><h2>…</h2><p class="lead">…</p></div>
  </header>
  ```
- **`.reveal-line-v`** — 골드 헤어라인이 위→아래로 그어지는 로드 시그니처(transform-origin top). reduced-motion 가드 포함.

## 5. 컴포넌트 focus-visible 보강 (P2) — 자동 적용, override 금지
navbar__link · nav-item · menu__item · pagination__btn · breadcrumb a · tabs__tab · accordion__trigger · segmented 버튼 · 테이블 정렬 헤더에 **의도된 골드 포커스**(밑줄/헤어라인/링)가 추가됨. 페이지에서 `outline: none` 단독 금지.
- 버튼 시그니처: `.btn--secondary`/`.btn--ghost`(아이콘 제외)는 hover/focus 시 하단 골드 헤어라인이 좌→우로 그어짐(`::before` 사용, 로딩 스피너 `::after`와 분리).

## 6. app.js 계약 변경 (전 페이지 공유)
- **세그먼트 컨트롤**: 이제 두 시맨틱 지원.
  - 패널 없는 **뷰 토글** → `role="radiogroup"` + 버튼 `role="radio" aria-checked` (roving tabindex + 방향키 선택 자동).
  - 실제 **탭 패널 전환** → 기존 `role="tablist"`/`tab`/`aria-selected` 유지.
  - 둘 다 `segmentchange` 이벤트 발화(기존 pricing 토글 호환). **뷰 토글류는 radiogroup으로 작성 권장.**
- **테이블 정렬**: `th[data-sort]`는 JS가 자동으로 내부를 `<button class="th-sort">`로 감싸 **키보드 조작(Enter/Space)** 가능하게 만들고 `aria-sort="none"`으로 초기화. 페이지는 예전처럼 `<th data-sort="str|num">라벨</th>`만 작성. **aria-sort를 수동으로 미리 넣지 말 것.**
- **캐러셀**: `go()`가 `carouselchange`(`detail.index`) CustomEvent를 발화하고 dot에 `aria-current` 부여. 썸네일/카운터 동기화는 **click 스니핑 대신 `carouselchange` 구독**으로(브리프 P4 해소). 예:
  `carousel.addEventListener('carouselchange', e => setThumb(e.detail.index))`

## 7. 다크모드 FOUC (§4-5) — 페이지도 동일 적용 필요
- index.html: `<html>`의 하드코딩 `data-theme="dark"` 제거 + head 스니펫 표준화.
- **페이지 지침**: 각 페이지 head 최상단 스니펫을 아래로 통일하고 `<html data-theme=...>` 하드코딩 제거(있으면):
  ```html
  <script>(function(){try{var t=localStorage.getItem('dl-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  ```
  스토리지 키 = `dl-theme`. 다크가 정본이나 OS-light 최초 방문은 라이트로 존중됨.

## 8. index.html 대담화 (참고 — 페이지 톤 정렬용)
- 히어로: dev-tool 스탯바("컴포넌트 54+ …") → **메종 크래프트 스펙**(`EST. MMXIII · 무채 90·골드 10 · 헤어라인 1px · 골드 대비 7.9:1`). XIII 워터마크 → 골드 아웃라인 음각. 좌측 세로 골드 룰 로드 드로잉.
- 갤러리 → **12컬럼 비대칭 룩북**(`.spec--7`/`.spec--5` 교차), 섹션 넘버 = 챕터 워터마크.
- 컴포넌트/화면 사이 **풀블리드 Manifesto 브레이크**(다크는 순흑 침수 + 골드 헤어라인 2줄).
- 시그니처 훅 "덜어낼수록, 더 귀하게."는 **CTA 딱 1곳**에만. 페이지에서 이 문장 반복 금지.

## 9. 페이지 잔여 P0/결함 리마인더 (페이지 에이전트 처리 몫)
- **dashboard.html**: `<stop stop-color="var(--color-primary)">` → `style="stop-color: var(--color-primary)"`로 이전(SVG presentation attr var() 렌더버그, 골드 필 죽음).
- **inbox.html**: 하드코딩 `#9a8bbd`(보라)·`#6f9c8d` → `var(--color-info)` / `var(--color-success)` 등 토큰으로. 이 팔레트에 보라 존재 금지.
- **product.html**: 플레이스홀더 하드코딩 hex(`#2a2a2d` 등) → `color-mix(in srgb, var(--neutral-800) …)` 계열 토큰화(라이트에서 죽는 문제). 상품 고유색 스와치는 허용하되 `/* intentional */` 주석.
- 전 pages navbar 영문(`Dashboard/Kanban/…`) → 한글화 또는 의도된 라틴 브랜드 카피로 통일. "Overview/Patterns/Errors" 같은 dev-tool 단어 제거.
- 정렬 테이블·세그먼트는 위 6번 계약대로 마크업만 맞추면 키보드/ARIA 자동 충족.

## 10. 검증 완료 (시스템 레이어)
- grep: SVG var() 0 · README.md/href=#/onclick 0 · 인라인 grid-template-columns 0 · components 하드코딩 hex 0 · 폰트 @import 1개 · keep-all 존재 · 미정의 토큰참조 0.
- 브라우저: 다크/라이트 × desktop(1440)/mobile(390) 렌더 확인, 콘솔 에러 0(favicon 404 제외), 가로 스크롤 0, reveal 잔류 숨김 0, 테이블 정렬 aria-sort 전이·세그먼트 radiogroup 토글·그레인 오버레이·한글 디스플레이 weight 400 실측 확인.
