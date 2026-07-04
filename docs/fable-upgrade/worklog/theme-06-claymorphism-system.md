# theme-06 Claymorphism — 시스템 레이어 고도화 워크로그

> 대상: tokens/semantic/base/theme.css · components/*.css · index.html · app.js
> pages/ 는 건드리지 않음. 이 문서는 **페이지 에이전트가 일관 반영할 지침** 중심.

---

## 1. 새/변경 토큰 (pages 에서 이걸 써야 함)

### 색·전경 (semantic.css)
- `--color-ring` : 이제 **솔리드** 바이올렛(light `--violet-500` / dark `--violet-400`). 반투명(.55) 링은 대비 1.7:1 미달이라 교체. 포커스 링은 **outline 채널**로 그린다(아래 §3).
- `--color-on-clay-vivid` (#fff) : violet-500/sky-600/danger 등 **딥 캔디 표면 위 흰 글자**. 페이지에서 유채색 클레이 위 흰 텍스트는 `#fff` 하드코딩 대신 이걸 쓸 것.
- `--color-on-coral` (#4d1308) / `--color-on-mint` (#053220) : 밝은 코랄/민트 위 딥 동색 글자(AA).
- `--code-chrome` (#b7afd0) / `--code-comment` (#6f6790) : 코드블록 크롬/주석색.

### 조판 — 한글 (tokens.css) — base.css 의 `:lang(ko)` 레이어가 자동 소비
- `--leading-heading-ko: 1.32` · `--leading-display-ko: 1.14` · `--leading-body-ko: 1.72`
- `--tracking-caps-ko: 0.06em` · `--tracking-display-ko: 0` (Jua 는 음수 자간 금지)
- **자동 적용됨** — 페이지는 `<html lang="ko">`만 유지하면 keep-all·행간·faux-bold 억제가 전부 걸린다.

### 형태·모션 (tokens.css)
- `--radius-blob-a / -b / -c` : 비대칭 blob 반경 3종. `clay-morph` 키프레임이 이 사이를 오간다.
- `--press-squash: scale(1.06, 0.9)` · `--press-squash-sm: scale(1.04, 0.94)` : 클릭 스쿼시.
- `--fx-blob-opacity` (기본 1) : **씬 노브**. 페이지 스코프로 낮추면 배경 블롭이 옅어짐(예: 대시보드 `--fx-blob-opacity:.5` 로 데이터 우선).

### 폰트 (tokens.css)
- `@import` 를 **tokens.css 한 곳으로 통합**(base.css 임포트 제거). 죽은 **Noto Serif KR 제거**, Noto Sans KR 400 만 유지.
- 스택 순서 교정: 라틴무드 → **Jua/Gowun Dodum** → Apple SD Gothic Neo → 제네릭. 페어링(Jua/Gowun Dodum)은 보존.

---

## 2. 새 컴포넌트·유틸리티 (pages 에서 재사용)

### 마스코트 "말랑이" (components/mascot.css — 이제 theme.css 에 import 됨)
```html
<figure class="mascot mascot--lg mascot--float" role="img" aria-label="점토 마스코트 말랑이">
  <span class="mascot__eye mascot__eye--l"></span><span class="mascot__eye mascot__eye--r"></span>
  <span class="mascot__cheek mascot__cheek--l"></span><span class="mascot__cheek mascot__cheek--r"></span>
  <span class="mascot__mouth"></span>
</figure>
```
- 표정: `--happy`(기본) `--wow` `--sad` `--sleep` / 크기: `--sm` `--lg` / 색: `--coral --mint --yellow --sky` / 떠다님: `--float`
- **클릭하면 스쿼시**(app.js initMascots 자동 바인딩). 키보드 인터랙션 없음(role=img, 장식) — 포커스 가능 요소를 안에 넣지 말 것.
- **적극 활용처**: 404, 빈 상태 6종의 아트워크(이모지 금지), 온보딩 스텝 안내자, 로딩 대체. "빈 상태마다 같은 원형 아이콘" 대신 말랑이가 표정으로 연기.

### 유틸리티 (base.css)
- `.clay-blob` : 정원 대신 **숨 쉬는 비대칭 blob**(morph 애니). 장식/썸네일/아트워크의 원형 blob 은 전부 이걸로 교체(감사 ③-3: 코너 원 4개 복붙 금지).
- `.text-sticker` (+ `--coral/--mint/--yellow`) : **부푼 점토 스티커 타이포**. 히어로 헤드라인·거대 숫자(가격/404 "4 0 4")에. 다크 오버라이드 내장.
- `.wiggle-hover` : hover 시 한 번 꿈틀(로고·재미 요소).
- `--press-squash` / `--press-squash-sm` : `:active` 에 넣으면 점토 스쿼시. 버튼·페이지네이션엔 이미 적용됨.

### 별점 (app.js + selection.css) — 이제 **두 모드**
- 입력용: `<div data-rating="4" data-max="5" aria-label="...">` → role=radiogroup + 방향키/Home/End, aria-checked 동기화.
- **표시용(신규)**: `<div data-rating="4.6" data-max="5" data-readonly>` → role=img, **소수점 부분 채움**, 클릭 불가. product 리뷰 평점(4.7 등)은 **반드시 `data-readonly`** 를 붙일 것(감사 ④-4: 표시용이 클릭되던 버그 + 별 개수/aria 불일치 해소).

---

## 3. 인터랙션·a11y 계약 변경 (페이지가 알아야 할 것)

- **포커스 링 = outline 채널**. 예전 box-shadow 링이 컴포넌트 그림자에 덮여 버튼류 포커스가 안 보이던 버그(④-1) 해소. 페이지에서 `:focus`에 `outline:none` 단독 금지, 커스텀 포커스 시 `outline` 유지.
- invalid 필드는 `.field.is-invalid` 만 붙이면 링이 자동 위험색(빨강 outline + 2px 인디케이터). 별도 링 CSS 불필요.
- cmdk 패턴: 리스트 `role="listbox"`, 항목 `role="option"`, 페이지 이동은 `href` 가 아니라 **`data-href`**(app.js 가 이걸 읽음). `<button href>` 무효 마크업 금지.
- 오버레이 안 자동 포커스는 HTML `autofocus` 금지 → **`data-autofocus`**(로드 시 스크롤 점프 방지, app.js openOverlay 가 소비).

---

## 4. 페이지 에이전트 필수 작업 (시스템 레이어가 못 하는 것)

1. **FOUC 스니펫** — 각 page `<head>` 최상단에 index.html 과 동일한 동기 스크립트 삽입 + `<html>` 의 `data-theme="light"` 하드코딩 **제거**. 키는 `clay-theme`.
   ```html
   <script>(function(){try{var t=localStorage.getItem("clay-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
   ```
2. **이모지 아트워크 → CSS/마스코트**(감사 ③-1): product 갤러리 5종·썸네일·빈상태의 ⌨️🖱️🫧 등 전량 교체. 상품 이미지는 clay 부품 일러스트(알약 div + 컬러 클레이 그림자) 또는 `.clay-blob`.
3. **dashboard.html SVG var() 버그**(④-2): `stroke="var(--violet-500)"` / `stop-color="var(--violet-400)"` → `style="stroke:..."` 또는 CSS 클래스로.
4. **rank--2 대비**(④-5): `.rank--2 { background: var(--sky-500) }` → `var(--sky-600)` (흰 글자 4.5:1).
5. **토큰 우회**(④-6): onboarding `var(--dur-2,.18s)` → `var(--duration-fast)`; pricing CTA `#fff`/`rgba(255,255,255,..)` → `--color-on-clay-vivid`.
6. **씬 변주**(③-3): 페이지마다 배경을 다르게 — `--fx-blob-opacity` 낮추기, `.clay-blob` 을 콘텐츠 뒤 -z 로 겹치기, 404 는 기울어진/무너진 씬.
7. **구도**(③-4): dashboard stat 4등분 → 값 중요도 bento(총매출 2×2 + 배경 워터마크 숫자).

---

## 5. 검증 결과 (grep, 시스템 레이어 + index.html)
- SVG presentation-attr var() : index 0건 ✓ (dashboard 는 페이지 담당)
- components/*.css 하드코딩 hex : 0건 ✓
- Noto Serif KR 임포트 : 제거 ✓ / 폰트 @import : tokens.css 1곳 통합 ✓
- keep-all : base.css `:lang(ko)` 레이어 ✓
- 인라인 grid-template-columns / href="#" / raw .md / 이모지(index) : 0건 ✓
- 미정의 토큰 참조 : 0건 ✓ / 죽은 토큰(ring 색 6종·sticker-lift 등) 정리 ✓
- 죽은 키프레임 clay-wiggle : `.wiggle-hover` 로 점화 ✓
- **미확인(브라우저 잠금으로 육안 미검)**: 4뷰포트×2테마 스크린샷, reduced-motion 실측, 대비 실측 — 페이지 에이전트/후속 QA 에서 확인 필요.
