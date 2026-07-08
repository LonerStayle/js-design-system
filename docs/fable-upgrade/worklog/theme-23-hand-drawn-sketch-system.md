# theme-23 손그림 스케치 — 시스템 레이어 변경 노트 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 수정함. `pages/`는 미수정.
아래는 페이지에서 **일관 반영해야 할 것**과 **새로 쓸 수 있는 것** 정리.

---

## 1. P0 위생 — 페이지도 반드시 맞출 것

### (a) FOUC 스니펫 + lang + data-theme
- 전 페이지 `<html lang="ko">` (현재 pages는 `lang="en"` — 전면 한글화 시 교체).
- `<html>`의 하드코딩 `data-theme="..."` **삭제**하고, `<head>` 최상단(스타일시트 앞)에 아래 스니펫 삽입. **키는 반드시 `"sketch-theme"`** (app.js와 동일 키).
```html
<script>
(function(){try{var t=localStorage.getItem("sketch-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
</script>
```

### (b) SVG presentation-attr의 var() 금지 (404 지도·product 일러스트 등)
`stroke="var(--x)"` / `fill="var(--x)"` → **style 속성으로 이동**. index.html 히어로 일러스트가 정답 예시:
```html
<path pathLength="1" class="draw" style="stroke:var(--pen-red);--draw-delay:1s" stroke-width="3" .../>
```
`currentColor`는 속성에 그대로 써도 됨(var()만 금지). 아이콘 스프라이트가 그 방식.

### (c) app.js 내장 문자열은 이미 한글화 완료
캘린더 월/요일(`1월`…, `일 월 화`…), 캘린더 제목(`2026년 7월`), 토스트 닫기(`닫기`), 파일첨부 토스트(`첨부 완료 / N개 파일을 붙였어요`), 칩 제거(`제거`), 캐러셀 dot(`N번 슬라이드`) — 페이지는 그대로 쓰면 됨. 파일행 아이콘도 이모지→인라인 SVG(클립)로 교체됨.

---

## 2. 새/변경 토큰

### 색 — 상태 "텍스트용" 토큰 (신설, 대비 AA 대응)
밝은 pen 원색은 12–14px 텍스트에서 AA 미달(≈3.2–3.5:1) → **텍스트/작은 글리프에는 아래 `-text` 토큰 사용**. (배경/보더/좌측엣지 등 비텍스트는 기존 `--color-danger` 등 그대로.)
| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--color-success-text` | pen-green-dark | 파스텔그린 | 배지/델타/인라인노트 텍스트 |
| `--color-warning-text` | pen-orange-dark | 파스텔옐로 | 〃 |
| `--color-danger-text` | pen-red-dark | 파스텔코랄 | 에러문구·필수표시·삭제메뉴 |
| `--color-info-text` | pen-blue-dark | 파스텔블루 | 〃 |
- 컴포넌트(badge/stat-delta/alert-icon/inline-note/field-error/menu-item.danger/`.text-danger`·`.text-success`)는 **이미 -text로 교체 완료**. 페이지가 인라인으로 상태색을 텍스트에 쓸 일이 있으면 `-text`를 쓸 것.

### 색 — 기타 변경
- `--color-secondary` = **pen-blue-dark**로 어둡게(라이트). 링크·btn-secondary·eyebrow의 흰 글씨 AA 확보. 다크는 기존 파스텔 유지.
- danger 버튼: `--btn-danger-bg`=pen-red-dark(라이트)/코랄(다크) + **hover/active 신설**(`--btn-danger-hover/-press`). 페이지 수정 불필요.
- 신규 원시색: `--pen-red-deep`, `--pen-blue-deep` (dark fill의 hover/press용).

### 분위기(atmosphere) 토큰
- `--margin-color` **부활** + `--paper-margin`(빨간 좌측 마진선 background 레이어). 다크=분필선.
- `--ink-wash`(rgba 잉크 hover 틴트), `--skeleton-sheen`(스켈레톤 셔머 — 다크=분필가루로 자동 전환).

### 폰트
- `@import` **한 곳(tokens.css)으로 통합**, Noto Serif KR(미사용) 제거. base.css의 @import 삭제됨. 페이지는 `theme.css`만 링크하면 전부 로드됨(변경 없음).

---

## 3. 새 유틸리티 / 컴포넌트 (base.css) — 페이지에서 적극 사용

### (a) `.paper-bg.with-margin`  — 줄노트 빨간 마진선
`<body class="paper-bg with-margin">`. ≥900px에서만 좌측 세로 빨간선 표시(모바일 자동 off). 사이드바 페이지(dashboard/inbox)는 사이드바가 좌측을 덮으므로 **with-margin 생략 권장**, hero/풀블리드 위주 페이지(404/onboarding/pricing/profile)에 적용 추천.

### (b) `.marginalia` — 여백 낙서 레이어 (씬 변주 포인트)
`aria-hidden` 고정 장식(z-index -1, pointer-events none, ≥900px). 페이지 성격에 맞게 **좌표/문구를 바꿔** 씬 변주:
```html
<div class="marginalia" aria-hidden="true">
  <span class="mg-ring"  style="top:15%;left:1.5%;--mg-rot:-6deg"></span>
  <span class="mg-star"  style="top:34%;right:2.5%;--mg-rot:9deg"></span>
  <span class="mg-note"  style="bottom:24%;left:2%;--mg-rot:-8deg">중요!</span>
  <span class="mg-arrow" style="bottom:16%;right:3.5%;--mg-rot:-12deg"></span>
</div>
```
- 404 = 기울어진/흩어진 배치, dashboard = 절제(1개 이하), onboarding = 격려 문구("거의 다 왔어요!") 식으로 변주. `.mg-note`는 손글씨 빨강.

### (c) 시그니처 모션 — 3종 (전부 reduced-motion 안전)
1. **선 드로잉 `.draw`**: SVG 요소에 `class="draw" pathLength="1"` + 색은 style. 스태거는 `style="--draw-delay:.6s"`. **404 보물지도 점선 길·나침반, product 스케치북에 반드시 적용** (지금 "펜으로 그리는 중" 연출). 길이 무관하게 wipe 됨.
2. **스크롤 리빌 `[data-reveal]`** → 이제 `sketch-reveal`(팝+기울기 정착)로 등장. app.js가 `is-in` 부여. 페이지는 리빌하고 싶은 블록에 `data-reveal`만 붙이면 됨. (JS off/reduced-motion 시 즉시 완성 — `html.js` 게이트로 안전.)
3. **형광펜 긋기**: `[data-reveal]` 안의 `.mark`는 리빌 때 0%→100%로 그어짐(자동). hover로 긋고 싶으면 `.ink-mark`.

### (d) 한글 조판 레이어 (base.css 하단, 자동 적용)
`:lang(ko)` keep-all·balance/pretty·헤딩 행간 보정·대문자변환 무효·데이터 tabular-nums. 페이지가 `lang="ko"`면 자동. **초대형 히어로 한글은 어절 `<span>` 분절 권장**.

---

## 4. 접근성/키보드 — 페이지가 마크업 맞출 것

### 커맨드 팔레트
- app.js가 열 때 `role=listbox/option/combobox` + `aria-activedescendant` + 빈결과 `aria-live`를 **자동 백필**함. 그래도 페이지 마크업에 명시하면 더 좋음(index.html 참고): `.cmdk-list[role=listbox]` / `.cmdk-item[role=option][aria-selected]` / `.cmdk-input[role=combobox aria-controls=... aria-autocomplete=list]` / `.cmdk-empty[role=status aria-live=polite]`.

### 칸반 키보드 대안 (kanban.html)
- app.js에 **`[data-kanban-move="prev|next"]` 핸들러 + 라이브리전 안내 추가됨**. 카드에 아래 버튼을 넣으면 마우스 없이 열 이동 가능:
```html
<button class="btn btn-sm btn-ghost" data-kanban-move="prev" aria-label="이전 열로 이동">←</button>
<button class="btn btn-sm btn-ghost" data-kanban-move="next" aria-label="다음 열로 이동">→</button>
```
- 열에 `data-col-name="진행 중"` 부여하면 안내 문구가 정확해짐. 또한 kanban의 `.doodle-circle`에 텍스트 직접 넣기/`.doodle-arrow`에 "↳" 중복 렌더 **금지**(브리프 §4-11).

### 폼 invalid 시연
- `.is-invalid`+`aria-invalid="true"`+`aria-describedby`→`.field-error` 패턴을 **실제 사건으로** 노출(settings 저장 실패, onboarding 필수값). index 폼 카드에 이메일 예시 있음.

---

## 5. 탈지문 — 이모지 → 손그림 SVG 스프라이트

index.html 상단에 **단일 잉크 아이콘 스프라이트**(`<symbol>` 12종: pencil/dashboard/board/inbox/product/pricing/settings/compass/face/lost/theme/copy/trash)를 넣고 `<use href="#ic-...">`로 사용. `stroke="currentColor"`라 라이트/다크 자동 추종.
- **주의: `<symbol>`은 문서-로컬**이라 file://에서 페이지가 index의 스프라이트를 참조 못 함. 각 페이지도 **같은 스프라이트 블록을 복사**해 넣고 `<use href="#ic-...">` 쓸 것 (또는 인라인 SVG). 페이지의 이모지(📊🗂️✉️ 등)·📎·🌗을 이걸로 교체.
- 아이콘 색은 `currentColor`(=텍스트 잉크) 단색 유지 = DNA(펜 한 자루). 무지개색 금지.

---

## 6. 카피 보이스 (index 기준 — 페이지도 통일)
- 보이스 군 = **다정·환대 해요체**(§5-C). "~예요/~어요", '님' 호칭 OK, 의성·의태 허용.
- **dev-tool 카피 금지**: "순수 CSS·바닐라 JS", "N개 컴포넌트", "프레임워크 없음", "file:// 지원" 전부 제거함. 제품(sketchbook=비주얼 노트 앱) 목소리로.
- 자기참조 스탯 → 세계관 수치("벽에 붙은 노트 1,284개"). 반올림 티나는 수 피하고 측정된 듯한 값.
- 인명 한국식(김보경/수석 두들러), 성씨 중복 회피. 교차 페이지 데이터(제목·수치·가격·유저명) **정본 1개로 통일**.

---

## 7. 남은 검증(페이지 작업 후 공통)
- grep 0 확인: SVG var() / `lang="en"` / 하드코딩 hex(components) / `href="#"`·onclick / 인라인 grid-template-columns / `$`·`€`·"ago"·"Trusted by".
- 4뷰포트×2테마 육안(360/768/1024/1440). 모바일 내비는 시스템에서 이미 in-flow 2행으로 수정됨(≤540 겹침 해소).
- CHECKLIST.md는 아직 구(舊) 상태 — 페이지 완료 후 실측 대비 수치와 함께 최종 갱신 필요(현재 "AA 준수" 주장은 시스템 레이어에서 -text 토큰으로 교정됨).
