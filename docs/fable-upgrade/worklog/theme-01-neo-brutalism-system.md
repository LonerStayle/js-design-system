# theme-01-neo-brutalism — 시스템 레이어 변경 노트 (페이지 에이전트용)

작성: 2026-07-04 · 대상: tokens/semantic/base/styles/components/app.js/index.html (pages/ 미접촉)

## 1. 필수 반영 — 전 페이지 공통 계약

### 1-1. FOUC 스니펫 (head 최상단, `<html lang="ko">`에서 data-theme 하드코딩 제거)
```html
<script>
(function () {
  try {
    var t = localStorage.getItem("nb-theme");   /* 키는 반드시 nb-theme (app.js와 동일) */
    if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
</script>
```

### 1-2. 스킵 링크 (body 첫 요소) + main id
```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
…
<main id="main">
```

### 1-3. 모바일 버거 → mobile-nav 드로어 (죽은 버거 5곳 수리용 표준 패턴)
버거는 `data-sidebar-toggle`이 아니라 **드로어 오프너**다. 페이지마다 이 두 블록을 넣을 것:
```html
<!-- navbar 안 -->
<button class="navbar__burger" data-drawer-open="mobile-nav" aria-expanded="false" aria-label="메뉴 열기">
  <svg width="20" height="20"><use href="#i-menu"/></svg>  <!-- 스프라이트에 i-menu 심볼 추가 필요 -->
</button>

<!-- body 하단 오버레이 구역 -->
<div class="drawer" data-drawer="mobile-nav" data-side="right" role="dialog" aria-modal="true" aria-label="모바일 메뉴" hidden>
  <div class="drawer__panel">
    <div class="drawer__head drawer__head--yellow"><div><p class="drawer__eyebrow">NEO//BRUTAL</p><h3 class="drawer__title">메뉴</h3></div><button class="drawer__close" data-drawer-close aria-label="닫기">&times;</button></div>
    <div class="drawer__body">
      <nav class="mobile-nav" aria-label="모바일 메뉴">
        <a class="mobile-nav__link" href="../index.html"><span class="mobile-nav__num">00</span>홈</a>
        <!-- 현재 페이지엔 aria-current="page" -->
      </nav>
    </div>
    <div class="drawer__foot"><button class="btn btn--secondary btn--block" data-theme-toggle>라이트 / 다크 전환</button></div>
  </div>
</div>
```
i-menu 심볼: `<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>`
버거 aria-expanded는 app.js가 자동 동기화한다(openOverlay/closeOverlay).

## 2. 새 토큰

| 토큰 | 값/용도 |
|---|---|
| `--text-mega` | `clamp(3.25rem, 12vw, 10.5rem)` — 포스터/404 초대형 타이포 |
| `--leading-heading-ko / --leading-display-ko / --leading-body-ko / --tracking-caps-ko` | 한글 조판 기저 (base.css `:lang(ko)` 레이어가 자동 소비 — 페이지에서 직접 만질 일 없음) |
| `--duration-stamp` | 340ms — 스탬프 모션 |
| `--tilt-cw-loud / --tilt-ccw-loud` | ±6° — 요란한 스티커/포스터 판 |
| `--marquee-bg/fg, --marquee-hover-bg/fg, --marquee-duration` | 마퀴 (semantic.css) |
| `--stamp-tilt / --stamp-scale / --stamp-stagger` | 스탬프 리빌 노브 |
| `--ring-pink` | invalid 필드 포커스 링 (form.css가 자동 적용) — `--ring-lime/yellow`는 삭제됨 |

폰트: **임포트는 tokens.css 한 곳뿐** (base.css @import 삭제, Noto Serif KR 제거). 스택 순서 수정으로 Black Han Sans/Gothic A1이 macOS에서 실제 적용됨 — 페이지에서 폰트 관련 손댈 것 없음.

## 3. 새 컴포넌트·유틸리티

### 3-1. 스탬프 리빌 (시그니처 모션 — components/motion.css)
```html
<div data-stagger>
  <article class="card" data-reveal>…</article>   <!-- 스크롤 진입 시 '쾅' 찍힘, 형제끼리 70ms 스태거 -->
</div>
```
- 기울어진 요소는 `data-reveal` + `.tilt/.tilt-ccw/.tilt-loud/.tilt-ccw-loud` 병용 시 기울기 유지한 채 찍힘. `.sticker/.sticker--cw`도 자동 처리. **그 외 transform 회전 커스텀 요소에 data-reveal을 얹으면 회전이 리셋되니 반드시 위 클래스나 `rotate:` 속성을 쓸 것.**
- JS 미로드/reduced-motion 시 콘텐츠 항상 보임(계약 내장). **페이지당 히어로·카드 그리드·스티커에 적극 사용할 것. fade-up 스타일 자작 금지.**

### 3-2. 마퀴 (components/marquee.css)
```html
<div class="marquee marquee--slow" aria-hidden="true">
  <div class="marquee__track"><span class="marquee__item">부수고 만들고 출시하라</span><span class="marquee__item">✶</span>…</div>
  <div class="marquee__track">…같은 내용 복제…</div>  <!-- 무한 루프용 2벌 -->
</div>
```
변형: `--reverse --slow --fast --yellow --blue --pink`. hover=정지+색 반전. **페이지마다 색 변주할 것(잉크 복붙 금지).** 장식이므로 항상 aria-hidden.

### 3-3. 색면 침수 flood (base.css)
```html
<section class="section flood flood--blue section-numbered">
  <span class="section-num" aria-hidden="true">02</span>
  <div class="container">… 카드/버튼 그대로 사용 …</div>
</section>
```
- `flood--blue/pink/ink` = 다크 계약 섬(종이 텍스트+종이 하드섀도). 내부 `.card/.panel/.stat`은 자동으로 "종이 판+잉크 보더+종이 그림자"로 고정, `.btn--secondary`도 자동 보정.
- `flood--yellow/lime` = 잉크 텍스트/잉크 그림자.
- pricing 추천 플랜 뒤 색면, dashboard 히어로 stat, 404 전면 침수에 사용 권장.

### 3-4. 기타
- `.section-numbered` + `.section-num`(`--outline` 변형) — 초대형 워터마크 섹션 번호.
- `.display-mega`, `.text-outline`(스트로크 타이포, 미지원 브라우저 솔리드 폴백) — 404 숫자·히어로에.
- `.hover-shadow-blue/pink/lime/yellow` — hover 시 그림자색 스왑 (`.card--hover`와 병용).
- `.panel--raised` — 패널+하드섀도. `.alert--accent` — 핑크 알럿 변형.
- `.mobile-nav__link`(+`__num`) — 모바일 드로어 내 대형 내비 링크.
- 칸반 키보드 대안: 카드 foot에 `<button data-kanban-move="-1" aria-label="이전 열로 이동">←</button>` / `"1"` → app.js가 이동+라이브 리전 안내. **kanban.html 카드 전부에 넣을 것.**
- 별점 `[data-rating]`: JS가 radio/aria-checked/방향키 자동 생성 — 마크업 그대로, `aria-label="별점 선택"`만.
- `.btn-group`에 `data-toggle-group` 붙이면 aria-pressed 자동 동기화.
- 테이블 체크박스: `<th class="table__check"><input type="checkbox" data-select-all aria-label="전체 선택">` — 인라인 appearance 핵 금지(table.css가 정식 스타일).

## 4. app.js 변경 (페이지가 알아야 할 것)
- 내장 문자열 전부 한국어화(토스트 기본 "알림", 복사 "복사됨!", 캐러셀 dot "N번째 슬라이드로 이동"+aria-current, 커맨드 토스트 "명령 실행"). **cmdk의 `data-command-item` 값도 한국어로 쓸 것**(토스트에 그대로 노출됨).
- `window.NB.announce(msg)` — 스크린리더 라이브 리전 헬퍼 추가.
- 별점 아이콘 SVG의 `stroke="var()"` 버그 수정 완료 — 페이지 인라인 SVG도 같은 규칙: **presentation attr에 var() 금지, `style=""` 또는 currentColor**.

## 5. 페이지 작업 지침 (일관성)
1. 404.html의 깨진 체인링크 SVG `fill/stroke="var()"` → `style=""`로 전환 (dashboard.html 차트도 동일).
2. 보이스 = **선언·명령** 군: 단문, 명사형 종결/명령형 ("부수고. 만들고. 출시하라." 톤). 페이지 내 어체 혼용 금지.
3. 통화 ₩·날짜 "7월 4일 (금)"·시간 "오후 2:30"·국내 결제(카카오페이/토스/현대카드 ··4821). 수치는 어중간하게(₩1,847,200 · 47.3%).
4. 각 페이지 = 장면 1문장 시나리오. pricing 가짜 로고 스트립("Trusted by…") 삭제 → 스탬프 도장식 재해석 또는 제거.
5. 초대형 한글 디스플레이는 `<span>` 줄 분절 + `.display`/`.display-mega`(한글 행간은 시스템이 자동 보정). 404 숫자는 `--text-mega` 스케일로.
6. index.html의 navbar/footer 구조(버거+mobile-nav, 콜로폰 footer, 마퀴)를 페이지에도 밀도 맞춰 이식. raw `.md` 링크 금지.

## 6. 검증 기록 (시스템 레이어)
- SVG attr var() 0건 / href="#" 0건 / onclick 0건 / .md 링크 0건 / 인라인 grid-template-columns 0건 (index+system).
- 폰트 임포트 1곳, Noto Serif KR 제거, keep-all 적용.
- 미사용 토큰: 점화(--ring-blue/pink, --surface-shadow, --color-accent-subtle, --leading-none, 마퀴/스탬프 세트) 또는 삭제(--ring-lime/yellow). 스케일 램프(spacing/z/bp/container)는 `intentional` 주석으로 보존.
- 라이트 1440 전체 육안 확인(포스터 히어로/마퀴/flood/콜로폰 정상, Black Han Sans 실적용). 콘솔 에러 0 (favicon 요청 제외).
