# theme-07-cyberpunk-terminal — 시스템 레이어 변경 노트 (페이지 에이전트용)

> 작성: 시스템 레이어 에이전트 · 2026-07-04
> 대상 파일: tokens.css · semantic.css · base.css · components/*.css · app.js · index.html
> **pages/ 는 건드리지 않았음.** 아래 지침을 9개 페이지에 일관 반영할 것.

---

## 1. 전 페이지 필수 반영 (P0)

### 1-1. FOUC 스니펫 + data-theme 하드코딩 제거
모든 페이지 `<head>` 최상단(스타일시트 링크 앞)에 삽입, `<html lang="ko" data-theme="dark">`의 `data-theme` 속성 제거:
```html
<script>
(function () {
  try {
    var t = localStorage.getItem("ct-theme");
    if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
</script>
```
키는 반드시 `ct-theme` (app.js Theme.KEY와 동일).

### 1-2. CRT 베젤 + OSD (자동 + 마크업 1줄)
`.crt-overlay`가 이제 베젤(모서리 라운딩+가장자리 인광)을 자동 렌더. 각 페이지의
`<div class="crt-overlay" aria-hidden="true"></div>` 안에 OSD 라벨 1줄 추가:
```html
<div class="crt-overlay" aria-hidden="true">
  <span class="crt-overlay__osd">TERM-07 // P31 · 60Hz · SIGNAL OK</span>
</div>
```
문구는 페이지 픽션에 맞게 변주 가능 (404: `SIGNAL LOST`, dashboard: `FEED LIVE` 등). 768px 이하 자동 축소됨.

### 1-3. 스킵 링크 한국어
`CONTENT 로 건너뛰기` → `본문으로 건너뛰기`.

### 1-4. phosphor grain (자동)
`body::after`가 grain을 자동 렌더 (`--noise-opacity` 점화, 콘텐츠 아래 z층 — 대비 영향 없음). 페이지 작업 불필요. 단, 페이지가 자체 `body::after`를 정의하고 있으면 **충돌** — 다른 훅으로 옮길 것.

---

## 2. 씬 엔진 — 페이지별 색 온도 (glow 복붙 제거)

페이지별 radial glow `<style>` 레시피를 삭제하고 공용 엔진으로 교체:
```html
<body data-scene="ops">           <!-- body 또는 섹션에 -->
  <section class="hero">
    <div class="scene-glow" aria-hidden="true"></div>  <!-- position:absolute; 부모는 relative -->
```
채널 배정(semantic.css 정의): 기본(무속성)=hub(시안+마젠타) · `ops`=대시보드(시안) · `grid`=인박스(그린 인광) · `showroom`=상품(마젠타) · `amber`=칸반(앰버 경고등) · `alert`=404(레드 경보). pricing/settings/onboarding/profile은 hub 또는 ops 권장. 알파는 라이트 테마에서 자동 감쇠 — 페이지에서 만지지 말 것.

## 3. 신규 컴포넌트·유틸리티

| 클래스 | 용도 | 사용 예 (index.html 참조) |
|---|---|---|
| `.tile-grid` + `.tile-3~9/-12` + `.tile-tall` | tmux 틸링 그리드(12col, dense). 균질 auto-fill 그리드 대체 | index #components |
| `[data-pane="pane 0:3"]` | 타일 우상단 pane 좌표 스탬프 (장식) | 모든 갤러리 타일 |
| `.section[data-watermark="02"]` | 섹션 배후 초대형 넘버 워터마크 | index 3개 섹션 |
| `.ct-statusline` (+`__seg`, `__seg--session`, `__seg--end`, `__key`, `__val`, `--fixed`) | tmux 세션 바. `data-clock` 넣으면 실시간 시계 | index 히어로 직후 (풀블리드, 컨테이너 밖) |
| `[data-reveal]` | 스크롤 진입 시 CRT 전원 인가(ct-boot-in) 리빌 + 형제 자동 스태거. JS 실패/reduced-motion 시 즉시 표시 | 카드·패널 단위로 부여 (남발 금지, 섹션당 한 무리) |
| `a[data-navline]` | 클릭 시 `> cd ~/pages/...` 명령행 전환 연출 후 이동. cmdk 페이지 이동에는 자동 적용 | index 프로세스 표 CMD 링크. **각 페이지 navbar 링크에도 부여 권장** |
| `.ct-rating__item--half` | 별 반 개 실렌더 (product.html P1: `style="opacity:.55"` 눈속임 교체용). 주의: `.ct-rating`은 row-reverse — 소스 첫 항목이 시각적 맨 오른쪽 | `<span class="ct-rating__item is-filled ct-rating__item--half"></span>` |
| `.clip-corner-sm` | 소형 노치 (배지·칩) | — |
| `.label--ko` | 한글 섞인 캡스 라벨의 자간 완화(0.08em). 영문 시스템 라벨은 기존 `.label` 유지(DNA) | — |
| `.display-ko` | 한글 초대형 디스플레이 전용(행간 1.16). 라틴용 행간(0.98) 한글 직행 금지 | 404 한글 카피 등 |
| `.ellipsis` / `.nowrap` | keep-all 오버플로 방지 (셀·칩·금액) | — |

## 4. 행 hover 스캔 스윕 (자동)
`.ct-table tbody tr:hover`, `.ct-list--interactive/.ct-list--log .ct-list__item:hover`에 좌→우 1회 스캔이 자동 적용(one-shot, 광과민 안전). 페이지 자체 행 hover 스타일이 `background-image`를 덮으면 스윕이 죽으니 확인.

## 5. app.js 변경 (전 페이지 자동 적용)
- SR 문구 한국어화: 토스트 닫기 "알림 닫기", 캘린더 "이전/다음 달", 토스트 기본 "이벤트가 기록되었습니다", 복사 "클립보드에 복사했습니다", 칩 "'X' 제거".
- cmdk: `role="option"` + `aria-activedescendant` 자동 부여. **페이지 cmdk 마크업에도 `role="option"` 명시 + `.ct-cmdk__empty`에 `role="status"` 추가 권장** (index 참조).
- 신규 모듈: `Reveal`, `PressGroup`(.ct-btn-group aria-pressed 단일선택 동기화), `Clock`([data-clock]), `Navline`(`CT.navline(href)`로 호출 가능).
- `html.js` 클래스가 로드 즉시 부여됨 — [data-reveal] 숨김은 이 범위에서만.

## 6. 토큰 변경 요약
- **삭제**: Noto Serif KR 임포트 (화석). base.css @import → tokens.css 단일 @import 통합.
- **신설(tokens)**: `--noise-texture`, `--bezel-radius`, `--leading-heading-ko(1.3)`, `--leading-display-ko(1.16)`, `--tracking-caps-ko(0.08em)`, 키프레임 `ct-boot-in`·`ct-row-scan`.
- **신설(semantic, 다크/라이트 모두 정의됨)**: `--bezel-line/-bloom`, `--osd-ink`, `--noise-blend`, `--watermark-ink`, `--scene-rgb-1/2`, `--scene-glow-a/b`, `--scene-pos-1/2`, 라이트 `--ring-danger` 재정의.
- **점화된 죽은 자산**: `--noise-opacity`, `ct-type`, `--ease-step`, `--corner-cut-sm`, `--ring-danger`, `--leading-display-ko`.
- 계약 불변: 컴포넌트/페이지는 시맨틱 토큰만 소비, SVG 색은 `style=""`/currentColor 경유, 글로우는 장식·대비는 솔리드.

## 7. 페이지 작업 시 주의 (회귀 방지)
1. `:lang(ko) h1~h3` 행간이 1.3으로 상향됨 — 페이지 자체 대형 디스플레이가 라틴 전용이면 `h1.클래스`처럼 **요소+클래스 셀렉터**로 행간을 이겨야 함 (index `h1.hero__display` 참조).
2. 히어로 공식 파괴: "kicker→h1→sub→버튼+radial" 복붙 오프닝 금지. index는 워드마크를 부팅 창이 무는 오버랩으로 깼음 — 각 페이지도 §2 씬 + 자기 구도로 (브리프 §5-③: pricing 추천 플랜 = active pane 등).
3. 자기참조 dev-tool 카피 금지 — index에서 "외부 프레임워크 0, 순수 CSS 토큰" 삭제됨. 세계관 수치(노드·주사율·인광)로 치환할 것.
4. product.html P2 잔여: SVG `stroke="rgb(0,240,255)"` 리터럴 → `style="stroke:var(--color-primary)"` 패턴, `linear-gradient(...#0a0e14...)` 하드코딩 1건 토큰화, 별점 half 마크업 교체, `.pd-thumbs aria-hidden` 정리 — 전부 페이지 몫.
5. 영문 시스템 라벨(UPTIME, boot 로그, `ERR::NO_DATA`)은 DNA — 지우지 말고 약한 페이지(pricing·settings·onboarding)에 밀도를 **올릴 것**. 읽는 본문·aria는 한국어.
