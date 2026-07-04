# theme-08-vaporwave · 시스템 레이어 고도화 — 페이지 에이전트 인계 노트

작업 범위: tokens/semantic/base/styles/components + index.html + app.js. **pages/ 는 미수정** (별도 담당).
아래는 페이지에서 일관되게 반영해야 할 신규 자산과 지침. 핵심만.

---

## 1. 페이지 `<head>` 에 반드시 이식할 부트 스니펫 (P0)

모든 pages/*.html 의 `<html>` 태그에서 하드코딩 `data-theme="dark"` **제거**하고, `<head>` 최상단(스타일시트 링크 앞)에 아래를 넣을 것. 없으면 (a) 다크↔새벽 FOUC, (b) 스크롤 리빌 미작동.

```html
<script>
  (function () {
    var d = document.documentElement;
    d.classList.add("js");
    try {
      var t = localStorage.getItem("vw-theme");
      if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      d.setAttribute("data-theme", t);
    } catch (e) {}
    setTimeout(function () { if (!d.classList.contains("vw-ready")) d.classList.add("reveal-fallback"); }, 2000);
  })();
</script>
```

- localStorage 키는 **`vw-theme`** (app.js 와 동일). 다른 키 쓰지 말 것.
- `.js` 클래스가 있어야 `[data-reveal]` 리빌이 켜진다. 없으면 콘텐츠는 그냥 항상 보임(안전 열화) — 하지만 리빌 연출은 사라짐.
- `reveal-fallback` 은 app.js 미부팅 시 콘텐츠가 opacity:0 로 갇히는 것을 막는 안전망. 그대로 복사.

---

## 2. 신규/변경 토큰 (tokens.css)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-rgb-split` | 마젠타/시안 2px 더블 섀도 | "호버=신호 간섭" — box-shadow/text-shadow 양쪽에 쓸 수 있음 |
| `--leading-display-ko` | 1.14 | 한글 초대형 디스플레이 행간 (겹침·잘림 방지) |
| `--leading-heading-ko` | 1.3 | 한글 다행 헤딩 행간 |
| `--tracking-caps-ko` | 0.08em | 0.28em 라틴 eyebrow 자간의 한글 상한 |

**폰트 스택 순서 교정(중요):** `--font-display`/`--font-body` 에서 한글 무드폰트(Do Hyeon·Gothic A1)를 `ui-sans-serif/system-ui` **앞**으로 이동했다. 이제 한글이 시스템 고딕이 아니라 Do Hyeon/Gothic A1 로 렌더된다. 페이지에서 폰트 토큰만 쓰면 자동 적용됨 — 인라인으로 `font-family: system-ui` 같은 걸 넣어 덮지 말 것.
**죽은 임포트 제거:** Noto Serif KR 임포트 삭제(세리프는 Nanum Myeongjo 로 배선됨), `--font-body` 유령 "Chillax" 삭제. 페이지에서 이 두 패밀리 참조 금지.

---

## 3. 한글 조판 레이어는 이미 전역 적용 (base.css)

`:lang(ko)` 기반 keep-all / 한글 행간 / faux-bold 근절(`font-synthesis-weight:none`) / 이탤릭 무효화 / tabular 숫자 레이어가 base.css 하단에 들어갔다. **페이지는 `<html lang="ko">` 만 지키면 자동 수혜.** 별도 조판 CSS 추가 불필요. 초대형 한글 디스플레이는 §5-A대로 카피를 어절 단위로 `<span>` 분절해 의도한 줄바꿈을 만들 것.

---

## 4. 페이지별 씬 변주 — `data-scene` (semantic.css) ★ 적극 활용

같은 씬 엔진, 다른 무드. `<body>` (또는 `.vapor-scene` 상위 요소)에 속성 하나만:

| `data-scene` | 무드 | 권장 페이지 |
|---|---|---|
| (없음) | 풀 노을 스카이라인 (태양+그리드+별) | index |
| `midnight` | **태양 제거**, 별↑, 그리드만 — 데이터가 주인공 | dashboard · inbox · kanban |
| `spotlight` | 태양이 히어로 뒤 후광 | pricing(추천 플랜 실루엣) · onboarding |
| `lost` | 태양 반쯤 가라앉음, 핫 호라이즌, 그레인↑ | 404 · empty · error |

예: `<body data-scene="midnight">`. `--fx-*` 노브가 상속으로 `.vapor-scene` 에 내려가 자동 반영. 라이트 테마 `lost` 오버라이드도 등록돼 있음.

---

## 5. 모바일 사이드바 = app-shell 드로어 (nav.css + app.js) ★ P0 반응형

pages/dashboard·kanban·inbox·product 의 인라인 `grid-template-columns:var(--sidebar-width) 1fr` 은 **미디어쿼리로 못 덮는다 → 반드시 클래스로 교체.**

교체 마크업:
```html
<div class="app-shell">
  <aside class="sidebar"> … </aside>
  <main class="app-shell__main"> … </main>
  <div class="app-shell__scrim" data-sidebar-drawer-close></div>
</div>
```
- ≤900px 에서 사이드바가 좌측 오프캔버스 드로어로 전환(스크림+블러).
- 페이지 상단바에 트리거 버튼 추가: `<button class="sidebar-drawer-toggle" data-sidebar-drawer-toggle aria-label="메뉴 열기" aria-expanded="false"><svg.../></button>` (≤900px 에서만 노출).
- app.js 가 열기/닫기·ESC·스크림 클릭·포커스 복귀·Tab 트랩(≤900px 한정)을 자동 처리.
- inbox 3-pane(`220px 360px 1fr`)은 app-shell 로 좌측 폴더만 드로어화하고, 메시지목록↔읽기창은 별도 로컬 @media 로 스택 전환 필요(브리프 §4-2).
- 기존 `[data-sidebar-toggle]`(데스크톱 아이콘 접기)와는 **다른** 컨트롤이다. 둘 다 쓸 수 있음.

---

## 6. 스크롤 리빌 (base.css + app.js)

`[data-reveal]` 요소는 이제 "신호 락인"(blur+translateY 해소)으로 등장한다. 페이지에서 카드/섹션에 `data-reveal` 붙이면 됨. `.js` 클래스(1번 스니펫) 필수. reduced-motion·JS실패 시 즉시 완성 상태로 안전 열화.

---

## 7. 시그니처 모먼트: VHS 부트 시퀀스 (app.js + base.css) — 이미 전역

app.js `injectBootSequence()` 가 모든 페이지 로드 시 1회, VHS 트래킹 글리치 + 모노 OSD(`▶ PLAY · SP · 0:00:xx · 1988–2049`)를 띄우고 사라진다. `aria-hidden`+`pointer-events:none`, reduced-motion 시 글리치 제거·정적 OSD. **페이지에서 별도 작업 불필요** — app.js 만 로드되면 자동. 페이지가 이 부트와 충돌하는 z-max 오버레이를 로드 시점에 띄우지 말 것.

---

## 8. app.js 내장 문자열 전량 한글화 완료

토스트 기본값("신호 수신됨 / 그리드에 기록했어요."), 토스트 region aria "알림", 닫기 "닫기", ⌘K placeholder·빈결과·그룹(이동/실행)·명령 라벨, 캘린더 월(1월~12월)·요일(일~토)·이전/다음 달, 복사 "복사됨!", 칩/업로드/캐러셀 aria 전부 한글. **페이지가 `data-toast-title`/`data-toast-msg` 로 넘기는 값도 한글로** 넣을 것(기본값은 이미 한글).

테마 라벨 실버그 수정: `data-theme-label` → 다크="저녁", 라이트="새벽" (기존 "Dusk/Dawn" 한/영 혼종 제거). 페이지의 테마 토글 버튼에 `<span data-theme-label>저녁</span> 모드` 패턴을 그대로 쓰면 app.js 가 동기화.

---

## 9. 데이터 정본 (교차 페이지 일치시킬 것)

index 데모에서 확정한 값 — pages 요금/테이블에서 어긋나지 않게:
- 요금제 3종 월 결제액: **Cruiser ₩19,000 · Outrun ₩39,000 · Neon Pro ₩89,000**
- 통화 표기: `₩` + 천단위 콤마 (`$` 금지). 큰 금액 축약 예: `₩8,420만`.
- stat 트렌드: HTML 에 `▲`/`▼` **리터럴 넣지 말 것** — `.stat-card__trend.is-up/.is-down` 의 CSS `::before` 가 자동 삽입(중복 시 화살표 이중 렌더 버그). 값만 넣기: `<p class="stat-card__trend is-up">12.4% <span class="text-subtle">전월 대비</span></p>`.

---

## 10. 기타 시스템 수정 (페이지가 의존하던 것)

- 포커스 링: 전역 `:focus-visible` 의 `border-radius:var(--radius-sm)` 강제 제거 → 링이 대상 형태(pill/원형)를 따라감. 페이지에서 포커스용 border-radius 오버라이드 불필요.
- SVG 아이콘은 `stroke="currentColor"` + 부모 `color` 패턴 유지. **pages 의 SVG `stroke="var(--…)"`/`stop-color="var(--…)"` 30여 곳은 P0 렌더버그 — 반드시 `style="stroke:var(--…)"` 또는 currentColor 로 교체**(브리프 §4-1).
- `.btn--primary/secondary:hover` 에 `--shadow-rgb-split` 적용됨 — 페이지 버튼도 자동 수혜.
- 라이트 테마용 세리프 pull-quote(`display-serif`)는 vaporwave 조각상 키치 자산 — 404 등에서 대리석 흉상/인용구로 적극 활용 권장(브리프 §5-4).
