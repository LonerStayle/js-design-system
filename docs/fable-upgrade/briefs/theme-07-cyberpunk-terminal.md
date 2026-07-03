# 감사 브리프 — theme-07-cyberpunk-terminal

> 감사관: 시니어 프로덕트 디자이너 출신 · 감사일 2026-07-04
> 테마 경로: `design-systems/theme-07-cyberpunk-terminal/`
> HTML 10개 (index + pages 9) · CSS 7,413줄 · JS 763줄 · `.ct-*` 클래스 478개
> **총평: 30개 테마 중 상위권 완성도.** DNA가 선명하고 규칙이 코드 주석에 명문화되어 있으며, filler 카피가 사실상 없음. 이 테마의 터미널·영문 로그 미학은 AI 지문이 아니라 DNA 그 자체이므로 절대 "한글화/문서화" 방향으로 순화하지 말 것. 남은 과제는 (a) 서재 관성의 마지막 잔재 1건(미사용 Noto Serif KR import), (b) 페이지 간 반복되는 hero 공식·균질 카드그리드 리듬 깨기, (c) 이미 선언만 되어 있는 분위기 토큰(노이즈)을 실제로 켜서 CRT 밀도를 한 단계 끌어올리기.

---

## 1. DNA 요약

**정체성 한 문장**: 딥 보이드(#070A0F) 위에 네온 시안 `#00F0FF`·마젠타 `#FF2BD6`가 발광하는 CRT 터미널 — 전면 모노스페이스, 직각(radius 0)+clip-path 노치, 스캔라인·비네팅·글리치·부팅 시퀀스가 시그니처인 하이테크 콘솔 미학.

**코드에 명문화된 강제 규칙** (구현 시 반드시 보존):
- **"글로우는 장식, 가독성은 솔리드 색"** — `tokens.css:7-9` 헤더 주석, `tokens.css:116-118` (EFFECTS 주석 "Decorative only — never the only thing carrying meaning or legibility"), `base.css:132` (".neon — DECORATION ONLY"). 대비 4.5:1↑는 항상 솔리드 색이 단독 충족.
- **광과민 안전** — `tokens.css:272-278` 키프레임 헤더: "no animation flashes faster than 3x/sec". 커서 블링크 1.06s(≈1Hz), 글리치는 호버 시 1회성(`button.css:129-134` "not a repeating strobe"), 플리커는 진폭 ±1.5%.
- **reduced-motion 전역 킬스위치** — `base.css:431-443` + `app.js:21` `REDUCED` 분기(타이핑/부팅/스크램블 즉시 최종 상태).
- **포커스 링 절대 제거 금지** — `tokens.css:222-224` "FOCUS RING — neon, always visible, never removed", `base.css:228-235` 전역 `:focus-visible` 네온 링.
- **토큰 3레이어 계약** — `semantic.css:5-7` "Components consume ONLY these semantic tokens, never the raw ramps". 실제로 컴포넌트 CSS에 하드코딩 헥스 0건(“base.css 마스크용 #000” 2건 제외).
- **형태**: radius 0 기본(`tokens.css:204-213`), 아바타/토글만 `--radius-full`, `--corner-cut` clip-path 노치. 카드 = 터미널 윈도우 크롬(상단 바 + 점 3개, `card.css`).
- **라이트 테마 = "고대비 반전 터미널"** (`semantic.css:164-167`) — 밝은 인광 종이 + 근검정 텍스트 + 네온 보더 유지. 크림/종이 감성이 아니라 반전 CRT라는 점이 핵심.

**주의**: 이 테마에서 영문 대문자 라벨(UPTIME, SEARCH, EXPORT, `kernel.panic`, `ERR::NO_DATA`)과 로그/명령행 픽션은 **DNA이지 dev-tool 영문 남발 지문이 아님**. 본문 설명·에러 메시지·리뷰 등 읽는 텍스트는 이미 한국어로 잘 분리되어 있음(이 이중 구조를 유지·강화할 것).

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 세계관 몰입형 콘텐츠 — filler 카피 제로에 가까움
- `pages/product.html` 전체가 백미. "NEURAL UPLINK MK-IV" 넷러너 하드웨어 스토어 픽션: 인라인 SVG 와이어프레임 제품 렌더 4종(정면 3/4·후면 I/O·분해도·ACTIVE HUD, `product.html:228-372`), 시리얼 각인 텍스트(`SN:: NU4-7F2A-Δ`, :301), ICE 방화벽·9.1Tbps 스펙표(:545-563), 넷러너 말투의 실감나는 한국어 리뷰 4건(:615-664, "앰버 컬러웨이 실물 깡패").
- `pages/404.html:230-260` kernel.panic 터미널 카드 — 로그 4줄 + stacktrace.log 코드블록 + trace_id 푸터. 404 페이지가 세계관 오브제로 기능.
- `pages/dashboard.html:554-561` 이벤트 스트림 — "deploy api@2.6.3 카나리 12% 트래픽 라우팅" 같은 실무 냄새 나는 데이터.
- **증폭 방향**: 이 픽션 밀도를 pricing·onboarding·settings에도 균일하게 퍼뜨릴 것(현재 이 3개 페이지는 상대적으로 표준 SaaS 카피).

### ② 토큰·접근성 규율이 실측 기반
- CHECKLIST.md §2.1에 실제 대비 계산값 표(18.57:1 등), 4.5 미만 3건을 토큰 조정으로 보정한 기록까지 있음.
- SVG `var()` 렌더 버그 7건을 이미 `style=""` 방식으로 전수 수정(`CHECKLIST.md:86`, `dashboard.html:258-358`에서 검증 — `style="stroke:var(--color-primary)"` 패턴 준수).
- 커스텀 컨트롤 전부 `:focus-visible` 네온 링 명시(`forms.css:545,610,393` 등 21곳).
- **증폭 방향**: 이 규율은 그대로 두고 건드리지 말 것. 재고도화 중 새로 넣는 요소도 같은 계약(시맨틱 토큰만, SVG는 style 속성)을 따라야 함.

### ③ 시그니처 모션 시스템이 이미 '엔진'으로 존재
- 부팅 시퀀스(`index.html:144-150` `data-boot`), 타이핑(`data-typing`), 스크램블(`404.html:208` `data-scramble`), 호버 1회성 RGB 글리치(`button.css:129-134`), 404 RGB-split 상시 글리치(`404.html:84-125`, reduced-motion 정지 처리 완비), ASCII 게이지·braille 스피너(`dashboard.html:424-443`), 로딩 스캔 스윕(`button.css:150-166`).
- 전부 data-attribute 구동이라 페이지 추가 비용이 낮음.
- **증폭 방향**: 이 모션 어휘를 '페이지 전환/섹션 진입'까지 확장(아래 §5-3).

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 지문 A — 미사용 Noto Serif KR @import (서재 관성의 화석) 【최우선 제거】
- `tokens.css:15`:
  ```css
  @import url("https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;600;700&display=swap");
  ```
- **Noto Serif KR 4웨이트가 통째로 import되지만 사용처 0건** (전체 grep 확인: `serif` 매치가 이 줄뿐). 터미널 테마에 세리프가 낄 자리가 없는데 30개 테마 공통 보일러플레이트가 그대로 남은 것 — 전형적 AI 지문이자 폰트 페이로드 낭비(수백 KB). `family=Noto+Serif+KR...` 부분만 삭제.

### 지문 B — 모든 페이지가 같은 hero 공식·같은 radial-glow 레시피
- `index.html:29-37` `.hero__glow`: `radial-gradient(60%..at 20% 0%, cyan .14) + radial-gradient(50%..at 90% 30%, magenta .12)`
- `pages/pricing.html:23-44` `.pr-hero` — kicker(label)+h1+sub+토글, 동일 구조·동일 glow 레시피.
- `pages/404.html:32-38` `.e404__glow` — radial 3개로 색만 바꾼 같은 패턴.
- `pages/dashboard.html:39-41` `.ops__main` 배경 — 역시 radial 2개.
- 개별로는 준수하지만 **10페이지가 전부 "왼쪽 정렬 kicker → 대형 h1 → muted 서브 → 버튼 2~3개 + 모서리 radial glow"라는 한 가지 오프닝**으로 시작. 예측 가능한 리듬 = AI 티. (해법은 §5-1, §5-2)

### 지문 C — 균질 카드그리드 진열
- `index.html:59` `.demo-grid { grid-template-columns: repeat(auto-fill, minmax(320px,1fr)) }` + `.gallery-card` 전부 동일 패딩·동일 보더 — 컴포넌트 갤러리라 어느 정도 불가피하나, 카드 크기 위계가 전무(버튼 카드와 카드 카드가 같은 무게).
- `pages/404.html:135-139` empty-grid, `product.html:680` related grid-4 — 전부 같은 minmax 공식. 밀도·스팬 변화(2칸 카드, 세로 2칸 등)가 한 번도 없음.

### 지문 D — 스크린리더 문구에 영문 잔재 (국내용 제품 기준)
- `app.js:284` `aria-label="Dismiss notification"` (토스트 닫기)
- `app.js:704,706` `aria-label="Previous month"` / `"Next month"` (데이트피커)
- `app.js` Toast 기본 msg `'Event logged.'` (data-toast 속성이 비었을 때 폴백)
- UI 표면의 영문 라벨은 DNA지만, **보이지 않는 접근성 문구는 사용자 언어(한국어)여야 함**. "알림 닫기", "이전 달", "다음 달", "이벤트 기록됨" 등으로 교체.

### 지문 아님 (오판 주의)
- 크림 톤·세리프 헤딩·리포트 레이아웃: 본문 어디에도 없음. 라이트 테마의 밝은 배경(`#DDE7EC` 계열)은 '반전 인광 터미널' 컨셉으로 DNA에 부합.
- 영문 시스템 라벨/로그: DNA. 오히려 더 밀어붙일 것.

---

## 4. 프로덕션 결함

### P1 — 반드시 수정
1. **미사용 Noto Serif KR 로드** — `tokens.css:15` (§3-A와 동일). 성능 결함이기도 함.
2. **별점 4.5 표기가 불투명도 눈속임** — `product.html:417` 및 `:580` `<span class="ct-rating__item" style="opacity:.55"></span>`: 반 개 별을 '55% 흐린 꽉 찬 별'로 렌더 → 시각적으로 5개 만점처럼 보이거나 비활성처럼 보임. `display.css`의 `.ct-rating`에 half 변형(클립/그라디언트 마스크) 추가하고 마크업 교체. aria-label(4.5점)은 이미 정확하므로 시각만 고치면 됨.
3. **스크린리더 영문 문구** — `app.js:284, 704, 706` + Toast 폴백 msg (§3-D).

### P2 — 수정 권장
4. **product.html SVG 일러스트의 하드코딩 네온 리터럴** — `stroke="rgb(0,240,255)"`·`rgb(255,43,214)`·`rgb(255,176,0)`·`rgb(57,255,20)`이 `product.html:235-239, 251-253, 264, 277-281, 292-301, 314-318, 335, 348-369, 389-398, 683, 693, 704, 714`에 반복. 렌더는 안전하지만(속성에 var() 안 씀 — 그 점은 옳음) 토큰 우회라 브랜드 색 교체 시 전파 안 됨. **`stroke` 속성 → `style="stroke:var(--color-primary)"` 또는 부모 `g`에 `style="color:...someVar"` + `stroke="currentColor"` 패턴으로 교체** (dashboard.html:258이 이미 쓰는 정석 패턴). ⚠️ SVG presentation 속성에 `var()` 직접 기입은 알려진 렌더 깨짐 버그 — 반드시 style 속성 또는 currentColor 경유.
5. **페이지 레벨 하드코딩 헥스 2건** — `product.html:43` `var(--ink-900, #0a0e14)`(폴백이라 무해하나 불필요), `:170` `linear-gradient(160deg, #0a0e14, var(--ink-1000))`(진짜 하드코딩). `var(--ink-900)`으로 통일. (원시 램프 직접 사용은 페이지 style 블록이라 계약 위반은 아니지만 semantic 토큰 `--color-bg-2` 계열 권장.)
6. **`.pd-thumbs` aria-hidden 속 실버튼** — `product.html:387-399`: 컨테이너 `aria-hidden="true"` 안에 클릭 가능한 `<button tabindex="-1">` 4개. 키보드 함정은 없지만 마우스 전용 기능이 AT에서 완전 부재. 캐러셀 dots와 중복 컨트롤이므로 현행 유지도 가능하나, 고도화 시 dots를 썸네일로 통합해 정식 tablist로 승격 권장.
7. **base.css:49 전역 `:focus { outline:none }`** — `:focus-visible` 링이 `base.css:228-235`의 `:where()` 목록으로 보완하지만 목록 밖 요소([contenteditable], summary 외 커스텀 포커서블)는 링이 없어질 수 있음. `:focus:not(:focus-visible) { outline:none }` 패턴으로 좁히면 안전.

### P3 — 기록 (수용 가능/확인 요망)
8. **선언만 되고 안 쓰는 분위기 토큰** — `--noise-opacity`(`tokens.css:144`) 사용처 0, `@keyframes ct-type`(`tokens.css:287`) 사용처 0(타이핑은 JS가 담당). 죽은 토큰이지만 §5-2에서 노이즈 레이어를 실제로 켜는 것으로 해소 권장.
9. **`color-mix()` 4건**(`card.css:268,380` 등) + `:has()`·`backdrop-filter` — README §10에 모던 브라우저 전제 명시돼 있어 수용.
10. **crt-overlay `z-index: 9999`가 modal(1500)·toast(1700) 위** — 의도된 'CRT 유리층'. 다만 vignette(`base.css:199-204`)가 라이트 테마 모달 가장자리 대비를 미세하게 깎을 수 있음 — 라이트 모달 스크린샷 1회 확인 요망.
11. 캐러셀/스텝 전환 일부가 페이지 인라인 스크립트 의존(`CHECKLIST.md:102`, `product.html:742-762`) — 동작엔 문제 없으나 시스템화 여지.
12. 검증 완료 사항(재확인 불필요): SVG 속성 var() 0건, CSS 중괄호 균형, 깨진 내부 링크 0건, 모달/드로어/⌘K 포커스 트랩·ESC·복원, 테이블 `aria-sort`, 캐러셀 키보드 화살표(`app.js:454`).

---

## 5. 대담화 기회 (프로 디자이너라면 밀어붙일 지점)

### ① "CRT 하드웨어 베젤" — 페이지 자체를 모니터로 만들기 【한 방】
현재 스캔라인+비네팅은 있지만 화면이 '평면 웹페이지 위 필터' 느낌. 뷰포트 가장자리에 **미세한 배럴 왜곡을 암시하는 코너 라운딩 + 인광 잔상(가장자리 1px 시안 블룸) + 상단 `TERM-07 // 1920×1080 @60Hz` 같은 OSD 라벨**을 가진 고정 베젤 프레임(`body::after` 또는 `.crt-overlay` 확장)을 추가. 404는 이미 `hud-corners`(`404.html:193-194`)로 비슷한 시도를 함 — 이걸 전 페이지 공통 시그니처로 승격. reduced-motion·`pointer-events:none` 계약 유지.

### ② 선언만 된 노이즈/글로우를 실제로 켜고, 페이지별 '방송 채널' 분위기 차별화
- `--noise-opacity`(tokens.css:144)를 소비하는 정적 노이즈 레이어(SVG feTurbulence data-URI 배경)를 `.crt-overlay`에 추가 — CRT 입자감이 즉시 산다.
- 페이지마다 glow 레시피가 복붙(§3-B)이므로, **페이지별 시그니처 색 온도**를 부여: dashboard=시안 우세, kanban=앰버 경고등, inbox=그린 인광, product=마젠타 쇼룸, 404=레드 경보. 각 페이지 `<style>`의 radial 좌표·색만 계열화하면 저비용.

### ③ 구도 파괴 — 터미널 틸링 윈도우 매니저 레이아웃
카드가 전부 균질 그리드에 정렬(§3-C). 터미널 세계관이라면 **tmux/i3 같은 타일링 분할** 이 자연스러운 그리드 파괴 수단:
- index.html 컴포넌트 갤러리를 12-col 위에 **스팬이 제각각인 타일**(버튼 카드 4col, 테이블 카드 8col×2row, 코드블록 세로 2row)로 재배치하고 각 타일 크롬에 `pane 0:1` 식 좌표 라벨.
- hero 터미널 창(`index.html:136-151`)을 h1 텍스트와 **의도적으로 오버랩**(h1 우하단을 창이 물고 올라오는 구도) — 현재는 위→아래 순차 나열.
- pricing 3플랜(`pricing.html:268`)은 추천 플랜을 1.15배 스케일 + 노치 확대 + 마젠타 크롬으로 '선택된 창(active pane)'처럼 띄우기.

### ④ 시그니처 마이크로인터랙션 2개 추가
- **명령행 내비게이션**: ⌘K 팔레트가 이미 훌륭하니, 페이지 이동 시 상단에 `> cd ~/pages/dashboard` 한 줄이 타이핑되고 전환되는 200ms 시퀀스(REDUCED 시 생략). 기존 Typing 모듈 재사용 가능.
- **호버 스캔 하이라이트**: 테이블 행/리스트 행 호버 시 현재의 배경색 변화에 더해 왼쪽에서 오른쪽으로 1회 지나가는 스캔 스윕(`ct-sweep` 재사용, 1회성이라 광과민 규칙 안전).

### ⑤ 부팅 시퀀스의 전 페이지 시스템화
index.html에만 있는 부팅 인트로(`data-boot`)를 각 페이지 진입 시 첫 카드 크롬에 0.4초짜리 초경량 버전(`OK  panel mounted` 1줄)으로 이식 — 세계관 일관성 + 로딩 지각 개선. 이미 `data-boot` 엔진이 있어 마크업만 추가하면 됨.

### ⑥ 라이트 테마를 '앰버 모노크롬 P3 인광' 제2 채널로 격상 (선택)
README §7이 이미 `[data-theme="amber"]` 추가법을 문서화함. 라이트 테마 유지 + 앰버 터미널(호박색 P3 인광 CRT) 테마를 실제로 1개 추가하면 "테마 전환이 곧 데모"가 되는 강력한 쇼케이스. semantic.css 블록 복제 수준의 비용.

---

## 6. 한글 폰트 페어링

**현재 상태** (`tokens.css:149-151`):
```css
--font-mono:    'JetBrains Mono', 'IBM Plex Mono', ui-monospace, 'Cascadia Code',
                'Source Code Pro', 'Roboto Mono', Menlo, Consolas, 'Liberation Mono',
                "Nanum Gothic Coding", "Noto Sans KR", monospace;
--font-display: 'Share Tech Mono', 'JetBrains Mono', 'IBM Plex Mono', ui-monospace,
                "Nanum Gothic Coding", "Noto Sans KR", monospace;
```
- 한글 1순위 = **나눔고딕코딩(Nanum Gothic Coding)** — 한글 지원 고정폭 코딩 폰트로, 라틴 모노(JetBrains Mono)와 섞였을 때 터미널 결이 유지됨. **테마 DNA에 정확히 부합하는 페어링 — 보존.**
- 한글 2차 폴백 = Noto Sans KR(로드됨, `tokens.css:15`) — 정당한 안전망. 보존.
- 디스플레이 = Share Tech Mono(`base.css:10`에서 import) + 동일 한글 폴백. 보존.
- **문제는 단 하나: 로드만 되고 안 쓰는 Noto Serif KR** (§3-A / §4-P1-1). 페어링 교체가 아니라 **import 제거**가 조치.
- (선택) 대담화 여지: 헤드라인 한정으로 한글 각진 디스플레이 폰트(예: 검은고딕/Black Han Sans 계열)를 `--font-display` 한글 슬롯에 실험할 수 있으나, 나눔고딕코딩의 고정폭 정합성이 이 테마에선 더 가치 있으므로 필수 아님. 기본은 현행 유지.

---

## 구현 에이전트 작업 순서 제안
1. §4-P1 3건 (serif import 제거 → 별점 half 렌더 → aria-label 한국어화)
2. §4-P2 4건 (product SVG 토큰화 — style/currentColor 패턴 필수, 하드코딩 헥스, focus 패턴)
3. §5-② 노이즈 레이어 + 페이지별 색 온도 (죽은 토큰 해소와 동시)
4. §5-① CRT 베젤, §5-③ 타일링 구도, §5-④⑤ 모션 — 각 단계마다 광과민(3Hz↓)·reduced-motion·대비 4.5:1 계약 재검증
5. CHECKLIST.md 갱신 (변경분 실측 재기록)
