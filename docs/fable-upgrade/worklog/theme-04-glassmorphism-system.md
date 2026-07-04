# theme-04-glassmorphism — 시스템 레이어 고도화 워크로그 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 손댔습니다. `pages/*.html`은 미수정 — 아래 계약대로 반영해 주세요.

---

## 1. 새 토큰 (전부 시맨틱 경유, 하드코딩 금지)

**tokens.css (primitive)**
- `--rose-300/400/500` — danger 그라데이션용 원시 램프
- `--glass-sweep` — 유리 표면을 훑는 빛줄기 그라데이션 (시그니처)
- `--glass-fringe` — 1px 색수차(cyan▸/◂violet) box-shadow 값
- `--tilt-max: 7deg` — 패널 3D 틸트 최대 회전
- `--leading-heading-ko(1.3) / --leading-display-ko(1.12) / --leading-body-ko(1.72) / --tracking-caps-ko(0.08em)` — 한글 조판

**semantic.css (role/component)**
- `--color-danger-hi` (라이트=rose-400 / 다크=rose-300) — danger 그라데이션 밝은 스톱
- `--color-rating` = `var(--chart-5)` — 별점 골드(테마 추종)
- `--btn-danger-bg` — danger 버튼 그라데이션 토큰 (기존 `#fb5e7e` 하드코딩 제거)
- `--aurora-hue` — 스크롤 연동 색상 시프트(0deg 기본). base.css가 `.aurora-bg/.aurora-blobs`에서 `hue-rotate(var(--aurora-hue,0deg))`로 소비, app.js가 스크롤 진행도로 세팅. **페이지가 할 일 없음**(자동).

**변경된 토큰 (주의)**
- `--card-bg`: `var(--glass-bg)`(0.16) → **`var(--glass-bg-strong)`**. DNA 계약(README:16 "본문은 항상 glass-bg-strong 위") 준수 + 대비 수리. `.card`/`.statcard`는 이제 가독 표면. **텍스트 없는 장식 패널은 `.glass` 또는 `.tile`**(여전히 0.16 투명)을 쓰세요.

---

## 2. 새 유틸리티 / 컴포넌트 클래스

- **`.glass-sweep`** — hover/focus 시 표면을 사선으로 훑는 빛줄기(::after). 유리 버튼·CTA·검색바 등 "만지고 싶은" 요소에 부여. 예: `<a class="btn btn-secondary glass-sweep">`.
- **`.glass-fringe`** — hover/focus 시 림에 색수차. (버튼 secondary·인터랙티브 카드엔 이미 자동 적용됨. 추가로 원하면 부여)
- **`[data-tilt]` (+옵션 `data-tilt-max="6"`)** — 포인터 방향으로 패널이 3D로 기움. app.js가 `--tilt-x/--tilt-y` 세팅. **hover-lift가 있는 `.card-interactive`에는 붙이지 말 것**(transform 충돌). 떠 있는 위젯 클러스터/정적 컨테이너에만. reduced-motion 자동 정지.
- **`.card-interactive`** — 이제 hover 시 라이트 스윕(::after) + 색수차 림 자동. 마크업 변경 불필요.
- **`.sr-only`** — base.css에 정본 추가(구 `.visually-hidden` alias 유지). **pages의 로컬 `.sr-only` 정의(pricing/product/onboarding)는 삭제**하고 이걸 쓰세요.
- **`.navbar-toggle`** — 모바일 버거(아래 4번).

## 3. 시그니처 모션 (자동)
- `[data-reveal]`가 **glass focus-in**(blur7px + translateY26 + scale.985 → 선명)으로 격상. 요소에 `data-reveal`만 달면 base.css가 처리. JS 실패/reduced-motion 시 완성 상태로 노출(안전 게이트 `.js-ready`). **로컬 `[data-reveal]` 오버라이드 금지**(index에서 제거함).

---

## 4. 모바일 내비 계약 (P0 — 769~900px 데드존/버거 부재 수리)

**브레이크포인트 900px로 통일.** `.show-mobile`=≤900 표시, `.hide-mobile`=≤900 숨김 (base.css). 사이드바 off-canvas·navbar 링크 붕괴 전부 900 기준.

**앱 셸 페이지(dashboard/kanban/inbox/settings/profile)**
- 기존 버거 `<button class="… show-mobile" data-toggle-class="open" data-target=".sidebar">` 그대로 두면 됨. app.js `MobileNav`가 `.sidebar.open`을 관찰해 **스크림·ESC·포커스 트랩·포커스 복원**을 자동 부여(P1 수리). 사이드바는 반드시 `.app-shell > .sidebar` 구조.
- 닫힌 off-canvas 사이드바는 `visibility:hidden`으로 Tab 순서에서 빠짐(layout.css). 데스크톱(≥901)은 항상 표시.

**마케팅/랜딩형 navbar 페이지** (pricing·404 등 navbar 쓰는 페이지)
- `.navbar-links`에 `id` 부여 + `.navbar-actions` 안에 버거 추가:
```html
<button class="navbar-toggle" data-navbar-toggle aria-expanded="false"
        aria-controls="<links-id>" aria-label="메뉴 열기">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
</button>
```
- app.js가 `.navbar.nav-open` 토글 + aria-expanded 동기화 + 바깥클릭/ESC/링크클릭 닫기 처리. ≤900px에서 링크가 프로스티드 시트로 드롭다운.

---

## 5. 접근성/상태 (app.js가 페이지 마크업 없이도 처리하는 것들)

- **테이블 정렬 키보드화**: `th.sortable`에 tabindex/aria-sort/Enter·Space 자동 부여. 페이지는 `th.sortable`(+`data-type="number"`, 셀 `data-sort`)만. 별도 JS 불필요.
- **세그먼트 컨트롤**: 값 선택형은 **`role="radiogroup"` + 버튼 `role="radio" aria-checked`** 로 쓰세요(❌ `role="tablist"`+`aria-selected` 금지). app.js가 roving tabindex + 방향키 + aria-checked 동기화. 진짜 탭/패널 전환만 `[data-tabs]` tablist 사용. 프라이싱 월/연 토글은 `[data-pricing-toggle]` 세그먼트가 segchange 발화(유지).
- **별점(rating)**: app.js가 `role=radiogroup/radio` + 방향키 자동 부여. 입력형 = `.rating`(버튼 `aria-label="N점"`), 표시형 = `.rating.is-readonly`. 채운 별은 `--color-rating`.
- **select 캐럿**: 다크 오버라이드로 테마 추종(작업 불필요).
- **cmdk 빈 결과**: ⌘K 팔레트 있는 페이지는 `.cmdk-list` 안에 반드시:
```html
<div class="cmdk-empty" hidden aria-live="polite">
  <p style="margin:0;font-weight:600;color:var(--color-text)">검색 결과가 없어요</p>
  <p style="margin:var(--space-1) 0 0;font-size:var(--text-sm)">다른 키워드로 찾아보거나 ESC로 닫을 수 있어요.</p>
</div>
```
- **오류 상태**: `.input.is-invalid` + `aria-invalid="true"` + `.field-error`(아이콘+메시지) + `aria-describedby`. settings 저장 실패·onboarding 필수값 등 **장면 속 사건**으로 최소 1회 노출(§6-3).
- **숨김 오버레이 `autofocus` 금지** — app.js가 열릴 때 포커스 이동(제거 요망).

---

## 6. FOUC / 폰트 / 한글 (전 페이지 필수)

- 모든 `<head>` 최상단(메타 직후)에 **선적용 스크립트** + `<html>`의 하드코딩 `data-theme` 제거:
```html
<script>(function(){try{var t=localStorage.getItem("aurora-glass:theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
```
- `<html lang="ko">` 필수(한글 조판 레이어 전제).
- 폰트: tokens.css `@import`가 이제 **모든 패밀리 + 한글 800**을 단일 로드(Noto Serif KR 제거, faux-bold 해소). 페이지별 `<link rel="stylesheet" ...fonts...>`는 삭제 가능(둬도 무해). 폰트 스택 순서 교정됨(한글 무드폰트를 system-ui 앞으로).

---

## 7. 페이지 에이전트 남은 과제 (내 스코프 밖)

- **P0 SVG var()**: `pages/dashboard.html:108` `<g stroke="var(--color-divider)">` → `style="stroke:var(--color-divider)"` 또는 `stroke="currentColor"`.
- **404 대담화(§5-6)**: 유리 파편(shard)에 `backdrop-filter` 살려 숫자를 굴절/가리게 — index 쇼케이스의 404 미니씬(`.m-shard`)이 방향 참고.
- **컴포넌트/썸네일 미니씬**: index `<style>`의 `.mini`/`.m-*` 키트는 페이지 로컬. 필요 시 복사, 아니면 무시.
- **씬 변주(§6-2)**: 페이지 성격별 배경 — 대시보드=절제, 404=기울어진/무너진. `--aurora-hue`는 스크롤 자동이므로 페이지별 추가 연출은 자유.
- 페이지 내 `role="tablist"`+`aria-selected`로 된 값-세그먼트가 있으면 5번 규격으로 교체.

## 8. 변경된 컴포넌트 하드코딩 정리 요약
buttons(danger→`--btn-danger-bg`), controls(별점→`--color-rating`, 흰 노브/체크는 intentional 주석), forms(select 캐럿 다크 오버라이드), navigation(done-step→`--color-accent-fg`), data-display(timeline 점 rim→`--glass-highlight`; 코드블록 팔레트는 "항상 다크 터미널" intentional 유지), badge/card 흰색은 intentional 주석.
