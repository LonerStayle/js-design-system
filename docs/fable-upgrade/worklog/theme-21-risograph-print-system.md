# theme-21 Risograph Print — 시스템 레이어 고도화 워크로그 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 수정. `pages/`는 미수정.
아래는 페이지 작업 시 **일관 반영해야 할 변경점**과 **페이지 에이전트가 반드시 처리할 P0 잔여분**.

---

## 1. 새 · 변경 토큰 (tokens.css / semantic.css)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--font-poster` (신규) | Bricolage → Archivo → **Black Han Sans** → Do Hyeon → Noto Sans KR → system-ui | **초대형 한글 진 포스터 헤드라인 전용** (히어로·404 디스플레이). 일반 헤딩/버튼은 `--font-display`(Do Hyeon 활성화) 그대로. |
| `--font-display` (수정) | Do Hyeon 을 system-ui **앞**으로 이동 | 이제 macOS에서 Do Hyeon 실제 렌더. 별도 조치 불필요(자동 전파). |
| `--font-sans` (수정) | Gothic A1 을 system-ui 앞으로 | 본문 한글 활성화. 자동 전파. |
| `--leading-heading-ko` `1.28` / `--leading-display-ko` `1.1` / `--tracking-caps-ko` `0.08em` (신규) | — | base.css `:lang(ko)` 레이어가 소비. 페이지는 손댈 것 없음. |
| `--grain-opacity` | 0.5 → **0.4** | 전면 그레인이 본문 대비를 깎던 문제 완화. 자동. |
| `--color-danger` (light) | pink-600 → **pink-700** | AA 통과(흰 글자 6.0:1). **위험 버튼 배경에 pink-600 되돌리지 말 것.** |
| `--color-text-subtle` (light) | neutral-500 → **neutral-600** | placeholder/라벨 AA(5.76:1). 자동. |

- **Noto Serif KR @import 삭제** 완료(미사용 화석). 폰트 로딩은 tokens.css `@import` 1곳 + 각 HTML `<head>`의 라틴 `<link>` 유지 구조. 페이지에서 Noto Serif KR 재도입 금지.

## 2. 새 컴포넌트 · 유틸리티 (base.css / shell.css)

전부 시맨틱/원시 토큰 경유. 페이지 chrome에 적극 재사용해 밀도 균일화(§6-5).

- **`.calibration-bar`** — 형광 4색 + 하프톤 계조 스트립(인쇄소 시그니처). 다크에서 screen 발광.
  ```html
  <div class="calibration-bar" role="img" aria-label="형광 스폿 캘리브레이션 바">
    <span class="cal-pink"></span><span class="cal-blue"></span><span class="cal-yellow"></span><span class="cal-green"></span><span class="cal-tone"></span>
  </div>
  ```
  → dashboard 페이지 헤더, profile 배너, pricing 추천 플랜, 404에 배치 권장.
- **`.edition-stamp`** — 회전된 잉크 도장 넘버링. `<span class="edition-stamp">№ 047 / 200</span>`
  → product(굿즈 한정판), profile(작가 에디션), pricing에.
- **`.section-watermark`** — 섹션 뒤 초대형 아웃라인 숫자(hollow). 부모가 `position:relative`(base `.section`에 이미 부여) 여야 함.
  ```html
  <section class="section container"><span class="section-watermark" aria-hidden="true">02</span> … </section>
  ```

## 3. 시그니처 모션 — "2도 인쇄 판이 정합된다" (base.css + app.js)

- 로드/스크롤 리빌이 기존 fade-up → **`plate-register`** 로 교체됨: 핑크/블루 분판이 어긋나 등장 → 정합으로 스냅. 호버 슬립·`data-reprint` 플래시와 같은 미스레지스터 문법.
- 사용법 동일: 요소에 `data-reveal`. **스태거**는 부모에 `data-reveal-stagger` 추가하면 app.js가 자식 `data-reveal`에 `--i`를 자동 세팅(70ms 간격).
  ```html
  <div data-reveal-stagger> <h1 data-reveal>…</h1> <p data-reveal>…</p> … </div>
  ```
- reduced-motion·no-JS 안전(콘텐츠 즉시 완성). 페이지에서 별도 작업 불필요.

## 4. 한글 조판 — 자동 적용 (base.css `:lang(ko)` 레이어)

- `keep-all`/`overflow-wrap`/heading·display 행간·faux-bold 차단(Do Hyeon/Black Han Sans 단일 웨이트)·tabular-nums 전부 시스템에서 처리. **페이지는 `lang="ko"` 유지만 하면 됨**(전 페이지 이미 보유).
- 초대형 한글 헤드라인엔 `class="… hero__kr"` 또는 `.display` 사용 시 자동으로 `--leading-display-ko` 적용.

---

## 5. 페이지 에이전트 필수 처리 (P0 — 시스템에서 못 건드림)

1. **FOUC 스니펫**: 9개 페이지 `<head>` 최상단에 아래 삽입(키는 반드시 `riso-theme` — app.js와 일치). index.html은 완료.
   ```html
   <script>
   (function () {
     try { var t = localStorage.getItem("riso-theme");
       if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
       document.documentElement.setAttribute("data-theme", t); } catch (e) {}
     document.documentElement.className = "js";
   })();
   </script>
   ```
   기존 `<script>document.documentElement.className="js"</script>`만 있으면 위로 교체. `<html>`에 하드코딩 `data-theme` 넣지 말 것.
2. **SVG presentation attr `var()` 8곳 수정**(브리프 ④-1) → `style="stroke:var(...)"` 또는 currentColor/클래스:
   - dashboard.html:89,100 (스파크라인) · profile.html:171,177 · settings.html:433 · inbox.html:202,241,320.
3. **raw .md 직링크** 있으면 제거(index는 완료). 페이지 내비/푸터 점검.
4. **product 평점 정적화**(④-4): 상품 평점(4.0)을 `data-rating` 입력 위젯 → 표시용 정적 별(`<span>`, 인터랙티브 금지)로.
5. **에러 상태 시연**(④-4): onboarding 필수값 에러 1회 + settings 저장 실패 토스트 1회. `aria-invalid="true"` + `.field__error`(+`aria-describedby`) 사용. index 갤러리에 예시 있음(이메일 필드).
6. **칸반 키보드 재정렬**(④-4): 카드에 "← 이전 열 / 다음 열 →" 버튼 + `role="status"` 라이브 안내.
7. **영문 잔재 한글화**(③-4): 404 빈상태 배지 `Search/Inbox/Editions/Error`, profile eyebrow `EDITION · CREATOR PROFILE` → 한국어. (mono 스탬프 `PRINTED, NOT RENDERED` 류 인쇄 카피는 DNA로 유지)
8. **차트 축 라벨 정렬**(④-5): dashboard 12개 막대 vs 5개 라벨 흩뿌림 → 12칸 그리드 정렬 또는 라벨 수 일치. (막대 height:% 붕괴 방지: 래퍼 `align-self:stretch`/`height:100%` 확인)

## 6. 교차 페이지 정합 (③-2 — 복붙 데이터 차별화)

- dashboard ↔ profile "총 인쇄 부수 48,210 / +12.4%" + 스파크라인 좌표 **동일 복붙** → 어긋나게.
  - **정본 제안**: dashboard = "6월 인쇄 부수 **51,840** · 전월 +8.3%"(마감 주간 관점, 이상치 1개 포함). profile = "누적 발행 **48,210부** · 에디션 **17**종"(개인 누계 관점). 스파크라인 좌표도 서로 다른 계열로.
- 가격·수치가 pricing/inbox 영수증 등에 겹치면 값 완전 일치(₩ 표기 규격).

## 7. 보이스 / 훅 규칙

- 테마 21 보이스 군 = **실무·명료**(해요체/합니다체, 데이터 밀도가 곧 보이스). 한 페이지 단일 어체.
- 히어로 시그니처 훅 **"어긋나게 / 찍어야 / 리소다"** 는 index 히어로 1곳 전용 — **페이지에서 반복 금지**. 각 페이지는 장면 시나리오(§6-1)에 맞는 고유 카피로.
- 통화 `₩19,000`, 날짜 `2026년 7월 4일`(요일 병기 시 실제 달력 확인, 불확실하면 상대표현), 결제 국내 수단.

## 8. 절대 보존 (회귀 금지)

오버프린트/미스레지스터/하프톤/그레인 토큰 체계 · 하드 오프셋 그림자(블러 금지) · 형광 위 형광 금지 · 프레스 스탬프 버튼 인터랙션 · **다크 형광 블루 오프셋 그림자**(야광 에디션) · CSS 포스터 시스템(product `.poster`).
