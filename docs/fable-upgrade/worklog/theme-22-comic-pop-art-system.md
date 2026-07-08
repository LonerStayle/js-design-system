# theme-22-comic-pop-art — 시스템 레이어 고도화 워크로그

대상: tokens/semantic/base/components/*.css · app.js · index.html (pages/ 는 미수정 — 페이지 에이전트 담당)
정본 세계관: **제22호 · 코믹 팝아트** (월간 코믹 픽션). 이슈 번호 `#22` 로 전 페이지 통일할 것.

---

## 1. 페이지 에이전트가 반드시 해야 할 일 (내가 안 건드린 것)

1. **9개 페이지 전면 한글화 (P0)** — `pages/*.html` 전부 아직 `lang="en"`. `<html lang="ko">` + 카피/aria/placeholder/USD($→₩) 전수 번안. 톤: index 만화 대사체("맙소사, 하프톤이다!"). app.js 내장 문자열은 이미 전부 한글화 완료했으니 페이지 마크업만 하면 됨.
2. **FOUC 스니펫** — 각 페이지 `<head>` 최상단에 동기 스니펫 추가 + `<html>` 의 하드코딩 `data-theme="light"` 제거. 키는 **`comic-theme`** (app.js 와 동일). index.html 의 head 를 그대로 복사할 것.
3. **inbox 모바일 폴더 패널 (P2)** — `pages/inbox.html` `@media(max-width:980px){.folders-panel{display:none}}` 대안 없음. 드로어 승격 또는 상단 가로 칩으로. (컴포넌트: `.drawer` 재사용 가능)
4. **P4 하드코딩 색** — pricing 의 체크 아이콘 `stroke="#1FA84A"`(×16), `.compare-table .yes{color:#0b7a30}` → 신설 토큰 **`--color-success-text`** 또는 `style="stroke:var(--color-success)"` / `currentColor` 로.
5. **E 데이터 정합** — product 별점 3값 불일치(aria=data=표시 일치시킬 것), pricing feature 중복. 가격은 pricing/영수증 교차 일치.

---

## 2. 신규 / 변경 토큰

### tokens.css
- **`--fixed-white: #fff`** — 채도 잉크(red-600/blue-500 등) 위 흰 글자. 라이트/다크 안 뒤집힘. **컴포넌트에서 `color:#fff` 대신 이걸 쓸 것** (컴포넌트 하드코딩 hex 0건 유지).
- **`--green-700: #0b7a30`** — 초록 "텍스트"용(라이트 AA).
- **`--font-bubble: "Jua",…`** — 말풍선/생각풍선 전용 레터러 손글씨. `.speech-bubble`/`.thought-bubble` 에 이미 배선됨(weight 400).
- **CMYK 오프셋**: `--misreg-cyan`, `--misreg-magenta`, `--misreg-shift-x/y`.
- **하프톤 심도**: `--halftone-atmos-color`, `--halftone-atmos-size` (다크 오버라이드 있음 = 노랑 도트).
- **한글 조판**: `--leading-heading-ko(1.3)`, `--leading-display-ko(1.14)`, `--leading-body-ko(1.7)`, `--tracking-caps-ko(.06em)`.
- 폰트 `@import` **1곳 통합**(tokens.css) — base.css 중복 import 삭제. **Noto Serif KR 제거**(사용 0). Gothic A1/Noto Sans KR 에 900 웨이트 추가(faux-bold 방지).

### semantic.css
- `--table-row-selected` (light blue-100 / dark 딥네이비) — display.css 하드코딩 `#14305c` 대체.
- `--btn-primary-hover-bg / -secondary- / -danger- / -accent-` (P7: hover 가 이제 잉크 어둡게).
- `--menu-danger-hover-bg` (nav 하드코딩 `#2c0d10` 대체).
- `--color-success-text` (light green-700 / dark green-500).

---

## 3. 신규 유틸리티 클래스 (base.css) — 페이지에서 적극 사용

프린트 소품(전부 `aria-hidden="true"` 로 장식 처리):

| 클래스 | 용도 | 사용 예 |
|---|---|---|
| `.halftone-atmos` | 섹션 배경에 하프톤 도트 비네트 심도 | `<section class="section halftone-atmos">` (index #components 참고) |
| `.misreg` | 중형 디스플레이 텍스트에 CMYK 어긋남 | `<span class="display misreg">` (404 "OOPS!" 추천) |
| `.stamp` | 검열/승인 도장 (회전 빨강 잉크) | 색면 위에 올릴 땐 `style="background:var(--paper)"` 필수(대비) |
| `.price-sticker` | 원형 빈티지 가격 스티커 | `<span class="price-sticker">₩0<br>무료</span>` |
| `.barcode` | 표지 furniture 바코드 스트립 | `<div class="barcode">` |
| `.running-head`/`.rh-issue` | 만화 러닝헤드 "제22호 · …" | dashboard/pricing 상단에 판형감 부여 |

주의: `.stamp`·`.running-head` 를 **컬러 배경(hero 등) 위**에 놓으면 다크에서 대비 하락 — 색면 위엔 `background:var(--paper)` 칩을 주거나 `color:var(--color-text)` 강제(index hero 예시 참고).

한글 조판 레이어(`:lang(ko)`)가 base.css 하단에 전역 적용 — `keep-all`, tabular-nums, faux-bold 차단, 디스플레이 행간 보정. **페이지가 `lang="ko"` 되는 순간 자동 적용**.

---

## 4. app.js 동작 변경 (페이지는 마크업만 맞추면 됨)

- **모바일 내비 (P1 해결)**: `.navbar`(안에 `.nav-links`)가 있으면 **app.js 가 `.navbar-toggle` 햄버거를 자동 주입**하고 ≤880px 오프캔버스 패널로 토글(ESC/바깥클릭/링크클릭/리사이즈 닫힘). 페이지는 기존 `.navbar`+`.nav-links` markup 만 있으면 됨. (index 는 markup 에 버튼 직접 삽입 — 참고용, 중복 주입 안 함)
- **한글 의성어**: `data-burst` 는 한글로("쾅!","펑!","콰광!"…), 기본 BURST_WORDS 도 한글. `data-toast-title` 도 한글로.
- **cmdk 리스트박스화 (P6)**: app.js 가 `.cmdk-list`→`role=listbox`, `.cmdk-item`→`role=option`+id, `aria-activedescendant` 관리. 페이지 cmdk 는 `.cmdk-list`/`.cmdk-item` 마크업 유지 + **이모지 아이콘은 잉크 SVG 로 교체**(index cmdk 에 6종 예시 있음). at-rest 정확성 위해 markup 에도 `role="listbox"/"option"` 병기 권장.
- **캘린더 한글화 완료**: 요일 일~토, 제목 "YYYY년 M월", 출력 "YYYY년 M월 D일".
- **파일행/토스트/칩/슬라이드/복사** 문구 전부 한글. 파일행 아이콘도 잉크 SVG.
- **시그니처 리빌 = 스탬프-인**: `[data-reveal]` 이 scale(1.14)+rotate → settle(overshoot). reduced-motion 가드 포함.
- **pricing 토글 기본 문구**: "/월" · "/년 · 20% 할인".

---

## 5. 컴포넌트 변경 요약
- buttons: 변형별 hover 배경 어둠(토큰). display: 코드블록 구문색 `tok-str=green-500 / tok-num=pink-500`(GitHub-Dark 차용 제거), 다크 코드블록 보더 소실 버그 수정(흰 잉크 유지). table 선택행 토큰화. `.list-item .li-ico`·`.file-row .file-ico/.file-name` 추가.
- **강점 Top3 보존**: 모티프 토큰화(증폭), 인터랙션 시그니처(버스트/프레스/모달 바운스/토스트 말풍선) 전부 유지, 대비 엔지니어링(주석 수치 + 다크 잉크 플립) 유지·강화(--fixed-white 로 정식화).
- **DNA 회귀 없음**: 그라데이션/소프트섀도/파스텔 미도입. 하드 오프셋 잉크 섀도·overshoot 이징 유지.

---

## 6. 검증 결과 (grep)
SVG var() 0 · index lang=ko · components 하드코딩 hex 0(intentional 제외) · 인라인 grid 0 · index filler($/ago) 0 · keep-all 존재 · Noto Serif KR 0 · app.js node -c 통과 · 전 CSS 중괄호 균형 · 신규 토큰 정의/참조 매칭.
미검증: 4뷰포트×2테마 육안(브라우저 점유로 정적 확인만) — 페이지 에이전트/최종 QA 시 라이트·다크 hero, 모바일 햄버거, cmdk 키보드 순회 육안 필요.
