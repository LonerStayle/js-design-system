# CHECKLIST — Theme 12 · Art Deco 자가 점검

> 검증 일자: 2026-06-21 · 정적 검증(태그 균형·토큰 대조·카운트) + 브라우저 렌더 점검.
> ✅ 충족 · ⚠️ 부분/주의 · ⬜ 미적용

---

## A. 산출물 / 폴더 규칙
- ✅ 모든 산출물은 `design-systems/theme-12-art-deco/` 안에만 생성. 다른 `theme-*` 폴더·공유 파일 미접근.
- ✅ 폴더 구조 일치: `tokens.css` · `semantic.css` · `base.css` · `components/*` · `app.js` · `index.html` · `pages/*` · `README.md` · `CHECKLIST.md`.
- ✅ 외부 CSS/JS 프레임워크 0 — 순수 CSS 변수 + 바닐라 JS. 모든 아이콘/장식은 인라인 SVG.
- ✅ 총 ~7,900줄 (CSS 6파일 + app.js + index + 9 pages).

## B. 디자인 DNA (Art Deco)
- ✅ 다크 정본(블랙 `#0E0E10`·딥 네이비) + 메탈릭 골드 `#C9A24B` + 에메랄드 `#0F7A6B` + 크림 `#F3ECDD`.
- ✅ 장식 모티프 전부 구현: 선버스트(conic) · 지구라트 스텝 코너 · 셰브론 · 세로 플루팅 · 방사형 프레임 · 골드 더블 헤어라인.
- ✅ 모서리 거의 직각(`2~4px`) 또는 계단형(`--corner-step`). 골드 헤어라인 프레임.
- ✅ 타이포: Cinzel(디스플레이 캡스) + Cormorant(본문 세리프) + Poiret One(UI) — 오프라인 데코 폴백 포함, `--tracking-caps 0.34em` 와이드 캡스.
- ✅ 시그니처: 선버스트 헤더(모달/히어로/StatCard), 골드 글로우 호버, 골드 2px 포커스 링, 대칭 중심 정렬.

## C. 토큰 (이름 고정 · 풀 스케일)
- ✅ 색 램프: gold/emerald/neutral/navy 각 `50–900` + 상태색(ruby/amber/sapphire). **총 251개 커스텀 프로퍼티 정의.**
- ✅ 메탈릭/장식: `--metal-gold` `--gold-hairline` `--ornament-sunburst` `--ornament-chevron` `--ornament-ziggurat` `--fluting` `--corner-step` 전부 존재.
- ✅ 스케일: `--space-0…16`, `--text-2xs…7xl`, `--leading-*`, `--tracking-*`(캡스 와이드), `--radius-sm/md`+`--corner-step`, `--border-1/2`.
- ✅ 그림자=미세+골드 글로우(`--shadow-sm/md`, `--glow-gold`), `--z-*`, 브레이크포인트, `--ring-*`(골드), 모션(`--ease-emphasized`, `--duration-fast/base/slow`).
- ✅ 시맨틱: `--color-bg/surface/surface-2/text/text-muted/primary(gold)/primary-fg/accent(emerald)/border(골드 헤어라인)/success/warning/danger/info` — 전부 매핑.
- ✅ 컴포넌트 토큰: `--btn-*` `--card-*` `--input-*` `--overlay-*` `--table-*` `--chart-1…5`.
- ✅ 라이트/다크 둘 다(`[data-theme="light"]` = 크림 배경 + 진한 골드/에메랄드, 다크 기본).
- ✅ **정적 검증: 참조된 `var(--*)` 202개 전부 정의됨 — 정의 누락 0개(색 깨짐 없음).**

## D. 컴포넌트 (카테고리별 전수)
- ✅ **폼**: Button(primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading) · ButtonGroup · Input · Textarea · Select · MultiSelect · Combobox/Autocomplete · Checkbox · Radio · Toggle · SegmentedControl · Slider · Stepper · DatePicker · FileUpload · SearchBar · Rating · ChipInput.
- ✅ **표시**: Card(+ornate 골드 프레임) · StatCard · Badge/Tag · Avatar/AvatarGroup · Tooltip · Popover · Accordion · Tabs · Table(정렬·선택·페이지네이션) · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel · Calendar.
- ✅ **피드백/오버레이**: Alert/Banner · Toast(스택) · Modal(선버스트 헤더) · Drawer · CommandPalette(⌘K) · Progress(바/원형) · Spinner · InlineNotification.
- ✅ **내비**: Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard.
- ✅ 키보드 조작: Tabs(←→/Home/End) · Accordion · Modal/Drawer(포커스 트랩·ESC) · CommandPalette(↑↓/Enter/Esc) · Menu(Esc) · Kanban(Space 잡기/←→ 이동).

## E. 쇼케이스 (멀티 페이지 · 실조립)
- ✅ `index.html` = 허브: 선버스트 글래머 히어로 + 토큰/장식 비주얼 + 라이브 컴포넌트 갤러리 + pages 링크.
- ✅ 9개 데모 화면 전부 실데이터로 채움:
  1. ✅ 분석 대시보드 (StatCard 4 + SVG 면적/라인 차트 + progress-ring + 정렬/선택 테이블 + 타임라인 + 리스트)
  2. ✅ 칸반 보드 (4컬럼/16카드, HTML5 드래그앤드롭 + 키보드 대체 + 상세 드로어)
  3. ✅ 이메일 인박스 (3패널: 폴더/목록 10통/읽기 + 작성 모달)
  4. ✅ 상품 상세 (SVG 캐러셀 갤러리 + 옵션 세그먼트 + 탭 + 관련상품 그리드)
  5. ✅ 가격표 (3플랜 + 월/연 토글 연동 + 비교 표 + FAQ 아코디언)
  6. ✅ 설정 (5탭: 계정/알림/보안/결제/위험영역 + 삭제 확인 모달)
  7. ✅ 온보딩 위저드 (4스텝 상태기계 + Steps 인디케이터)
  8. ✅ 프로필/계정 (커버 + 통계 + 탭: 개요/활동 타임라인/프로젝트)
  9. ✅ 404 + 빈 상태 (선버스트 404 히어로 + EmptyState 5종)
- ✅ 인터랙션 동작: 테마전환(10) · 탭(4) · 모달(4) · 드로어(3) · 토스트(9) · 드롭다운(3) · 컨텍스트메뉴(1) · 캐러셀(2) · 캘린더(1) · 콤보박스(갤러리) · ⌘K 팔레트(허브) · 가격 월/연 토글(2).
- ✅ 모든 HTML `file://` 더블클릭만으로 렌더·동작 (빌드/서버 불필요).

## F. 접근성 / 안전
- ✅ 대비 4.5:1: 골드/에메랄드 면 위 텍스트는 `--color-on-gold`/`--color-primary-fg`(진한 톤) 사용. 골드 위 흰색 미사용.
- ✅ 장식 `aria-hidden` 처리 — **387개**. 의미 전달은 텍스트로.
- ✅ 아이콘 버튼 `aria-label` — **236개**. `role`/`aria-*` 속성 — **83개**.
- ✅ skip-link 전 페이지(10) + `id="main"` 본문 랜드마크.
- ✅ `prefers-reduced-motion: reduce` 대응 (tokens 모션 무력화 + base 전역 트랜지션 차단 + animate-in 비활성).
- ✅ `:focus-visible` 골드 2px 포커스 링(`--ring-shadow`) — 키보드 사용자에게만 또렷이.

## G. 정적 무결성 (전 9 페이지 + 허브)
- ✅ DOCTYPE 1개 / `</html>` 닫힘 / `<div>` 균형(open == close, 전 파일).
- ✅ 공유 CSS·JS 링크 경로 정확(`pages/`는 `../` 접두사). 잘못된 경로 0.
- ✅ 반응형: `1024 / 860 / 680` 브레이크포인트 — 그리드 1열 축소, 사이드바 모바일 오프캔버스.

---

## 남은 주의 / 메모
- ⚠️ **브라우저 픽셀 단위 시각 회귀**: 자동 스크린샷은 환경의 브라우저 인스턴스 점유로 일부만 수행. 정적 검증(태그 균형·토큰 대조·div 균형·경로)으로 보강했으며, 마크업·토큰·인터랙션 배선은 모두 통과. 최종 육안 확인은 각 HTML 더블클릭 권장.
- ✅ 폰트는 Google Fonts 우선, 오프라인 시 macOS 데코 폴백(Cinzel→Copperplate/Didot, Cormorant→Didot/Georgia)으로 무드 유지.
- ℹ️ 컴포넌트 CSS는 의미 토큰만 참조 — `tokens.css`/`semantic.css` 두 파일 교체만으로 전면 리스킨 가능(README §5 참조).
