# theme-03-editorial-magazine — 시스템 레이어 변경 노트 (페이지 에이전트용)

> 작성: 시스템 레이어 담당. 대상 파일 = tokens/semantic/base/components/*.css · index.html · app.js.
> pages/*.html 은 이 문서를 참고해 **동일 언어로** 맞춰 주세요. 아래는 페이지에 그대로 쓸 수 있는 신규 토큰·클래스·지침입니다.

---

## 0. 반드시 따라야 할 3가지 (페이지 공통)

1. **폰트 스택이 바뀌었다** — 한글 디스플레이가 이제 **나눔명조 800**입니다(고운바탕은 최대 700이라 강등). `--weight-black`(900)을 쓰는 헤드라인이 더는 faux-bold 로 뭉개지지 않음. 페이지에서 별도 폰트 지정 없이 `--font-display` 만 쓰면 자동 적용. **인용·리드에는 `--font-quote`(고운바탕)** 를 쓰세요.
2. **`data-theme` 하드코딩 금지 + FOUC 스니펫 필수** — 각 페이지 `<head>` 최상단(스타일 링크보다 위)에 아래 스니펫을 넣고, `<html>` 의 `data-theme="..."` 속성은 **제거**하세요. 키는 반드시 `em-theme`.
   ```html
   <script>
   (function(){try{var t=localStorage.getItem("em-theme");
   if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
   document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
   </script>
   ```
3. **"Claude"·영문 가상 필진(E. Marsh / A. Lindel / R. Koenig) 전부 한국 필진으로.** index 에서 확정한 편집국 등장인물을 재사용하면 세계관이 이어집니다:
   - 편집장 **서지원** · 문화부 **한예리**(사진/아트디렉션) · 교정부 **오세훈** · 과학부 **김도현** · 필자 **박지훈/윤서진** 등.
   - 섹션 키커의 영문(Culture / Essay / Politics)은 잡지 관습이라 **유지 OK**. dev-tool 카피("제로 디펜던시", "60+ 컴포넌트")·`href="#"`·인라인 `onclick` 은 전부 제거.

---

## 1. 신규/변경 토큰 (tokens.css · semantic.css)

### 폰트
| 토큰 | 값 | 용도 |
|---|---|---|
| `--font-display` (변경) | Fraunces → **나눔명조** → 고운바탕 → … | 모든 디스플레이/헤드라인. 한글 900 faux-bold 해결 |
| `--font-quote` (신규) | Newsreader → **고운바탕** → … | 풀쿼트·블록쿼트·리드 단락 전용(부드러운 목소리) |
| `--font-sans` (변경) | Inter → **Gothic A1 → Noto Sans KR** → system-ui → … | system-ui 를 한글 무드폰트 뒤로 이동(macOS 한글 라벨 버그 수리) |

### 한글 조판 (base.css 하단 `:lang(ko)` 레이어가 자동 소비 — 페이지는 그냥 `lang="ko"` 유지만 하면 됨)
`--leading-body-ko:1.75` · `--leading-heading-ko:1.3` · `--leading-display-ko:1.14`(0.95 직행 금지) · `--tracking-caps-ko:0.1em`

### 모션
`--duration-ink:680ms` · `--blur-ink:3px` — 잉크 마름 리빌용.

### 분위기(씬) 노브 — **페이지 스코프로 변주하세요** (§3-B)
| 토큰 | 라이트 | 다크 | 의미 |
|---|---|---|---|
| `--fx-vignette` | 0.5 | 0.72 | 종이 가장자리 바램(비네팅) 세기 |
| `--fx-watermark` | 0.05 | 0.07 | 대형 넘버 워터마크 오퍼시티 |

예) 404 페이지는 무너진 분위기로: 페이지 래퍼에 `style="--fx-vignette:.85"` 처럼 올려도 됨. 대시보드는 데이터가 주인공이니 `--fx-watermark:.035` 로 낮춰 절제.

### 코드블록 색 (하드코딩 제거 완료)
`--code-key/str/num/com` 이 라이트/다크 자동 추종. 코드블록 마크업은 `.tok-key/.tok-str/.tok-num/.tok-com` 만 쓰면 됨(다크 오버라이드 불필요).

---

## 2. 신규 컴포넌트·유틸리티 클래스 (전부 토큰 경유, 반응형 내장)

### A. 시그니처 모션 — "잉크" (base.css)
- **로드/스크롤 리빌**: 기존 `.reveal`/`.reveal-1..6` 그대로 쓰되 애니메이션이 fade-up → **ink-dry(흐림→선명, 이동 없음)** 로 교체됨. 페이지에서 스크롤 등장은 `data-reveal` 를 섹션에 달면 app.js 가 자동 처리(JS 없어도 콘텐츠는 보임).
- **`.link-swipe`** — 링크 hover 시 밑줄이 좌→우로 그려짐. `.prose a`·`.navbar__link` 는 자동 적용. 일반 링크에 시그니처를 주려면 이 클래스.
- **`.ink-mark`** — 로드 시 버건디 형광펜이 좌→우로 차오름. 히어로 **강조 1구절**에만. `.ink-mark--lit` 은 애니메이션 없이 항상 칠해진 상태.
  ```html
  <p class="lead">활자는 <span class="ink-mark">침묵의 건축</span>입니다.</p>
  ```

### B. 대형 넘버 워터마크 (base.css) — 섹션 뒤 접힌 숫자 (§5-②)
```html
<section class="container section watermark-wrap">
  <span class="watermark watermark--tr" aria-hidden="true">02</span>
  <div class="section-head">…</div>
  …
</section>
```
- 래퍼에 `watermark-wrap`, 자식으로 `.watermark.watermark--tr`(우상단) 또는 `--tl`(좌상단). `overflow-x:clip` 내장이라 가로 스크롤 안 생김. 세로 오버레이(툴팁/메뉴)는 정상 탈출.
- **팝오버/드롭다운이 섹션 상단 모서리에 열리는 페이지에서는 남용 주의.** 데이터/폼 밀집 페이지는 1개면 충분.

### C. 재단선 `.crop-marks` (base.css)
요소에 붙이면 좌상·우하 모서리에 인쇄 교정쇄 재단선 2개. 표지/커버성 블록에 사용.

### D. 창간호 표지 세트 (magazine.css) — 커버성 히어로에 재사용
- `.cover`(중앙정렬 래퍼) · `.issue-line`(발행정보 라인, 안에 `.issue-line__sep` 구분점, `<b>` 강조) · `.stamp`/`.stamp--filled`(회전 고무 스탬프, `aria-hidden`) · `.barcode` + `.barcode__bars`(ISSN 조판 오브제, `aria-hidden`).
  ```html
  <div class="cover crop-marks reveal reveal-1">
    <p class="kicker kicker--accent">제3호 · 2026년 7월</p>
    <h1 class="masthead__title">…</h1>
    <p class="issue-line"><span>월간</span><span class="issue-line__sep">·</span><span><b>₩18,000</b></span></p>
    <span class="stamp" aria-hidden="true">CREATED № 03</span>
  </div>
  ```

### E. 목차(Contents) `.toc` (magazine.css) — **카드그리드 대신 목차 조판을 쓰세요**
점선 리더 + 페이지 번호 + 카테고리 열. 반응형(≤560px 에서 리더 숨김) 내장.
```html
<nav class="toc" aria-label="…">
  <div class="toc__group">
    <p class="toc__group-label">Features · 특집</p>
    <a class="toc__entry toc__entry--feature" href="…">
      <span class="toc__num">쇼피스</span>            <!-- 좌측 카테고리(한글 최대 4자) -->
      <span class="toc__body">
        <span class="toc__title">제목</span>
        <span class="toc__desc">한 문장 시나리오</span>
      </span>
      <span class="toc__leader"></span>                 <!-- 점선 리더(빈 span) -->
      <span class="toc__page">24</span>
    </a>
  </div>
</nav>
```
`--feature` 는 페이지 번호에 ★ 추가. inbox/목록형 페이지의 항목 나열, 관련기사 리스트 등에 재활용 가능.

### F. 콜로폰(판권면) `.colophon` (magazine.css) — **모든 페이지 푸터를 이걸로 통일**
```html
<footer class="container section">
  <hr class="rule--double mb-6">
  <p class="kicker kicker--accent mb-4">콜로폰 · 판권</p>
  <div class="colophon">
    <div class="colophon__block"><p class="colophon__mark">디 <span class="mark">에디토리얼</span></p>…</div>
    <dl class="colophon__block"><dt>발행 · 편집</dt><dd>서지원</dd></dl>
    …
  </div>
</footer>
```
발행/편집·아트디렉션·조판·발행처(ISSN)·정가 형식. dev-tool 푸터 금지.

### G. 비대칭 스프레드 컬럼 (base.css) — **인라인 `grid-column: span N` 금지**
`.mag-grid` 안에서 `style="grid-column: span 7"` 대신 **클래스**를 쓰세요(모바일 전폭 스택 내장):
- `.mag-col-major`(7/12) · `.mag-col-minor`(5/12) → ≤768px 에서 `1 / -1` 자동.

---

## 3. app.js — 페이지에 영향 있는 동작 변화 (마크업만 맞추면 자동)

| 기능 | 페이지가 맞춰야 할 마크업 |
|---|---|
| **Segmented** | 뷰 전환 스위처는 `role="radiogroup"` + 자식 `role="radio" aria-checked`. (진짜 탭=패널전환일 때만 `role="tab"` + `aria-controls` + tabpanel) app.js 가 aria-checked·방향키·roving tabindex 자동 처리. |
| **Rating(입력용)** | `.rating[role=radiogroup][data-value]` + 별 버튼마다 `role="radio" aria-checked`. 방향키/aria 자동. **표시 전용 별점은 `.rating--readonly`** (인터랙티브 금지). |
| **Drawer/오프캔버스** | 모달과 동급 접근성 자동(포커스 이동·트랩·복원·ESC). CSS 가 닫힘 시 `visibility:hidden` 이라 Tab 순서에서 빠짐. 열기=`data-drawer-open="id"`, 닫기=`data-drawer-close`, 오버레이=`id-overlay`. |
| **Table 정렬** | `th.sortable` 이면 app.js 가 `tabindex=0` + Enter/Space 키보드 정렬 자동 부여. `data-sortable` 테이블 + `data-type="number"` 유지. |
| **Popover** | 트리거에 `data-popover-trigger` 만 달면 `aria-haspopup`/`aria-expanded` 자동. |
| **CommandPalette 명령** | 인라인 onclick 금지. 테마 전환은 `data-cmdk-action="theme"`, 이동은 `data-href`, 기타는 `data-label`. |

---

## 4. 반응형·품질 주의 (페이지에서 재발 금지)
- 3패널(inbox)·풀높이 레이아웃은 `100dvh` 권장(100vh 금지). 3-pane 은 ≤1000px 에서 스택 전환 경로 유지.
- 오버레이(모달·드로어·cmdk) 닫힘 상태는 클릭·Tab 비간섭 계약 준수(시스템 CSS 가 보장하지만 새 오버레이 추가 시 동일 패턴).
- 초대형 한글 디스플레이는 카피를 2~6자 어절로 끊어 `<span>` 분절(§5-A-1). 숫자는 `.num`/스탯/가격 클래스가 자동 tabular.
- 어체: 이 테마 보이스 군 = **격식·절제(합쇼체/서면체)**. 표지·판권은 명사형 종결 허용, 본문은 합쇼체로 통일. 한 페이지에서 어체 섞지 말 것.

---

## 5. 검증 메모
- 자동 grep(§7-1) 시스템 레이어분 전부 통과: index.html SVG var()=0, hex 하드코딩(components)=0, Claude/영문필진=0, href=#/onclick=0, 인라인 grid-template-columns=0, keep-all 존재, dev-tool 카피=0.
- app.js `node --check` 통과 · 전 CSS 중괄호 균형 OK · 신규 토큰 14종 정의/사용 모두 확인 · 죽은 토큰 0(‑caps‑ko 도 점화).
- **육안 검증 한계**: 작업 시점에 공용 Playwright 브라우저를 페이지 에이전트가 점유 중이라 브라우저 스크린샷 확인은 미실시. 라이트/다크 × 4뷰포트 육안은 페이지 통합 후 함께 확인 권장(특히 워터마크 겹침, 나눔명조 800 헤드라인 렌더, 비네팅 다크 강도).
