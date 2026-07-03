# CHECKLIST — Theme 13 · Dark Luxury 자가점검

> 구현·접근성 자가점검 결과. ✅ 통과 · ⚠️ 주의/제한 · ☐ 미적용.
> 검증 방법: 로컬 HTTP 서버 + 헤드리스 브라우저(Chromium)로 9개 페이지 전수 렌더, 콘솔 에러 확인,
> 데스크탑(1440px)·모바일(390px) 뷰포트 스크린샷, 주요 인터랙션 DOM 상태 측정.

## 1. 산출물 인벤토리

| 항목 | 상태 |
|------|------|
| `tokens.css` (원시 토큰 — 색/간격/타이포/모서리/그림자/모션/z/bp) | ✅ |
| `semantic.css` (시맨틱 + 컴포넌트 토큰, 다크 정본 + 라이트) | ✅ |
| `base.css` (리셋·폰트·타이포·여백 유틸·포커스·리빌·reduced-motion) | ✅ |
| `theme.css` (단일 링크 집계자) | ✅ |
| `components/` (10개 파일, 54+ 컴포넌트) | ✅ |
| `app.js` (모든 인터랙션 + 테마 전환, 자가 초기화) | ✅ |
| `index.html` (허브: 히어로 + 토큰 비주얼 + 갤러리 + 페이지 링크) | ✅ |
| `pages/` 9개 (dashboard·kanban·inbox·product·pricing·settings·onboarding·profile·404) | ✅ |
| `README.md` / `CHECKLIST.md` | ✅ |

## 2. 디자인 DNA 충실도 (Dark Luxury)

| 기준 | 결과 |
|------|------|
| 딥 차콜/블랙 배경(#0C0C0E / #141416) + 소프트 화이트(#EDEAE3) | ✅ |
| 골드/샴페인(#BFA06A / #CBB994) 액센트 — 포인트로만, 무채색 위주 | ✅ |
| 거의 직각 모서리(--radius-md = 3px ≤ 4px) | ✅ |
| 얇은 골드/뉴트럴 헤어라인 보더(--border-1 = 1px) | ✅ |
| 깊고 부드러운 다크 섀도 + 미세 골드 글로우 | ✅ |
| 고대비 디스플레이 세리프(Cormorant Garamond) + 차분한 산세리프(Archivo) | ✅ |
| 광활한 여백(상위 스페이싱 160~480px) | ✅ |
| 대문자 와이드 트래킹 라벨(--tracking-widest 0.24em) | ✅ |
| 호버 골드 언더라인/페이드, 포커스 골드 1.5px 링, 느린 우아한 모션 | ✅ |
| 장식·패턴·요란한 색·과한 모션 배제 | ✅ |

## 3. 접근성

| 기준 | 결과 | 비고 |
|------|------|------|
| 다크 위 본문 텍스트 대비 4.5:1↑ | ✅ | #EDEAE3 on #0C0C0E ≈ 15:1 |
| 골드 라벨/텍스트 대비 4.5:1↑ | ✅ | #BFA06A on #0C0C0E ≈ 7.9:1 (AA). 소형 텍스트엔 화이트 사용 |
| 골드 솔리드 버튼 위 블랙 텍스트 대비 | ✅ | #0A0A0C on #BFA06A ≈ 7:1 |
| 또렷한 포커스 링(`:focus-visible` 골드 아웃라인) | ✅ | 전 인터랙티브 요소 |
| `prefers-reduced-motion: reduce` 시 모든 모션 정지 | ✅ | 트랜지션/애니메이션 0.001ms, 리빌 즉시 표시 |
| 상태를 색 + 아이콘 병행으로 표현 | ✅ | alert/badge-dot/inline-note/토스트 모두 아이콘 동반 |
| ARIA role/state (dialog·tablist·tab·aria-expanded·aria-selected·aria-current 등) | ✅ | 모달/탭/아코디언/드롭다운/내비 |
| 키보드 조작 | ✅ | 탭 방향키, 오버레이 Esc 닫기 + 포커스 트랩, ⌘K, 위저드/스테퍼 |
| 폼 라벨 연결 + 에러 텍스트(아이콘 병행) | ✅ | `.field__label` / `aria-invalid` / `.field__error` |
| 스킵 링크 | ✅ | `.skip-link` → `#main` |
| 비교표 아이콘에 `sr-only` 대체 텍스트 | ✅ | pricing 비교표 포함/미포함 |

## 4. 기술 품질

| 기준 | 결과 |
|------|------|
| 외부 CSS 프레임워크 0 — 순수 CSS 변수 + 바닐라 JS | ✅ |
| 의존성/빌드 스텝 0 | ✅ |
| 아이콘 전부 인라인 SVG(가는 라인) | ✅ |
| 이미지 파일 의존 0 (갤러리는 그라데이션 + 헤어라인 플레이스홀더) | ✅ |
| 더블클릭(`file://`)만으로 렌더·동작 | ✅ | anti-FOUC 인라인 테마 스크립트 포함 |
| 반응형 브레이크포인트 대응 | ✅ | 데스크탑/모바일 검증 (사이드바 접힘, 3패널→1패널, 그리드 스택) |
| 콘솔 에러 0 (favicon 404 제외) | ✅ | 9개 페이지 모두 |
| 라이트/다크 테마 전환 + localStorage 지속 | ✅ |

## 5. 컴포넌트 인터랙션 동작 검증

| 인터랙션 | 결과 |
|----------|------|
| 테마 토글 (다크 ⇄ 라이트, 지속) | ✅ |
| 모달 열기/닫기 (백드롭·Esc·포커스 트랩·복원) | ✅ |
| 드로어 (우/좌 슬라이드, 공유 오버레이) | ✅ |
| 토스트 스택 (variant·자동 소멸·수동 닫기) | ✅ |
| 커맨드 팔레트 ⌘K (필터·방향키·Enter·액션) | ✅ |
| 탭 (방향키 + ARIA, 패널 전환) | ✅ settings 세로 탭 포함 |
| 아코디언 (single 모드, max-height 애니메이션) | ✅ |
| 드롭다운/메뉴/컨텍스트 메뉴 (외부 클릭·Esc 닫기) | ✅ |
| 세그먼트 컨트롤 (`segmentchange`) | ✅ |
| 슬라이더 (골드 필 + 값 출력) | ✅ |
| 스테퍼 (+/- 범위 제한) | ✅ |
| 테이블 (정렬·전체선택·행선택·페이지네이션) | ✅ |
| 캐러셀 (prev/next·dots·키보드) | ✅ product 갤러리 |
| 위저드 (단계 전환·활성/완료 상태·완료 토스트) | ✅ onboarding |
| 가격 월/연 토글 (data-price 스왑·절약 배지) | ✅ pricing |
| 진행 원 (stroke-dashoffset 애니메이션) | ✅ dashboard |
| 스크롤 리빌 (IntersectionObserver + 안전망) | ✅ |

## 6. 검증 중 발견·수정한 이슈

| # | 이슈 | 원인 | 조치 |
|---|------|------|------|
| 1 | 스크롤 없는 뷰·`display:none` 패널 내 `[data-reveal]`이 영구 숨김 가능 | IO가 화면 밖/숨김 요소를 발화 못 함 | `app.js initReveal`에 안전망 2종 추가(근접 요소 즉시 표시 + 무스크롤 fallback 타이머). 검증: 무스크롤 상태에서 15/15 표시 |
| 2 | pricing 비교표 셀이 세로로 붕괴 | `td`에 전역 유틸 `.center`(=`display:flex`) 적용 → `table-cell` 파괴 | pricing `<style>`에 `td.center{display:table-cell}` override + 근본 방어로 `components/data.css`에 `.table td.center/th.center` 가드 추가. 검증: 4셀 동일 행 정렬 복원 |
| 3 | product 페이지에서 모바일 메뉴(`.nav-mobile`)가 데스크탑에도 노출 | 데스크탑 숨김 CSS가 index 인라인에만 존재 | `components/navigation.css`에 `.nav-mobile{display:none}` + 모바일 `.is-open` 표시 규칙으로 승격. 검증: fresh 로드 시 `display:none` |

## 7. 알려진 제한 / 비고

- 웹폰트(Cormorant Garamond·Archivo·IBM Plex Mono)는 Google Fonts에서 로드합니다. 오프라인/`file://`에서는 시스템 세리프·산세리프로 우아하게 폴백됩니다(토큰의 폰트 스택에 정의됨).
- 차트는 디자인 데모용 정적 인라인 SVG입니다(실데이터 바인딩 아님).
- 칸반 카드의 드래그 앤 드롭은 시각적 어포던스(grab 커서·hover)만 제공하며 실제 재정렬 로직은 데모 범위 밖입니다.
- `favicon.ico` 404는 서버에 파비콘을 두지 않아 발생하는 무해한 로그이며 페이지 동작과 무관합니다.

— 점검 기준일: 2026-06-21
