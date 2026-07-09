# theme-28-newsprint · 시스템 레이어 고도화 노트 (페이지 에이전트용)

정체성 전환: **미국 브로드시트 흉내 → 한국 일간지 「원장일보 THE LEDGER」**. index.html을 "원장일보 조판 규격집(스타일북)"으로 재조판했습니다. 페이지도 이 정체성·데이터·어법에 맞추면 됩니다. DNA(모든 radius 0, 상자 대신 괘선, 1색 레드, 세리프/크림지)는 자산이므로 보존·증폭했습니다.

---

## 1. 새/변경 토큰

### tokens.css
- **폰트 통합**: Latin 4종 + Korean 5종을 **tokens.css 단일 @import** 로 합쳤습니다. `base.css`의 @import 는 삭제됨. **페이지는 절대 폰트 @import/link 를 다시 넣지 마세요** (theme.css → tokens.css 로 이미 로드됨). 원하면 페이지 `<head>`에 `preconnect`만 추가 가능.
- `--font-ui` 3순위 폴백 `Noto Serif KR → Noto Sans KR` 로 교정(고딕 계열 일관).
- **프로세스 잉크(2차 판)** — 검정 바탕 전용 + 미스레지스트레이션: `--ink-cyan --ink-green --ink-green-2 --ink-amber --ink-blue`.
- **프레스 모션/fx 노브**: `--duration-press(560ms)` `--misreg-x(0.6px)` `--ink-bleed(0.35px)` `--reveal-stagger(70ms)` `--fx-worklight(0)`.
- **한글 조판 토큰**: `--leading-display-ko(1.15) --leading-heading-ko(1.32) --leading-body-ko(1.7) --tracking-caps-ko(0.06em)`.

### semantic.css
- **`[data-theme="auto"]` 다크 블록 전체 완성** (기존엔 일부만 remap → 링크·보더·status·scrim 라이트값 잔존 버그). 이제 Night 세트 풀 미러.
- 신규 컴포넌트 토큰: `--toast-success/-warning/-danger`, `--code-key/-str/-num/-fn/-com` (검정 코드/토스트 바탕 전용, 에디션 무관).
- `--fx-worklight`: dark/auto 에서 1 (야간 작업등 글로우 on).

> 하드코딩 hex 4곳(코드블록 3 + 토스트 2) + 스트라이프 rgba 1곳 → 전부 토큰화 완료. components/*.css 하드코딩 hex **0건**.

---

## 2. 새 컴포넌트 · 유틸리티 클래스 (페이지에서 활용)

### 헤드라인 스케일 (base.css) — 인라인 폰트 스타일 금지, 이걸로 대체
`.hed-1`(리드/배너) `.hed-2`(주요) `.hed-3`(섹션톱) `.hed-4`(표준) `.hed-5`(단신).
각각 masthead face + black + tight leading + `keep-all` 내장. `em` 은 자동 레드.
```html
<!-- 금지: <span style="font-family:var(--font-masthead);font-weight:900;font-size:..."> -->
<h2 class="hed-2"><span>기준금리</span> <em>동결</em></h2>
```
> **지문 #3 처방**: front-page 등의 반복 인라인 헤드라인 스타일을 `.hed-*` 로 치환하세요. dashboard 의 유일 h1 이 13px 유틸(`section-head__title`)이던 문제 → 진짜 데스크 헤드라인 `<h1 class="hed-2">` 세우고 section-head 는 h2로.

### 시그니처 모션 리빌 (base.css, app.js 엔진 공용)
`[data-reveal]` 기본(가라앉기) + 변주: `data-reveal="ink"`(잉크 마름 blur→sharp) `"stamp"`(활판 쾅) `"wipe"`(윤전기 좌→우) `"rule"`(괘선 그어짐). 스태거: `style="--reveal-i:N"`.
```html
<figure class="figure-news cut-in" data-reveal="wipe">…</figure>
<div class="gallery-card" data-reveal style="--reveal-i:3">…</div>
```
> **페이지 필수 작업**: 각 페이지 `<style>` 안의 `[data-reveal]{opacity:0;transform:...}` + `[data-reveal].is-revealed{...}` **두 줄 삭제** 하세요(이제 base.css 가 소유). 남겨도 base 가 override 하지만 dead CSS 이므로 정리. 원하면 변주/스태거만 마크업에 추가.

### 신문 컴포넌트 (newspaper.css)
- `.extra` = **號外 스플래시** (`.extra__stamp` 號外 대형 / `.extra__rule` / `.extra__label` / `.extra__head`) — 붉은 이중 테두리. **404(not-found)의 시그니처 호외 모먼트에 사용하세요.**
- `.misreg` = 미스레지스트레이션 ghost. **대형 레드만** (제호·號外). 본문 크기 레드 텍스트엔 금지(가독성).
- `.cut-in` = 단 괘선을 뚫고 나오는 사진(브로드시트 컷 침범). 768px 이하 자동 해제.
- `.folio--stacked` = 세로 정렬 판권 folio.

### 브레이킹 밴드 (feedback.css)
- 로드 시 `.js .breaking-band` 가 좌→우 프레스 와이프(reduced-motion 가드). 
- `.breaking-band__pull` 버튼 = 밴드 우측, `data-modal-open="…"` 로 호외 오버레이 연다.

### 기타 유틸
- `.spot` = 재사용 레드 스폿(제호는 misreg 자동 추가). 제호 red 강조는 `<span class="spot">…</span>`.
- `.ink-bleed` = 헤드라인/링크 hover 잉크 번짐(색+자간).
- 야간 작업등: `body::before` (`--fx-worklight`로 dark 에서만 on). 페이지가 별도로 배경 깔 필요 없음.

---

## 3. app.js 변경 (전 페이지 자동 적용 — 마크업만 맞추면 됨)

- **데이트라인**: `ko-KR`. 모드별 출력
  - `data-dateline` → `2026년 7월 9일 목요일`
  - `data-dateline="dangi"` → `… 목요일 · 단기 4359년` (제호용)
  - `data-dateline="short"` → `2026.07.09`
  - (요일은 실제 계산되므로 날짜-요일 불일치 위험 없음)
- **테마 라벨**: `주간판 / 야간판` (기존 "Day Ed./Night Ed." 하드코딩 제거).
- **토스트 기본 문구** 한국어화(제목 "알림"/"속보", 닫기 aria "닫기", 복사 문구 등).
- **세그먼트 컨트롤**: 이제 `role="radiogroup"` + `button role="radio" aria-checked` + **방향키/Home/End + roving tabindex** 지원(레거시 `aria-selected` 도 폴백).

### 페이지 세그먼트 마크업 교정 (dashboard/onboarding/kanban/profile/settings/product/inbox/pricing 해당)
`role="tablist"`/`role="group"` + plain button `aria-selected` (무효 ARIA) →
```html
<div class="segmented" data-segmented role="radiogroup" aria-label="기간 선택">
  <button role="radio" aria-checked="true"  data-value="d">일간</button>
  <button role="radio" aria-checked="false" data-value="w">주간</button>
</div>
```

---

## 4. 전 페이지 공통 지침 (정합·일관)

1. **FOUC (필수)**: 각 페이지 `<html>` 의 `data-theme="light"` **삭제** + `<head>` 최상단(스타일시트 前)에 스니펫 추가:
   ```html
   <script>(function(){try{var t=localStorage.getItem("ledger-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
   ```
2. **정본 데이터** (여러 페이지 등장 시 이 값으로 통일):
   - 제호 **원장일보** (한글 우선) + 워드마크 **THE LEDGER**. 판권 **제28권 제172호 · 서울 · 조간**. 제호 red 스폿은 `일보`.
   - 오늘 = 라이브 날짜(하드코딩 금지). 날씨: 서울 34°/부산 29°/제주 31°. 발행부수 **248,512 (전주 대비 +4.2%)**.
   - 대표 속보(호외/티커/1면 리드 일치) = **"한국은행, 기준금리 연 3.25% 동결 — 6개월째 관망세"**.
   - 가격이 여러 페이지(pricing/inbox 영수증/billing)에 나오면 완전 동일 값 + tabular-nums.
3. **어법**: §5-C "격식·절제" 군 — 합쇼체/서면체, 인쇄 관습 어휘(◆ 기사구분, ※ 인용, ▶ 관련기사). 한 페이지 단일 어체. 감성 훅 문장은 페이지당 1회만.
4. **한글 조판**: 헤드라인/라벨 `keep-all`(base 레이어가 처리), faux-italic/900 이미 차단. 데크는 이탤릭 대신 굵기·크기로 위계.
5. **아바타 이니셜**: 1~2자 한글만(원형 잘림 방지). index 예시는 `서/윤/김/박/한`.
6. **404 (not-found)**: `.extra` 호외 스플래시로 시그니처 모먼트 구성. 
7. **inbox 결함(페이지 담당)**: `#307` SVG `fill="var()"/stroke="var()"` → `style="fill:…"` 또는 currentColor. `<button role="listitem">` → list role 은 wrapper 로, 버튼은 버튼 유지.
8. **페이지네이션 데드버튼**(dashboard) → 최소 `aria-label="N페이지"` 부여.

---

## 5. 보존한 강점 (건드리지 말 것)
① 뼛속까지 신문인 조판(다단 justify+hyphens, 점프라인, 포인트 괘선 체계) ② 깊은 신문 컴포넌트 어휘(IndexBox/WeatherStrip/Stamp/Folio/PriceTag…) ③ 토큰 3계층 + 상태/접근성/no-JS·reduced-motion 안전망. 대담화는 전부 그 위에 얹었습니다(토큰 경유, aria/reduced-motion 가드).
