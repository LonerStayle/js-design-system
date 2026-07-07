# theme-16 Pastel Kawaii — 시스템 레이어 고도화 변경 노트 (페이지 에이전트용)

> 대상: tokens/semantic/base/components + index.html + app.js. **pages/ 는 건드리지 않음.**
> 아래 지침을 pages/ 9개에 일관 반영할 것. 핵심만.

---

## 1. 폰트 · FOUC (P0 — 전 페이지 필수)

- **Noto Serif KR 임포트 삭제됨** + **폰트 스택 순서 교정**(Jua/Gowun Dodum 을 system-ui 앞으로). tokens.css 에서 처리. 페이지는 재추가 금지.
- **FOUC 스니펫**: 각 페이지 `<head>` 최상단(뷰포트 meta 직후)에 아래 삽입 + `<html>` 의 하드코딩 `data-theme="..."` **제거**. 키는 반드시 `kawaii-theme`(app.js 와 동일).
  ```html
  <script>
  (function(){try{var t=localStorage.getItem("kawaii-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
  </script>
  ```

## 2. 신규/변경 토큰

| 토큰 | 위치 | 용도 |
|---|---|---|
| `--pattern-dots-dark`, `--pattern-gingham-dark` | tokens.css | 다크용 패턴 원시값 |
| `--bg-pattern`, `--bg-gingham` | semantic.css (라이트/다크 각각) | **패턴은 이 시맨틱 토큰만 쓸 것.** 다크에서 자동 스왑 |
| `--code-bg`, `--code-fg`, `--code-border` | semantic.css | 코드블록 색 (라이트/다크) |

- **다크 패턴 결함(④-10) 해소**: `.bg-dots` / `.bg-gingham` / `.surface-soft` / `.dropzone` 는 이미 `--bg-pattern`/`--bg-gingham` 경유로 바뀜. 페이지에서 `var(--pattern-dots)` **직접 참조 금지** → `.bg-dots` 클래스나 `--bg-pattern` 사용.

## 3. 신규 유틸리티 · 시그니처 클래스 (base.css)

- **밤하늘 별사탕(다크 전용 배경)**: 각 페이지 `<body>` 바로 아래 삽입.
  ```html
  <div class="starfield" aria-hidden="true"></div>
  ```
  라이트에선 `display:none`, 다크에서만 트윙클. reduced-motion 자동 정지.
- **커서 별가루 트레일 · 모티프 버스트**: app.js 전역. 페이지 마크업 불필요. (버스트가 이제 단색사각형→하트/별/반짝이 SVG)
- **젤리 로고타입**: 초대형 한글 제목에 음절별 span.
  ```html
  <h1 class="display"><span class="jelly"><span class="j">둥</span><span class="j">근</span> …</span></h1>
  ```
  음절 사이 공백은 텍스트노드(스페이스), 한 어절 안 span 은 붙여쓰기. 호버 시 개별 pop.
- **물결 밑줄**: `<span class="squiggle">통통</span>` — 강조 단어에 1회만.
- **다이컷 스티커**: `.diecut`(흰 4px 외곽선+그림자), 기울기 `.tilt-l`(-4°)/`.tilt-r`(5°)/`.tilt-sm`(-2°). 카드·배지에 스티커북 느낌 부여할 때.
- **히어로 스티커북 구도**(index 참고): `.hero-kawaii > .container.section > .hero-grid( .hero-copy | .hero-stage )`. `.hero-stage` 안에 `.mascot-hero` + `.fact-sticker.fs-1/.fs-2/.fs-3`(기울어진 오버랩). ≤560px 자동 스택.
  - `.fact-sticker` 구조: `<div class="fact-sticker fs-1"><div class="fact-num">6색</div><div class="fact-label">파스텔 램프</div></div>`

## 4. 마스코트 컴포넌트 (display.css `.mascot`) — 이모지 아트워크 대체

이모지(🐰🧸🎀 / 📊🗂️✉️ 등)를 **자체 SVG 마스코트/아이콘**으로 교체할 것. 파트 색은 CSS 클래스로만(SVG attr 에 var() 금지).
표정: `data-exp="happy|wow|sad"` (기본 happy). **404·빈 상태 = `sad`**, 상품/축하 = `happy`.

```html
<svg class="mascot" viewBox="0 0 200 220" aria-hidden="true" data-exp="sad">
  <ellipse class="m-ear" cx="72" cy="48" rx="16" ry="44" transform="rotate(-13 72 48)"/>
  <ellipse class="m-ear" cx="128" cy="48" rx="16" ry="44" transform="rotate(13 128 48)"/>
  <ellipse class="m-ear-in" cx="72" cy="52" rx="7" ry="27" transform="rotate(-13 72 52)"/>
  <ellipse class="m-ear-in" cx="128" cy="52" rx="7" ry="27" transform="rotate(13 128 52)"/>
  <circle class="m-body" cx="100" cy="132" r="72"/>
  <ellipse class="m-blush" cx="67" cy="142" rx="13" ry="9"/>
  <ellipse class="m-blush" cx="133" cy="142" rx="13" ry="9"/>
  <!-- 표정 그룹(원하는 것만 둬도 됨; data-exp 로 하나만 표시) -->
  <g class="exp exp-happy m-face"><path d="M72 126 l9 -9 9 9"/><path d="M110 126 l9 -9 9 9"/><path d="M84 150 q16 15 32 0"/></g>
  <g class="exp exp-wow m-face"><circle cx="81" cy="121" r="6"/><circle cx="119" cy="121" r="6"/><ellipse cx="100" cy="151" rx="7" ry="9"/></g>
  <g class="exp exp-sad m-face"><path d="M74 118 q7 6 14 2"/><path d="M112 120 q7 -4 14 2"/><path d="M86 154 q14 -12 28 0"/></g>
  <path class="m-star" d="M100 182 l4.5 9.5 10.5 1 -8 7 2.5 10.5 -9.5 -5.5 -9.5 5.5 2.5 -10.5 -8 -7 10.5 -1z"/>
</svg>
```
- 404.html 의 `.es-art` face 슬롯, 빈 상태 4종, product 갤러리 이모지를 이걸로 교체. 크기는 부모 width 로 제어(`.mascot{width:100%}`).

## 5. a11y 패턴 통일 (전 페이지 마이그레이션 필수)

- **Segmented**: `role="tablist"`(탭 없음)·`role="group"`+`aria-selected` 전부 아래로 교체.
  ```html
  <div class="segmented" role="radiogroup" aria-label="...">
    <button role="radio" data-value="day" aria-checked="true">일</button>
    <button role="radio" data-value="week" aria-checked="false">주</button>
  </div>
  ```
  app.js `initSegmented` 가 role 자동 감지(radio→aria-checked)·roving tabindex·←→↑↓/Home/End 처리. CSS 는 aria-checked/selected/pressed 모두 지원(활성 스타일 유지). `segmented:change` 커스텀이벤트 유지(빌링 토글 훅).
- **Rating(별점)**: `role="slider"` 제거 → radiogroup.
  ```html
  <div class="rating" role="radiogroup" aria-labelledby="lbl" data-value="4">
    <button role="radio" class="is-on" aria-checked="false" aria-label="1점"></button>
    … <button role="radio" class="is-on" aria-checked="true" aria-label="4점"></button>
    <button role="radio" aria-checked="false" aria-label="5점"></button>
  </div>
  ```
  선택값 버튼에만 `aria-checked="true"`. app.js 가 클릭/←→/Home/End 처리·roving tabindex. 표시전용은 `data-readonly` + `role="img"`(인터랙션 금지).
- **테이블 정렬 th**: 내용을 `<button class="th-sort">` 로 감싸고 th 에 `aria-sort="none"`.
  ```html
  <th class="sortable" aria-sort="none"><button type="button" class="th-sort">금액 <span class="sort-ic" aria-hidden="true">▲</span></button></th>
  ```
  app.js 가 버튼 클릭(=키보드 Enter/Space 네이티브) 으로 정렬 + aria-sort 갱신.
- **알림/배너 닫기**: `.alert`/`.banner`(또는 `[data-dismissable]`) 안에 `.alert-close`(또는 `[data-dismiss]`) 버튼 두면 app.js 가 자동 제거. dashboard 의 죽은 alert-close(④-8) 이제 동작.
- **캐러셀 dots**: `.carousel-dots` 에 `aria-hidden="true"` 붙이지 말 것(④-4). 내부가 실제 `<button>` 이므로 SR 에 보여야 함.
- **모달/드로어 포커스 트랩**: app.js `openOverlay` 가 자동으로 Tab 순환 트랩+ESC+포커스 복원(요소별 WeakMap). 표준 오버레이 마크업+`data-modal-open/close`·`data-drawer-open/close` 만 쓰면 됨. 별도 코드 불필요.

## 6. SVG var() 렌더버그 (④-1 — 페이지에 8곳 남음, 반드시 수정)

브리프 목록: dashboard:286 · settings:214,625 · inbox:405,466,471,519 · profile:204.
`fill="var(--x)"`/`stroke="var(--x)"` → **`currentColor`+부모 color** 또는 **`style="fill:var(--x)"`**. (index 의 스티커 1곳은 currentColor 로 수정 완료 — 부모 `.card .sticker{color:var(--pink-500)}` 상속.)

## 7. 탈지문 · 카피 (전 페이지)

- **eyebrow 는 이제 기울어진 스티커 칩**(대문자/영문 키커 아님, ::before 반짝이 자동). 영문 eyebrow(404 의 "Oops·…","Empty States" 등) → **한글 라벨**로. uppercase 의존 금지.
- **자기참조 dev-tool 카피 제거**: "60+ 컴포넌트 / 0 의존성 / 프로덕션급 / 순수 CSS·바닐라 JS / 외부 프레임워크 0개" 류 전부 삭제(index 는 완료). 필요 시 세계관 카피로.
- **raw .md 링크 제거**: navbar "문서"→README.md, footer README/CHECKLIST 링크 전부 제거/인페이지 앵커로(index 완료).
- **깨진 앵커/토큰(④-3)**: 404 의 `../index.html#orders`,`#settings` → 실존 앵커(#tokens/#components/#pages) 또는 실페이지로. `--radius-3xl`(미존재) → `--radius-2xl`.

## 8. 카피 정본 (교차 페이지 정합)

- 세계관 = **모찌상점**(큐트 굿즈 스토어). 어체 = **다정·환대 해요체**(§5-C '님' 호칭, 의성·의태어 허용). 한 페이지 단일 어체.
- index 히어로 훅: **"둥근 모든 것이 / 통통 튀어요"** (강한 훅은 여기 1곳만 — 다른 페이지에서 반복 금지).
- index 팩트 스티커: `6색 파스텔 램프` · `하트·별·반짝이 모티프` · `대비 4.5:1↑`.
- 통화 `₩`+콤마, 날짜 상대표현('방금 전'·'어제') 권장. 가격이 pricing/inbox(영수증)/billing 에 등장하면 **완전히 동일 값**으로.

## 9. 검증 통과 현황 (index/시스템)

grep 0건: SVG var() · 인라인 grid · raw .md · href="#" · 서구권 filler · 컴포넌트 하드코딩 hex · Noto Serif. keep-all 존재. 육안: 라이트/다크/360px 히어로·폼·별점 OK, 콘솔 에러 0. 죽은 토큰 `--z-cursor` 점화(커서 트레일), `--border-3` 점화(다이컷).
