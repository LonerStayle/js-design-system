# theme-17-botanical-journal · 시스템 레이어 고도화 워크로그

> 대상: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js
> **pages/ 는 건드리지 않음.** 이 문서는 페이지 에이전트가 pages/ 9개를 맞출 때 쓰는 변경 노트다.
> 검증: SVG var()=0 · 하드코딩 hex(컴포넌트)=0 · raw .md 링크=0 · keep-all 존재 · 신규 토큰 전부 정의됨 · 콘솔 에러 0 · 512px 가로 오버플로 0 · 라이트/다크 육안 확인 완료.

---

## 1. 페이지가 반드시 반영해야 할 것 (P0 정합)

1. **FOUC 스니펫**: 각 페이지 `<head>` 최상단(뷰포트 meta 직후)에 아래 동기 스크립트를 넣고, `<html>` 의 하드코딩 `data-theme="..."` 속성은 **제거**한다. 키는 `bj-theme` (app.js와 동일).
   ```html
   <script>
     (function () {
       try {
         var t = localStorage.getItem("bj-theme");
         if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
         document.documentElement.setAttribute("data-theme", t);
       } catch (e) {}
     })();
   </script>
   ```
   → `<html lang="ko">` 만 남기고 `data-theme` 하드코딩 삭제.

2. **`lang="ko"`**: 전 페이지 `<html lang="ko">`. 한글 조판 레이어(keep-all·small-caps 무효화·ko 행간)는 base.css에 전역으로 들어가 있으므로 lang만 맞으면 자동 적용된다. 학명(binomial)·"Herbarium digitalis" 같은 라틴어는 그대로 유지(이탤릭도 유지 — ko 이탤릭 무효화는 `em/i/cite`에만 적용, `.binomial`·`.specimen-tag__name` 은 제외했음).

3. **`.footer` 승격**: `.footer` 는 이제 base.css에 있다. 기존에 footer가 맨몸으로 렌더되던 404·kanban·profile·product 페이지는 이제 자동으로 이중 룰 상단선을 얻는다. **페이지 로컬 `<style>` 안의 `.footer` 정의는 삭제**하고 공용을 쓸 것. 푸터는 콜로폰(판권면) 어법으로: dev-tool 카피("순수 CSS/프레임워크 없음/file://") 금지. index 푸터 참고 → `제17호 야외 채집 일지 … 두 판(版)으로 눌러 두었습니다` + `№ 017 / 200 · 압화 & 제책 2026`.

4. **SVG presentation attr에 var() 금지**: pages/에 50+건 남아 있음(브리프 §4-1). `stroke="var(--x)"` → `style="stroke:var(--x)"` 또는 CSS 클래스(패턴 C). index 히어로 도해가 좋은 예시 → `.plate-stem{stroke:var(--color-primary)}` 식 클래스로 뺐다.

5. **404 hr 버그**: `<hr class="rule-sprig">…</hr>` (void 요소 안 콘텐츠) → `<div class="rule-sprig" role="separator">…</div>` 로 교체.

---

## 2. 신규/변경 토큰

**tokens.css**
- `--ink-450: #75654c` — AA 4.87:1(양피지). `--color-text-faint` 가 이제 이 값(기존 ink-400 은 4.45:1 미달이었음). **소형 텍스트에 faint 써도 AA 안전.**
- 한글 조판: `--leading-heading-ko:1.32` · `--leading-display-ko:1.14` · `--leading-body-ko:1.72` · `--tracking-caps-ko:0.09em`.
- `--duration-draw:1600ms` (잉크 드로잉).
- 압착 각도: `--tilt-tag:-1.2deg` · `--tilt-tape:-3.5deg` · `--tilt-stamp:8deg` · `--tilt-note:-2deg`.

**semantic.css** (라이트/다크 모두 정의됨)
- `--color-text-faint` → `var(--ink-450)` (라이트). 다크는 기존 유지.
- 물성 토큰: `--tape-fill`(린넨 테이프 그라데이션) · `--tape-edge` · `--accession-ink`(수납도장 = rose) · `--stain-ring`(얼룩 링) · `--pressed-shadow`(압착 그림자) · `--moonlight`(다크 전용 등불 글로우, 라이트=transparent) · `--code-bg`(코드블록, 라이트 ink-900 / 다크 #10140b).
- **버그 수정**: 다크 `--color-hairline` 의 찌꺼기 줄(`#4a543600`) 삭제.
- `.codeblock` 은 이제 `var(--code-bg)` 사용(다크 하드코딩 override 제거) — 페이지가 코드블록 쓰면 자동 정합.

---

## 3. 신규 유틸리티 클래스 (base.css) — 전 페이지에서 재사용 권장

모두 **장식**이므로 마크업에 `aria-hidden="true"` 부여. 절대배치류는 `position:relative` 부모 필요.

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.mounting-sheet` | 표본 대지(모서리 레지스트레이션 십자선 ::before/::after, 압착 그림자, 다크=등불) | 히어로/상세 대지 컨테이너 |
| `.tape` / `.tape--v` | 린넨 마운팅 테이프(가로/세로), multiply/screen 블렌드 | `<span class="tape" style="top:-9px;left:20%" aria-hidden="true">` |
| `.accession-stamp` | 원형 붉은 수납 도장(`<b>` 한 줄 강조) | `<span class="accession-stamp">압화<b>№017</b>이끼과</span>` |
| `.pencil-note` | 연필 마지널리아(✎ 프리픽스, 기울임) | 큐레이터 주석 한 줄 |
| `.plate-number` | 초대형 로만 넘버 워터마크(opacity .07) | 섹션 헤더 뒤 `Tab.` 넘버 |
| `.marginalia` | 여백 교차참조(작은 라벨) | "cf. Tab. VII" 류 |
| `.vertical-label` | 세로쓰기 한글 라벨(vertical-rl, upright) | `<span class="vertical-label">기억의 고사리</span>` — 라틴은 내부 `.binomial` 로 감싸면 가로 유지 |
| `.stain` | 커피/물 얼룩 링(중심 잉크 번짐, multiply) | 대장·데스크 씬 모서리 |
| `.sway` | 매달린 태그가 끈 구멍에서 흔들림 | `.specimen-tag` 에 함께 (reduced-motion 정지) |
| `.ink-draw` | 자식 `path` 를 펜이 그려나감 | 아래 §4 |
| `.firefly` (+`--2`/`--3`) | 다크 전용 반딧불(라이트=투명) | 히어로/404 밤 씬 |

**주의**: `.plate-number` 를 섹션 헤더에 쓸 때 텍스트가 넘버 위에 오도록 헤더 텍스트 자식에 `position:relative;z-index:1` 을 주고, `.plate-number` 는 넘버만 z-index:0 유지. (index 의 `.comp-block__head > *:not(.comp-block__plate){position:relative;z-index:1}` 패턴 참고 — `:not()` 로 넘버 자신은 제외해야 absolute 가 안 깨짐.)

---

## 4. 시그니처 모션 — 잉크 드로잉 (죽어 있던 `bj-draw`·`bj-sway` 점화)

- **잉크 드로잉**: SVG 컨테이너에 `.ink-draw`, 그려질 `<path>` 마다 `pathLength="1000"` 필수(길이 무관 타이밍). 스태거는 `.ink-2`~`.ink-5` 클래스(180ms 간격). 선이 아니라 채움(꽃·꽃잎 fill)은 `.ink-fill` (드로잉 후 페이드). 색은 **CSS 클래스로**(`.plate-stem`/`.plate-bloom`/`.plate-petal`/`.plate-frame`) — SVG attr에 var() 금지 규칙 준수.
  ```html
  <svg class="plate-art ink-draw" viewBox="0 0 400 400" fill="none" aria-hidden="true">
    <g class="plate-stem" stroke-width="1.7">
      <path class="ink-2" d="…" pathLength="1000"/>
      <path class="ink-3" d="…" pathLength="1000"/>
    </g>
    <g class="plate-bloom ink-fill"><circle …/></g>
  </svg>
  ```
- **JS 불필요**: 순수 CSS 로드 애니메이션이라 JS 실패해도 콘텐츠 보임. `prefers-reduced-motion` → 즉시 완성(dashoffset 0). 404·빈 상태·온보딩 완료 일러스트에 확산 권장(브리프 §5-2).
- **태그 흔들림**: `.specimen-tag.sway` (transform-origin=끈 구멍). reduced-motion 정지.

---

## 5. 컴포넌트/JS 변경이 페이지에 주는 영향

- **`.specimen-tag` 다크 대비 수정**: 태그는 라이트/다크 모두 크림 종이(parchment-50)이므로 텍스트를 잉크 고정(`__name`=ink-800, `__meta`=ink-500)으로 못박음. 다크에서 크림-온-크림으로 사라지던 버그 해결 → 페이지에서 specimen-tag 쓰면 자동 정합.
- **app.js 문자열 전량 한글화**: 토스트 기본 제목 `압화 및 분류 완료`/`기록했습니다`, 테마 라벨 `주간`/`황혼`, cmdk 실행 토스트 `명령을 실행했습니다`, 복사 `복사됨 ✓`, 캐러셀 `N번 슬라이드`, 칩/파일 삭제 aria, 위저드 완료 `표본집이 완성됐어요`, 프라이싱 기간 `/년`·`/월`. → 페이지가 기본값에 의존하면 자동 한글.
- **cmdk 접근성(app.js)**: 초기화 시 `role=listbox/option` + `aria-activedescendant` + id 를 **자동 부여**(마크업 없어도). 항목 링크는 `data-href` 권장(`href` 도 하위호환 지원). 페이지 cmdk 항목의 `<div href>`(무효 HTML)는 `data-href` 로 바꾸면 깔끔.
- **드롭존 키보드**: Enter/Space 로 파일 선택 가능해짐(app.js). 페이지 드롭존은 `role="button" tabindex="0"` 유지만 하면 됨.
- **평점/진행률 aria 패턴**(index 참고): 레이팅 버튼은 `aria-label="잎 N개로 평가"`(숫자만 금지), 진행률은 컨테이너에 `role="progressbar" aria-valuenow/min/max` + aria-label. 도넛/막대차트는 `role="img"`+요약 aria-label 또는 visually-hidden 표.

---

## 6. 교차 페이지 데이터 정본 (전 페이지 일치시킬 것)

- 컬렉션 규모: **눌러 말린 표본 2,480점** / **완성 표본 9첩(=9 페이지)** / **주간·황혼 2판**.
- 에디션: **№ 017 / 200**. 대표 표본: **Filix memoria · 이끼과 · 기억의 고사리**(세로 라벨).
- 학명 브랜드: *Herbarium digitalis*.
- 큐레이터명(한글, 성 중복 회피): 한지아 · 서민준 (index 카드 기준). 아바타 이니셜은 1~2자(한, 서).
- 통화·날짜·수치: ₩+콤마, `2026년 7월 4일`/상대시간, 어중간한 실측값(반올림 금지). 프라이싱 가격은 pricing/inbox/billing 완전 동일값 + data-* 정렬값 일치.

---

## 7. 보이스·조판 (격식·절제 군 §5-C-5)

- 어체: **합쇼체/서면체**, 인쇄 관습 어휘("제17호", "판(版)", "도판 Tab. N", "№ 047/200", "제책"). 한 페이지 안에서 어체 섞지 말 것.
- **시그니처 문구 반복 금지**: 감성 훅은 가장 좋은 위치 1곳만. 같은 문장 축자 중복 절대 금지.
- 초대형 한글 디스플레이: 카피를 어절 단위로 줄이 떨어지게 `<br>` 분절(히어로 "눌러 말리고,/이름 붙인/디자인 표본집." 참고). `line-height:0.95` 한글 직행 금지 — `--leading-display-ko` 사용.
- 섹션 헤더: `도판 N · 라벨` 아이브로우 + `.plate-number` 워터맥으로 "진열대"가 아닌 "도감의 도판"으로.

---

## 8. index.html 에서 이미 처리된 것(참고용, 페이지가 흉내 낼 패턴)

- 히어로 = **표본 대지**(mounting-sheet + 테이프 + 수납도장 + 매달린 태그 + 세로 한글 라벨 + 잉크 드로잉 + 다크 반딧불). 모바일에서 sheet 는 `display:none` 금지 — 세로 스택으로 낙하(≤900px).
- 섹션 아이브로우 10개 → `도판 I~X` 넘버링 + `.plate-number` 워터마크.
- dev-tool 배지("120개 이상 요소" 등) → 세계관 배지("표본 2,480점 / 완성 표본 9첩 / 주간·황혼 2판").
- navbar "가이드"(README.md) → "판권"(#colophon), 푸터 README/CHECKLIST 링크 → 인페이지 앵커.
- 팔레트 스와치 라벨: text-shadow + dark-text 재배정으로 중간톤에서도 가독(11px/500).
