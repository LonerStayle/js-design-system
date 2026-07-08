# theme-19 Industrial Utility · 시스템 레이어 고도화 worklog

> 대상: tokens/semantic/base/components/index.html/app.js. **pages/ 는 이 작업에서 손대지 않음** — 아래 "페이지 반영 지침" 을 페이지 에이전트가 이어서 적용할 것.

---

## 1. 새/변경 토큰

### tokens.css
- `@import` 에서 **Noto Serif KR 제거** (사용처 0, 서재 관성 화석). 이제 Black Han Sans + Gothic A1 + Noto Sans KR 만 로드.
- `--stencil-bridge` 신설 — 스프레이 스텐실의 가로 브리지(글자 끊김) 마스크. `repeating-linear-gradient(180deg, #000 0 .32em, transparent ...)`.
- `--grid-line` 신설 — 청사진 모눈 선 색(라이트에서 재정의용). `--grid-texture` 가 이 토큰을 참조하도록 변경.
- `--jitter-amp: 1.5px` — 계기 바늘 유휴 진동 폭.
- `--leading-heading-ko: 1.28` — 한글 헤딩 행간 기저.

### semantic.css
- **라이트 `--color-warning` 을 yellow-600 → yellow-800 로 하향** (연노랑 배경 위 경고 텍스트 AA 확보). `--color-warning-border` 도 yellow-700 로.
- 라이트 전용 재정의 추가: `--grid-line`, `--table-stripe`, `--plate-texture`, `--metal-texture` (흰 라인 질감이 밝은 배경에 소멸하던 P1 결함 해소).
- `--bg-vignette` 신설 (다크/라이트 각각) — body 바닥 비네트(관제실 조명 깊이감).

### 소형 라벨 대비 상향 (FOUNDATION §4-4 · brief §4-6 — 추가 패스)
- **<12px 라벨의 `--color-text-subtle` 전부 `--color-text-muted` 로 상향.** 다크 카드(#2a2d31) 위 subtle=#7c828b 는 3.6:1(AA 미달) → muted=#9a9fa7 는 5.2:1(통과). 라이트는 양쪽 통과.
- 적용 지점: `.lgauge__ticks`(9px, brief 명시), `.cmdk__group-label`·`.cmdk__foot`(feedback.css), `.field__help`·`.fileupload__hint`(forms.css), `.calendar__dow`(table.css).
- **페이지 지침**: 12px 미만 mono 라벨엔 `text-subtle`/`--color-text-subtle` 금지 — `text-muted` 사용. (placeholder·구문강조 주석색은 별도 대비 확보되어 예외.)
- **죽은 키프레임 제거**: `@keyframes fade-in`(사용 0건, §7-3) 삭제. 잔존 키프레임 전부 사용 중.

---

## 2. 새 컴포넌트·유틸리티 클래스 (페이지에서 재사용할 것)

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.breaker` (+ `__slot`/`__lever`/`__label`) | **차단기 나이프 스위치** 테마 토글(시그니처 모먼트). `data-action="toggle-theme"` 유지 | 아래 §4 마크업 참고. 기존 아이콘 토글 대체 권장 |
| `.stencil--bridge` | 초대형 디스플레이에 스프레이 스텐실 브리지 | 히어로 h1, **404 숫자**에 적용 |
| `.live-dot` / `.live-dot--red` | blink 점화 실시간 표시등(3Hz↓) | 대시보드 "가동중"·"LIVE" 배지, 정지 장비 경고 |
| `.raise-yellow` | `--shadow-yellow` 옐로 드롭(권장 규격품 후광) | **pricing featured 플랜**에 적용 (브리프 §6) |
| `.lgauge--live` | 선형 게이지 바늘 유휴 진동 | 대시보드 lgauge 컨테이너에 클래스 추가 |
| `.led::after` | LED 판독기 CRT 스캔라인(자동 적용) | 별도 마크업 불필요 |
| `.topbar__burger` | **모바일 사이드바 오픈 버거**(≤1024px 노출, 데스크톱 숨김) | 전 app-shell 페이지 topbar 에 배치 — §3 필수 |
| `.app-scrim` | 모바일 사이드바 스크림 | **JS 가 자동 생성/토글** — 마크업 불필요 |
| `.spec-plate` 등 | 히어로 각인 명판(index 전용 style) | 페이지엔 불필요 |

### 반응형 유틸 강화
- `.grid-2/3/4` 에 브레이크포인트 내장: ≤1024px → 2열(3·4), ≤640px → 1열. **페이지의 인라인 `grid-template-columns` 는 클래스로 승격 권장** (dashboard `2fr 1fr` 2곳 등).

---

## 3. 모바일 사이드바 (전 app-shell 페이지 필수 작업)

시스템 인프라(스크림+포커스트랩+ESC+복원+링크클릭 닫기)는 **app.js 에 완비**. 페이지는 아래 버튼만 topbar 에 넣으면 자동 연결된다:

```html
<button class="topbar__burger" data-action="toggle-mobile-nav" aria-label="메뉴 열기" aria-controls="sidebar">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
</button>
```
- ≤1024px 에서만 보이고, 누르면 오프캔버스 열림 + 스크림 + 포커스 이동 + ESC/바깥클릭/사이드바링크로 닫힘.
- 기존 `dashboard.html:57` 의 빈 `display:none` 토글 버튼은 이 마크업으로 교체할 것. **kanban/inbox/settings/profile 등 사이드바 있는 전 페이지에 배치**(현재 대부분 누락).
- 사이드바 라벨은 `.sidebar__label` 로 감쌀 것(접힘/모바일 처리 정합).

---

## 4. 테마 토글 = 차단기 레버 (index 채택 완료, 페이지는 선택)

index navbar 의 토글을 아래로 교체했다. 페이지는 기존 아이콘 토글을 유지해도 동작하지만, 세계관 밀도 균일화를 위해 채택 권장:

```html
<button class="breaker" data-action="toggle-theme" aria-pressed="false" aria-label="조명 전환 · 다크/라이트" title="차단기 레버 — 조명 전환">
  <span class="breaker__slot" aria-hidden="true"><span class="breaker__lever"></span></span>
  <span class="breaker__label" aria-hidden="true">DARK</span>
</button>
```
- `applyTheme()` 가 `.breaker__label` 텍스트(DARK/LIGHT)와 `aria-pressed` 를 자동 동기화.
- 토글 시 화면 1프레임 계전기 명멸(`relay-flash` 오버레이, reduced-motion 스킵) — app.js 가 자동 주입/발화.
- **FOUC 스니펫 필수**: 전 페이지 `<head>` 최상단(스타일 로드 전)에 아래 삽입 + `<html>` 의 하드코딩 `data-theme` 제거:
```html
<script>(function(){try{var t=localStorage.getItem("theme19-mode")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();</script>
```

---

## 5. ARIA/키보드 (app.js 전역 — 페이지는 마크업만 정합시키면 됨)

- **Segmented**: `role="radiogroup"` + 옵션 `role="radio"` + `aria-checked` + 로빙 tabindex + 방향키. 페이지의 segmented 도 이 마크업으로:
  ```html
  <div class="segmented" data-segmented role="radiogroup" aria-label="...">
    <span class="segmented__thumb" aria-hidden="true"></span>
    <button class="segmented__option" role="radio" aria-checked="true">일</button>
    <button class="segmented__option" role="radio" aria-checked="false" tabindex="-1">주</button>
  </div>
  ```
  (구 `aria-selected`/`role="tablist"` 마크업도 JS 가 aria-checked 로 자동 치환하지만, 마크업을 radiogroup 으로 맞춰둘 것. `dashboard.html:81` role 없는 segmented 도 교정.)
- **cmdk**: 리스트 `role="listbox"`, 옵션 `role="option"`+`id`, 입력 `role="combobox"`+`aria-activedescendant`, 빈 결과 `.cmdk__empty[role="status"]`. index 마크업 참고. (JS 는 id 없으면 자동 부여)
- **정렬 th**: `th.sortable` 에 JS 가 `tabindex=0`+Enter/Space 부여(키보드 정렬). 페이지는 마크업 그대로 두면 됨. focus 링 CSS 완비.
- **행 선택**: 무효 ARIA 였던 `tr[aria-selected]` → **`tr.is-selected` 클래스로 전환**(JS 자동). CSS 는 두 선택자 모두 지원.
- **모달/드로어/cmdk/모바일사이드바**: 공용 focus-trap(WeakMap) + 포커스 이동 + ESC + 트리거 복원 완비.
- 토스트/카피/위저드 완료 등 **JS 내장 문자열 전부 한국어화**(role=status 라이브 리전 대비).

---

## 6. 탈지문·카피 (index 반영, 페이지도 동일 원칙)

- 히어로 **자기소개 스탯(110+ 컴포넌트/9 데모/240+ 토큰/AA)** → **각인 규격 명판**(정격 하중·전압·IP등급·검사 규격 등, 검사필 QC 도장). 페이지도 self-stat 금지, 세계관 수치로.
- 푸터 "순수 CSS·프레임워크 없음" → **명판 각인**("제조 2026 · 진섭공작소 · 정격 초과 및 무단 개조 금지").
- navbar **README.md 링크 제거**.
- 어체: **선언·명령형**(§5-C-5) — "부수고. 만들고." 류 단문. 데이터는 측정된 듯한 값.

---

## 7. 히어로/배경 대담화 (index)

- body 배경: 우상단 옐로 스필 + **바닥 비네트(fixed)** + 청사진 모눈 → 관제실 조명 깊이감.
- 히어로: 초대형 스텐실 타이포(bridge) bleed + **대각 caution-tape 오버랩**(z-교차) + 바닥 **체커 플레이트 발판** + 리벳 명판. 2열 그리드 ≤900px 스택.
- 컴포넌트 갤러리: 인라인 grid → `.gallery-grid` 클래스, **대표 셀(버튼) 2칸 스팬**으로 위계.

---

## 8. 페이지 반영 지침 요약 (체크리스트)

1. **P0** `pages/pricing.html`·`pages/product.html` 의 `stroke="var(--...)"` 약 30곳 → `stroke="currentColor"`+부모 color 또는 `style="stroke:var()"` (이 작업 범위 밖 — 반드시 처리).
2. **FOUC 스니펫** 전 페이지 head + `<html>` 하드코딩 data-theme 제거.
3. **모바일 버거**(`.topbar__burger`) 전 app-shell 페이지 topbar 에 배치.
4. dashboard 인라인 `grid-template-columns:2fr 1fr` 2곳 → 클래스로(반응형). 균등 stat 4열 → **관제반 벤토**(OEE 게이지 2×2 주계기 + 소형 계기 열), 정지 장비(W-02) 행에 caution-tape 스트라이프+danger-bg, "LIVE" 배지 `.live-dot`.
5. 게이지에 `.lgauge--live` 로 바늘 진동.
6. pricing featured 플랜에 `.raise-yellow` + `hazard-band--fine` + 명판 라벨.
7. 404 숫자에 `.stencil--bridge`, 표지판 rotate, LED 명멸(`.live-dot`).
8. settings/onboarding 에 invalid 필드 1개 + 저장 실패 토스트 시연(폼 에러 상태).
9. segmented 마크업 radiogroup 으로 정합, 카피 전부 한국어 선언·명령형.
10. 교차 페이지 데이터 정합: UNIT NO. DS-019, 자재 SKU/재고/단가 등 정본 하나로 통일.

## 검증 상태
- grep: SVG var()=0(index), lang=ko, components hex=0, Noto Serif 제거, inline grid=0(index), keep-all 존재. app.js `node --check` 통과.
- 추가 패스 재검증: 시스템 레이어 <12px+subtle 잔존 0, 죽은 키프레임 0(fade-in 제거), 편집 파일 브레이스 밸런스 OK, self-stat/dev-tool 카피(index) 0, 대비 실측(다크 카드 muted 5.2:1).
- 육안(Playwright): 다크/라이트/360·375·1280·1440, 히어로·명판·브레이커 토글(레버 플립+라벨+relay flick)·cmdk(listbox/empty/activedescendant)·segmented(radio/roving)·th 키보드·행선택 클래스·invalid 필드·모바일 가로스크롤 0 확인.
