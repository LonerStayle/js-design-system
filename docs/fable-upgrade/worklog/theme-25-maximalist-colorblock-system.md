# theme-25-maximalist-colorblock — 시스템 레이어 고도화 워크로그

> 대상 독자: 페이지(pages/) 담당 에이전트
> 범위: tokens.css · semantic.css · base.css · components/*.css · index.html · app.js (pages/ 미수정)
> 원칙: DNA = "패턴이 아니라 색면". 충돌·과잉·거대 타이포. 미니멀·여백·무채색 금지.

---

## 1. 공유 레이어에서 이미 고친 것 (페이지가 자동 상속 — 중복 작업 불필요)

- **폰트 로딩 일원화**: `tokens.css` @import 한 곳에 Archivo Black·Space Grotesk·JetBrains Mono·Black Han Sans·Gothic A1·Noto Sans KR 전부 통합. **Noto Serif KR 제거**(미사용 서재 잔재).
- **폰트 스택 순서 교정**: `--font-body` = `"Space Grotesk","Gothic A1","Noto Sans KR",...,system-ui`. system-ui가 뒤로 가서 한글 무드폰트(Gothic A1) 실적용됨. `--font-display`도 Black Han Sans를 라틴 폴백 앞으로.
- **한글 조판 레이어**(base.css 하단 `:lang(ko)`): keep-all·행간(heading 1.28 / display 1.1)·자간(caps 0.06em, display 0)·uppercase 무효화·italic 무효화·tabular-nums. **`<html lang="ko">`만 있으면 전 페이지 자동 적용.**
- **switch 체크 아이콘**: `.switch .thumb svg { stroke: var(--white) }` — 페이지의 `stroke="#fff"` 하드코딩도 CSS가 덮어 정상. (원하면 마크업은 `currentColor`로 정리)
- **avatar 대비 수정**: `.avatar--p1` 배경 pink-500→**pink-600**(흰 글자 5.07:1 통과). `#fff`→`var(--white)`.
- **combo/plane StatCard delta 색**: `.statcard[class*="combo-"] .stat-delta { color: inherit }` — 색면 위 delta는 검증된 안전 fg 상속(방향은 ▲▼ 아이콘이 전달). → 페이지에서 delta에 `style="color:#fff"` 같은 땜질 **불필요, 제거 권장**.
- **cal-event**: `#fff`→`var(--white)`.
- **app.js 한글화**: 토스트 region aria-label "알림", 기본 제목 "알림", 닫기 "닫기", cmdk 빈결과 "결과 없음"(+role=status/aria-live), 선택 카운트 "N개 선택됨", 캐러셀 dot "N번 슬라이드로 이동", 테마 라벨 "다크/라이트".

## 2. 신규/변경 토큰 (tokens.css · semantic.css)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--leading-heading-ko` | 1.28 | 한글 헤딩 행간 (조판 레이어가 소비) |
| `--leading-display-ko` | 1.1 | 한글 디스플레이 행간 (0.85 직행 금지) |
| `--tracking-caps-ko` | 0.06em | 한글 와이드 라벨 자간 상한 |
| `--tracking-display-ko` | 0 | Black Han Sans 뭉침 방지(음수 자간 금지) |
| `--fx-watermark-opacity` | 0.06 | 섹션 뒤 워터마크 outline 농도 |
| `--fx-wedge-opacity` | 1 | 코너 색면 웨지 농도 |

- **버튼 clash-flip 토큰**: `.btn`에 `--_offset2`(2번째 충돌 색면) 추가. 컬러 변형별로 `--_offset`+`--_offset2` 보색 2톤 지정(primary=blue+cyan, secondary=yellow+lime, danger=black+orange, success=black+blue). hover 시 색면 2개가 튀어나오는 "충돌 스파크".
- 죽은 토큰 정리: `--shadow-pop`은 index 데모타일 hover에 점화, `--clash-shift` 등 미사용 신규토큰 미도입. `--shadow-flat`·`--block-overlap-lg`는 README 문서화 스케일이라 보존.

## 3. 신규/점화 유틸리티 클래스 (base.css) — 페이지에서 적극 사용할 것

DNA 어휘(사장돼 있던 clip/overlap/headline-* 전부 점화). **색면 위 텍스트는 반드시 solid 블록(combo/plane/dark card) 안에** 두어 대비 확보.

- **`.hue-bar`** — CSS-only 8휴 시그니처 바(자식 불필요). 전 페이지 상단(스킵링크 다음, navbar 앞)에 1개 두는 것을 시그니처로 권장.
  ```html
  <div class="hue-bar" aria-hidden="true"></div>
  ```
- **`.clip-diagonal` / `-diagonal-rev` / `-slash` / `-corner` / `-wedge`** — 색면 대각 분할. `.plane-*`와 함께 히어로/헤더 배경 색면에 사용(각 페이지 헤더 최소 1개 사선 분할).
  ```html
  <div class="hero-grid" aria-hidden="true">
    <div class="plane-1 clip-slash"></div><div class="plane-2 clip-diagonal-rev"></div> …
  </div>
  ```
- **`.corner-wedge` + `.corner-wedge--tr|--bl` + `.clip-wedge` + `.plane-*`** — 코너에서 캔버스로 파고드는 색면 웨지. `aria-hidden`, 콘텐츠는 solid로 덮이는 위치에만(본문 텍스트 뒤 금지). 부모에 `position:relative; overflow:clip`(= `.section--clash`) 필요.
- **`.watermark` (+ `.headline-mega .headline-stroke`)** — 섹션 뒤 거대 outline 워터마크. `.section--clash` 안에서 `position:absolute`.
  ```html
  <section class="section section--clash">
    <span class="watermark headline-mega headline-stroke" aria-hidden="true" style="bottom:2rem;right:-1rem">대시보드</span>
    <div class="container"> … </div>
  </section>
  ```
  (모바일 ≤768px에서 워터마크는 자동 `display:none` — index 예시 참고. 위치는 페이지별 클래스로 잡고 인라인 grid-template은 금지)
- **`.section--clash`** — `position:relative; overflow:clip`. 워터마크/웨지 호스트. 직계 콘텐츠는 자동으로 z-index 위로.
- **`.overlap`** — 자식들을 `--block-overlap`(28px)만큼 세로로 겹침(색면/헤드라인 블록 충돌).
- **`.layer-shift`** — 요소 뒤에 `--plane-3` 색면이 오프셋되어 깔림(카드·위젯 겹침감). index 히어로 카드에 사용.
- **`.split-diagonal`** — 2톤 대각 배경(풀블리드 브레이크/CTA 밴드). 그 위 텍스트는 solid 카드 안에.

### 시그니처 모션 (app.js에 엔진 내장 — 마크업만 추가)
- **스크롤 리빌**: 요소에 `data-reveal` 부여 → IntersectionObserver가 색면 와이프(`wipe-in`, clip-path)로 등장. `html.js`로 게이팅 + reduced-motion/IO 미지원 시 즉시 표시(콘텐츠 숨김 사고 없음). 섹션 제목·그리드 단위로 붙일 것.
- **로드 스태거**: 히어로 등 최초 화면은 `.reveal-group` + 자식 `.reveal`(기존 CSS, JS 불필요).
- **clash-flip hover**: 모든 `.btn`이 hover 시 2톤 색면 충돌(자동). 카드/타일 hover는 `transform: translate` + 오프셋 섀도 문법 유지.

## 4. 페이지가 반드시 일관 반영할 지침

1. **`<html lang="ko">`** 필수(조판 레이어 전제). `data-theme` 하드코딩 제거하고 **FOUC 스니펫**을 `<head>` 최상단에 (키 `t25-theme`, `document.documentElement.classList.add("js")` 포함 — index.html 헤드 그대로 복사).
   ```html
   <script>(function(){try{var t=localStorage.getItem("t25-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}document.documentElement.classList.add("js");})();</script>
   ```
   → `js` 클래스가 head에서 먼저 붙어야 `data-reveal` 초기 숨김이 깜빡임 없이 동작.
2. **폰트 `<link>` 제거 권장**: theme.css(→tokens.css @import)가 라틴+한글 전부 로드하므로 페이지의 개별 Google Fonts `<link>`는 중복(로딩 2갈래). `preconnect`만 남기고 `<link ...css2?...>` 삭제.
3. **세그먼트 컨트롤 ARIA**: `.segmented`는 `role="radiogroup"` + 버튼 `role="radio" aria-checked`로(뷰 전환·기간 토글). `role="tablist"`+plain button `aria-selected`는 무효 ARIA. **app.js `initSegmented`가 radiogroup(aria-checked)·legacy(aria-selected) 둘 다 처리 + 방향키/roving tabindex 자동** — 마크업만 radiogroup으로 바꾸면 됨. (진짜 패널 전환 탭만 `.tabs/.tablist/.tab` 유지)
4. **색면 위 텍스트**: `--block-combo-1..8` 또는 `.combo-1..8`/solid dark 카드만. 반투명 흰 배지(rgba 흰 25%) 위 흰 글자 금지 → combo 클래스로.
5. **인라인 style 최소화**: `#fff` 하드코딩·`.section-tag` 재정의 인라인 복붙 금지. 3회 이상 반복 패턴은 클래스로. **인라인 `grid-template-columns` 절대 금지**(클래스+브레이크포인트).
6. **씬 변주**: 배경 장치를 전 페이지 복붙하지 말 것. 대시보드=절제(데이터가 주인공), 프라이싱=추천 플랜 뒤 색면 후광, 404=무너진/기울어진 최대 강도. `--fx-*` 노브 활용.
7. **어체**: 실무·명료 톤(해요체/합니다체). 데이터 밀도가 곧 보이스("6월 매출 ₩4.82억 · 전월 대비 +18.2%"). 시그니처 훅 문장 반복 금지.
8. **교차 페이지 정합**: index 표 정본 데이터 — 김진섭/디자인(₩4,200K), 이서연/엔지니어링(₩2,800K), 박도윤/마케팅(₩6,100K), 최하은/세일즈(₩900K). 동일 인물·수치가 다른 페이지에 나오면 값 통일.

## 5. 남은 페이지 P0/P1 (브리프 기준, pages 담당 몫)
- pricing.html SVG `stroke="var()"` 8곳 → `style="stroke:var(--color-success)"` 또는 `stroke="currentColor"`+부모 color.
- 모바일 내비 단절(dashboard 사이드바 `display:none` 후 대체 없음) → 햄버거→드로어(오버레이 계약 적용) 또는 상단 내비.
- 칸반 DnD 키보드 대체(카드에 "← 이전 열 / 다음 열 →" 버튼 + 라이브 리전).
- **에러 상태 시연 0건** → settings 저장 실패 토스트 + invalid 필드 1개, onboarding 필수값 에러 1회.
- 차트 색 문법: 무지개 순환 금지 → 단일 휴 램프 + 최고값 1개만 핫핑크 클래시. 범례=시리즈 정합.

## 6. 검증 상태
- grep 자동검증(SVG var·lang·components hex·.md링크·인라인grid·filler·keep-all·미정의토큰) **전부 통과**. 브레이스 밸런스 OK. 죽은 유틸/토큰 정리 완료(점화 또는 제거).
- 육안(브라우저) 검증은 이 환경에서 불가(MCP 브라우저 잠금 + headless 네트워크 제약). 페이지 담당/최종 단계에서 4뷰포트×라이트/다크 육안 확인 권장.
