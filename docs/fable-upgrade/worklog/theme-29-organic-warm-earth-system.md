# theme-29 Organic Warm Earth — 시스템 레이어 고도화 노트 (페이지 에이전트용)

작업 범위: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js
(pages/ 는 미수정) · 어체: **다정·환대 해요체**, 통화 ₩, 날짜는 상대표현 권장.

---

## 1. 신규/변경 토큰

**tokens.css (원시)**
- `--neutral-550: #76664E` — subtle 텍스트용 (cream 위 4.6:1, AA 통과)
- `--neutral-950: #14100A` — 다크 코드/터미널 표면
- `--fraunces-hero: "SOFT" 90, "WONK" 1` — **페이지당 가장 큰 디스플레이 1곳에만** (Fraunces WONK 해방)
- `--crackle-texture` — 갈라진 유약 크랙 SVG (404·빈 상태용)
- `--wheel-rings` — 물레 동심원 배경 (`--wheel-x`/`--wheel-y`로 원점 이동)
- `--glaze-drip` — 젖은 유약 sheen (컬러 미디어 위 오버레이)
- `--thumbprint` — 버튼 press 시 currentColor 기반 엄지자국 (자동 적용, 손댈 일 없음)
- `--leading-heading-ko:1.32` / `--leading-display-ko:1.18` / `--leading-body-ko:1.72` / `--tracking-caps-ko:0.06em`

**semantic.css (역할)**
- `--color-text-subtle` = neutral-550 (기존 3.4:1 → 4.6:1)
- `--color-warning` = **clay-700** (기존 clay-600, 뱃지/알럿 텍스트 AA 5.0:1). 시각적으로 한 톤 진해짐.
- `--color-on-media: #FFF6EC` — **고정 색 그라데이션/미디어 위 크림 잉크** (라·다크 공통). 컬러 배경 위 텍스트는 이 토큰 사용.
- `--code-bg / --code-border / --code-fg` — 코드블록 표면 (라이트=neutral-900, 다크=neutral-950). 코드블록 하드코딩 hex 금지.
- 다크 `--color-surface`의 죽은 8자리 hex 1줄 제거함.

---

## 2. 신규 유틸리티 / 컴포넌트 클래스

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.has-crackle` | 갈라진 유약 질감 오버레이 | 404·empty-state 컨테이너에 부여 |
| `.wheel-rings` | 물레 동심원 배경 | 히어로/브레이크 섹션. `style="--wheel-x:110%;--wheel-y:-10%"`로 씬별 변주 |
| `.blob-hover` | hover 시 blob-radius 흐르듯 전이 | 카드/아바타에 부여 (시그니처 hover) |
| `.hide-sm` | ≤560px 숨김 | 좁은 화면서 부가 라벨 감출 때 |
| `.nowrap` | 줄바꿈 방지 | 가격·주문번호·핸들 (예: `₩38,000`) |
| 유약 sheen | `<span class="glaze">` (blob-art 내부) | index 히어로 blob-art 참고. `background:var(--glaze-drip)` |
| 도장 뱃지 | `.price-card.featured` | ::before가 **"인기" 도장(brick, 회전)** 으로 자동 출력. "MOST LOVED" 사라짐 |

---

## 3. 페이지에 반드시 반영할 지침 (일관성)

1. **FOUC 스니펫**: 각 페이지 `<head>` 최상단(뷰포트 meta 다음)에 아래 삽입 + `<html>`의 `data-theme="..."` 하드코딩 제거.
   ```html
   <script>(function(){try{var t=localStorage.getItem("owe-theme");
   if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
   document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
   ```
   (localStorage 키는 반드시 `owe-theme` — app.js와 동일)

2. **Fraunces 폰트 링크 교체** (SOFT/WONK 축을 실제로 로드해야 함 — 안 그러면 WONK 무효):
   `family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1` 형태로 `<link>` 갱신.
   페이지당 가장 큰 디스플레이 하나에 `font-variation-settings: var(--fraunces-hero)` (또는 `.hero-display` 클래스) 적용.

3. **Segmented control**: `role="tablist"`+`aria-selected` → **`role="radiogroup"` + 자식 `role="radio" aria-checked`** 로 교체(무효 ARIA 수정). app.js가 aria-checked·방향키·roving tabindex 자동 처리. CSS는 `[aria-checked="true"]`도 활성 스타일. (dashboard/product/settings의 segmented 해당)

4. **테이블 정렬 키보드화**: `th.sortable`의 라벨을 `<button class="th-sort">컬럼명</button>`으로 감싸 포커스/Enter 가능하게. app.js는 th 클릭 위임이라 버튼 클릭도 그대로 정렬됨. `th scope="col" aria-sort` 유지.

5. **inbox 3-pane 모바일**: patterns.css는 ≤960px에서 folders/reading을 `display:none` 하므로 **목록↔읽기 전환 경로**를 페이지에서 구현할 것(리스트 항목 클릭 시 읽기뷰 표시 토글). 그대로 두면 모바일서 메일 읽기 불가.

6. **통화·데이터 정본**(교차 페이지 일치):
   - 점박이 머그컵 = **₩38,000** / 라멘 볼 = **₩52,000** (index 장바구니 기준). product.html도 동일하게.
   - `$`·`€`·`MOST LOVED`·`SAVE 20%` 등 영문/달러 전부 한글·₩로. 큰 금액은 억·만 축약.

7. **이모지 → SVG**: 🏺🥣🌿📊 등은 인라인 SVG(currentColor)로. index 히어로 pills·장바구니 아이콘이 레퍼런스.

8. **인라인 onclick 금지**: dashboard alert의 인라인 `onclick` 등은 data-* 위임으로. (alert 닫기 버튼은 `.a-close` + JS 위임 권장)

9. **한글 조판**: base.css에 `:lang(ko)` 정제 레이어 추가됨(keep-all·display 행간·숫자 tabular·이탤릭 무효화). 페이지에서 한글에 `font-style:italic` 금지(faux-oblique). 강조는 색/굵기로.

10. **app.js 내장 문자열**은 전부 한글화 완료(토스트 기본값·cmdk·wizard·파일·chip). 페이지에서 data-toast 등에 영문 넣지 말 것.

---

## 4. 시그니처 (index.html에서 증명한 것 — 페이지에서 계승)
- 히어로: WONK 해방 + 물레 동심원(`.wheel-rings`) + blob 크롭 오버플로 + 유약 sheen.
- 버튼 press = 엄지자국(자동), hover = blob 전이(`.blob-hover`).
- pages-grid = "손으로 놓은 선반" 모자이크(미세 회전, hover 시 정렬).
- 다크 = 밤의 가마: body 하단 terracotta ember glow(base.css 자동).
