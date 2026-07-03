# 감사 브리프 — theme-19-industrial-utility

- 감사일: 2026-07-04 · 감사자: 시니어 프로덕트 디자이너 출신 감사관 (Fable)
- 테마 경로: `design-systems/theme-19-industrial-utility/`
- 파일 규모: CSS 10개 · JS 1개(653줄) · HTML 10개(index + pages 9)
- 구현 에이전트는 이 문서만 보고 작업한다. 모든 지적에 파일:라인 근거를 달았다.

---

## 1. DNA 요약

**"콘크리트·스틸 무채색 위에 안전 옐로를 박은, 기능 제일(function-first) 공장/작업장 미학."**

| 축 | 내용 | 근거 |
|---|---|---|
| 무드 | 무뚝뚝·견고·기능 제일. **부드러움·장식·파스텔 금지** (명시 규칙) | README.md:13 |
| 색 | 콘크리트 그레이 `#3A3D42`(700) 램프 + 안전 옐로 `#F2C200` primary + 위험 오렌지 `#E8521E` accent + 머신 그린/레드 신호등. 다크(차콜 메탈)가 정본 | tokens.css:15-105, semantic.css:10-78 |
| 형태 | 직각 — `--radius-sm/md = 0` (tokens.css:216-221), 굵은 보더 2~4px, 하드 플랫 그림자(블러 0, `2px 2px 0` 방식, tokens.css:235-238), 눌린 메탈 인셋 그림자 |
| 타이포 | Oswald(콘덴스드) 헤더 — 전부 uppercase (base.css:63-70) + Archivo 본문 + JetBrains Mono 라벨(전부 대문자 + 와이드 트래킹, base.css:103-110) |
| 모티프 | 위험 줄무늬(`--hazard-stripes`, tokens.css:112-121), 리벳(`--rivet`, tokens.css:124-127), 브러시드 메탈/체커 플레이트/블루프린트 그리드(tokens.css:130-144), 스텐실(`.stencil`, base.css:115-127), 케어 라벨(base.css:210-222) |
| 모션 | 기계적 스냅 — `--ease-snap`, 90/160/280ms (tokens.css:262-268). 버튼 누르면 `translate(2px,2px)` + 그림자 제거 = 물리 버튼 감각 (buttons.css:37) |
| 명시 원칙 | ① 옐로 위 텍스트는 항상 블랙 ② 상태 = **색 + 아이콘 + 라벨** 병행 ③ 장식은 전부 `aria-hidden` | README.md:20, tokens.css:109 |

**중요**: 이 테마의 모노 대문자 영문 라벨("SYSTEM ONLINE", "LIVE", "SPEC SHEET", "UNIT NO. DS-019" 등)은 산업 명판/스텐실 표기 관례이므로 **AI 지문이 아니라 DNA다.** 제거하지 말 것. 서재·크림·세리프 관성은 이 테마에 전혀 없음(모범 사례).

---

## 2. 강점 Top 3 — 살리고 더 밀어붙일 것

### ① 모티프의 완전한 토큰화 — 진짜 시스템으로 작동하는 산업 장식
- `--hazard-stripes / --caution-tape / --rivet / --metal-texture / --plate-texture / --grid-texture`가 전부 재사용 토큰 (tokens.css:111-147), 이를 소비하는 유틸(`.hazard-band`, `.has-rivets > .rivet-corner`, `.stencil`, `.care-label`)이 base.css:151-226에 정리.
- 리벳이 radial-gradient 4-stop으로 실제 입체감을 냄 (tokens.css:124-127). 데모 갤러리 박스에도 실제로 리벳이 박혀 있음 (index.html:161-162).
- **→ 이 토큰 체계는 그대로 두고 "사용 강도"만 올리면 된다. 지금은 모티프가 14px 띠·9px 리벳 수준으로 소극적.**

### ② 물리 기계 감각의 인터랙션 언어가 이미 존재
- 버튼 `:active`에서 `translate(2px,2px)` + 그림자 소멸 = 기계 버튼 누름 (buttons.css:37), 입력칸은 `--shadow-inset-deep`으로 파인 금속 우물 (semantic.css:186, forms.css:38).
- LED 세그먼트 판독기(글로우 + text-shadow, charts.css:34-47), 바늘 달린 선형 게이지(charts.css:49-54), 진입 시 미터 애니메이션(`data-animate-meters`), 실시간 시계(`data-clock`).
- **→ 이 "계기판" 언어가 시그니처가 될 재목. §5에서 증폭 방향 제시.**

### ③ 상태·접근성 원칙이 문서가 아니라 코드에 박혀 있음
- 상태 = 색+아이콘+라벨 병행이 실제 마크업에 구현됨: 품절 badge에 ⚠ SVG + "품절" 텍스트 + 적색 (index.html:324), 가동/정지 badge 동일 패턴 (dashboard.html:134-138).
- 포커스 링 3px 안전 옐로 전역 (base.css:326-335), reduced-motion 전면 무력화 (base.css:338-345), skip-link (base.css:309-323), 모달 ESC·포커스 복귀 (app.js:149-170).
- **→ 30개 테마 중 상위권 기반. 아래 §4 결함만 메우면 프로덕션급.**

---

## 3. AI 지문 (DNA와 무관하게 배어든 것)

### 3-1. 디자인시스템 허브의 "자기소개 통계" 히어로 공식
- index.html:96-101 — `110+ 컴포넌트 / 9 데모 화면 / 240+ 토큰 / AA 명암비` 4개 숫자 나열. AI가 만든 DS 허브의 전형적 관성. 실제 프로 스튜디오 스펙시트라면 **제품 스펙**(하중, 등급, 치수)처럼 표기하지 자기 컴포넌트 개수를 자랑하지 않음.
- 같은 맥락: 푸터의 자기 언급 카피 "© 2026 · 순수 CSS + 토큰으로 제작 · 프레임워크 없음" (index.html:367) — 개발 사정 설명은 지문. 명판 각인 문구(제조번호/규격/경고문)로 대체할 것.
- 히어로 리드 "장식이 아니라 기능으로 작동하는 디자인 시스템" (index.html:89) — 디자인이 스스로를 설명하는 메타 카피. 방향은 좋으나 '시스템 설명'이 아니라 '현장 언어'로 다시 쓸 것.

### 3-2. 균질한 섹션 리듬 + 카드그리드 반복
- 모든 섹션이 동일한 `.gallery-sec { padding: var(--space-12) 0 }` + 동일한 `.section-head` 조합 (index.html:38, 107/133/152/301/342) — 예측 가능한 수직 리듬.
- pages 허브가 9개 동일 크기 `.page-card` 그리드 (index.html:347-357), 컴포넌트 갤러리도 `minmax(320px,1fr)` 균등 그리드 (index.html:158) — **컴포넌트를 진열대처럼 나열**하는 전형. 산업 DNA라면 크기 위계(대형 계기 1 + 소형 게이지 N)가 있는 관제반 구성이 자연스러움.
- 대시보드도 `2fr 1fr` 두 번 반복 (dashboard.html:96, 128) — 벤토 위계 없음.

### 3-3. 죽은 개발 산출물 노출 + 안 쓰는 폰트 임포트
- 네비바 "문서" 링크가 `README.md` 원문으로 연결 (index.html:66) — 제품 UI에 마크다운 파일 링크는 dev-tool 지문. 제거하거나 데모 내 문서 페이지로.
- tokens.css:8 — `Black Han Sans + Gothic A1 + Noto Sans KR + **Noto Serif KR**` 4종 임포트인데 **Noto Serif KR은 어디서도 사용 안 됨** (전 CSS grep 확인). '한글=세리프 폴백'이라는 서재 관성의 흔적. 임포트에서 제거할 것.

### 3-4. 분위기(atmosphere)가 토큰만큼 과감하지 못함
- body 배경이 블루프린트 그리드 + 우상단 옐로 4% 라디얼뿐 (base.css:26-29). 토큰에는 `--plate-texture`, `--metal-texture`가 있는데 페이지 배경 레이어에서는 거의 안 씀. "밋밋한 배경" 계열 지문 — 단, 방향은 §5에서.

---

## 4. 프로덕션 결함 (구현 에이전트 필수 수정)

### 4-1. [치명·알려진 버그] SVG 프레젠테이션 속성에 `var()` 직접 사용 → 렌더 깨짐
CSS 변수는 HTML 속성(`stroke=""`)에서 해석되지 않는다. `style="stroke:var(...)"` 또는 `stroke="currentColor"` + 부모 color로 교체할 것.
- **pages/pricing.html:68-71, 86-91, 103-109, 123-127** — `stroke="var(--color-success)"` 체크 아이콘 약 25곳 (플랜 피처 리스트 + 비교표 전체)
- **pages/product.html:141-144** — 구성품 체크 4곳, **:165-168** — 관련 상품 일러스트 `stroke="var(--concrete-300)"` 4곳
- 다른 페이지·컴포넌트 CSS에는 없음 (전수 grep 완료). CSS 파일 내 `stroke: var()` (charts.css:29, display.css:66-67)는 정상 — CSS 컨텍스트이므로 건드리지 말 것.

### 4-2. [치명] 모바일(≤1024px)에서 사이드바를 열 방법이 없음
- base.css:362-369 — ≤1024px에서 사이드바가 `translateX(-100%)` 오프캔버스가 되고 `data-mobile-open="true"`일 때만 등장.
- 이를 여는 `data-action="toggle-mobile-nav"` 버튼은 **dashboard.html:57 단 한 곳**에 있는데, 내용물(아이콘)이 비어 있고 `style="display:none"` 인라인 고정 — 어떤 미디어쿼리도 이를 다시 보이게 하지 않음.
- kanban/inbox/settings/profile 등 나머지 app-shell 페이지에는 이 버튼 자체가 없음. `toggle-sidebar`(app.js:45)는 `data-collapsed`만 토글하므로 모바일 그리드(1fr)에서는 무의미.
- **수정**: 토글 버튼에 햄버거 아이콘 삽입 + `@media (max-width:1024px)`에서 표시, 데스크톱에서 숨김. 모든 app-shell 페이지에 배치. 열렸을 때 배경 스크림 + ESC 닫기도 필요.

### 4-3. [높음] 반응형 그리드 붕괴 지점
- base.css:251-253 — `.grid-2/3/4`에 축소 브레이크포인트가 전혀 없음. 사용처:
  - dashboard.html:88 stat 카드 4열 → 모바일에서 4열 그대로 압착
  - dashboard.html:96, 128 — 인라인 `grid-template-columns: 2fr 1fr` 2곳, 미디어쿼리 없음
  - index.html:136 모티프 타일 `grid-3`, 404.html:59 `grid-2`
- 페이지 로컬 스타일(pdp 900px, plans 880px, settings 720px 등)은 각자 처리했으나 **공용 유틸이 구멍**. base.css에 `.grid-2/3/4` 축소 규칙 추가가 근본 해법.

### 4-4. [높음] ARIA 오용
- `.segmented`: 컨테이너에 `role="tablist"`를 주고(index.html:184, pricing.html:47) 옵션 버튼에는 `role="tab"` 없이 `aria-selected`만 부여 — 유효하지 않은 ARIA. dashboard.html:81의 segmented는 role조차 없이 `aria-selected` 사용. **`role="radiogroup"`+`role="radio"`+`aria-checked` 패턴으로 통일 권장** (기간/결제주기 선택 의미에 부합).
- cmdk 항목: `<a>/<button>`에 `aria-selected` (index.html:384, app.js:262-263) — `role="listbox"/"option"` 구조가 없으면 무효. cmdk 리스트에 `role="listbox"`, 항목에 `role="option"` 부여 + `aria-activedescendant` 방식 권장.
- 테이블 행 선택 시 `tr`에 `aria-selected` 부여 (app.js:463-469) — `role="grid"` 아닌 일반 table에서는 무효.

### 4-5. [높음] 키보드 접근성 구멍
- 정렬 헤더 `th.sortable`이 click 리스너만 있음 (app.js:440-456) — 포커스 불가, Enter/Space 불가. th 내부에 `<button>`을 넣거나 `tabindex="0"`+keydown 처리 필요.
- 모달: 포커스 이동·복귀·ESC는 있으나 **Tab 순환 트랩 없음** (app.js:150-170) — Tab이 배경으로 샘. 드로어는 열릴 때 포커스 이동조차 없음 (app.js:175-190).
- 캐러셀 dot(product.html:65)은 `aria-label`만 있고 현재 슬라이드 `aria-current` 없음.

### 4-6. [중간] 대비 의심 지점 (라이트 테마 중심)
- 라이트에서 `--color-warning: var(--safety-yellow-600)`(#d4a800)을 badge--warning **텍스트 색**으로 사용 (semantic.css:118, display.css:85) — 연노랑 배경 위 #d4a800 텍스트는 AA(4.5:1) 미달 가능성 높음. 라이트 warning 텍스트는 yellow-800(#7a6000) 계열로 내릴 것.
- `--color-text-subtle`(다크: concrete-400 #7c828b, semantic.css:25)이 surface-800 위에서 ~3.9:1 — `--text-2xs`(11px) 라벨과 조합되는 곳(lgauge 눈금 charts.css:53 등)은 AA 미달. 시각적 위계는 유지하되 12px 미만 텍스트에는 subtle 금지 규칙 필요.
- 라이트 테마에서 `--table-stripe: rgba(255,255,255,0.02)`(semantic.css:200)와 `--grid-texture`(흰색 라인, tokens.css:141-143)가 밝은 배경에서 소멸 — 라이트 오버라이드 누락. 배경 질감이 라이트에서 사라짐.

### 4-7. [중간] 기타
- index.html:66 — 네비 "문서" → `README.md` 링크 (raw 마크다운 열림). 제거 권장.
- buttons.css:40-46 — disabled에 `cursor:not-allowed`와 `pointer-events:none` 동시 지정 — pointer-events가 커서 표시를 무효화(모순). 하나만.
- `.field__error` / `[aria-invalid="true"]` 스타일은 정의됨(forms.css:21-25, 52-55)인데 **전 페이지에서 시연 0회** — 에러 상태 데모가 없음. settings 또는 onboarding 폼에 에러 케이스 1개 이상 넣을 것.
- index.html:37 `.hero__serial`이 absolute 우상단 고정 — 좁은 화면에서 h1과 겹칠 위험. 모바일 숨김/재배치 필요.
- 링크·CSS 참조는 전부 유효(깨진 참조 없음, CHECKLIST 자동검증과 일치 확인).

---

## 5. 대담화 기회 — 프로 디자이너라면 여기까지 민다

### ① 히어로를 "스펙시트"에서 "현장 게시판"으로 (index.html:81-104)
- 지금: 좌측 정렬 타이틀 + 통계 4개 + 하단 얇은 hazard-band. 얌전함.
- 제안: **초대형 스텐실 타이포가 화면 밖으로 잘려나가는 구도** (`INDUSTRIAL`을 뷰포트 폭 110%로, overflow 클리핑) + 히어로를 가로지르는 **-45° 대각 caution-tape 한 줄이 타이틀 위를 실제로 덮는 오버랩** (z-index 교차) + 우측에 리벳 4개 박힌 **각인 명판**(제조번호 DS-019 / 정격 / 검사필 스탬프)을 `--shadow-inset-deep`으로 파넣기. 통계 4개는 명판의 규격표(정격 하중·등급식 표기)로 흡수.
- 배경에 `--plate-texture` 체커 플레이트를 히어로 하단 1/3에 깔아 바닥 발판 느낌.

### ② 시그니처 모션: "중장비 스냅" 3종 세트
1. **테마 토글을 나이프 스위치(차단기 레버)로**: 현재 해/달 아이콘 버튼(index.html:74) 대신 상하로 젖혀지는 레버 + `--ease-snap` 90ms 회전 + 젖힌 순간 페이지 전체 1프레임 플리커(계전기 절환 느낌, reduced-motion 시 생략).
2. **primary CTA 스탬프 효과**: `:active`의 translate(2px,2px)에 더해 옐로 잉크가 찍히는 ::after 플래시(120ms) — "작업 지시" 승인 도장 은유.
3. **게이지 바늘 미세 진동**: dashboard의 lgauge 바늘(charts.css:54)에 ±1% 유휴 jitter 애니메이션 — 살아있는 계기판. LED 판독기에는 은은한 스캔라인/명멸.

### ③ 대시보드를 균등 그리드에서 "관제반 벤토"로 (dashboard.html:88-161)
- OEE 게이지를 2×2 셀 크기의 **주 계기**로 승격(원형 게이지 240px + LED 수치), 나머지 stat은 그 옆 소형 계기 열로. `2fr 1fr` 반복 대신 `grid-template-areas` 벤토로 위계 부여.
- 정지 장비(W-02) 행은 배지만 빨간 게 아니라 **행 좌측에 caution-tape 4px 스트라이프 + 배경 danger-bg** — 경고가 화면에서 소리치게.
- 이벤트 로그 "LIVE" 배지에 실제 blink 애니메이션(키프레임 `blink`는 이미 base.css:384에 존재하는데 미사용).

### ④ 404를 "기울어진 출입금지 표지판"으로 (pages/404.html:39-54)
- 지금 구조(표지판 + 상하 hazard-band)는 좋으나 완전 대칭·수평. **표지판 박스를 rotate(-1.5deg)** + 위쪽 모서리에 체인/볼트 SVG로 매달린 연출 + hazard-band 두 줄을 **풀블리드 대각선**으로 교차시켜 "폐쇄 구역" 봉쇄감. LED `ERR-404 :: SECTOR LOCKED`(404.html:46)는 명멸 애니메이션.

### ⑤ 스텐실을 진짜 스텐실로 (base.css:115-127)
- 현재 `.stencil`은 트래킹만 넓힌 Oswald — 스텐실 브리지(글자 끊김)가 없음. `repeating-linear-gradient` 가로 마스크(`-webkit-mask`)로 글자에 2~3px 끊김 라인을 넣거나, 히어로 한정 스프레이 노이즈 텍스처 오버레이. 최소한 히어로 h1과 404 숫자에는 적용해 "스프레이로 찍은 글자"를 완성할 것.

### ⑥ 프라이싱 featured 플랜을 "권장 규격품"으로 (pages/pricing.html:플랜 그리드)
- featured에 옐로 보더만이 아니라: 상단 `hazard-band--fine` 띠 + `card__tab`식 명판 라벨("표준 규격 KS-B") + 플랜 카드 자체를 8~12px 위로 띄우고 `--shadow-yellow`(이미 토큰 존재, tokens.css:247 — **현재 미사용!**) 적용. `--shadow-yellow`는 만들어 놓고 한 번도 안 쓴 토큰이니 여기가 적소.

---

## 6. 한글 폰트 페어링

| 슬롯 | 체인 (tokens.css:153-155) | 한글 실제 렌더 | 판정 |
|---|---|---|---|
| display | Oswald → … → **Black Han Sans** → Noto Sans KR | 헤딩 한글 = Black Han Sans (초고밀도 산세리프 포스터체) | **DNA 적합 — 보존.** 스텐실/명판 무드와 정합 |
| body | Archivo → … → **Gothic A1** → Noto Sans KR | 본문 한글 = Gothic A1 | **적합 — 보존** (그로테스크 페어) |
| mono | JetBrains Mono → … → Noto Sans KR → monospace | 모노 라벨의 한글은 Noto Sans KR 폴백 | 적합 — 보존 |

- **수정 1건**: tokens.css:8 임포트에 **Noto Serif KR 포함 — 사용처 0** (전 CSS 확인). 서재풍 관성의 잔재이므로 임포트에서 삭제 (로드 절감 겸).
- Black Han Sans가 단일 웨이트(400)라 display 웨이트 토큰(300~700)과 한글에서 어긋나는 점은 한계지만, 헤딩 전용이므로 실질 문제 없음. 교체 불필요.
- 참고: 웨이트 다양화가 필요해지면 Paperlogy/Pretendard Black 계열이 후보이나, 현 페어링이 DNA에 더 진하므로 **교체 비권장**.

---

## 부록 — 수정 우선순위 요약 (구현 체크리스트)

1. **P0** SVG `stroke="var()"` 전량 교체 — pricing.html(68-71, 86-91, 103-109, 123-127), product.html(141-144, 165-168)
2. **P0** 모바일 사이드바 오픈 버튼 — 전 app-shell 페이지 + 아이콘 + 미디어쿼리 표시 + 스크림/ESC
3. **P1** `.grid-2/3/4` 반응형 축소 (base.css:251-253) + dashboard 인라인 `2fr 1fr` 2곳 미디어쿼리
4. **P1** ARIA 정리 — segmented(radiogroup/radio), cmdk(listbox/option), tr aria-selected 제거
5. **P1** th.sortable 키보드 조작 + 모달 Tab 트랩 + 드로어 포커스 이동
6. **P1** 라이트 테마: warning 텍스트 대비, grid-texture/table-stripe 오버라이드
7. **P2** AI 지문 제거 — 허브 통계 히어로 개편(§5-①), 푸터 자기언급 카피, README.md 링크, Noto Serif KR 임포트 삭제
8. **P2** 대담화 — 나이프 스위치 토글, 스탬프 CTA, 관제반 벤토, 404 기울임, 스텐실 브리지, `--shadow-yellow` 활용
9. **P3** 폼 에러 상태 시연 추가, hero__serial 모바일 처리, disabled cursor 모순 정리
