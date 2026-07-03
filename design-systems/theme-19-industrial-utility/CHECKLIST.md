# CHECKLIST — THEME 19 · INDUSTRIAL UTILITY

자가 점검 결과. 검증일 2026-06-21.
**자동 검증**: `node --check app.js` 통과 · 모든 HTML DOCTYPE/`<body>`/`</html>` 균형 · 모든 CSS `<link>` 대상 존재 · 모든 내부 `.html` 링크 대상 존재 · 외부 CSS 프레임워크 0(Google Fonts 제외).

---

## A. 산출물 / 폴더 규칙
- [x] 모든 파일이 `design-systems/theme-19-industrial-utility/` 안에만 존재
- [x] 다른 `theme-*` 폴더·공유 파일 미수정 (읽지도 않음)
- [x] 요구된 폴더 구조 100% 충족 (tokens/semantic/base/components/app.js/index.html/pages/README/CHECKLIST)
- [x] 총 21개 파일 — CSS 10, JS 1, HTML 10(index + pages 9)

## B. 토큰 (tokens.css / semantic.css)
- [x] 색 램프 전부: concrete/steel 0~900, safety-yellow·hazard-orange·signal-green·signal-red·signal-blue 50~900
- [x] 산업 모티프 토큰: `--hazard-stripes`(옐로-블랙 대각)·`--caution-tape`·`--rivet`·`--metal-texture`·`--plate-texture`·`--grid-texture`·`--stencil-tracking`
- [x] 간격 `--space-0…16`, 타이포 `--text-2xs…6xl` + `--leading-*` + `--tracking-*`
- [x] 모서리 `--radius-*` 대부분 0, 보더 `--border-2/3/4`
- [x] 그림자 하드 플랫(`--shadow-sm/md/lg/xl`) + 인셋 메탈(`--shadow-inset-metal/-deep`)
- [x] z-index, 브레이크포인트, `--ring-*`(옐로), 모션(`--ease-standard/-snap`, `--duration-fast`)
- [x] 시맨틱: bg/surface/surface-2/text/text-muted/primary(=옐로)/primary-fg(=블랙)/accent(=오렌지)/border/success/warning/danger/info
- [x] 컴포넌트 토큰 `--btn-*`/`--card-*`(메탈 패널)/`--input-*`/`--toggle-*`/`--gauge-*` 등
- [x] **라이트 + 다크 둘 다** (다크 = 차콜 메탈 정본, 라이트 = 라이트 콘크리트 + 안전색)

## C. 디자인 DNA 충실도
- [x] 무채색 베이스 + 안전색 포인트 (옐로/오렌지/그린/레드 신호)
- [x] 직각(`--radius` 0) · 굵은 보더 · 메탈 패널 분할 · 모서리 리벳
- [x] 위험 줄무늬 띠(`.hazard-band`) · 스텐실 대문자(`.stencil`) · 리벳(`.rivet`/`.rivet-corner`) · 케어 라벨(`.care-label`)
- [x] 콘덴스드 헤더(Oswald) + 모노 라벨(JetBrains Mono) + 대문자 와이드 트래킹
- [x] 호버 = 옐로 하이라이트 · 포커스 = 안전 옐로 3px 아웃라인 · 기계적 스냅 모션

## D. 컴포넌트 (카테고리별 전수 구현)
- [x] **폼**: Button(5변형×3사이즈×4상태) · ButtonGroup · SegmentedControl · Input · Textarea · Select · MultiSelect · Combobox · Checkbox · Radio · Toggle · Slider · Stepper · DatePicker(패널) · FileUpload · SearchBar · Rating · ChipInput
- [x] **표시**: Card · StatCard · Badge/Tag · Avatar/AvatarGroup · Tooltip · Popover · Accordion · Tabs · Table · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel · Calendar · Gauge
- [x] **피드백/오버레이**: Alert · Banner · Toast(스택) · Modal · Drawer · CommandPalette(⌘K) · Progress(바/원형) · Spinner · InlineNotification
- [x] **내비**: Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard
- [x] 키보드 조작·ARIA: 탭(화살표/Home/End), 아코디언(aria-expanded), 모달/드로어(ESC·포커스 복귀), ⌘K(↑↓·Enter·ESC), 테이블(aria-sort), 토글(aria-pressed)

## E. 쇼케이스 (멀티 페이지, 실제 조립)
- [x] index.html 허브 — 위험 줄무늬 히어로 + 토큰/모티프 비주얼 + 컴포넌트 갤러리 + pages 링크
- [x] 1) 분석 대시보드 — 게이지/계기판(원형·선형 게이지·LED) + 데이터 그리드 + 막대 차트 + 이벤트 로그 + 히트맵
- [x] 2) 칸반 보드 — 4열 드래그 앤 드롭 + 카운트 갱신 + 새 작업 모달 + 필터 드로어
- [x] 3) 인박스 — 3패널(폴더/목록/읽기) + 작성 모달 + 메일 선택 토글
- [x] 4) 상품 상세 — 갤러리 캐러셀 + 옵션/수량 + 사양 탭 + 리뷰 + 관련 상품
- [x] 5) 가격표 — 플랜 3개 + 월/연 토글(가격 동적 교체) + 비교표 + FAQ
- [x] 6) 설정 — 탭(일반/알림/보안/위험영역) + 토글 + 위험 영역 + 삭제 확인 모달
- [x] 7) 온보딩 위저드 — 5단계 Steps + 이전/다음/완료
- [x] 8) 프로필 — 리벳 메탈 헤더 + KPI 게이지 + 활동 타임라인 + 자격/교육 + 편집 드로어
- [x] 9) 404 + 빈 상태 — 경고 표지풍 + 위험 줄무늬 + 빈 상태 2종
- [x] 모든 인터랙션(모달/드로어/토스트/탭/토글/⌘K/다크모드/드래그/위저드) 바닐라 JS 실제 동작
- [x] 한국어 실데이터(공장/장비/작업지시)로 채움 — 빈 껍데기 없음

## F. 접근성 (품질 기준)
- [x] 안전색-무채색 대비 4.5:1↑ (옐로 위 텍스트 = 블랙 `--color-primary-fg`)
- [x] 상태 = 색 + 아이콘 + 라벨 병행 (예: 정지 badge에 ⚠ 아이콘 + "정지" 텍스트 + 적색)
- [x] `:focus-visible` 안전 옐로 3px 링 / 어두운 패널 `--ring` box-shadow
- [x] `prefers-reduced-motion: reduce` — 전 애니메이션/트랜지션 무력화
- [x] 장식(위험 줄무늬·리벳·메탈·플레이트)에 `aria-hidden="true"`
- [x] role/aria: tablist·tab·tabpanel, dialog+aria-modal, progressbar, aria-sort, aria-pressed, aria-expanded, aria-current
- [x] `.skip-link` 본문 바로가기, 폼 `<label>` 연결, 아이콘 버튼 `aria-label`

## G. 기술 제약
- [x] 외부 CSS 프레임워크 0 — 순수 CSS + 토큰 변수만
- [x] 모티프/아이콘 전부 인라인 SVG
- [x] 모든 HTML 더블클릭(file://)으로 렌더·동작 (상대 경로, CDN 폰트만 네트워크 — 오프라인 시 폴백)
- [x] 반응형 — app-shell/그리드/3패널/칸반/가격표 모두 좁은 화면 브레이크포인트 대응
- [x] `app.js` 이벤트 위임 — 페이지마다 필요한 마크업만 두면 자동 연결

## H. 문서
- [x] README — 디자인 철학·파일 구조·빠른 시작·토큰표·컴포넌트 목록·인터랙션 훅·교체 가이드·접근성 요약
- [x] CHECKLIST — 본 문서

---

## 알려진 한계 / 메모
- 웹폰트(Oswald/Archivo/JetBrains Mono)는 Google Fonts CDN 로드. **오프라인** 에서는 시스템 콘덴스드/모노로 폴백되며 레이아웃은 유지됨.
- DatePicker/Calendar는 정적 그리드(시각·상태 표현) 위주 — 실제 날짜 연산 로직은 데모 범위 밖.
- 차트(BarChart/Sparkline/Gauge)는 순수 CSS/SVG 시각화 — 동적 데이터 바인딩은 `data-value` 속성 + `app.js` 메터 애니메이션으로 처리.
- 드래그 앤 드롭은 HTML5 native DnD 기반(데스크톱 최적) — 터치 DnD는 별도 구현 필요.

## 수동 확인 권장 (브라우저)
- [ ] `index.html` 더블클릭 → 히어로·갤러리·테이블 정렬·모달·드로어·⌘K·테마 토글
- [ ] `pages/dashboard.html` → 게이지/바차트 진입 애니메이션·실시간 시계
- [ ] `pages/kanban.html` → 카드 드래그로 열 이동 시 카운트 갱신
- [ ] `pages/pricing.html` → 월/연 토글 시 가격 숫자 교체
- [ ] `pages/onboarding.html` → 위저드 이전/다음/완료
- [ ] 라이트/다크 양 테마에서 대비 육안 확인
