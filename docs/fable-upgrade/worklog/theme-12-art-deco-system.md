# theme-12-art-deco · 시스템 레이어 변경 노트 (페이지 에이전트용)

> 대상 파일: tokens.css / semantic.css / base.css / components/*.css / index.html / app.js
> pages/* 는 미수정. 아래는 페이지가 **일관 반영해야 할 계약**과 새 토큰·유틸·JS 동작.

---

## 1. P0 위생 — 페이지에서 반드시 맞출 것

### FOUC 방지 스니펫 (전 페이지 `<head>` 최상단)
`<html lang="ko" data-theme="dark">` 의 **하드코딩 `data-theme` 를 제거**하고(→ `<html lang="ko">`), `<head>` 최상단에 아래를 넣는다. 키는 app.js 와 동일한 `"deco-theme"`, 기본은 다크(흑금이 정본).
```html
<script>
(function(){ try{ var t=localStorage.getItem("deco-theme")||"dark";
  document.documentElement.setAttribute("data-theme",t);}catch(e){} })();
</script>
```

### app.js 내장 문자열은 이미 한글화됨
토스트 기본 title "알림", 닫기/제거 aria, "슬라이드 N로 이동" 등. 페이지에서 별도 처리 불필요.

---

## 2. 새/변경 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-primary-text` | 다크 gold-300 / **라이트 gold-700** | 골드를 **텍스트**로 쓸 때. 소형 라벨 대비 여유 |
| `--btn-secondary-fg-hover` | 다크 gold-100 / 라이트 gold-800 | secondary 버튼 hover 색(라이트 흰 표면에서 소실 방지) |
| `--tracking-caps-ko` | 0.12em | 한글 넓은-라벨 자간 상한 |
| `--tracking-display-ko` | 0.03em | 한글 대형 디스플레이 자간 |
| `--leading-heading-ko` / `--leading-display-ko` / `--leading-body-ko` | 1.32 / 1.14 / 1.7 | 한글 행간 |

**AA 수리(중요):** 라이트 `--color-primary` 를 gold-600→**gold-700**(안티크 골드, 크림 위 ≈6:1)로 상향. hover=gold-800, active=gold-900. 이제 라이트에서 `var(--color-primary)` 를 텍스트로 써도 AA 통과. 장식·선버스트·메탈 그라데는 원시 `--rgb-gold`(#C9A24B) 고정이라 밝기 유지.
→ 페이지에서 골드 소형 텍스트(`.g-val`, `.pc-num`, 라벨, 링크 등)는 그대로 두어도 안전하나 의미상 `--color-primary-text` 권장.

**폰트:** `--font-display` 한글 폴백 = **Nanum Myeongjo 800**(Gowun Batang 제거·임포트에서도 삭제). 한글 `.display`/`h1` 은 base.css `:lang(ko)` 레이어가 **자동으로 weight 800 + 자간 축소**. 라틴 워드마크/로고엔 **`.wordmark` 클래스**를 붙여 opt-out(안 붙이면 Cinzel 이 faux-bold 됨).

---

## 3. 한글 조판 레이어 (base.css 하단, 전 페이지 자동 적용)
`<html lang="ko">` 만 지키면 `keep-all`·행간·`text-wrap: balance/pretty`·faux-italic 제거·tabular 숫자가 자동 적용. 페이지에서 별도 CSS 불필요.

---

## 4. ARIA·키보드 — 페이지 마크업 지침

- **Segmented(뷰/옵션 선택기):** `role="radiogroup"` + 자식 `<button role="radio" aria-checked>`. 기존 `role="tablist"`/`aria-selected`/`aria-pressed` 는 **app.js 가 런타임에 radio·aria-checked 로 자동 이관**(pricing 의 selected+pressed 이중 부여도 정리됨) + 방향키/roving tabindex 부여. 그래도 **마크업을 radiogroup 으로 고쳐두는 것을 권장**.
  - 진짜 탭(패널 전환)은 `data-tabs` + `role="tablist"` 그대로. 눌림 토글은 `.btn-group[data-toggle]`(aria-pressed) 그대로.
- **정렬 테이블:** `<th class="is-sortable" aria-sort="none"><button type="button" class="th-sort">컬럼명 <span class="sort-ind" aria-hidden="true">↕</span></button></th>`. app.js 는 `.th-sort` 버튼(키보드 무료)에 바인딩, 버튼 없으면 th 에 tabindex+Enter/Space 폴백. `.th-sort` 스타일은 data.css 에 신설됨.
- **Pagination:** `<a href="#">` 금지 → `<button type="button">`. 생략기호는 `<span class="ellipsis" aria-hidden="true">`.
- **Progress:** `.progress`·`.progress-ring` 컨테이너에 `role="progressbar" aria-valuenow/min/max` + `aria-label` 부여.
- **cmdk 트리거:** 인라인 `onclick` 금지 → `data-cmdk-trigger` 속성만. app.js 가 위임 처리.
- **avatar span:** `role="img"` + aria-label. 이니셜은 1~2자(원형 overflow 잘림 주의).

---

## 5. 새 유틸리티 클래스

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.wordmark` | 라틴 캡스 로고(한글 800 승격에서 제외, 0.34em 유지) | `<span class="display text-gold wordmark">Maison Déco</span>` |
| `.gild-sweep` | 진입 시 금박이 빛을 훑는 shimmer. **`.animate-in` 문맥 안**에서만 발화, reduced-motion 미발화 | 히어로 타이틀: `<h1 class="display animate-in"><span class="text-gold wordmark gild-sweep">…</span></h1>` |
| `.chapter-numeral` + `.chapter-numeral--watermark` | 섹션 헤더 뒤 초대형 아웃라인 숫자(로마/№). aria-hidden. 부모에 `.sec-head`(position:relative) 필요 | 아래 예 |
| `.deco-rule` (기존) / `.deco-divider .lozenge`(기존) | 섹션 헤더 장식을 **교차·차등화**(항상 chevron-rule 복붙 금지) | 위계별로 다른 장식 사용 |

**섹션 헤더 워터마크 패턴(index 참고):**
```html
<div class="sec-head symmetry mb-8">
  <span class="chapter-numeral chapter-numeral--watermark" aria-hidden="true">II</span>
  <p class="eyebrow">모티프</p>
  <h2 class="fs-3xl">장식 모티프</h2>
  <div class="deco-divider"><span class="lozenge" aria-hidden="true"></span></div>
</div>
```
`.sec-head` CSS(스코프 필요 시 페이지 `<style>` 에 복사): `.sec-head{position:relative;isolation:isolate} .sec-head>*:not(.chapter-numeral){position:relative;z-index:1}`

---

## 6. 시그니처 모션(전부 자동·reduced-motion 안전)
- **금박 스윕:** `.btn--primary` hover/focus 시 대각 하이라이트가 표면을 훑음(screen 블렌드, transition 기반 → 전역 reduce 가드로 정지).
- **막이 오르는 모달:** `.overlay:not([hidden]) .modal-head::before` 선버스트가 회전·확대하며 펼쳐짐.
- **로젠지 점화:** `.animate-in .lozenge` 스크롤 진입 시 45° 회전+글로우.
페이지는 이 클래스들만 쓰면 자동으로 문법을 상속. 새 keyframe 추가 시 `@media (prefers-reduced-motion: no-preference)` 로 감쌀 것.

---

## 7. 배경·분위기
base.css `body::before` = "밤의 연회장" 깊이(상단 네이비 워시 + 골드 후광 + 코너 깊이, z<0 라 텍스트 대비 무영향). 라이트 그레인 0.25→0.4. 페이지가 섹션 배경을 교차할 땐 `--color-bg ↔ --color-bg-elevated` + `.deco-fluting` 활용(진열대 균질 방지).

---

## 8. 카피·데이터 계약 (§3-① 세계관 붕괴 수리 연장)
- 통화 **₩**(달러/유로 금지). 큰 금액 억·만 축약. 인명 한국 성명.
- 어체 = **격식·절제(합쇼체·서면체)**. 세계관 어휘: **극장/개관/판 №/시즌/갈라/살롱/컨시어지**. SaaS 스펙("저장 10GB/이메일 지원") 금지 — pricing·onboarding 은 메종 어휘로 재작성.
- dev-tool 자기지시("순수 CSS/0 의존성/68 컴포넌트") 금지 → 극장 마퀴·판권면(콜로폰: `개관 MCMXXV — MMXXVI · 판 № 012/030`)으로.
- 교차 페이지 정합: 같은 대상 수치/이름/가격은 전 페이지 동일값.

---

## 9. index.html 에서 실증한 것(페이지가 참고)
히어로=극장 파사드(오버사이즈 골드 워드마크 bleed + 좌우 지구라트 타워 SVG + 극장 마퀴 + gild-sweep), 섹션 헤더 4종 차등화(워터마크 로마숫자 I~IV·장식 교차·스케일 차등), 콜로폰 푸터(GitHub 버튼 제거), 반응형 360~1920 무overflow(내비 CTA 는 ≤460px 숨김·검색 아이콘화).
