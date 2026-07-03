# 기저 스펙 드래프트 — 프로덕션 품질 규율 (draft-production)

> 관점: 프로덕션 품질 규율 (Production Quality Discipline)
> 작성일: 2026-07-04 · 근거: `docs/fable-upgrade/briefs/` 감사 브리프 23종 전수 분석
> 적용 대상: 30개 테마 전체 (재고도화 작업의 모든 신규·수정 코드)

---

## 0. 대원칙 — DNA가 항상 품질바 위에 있다

이 스펙의 모든 규칙은 **"어떤 미학으로 구현하는가"가 아니라 "어떤 품질로 구현하는가"** 를 규정한다.
품질 규칙과 테마 DNA가 충돌하는 것처럼 보이면 **항상 DNA가 우선**하되, 품질 요구는 DNA의 어휘로 번역해 충족한다. 품질을 포기하는 것이 아니라 **표현 방법을 테마 언어로 바꾸는 것**이다.

| 상황 | 잘못된 해석 (금지) | 올바른 해석 |
|---|---|---|
| 스위스/다크럭셔리의 radius 0~4px 강제 | "포커스 링이 둥글어야 하니 radius를 키운다" | 링도 직각으로. `outline` + `outline-offset` 조합은 형태 중립 |
| 브루탈리즘/바우하우스의 소프트 섀도 금지 | "elevation이 필요하니 blur 섀도를 넣는다" | 하드 오프셋 섀도·헤어라인·보더로 깊이 표현 |
| 뉴모피즘의 보더 금지 | "에러 상태에 빨간 보더" | 에러는 inset 그림자 심화 + 아이콘 + 텍스트 |
| 미니멀 모노크롬의 유채색 0 | "성공=초록, 에러=빨강" | 상태는 명도 + 아이콘 + 텍스트 3중 신호 (theme-14가 이미 증명) |
| 사이버펑크/블루프린트의 영문 시스템 라벨 | "한글 중심이니 `SHEET 20/20`, `ERR::NO_DATA`를 번역" | 도면 스탬프·터미널 로그는 DNA. **사용자-facing 본문·aria-label만 한국어** |
| 각 테마의 명시 금지 규칙 (tokens.css/README 주석) | "품질 개선을 위해 예외 허용" | 금지 규칙은 헌법. 예: 멤피스 skeleton에 gradient shine → candy-stripe로 대체 |

**절대 회귀 금지 목록**: 각 테마가 이미 달성한 접근성 수준(포커스 트랩, reduced-motion 게이트, 실측 대비 기록, aria-sort 등)은 재고도화 중 단 한 항목도 후퇴시키지 않는다. 브리프의 "강점 Top 3"에 기록된 자산은 보존 계약이다.

---

## 1. SVG 색상 지정 규칙 — var() presentation attribute 금지 (P0 · 렌더 버그)

**23개 브리프 중 16개 테마에서 발견된 최다 빈도 렌더 결함.** (theme-17 50+건, theme-20 64건, theme-09 55건, theme-03 33건 …)

### 1-1. 금지 패턴

CSS 커스텀 프로퍼티는 SVG **presentation attribute**(HTML 속성)에서 해석되지 않는다.
결과: `stroke` → 기본값 none(선 소실), `fill` → 검정 뭉개짐, `stop-color` → 그라데이션 검정 붕괴.

```html
<!-- ❌ 전부 금지 -->
<path stroke="var(--color-primary)" />
<rect fill="var(--color-surface)" />
<stop stop-color="var(--gold-500)" />
<text font-family="var(--font-mono)" fill="var(--color-text-subtle)">라벨</text>
<g stroke="var(--color-border)">…</g>
```

### 1-2. 허용 패턴 3종 (택1)

```html
<!-- ✅ 패턴 A: style 속성 — var()는 style 컨텍스트에서 정상 해석됨 -->
<path style="stroke:var(--color-primary)" />
<stop style="stop-color:var(--gold-500)" stop-opacity="0.22" />
<text style="font-family:var(--font-mono); fill:var(--color-text-subtle)">라벨</text>

<!-- ✅ 패턴 B: currentColor + 부모 color — 단색 아이콘의 정석. 다크모드 자동 추종 -->
<span class="icon-star"><svg><path stroke="currentColor" fill="none"/></svg></span>
<style>.icon-star { color: var(--color-warning); }</style>

<!-- ✅ 패턴 C: CSS 클래스 — 차트·다요소 일러스트의 정석 (theme-02/14/20 charts.css 선례) -->
<polyline class="chart-line chart-line--primary" points="…"/>
<style>.chart-line--primary { stroke: var(--color-primary); }</style>
```

**선택 기준**: 단색 아이콘 → B / 차트·계열별 색 → C / 그라데이션 `<stop>`·일회성 일러스트 → A.
일러스트의 계조(surface/border/muted 다층)를 유지하며 다크모드를 자동 추종해야 하면 A 또는 C.

### 1-3. 오탐 주의 (수정 금지)

- CSS 파일 내부의 `stroke: var(--x)` — CSS 컨텍스트이므로 **정상**. 건드리지 말 것.
- JS의 `el.style.fill = 'var(--x)'`, `el.style.background = attr값` — style 프로퍼티 대입이므로 **정상**.
- `data-fill="var(--x)"` 를 JS가 style로 소비하는 패턴 — **정상** (theme-01 product.html 선례).
- 상품 사진 성격의 하드코딩 hex SVG(theme-12 시계 다이얼 등) — 의도된 콘텐츠 색. 주석만 부여.

### 1-4. 검증 명령 (구현 후 필수 실행, 결과 0건이어야 통과)

```bash
grep -rn 'stroke="var(\|fill="var(\|stop-color="var(\|color="var(\|font-family="var(' \
  --include="*.html" design-systems/theme-XX-*/
```

---

## 2. 토큰 규율 — 하드코딩 금지와 3계층 계약

### 2-1. 3계층 아키텍처 준수 (전 테마 공통 구조)

```
tokens.css (원시 램프)  →  semantic.css (역할 토큰)  →  components/*.css (시맨틱만 소비)
```

- **컴포넌트·페이지는 시맨틱 토큰만 참조.** 원시 램프(`--pink-500`) 직접 참조는 semantic.css 정의부에서만.
- **신규 스타일도 예외 없음.** 대담화 작업(오버랩 히어로, 시그니처 모션)에서 쓰는 색·간격·이징도 전부 토큰 경유. 필요한 값이 없으면 토큰을 **신설**하고 주석으로 근거를 남긴다 — 즉흥 hex 금지.

### 2-2. 하드코딩 금지 목록과 허용 예외

| 금지 | 발견 사례 | 조치 |
|---|---|---|
| 페이지/컴포넌트 hex·rgba 직접 기입 | theme-05 Tailwind 팔레트 유출(`#6366f1`), theme-13 팔레트 외 보라(`#9a8bbd`), theme-22 `#1FA84A` | 테마 토큰으로 회수. 팔레트에 없는 색은 **존재 자체가 결함** |
| `style="color:#fff"` 류 인라인 땜질 | theme-10 4곳 — badge 변형 부재의 증거 | 컴포넌트 변형 클래스 신설 후 인라인 제거 |
| 시맨틱 우회 원시 램프 소비 | theme-02 chart.css 1건, theme-09 스크롤바 | 시맨틱 토큰 신설·경유 |
| data-URI 내부 고정 색 | theme-03/04 select 캐럿 — 다크모드에서 죽은 색 | 테마별 캐럿 오버라이드 또는 mask+currentColor 기법 |

**허용 예외 (반드시 주석 명시)**: SVG mask용 `#000`/`#fff`, 상품 고유색(원목 스와치 등), 항상 다크인 코드블록 표면 — `/* intentional: mask color */` 식으로 의도를 기록.

### 2-3. 유령 토큰·죽은 참조 금지

- **미정의 토큰 + 폴백으로 연명 금지**: `var(--dur-2, .18s)`, `var(--radius-3xl, 2.5rem)`, `var(--neutral-920, …)` 같은 패턴은 자기 토큰 체계를 안 믿는 생성 흔적. 실존 토큰으로 교체.
- **정의만 되고 미사용인 토큰**은 ① 대담화에서 활용(theme-19 `--shadow-yellow`, theme-20 `--z-cursor`, theme-23 `--margin-color` 선례처럼 "결함을 시그니처로")하거나 ② 삭제. 방치 금지.
- 검증: `grep -o 'var(--[a-z0-9-]*' -r … | sort -u` 목록을 토큰 정의와 대조.

### 2-4. 다크모드 토큰 재정의 완전성

라이트에서 소비되는 **모든** 토큰은 다크 블록에서 유효한 값을 가져야 한다. 발견된 붕괴 유형:

- 램프 일부만 재정의 → 미재정의 스텝이 라이트용 심색으로 잔존 (theme-05 `-700` 계열, 다크에서 2:1 미만)
- 구조 보더를 `var(--black)` 하드코딩 → 다크에서 윤곽 전체 소실 (theme-11, 71곳)
- 라이트 고정 패턴/텍스처가 다크에서 그대로 노출 (theme-16 깅엄, theme-19 grid-texture 라이트 소멸)

**규칙**: 다크모드 작업 후 "라이트에서 grep한 소비 토큰 전수 × 다크 재정의 여부" 대조 + **육안 확인**(theme-11 버그는 정적 검증을 통과했었다).

### 2-5. 인라인 스타일 규율

- 동일 인라인 패턴 3회 이상 반복 → 클래스로 승격 의무 (theme-04 85개, theme-08 133개, theme-18 104개는 전부 지문이자 유지보수 결함).
- **인라인 `grid-template-columns` 전면 금지** — 미디어쿼리가 덮을 수 없어 모바일 붕괴의 직접 원인 (§5-3 참조).

---

## 3. 인터랙션 상태 완전성

### 3-1. 필수 상태 매트릭스

| 컴포넌트 | 필수 상태 |
|---|---|
| 버튼(전 변형) | default · hover · **focus-visible** · active · disabled · loading |
| 입력류 | default · hover · focus · **invalid(+에러 메시지)** · disabled · placeholder |
| 선택 컨트롤(체크/라디오/스위치/세그먼트) | + checked/on 상태, 키보드 조작 |
| 리스트/테이블 행 | hover · selected · focus-visible |
| 데이터 뷰 | **empty** · loading(skeleton) · error |
| 오버레이(모달/드로어/cmdk) | open · **closed(불투명·비간섭)** · empty 결과 |

**"모든 변형"에 적용**: theme-15에서 primary만 3단 완비되고 soft/accent/danger는 hover만 있던 사례, theme-23에서 danger만 hover/active 부재 사례 — 변형 하나라도 빠지면 미완성.

### 3-2. 상태는 "정의"가 아니라 "시연"까지

`.is-invalid`/`.field-error`/`.cmdk-empty`가 CSS에 정의만 되고 데모 화면에 0회 노출된 테마가 5개 이상 (theme-04/19/21/23…). **규칙: 정의된 모든 상태는 데모 페이지 어딘가에 실제 맥락으로 최소 1회 노출** (예: settings 저장 실패, onboarding 필수값 에러, 검색 결과 0건). 상태 진열대가 아니라 실사용 맥락에 넣는다.

### 3-3. focus-visible — 가장 자주 깨지는 상태

```css
/* ✅ 기본 계약: 전역 링 + 컴포넌트별 명시 */
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
/* ❌ 위험: 전역 :focus { outline: none } — 반드시 아래로 좁힐 것 */
:focus:not(:focus-visible) { outline: none; }
```

**Cascade 함정 (theme-06 치명 사례)**: 전역 focus 링을 `box-shadow`로 구현하면, 뒤에 로드되는 컴포넌트 CSS의 동일 특이도 `box-shadow`가 링을 통째로 덮는다.
→ **그림자를 가진 컴포넌트는 자체 `:focus-visible`에서 그림자+링을 합성**하거나, 링은 `outline` 기반으로 구현(그림자와 채널 분리):

```css
.btn:focus-visible {
  box-shadow: var(--btn-shadow),                       /* 기존 그림자 유지 */
    0 0 0 2px var(--color-surface),                    /* 오프셋 */
    0 0 0 4px var(--color-ring);                       /* 링 */
}
```

- 포커스 링의 **형태는 대상의 형태를 따른다**: pill 버튼·원형 아바타에 각진 링 금지 (theme-08 사례) — `border-radius: inherit` 활용.
- 링 색·질감은 테마 DNA로 (네온 링, 골드 헤어라인, 잉크 2px…) — 존재 자체는 협상 불가.

### 3-4. 닫힌 오버레이의 비간섭 계약

theme-05 치명 버그: 닫힌 모달/cmdk가 `opacity:0`만으로 숨어 **투명한 채로 클릭을 가로챔**. theme-03: 닫힌 드로어가 탭 순서에 잔존.

```css
/* ✅ 닫힘 상태 3종 세트: 시각 + 포인터 + 포커스/AT 모두 차단 */
.modal:not(.is-open) {
  opacity: 0;
  visibility: hidden;          /* 전환 시 transition: visibility 0s .2s */
  pointer-events: none;
}
/* 또는 최신 브라우저: 닫힘 시 inert 속성 부여 (JS) */
```

오버레이 공통 의무: 열림 시 포커스 이동 → **Tab 순환 트랩** → ESC 닫기 → 닫힘 시 트리거로 포커스 복원 → 배경 스크림(바깥 클릭 닫기). 드로어·오프캔버스 사이드바도 모달과 동급으로 취급 (theme-04 사례: 모달은 완비, 사이드바는 전무 — 불일치 금지).

### 3-5. 모션 상태 규율

- 모든 장식·등장·시그니처 모션은 `prefers-reduced-motion: reduce`에서 정지 또는 즉시 완성 상태. 파티클·버스트류는 **생성 자체를 스킵** (theme-10/16 선례).
- 광과민 안전: 3Hz 초과 점멸 금지 (theme-07 명문화 규칙을 전 테마 표준으로).
- JS 등장 연출은 no-JS 가드 필수: `html.js [data-reveal]`에서만 숨김 (theme-21 선례). JS 실패 시 콘텐츠가 투명/오프셋 상태로 남으면 안 된다.

---

## 4. 접근성 — WCAG AA · ARIA · 키보드

### 4-1. 대비 (WCAG AA)

| 대상 | 기준 |
|---|---|
| 본문·라벨 텍스트 | ≥ 4.5:1 |
| 대형 텍스트(24px+ 또는 18.66px+ bold) | ≥ 3:1 |
| 비텍스트 UI(보더, 아이콘, 상태 지표, 포커스 링) | ≥ 3:1 |
| placeholder | 텍스트로 취급, ≥ 4.5:1 (theme-02: 2.3:1 사례 재발 금지) |
| 12px 미만 초소형 라벨 | subtle 계열 토큰 사용 금지 — muted 이상으로 승격 |

**실무 규칙**:
- **그라데이션·패턴·유리 배경 위 텍스트는 배경의 가장 불리한 지점 기준**으로 판정 (theme-08 노을 하늘 위 푸터, theme-04 유리 위 muted 텍스트). 미달 위험이 있으면 텍스트를 솔리드 표면 위로 옮기거나 가독 스크림을 깐다.
- 상태색은 **배경용/텍스트용 토큰 분리**가 정석 (theme-23 `--pen-*-dark` 패턴): 채도 높은 브랜드색을 텍스트로 쓸 땐 한 단계 어두운 전용 토큰으로 라우팅 (theme-12 골드, theme-20 라이트 상태색, theme-21 danger 사례).
- **측정값을 CHECKLIST에 수치로 기록** (theme-05/07/15의 실측 문화를 전 테마 표준으로). 변경 시 재실측.
- 라이트/다크 **양쪽** 검증 — 한쪽만 통과한 사례 다수.

### 4-2. ARIA — 발견된 오용의 표준 교정 패턴

**(a) 세그먼트 컨트롤 — 최다 빈도 오용 (10개 테마+)**
plain `<button>`에 `aria-selected`는 무효 ARIA다. 탭이 아닌 옵션 선택기는 tablist 오용.

```html
<!-- ✅ 배타 선택(기간/보기 전환): radiogroup 패턴 -->
<div class="segmented" role="radiogroup" aria-label="기간 선택">
  <button role="radio" aria-checked="true">일</button>
  <button role="radio" aria-checked="false">주</button>
</div>
<!-- ✅ 토글 그룹: role 없이 aria-pressed 단일화 (aria-selected와 병용 금지) -->
<!-- ✅ 진짜 탭(패널 전환)만: role="tablist" + role="tab" + aria-controls + tabpanel 완전체 -->
```
JS 동기화 필수: 클릭·방향키 모두에서 `aria-checked`/`aria-pressed` 갱신 (클래스만 토글 금지).

**(b) 별점 위젯**
- 입력용: `role="radiogroup"` + 각 별 `role="radio" aria-checked` + 방향키. `role="slider"` 선언 후 키보드 미구현은 거짓 ARIA (theme-16).
- **표시용: 인터랙티브 금지** — button 대신 span, 클릭하면 평점이 바뀌는 표시 별점 금지 (theme-21 사례).
- **수치 정합**: aria-label(4.5) = 시각(반 별) = data 값. 3개 값이 제각각인 사례 4건 — half-star는 클립/그라데이션 마스크로 실제 렌더 (opacity 눈속임 금지, theme-07).

**(c) 커맨드 팔레트(cmdk)**
`<div class="cmdk-item" href="…">`(무효 HTML) 금지. `role="listbox"` + 항목 `role="option"` + `aria-activedescendant` 배선, 빈 결과 요소 실존 + `aria-live`.

**(d) 구조 오류 금지 목록**
- `role="img"` 컨테이너 안에 인터랙티브 버튼 (자식이 접근 트리에서 소멸 — theme-02/15)
- `aria-hidden="true"` 안의 포커스 가능한 실버튼 (theme-07/16)
- role 없는 `<span>`에 aria-label (무시됨 — `role="img"` 부여)
- deprecated `aria-grabbed` → 라이브 리전 안내로 대체
- `<ol>` 직계 자식 span, `<hr>` 내부 콘텐츠, 중복 class/style 속성 — HTML 유효성 자체가 렌더 결함으로 직결된 사례 3건

**(e) 라이브 리전**
토스트 컨테이너: `role="status"` + `aria-live="polite"` (에러는 `role="alert"`). `role="region"`만으로는 안 읽힌다 (theme-02).

**(f) 차트 접근성**
장식 아님 → `role="img"` + 데이터 요약 aria-label ("3월 38백만원에서 6월 82백만원으로 상승" — theme-09 선례) 또는 visually-hidden 데이터 표. 진행률 바는 `role="progressbar"` + `aria-valuenow/min/max`.

### 4-3. 키보드 — 마우스 전용 기능 제로

| 패턴 | 표준 해법 |
|---|---|
| 테이블 정렬 th (7개 테마에서 click 전용) | `<th scope="col" aria-sort="…"><button class="th-sort">컬럼명</button></th>` — th 내부 버튼이 정석 |
| 칸반 DnD (전 테마 공통 구멍) | 카드에 최소한의 대안: 컨텍스트 메뉴/버튼 "← 이전 열로 / 다음 열로 →" + 라이브 리전 안내 |
| 카드형 링크 (cursor:pointer만 있는 div) | `<a>` 래핑 또는 button화 — 어포던스만 있고 동작 없는 요소 금지 |
| 드롭존 `role="button" tabindex="0"` | Enter/Space keydown 핸들러 의무 |
| `role="menu"` 드롭다운 | ↑↓ 방향키 구현 또는 role 완화 |
| 캐러셀 | 방향키 + dots `aria-current`, 썸네일 동기화는 커스텀 이벤트 구독(클릭 역추적 금지 — theme-13) |

- 스킵 링크 전 페이지 + **한국어** ("본문으로 건너뛰기").
- `href="#"` 더미 링크 금지 — 실제 앵커 연결, `<button>`화, 또는 `aria-disabled`.
- 숨김 오버레이 안의 `autofocus` 속성 금지 (로드 시 스크롤 점프 — theme-20 6건).

### 4-4. 언어와 문자열

- 모든 페이지 `<html lang="ko">`. 사용자-facing 텍스트·`<title>`·aria-label·alt·placeholder·**JS 내장 문자열**(토스트 기본값, 캘린더 월/요일, "이전 달/다음 달", "알림 닫기") 전부 한국어.
- 단, 테마 DNA인 영문 시스템 표기(터미널 로그, CAD 스탬프, 브랜드 워드마크, 학명)는 유지 — §0 표 참조. **판별 기준: "읽는 텍스트"는 한국어, "세계관 오브제 표기"는 DNA 언어.**
- 통화 ₩, 날짜 "6월 21일" 형식, 인명·데이터는 국내 맥락.

---

## 5. 반응형 규칙 — 360px 모바일 우선

### 5-1. 검증 뷰포트 계약

**360 / 768 / 1024 / 1440px** 4개 뷰포트 × 라이트/다크에서 육안 확인. "All responsive ✅" 자가 주장은 실기기/실브라우저 확인 없이는 기록 금지 (theme-08 CHECKLIST 허위 사례).

### 5-2. 내비게이션 — 가장 많이 깨진 지점 (9개 테마)

**철칙: 어떤 뷰포트에서도 내비게이션 수단이 0이 되면 안 된다.**

발견된 붕괴 유형과 방지 규칙:
1. **죽은 버거 버튼** (theme-01: 5개 페이지 no-op) — 토글은 반드시 실동작. 연결할 대상이 없으면 버튼을 만들지 않는다.
2. **토글 요소 자체가 HTML에 없음** (theme-04/22: CSS만 `.navbar-toggle` 참조) — CSS가 참조하는 컨트롤은 전 페이지 마크업에 실존해야 함.
3. **브레이크포인트 불일치 데드존** (theme-04: 769–900px에서 사이드바도 버튼도 안 보임) — 숨기는 미디어쿼리와 토글을 보이는 미디어쿼리는 **같은 값**을 공유하는 토큰/변수로 관리.
4. **3-pane 패널을 display:none으로 삭제** (theme-02/18/22 inbox: 모바일에서 메일 선택 불가) — 패널 축소 시 반드시 전환 경로 제공: 목록↔읽기 스택 전환, 드로어 승격, 상단 칩 등.
5. **오프캔버스 열림 상태의 접근성**: 스크림 + ESC + 포커스 이동 + 본문 스크롤 락 — "클래스 토글만"은 미완성 (§3-4와 동일 계약).

### 5-3. 레이아웃 붕괴 방지

```html
<!-- ❌ 금지: 인라인 grid — 미디어쿼리가 못 덮어 모바일에서 압착 (theme-16/20 4곳+) -->
<div style="grid-template-columns:1.6fr 1fr">

<!-- ✅ 클래스 + 브레이크포인트 -->
<div class="grid-main-side">
<style>
.grid-main-side { display:grid; grid-template-columns: 1.6fr 1fr; gap: var(--space-6); }
@media (max-width: 820px) { .grid-main-side { grid-template-columns: 1fr; } }
</style>
```

- 공용 `.grid-2/3/4` 유틸에는 **반드시 축소 브레이크포인트 내장** (theme-19: 유틸 구멍으로 stat 4열이 모바일 압착).
- 고정폭 사이드바 + `1fr` 그리드는 축소 시 드로어/오버레이로 전환. 271px 사이드바가 360px 화면의 75%를 먹는 구조 금지 (theme-02).
- 그리드 span 유틸(`span 7` 등)은 축소 그리드에서의 낙하 규칙 동반 (theme-03).
- 전고 레이아웃은 `100dvh` (모바일 주소창 대응 — `100vh` 금지).
- `body { overflow-x: hidden }` 은 가로 스크롤 버그의 은폐 수단 — 오버랩/블리드 연출 후엔 실제 overflow 원인을 확인하고 개별 요소에서 처리.
- 모바일에서 시그니처 비주얼 통째로 `display:none` 금지 (theme-05 hero-orb) — 축소·재배치가 원칙.
- transform scale 축소는 레이아웃 박스를 안 줄인다 — 유령 여백 주의 (theme-11).

### 5-4. 대담화 작업과 반응형

오버랩·비대칭·뷰포트 블리드 연출(각 테마 §5 대담화)은 **360px에서의 낙하 형태까지 함께 설계**한다. 겹침은 모바일에서 순차 스택으로, 크롭된 초대형 타이포는 `clamp()`로, 절대배치 장식은 콘텐츠와 충돌 시 숨김이 아니라 재배치.

---

## 6. 테마 전환(다크모드) 규율

### 6-1. FOUC 방지 — head 인라인 선적용 (6개 테마 결함)

`data-theme="light"` 하드코딩 + body 끝 JS 적용 조합은 다크 사용자에게 매 로드 플래시를 만든다. **10개 HTML 전부의 `<head>` 최상단**에:

```html
<script>
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
</script>
```

- `prefers-color-scheme` CSS 폴백이 `:root:not([data-theme])` 조건인데 HTML에 data-theme이 하드코딩돼 있으면 **영원히 죽은 코드** (theme-15) — 위 스니펫 도입 시 하드코딩 속성 제거.
- JS 문자열이 HTML의 한글 라벨을 영문으로 덮어쓰는 한/영 혼종 버그 금지 (theme-08 "Dusk 모드") — 라벨 소스는 한 곳.

### 6-2. 다크 재정의 완전성

§2-4와 동일. 추가로: 패턴/텍스처/그레인/data-URI 캐럿/차트 defs 그라데이션/JS 하드코딩 색 배열(theme-23 doodle 색)까지 다크 대응 여부 전수 확인. 다크는 "색 반전"이 아니라 각 테마의 재해석 서사(칠판, 야간 인쇄소, 앰버 터미널)를 따르되, **재정의 누락은 서사가 아니라 결함**이다.

---

## 7. 폰트 로딩 성능과 한글 배선

### 7-1. 미사용 폰트 제거 (19개 테마 공통 결함)

**Noto Serif KR 4웨이트 유령 임포트** — 세리프가 DNA인 테마(03 에디토리얼, 12 아르데코, 13 다크럭셔리, 15 휘게, 17 보태니컬)를 제외한 전 테마에서 사용처 0건 로드 발견. 수백 KB 낭비 + 서재 관성의 화석.

**규칙**: `@import`/`<link>`의 모든 패밀리·웨이트는 사용처가 실존해야 한다. 검증:

```bash
# 로드된 패밀리명이 font-family 스택 어딘가에 존재하는가
grep -rn "Noto Serif KR\|각 패밀리명" design-systems/theme-XX/*.css design-systems/theme-XX/**/*.css
```

### 7-2. 한글 폰트 스택 순서 — 무드 폰트를 죽이는 배선 버그 (8개 테마)

`system-ui`/`-apple-system`이 한글 무드 폰트보다 앞이면 macOS에서 Apple SD Gothic Neo가 한글 글리프를 선점 → 무드 폰트가 **영원히 미적용** + 플랫폼별 렌더 불일치.

```css
/* ❌ */ --font-display: "Space Grotesk", system-ui, "Black Han Sans", "Noto Sans KR", sans-serif;
/* ✅ 라틴 웹폰트 → 한글 무드 → 한글 안전망 → 시스템 제네릭 */
--font-display: "Space Grotesk", "Archivo", "Black Han Sans", "Noto Sans KR", system-ui, sans-serif;
```

라틴 전용 웹폰트가 앞에 있어도 한글 글리프는 per-glyph 폴백으로 뒤 폰트에 도달하므로 라틴 렌더에는 부작용 없다.

### 7-3. 웨이트 정합 — faux bold/faux light 방지 (9개 테마)

- 시스템이 쓰는 모든 웨이트(300/600/800/900 포함)를 **한글 폰트에서도 로드**하거나, 없으면 헤딩 웨이트를 실로드 웨이트로 낮춘다. Gothic A1 미로드 800 → 합성 볼드로 뭉개짐 (theme-02/04/14).
- **단일 웨이트 폰트**(Jua, Do Hyeon, Black Han Sans, Gowun Dodum 등 400 단일)에 700+ 지정 시: `font-synthesis-weight: none` + 크기·자간으로 위계 보정, 또는 한글 헤딩 전용 weight 분기.
- 한글 이탤릭은 faux-oblique 왜곡 — `em`/이탤릭 강조는 한글 구간에서 `font-style: normal` + 색/굵기 강조로 대체 (theme-15/17).
- `font-variant: small-caps`·과대 `letter-spacing`(0.3em+)은 라틴 기준 설계 — 한글 라벨에는 별도 보정값 (theme-12/17).

### 7-4. 로딩 방식

- **@import 다중 분산 금지** (tokens.css + base.css 2곳 렌더 블로킹 직렬 로드 — 7개 테마): 한 곳으로 통합하거나 각 HTML `<head>`의 `<link rel="preconnect">` + 단일 `<link>` 로 승격 (권장).
- `display=swap` 유지. 웨이트는 사용분만 (Noto Sans KR이 최후 폴백 전용이면 400;700로 축소).
- 폰트 로딩 경로가 CSS와 HTML 두 갈래로 갈라진 상태 금지 (theme-04) — 한쪽으로 통일하고 README에 기록.

---

## 8. 마크업·코드 위생

- **raw `.md` 링크 금지**: navbar "문서"→`README.md`, 푸터 `CHECKLIST.md` 직링크는 브라우저에서 소스 노출/다운로드 (10개 테마). 제거하거나 데모 내 소개 섹션으로 대체.
- **깨진 참조 0건**: 존재하지 않는 파일 href(theme-08 `calendar.html`), 존재하지 않는 앵커(theme-16), cross-SVG defs 참조(theme-09 푸터 로고가 navbar defs 의존) — 자체 defs 소유 원칙.
- **HTML 유효성**: 중복 class/style 속성(파서가 첫 값만 채택 — theme-08/11), void 요소 내부 콘텐츠, button의 href 속성 등 무효 마크업 금지. 구현 후 대표 페이지 1회 validator 통과 권장.
- **이벤트 바인딩 일원화**: 인라인 `onclick`/`onsubmit` 금지 — 각 테마의 data-attribute 위임 아키텍처 준수 (일관성 + CSP).
- **JS 위생**: 토스트 등 텍스트 삽입은 `textContent` 조립(innerHTML 금지 — theme-05), 전역 단일 trapHandler 대신 요소별 WeakMap(핸들러 누적 버그 — theme-03), 스크림 탐색을 DOM 형제 순서에 의존 금지(theme-05).
- **성능**: 전면 고정 텍스처 레이어의 상시 애니메이션은 `will-change: transform` 또는 모바일 정지 분기 (theme-21 grain). `drop-shadow`는 spread 인자 미지원 — 무효 선언 주의 (theme-11).
- 데모 데이터 정합: 같은 수치·좌표 복붙 금지(theme-21 dashboard↔profile), 범례와 데이터 의미 일치(theme-18 차트), 7일 데이터를 8칸에 끼워넣기 금지(theme-17).

---

## 9. 구현 후 QA 체크리스트

구현 에이전트는 각 테마 작업 완료 시 아래를 실행하고 **결과(수치·0건 여부)를 해당 테마 CHECKLIST.md에 갱신 기록**한다. 자가 주장("✅ all pass")은 근거 명령/스크린샷 없이 기록 금지.

### 9-1. 자동 검증 (grep/명령)

```bash
T=design-systems/theme-XX-*/

# 1. SVG presentation attr var() — 0건
grep -rn 'stroke="var(\|fill="var(\|stop-color="var(\|font-family="var(' --include="*.html" $T

# 2. lang 속성 — 전 HTML lang="ko"
grep -L 'lang="ko"' $T/*.html $T/pages/*.html

# 3. 하드코딩 hex (components 레이어) — 0건 (주석 명시 예외 제외)
grep -rn '#[0-9a-fA-F]\{3,6\}' $T/components/*.css | grep -v '/\* intentional'

# 4. 미사용 폰트 패밀리 — 임포트 목록 vs 스택 대조
grep -rn '@import\|fonts.googleapis' $T/*.css $T/*.html

# 5. raw .md 링크 / href="#" / 인라인 onclick — 0건
grep -rn 'href="[^"]*\.md"\|href="#"[^>]*>\|onclick=' --include="*.html" $T

# 6. 인라인 grid-template-columns — 0건
grep -rn 'style="[^"]*grid-template-columns' --include="*.html" $T

# 7. 무효 ARIA 조합 — plain button aria-selected
grep -rn 'aria-selected' --include="*.html" $T   # 결과가 role="tab|option|row" 문맥인지 육안 대조

# 8. 미정의 토큰 참조
grep -roh 'var(--[a-z0-9-]*' $T | sort -u   # 토큰 정의 목록과 diff
```

### 9-2. 수동 검증 매트릭스

| # | 항목 | 방법 |
|---|---|---|
| 1 | 4뷰포트 × 2테마 | 360/768/1024/1440 × 라이트/다크 — 내비 수단 존재, 레이아웃 압착·가로 스크롤 0 |
| 2 | 키보드 전 페이지 순회 | Tab만으로: 링 항상 보임 → 모달/드로어 트랩·ESC·복원 → 정렬·세그먼트·별점 조작 → cmdk |
| 3 | 닫힌 오버레이 | 뷰포트 중앙 클릭 — 투명 요소가 클릭 가로채지 않는지, Tab이 닫힌 서랍에 안 들어가는지 |
| 4 | reduced-motion | OS 설정 후 전 페이지 — 장식 모션 정지, 콘텐츠는 완성 상태로 표시 |
| 5 | 다크모드 육안 | 보더 소실·라이트 잔존 패턴·차트 defs·캐럿·-700계 텍스트 대비 |
| 6 | FOUC | 다크 저장 상태에서 강력 새로고침 ×3 — 라이트 플래시 없음 |
| 7 | 대비 실측 | 신규·변경 색 쌍 전부 수치 측정 → CHECKLIST 기록 (그라데이션 배경은 최불리 지점) |
| 8 | 한글 렌더 | macOS(또는 폰트 검사 도구)에서 무드 한글폰트 실제 적용 확인 — 시스템 고딕 폴백이면 스택 순서 버그 |
| 9 | file:// 실행 | 더블클릭 실행 — 콘솔 에러 0, 깨진 리소스 0 |
| 10 | 상태 시연 | invalid/empty/loading/disabled가 데모 화면에 실제 노출되는지 (정의만 있으면 미통과) |
| 11 | DNA 회귀 | 해당 테마 브리프 §1 명시 규칙(금지 기법·강제 기법) 위반 grep — 예: 브루탈리즘 `blur`, 스위스 `border-radius`, 리소 `gradient` |
| 12 | 스크린리더 문구 | aria-label·라이브 리전·토스트가 한국어인지 (DNA 오브제 표기 제외) |

### 9-3. 회귀 방지 서약 (작업 종료 조건)

- [ ] 브리프 "강점 Top 3" 자산이 전부 살아 있다 (토큰 계층, 접근성 인프라, 시그니처 인터랙션, 세계관 카피 톤)
- [ ] 브리프 "구현 우선순위" P0 항목이 전부 해소되었다
- [ ] 새로 추가한 코드가 본 스펙 §1~§8을 위반하지 않는다 (§9-1 자동 검증 통과)
- [ ] CHECKLIST.md가 현재 상태를 반영하도록 갱신되었다 (낡은 ✅ 방치 금지 — theme-02 사례)

---

## 부록 — 결함 빈도 요약 (23개 브리프 기준, 우선순위 산정 근거)

| 결함 패턴 | 발견 테마 수 | 등급 |
|---|---|---|
| SVG presentation attr var() | 16 | P0 렌더 |
| 미사용 Noto Serif KR 임포트 | 19 | P1 성능·지문 |
| 세그먼트/rating ARIA 오용 | 13+ | P1 a11y |
| pages 영문 잔존(lang="en"+한글 0) | 9 | P0 방향 위반 |
| 모바일 내비/패널 붕괴 | 9 | P0 기능 |
| 한글 폰트 스택 순서/배선 버그 | 8 | P1 타이포 |
| 테이블 정렬 등 키보드 구멍 | 8+ | P1 a11y |
| 한글 웨이트 부재(faux bold) | 9 | P2 타이포 |
| raw .md 링크 노출 | 10 | P2 위생 |
| 다크모드 FOUC | 6 | P2 체감 |
| 다크 토큰 재정의 누락 | 5 | P1~P2 |
| 상태 정의만 있고 시연 0 | 5 | P2 완성도 |
| 인라인 스타일 남발(반응형 붕괴 유발 포함) | 6 | P2 |
| 칸반 DnD 키보드 대안 부재 | 사실상 전 테마 | P2 a11y |

> 본 문서는 "프로덕션 품질" 축의 기저 스펙이다. AI 지문 제거·DNA 증폭 축의 세부 지침은 별도 foundation 문서와 각 테마 브리프의 §3·§5를 따르되, 그 작업의 모든 산출물 역시 본 스펙의 품질바를 통과해야 한다.
