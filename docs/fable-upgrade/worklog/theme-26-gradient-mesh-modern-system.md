# theme-26-gradient-mesh-modern — 시스템 레이어 변경 노트 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 고도화했습니다. pages/는 미수정.
아래는 페이지 작업 시 **반드시 일관 반영**할 항목입니다.

---

## 1. 폰트 (tokens.css)
- **Noto Serif KR 임포트 삭제**(화석). Gothic A1 **800 웨이트 추가 로드**. `--font-mono`에서 Noto Sans KR 제거.
- 폰트 스택 순서 교정: `Plus Jakarta Sans → Gothic A1 → Noto Sans KR → system-ui …` (한글 무드폰트가 system-ui보다 앞).
- 한글 조판 레이어가 base.css 하단에 추가됨(`:lang(ko)`): keep-all, 본문 1.7 행간, 디스플레이 자간 -0.01em, faux-bold 차단, tabular-nums. **HTML은 `lang="ko"` 필수** — 그래야 이 레이어가 켜짐.
- 숫자/가격/스탯에는 `.table td/.statcard__value/.price/.cell-num` 셀렉터가 자동으로 tabular-nums 적용. 커스텀 숫자 요소엔 클래스 맞추거나 `font-variant-numeric` 직접.

## 2. 신규 토큰 (전부 토큰 경유로 소비할 것 — 하드코딩 금지)
semantic.css:
- 상태: **`--color-warning` 라이트값을 amber-700(#B45309)로 하향**(대비 수리). 페이지의 warning 텍스트/배지는 이 토큰만 사용.
- `--rating-star` / `--rating-empty` — 별점 색(라이트 amber-500·다크 amber-400). 별점 하드코딩 금지.
- `--priority-low|mid|high` — 칸반/리스트 우선순위 액센트. **kanban의 인라인 `border-left: … var(--blue-400)` 류를 이 토큰으로 교체**.
- `--spotlight-color` / `--spotlight-size` — 카드 포인터 블룸(자동).
- `--mood-hue` (+ `[data-mood="cool|warm|fresh|twilight"]` in base.css) — 배경 메시 색온도.
- 배지: `--badge-gradient-bg` / `--badge-accent-bg` / `--badge-warm-bg` (딥 스톱, 흰 글자 4.5:1 통과). `.badge--accent/--warm/--gradient` 이 자동 소비 — 페이지는 클래스만 쓰면 됨.
- 버튼: `--btn-danger-bg` / `--btn-danger-bg-hover` (`.btn--danger` 자동 소비).

tokens.css: `--gradient-accent-deep`, `--gradient-warm-deep`, `--gradient-danger(-hover)`, `--amber-400~700`, `--leading-*-ko`, `--tracking-display-ko`, `--tracking-caps-ko`.

## 3. 신규 유틸/컴포넌트 클래스
- **`.card--hover`** — 이제 포인터 스포트라이트 블룸 자동 탑재(app.js 위임). 오버레이(dropdown/popover/context-menu/tooltip)를 **품은 카드에는 쓰지 말 것**(isolation 스택 문맥 생성). 정적/링크 카드에만.
- **`.card--beam`** — 회전 그라디언트 보더 빔(시그니처). **pricing 추천 플랜 카드에 부여**(§5-3). radius 상속됨. reduced-motion 시 정지.
- **`.nowrap`** — 중간개행 금지 토큰용(`₩1,240,000`, 상품명 등).
- **`.demo-card--wide`** (index 로컬) — 갤러리 2칸 스팬 + 모바일 안전. 페이지엔 불필요.
- 칸반 dropzone: `[data-kanban-col].is-dropzone` 하이라이트 스타일 제공.

## 4. ARIA/인터랙션 (컴포넌트 계약 변경 — 마크업 맞출 것)
- **세그먼트 컨트롤**: `role="radiogroup"` + 버튼 `role="radio"` `aria-checked` 로 변경(구 `role="tablist"`+`aria-selected` 폐기). CSS 활성 셀렉터도 `[aria-checked="true"]`. app.js가 방향키·roving tabindex 처리. **페이지의 세그먼트도 이 마크업으로**.
- **별점(입력용)**: `role="radiogroup"` + 버튼(app.js가 `role="radio"`·aria-checked·방향키 자동 주입). 표시 전용은 `.rating--read`.
- **토스트**: 본문은 **`data-toast-text`** 속성으로(구 `data-toast="본문"` 중복속성 버그). 트리거는 `data-toast data-toast-title="…" data-toast-text="…" data-toast-type="success|danger|info|warning"`. danger는 `role="alert"` 자동.
- **⌘K 명령**: app.js가 현재 경로(root vs /pages/)를 감지해 href 자동 보정. 페이지에서 `window.GMM_COMMANDS` 오버라이드 불필요.

## 5. 배경/모션/씬
- **씬 변주**: 섹션/`<body>`에 `data-mood-scene="cool|warm|fresh|twilight"`(스크롤 감지) 또는 `<body data-mood="…">`(페이지 고정) 부여 → 메시 색온도 전환. 권장: dashboard=cool, pricing=warm, onboarding=fresh, **404=twilight**.
- 오로라 모서리 노출(P5), focus-visible가 원형 컨트롤을 각지게 만들던 버그(P7) 수리됨 — 페이지 추가 조치 불필요.
- FOUC 스니펫을 index `<head>`에 삽입(키 `gmm-theme`). **모든 페이지 `<head>` 최상단에 동일 스니펫 넣고 `<html>`의 `data-theme` 하드코딩 제거**.

## 6. 데이터 정합(정본 — 전 페이지 통일)
- 고객사명: **달빛서점 · 모두의가구 · 세줄일기** (Acme/Globex/Initech 금지).
- MRR 정본: 달빛서점 ₩1,240,000 / 모두의가구 ₩880,000 / 세줄일기 ₩2,110,000. `data-sort`는 원 단위 숫자(1240000…).
- 통화 `₩`+콤마, `$`/`€` 금지. 예산 등 슬라이더는 `data-suffix="만원"` 패턴.
- 히어로 스탯 정본: 이번 달 매출 **₩4.82억 (전월 대비 +18.2%)** — dashboard와 값 일치시킬 것.

## 7. index.html 방향(참고)
- 자기서술 dev-stat("60+ 컴포넌트/200+ 토큰") 스트립 제거 → 비대칭 히어로(좌측 초대형 그라디언트 한글 "그라디언트를 / 신호로 쓰다." + 우측 화면 밖으로 잘리는 **메시 오브** + 실 컴포넌트 플로팅 카드). 페이지도 진열대 대신 장면(§6) 지향.
- README.md 직링크·"프레임워크 없음" 카피 제거 → 콜로폰.

## 8. 보이스
- 어체: **해요체/합니다체 실무 톤**(§5-C 실무·명료군). "6월 매출 ₩4.82억 — 전월 대비 +18.2%"처럼 데이터 밀도가 곧 보이스. 감성 훅 1페이지 1회 이하.
