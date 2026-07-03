# 감사 브리프 — theme-22-comic-pop-art (코믹 팝아트)

> 감사일: 2026-07-04 · 감사관: 시니어 프로덕트 디자이너 출신 감사관
> 대상 경로: `design-systems/theme-22-comic-pop-art/`
> 파일 구성: CSS 9 (tokens/semantic/base/theme + components 5) · JS 1 (app.js 868줄) · HTML 10 (index + pages 9)
> **이 문서만 보고 구현 에이전트가 작업할 수 있도록 파일:라인 근거를 명시했다.**

---

## 1. DNA 요약

**정체성**: 미드센추리 만화책 + 로이 리히텐슈타인 팝아트. "만화책의 한 페이지(single panel)"가 무드 선언 — 시끄럽고, 과장되고, 손으로 잉크칠한 느낌. 차분한 미니멀리즘의 정반대.

**여섯 가지 시그니처 무브** (README.md:13-23에 명문화):
| 무브 | 구현 위치 |
|------|----------|
| 두꺼운 검정 외곽선 (3–4px, 모든 표면) | tokens.css:144-147 `--comic-outline*`, 238-244 `--border-*` |
| 벤데이 하프톤 도트 | tokens.css:88-113 `--halftone-*`, base.css:173-195 |
| 말풍선 (둥근 몸통 + 잉크 꼬리) | base.css:253-287 `.speech-bubble` |
| 생각풍선 (필 + 퍼프 트레일) | base.css:289-312 `.thought-bubble` |
| 액션 버스트 (POW! 별) | tokens.css:131-136 `--action-burst` clip-path, base.css:317-350 `.burst` |
| 스피드 라인 (방사/수평 해칭) | tokens.css:115-129 `--speed-lines/-streaks`, base.css:197-220 |

**명시된 금지·필수 규칙** (tokens.css:7-10, README.md:9, 24):
- **금지**: 그라데이션, 소프트/블러 그림자, 얌전한 파스텔 ("No gradients, no soft shadows, no timid pastels")
- **필수**: 그림자는 하드 오프셋 잉크(`5px 5px 0 #000`, blur 0 — tokens.css:247-259), 모션은 overshoot 팝/바운스(`cubic-bezier(.2,1.6,.4,1)` — tokens.css:306-310), 절대 느리고 부드럽게 이징하지 않음
- **컬러**: 플랫 프라이머리 잉크만 — Comic Red `#E8222B` / Pop Yellow `#FFD400` / Comic Blue `#1E6FE8` + 잉크 검정/종이 흰색
- **타이포 규칙**: 코믹 레터러 디스플레이체(Bangers/Luckiest Guy)는 타이틀·액션워드 전용, 본문은 절대 코믹체 금지(README.md:26)
- **다크모드 규칙**: `--ink`가 흰색으로 반전되어 패널이 검정 배경 위 "오려낸 셀"로 읽히게 함(semantic.css:215-219)

**주의**: 이 테마의 하프톤·종이 질감·인쇄 미학은 AI 지문이 아니라 DNA 그 자체다. 걷어낼 대상이 아니라 '프로 스튜디오 인쇄물' 수준으로 밀어붙일 대상.

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 모티프의 완전한 토큰화 — 시스템 설계가 프로급
하프톤·스피드라인·버스트·말풍선이 전부 재사용 가능한 CSS 토큰/유틸리티로 추상화되어 있다. `--halftone-color/-bg/-size`만 오버라이드하면 표면별 하프톤 리컬러가 되고(tokens.css:88-98), `--action-burst`는 clip-path 폴리곤 토큰(tokens.css:131-136), `.burst-wrap .burst-ink`로 clip-path에 테두리를 못 그리는 한계를 레이어링으로 우회한 것(base.css:332-346)까지 노련하다. **다크모드 "잉크 반전"**(semantic.css:215-219: `--ink:#fff; --paper:#0a0a09`)은 이 테마에서 가장 영리한 결정 — 유지·증폭 대상.

### ② 인터랙션 시그니처가 이미 존재
클릭하면 커서 위치에서 "POW!" 버스트가 터지는 `data-burst`(app.js:47-79), 버튼 hover 시 위로 팝 + 그림자 확대 / active 시 종이에 눌리는 press(buttons.css:35-43), 모달의 `rotate(-1deg)→0` 바운스 등장(feedback.css:138-141), 토스트=말풍선(꼬리 포함, feedback.css:110-113). reduced-motion 시 버스트 스킵(app.js:50 `if (prefersReduced) return;`)까지 챙겼다. 이 "터지는 손맛"이 테마의 한 방 — 더 확장할 것.

### ③ 계산된 접근성 — 수치가 주석에 박혀 있다
"white on red-500은 4.47:1로 아깝게 미달이라 버튼은 red-600(5.69:1)을 쓴다"(semantic.css:93-94, CHECKLIST.md §4), 노랑 위 텍스트는 항상 검정 고정(semantic.css:36), 다크모드에서 잉크 플립에 휩쓸리면 안 되는 텍스트는 non-flipping `--neutral-900`에 고정 + 호버 하이라이트를 다크앰버로 스왑(semantic.css:210-213). 실제 검증한 흔적이 있는 대비 엔지니어링 — 고도화 시에도 이 규율을 그대로 계승할 것.

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 🔴 A. 데모 페이지 9종 전부가 영어 — 최우선·최대 결함
- **9/9 페이지가 `lang="en"`이고 한글이 0줄** (settings.html:155의 `<option>한국어</option>` 단 1줄 제외). grep 검증 완료.
  - pages/dashboard.html:2, kanban.html:2, inbox.html:2, product.html:2, pricing.html:2, settings.html:2, onboarding.html:2, profile.html:2, 404.html:2 — 모두 `<html lang="en">`
- index.html만 한글(lang="ko")로 완성도 높게 번역되어 있어 **허브와 데모의 언어가 분리된 반쪽 상태**. "국내용·한글 중심" 프로젝트 방향의 정면 위반.
- 파생 문제: "Skip to content"(각 페이지 33행 부근), USD 가격 `$19/mo`(pricing.html:150-213, product.html 가격), "Comic store performance · last 30 days"(dashboard.html:58), FAQ 전체 영문(pricing.html:302-326).
- **수정 지침**: 9개 페이지 전체를 한글화(lang="ko"). 톤은 index.html이 이미 잡아놨다 — "맙소사 하프톤이다!"(index.html:194), "여기저기 눌러 보세요 — POW 하고 터집니다"(index.html:313) 같은 만화 대사 톤 유지. 가격은 ₩ 기준으로. 의성어는 §5-②의 한글 의성어 전략과 연동.

### 🔴 B. app.js 내장 영문 문구
- app.js:91 `aria-label="Notifications"`, app.js 토스트 기본 타이틀 `"Done!"`, `aria-label="Dismiss"`, app.js:576 `"Go to slide "`, cmdk placeholder "Type a command…"(각 페이지 하단 cmdk 마크업). 컴포넌트 레벨 문자열까지 한글화해야 데모가 일관된다.

### 🟠 C. 근거 없는 세리프 import — 서재 관성의 잔재
- tokens.css:13 Google Fonts import에 **`Noto+Serif+KR` 포함, 사용처 0곳** (grep 검증: 어떤 CSS/HTML/JS도 참조 안 함). 코믹 DNA에 세리프 근거가 전혀 없다. 전형적인 'AI 문서 감성' 보일러플레이트 잔재 — **제거**.

### 🟠 D. 대시보드의 리포트형 공식 레이아웃
- dashboard.html:71-167 — `grid-4` 균질 스탯카드 4개 → 차트 2단 row → 테이블. 어느 테마에나 있는 hero+카드그리드 공식 그대로다. 스킨만 코믹이고 **구도는 얌전한 admin 리포트**. §5-①에서 코믹 판형으로 재구성 제안.

### 🟡 E. filler 카피의 헛점 (성의 부족 신호)
- product.html:55-63 — 별점 `aria-label="Rated 4.5 of 5"` + `data-value="5"`(별 5개 전부 켜짐) + 표기 텍스트는 "4.8" — 세 값이 전부 다름.
- pricing.html:218 "Team seats (up to 10)" ↔ pricing.html:223 "Team seats &amp; SSO" — 같은 플랜 feature 리스트 안 중복.

### 🟡 F. OS 이모지 아이콘 남발
- cmdk 아이템(📊🗂️✉️💰⚙️🦸🏠 — index.html:643-652, 각 페이지 cmdk), 드로어 리스트(🦸⚙️🚪 — index.html:624-626), kanban 컬럼헤드(📥 등 kanban.html:52). 잉크 스트로크 인라인 SVG 시스템(검색·태양 아이콘은 이미 SVG)과 이질적인 OS 이모지가 섞임 — 만화 잉크 미학을 깨는 전형적 AI 티. 2.5~3px stroke 잉크 스타일 SVG로 교체 권장.

---

## 4. 프로덕션 결함

### 🔴 P1. 모바일 내비게이션 완전 붕괴 (전 페이지)
- navigation.css:46-50 — `.navbar-toggle { display:none }` → 880px 이하에서 `.nav-links` 숨기고 `.navbar-toggle` 표시하는 설계인데, **`.navbar-toggle` 요소가 10개 HTML 어디에도 없고 app.js에도 핸들러가 없다**(grep 0건). 결과: 모바일에서 페이지 간 이동 수단이 사라짐(⌘K는 모바일에서 못 씀). 햄버거 버튼 + 오프캔버스 메뉴(기존 drawer 재사용) 구현 필요.

### 🔴 P2. inbox 모바일에서 폴더 패널 접근 불가
- pages/inbox.html:32 — `@media (max-width:980px){ .mail-panel.folders-panel{ display:none; } }` 토글 대안 없이 그냥 삭제. 드로어로 승격하거나 상단 가로 칩으로 변환해야 함.

### 🔴 P3. Sidebar 컴포넌트 데드 코드 / 문서 불일치
- navigation.css:53-100 `.app-shell`/`.sidebar`(collapsible + mobile) + README.md:141, 156의 `data-sidebar-collapse/-toggle` 훅 — **9개 페이지 어디에서도 사용 안 함**(grep 0건). CHECKLIST.md §2는 "Sidebar ✅"로 검증됐다고 주장. 데모에 실제 탑재(예: dashboard를 app-shell 구조로)하거나 문서에서 내릴 것.

### 🟠 P4. 토큰 우회 하드코딩 색상
- pages/pricing.html:157-161, 187-192, 217-223 — feature 체크 아이콘 `stroke="#1FA84A"` ×16회. **토큰에 없는 녹색**(토큰 green-500=`#16b54a`). `style="stroke:var(--color-success)"` 또는 currentColor로.
- pages/pricing.html:81 — `.compare-table .yes { color:#0b7a30 }` (대비 주석은 있으나 원시값). `--green-700` 성격의 토큰 신설이 맞다.
- components/display.css:309 — 다크 선택행 `#14305c` 하드코딩.
- components/display.css:394-395 — 코드블록 구문색 `#7ee787`/`#ff9d7a` — GitHub Dark 팔레트 차용. 플랫 잉크 DNA(노랑/시안/핑크 잉크)로 교체 여지.

### 🟠 P5. index 램프 스와치 대비 로직 오류
- index.html:673-674 — `dark = (name!=="yellow" && s>=500)` → yellow 램프의 700~900(#997b00/#6e5900/#443700) 위에 검정 텍스트가 남아 대비 ~1.5–3:1로 실패. yellow도 700 이상은 흰 텍스트로 분기해야 함.

### 🟠 P6. 커맨드 팔레트 항목의 키보드/시맨틱 결함
- index.html:643-653(전 페이지 동일 패턴) — `.cmdk-item`이 전부 `<div>`. `role="option"`/`aria-activedescendant` 없음, Tab 도달 불가(↑/↓는 app.js:350에서 처리). listbox 패턴(`role="listbox"` + `role="option"`)으로 승격 필요.
- inbox의 `.mail-item`도 div+cursor:pointer — 키보드 선택 불가(pages/inbox.html:19-28 스타일 참조). `<button>` 또는 tabindex+keydown 필요.

### 🟠 P7. hover 토큰 데드 — 토큰과 구현 불일치
- semantic.css:25-31 `--color-primary-hover/-press`, semantic.css:82 `--btn-shadow-hover`는 정의됐지만 buttons.css:35-43 hover/active는 transform+shadow만 변경, **배경색 변화 없음**. `--btn-primary-hover` 계열은 참조 0. hover에 red-700 다크닝을 추가하든(권장) 토큰을 정리하든 일치시킬 것.

### 🟡 P8. 기타
- 폰트 `@import`가 2곳 분산(tokens.css:13, base.css:11) — 렌더 블로킹 2회. 통합 + 미사용(Noto Serif KR) 제거.
- index.html:580 — footer의 `<a href="README.md">` → 브라우저에서 raw 마크다운. 제거하거나 안내 처리.
- onboarding.html:42 — `.hero-card:focus-within` outline이 `var(--blue-500)` 직접 참조(시맨틱 `--focus-ring-color` 우회). onboarding.html:50-51 — ":has() 미지원 폴백" 주석과 달리 실제 폴백은 이모지 scale뿐, 선택 표시 폴백 없음.
- kanban DnD 키보드 불가(CHECKLIST.md §9에서 자인) — 카드 컨텍스트메뉴 "왼쪽/오른쪽으로 이동" 액션 정도의 대안 권장.
- product.html:55-63 별점 정보 불일치(§3-E) — a11y 오정보이기도 함.
- **SVG stroke/fill 속성 var() 직접 사용 버그: 0건 (통과)**. progress ring은 `style="stroke:var(--red-500)"` 패턴(dashboard.html:111)으로 올바르게 처리됨. 고도화 시에도 이 패턴 유지할 것.
- 상태 커버리지 자체는 우수: disabled/loading(buttons.css:77-100), invalid(forms.css:49-50), empty state(display.css:426-437), focus-visible 전역(base.css:412-418) 확인됨.

---

## 5. 대담화 기회 — 프로라면 여기까지 민다

### ① 대시보드·허브를 '만화 판형(comic page layout)'으로 재구성 ★한 방
균질 grid-4(dashboard.html:71) 대신 실제 만화책 페이지처럼: 크기가 제각각인 패널(2×2 스팬 히어로 패널 + 좁은 세로 패널), 패널마다 미세한 기울기(rotate -1~1deg), 굵은 잉크 gutter, 그리고 **패널 테두리를 뚫고 튀어나오는 요소**(버스트·스탯 숫자·캐릭터가 panel breakout — overflow:visible + negative margin + z-index). 이미 `--panel-gutter` 토큰(tokens.css:150-152)과 `.panel-grid`(base.css:243-248)가 있으므로 `grid-template-areas` 기반 비정형 배치만 추가하면 됨. 페이지 좌상단에 "PAGE 1 / ISSUE #22" 러닝 헤드를 달면 판형이 완성된다.

### ② 한글 의성어 시스템 — 국내화와 시그니처를 동시에
§3-A 한글화와 연동: `BURST_WORDS`(app.js:48 `["POW!","BAM!",…]`)를 **한글 의성어 사전**으로 확장 — "쾅!", "펑!", "빠밤!", "우당탕!", "슈욱!", "두둥!". Black Han Sans가 이미 `--font-action` 폴백(tokens.css:183)에 있어 즉시 렌더 가능. 히어로 타이틀·배너 액션워드·404 "OOPS!"도 한글 의성어 병기("쾅! OOPS!"). 다른 테마가 절대 못 따라 하는 국내용 시그니처가 된다.

### ③ CMYK 오프셋 인쇄 어긋남(misregistration) + 인쇄물 소품
'프로 스튜디오가 찍은 인쇄물' 디테일: 대형 타이틀에 red/cyan 채널이 1–2px 어긋난 이중 text-shadow(`.comic-title` 확장, base.css:137-148), 패널 모서리에 빈티지 가격 스티커("₩500", 원형 버스트), 바코드·발행호수·"COMICS CODE APPROVED" 스탬프(살짝 기울여 도장 느낌), 종이 가장자리 잉크 번짐. 전부 CSS로 가능하고 DNA 규칙(그라데이션 금지)을 위반하지 않는다.

### ④ 배경에 하프톤 심도(atmosphere) 부여
현재 배경은 균일 도트 1겹(`--color-bg-dots`, semantic.css:14). 히어로/섹션 배경에 **도트 크기가 방사형으로 커지는 하프톤 비네트**(radial-gradient 마스크 + `--halftone-size` 층 2–3겹, `.halftone-fade` base.css:183-195 패턴 재활용)를 깔아 인쇄물의 농담(濃淡)을 만들 것. 다크모드에서는 노랑 도트가 별처럼 보이게 밀도 조절(semantic.css:185-187 확장).

### ⑤ 온보딩을 진짜 4컷 만화로
onboarding.html의 4개 wizard 패널을 **연재만화 컷**으로: 각 컷에 컷 번호 캡션 박스(노랑 사각 캡션 — 만화의 내레이션 박스), 진행할수록 말풍선 캐릭터의 스토리가 이어지고, 마지막 컷은 "다음 화에 계속…(THE END?)" + NEXT ISSUE 티저 배너. 이미 speech-bubble/burst/steps가 다 있어 조립 문제일 뿐이다.

### ⑥ 시그니처 모션: '도장 찍기' 스탬프 등장
data-reveal(스크롤 리빌)을 fade-up 대신 **스탬프 모션**으로: `scale(1.18) rotate(-3deg)` → `scale(1)`에 진한 그림자가 '쿵' 하고 앉는 keyframe + 등장 순간 잉크 스플랫 의사요소. 탭 전환은 컷 슬라이드, 토스트는 말풍선 꼬리가 마지막에 톡 튀어나오는 2단 애니메이션. 모두 `--ease-emphasized` 재사용, reduced-motion 가드는 기존 블록(base.css:496-505)이 이미 커버.

---

## 6. 한글 폰트 페어링

**현재 상태** (tokens.css:181-186):
| 역할 | 스택 | 한글 실렌더 |
|------|------|------------|
| `--font-display` | Bangers → Anton → Impact → … → **Black Han Sans** → Noto Sans KR | 한글 헤딩 = Black Han Sans |
| `--font-action` | Luckiest Guy → Bangers → Impact → **Black Han Sans** → Noto Sans KR | 한글 액션워드 = Black Han Sans |
| `--font-body` | Nunito → Trebuchet MS → … → **Gothic A1** → Noto Sans KR | 한글 본문 = Gothic A1 |
| `--font-mono` | JetBrains Mono → … | — |

**평가**: Black Han Sans(임팩트 계열 초고밀도 한글) × Gothic A1(단단한 본문 고딕) 페어링은 코믹 DNA에 정확히 맞는다 — **보존**. 라틴 Bangers와 한글 Black Han Sans의 무게감도 잘 맞는다. 서재풍 세리프가 실제 렌더에 쓰이는 곳은 없음.

**수정 1건 (필수)**: tokens.css:13 import에서 **미사용 `Noto+Serif+KR` 제거** (§3-C). 아울러 tokens.css:13 + base.css:11 이중 import를 한 곳으로 통합.

**증폭 제안 (선택)**: 말풍선 대사·캡션용으로 **Jua**(둥글둥글한 만화 손글씨 무드) 1종 추가 검토 — `--font-bubble: "Jua", "Gothic A1", …`로 말풍선(.speech-bubble/.thought-bubble)에만 적용하면 '레터러가 손으로 쓴 대사' 질감이 산다. 단, 페이지가 한글화된 뒤에만 의미가 있으므로 §3-A 완료 후 적용.

---

## 우선순위 요약 (구현 순서 권장)

1. **[P0] 9개 페이지 전면 한글화** (lang, 카피, 통화, app.js 문구) — §3-A, §3-B
2. **[P0] 모바일 내비 복구** (navbar-toggle 구현 + inbox 폴더 패널 대안) — §4-P1, P2
3. **[P1] 하드코딩 색 토큰화 + 램프 스와치 대비 수정 + 세리프 import 제거** — §4-P4, P5, §3-C
4. **[P1] 코믹 판형 레이아웃 + 한글 의성어 + 인쇄물 소품** (대담화 핵심) — §5-①②③
5. **[P2] cmdk/mail-item 키보드 접근성, hover 토큰 정합, sidebar 데모 탑재 여부 결정, 이모지→잉크 SVG** — §4-P3, P6, P7, §3-F
6. **[P2] 하프톤 심도 배경 + 스탬프 모션 + 온보딩 4컷화** — §5-④⑤⑥
