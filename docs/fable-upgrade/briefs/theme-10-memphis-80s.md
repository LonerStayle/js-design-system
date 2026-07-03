# 감사 브리프 — theme-10-memphis-80s (Memphis 80s)

> 감사 기준: "AI 지문 제거 + 테마 DNA 대담 증폭" 재고도화 프로젝트.
> 테마 경로: `design-systems/theme-10-memphis-80s/`
> 파일 구성: tokens.css / semantic.css / base.css / theme.css(엔트리, styles.css 없음) / components 7종 / app.js(830줄) / index.html + pages 9종 (HTML 총 10개)

---

## 1. DNA 요약

**정체성**: 1981년 밀라노 멤피스 그룹의 반(反)취향 포스트모던 — "패턴이 주인공". 부딪치는 평면 원색(핫핑크 `#FF2E93` · 일렉트릭 블루 `#2D5BFF` · 애시드 옐로 `#FFD400` · 틸 `#00C2A8` · 코랄 `#FF6B5C`), 시그니처 크림 캔버스 `#FFF8E7`, 잉크 블랙 `#0A0A0F`. 두꺼운 검은 테두리(2–4px), 블러 없는 **플랫 오프셋 섀도**(부딪치는 색으로), 8px 라운드, Space Grotesk/Poppins 기하 타이포, 스프링 바운스 모션, 컨페티 도형(squiggle/triangle/star/blob 등 9종) 흩뿌리기.

**명시된 규칙 (README.md:20-28, tokens.css 헤더, base.css:226-229 주석)**:
- **"No gradients"** — 그라디언트 금지 (README.md:20 굵은 명시)
- 패턴은 **장식 전용** — 본문 텍스트는 반드시 solid `.panel`/`.card` 블록 위, 대비 ≥4.5:1 (README.md:26-28, base.css:226-229)
- 대비값은 `*-fg` 토큰에 하드코딩된 설계 (semantic.css:7-13 주석: 핑크 위 검정 6.1:1, 블루 위 흰색 5.2:1 등)
- `prefers-reduced-motion` 시 모든 장식 모션 중단 (base.css:354-365, app.js:17)
- 상태는 색 + 아이콘/도형 병행 (color-blind safe) — 예: 필드 에러 `▲` 글리프(forms.css:24), candy-stripe 프로그레스(feedback.css:104-105)

**중요 — 지문/DNA 구분**: 이 테마의 **크림 톤(`--cream #FFF8E7`)은 서재풍 지문이 아니라 멤피스 시그니처 DNA**다(멤피스 가구의 크림 라미네이트). 세리프는 어디에도 없음(올바름). 크림을 제거하지 말 것 — 단 크림 "위에서 노는 방식"을 더 요란하게 만들 것.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 대비가 설계에 박힌 토큰 아키텍처
- semantic.css:7-13 — WCAG 대비 수치가 주석으로 명문화되고 `*-fg` 토큰에 인코딩됨 ("핑크 위 검정 6.1:1, 흰색이면 3.5:1 실패").
- 다크모드에서 "잉크"가 크림으로 뒤집히는 테마 가변 보더/섀도 시스템 (semantic.css:135-137, 163-170) — `--shadow-pop`이 다크에서도 자동으로 살아있음.
- 패턴 재색칠 시스템: 로컬 `--pat-fg` 하나로 도트/스트라이프 색이 바뀌는 구조 (tokens.css:115-127, base.css:240-246). 프로덕션급 설계 — **이 구조를 그대로 두고 소비처만 늘리면 됨**.

### ② 830줄 바닐라 JS의 인터랙션 완성도
- 포커스 트랩 + 마지막 포커스 복원(app.js 모달/드로어), 스크롤락 참조 카운팅, 탭 방향키/Home/End(app.js:234-237), `aria-sort` 동기화(app.js:397-401), 레이팅에 `role="radio"` 부여(app.js:519), 토스트 variant별 `role="alert"/"status"` 분기(app.js:186).
- **reduced-motion 게이트가 진짜로 작동**: 플로팅 도형 스폰 자체를 차단(app.js:58), 캐러셀 autoplay도 차단(app.js:472), 리빌은 즉시 완료(app.js:119,155).
- 버튼 전 상태 구현: hover 바운스/active 눌림/disabled/loading 스피너 (buttons.css:35-109). 모달 이중 오프셋 섀도(overlay.css:31 — 핑크+블랙 2단 섀도)와 닫기 버튼 rotate(90deg) 호버(overlay.css:54)는 시그니처감 있음.

### ③ 테마 지식이 배어 있는 마이크로카피/페르소나 (영어라는 게 유일한 문제)
- 데모 데이터 인물이 실제 멤피스 그룹 멤버: Ettore Sottsass, Nathalie Du Pasquier, Michele De Lucchi, George Sowden, Martine Bedin, Peter Shire (dashboard.html:163-167, inbox.html 전반). inbox.html:248의 이메일 본문은 Carlton 책장을 언급하는 등 filler가 아닌 진짜 크래프트.
- 404.html "This page wandered off into the terrazzo" + 온브랜드 빈 상태 4종 갤러리 — 톤이 살아있음.
- **한글화할 때 이 위트의 밀도를 그대로 이식할 것** (직역 금지 — 예: "테라조 틈에 빠진 페이지예요").

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 🔴 A. 9개 데모 페이지 전부 영어 — 최악·최우선
- pages/*.html 9개 모두 `<html lang="en">` (각 파일 2행), **한글 0자** (grep 검증: 전 페이지 hangul count 0). index.html만 `lang="ko"` 한글.
- 국내용·한글 중심 프로젝트 위반. 페이지 타이틀("Analytics Dashboard · Memphis 80s"), 본문, aria-label("Toggle dark mode", "Skip to content")까지 전부 영어.
- app.js 내 UI 문자열도 영어: 테마 라벨 "Dark"/"Light"(app.js:35), 토스트 리전 aria-label "Notifications"(app.js:171), 캐러셀 닷 "Slide n"(app.js:460).
- **작업 지시**: 9개 페이지 전량 한글화(`lang="ko"` 포함) + app.js 문자열 한글화. 인물 페르소나는 멤피스 멤버를 유지하되 한국어 문맥으로(예: "엣토레 소트사스", 또는 한국 스튜디오 페르소나로 대체 가능 — 위트 밀도 유지가 조건). 통화·날짜도 ₩/한국 형식 권장.

### 🔴 B. 한글 무드 폰트가 '죽은 코드' — 성의 없는 임포트 지문
- tokens.css:23에서 `Jua`, `Gothic A1`, `Noto Sans KR`, `Noto Serif KR` 4종을 임포트하지만:
  - 폰트 스택(tokens.css:203-205)이 `"Space Grotesk", "Poppins", system-ui, "Jua", "Noto Sans KR"` 순서 — **system-ui가 한글 폰트보다 앞이라 macOS에선 한글이 Apple SD Gothic Neo로 폴백, Jua/Gothic A1이 영원히 적용 안 됨** (Windows에서만 우연히 적용 — 크로스플랫폼 불일치).
  - `Noto Serif KR`은 어느 파일에서도 참조되지 않는 **완전 미사용 임포트** (grep 검증) — 로딩 낭비 + 서재 관성의 잔재.
- **작업 지시**: `--font-display: "Space Grotesk", "Jua", "Noto Sans KR", system-ui, sans-serif` / `--font-body: "Poppins", "Gothic A1", "Noto Sans KR", system-ui, sans-serif` 순서로 교정, Noto Serif KR 임포트 제거.

### 🟠 C. 중앙정렬 hero + 균등 그리드 공식 (얌전한 리포트 골격)
- index.html:48-85 hero: 중앙정렬 텍스트 + 배지 나열 + CTA 클러스터 — 컨페티만 뿌렸을 뿐 뼈대는 전형적 AI hero 공식. pricing.html:49-83, 404.html도 동일 골격 반복.
- index.html 이하 전 섹션이 `grid--2/3/4` 균등 그리드 (stat 4개 균등, 페이지 카드 3열 균등, index.html:319-344 / 574). 멤피스의 본질(비대칭·오버랩·그리드 파괴)과 정반대의 균질 리듬. → §5 대담화 참조.

### 🟠 D. 이모지 아이콘 남발
- ⌘K 팔레트(index.html:653-659 📊🗂💸✉️🌗🍞), 드롭다운 메뉴(index.html:550-553 ✏️📄🗑), 컨텍스트 메뉴(index.html:666-669 🔗⭐🗑), 페이지 카드 아이콘(index.html:703-711), 알림 메뉴(dashboard.html:59-61 ⚠️⭐, kanban.html:59 🟢).
- 시스템 전체가 스트로크 3px 인라인 SVG 아이콘 언어를 갖고 있는데 이모지가 섞여 'AI 데모' 티 + OS별 렌더 편차. **전부 두꺼운 스트로크 SVG(멤피스 도형 어휘 재활용)로 교체**.

### 🟡 E. "No gradients" 규칙을 몰래 어기는 skeleton shine
- display.css:197-203 — skeleton 로딩이 `linear-gradient` 샤인 애니메이션. DNA 명시 금지 기법이 침투한 유일한 지점. **대각선 candy-stripe(`--pattern-stripes`)가 흐르는 애니메이션으로 교체**하면 오히려 더 멤피스다움.

---

## 4. 프로덕션 결함 (파일:라인)

| # | 심각도 | 내용 | 위치 | 수정 방향 |
|---|---|---|---|---|
| 1 | 높음 | 한글 폰트 스택 순서 오류(위 3-B) — Jua/Gothic A1 무효화 | tokens.css:203-205, 23 | 한글 폰트를 system-ui 앞으로, Noto Serif KR 제거 |
| 2 | 높음 | **유효하지 않은 ARIA**: segmented 컨트롤이 plain `<button>`에 `aria-selected` 사용. `role="tablist"` 래퍼인데 버튼에 `role="tab"` 없음(index.html:187-191, pricing.html:75-78), 래퍼 role 자체가 없거나(index.html:605, dashboard.html:107,211) `role="group"`+aria-selected(onboarding.html:105-110 — 무효 조합) | 좌기 | 버튼에 `role="radio"`+`aria-checked`(래퍼 `role="radiogroup"`) 또는 `aria-pressed`로 통일. app.js:558 부근 aria-selected 토글 로직도 함께 수정 |
| 3 | 중간 | 토큰 우회 하드코딩 `style="color:#fff"` | index.html:330, 502 / dashboard.html:88 / profile.html:135 | `var(--white)` 또는 아래 #4의 전용 토큰 |
| 4 | 중간 | `.stat--blue` 위 델타 색 미설계 — `stat__delta--up`(teal-800)을 blue-500 위에 쓰면 대비 미달이라 인라인 #fff로 회피 중 | display.css:67-74 + 위 #3 | `.stat--blue .stat__delta { color: var(--white) }` 룰 추가로 토큰화 |
| 5 | 중간 | `badge--warning`/`badge--info` 변형 부재 → 페이지들이 인라인 스타일로 땜질 `style="background:var(--color-warning);color:var(--black)"` | index.html:477, dashboard.html:165 / display.css:86-93 | display.css에 `.badge--warning`, `.badge--info` 추가 후 인라인 제거 |
| 6 | 중간 | `.clash .c4`(coral-500)가 크림 배경 대형 헤드라인에서 대비 약 2.7:1 — AA 대형텍스트(3:1) 미달 의심 | base.css:114, 사용처 404.html:51-55("4"가 c4) | c4를 coral-600으로 조정하거나 404의 글자에 `.mark`식 solid 블록/두꺼운 텍스트 아웃라인 적용 |
| 7 | 중간 | **반응형 의심**: dashboard/kanban/inbox/settings의 ≤1024px에서 `.sidebar { position:fixed; width:4.6rem }`로 전환되는데 `.app-main`에 좌측 여백 보정 없음 — 콘텐츠 좌측이 사이드바(73.6px) 아래 깔림 의심(`.app-content` 좌패딩 24px뿐) | dashboard.html:253 (같은 패턴 kanban.html, inbox.html, settings.html 인라인 스타일) | `.app-main { margin-left: 4.6rem }` 보정 또는 사이드바를 오버레이 드로어로 전환. 실기기 확인 필수 (CHECKLIST.md:97 — 라이브 렌더 미검증 자인) |
| 8 | 낮음 | navbar/푸터가 `README.md`/`CHECKLIST.md`로 링크 — file://에서 raw 텍스트/다운로드로 열림, 데모 품질 저하 | index.html:29, 586-587, 638 | 링크 제거 또는 문서 섹션 페이지로 대체 |
| 9 | 낮음 | `--weight-black: 800` — "black"(통상 900) 명칭과 값 불일치. Space Grotesk는 700까지라 800도 합성 굵기 | tokens.css:234, base.css 다수 소비처 | 값을 실제 로드 웨이트로 정리하거나 Poppins 800 명시 |
| 10 | 정보 | **SVG stroke/fill 속성 var() 버그 — 이 테마엔 없음(검증 완료)**. progress-ring은 CSS 클래스(feedback.css:116-117)와 `style="stroke:var(--pink-500)"`(dashboard.html:129)로 올바르게 처리됨. 업그레이드 작업 시 이 패턴 유지할 것 | — | — |
| 11 | 정보 | 상태 커버리지 전반 양호: hover/active/disabled/loading/empty/error/skeleton 모두 존재. focus-visible은 base.css:134 전역 룰 + 컴포넌트별 명시(buttons/forms/data/nav/overlay). alert__close·codeblock__copy는 전역 룰 의존 — 오프셋 섀도와 겹칠 때 링 시인성만 확인 | base.css:133-144 | 스팟 체크 |

---

## 5. 대담화 기회 (프로라면 밀어붙일 지점)

현재 상태는 "컴포넌트는 요란한데 **레이아웃은 얌전한**" 상태. 멤피스의 핵심은 구도 자체의 무정부성이다.

### 제안 1 — 히어로 그리드 파괴 (index.html:48-85)
중앙정렬 스택을 버리고 멤피스 포스터 구도로: ①「요란하게/평면적으로/대담하게」각 단어를 서로 다른 `fill-*` 블록 위에 얹어 **서로 다른 각도로 오버랩**(negative margin + rotate + z-index), 한 단어는 `writing-mode: vertical-rl` 세로쓰기. ②히어로 배경을 `clip-path: polygon()` 대각선으로 이분할 — 절반 `pat-terrazzo`, 절반 solid 크림. ③초대형 아웃라인 타이포(`-webkit-text-stroke: 3px var(--black)`, 채움 없음) 한 겹을 뒤에 깔고 화면 밖으로 잘라내기. 기존 `--shape-*`/`--pattern-*` 토큰만으로 구현 가능.

### 제안 2 — 섹션 경계의 지그재그 절단 + 교대 배경 필드
`pattern-rule`(16px 스트립)을 넘어, 섹션 자체를 `clip-path` 지그재그/물결 엣지로 자르고 섹션 배경을 크림 → `yellow-100`+pat-dots → `blue-50`+pat-crosses 식으로 교대시켜 스크롤에 리듬을 만들 것. 밋밋한 "배경 없는 섹션 나열"(index.html:90-576)이 해소됨. 본문 가독성 규칙(solid 패널 위 텍스트)은 기존 `.panel`이 이미 보장.

### 제안 3 — 시그니처 모션 "컨페티 팝"
`btn--primary` 클릭 순간 기존 `--shape-*` SVG 4~6개가 버튼에서 튀어나와 흩어지며 사라지는 파티클 버스트(app.js에 추가, `reduceMotion` 게이트 재사용). 카드 리빌도 현재 단순 translateY(base.css:336-349) 대신 각 카드가 미세하게 다른 각도로 `rotate` 스태거 팝인. 기억에 남는 "한 방"이 됨.

### 제안 4 — 스탯카드 타이포 오버플로
stat 숫자(display.css:65)를 `--text-6xl` 초대형으로 키워 카드 모서리 밖으로 삐져나가게(`overflow: visible` + 절대배치), 델타 배지는 스티커처럼 `rotate(-6deg)`로 모서리에 부착. 균등 4칸 그리드도 `grid-template-columns: 1.2fr 1fr 1fr 1.4fr` 식 비균등 + 한 카드만 `translateY` 오프셋으로 어긋내기.

### 제안 5 — 커서 반발 인터랙션 (히어로 한정)
히어로의 `.deco` 컨페티가 마우스 근접 시 살짝 밀려나는 repel 패럴랙스(app.js, `pointermove` + transform, reduceMotion 게이트). "장식이 살아있다"는 멤피스식 장난기.

### 제안 6 — 한글 디스플레이의 무기화
한글화(§3-A)와 폰트 교정(§3-B)이 끝나면 Jua의 동글동글한 획이 멤피스 blob/squiggle과 정확히 공명한다. 히어로·404·온보딩 피니시의 대형 한글 카피를 Jua로 크게 치고, `.mark` 하이라이트 칩과 조합할 것. 404는 "여기엔 아무것도 없어요. 대신 요란한 건 있죠." 같은 톤으로.

---

## 6. 한글 폰트 페어링 기록

| 역할 | 라틴 | 한글(의도) | 상태 |
|---|---|---|---|
| display | Space Grotesk | **Jua** | 임포트됨(tokens.css:23) — 그러나 스택 순서 때문에 macOS에서 미적용 (§3-B) |
| body | Poppins | **Gothic A1** + Noto Sans KR 폴백 | 동일 문제 |
| mono | Space Mono | Noto Sans KR 폴백 | 사실상 시스템 폴백 |
| (미사용) | — | Noto Serif KR | **어디서도 참조 안 됨 → 임포트 제거** |

- **판정**: 서재풍 세리프 지문 없음. Jua(라운드 디스플레이) + Gothic A1(기하 산세리프 본문) 페어링은 멤피스 DNA와 잘 맞음 — **페어링 자체는 보존**, 스택 순서 교정 + 미사용 임포트 제거만 수행.
- 선택 강화안: 초대형 히어로 한정으로 더 육중한 `Black Han Sans`를 디스플레이 보조로 검토 가능(Jua가 가벼워 보일 경우). 필수는 아님.

---

## 부록 — 구현 에이전트 체크 순서 제안
1. §3-A 전 페이지 한글화(+ app.js 문자열) — 물량 최대, 최우선
2. §3-B/§6 폰트 스택 교정 (tokens.css:23, 203-205)
3. §4 결함 수정 (#2 ARIA, #3-#5 토큰화, #6 대비, #7 반응형 검증)
4. §3-D 이모지 → SVG 교체, §3-E skeleton 스트라이프화
5. §5 대담화 (히어로 → 섹션 경계 → 모션 순)
6. 검증: 라이트/다크 × 640/768/1024 뷰포트, reduced-motion, ⌘K, file:// 더블클릭 (CHECKLIST.md:111-117의 스팟체크 루틴 재사용)
