# theme-27-scifi-hud · 시스템 레이어 고도화 워크로그 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 손댔습니다. `pages/`는 미변경.
아래는 페이지 작업 시 **반드시 맞춰야 할** 변경점과 새 도구입니다.

---

## 1. P0 위생 — 페이지가 이어받아야 할 것

### 1-1. FOUC 스니펫 + `html.js` (전 페이지 필수)
`index.html`은 `<html>`에서 `data-theme="dark"` 하드코딩을 **제거**하고 `<head>` 최상단(뷰포트 meta 직후, CSS `<link>`보다 먼저)에 아래를 넣었습니다. **모든 페이지에 동일 삽입**하고 `<html>`의 `data-theme` 하드코딩은 지우세요.
```html
<script>
  (function(){try{var t=localStorage.getItem('scifi-hud-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}document.documentElement.classList.add('js');})();
</script>
```
- localStorage 키는 `scifi-hud-theme` (app.js와 동일, 절대 바꾸지 말 것).
- `html.js` 클래스가 있어야 `[data-reveal]` 등장 연출이 동작합니다. 없으면 콘텐츠는 그냥 보이기만 함(안전).

### 1-2. 폰트 (조치 불필요)
`tokens.css`에서 Noto Serif KR import 제거 + 스택 순서 교정(라틴→한글무드→안전망→시스템) 완료. 페이지는 실제 한글 카피만 넣으면 Do Hyeon/Gothic A1/Nanum Gothic Coding가 정상 렌더됩니다.

### 1-3. SVG presentation-attr `var()` 금지 (재확인)
시스템 레이어는 0건. 페이지에도 `stroke="var(...)"`/`fill="var(...)"`/`stop-color="var(...)"` 금지 — `style="stroke:var(...)"` 또는 `stroke="currentColor"`+부모 `color`로. (브리프 §4-1: product.html hero-svg 2곳, 그 외 점검)

---

## 2. 새/변경 토큰

| 토큰 | 위치 | 용도 |
|---|---|---|
| `--leading-heading-ko:1.3` `--leading-display-ko:1.1` `--leading-body-ko:1.7` `--tracking-caps-ko:0.08em` | tokens | 한글 조판 상한. `base.css` `:lang(ko)` 레이어가 자동 소비 — 페이지는 초대형 한글 제목에 `line-height` 직접 박지 말 것(이 토큰이 처리) |
| `--text-holo` | tokens(+light) | `.u-holo` 색수차 텍스트섀도. 라이트/다크 각각 정의됨 |
| `--bracket-size-lock:22px` | tokens | 브래킷 hover "타깃 락온" 크기 |
| `--cockpit-corner/-weight/-inset/-ruler-w` `--z-cockpit:150` | tokens | 뷰포트 콕핏 프레임(자동 주입) |
| `--code-bg/-fg/-key/-str/-num/-com` | semantic(`:root`, 테마 무관) | 코드블록=항상 다크 콘솔. **라이트에서 코드 텍스트가 다크-온-다크로 사라지던 버그 해결.** `.code-block`은 이 토큰만 씀 |
| `--reticle` `--data-stream` `--gauge` `--ring-amber` | semantic **light 추가** | 라이트에서 워시아웃되던 모티프 색 보정 완료 — 페이지의 `.reticle`/`.scan-host`/`.stream-host`/`.gauge`가 라이트에서도 보임 |
| `--gauge` | semantic dark `:root` 재정의 | conic이 `var(--color-primary)` 참조 → 위협모드에서 게이지도 리컬러 |

### 위협(THREAT) 모드 — 시그니처
`<html data-alert="amber">` / `="red">` 한 속성으로 **전 구역 신호 팔레트 전이**(primary·bracket·glow·ring·scanline·콕핏). semantic.css 하단에 정의. 라이트/다크 양쪽 위에서 동작.
- 페이지에서 쓰려면: `window.HUD.alert('red'|'amber'|'nominal')` 또는 아래 라디오 컨트롤 마크업. **dashboard의 위협 지표(THREAT DELTA)에 붙이면 자연스럽습니다.**
- 규율: 페이지에서 액센트/보더/글로우는 **하드코딩 시안 금지, `--color-primary` 계열 토큰 사용** → 위협모드가 자동으로 따라옵니다.

---

## 3. 새 컴포넌트·유틸리티 (app.js 자동 배선 / CSS)

### 3-1. 콕핏 프레임 — **자동 주입, 마크업 불필요**
app.js `initCockpit()`가 `<body>`에 4모서리 브래킷+가장자리 눈금자+하단중앙 상태칩(`SYS//AETHER-HUD · ONLINE`)을 주입. `aria-hidden`+`pointer-events:none`, z-index 150(콘텐츠 위·nav 아래). 상단 모서리는 `--header-h` 아래로 인셋됨.
- **페이지가 할 일: 없음.** 단 전체화면 `position:fixed` 오버레이를 새로 깔지 말 것(충돌). 위협모드 시 상태칩이 CAUTION/ALERT로 바뀜(자동).

### 3-2. 모바일 내비 토글 — **자동 주입**
app.js `initNavToggle()`가 `.navbar` 안에 햄버거 버튼을 주입(≤860px 노출). `.navbar-links`가 베벨 드롭다운으로 전환. **데드존 없음.**
- **페이지가 할 일: `.navbar`+`.navbar-links`>`.nav-link` 구조만 유지.** 수동 `.navbar-toggle` 버튼을 넣지 말 것(주입이 스킵되어 죽은 버튼이 됨). 기존 수동 버거가 있으면 제거.

### 3-3. `.u-holo` — 홀로그램 색수차 디스플레이 텍스트
정적(=reduced-motion 안전). 히어로/404/모달 **타이틀에만 절제 사용**.
```html
<h1>신호 <span class="u-holo">손실</span></h1>
```

### 3-4. `[data-reveal]` — 스크롤 등장(시그니처 "rise")
`html.js`일 때만 숨겼다 IntersectionObserver로 등장. reduced-motion·비지원 시 즉시 표시. **장식/부차 블록에만** 붙이고 **필수 내비/콘텐츠(예: 화면 카드, 유일한 CTA)에는 금지**(스크립트 전체 실패 시 숨김 위험). 같은 부모 안 형제끼리 자동 스태거.

### 3-5. `[data-radio-group]` — 키보드 완비 커스텀 라디오 (**P1 결함 해결책**)
product `.opt-chip`, onboarding `.choice`의 "클릭만 되는" 라디오를 이걸로 교체하면 Space/Enter 선택 + 방향키 순회 + roving tabindex를 공짜로 얻습니다.
```html
<div class="segmented" role="radiogroup" data-radio-group aria-label="옵션">
  <button role="radio" data-value="a" aria-checked="true">A</button>
  <button role="radio" data-value="b" aria-checked="false">B</button>
</div>
```
선택 시 `radio:change`(detail.value) 이벤트 발생. `.opt-chip`/`.choice` 클래스를 유지하고 싶으면 그 요소에 `role="radio"`+`aria-checked` 부여 후 컨테이너에 `data-radio-group`만 추가해도 됩니다.

### 3-6. 세그먼트 컨트롤 — ARIA 교정
`.segmented`는 이제 **`role="radiogroup"` + 버튼 `role="radio" aria-checked`** 로 쓰세요(과거 `role="tablist"`+`aria-selected`는 무효 ARIA). app.js가 `aria-checked` 동기화+방향키+roving을 처리. CSS는 `aria-checked`/`aria-selected` 둘 다 스타일링. **pricing 월/연 토글**: `data-segmented="billing"`은 그대로 두되 fallback 카피가 한글(`/월`,`/년 · 연간 결제`)로 바뀜 — data-note-monthly/annual 있으면 우선.

### 3-7. `[data-reticle-track]` — 404 수색 씬용
`.reticle`에 붙이면 포인터를 따라다님(reduced-motion 시 완전 비활성). 404를 인터랙티브 수색 장면으로 만들 때 사용(브리프 §5-4). host는 `offsetParent` 기준.

### 3-8. 위협모드 라디오 컨트롤(선택)
```html
<div class="segmented" role="radiogroup" data-radio-group data-alert-control aria-label="경계 태세">
  <button role="radio" data-value="nominal" aria-checked="true">정상</button>
  <button role="radio" data-value="amber" aria-checked="false">주의</button>
  <button role="radio" data-value="red" aria-checked="false">경계</button>
</div>
<p data-alert-live role="status" aria-live="polite"></p>  <!-- 자동 갱신 -->
```

### 3-9. 브래킷 hover "타깃 락온"(CSS 자동)
`.bracket-frame`, `.panel > .brackets`는 hover/focus-within 시 브래킷이 22px로 벌어지고 글로우 상승. 마크업 변경 불필요.

---

## 4. app.js 한글화 (자동 반영 — 페이지는 data-* 카피만 한글로)
- 칩 삭제 aria: `"○○ 태그 제거"` · 파일 삭제 aria: `"파일 제거"`
- 토스트 기본: 제목 `시스템 알림`/메시지 `신호를 수신했습니다.`, 닫기 `닫기`, region `알림`
- 커맨드 실행 토스트: `명령 실행` / `‹○○› 명령을 실행했습니다.`
- 복사 토스트: `복사됨` / `클립보드에 복사했습니다.`
- 캐러셀 도트: `N번 슬라이드로 이동`
- 테마 라벨(sr-only): `다크`/`라이트` (HTML 라벨을 영문으로 덮던 혼종 제거 — 라벨 소스는 JS 한 곳)
- 페이지는 `data-toast-title`/`data-toast-msg` 등 **호출부 카피를 한글로** 넣으면 됨.

## 5. 차트 계약
`.chart .area`는 페이지-로컬 `<linearGradient id="cyanArea">`를 우선 쓰되, 없으면 `var(--color-primary-muted)` 옅은 틴트로 **graceful 저하**(과거엔 조용히 사라짐). 차트 페이지는 여전히 `#cyanArea` defs를 인라인으로 정의하는 걸 권장하고, `<stop>` 색은 `stop-color="var()"` 금지 → CSS(`.chart stop{stop-color:var(--color-primary)}`) 또는 `style="stop-color:var()"`.

## 6. 교차 페이지 정본 데이터 (통일할 것)
- 좌표: `LAT 37.5665 · LON 126.9780`
- 콜사인/유닛: `NX-Valkyrie`, 섹터 `Alpha-7 / Bravo-2 / Delta-9`
- 빌드/노드: `SYS//AETHER-HUD · BUILD 2.7 · NODE SEOUL-01`
- 어체: 세계관·픽션 군(로그체/시스템 명판=영문 모노 허용, 승무원이 읽는 본문·버튼·aria·토스트=한글). 한 페이지 안에서 어체 혼용 금지.

## 7. 검증 메모
- 정적: components hex 0건, index/app.js SVG var() 0건, Noto Serif 0건, keep-all 존재, `node -c app.js` OK — 통과.
- **미완(환경 제약)**: 브라우저 프로파일 잠금/멀티브라우저 선택 이슈로 4뷰포트×2테마 육안 확인 미실행. 페이지 작업/최종 QA에서 360/768/1024/1440 × light/dark + 위협모드 + reduced-motion 육안 확인 필요. 특히 (a) 라이트에서 콕핏 상태칩·레티클 대비, (b) 위협 red 모드에서 텍스트로 쓰인 primary(예: eyebrow/u-data)의 대비, (c) 모바일 콕핏/내비 토글 레이아웃.
