# theme-30-corporate-clean-saas · 시스템 레이어 고도화 워크로그 (페이지 에이전트용)

시스템 레이어(tokens/semantic/base/components/index/app.js)만 손댔습니다. `pages/`는 미변경.
아래는 페이지 작업 시 **반드시 맞춰야 할** 변경점과 새 도구입니다. 제품 컨셉: **Aperture = B2B 운영 분석 워크스페이스**(앱 도메인 `app.aperture.kr`). 보이스 = 실무·명료(해요체/합니다체).

---

## 1. P0 위생 — 페이지가 이어받아야 할 것

### 1-1. FOUC 스니펫 + `html.js` (전 페이지 필수)
`index.html`은 `<html>`에서 `data-theme` 하드코딩을 **제거**하고 `<head>` 최상단(viewport meta 직후, CSS `<link>`보다 먼저)에 아래를 넣었습니다. **모든 페이지에 동일 삽입**하고 `<html>`의 `data-theme` 하드코딩은 지우세요.
```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("theme30-color-mode");
      if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", t);
      var d = localStorage.getItem("theme30-density");
      if (d) document.documentElement.setAttribute("data-density", d);
    } catch (e) {}
    document.documentElement.classList.add("js");
  })();
</script>
```
- 키: 테마 `theme30-color-mode`, 밀도 `theme30-density` (app.js와 동일 — **절대 변경 금지**).
- `html.js` 클래스가 있어야 `[data-reveal]` 등장 연출이 동작. 없으면 콘텐츠는 그냥 보임(안전).

### 1-2. 폰트 (조치 불필요, 청소만 선택)
`tokens.css` @import 한 곳으로 **Inter + JetBrains Mono + Gothic A1** 통합 로드. Noto Serif KR(서재 관성 잔재)·오배치 Noto Sans KR 제거, 스택 순서 교정(라틴→한글무드→안전망→system-ui). 페이지는 한글 카피만 넣으면 정상 렌더.
- 페이지의 기존 `<link ...Inter...JetBrains Mono...>`는 이제 **중복**입니다(tokens.css가 로드). 지워도 되고 둬도 무해. `theme.css` 링크는 반드시 유지.

### 1-3. SVG presentation-attr `var()` — 페이지에 P0 버그 잔존 (브리프 §4-A)
시스템 레이어는 0건. **페이지에서 반드시 고칠 것**:
- `pages/inbox.html:187` — `stroke="var(--color-amber)"` → `--color-amber`는 존재하지 않는 토큰. `stroke="currentColor" style="color:var(--color-warning)"`로.
- `pages/dashboard.html:138` — `<stop stop-color="var(--chart-1)">` ×2 → `<stop offset="0%" style="stop-color:var(--chart-1)" stop-opacity="0.22"/>`로.
- 규칙: SVG 속성에 `var()` 금지 → `style="stroke:var(...)"` 또는 `stroke="currentColor"`+부모 `color`.

### 1-4. 인라인 `grid-template-columns` 제거 (브리프 §4-C)
미디어쿼리로 못 이겨 모바일 압착. 아래 새 유틸로 교체:
- `pages/dashboard.html:128` (1.6fr 1fr) → `class="grid-main-side"`
- `pages/billing.html:106` (1fr 1.1fr) → `class="grid-side-main"` (또는 grid-main-side 뒤집기)
- `pages/profile.html:149` (1.5fr 1fr) → `class="grid-main-side"`

---

## 2. 새/변경 토큰

| 토큰 | 위치 | 용도 |
|---|---|---|
| `--color-text-muted` 500→**600**, `--color-text-subtle` 400→**500** (다크는 400/300) | semantic | **대비 승급**(브리프 §4-E). `.bar-label·stat-foot .vs·dp-dow·step-sub` 등 실텍스트 미달 해소. 페이지는 자동 적용 — muted/subtle 를 실텍스트에 써도 안전 |
| `--color-static-white` | semantic(`:root`, 테마 무관) | 채워진 색면 위 항상-흰 전경. **페이지의 `color:#fff`/`background:#fff` 하드코딩을 이걸로 교체** |
| `--fx-tint-1` `--fx-tint-2` `--fx-tint-glow` `--grain-opacity` `--fx-grain` | semantic(light+dark) | 인디고 틴트 후광 + 필름 그레인 노브. `.bg-gradient-hero`/`.fx-noise`가 소비. 다크에서 인디고-900 글로우로 자동 전환 |
| `--aperture-color` `--aperture-color-2` `--aperture-spin` `--aperture-blades` | semantic/tokens | 조리개 시그니처 배경 라인아트 색/회전 |
| `--gradient-brand` `--gradient-brand-soft` | semantic(light+dark) | **절제된 단일-인디고 그라데이션**(무지개 클리셰 대체). 헤딩 강조 1곳 + primary 버튼/브랜드마크만 |
| `--noise-svg` | tokens | feTurbulence data-URI (그레인 원재료) |
| `--table-cell-py` `--density-stack` | semantic | 밀도 가변 — 아래 §4 참조 |
| `--leading-heading-ko:1.3` `--leading-display-ko:1.14` `--leading-body-ko:1.72` `--tracking-caps-ko:0.06em` | tokens | 한글 조판 상한. `base.css :lang(ko)` 레이어가 **자동 소비** — 페이지는 한글 제목에 line-height 직접 박지 말 것 |
| `--duration-reveal:640ms` | tokens | 등장 연출 시간 |

### 밀도(Density) 시스템 — 시그니처 (브리프 §5-④)
`<html data-density="compact">` 한 속성으로 카드·버튼·인풋·테이블이 일제히 조밀해집니다. semantic.css 하단 `[data-density="compact"]` 블록이 `--btn-height-*`/`--input-height-*`/`--card-padding`/`--table-cell-py`/`--density-stack` 리매핑.
- 컴포넌트는 이 토큰만 소비 → **페이지에서 새 여백은 하드코딩 말고 `--card-padding`/`--table-cell-py`/`.stack-density` 사용**해야 밀도 토글이 따라옵니다.
- 토글 UI: navbar 에 `data-density-toggle` 버튼(아래 §4-1), 또는 ⌘K "표시 밀도 전환". dashboard 상단 노출 권장.

---

## 3. 새 유틸리티 클래스 (CSS)

| 클래스 | 용도 |
|---|---|
| `.grid-main-side` (1.6fr/1fr) · `.grid-side-main` (1fr/1.6fr) · `.grid-wide-narrow` (1.2fr/1fr) | 비대칭 2분할. **≤900px 자동 1열 낙하**. 인라인 grid 전면 대체 |
| `.bento` + `.bento-hero`(2×2) + `.bento-wide`(가로2) | 비대칭 벤토. **dashboard KPI를 균등 4칸 대신 핵심지표 1개 2×2로**(브리프 §5-②). ≤900px 2열, ≤560px 1열 자동 |
| `.bg-gradient-hero` (업그레이드) | 인디고 틴트 다층 후광. hero/pricing/onboarding 배경 |
| `.fx-noise` | 초저알파 필름 그레인(`::after`, pointer-events none). 배경 컨테이너에 부여. 대비 무해 |
| `.fx-aperture` (+`.is-spin`) | 대형 조리개 라인아트 배경 오브제(index hero 참고). `position:absolute`+`aria-hidden`. SVG는 index에서 복사, `.ap-ring`(currentColor)/`.ap-blade` 클래스 사용 |
| `.grad-brand` | 절제된 인디고 그라데이션 텍스트(헤딩 강조 1곳만). `background-clip:text` 미지원 폴백 내장 |
| `.stack-density` | 밀도 연동 세로 스택 간격 |

### 씬(scene) 변주
배경 장치를 전 페이지 복붙하지 말 것. `--fx-*` 노브를 페이지/섹션 스코프로 덮어 변주(대시보드=절제, 프라이싱=추천 플랜 후광, 404=기움). 조리개 오브제도 페이지마다 위치/크기 달리.

---

## 4. app.js — 새/변경 모듈 (전 페이지 자동 배선)

### 4-1. DensityManager (신규)
`data-density-toggle` 버튼을 자동 배선. `window.Theme30.DensityManager.toggle()`도 노출. navbar actions 마크업(index 참고):
```html
<button class="btn btn-icon btn-ghost" data-density-toggle aria-label="표시 밀도 전환 (여유 ↔ 조밀)" aria-pressed="false" title="표시 밀도">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>
</button>
```

### 4-2. Segmented — role="radiogroup" 표준화 (브리프 §4-D)
**페이지의 segmented를 반드시 이 패턴으로 교체**(현재 `role="group"`+`aria-selected`는 무효 ARIA):
```html
<div class="segmented" role="radiogroup" aria-label="기간 보기" data-segmented>
  <button type="button" role="radio" aria-checked="true">일</button>
  <button type="button" role="radio" aria-checked="false">주</button>
  <button type="button" role="radio" aria-checked="false">월</button>
</div>
```
`data-segmented`가 있으면 app.js `initSegmented()`가 클릭·방향키(←→↑↓/Home/End)로 `aria-checked`+roving tabindex 동기화. 대상: dashboard/kanban/inbox 의 기간·뷰 세그먼트.

### 4-3. Command Palette (⌘K) — listbox + 최근방문 + 밀도 (브리프 §4·§5-③)
`cmdk` 마크업을 아래 구조로 업그레이드(정식 combobox/listbox ARIA + activedescendant). **각 페이지의 cmdk도 동일 구조로** 맞추면 "최근 방문"이 페이지 간 이어집니다(localStorage `theme30-recent`).
```html
<input type="text" role="combobox" aria-controls="cmdk-list" aria-expanded="false" aria-autocomplete="list" aria-label="명령 또는 페이지 검색" placeholder="명령 또는 페이지 검색…" />
...
<div class="cmdk-list" role="listbox" id="cmdk-list" aria-label="명령 결과">
  <div class="cmdk-group-label" data-recent-label hidden>최근 방문</div> <!-- app.js가 자동 채움 -->
  <div class="cmdk-group-label">페이지 이동</div>
  <div class="cmdk-item" role="option" id="cmdk-opt-dashboard" data-href="./dashboard.html" data-keywords="...">…</div>
  ...
  <div class="cmdk-item" role="option" id="cmdk-opt-density" data-action="toggle-density" data-keywords="밀도 조밀 여유">표시 밀도 전환</div>
</div>
<div class="cmdk-empty" role="status" aria-live="polite" style="display:none">검색 결과가 없습니다.</div>
```
- 액션: `data-action="toggle-theme"` / `toggle-density` / `toast` 지원. 각 `.cmdk-item`에 `role="option"`+고유 `id` 필수(없으면 app.js가 자동 부여하지만 명시 권장).
- 페이지 링크는 상대경로 주의(pages 내부는 `./dashboard.html`, index는 `./pages/dashboard.html`). **⌘D 같은 미구현 단축키 힌트는 넣지 말 것**(구현 없는 기능 광고 금지).

### 4-4. Reveal 엔진 변경
`initReveal()`이 이제 `[data-reveal]`·`.chart-draw`에 **`.is-in`** 부여(기존 `.animate-in` 아님). `html.js [data-reveal]{opacity:0}` → `.is-in`으로 등장. `[data-stagger]`는 CSS만으로 순차 등장(JS 불필요). 차트 라인 드로잉: `<path class="chart-draw" style="--draw-len:520">`(경로 길이) → 뷰포트 진입 시 그려짐. reduced-motion 전부 즉시 완성.

---

## 5. 페이지 일관 지침 (교차 정합 — 어기면 AI-tell)

- **정본 KPI 값**(index 프리뷰 기준, dashboard 등 전 페이지 통일):
  - 월 매출(MRR) **₩4.82억** · 전월 대비 **+18.2%**
  - 활성 사용자 **12,840** · **+8.1%**
  - 이탈률 **2.1%** · **-0.3%p**
- **통화·데이터 국산화**(브리프 §3·§5-⑦): `$`/`€` 전면 제거 → `₩`+콤마. 거래처 Acme/Globex/Initech/Umbrella/Hooli/Pied Piper → 국내 가상기업(㈜한빛물류, 두레페이, 세종에듀텍, 모두상사, 온누리커머스 등). 인명은 한국 성명(성씨 중복 회피).
- **가격 정합**: pricing/billing/inbox(영수증)의 동일 플랜 가격은 완전 일치(data-* 정렬값 포함).
- **영문 eyebrow 한글화**: `PRICING`(pricing:69) `Compare Plans`(pricing:177) `Empty State Patterns`(404:104) 등 → 한글.
- **어체**: 페이지 내 단일 어체, 실무·명료(해요체/합니다체). 토스트는 "결과+후속"("메일 3건을 보관했어요 · 되돌리기").
- **날짜**: 요일 병기 시 실제 달력 확인, 불확실하면 상대표현("어제", "3일 전").
- **배경**: hero/pricing/onboarding 에 `bg-gradient-hero`+`fx-noise`(+선택적 `fx-aperture`), 페이지별 씬 변주.
- **404**: 브랜드 조리개 모티프로 무대화(브리프 §5-①) — 나침반 일러스트를 조리개 변형으로.

## 6. 회귀 금지 (grep 통과 유지)
- 하드코딩 hex/`#fff` 금지 → 토큰 경유(`--color-static-white` 등). SVG 속성 `var()` 금지.
- 인라인 `grid-template-columns` 금지 → §3 유틸.
- `<td>`/`<th>`에 `display:flex` 금지(정렬은 셀 안 `<span>` flex 래핑).
- 막대차트 자식 `height:%`는 부모가 실제 높이 갖도록(래퍼 `height:100%`/`align-self:stretch`).
- 아바타/뱃지 이니셜 1~2자(한글 3자↑ 잘림).
- 강한 훅/펀치라인은 페이지당 1곳만, 축자 반복 금지.

## 7. 미처리(페이지 담당) 참고
- 브리프 §4-D-10 `mail-row role="listitem"`(inbox) → `role="list">li>button` 또는 listbox/option로.
- 브리프 §4-D-13 칸반 DnD 키보드 대안(← 이전 열 / 다음 열 →) — app.js Kanban은 포인터만. 페이지에서 대안 버튼+라이브리전 추가 권장.
- CHECKLIST.md 의 낡은 수치(muted≈4.6:1, 폰트 설명)는 실제로 muted=slate-600 승급됨 — 최종 QA 시 갱신.
