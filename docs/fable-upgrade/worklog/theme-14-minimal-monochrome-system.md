# theme-14 Minimal Monochrome — 시스템 레이어 변경 노트 (페이지 에이전트용)

> 시스템 레이어(tokens/semantic/base/components/app.js/index.html)만 고도화함. `pages/`는 미수정.
> 아래는 페이지에서 활용/정합해야 할 신규 자산과 지침. DNA(유채색 0 · noise/grain 금지 · 무기는 명도·스케일·반전·헤어라인·모션뿐)는 그대로.

## 1. 폰트 — 스택 순서 교정 + 죽은 임포트 제거 (tokens.css)
- `@import`가 이제 **한 곳(tokens.css)에서** Inter(300;400;500;600) + Gothic A1(**300;400;500;600;700**) + Noto Sans KR(mono 폴백)을 공급. **Noto Serif KR 삭제**.
- `--font-sans` 스택 순서를 `Inter → Gothic A1 → Apple SD Gothic Neo → Pretendard → system-ui…`로 교정(이전엔 system-ui가 앞서 macOS에서 Gothic A1 미적용 버그).
- **페이지 조치**: 각 페이지 `<head>`의 `<link ...Inter...>`는 이제 **불필요**(tokens.css @import가 공급). 제거해도 되고 둬도 무해. 새 페이지엔 넣지 말 것.
- 한글 300/600 실로드됨 → 히어로 초박(300) vs 세미볼드(600) 병치를 한글에서도 그대로 써도 됨(faux-bold 없음).

## 2. 미정의/유령 토큰 정리 (semantic.css)
- `--chart-grid`의 `--neutral-920` 죽은 참조 → `--neutral-900`으로 확정.
- **`--color-scrim` 호환 별칭 추가** (= `--color-overlay`). `inbox.html:107`의 `var(--color-scrim, rgba(0,0,0,.4))` 하드코딩 폴백은 **`var(--color-overlay)`로 교체 권장**(별칭 덕에 지금도 동작하지만 정본은 `--color-overlay`).

## 3. 신규 토큰 (전부 무채색·모션만)
| 토큰 | 값(light / dark) | 용도 |
|---|---|---|
| `--leading-body-ko` / `--leading-heading-ko` / `--leading-display-ko` | 1.72 / 1.3 / 1.08 | 한글 전용 행간(base 하단 Hangul layer가 자동 적용) |
| `--tracking-caps-ko` | 0.08em | 한글 와이드 라벨 자간 상한 |
| `--duration-reveal` / `--duration-wipe` | 560ms / 480ms | 스크롤 리빌 / 테마 원형 전환 |
| `--fx-grid-line` | neutral-950 / neutral-150 | 헤어라인 모눈 배경 1px 선 |
| `--fx-ink` | text-strong(순흑/순백) | 잉크 필 색 |

## 4. base.css — 한글 조판 계약 자동 적용
- `body`에 `word-break:keep-all; overflow-wrap:break-word; line-break:strict` 추가 + 하단 **Hangul refinement layer**(`:lang(ko)`): 헤딩/디스플레이 행간, `.overline`·`.statcard-label`·`.menu-label` 등 라벨의 `text-transform:none`+한글 자간, `em/i` 이탤릭 무효, 데이터 `tabular-nums`.
- **페이지 조치**: 좁은 셀/칩/배지에 긴 한글이 들어가면 `.truncate`(말줄임)로 감쌀 것(keep-all 오버플로 방지). 초대형 디스플레이는 카피를 `<span>`으로 의도한 줄 단위 분절.

## 5. 신규 유틸리티 클래스 (base.css) — 페이지에서 재사용 권장
- **`.bleed`** — 컨테이너 뚫고 화면 폭 전체(`width:100vw; margin-inline:calc(50% - 50vw)`). 풀블리드 반전 섹션/밴드에.
- **`.section-invert` + `data-theme="dark"`** (섹션에 직접) — 라이트 페이지 속 **순흑 전시실**. 예: `<section class="section-invert bleed" data-theme="dark">`. 404·프라이싱 추천 플랜 뒤 등에 후광/반전 무대로 활용.
- **`.grid-field`** — 요소 배경에 극히 옅은 헤어라인 모눈(중앙으로 페이드). 히어로/섹션 전환부에. `aria` 불필요(::before, pointer-events none).
- **`.crosshair`** — 요소 좌상·우하 모서리에 1px 조준선(제도 감성).
- **`.display-outline`** — 초대형 아웃라인(스트로크) 디스플레이. 안에 `<span class="solid">`로 솔리드 파트 병치(초박 vs 세미볼드). `-webkit-text-stroke` 미지원 폴백 내장.
- **`.ink-fill`** — 하→상 잉크 차오름 호버(칩·비버튼 요소에 옵트인). 버튼은 아래 6번대로 자동.
- **`.underline-grow`** — 좌→우 자라나는 헤어라인 언더라인 호버(텍스트 링크에).

## 6. 컴포넌트 시그니처 (자동 적용 — 페이지 마크업 변경 불필요)
- **버튼**: `.btn-secondary`·`.btn-danger` 호버 = **잉크 필**(아래→위 순흑 차오름, 텍스트 반전). `.btn-primary`는 기존 솔리드 유지. reduced-motion 시 즉시 색 스왑.
- **내비**: `.navbar-link` 호버/활성 = **자라나는 헤어라인 언더라인**(활성 링크는 상시 만개).
- **세그먼트(`.segmented`)**: 스타일은 이제 **`.is-active` 클래스가 정본**. ARIA는 role로 분기됨(아래 7번).
- **별점(`.rating`)**: 입력용이면 키보드(방향키/Home/End) + roving tabindex 자동. 표시용은 `data-readonly="true"`.

## 7. ARIA 패턴 — 페이지도 이 규격으로 통일 (app.js가 양쪽 지원)
- **세그먼트 뷰 전환**(패널 전환 아님)은 `role="radiogroup"` + 자식 `role="radio" aria-checked`로. (plain button에 `aria-selected`는 무효 ARIA)
  ```html
  <div class="segmented" role="radiogroup" aria-label="뷰 전환">
    <button class="seg is-active" role="radio" aria-checked="true">리스트</button>
    <button class="seg" role="radio" aria-checked="false">보드</button>
  </div>
  ```
  → `settings.html`·`product.html`의 무효 `aria-selected` 세그먼트를 이 형태로. app.js `selectSegment()`가 클릭·방향키 모두에서 `aria-checked`+`is-active`+roving tabindex 동기화.
- **입력용 별점**: 컨테이너 `role="radiogroup"`, 별 5개 **전부** `role="radio" aria-checked aria-label="N점"`, 내부 `<svg aria-hidden="true">`. (product.html 별점 정합화 시 이 규격 + 시각=aria=data 3자 일치)
- **진짜 탭(패널 전환)**만 `role="tablist"`/`role="tab"` 유지(inbox/pricing 등).

## 8. 스크롤 리빌 (app.js + base.css) — 페이지에서 쓰려면
- 요소에 **`data-reveal`**(단일) 또는 **`data-reveal-group`**(자식 순차 스태거) 부여 → 뷰포트 진입 시 페이드업.
- **필수 전제**: `<head>` 인라인 스크립트에서 `document.documentElement.classList.add('js')`를 **첫 페인트 전에** 실행해야 함(index.html의 head 스니펫 참조). 안 하면 JS 도착 전 콘텐츠 플래시. reduced-motion/JS-off 시 자동 노출(숨김 방치 없음).
- IO는 threshold 0(상단 진입 트리거) — 뷰포트보다 큰 긴 요소도 정상 발화.

## 9. 테마 토글 = 시그니처 모먼트 (app.js)
- `MM.toggleTheme(originEl)` — **흑↔백 원형 잠식 전환**(View Transitions). 클릭 좌표를 원점으로. 미지원/reduced-motion은 즉시 스왑.
- 인라인 `onclick` 금지 규칙 준수: 커맨드 팔레트 항목은 `data-command-action="toggle-theme"` / `="demo-toast"` 위임 사용(index 참조).

## 10. index.html 참고 (페이지 정합용)
- 히어로: 4-스탯 스트립 제거 → `.spec-line`(색상 0 / 명도 16단계 / 경계 1px / 최대 여백 256px). 다른 페이지도 dev-tool 스탯("60+ 컴포넌트" 류) 대신 세계관 수치로.
- raw `.md` 링크(README/CHECKLIST) 전부 제거. 푸터는 콜로폰(사이트맵). **페이지 푸터에도 .md 직링크 두지 말 것.**
- 인라인 `grid-template-columns`는 클래스로 승격(모바일 붕괴 방지). `.demo-grid-2` 패턴 참고.
- 어체: theme-14는 **선언·명령군**(단문·명사형 종결). "질서." "정밀함." 톤 유지.
