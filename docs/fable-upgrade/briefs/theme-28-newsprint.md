# 감사 브리프 — theme-28-newsprint "The Ledger"

> 감사관: 시니어 프로덕트 디자이너 출신 감사 에이전트
> 테마 경로: `design-systems/theme-28-newsprint/`
> HTML 파일 수: 11 (index.html + pages/ 10)
> 판정 요약: **골격은 30개 테마 중 최상위권의 '진짜 신문 조판' 시스템. 그러나 데모 페이지 10개 전부가 100% 영문 미국 신문이라는 치명적 지문 하나가 전체를 'AI가 NYT를 흉내낸 결과물'로 끌어내림.**

---

## 1. DNA 요약

**정체성**: "The Ledger" — 일간지(daily-of-record) 브로드시트 미학. 따뜻한 신문 용지(`#F1ECE3`) + 카본 잉크(`#16130F`) + 단 하나의 편집용 레드 스폿(`#B81E1E`). 상자 대신 괘선(rules), 여백 대신 밀도, 곡선 대신 직각.

**⚠ 예외 규칙 해당 테마**: 이 테마의 크림 종이 톤·세리프·인쇄 감성은 AI 지문이 아니라 **DNA 그 자체**다. 걷어낼 대상이 아니라 '프로 신문사 조판실' 수준으로 밀어붙일 대상.

명시된 규칙 (파일 근거):
- **모든 radius = 0** — `tokens.css:199-207` "Newsprint is square. Every radius is 0 on purpose." `--radius-full`은 아바타·상태 핍 같은 진짜 원에만 예약.
- **그림자 거의 금지** — `tokens.css:214-220` "almost none — newsprint is flat ink on paper". 하드 오프셋(`--shadow-cut: 4px 4px 0 0`)만 허용.
- **괘선 위계** — `tokens.css:65-70` 신문식 포인트 단위: hairline 0.5px / thin 1 / medium 2 / heavy 4 / banner 6.
- **1색 액센트 규율** — 레드는 제호 장식·속보 띠·위험에만 (`README.md:19`, `tokens.css:44`).
- **진짜 조판**: 다단 양끝맞춤+하이픈(`base.css:272-286`), 단 괘선(`--column-rule`), 드롭캡(`base.css:190-198`), 킥커→헤드라인→데크→바이라인→데이트라인 위계(`base.css:469-492`), oldstyle figures(`base.css:38`).
- **두 에디션**: Day(라이트, 표준) / Night(다크, 눌러 찍은 잉크 바탕) — `semantic.css:12-125`.
- 시그니처: 하프톤 도트 스크린(`tokens.css:91-96`), paper-grain(`tokens.css:102-115`), fold-line(`tokens.css:117-124`), 기사 끝 "— 30 —" 폴리오.

---

## 2. 강점 Top 3 (살리고 더 밀어붙일 것)

### ① 표피가 아니라 뼛속까지 신문인 조판 시스템
단순 스타일링이 아니라 실제 신문 제작 관습을 구현했다. 이건 다른 인쇄계 테마들이 흉내 못 내는 수준.
- `base.css:272-286` — 다단 본문 양끝맞춤 + `hyphens:auto` + 이어지는 문단 `text-indent: 1.2em`(첫 문단 제외) = 진짜 신문 회색 질감.
- `pages/front-page.html:105` — `"Continued on A6 →"` 점프라인(`components/newspaper.css:60`), `:103` 센터드 스몰캡 `subhead` — 실무 신문 편집 기호.
- `tokens.css:65-70` 포인트 단위 괘선 체계 + `base.css:227-231` `.rule-double`(이중 괘선)까지.
- `components/overlays.css:14-17` — 모달 스크림에 하프톤 스크린을 얹는 디테일("newsprint over a window").
**→ 유지·증폭. 이 조판 규율이 이 테마의 생명.**

### ② 신문 전용 컴포넌트 어휘가 이례적으로 깊음
`components/newspaper.css` 전체: 점선 리더가 있는 IndexBox(`:76-82`), WeatherStrip(`:85-90`), 기울어진 편집 스탬프(`:93-108`), 잉크 막대 ChartBars(`:111-115`), PriceTag(didone 숫자, `:132-135`), Ribbon, Folio "— 30 —"(`:153-165`). 여기에 `components/feedback.css:8-34`의 Breaking Band 티커(hover 일시정지 + reduced-motion 대응)까지. 대시보드·프라이싱 같은 SaaS 화면조차 신문 은유("발행 부수", "윤전기로 전송", "판 제출")로 일관되게 번역됨(`index.html:306-330`).
**→ 이 어휘를 삭제·중화하지 말 것. 오히려 미사용 자산(fold-line은 settings.html:430 단 1회 사용)을 전면 배치.**

### ③ 토큰 규율 + 상태·안전망의 프로덕션 완성도
- 컴포넌트 CSS에서 토큰 우회 하드코딩 색상이 사실상 전무 (예외 4곳뿐 — §4 참조). 버튼은 private 변수 패턴(`--_bg/--_fg`, `buttons.css:6-11`)으로 variant를 깔끔하게 처리.
- 상태 커버리지 우수: hover/active/disabled/loading/focus-visible 전부 (`buttons.css:35-49,117-132`), 폼 요소별 `:focus-visible` 링(`forms.css:143,163,189,214,244,260`), `is-invalid`(`forms.css:68-70`), `aria-sort` 시각화(`table.css:58-61`).
- 안전망: no-JS reveal 강제 표시(`base.css:539-542`), `prefers-reduced-motion`(`base.css:587-596`), print 스타일(`base.css:601-605`), skip-link(`base.css:84-99`).
**→ 이 규율을 깨지 말고 그 위에서 대담화할 것.**

---

## 3. AI 지문 (테마 DNA와 무관하게 배어든 것)

### 🔴 지문 #1 (치명): 데모 페이지 10개 전부가 100% 영문 미국 신문
- **근거**: `pages/*.html` 10개 모두 `<html lang="en">`(각 파일 2행), 한글 0줄 (grep 검증: 전 페이지 hangul-lines=0). 한글은 `index.html` 허브 단 1개.
- `pages/front-page.html:57` "Markets rally as central bank holds rates…", `:64` "Vol. XXVIII · No. 172", `:73` "Price $2.50", `:86` "Senate Passes Sweeping Reform After All-Night Session", `:90` "Washington — 4:12 a.m." — 완전한 미국 일간지 코스프레.
- `app.js:62,68` — 데이트라인이 `toLocaleDateString("en-US", …)`로 하드코딩. **한글 허브(index.html)에서도 날짜가 영문으로 렌더링됨.**
- `app.js:35` — 테마 토글 라벨이 `"Night Ed." : "Day Ed."` 하드코딩 → index.html:64의 한글 라벨 `주간판`을 JS 초기화 시점에 **영문으로 덮어씀**.
- `tokens.css:12`에서 한글 폰트 5종(Song Myung, Nanum Myeongjo, Gothic A1, Noto Sans/Serif KR)을 import하면서 정작 페이지에서 한 글자도 안 씀 = 죽은 페이로드.
- **이것이 '차분한 서재 관성'의 신문판**: AI가 "newsprint = New York Times"로 직행한 지문. 국내용 프로젝트라면 한국 신문(세로 제호, 국한문 병기, ※·◆ 조판 기호, "제28권 제172호" 판권 표기)이라는 훨씬 신선한 정체성이 있는데 가장 뻔한 서구 레퍼런스를 골랐다.
- **처방**: 10개 페이지 전면 한글화(`lang="ko"`) + 미국 신문이 아니라 **한국 일간지 조판 관습**으로 재해석 (§5-1). `app.js`의 en-US 데이트라인 → `ko-KR` 포맷("2026년 7월 4일 금요일 · 단기 4359년"), 테마 라벨 → "주간판/야간판".

### 🟠 지문 #2: 균질 카드 그리드 진열대 (신문의 '크기 위계' 부재)
- `index.html:229-348` 컴포넌트 갤러리 — 동일 크기 `grid-3` 카드 9개에 컴포넌트를 진열. `index.html:379-390` 페이지 링크도 동일 구조 카드 9장 반복. 신문 1면이라면 기사마다 크기·단수가 달라야 하는데 여기만 'AI 쇼케이스 공식'으로 회귀.
- `pages/front-page.html:139-159` fp-tier가 정확히 1:1:1 3등분, `:167-195` fp-strip도 유사 — 실제 브로드시트의 불균등 배분(4:2:1 위계, 단 넘김)이 아님. 대표작 페이지치고 구도가 얌전하다.
- **처방**: 갤러리를 '지면'으로 재조판 — 컴포넌트 데모를 기사 크기 위계(2단 스팬 lead + 1단 보조)로 흘리고, 페이지 링크는 IndexBox/섹션 색인 형태로.

### 🟡 지문 #3: 인라인 스타일 복붙 반복 (조판 규칙의 클래스화 실패)
- `pages/front-page.html:142,148,154` — 동일한 헤드라인 인라인 스타일 3회 복붙(`style="font-family:var(--font-masthead);font-weight:900;font-size:var(--text-2xl);…"`). `index.html`에 인라인 style 47곳, front-page 29곳, dashboard 21곳.
- 신문사라면 'headline size 3', 'headline size 4' 같은 명명된 조판 규격이 있다. AI가 매번 즉석에서 스타일을 다시 쓴 티.
- **처방**: `.headline-2xl/.headline-xl` 류의 헤드라인 스케일 클래스 신설(`newspaper.css`), 페이지 인라인 스타일을 등급 클래스로 치환.

### (지문 아님 판정) 크림 종이 톤·세리프·저채도 상태색·justify 조판
`semantic.css:53-56`의 탈채도 인쇄 잉크 상태색, Playfair/Source Serif 세리프 헤딩·본문, 종이 그레인 — 전부 DNA 근거가 명확(README·주석에 명시)하므로 보존·강화 대상.

---

## 4. 프로덕션 결함

### A. 렌더 깨짐 (즉시 수정)
1. **SVG 속성 var() 사용 — 알려진 렌더 버그**: `pages/inbox.html:307`
   `<svg … fill="var(--color-accent)" stroke="var(--color-accent)" …>` — HTML 속성에서 var()는 파싱 실패 → 깃발 아이콘이 검정으로 렌더. `style="fill:var(--color-accent);stroke:var(--color-accent)"` 또는 부모 색+`currentColor`로 교체. (전 테마 grep 결과 이 1곳뿐 — 나머지는 전부 `currentColor`로 올바르게 처리됨.)

### B. 테마/토큰 결함
2. **`data-theme="auto"` 다크 분기 불완전**: `semantic.css:128-146` — auto 블록이 role 토큰의 일부만 재매핑. 누락: `--color-text-invert`, `--color-text-link`(라이트 값 ink-900 유지 → **다크 배경에서 링크가 거의 안 보임**), `--color-border-strong`, `--color-border-muted`, `--color-accent-fg/-hover`, status 4종(+bg/fg), `--color-scrim`, `--color-overlay-paper`, `--color-selection-*`, `--color-surface-ink`, `--shadow-pop`. 현재는 app.js가 항상 명시적 light/dark를 적용해(`app.js:39-42`) 잠재 결함이지만, JS 미동작 + OS 다크 조합에서 터진다. dark 블록(`semantic.css:76-125`)과 동일 세트로 채울 것.
3. **토큰 우회 하드코딩 색상 4곳**: `components/misc.css:54-57` 코드블록 구문색 `#B7C8A0/#D6A45A/#8FB8CC`, `components/feedback.css:110-112` 토스트 아이콘 `#7FB386/#D6A45A`(semantic.css:110-111의 다크 status 값을 그대로 복붙) — `--color-success` 계열 다크 토큰 또는 전용 토큰으로 승격 필요. `components/feedback.css:124` 스트라이프 `rgba(241,236,227,…)`도 `--paper-white` 기반 color-mix로.

### C. 접근성
4. **버튼 role 덮어쓰기**: `pages/inbox.html:231,251,271,…` — `<button … role="listitem">`. listitem이 button 시맨틱을 제거해 스크린리더에 버튼으로 안 읽힘. `role="list"`/`listitem`은 wrapper로 옮기고 버튼은 버튼으로 둘 것.
5. **segmented 컨트롤 ARIA 불일치**: `index.html:263-267` `role="tablist"` 안의 버튼에 `role="tab"` 없이 `aria-selected` 사용, `pages/dashboard.html:139-143`은 `role="group"` 자식 버튼에 `aria-selected`(무효 조합). `role="radiogroup"`+`role="radio"`+`aria-checked` 패턴으로 통일 권장.
6. **h1이 13px 유틸 타이틀**: `pages/dashboard.html:137` — 페이지 유일 h1이 `.section-head__title`(text-sm, uppercase). 시각 위계상 페이지 타이틀이 없는 것과 같음. 신문식 데스크 헤드라인 h1을 별도로 세우고 section-head는 h2로.
7. **스와치 라벨 8px**: `index.html:19` `font-size:8px` + `mix-blend-mode:difference` — 장식이면 `aria-hidden` 처리, 정보면 최소 10px.
8. 칸반 DnD 키보드 재정렬 불가 — CHECKLIST.md:92에 인지된 항목. 대담화 작업 시 버튼식 이동(↑/↓) 폴백 추가 권장.

### D. 한글 조판 대비 (한글화 시 필수)
9. **`word-break: keep-all` 전무** (전 CSS grep 0건): `index.html:100-103,409-411`의 한글 본문이 이미 `justify+hyphens`로 조판되는데, 한글에는 hyphens가 동작하지 않고 헤드라인(`text-wrap: balance`)은 음절 중간 개행이 발생. 한글화하면 **헤드라인·데크·UI 라벨에 `word-break: keep-all`** 필요(본문 다단은 신문 관행상 음절 개행 허용 가능 — 선택 판단).
10. 한글에는 `font-feature-settings "onum"`(oldstyle figures, `base.css:38`)·이탤릭(`deck`, `base.css:161-167`)이 사실상 무효 — 한글 데크는 이탤릭 대신 굵기·크기 차이로 위계 재설계 필요.

### E. 기타
11. `pages/dashboard.html:318` — `<button aria-current="page">1</button>` 페이지네이션이 전부 데드 버튼(핸들러 없음). 데모로는 허용, 최소한 `aria-label="1페이지"` 부여 권장.
12. 웹폰트 이중 @import(`tokens.css:12` 한글 5종 + `base.css:9` 라틴 4종) — 렌더 블로킹 2연쇄. `<link rel="preconnect">`+단일 요청 통합 권장. 미사용 한글 가중치(Nanum Myeongjo 800 등) 정리.

---

## 5. 대담화 기회 (프로 디자이너라면 이렇게 민다)

### ① 【최우선·한 방】 미국 신문 → 한국 일간지로 정체성 전환
전 페이지 한글화와 동시에 서구 브로드시트 클리셰를 한국 신문 조판 관습으로 치환:
- 제호: "The Ledger" 병기하되 한글 제호 **「원장일보」** 류를 Song Myung으로 전면에. 제호 옆 세로쓰기 슬로건(`writing-mode: vertical-rl`) — 한국 신문 1면의 시그니처.
- 판권·아이랩: "제28권 제172호 · 서울 · 조간" / 날짜 "2026년 7월 4일 금요일(음력 5월 20일)" — `app.js` 데이트라인을 ko-KR로.
- 조판 기호 체계: 기사 구분 ◆, 인용 ※, 관련기사 ▶ — 현재 ticker의 ◆(index.html:45)를 시스템 전체 규칙으로 승격.
- 기사 본문 다단은 그대로(양끝맞춤은 한국 신문도 동일), 헤드라인만 keep-all.
- 효과: '아무 AI나 만드는 NYT 모작'에서 벗어나 30개 테마 중 유일한 '한국 신문 디자인시스템'이라는 기억점 획득.

### ② 1면 구도 파괴 — 진짜 브로드시트 위계
`front-page.html`의 균등 3분할(`:139-159`)을 버리고:
- 12단 그리드에서 lead가 7단+사진 5단을 점유, 2단짜리 세로 기사(사진 없는 텍스트 벽) 1개, 1단 브리프 칼럼("단신" 5연발) 1개 — 기사 간 크기 대비 최소 4:1.
- 접힘선 활용: `--fold-line` 토큰(현재 settings.html:430 단 1회 사용)을 1면 정중앙에 깔아 above/below the fold를 실제 콘텐츠 위계로 사용 — 접힘 아래는 살짝 톤 다운된 종이색.
- 한 기사는 괘선을 뚫고 단을 넘어가는 사진(overlap) — 신문의 '컷 침범' 관행.

### ③ 인쇄 사고(printing artifact) 질감 레이어
DNA인 종이 질감을 '분위기'로 증폭:
- **미스레지스트레이션**: 제호·키커의 red spot에 1px 오프셋 시안/레드 이중 인쇄 흔적(text-shadow 또는 ::before 복제) — 리소그래프가 아닌 '윤전기 오차' 수준으로 미세하게.
- **잉크 번짐**: 헤드라인 hover 시 아주 미세한 blur+darken(잉크가 스미는 느낌), Night Edition에서는 반대로 종이색 활자의 halation.
- 페이지 상하단에 잉크 롤러 자국(수평 그라디언트 밴드)과 종이 가장자리 거칠기 — `--paper-grain`(tokens.css:102) 위에 한 겹 추가.

### ④ 시그니처 모션: 윤전기(press) 메타포
- 페이지 로드: breaking-band가 윤전기에서 뽑히듯 좌→우 wipe-in, 제호는 활판 스탬프처럼 0.96→1 스케일 스냅(`--ease-mech` 이미 존재, tokens.css:236 — 쓰라고 만든 토큰).
- 토스트를 '전보(電報)' 컨셉으로: 타자기식 텍스트 등장 + 마감 도장 스탬프 회전 인.
- 모두 `prefers-reduced-motion` 게이트 하에서 (기존 안전망 base.css:587 재사용).

### ⑤ '호외(號外)' 모먼트
- 404(`not-found.html`)를 영문 "Errata"에서 **호외/정정보도** 컨셉으로: 세로로 큰 "號外" 스탬프, 붉은 2중 테두리, 기울어진 "배달 사고" 도장(`.stamp` 재사용).
- Breaking band 클릭 시 전면 호외 오버레이(모달 시스템 재사용) — 데모 전체의 기억점.

### ⑥ Night Edition을 '야간 조판실'로
현재 다크는 색 반전에 그침(semantic.css:76-125). 야간 인쇄소 분위기: 지면 위쪽에 은은한 작업등 광원(radial-gradient 1개), red-spot-400 액센트에 아주 약한 glow, 하프톤 플레이트를 네거티브 필름 톤으로 — 이미 `[data-theme="dark"] .halftone-plate`(base.css:327-332) 훅이 있어 확장 용이.

---

## 6. 한글 폰트 페어링 (현황 기록)

`tokens.css:12` import + `:131-135` 스택:

| 역할 | 라틴 | 한글 폴백 | 판정 |
|---|---|---|---|
| `--font-masthead` | Playfair Display | **Song Myung** → Noto Serif KR | ✅ 탁월 — 송명체는 신문 제호 그 자체. **보존·전면 승격** |
| `--font-head` | Zilla Slab | **Nanum Myeongjo** → Noto Serif KR | ✅ 적합 (신문 헤드 명조) |
| `--font-body` | Source Serif 4 | **Nanum Myeongjo** → Noto Serif KR | ✅ 적합 (본문 명조 = 신문 DNA) |
| `--font-ui` | Zilla Slab | **Gothic A1** → Noto Serif KR | ✅ 의도적 대비(UI만 고딕) — 한국 신문의 '본문 명조 + 제목·표 고딕' 관행과 일치. 단 3순위 폴백이 Serif KR인 건 모순 → Noto Sans KR로 교정 권장 |
| `--font-mono` | IBM Plex Mono | Noto Sans KR | ✅ 무난 |

**결론**: 페어링 자체는 DNA에 정확히 맞음(서재풍 억지 세리프 아님) — 교체 불요. **문제는 폰트가 아니라 콘텐츠**: 페이지가 전부 영문이라 이 페어링이 index.html에서만 살아있다. 한글화가 이 페어링의 투자 회수 조건. 부수 작업: ① `--font-ui` 3순위 폴백 Noto Sans KR로 수정, ② 미사용 가중치 정리, ③ 한글 헤드라인 `word-break: keep-all` 동반.

---

## 구현 우선순위 제안

1. **P0**: 페이지 10개 한글화 + `lang="ko"` + app.js ko-KR 데이트라인/테마라벨 (지문 #1, 결함 D) — 한국 일간지 재해석(대담화 ①)과 한 몸으로 진행
2. **P0**: inbox.html:307 SVG var() 버그, inbox role 오용, semantic.css auto 블록 보완 (결함 A·B·C)
3. **P1**: 1면 위계 재조판 + fold-line 전면 배치 (대담화 ②) / 헤드라인 스케일 클래스화로 인라인 스타일 제거 (지문 #3)
4. **P1**: 인쇄 질감 레이어 + 윤전기 모션 (대담화 ③④)
5. **P2**: 호외 모먼트, Night Edition 분위기, 갤러리 지면화 (대담화 ⑤⑥, 지문 #2)
