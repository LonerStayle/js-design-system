# theme-24 gothic-dark-academia — 시스템 레이어 변경 노트 (페이지 에이전트용)

작업일 2026-07-04 · 대상: tokens.css / semantic.css / base.css / components 5종 / app.js / index.html
**pages/ 는 건드리지 않았다.** 아래 신규 문법을 10개 페이지에 일관 반영할 것.

---

## 1. 새/변경 토큰

| 토큰 | 값/위치 | 용도 |
|---|---|---|
| `--neutral-350` `#9c9077` | tokens.css | 다크 subtle 텍스트 (surface-2 위 4.51:1) |
| `--color-text-subtle` (다크) | → neutral-350 | **기존 3.85:1 대비 미달 해소** — 페이지에서 subtle 재정의 금지 |
| `--color-danger` (다크) | → burgundy-300 `#d17c77` | 하락 델타 등 **danger 텍스트** 6.1:1. 보더는 `--color-danger-border`(burgundy-400) |
| `--color-border-input` | 양 테마 정의 | input류 보더 3:1 확보. `--input-border`가 이걸 소비 |
| `--chart-line-1..4` / `--chart-grid` / `--chart-axis` | semantic.css 양 테마 | **차트 SVG는 이 토큰만 소비.** dashboard의 `#c9a84c/#7b2d3e/#4a7c59/#8b0000` 전량 교체 대상. 라인엔 `class="…" + CSS` 또는 `style="stroke:var(--chart-line-1)"` (속성 var() 금지) |
| `--ink-annotation` | 다크 burgundy-200 / 라이트 burgundy-700 | 방주 잉크 |
| `--font-hand` | Nanum Pen Script (로드됨) | 방주 손글씨 |
| `--leading-heading-ko` 1.3 / `--leading-display-ko` 1.16 / `--tracking-caps-ko` 0.08em | tokens.css | 한글 조판. **한글 라벨에 `--tracking-widest`(0.18em) 직접 쓰지 말 것** |
| `--candle-pool` + `--candle-pool-opacity` | tokens/semantic | 커서 촛불 광원. 씬 변주: 페이지 스코프에서 opacity 노브만 조절 (예: 404는 1.4로 증폭 가능) |
| `--code-bar-bg` | semantic.css | 코드블록 타이틀바 (기존 하드코딩 제거) |

폰트 로드는 **base.css 한 곳**으로 통합됨 (tokens.css @import 삭제, Cinzel Decorative·Cormorant 로드 제거, Nanum Pen Script 추가). 페이지 `<head>`에 preconnect 2줄 추가 권장(index 참조).

## 2. 새 컴포넌트·유틸리티

- **`.margin-note`** — 방주 승격판. 변형: `--plain`(지시선·기울임 없음), `--sm`. 예:
  `<span class="margin-note margin-note--sm">여기서부터 읽으시길 — 사서 씀</span>`
  배치처: dashboard 스탯 옆 코멘트, settings 위험구역 경고, product 감정평. 장식이면 `aria-hidden` 불필요(실제 텍스트임), span에 role 없는 aria-label 금지.
- **`.candle-pool`** — app.js가 자동 주입(다크 전용, reduced-motion·터치 스킵). 페이지 작업 불필요.
- **`stamp-in` 키프레임 / `.stamp-in`** — 밀랍 인장 '쿵'. 성공 토스트 아이콘엔 자동 적용됨. 온보딩 완료 인장 등에 재사용 가능. `button.wax-seal:active` 눌림 물리 추가됨.
- **`.reveal`(data-reveal)** — fade-up → **ink-settle**(잉크 마름: blur 2.5px→0)로 교체. 마크업 변경 불필요. `html.js-ready [data-reveal]:not(.reveal)`만 숨김이라 JS 실패 시 안전.
- **테마 전환 베일** — 다크로=점화, 라이트로=채광 플래시. 토스트 "촛불을 밝혔습니다/양피지를 폈습니다". 자동.
- **`.demo-cell--wide`, `.folio-spread`, `.page-card--featured/--lg/--md`, `.seal-tilt`, `.hero__spine`(세로쓰기)** — index 전용 조판(참고용). pricing 특장본 재조판 시 `.card--illuminated + .frame-corners` 판형 차등 패턴을 따를 것(scale() 금지).

## 3. app.js 동작 변경 (페이지가 따라야 할 것)

- **테이블 정렬**: `th.sortable` 내용이 `.th-sort` 버튼으로 **자동 승격**됨(키보드 OK). 페이지 마크업 그대로 두면 되지만, aria-sort는 유지.
- **segmented**: 표준은 `role="radiogroup"` + `button role="radio" aria-checked` + 컨테이너에 `data-segmented`(방향키 자동). dashboard/settings/kanban의 `role="tablist"+aria-selected` 세그먼트(패널 없는 것)를 이 패턴으로 교체할 것. CSS는 `[aria-checked="true"]` 지원됨. **dashboard 기간 세그먼트는 "7일/30일/분기/연간" 한글로** (로마숫자는 장식 위치에만).
- **btn-group 단일선택**: `data-toggle-group` 붙이면 aria-pressed 자동.
- **모바일 내비**: `.navbar__nav.is-open` 클래스 방식. **모든 페이지 navbar에 토글 버튼 실존 의무**: index의 `data-nav-toggle` 버튼(aria-expanded 포함) 복사.
- **cmdk**: JS가 combobox/listbox/aria-activedescendant 자동 배선. 액션 없는 항목엔 `data-toast-title`/`data-toast`로 결과 카피 부여.
- **슬라이더**: `data-thousands` + `data-prefix="₩"` → `₩1,850,000` 표기.
- **위저드**: 버튼 라벨 기본 "계속/완료", `data-label-next/-complete/-complete-title/-complete-body`로 재정의. 완료 토스트 기본 "입학 허가 — 밀랍 인장으로 봉인되었습니다."
- **한글화 완료된 JS 문자열**: 토스트 기본 "알림"/"기록 완료", 복사 "복사 완료", 캐러셀 "N번째 도판으로 이동", 요금 주기 "/ 월·/ 년", 테마 라벨 "양피지/촛불". **페이지 HTML 라벨과 어긋나지 않게 확인.**

## 4. 페이지 공통 이식 지침 (P0)

1. **FOUC 스니펫** — 전 페이지 `<head>` 최상단 (index.html 8~15행 복사, key `theme-24-mode`) + `<html data-theme="dark">` 하드코딩 제거, `lang="ko"` 유지.
2. **SVG 표현 속성 var() 16곳** (404/dashboard/onboarding/profile/settings) → `style="stroke:var(--…)"` 또는 currentColor. `fill="color-mix(…)"`도 동일 무효.
3. **미정의 토큰 오참조** → 정식 토큰으로: `--font-body`→`--font-serif`, `--color-surface-raised`→`--color-surface-2`, `--color-surface-1`→`--color-surface`, `--text-muted`→`--color-text-muted`. (semantic에 alias 추가하지 말 것)
4. **오프팔레트 hex 정렬**: 골드류→`--gold-*`/`--chart-line-1`, `#a8863c`(오타)→`--gold-500`, `#ffd700`·촛불 불꽃→`--ember-300`, `#8b0000`→`--color-danger`, product 네이비 `#1A1A2E`류→팔레트 내 재선정.
5. **닫힌 오버레이**: CSS가 visibility 처리하므로 페이지 인라인 스타일로 opacity만 만지는 패턴 금지.
6. 카피 보이스: **격식·절제(합쇼체·서면체)**, 통화 ₩, 인명 한국식. 세계관 번안: 장서각/서가/사서/필사/인장 어휘. 라틴 장식구(MMXXVI, Folio 등)는 장식 위치에만 유지.

## 5. 강점 보존 확인 (회귀 금지)

오너먼트 토큰 시스템(–fleur/–flourish/–rule-ornate 등) 전부 유지·확장(방주 추가). 촛불 글로우 인터랙션 언어 유지·증폭(커서 광원·베일). radius ≤4px·블랙레터 장식 전용·reduced-motion 가드 전부 유지. article.html 리딩 룸 밀도가 전 페이지 기준선.
