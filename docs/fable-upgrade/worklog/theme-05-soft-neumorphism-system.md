# theme-05-soft-neumorphism · 시스템 레이어 고도화 노트 (페이지 에이전트용)

작업 범위: tokens/semantic/base/theme/components/*.css + index.html + app.js. **pages/ 는 미변경** — 아래 "페이지 TODO" 반드시 반영.

핵심 방향: DNA("한 재질, 깊이는 이중 그림자에서만") **증폭**. 색·보더를 새로 들이지 않고 깊이(depth)로 대담화. 죽어 있던 `signature.css`(carved 타이포·조각 릴리프·촉각 오브·pressed moat)를 점화해 theme.css 번들에 배선함.

---

## 1. 새/변경 토큰 (전부 tokens.css → semantic.css 경유)

### 신규 primitive (tokens.css)
- `--shadow-carved` : 깊은 inset 릴리프(대형 조각 배경·bowl·moat). distance-lg/blur-lg 기반.
- `--shadow-hero`   : 큰 raised 리프트(오브 hover). 18px/36px.
- `--grain-opacity` : 필름 그레인 알파(라이트 .035 / 다크 .05). **자동 적용**(base.css `body::before`) — 페이지에서 손댈 것 없음.
- 한글 조판: `--leading-heading-ko`(1.32) · `--leading-display-ko`(1.14) · `--tracking-caps-ko`(0.06em). **자동 적용**(base.css `:lang(ko)` 레이어).

### 신규 semantic alias (semantic.css)
- `--elevation-carved` = `--shadow-carved`, `--elevation-hero` = `--shadow-hero`.
- `--color-border-soft`(라이트/다크 정의됨) — 아주 옅은 조각 이음선. onboarding.html 이 폴백으로 참조하던 유령 토큰을 실토큰화.

### 다크모드 대비 수리 (컴포넌트가 자동 상속 — 페이지 수정 불필요)
- `--green-700/-amber-700/-red-700/-blue-700` **다크 재정의**(밝은 톤) → `.inline-note` 4종 텍스트 다크에서 2:1 붕괴 → **6.8~7.7:1**로 수리.
- `--mint-500/-600` 다크 재정의 → `.codeblock .tok-str`(6.40) · mint 아바타(6.04) 수리.
- `--indigo-500` 다크 살짝 밝게(#8f96f7) → `.codeblock .tok-key` 4.43→**5.39**.
- 실측: 변경 색쌍 전부 ≥4.5 (WCAG 계산 검증 완료). CHECKLIST.md 다크 표에 반영 요망.

### 폰트
- **@import 단일화**: tokens.css 한 곳으로 통합(라틴+한글+모노). base.css 의 중복 @import 제거.
- **죽은 Noto Serif KR import 삭제**.
- 한글 스택 순서 교정: `Gowun Dodum`을 `system-ui` **앞**으로(→ macOS 에서 무드폰트 실적용). `--font-display/-body` 둘 다.

---

## 2. 새 컴포넌트·유틸 클래스 (signature.css, 번들에 배선됨 — 페이지에서 바로 사용)

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.nm-scene` | 조각 배경 씬 컨테이너(position:relative; overflow:clip) | `<section class="… nm-scene">` 안에 릴리프를 첫 자식으로 |
| `.nm-relief` + `--tl`/`--br`/`--capsule` | 화면 밖으로 잘려나가는 거대한 pressed 도형(aria-hidden) | `<span class="nm-relief nm-relief--tl" aria-hidden="true"></span>` · **페이지마다 프리셋 조합을 달리해 반복 금지** |
| `.nm-orb` (> `.nm-orb-inner` > `.nm-orb-core`) | 눌리는 촉각 오브(rest→pressed→스프링백). JS 자동 배선(reduced-motion 시 스킵) | `<button class="nm-orb" type="button" aria-label="…"><span class="nm-orb-inner"><span class="nm-orb-core"></span></span></button>` |
| `.nm-bowl` | 오브가 얹히는 파인 그릇 | 404 "그릇 속 구슬" 무대 |
| `.nm-moat` | featured 카드를 감싸 해자를 파서 물리적으로 융기 | **pricing featured 의 2px 링(반칙)을 이걸로 교체** |
| `.text-embossed` | 살짝 솟은 베벨(대비 안전 — 실헤딩 가능) | 히어로 헤드라인 |
| `.text-carved` | 재질에 눌러 새긴 장식 텍스트(저대비 — **aria-hidden 전용**) | 거대 404 숫자 각인 |

index.html 히어로가 `.nm-scene`+`.nm-relief`+`.nm-bowl`+`.nm-orb`+`.text-embossed` 통합 레퍼런스.

---

## 3. base.css 로 승격된 것 (페이지 로컬 중복 제거 대상)

- **`[data-reveal]` 등장 모션** → base.css 로 이동, `.js` 게이트("surfacing" 모션: translateY+scale, ease-soft). JS 실패 시 콘텐츠 안 사라짐. **페이지의 로컬 `[data-reveal]{opacity:0;transform…}` 블록은 전부 삭제**(중복).
- **한글 정제 레이어**(`:lang(ko)` keep-all/행간/자간/tabular) → base.css 하단. 전 페이지 `<html lang="ko">` 전제(이미 충족).
- 전역 `:focus-visible` 에서 강제 `border-radius` 제거(링이 대상 형태를 자동 추종).
- **`.section`/`.hero` 처럼 `padding: X 0` 로 컨테이너 좌우 패딩을 0으로 덮는 패턴 주의** — 반드시 `padding-block:` 사용(모바일 우측 잘림 버그의 원인이었음).

## 4. app.js 변경 (전 페이지 공유)

- **오버레이 스크림 폴백**: 드로어가 공용 `.overlay`의 형제가 아니어도 스크림이 켜짐(P0 수리 — 드로어 배경차단·바깥클릭닫기 복구).
- **닫힌 모달/⌘K 패널** `visibility:hidden`(overlays.css) — 투명 클릭 가로채기 제거(P0).
- **세그먼트 ARIA 정규화**: 버튼 role 에 맞는 상태속성만 씀(radio→`aria-checked`, tab→`aria-selected`, else→`aria-pressed`) + roving tabindex. radiogroup 에 방향키 지원.
- **선언형 토스트**: `data-toast-title` / `data-toast-text` / `data-toast-variant` (인라인 onclick 대체, `data-*-close`와 병행 발화).
- toast 를 textContent 조립으로(innerHTML 제거).

---

## 5. 페이지 TODO (이 시스템 변경에 맞춰 반드시 반영)

1. **FOUC 스니펫**: 전 페이지 `<head>` 최상단(스타일시트 앞)에 인라인 스크립트 추가 — `localStorage("nm-theme")` 읽어 `data-theme` 조기 세팅 + `document.documentElement.classList.add("js")`. 그리고 `<html>`의 하드코딩 `data-theme="light"` **제거**. (index.html 레퍼런스 참고, key 는 반드시 `nm-theme`.)
2. **로컬 `[data-reveal]` 블록 삭제** (base.css 로 승격됨).
3. **세그먼트 ARIA**: `role="group"`/`role="tablist"` + `aria-selected` 조합을 → `role="radiogroup"` + 자식 `role="radio" aria-checked tabindex`(선택된 것만 0, 나머지 -1)로. 대상: dashboard/kanban/pricing/product 의 보기·기간·정렬 세그먼트. (index.html 두 예시 참고.)
4. **SVG var() 버그**: product.html 의 `<circle … fill="var(--color-surface)"/>` ×3 → `style="fill:var(--color-surface)"`.
5. **유령 토큰**: not-found.html `var(--ease-in-out, ease)` → `var(--ease-standard)`. onboarding.html `var(--color-border-soft, rgba(0,0,0,.05))` → 폴백 제거(실토큰 존재).
6. **인라인 onclick 제거** → `data-toast-*` 로.
7. **카피/데이터 한글화·정합**: 통화는 `₩4.82억`·`₩6.29억`(억/만 축약), 절대 `$`·`₩48,200K` 금지. 캠페인/상품명 국내식(예: 여름 신규가입 캠페인 / 가을 멤버십 리텐션 / 달빛서점 리브랜딩 / 추석 선물세트 사전예약 — index 테이블이 정본). 어체는 **해요체(다정·환대)** 통일.
8. **대담화 이식(권장)**: pricing featured → `.nm-moat`+`scale(1.04)`(2px 링 대체). 404 → `.nm-bowl`+`.nm-orb`(구슬) + `.text-carved` 404 숫자. dashboard 핵심 KPI 하나를 pressed well 안 거대 숫자로(비대칭 벤토). 각 페이지 `.nm-scene` 릴리프 프리셋은 **다르게**.
9. 아코디언은 grid-rows 방식으로 바뀜(600px 캡 제거) — 마크업 변경 불필요, 단 `.accordion-panel > .accordion-panel-inner` 구조 유지.

## 6. 검증 완료(시스템+index)
360/768/1440 가로 오버플로 0(CDP scrollWidth==innerWidth), 콘솔 에러 0, 모달/드로어 스크림·포커스 정상, 세그먼트 aria-checked 단일화, 다크 대비 실측 ≥4.5, FOUC 없음(data-theme 조기적용 확인), 라이트/다크 히어로 육안 확인.
