# theme-10-memphis-80s — 시스템 레이어 고도화 노트 (페이지 에이전트용)

> 대상: tokens.css / semantic.css / base.css / components/*.css / app.js / index.html
> pages/*.html 은 건드리지 않았습니다. 아래 계약을 각 페이지에 일관 반영해 주세요.

---

## 1. 폰트 — 스택 순서 교정 + 신규 mega + @import 통합 (중요)

- **@import 를 tokens.css 한 곳으로 통합**했습니다. base.css 상단의 폰트 @import 는 제거했습니다.
  **페이지·컴포넌트에 폰트 @import 를 새로 추가하지 마세요.** (렌더 블로킹 이중 로딩 금지)
- 스택 순서 수정 — 이제 macOS 에서도 Jua/Gothic A1 이 실제로 적용됩니다.
  - `--font-display: "Space Grotesk", "Jua", "Noto Sans KR", system-ui` (숫자·라틴은 Space Grotesk 선점)
  - `--font-body: "Poppins", "Gothic A1", "Noto Sans KR", system-ui`
- **신규 `--font-mega`** = `"Black Han Sans", "Space Grotesk", "Jua"` — 초대형 포스터/디스플레이 한 방 전용.
- Noto Serif KR 임포트는 완전 제거(미사용 화석).

## 2. 한글 조판 레이어 (base.css 하단) — 페이지는 `lang="ko"` 만 지키면 자동 적용

`:lang(ko)` 로 `word-break:keep-all`, 한글 행간(제목 1.3 / 본문 1.7 / 디스플레이 1.14), 단일웨이트 무드폰트 faux-bold 제거(`font-synthesis-weight:none`), 데이터 tabular-nums, uppercase→none 등이 자동 적용됩니다.
- **모든 페이지 `<html lang="ko">` 필수.**
- 가격·코드처럼 중간개행 금지 토큰엔 `.nowrap` 유틸을 쓰세요.

## 3. FOUC 가드 (모든 페이지 `<head>` 최상단에 추가 필수)

`<html>` 에 `data-theme` 하드코딩하지 말고, 아래 스니펫을 `<head>` 최상단(스타일시트 앞)에 넣으세요.
localStorage 키는 app.js 와 동일한 **`memphis-theme`** 입니다(키가 다르면 안 먹습니다).

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("memphis-theme");
      if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  })();
</script>
```

## 4. 신규 토큰

| 토큰 | 위치 | 용도 |
|---|---|---|
| `--font-mega` | tokens.css | 초대형 포스터 타이포 (Black Han Sans) |
| `--shadow-pop-xl` (10px) | semantic.css | 포스터 블록 등 초강조 오프셋 섀도(다크 자동 반전) |
| `--leading-heading-ko` / `--leading-body-ko` / `--leading-display-ko` | tokens.css | 한글 행간(레이어가 소비, 직접 쓸 일 드묾) |
| `--tracking-caps-ko` (0.08em) | tokens.css | 넓은 한글 라벨 자간 상한 |

## 5. 신규 유틸리티 클래스 (base.css) — 페이지 대담화에 재사용

- **`.poster-word` (+ `--pink/--blue/--yellow/--teal/--cream`)** — 부딪치는 색면 위 초대형 단어 블록.
  각 단어가 자체 solid 블록이라 대비 안전. 겹치기·회전은 부모에서 nth-child 로.
  예) 히어로·온보딩 완료·404 헤드라인:
  ```html
  <h1 class="hero__headline">
    <span class="poster-word poster-word--pink">요란하게.</span>
    <span class="poster-word poster-word--blue">평면적으로.</span>
    <span class="poster-word poster-word--cream">대담하게.</span>
  </h1>
  ```
- **`.ghost-type`** — 채움 없는 초대형 아웃라인 글자(뒤에 깔고 화면 밖 크롭). `aria-hidden` 필수.
- **`.vlabel`** — 세로쓰기(`writing-mode:vertical-rl`) 사이드 라벨. 좁은 화면에선 숨기세요.
- **`.band` / `.band--ink`** — 풀블리드 브레이크 섹션. `band--ink` 는 잉크 홍수(다크에선 크림 홍수로 자동 반전).
  섹션 인트로(`.stack--sm` 안 h1~h3·lead)만 자동 반전되고, 내부 `.card`/`.panel` 은 자기 색 유지.
  스크롤 리듬 브레이크로 페이지당 1회 권장.

## 6. 컴포넌트 결함 수정 — 페이지의 인라인 땜질을 제거하세요

- **`.badge--warning`, `.badge--info` 추가** → `style="background:var(--color-warning);color:..."` 인라인 뱃지 전부 이 클래스로 교체.
- **컬러 stat 카드 delta 자동 색상**: `.stat--blue/--pink/--yellow/--teal .stat__delta` 가 카드 fg 로 자동 대비 처리됨. **`style="color:#fff"` 같은 인라인 델타 색 제거.** 방향은 `▲`/`▼` 글리프로(색맹 안전).
- **`fill-*` 블록 안 헤딩 색 상속**: `fill-blue` 등 위 h1~h6 이 자동으로 블록 fg 를 상속(다크에서 죽던 헤딩 대비 해소). 인라인 `color:#fff` 불필요.
- **skeleton**: 그라디언트 샤인 → 흐르는 캔디스트라이프로 교체됨(코드 변경 불필요, 그대로 `.skeleton*` 사용).

## 7. ARIA / 인터랙션 (app.js 가 처리 — 마크업만 맞춰주면 이상적)

- **세그먼트 컨트롤**: app.js 가 `role="radiogroup"` + 자식 `role="radio"` + `aria-checked` + 방향키/Home/End 로 정규화합니다. 레거시 `aria-selected` 마크업도 런타임에 자동 교정되지만, **신규 마크업은 아래 정본으로**:
  ```html
  <div class="segmented" data-segmented role="radiogroup" aria-label="…">
    <button class="segmented__option" role="radio" aria-checked="true"  data-value="a">A</button>
    <button class="segmented__option" role="radio" aria-checked="false" data-value="b">B</button>
  </div>
  ```
  (탭 전환이 아니라 라디오 선택입니다. `role="tablist"`/`aria-selected` 쓰지 마세요.)
- **캐러셀 dots**: 래퍼는 `role="group"`, 활성 dot 은 app.js 가 `aria-current` 부여 + 방향키 지원.
- **숨김 오버레이 autofocus 금지**: `autofocus` 대신 `data-autofocus` 를 쓰세요(app.js 가 포커스 대상으로 인식, 로드 스크롤 점프 없음).
- 커스텀 select 의 `role="option" aria-selected` 는 유효 — 유지하세요.

## 8. 시그니처 모션 (자동 적용 — 페이지가 얻는 것)

- **컨페티 팝**: `.btn--primary` 또는 `[data-confetti]` 클릭 시 멤피스 도형이 튀어나갑니다. reduced-motion 시 완전 미생성.
  온보딩 완료 버튼 등 "축하 순간"에 `data-confetti` 를 달면 클라이맥스가 됩니다.
- **로드 리빌**: `data-reveal` 는 이제 스프링 팝+미세 틸트(범용 fade-up 아님). 그대로 `data-reveal` 부착.
- **커서 반발**: `.hero` 안 `.deco` 가 마우스를 피합니다(허브 한정 로직이지만 `.hero .deco` 구조면 어디서든 동작).

## 9. app.js 문자열 전량 한글화 (페이지가 준수할 표기)

- 캘린더: 제목 `YYYY년 M월`, 요일 `일 월 화 수 목 금 토`. datepicker 입력값 포맷 `YYYY. M. D.` → 필드 placeholder 는 `연도. 월. 일` 식으로.
- 프라이싱 토글: 기간 라벨을 app.js 가 `/월`·`/년` 으로 출력. `data-monthly`/`data-yearly` 는 **₩ 정수 문자열**로 넣으세요.
- 토스트/토스트 리전 aria/select placeholder/복사/명령 팔레트 빈 결과 = 전부 한국어. 페이지에서 영문 기본값 덮어쓰지 마세요.

## 10. 데이터 정합 · 통화

- 통화는 `₩` + 천단위 콤마, 큰 금액은 `₩4.82억` 축약. `$`/`€` 금지.
- 허브(index) 구독자 표 정본: 프로 `₩49,000` · 팀 `₩149,000` · 무료 `₩0`. 요금제/영수증 페이지에서 플랜 가격을 쓰면 이 값과 어긋나지 않게.
- 정렬용 `data-value` 는 표시값과 같은 수치로(예: `data-value="49000"`).

## 11. 남은 프로덕션 이슈 (페이지 담당 — 브리프 #7 반응형)

- `dashboard/kanban/inbox/settings` 의 ≤1024px 에서 `.sidebar{position:fixed;width:4.6rem}` 전환 시 `.app-main` 좌측 여백 보정 누락 의심.
  `.app-main { margin-left: 4.6rem }` 보정 또는 사이드바를 오버레이 드로어로 전환하고 실기기 확인 필요.
- 3-pane(inbox) 축소 시 목록↔읽기 스택 전환 경로 제공.
</content>
</invoke>
