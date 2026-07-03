# CHECKLIST · theme-21 Risograph Print

자가 점검 결과. ✅ 통과 · ⚠️ 부분/주의 · ⬜ 해당 없음.
점검일 기준 자동 검증(파일 구조·태그 균형·클래스 정의·자산 경로) + 수기 점검을 병행했습니다.

---

## A. 산출물 / 폴더 규칙
- ✅ 모든 산출물이 `design-systems/theme-21-risograph-print/` 안에만 작성됨.
- ✅ 다른 `theme-*` 폴더 및 공유 파일을 읽거나 쓰지 않음 (격리 준수). *주: 자동 mtime 스캔은 동시 실행 중인 다른 백그라운드 작업의 theme-19/20/22 변경을 잡아내지만, 본 작업의 어떤 도구 호출도 theme-21 밖 경로를 대상으로 하지 않았음.*
- ✅ 요구된 폴더 구조 일치: `tokens.css · semantic.css · base.css · components/ · app.js · index.html · pages/ · README.md · CHECKLIST.md` (+ 단일 진입점 `styles.css`).

## B. 파일 구조 / 빌드 무결성 (자동 검증)
- ✅ HTML 10개(index + pages 9) 전부 `</html>`로 정상 종료.
- ✅ 모든 페이지: 올바른 스타일 경로(`styles.css` / `../styles.css`), 스크립트 경로(`app.js` / `../app.js`), `id="main"`, `skip-link` 보유.
- ✅ 모든 페이지 `<div>` 개폐 균형 일치.
- ✅ `styles.css`의 `@import` 9개 전부 실제 파일로 해석됨.
- ✅ HTML이 참조하는 핵심 컴포넌트 클래스(약 70종) 전부 CSS에 정의 존재 — 발명된 클래스 없음.

## C. 디자인 DNA — Risograph
- ✅ 제한된 형광 스폿: fluoro-pink/blue 주축 + yellow/green 옵션, 각 50~900 램프.
- ✅ 종이 톤 배경(뉴스프린트 `--paper-neutral-100`) / 다크는 잉크 다크 위 형광 발광.
- ✅ 오버프린트: `--overprint: multiply` 토큰 + `.overprint*`/`card--overprint`/히어로 블롭에서 `mix-blend-mode: multiply`로 제3색 생성. 다크모드는 `screen`으로 발광 처리.
- ✅ 그레인: 전역 `body::before` SVG `feTurbulence` 노이즈 오버레이(라이트 multiply / 다크 overlay) + `.grain-heavy`·`card--grain` 국소 텍스처.
- ✅ 미스레지스터: `.misregister`(텍스트 색분리)·`.misregister-block`·`data-misregister-auto`(호버 슬립)·`data-reprint`(재인쇄 플래시).
- ✅ 하프톤: `--halftone` 도트 그라데이션 → 진행바/스켈레톤/아바타/차트바/하프톤 데모에 사용. 그라데이션·소프트섀도 미사용(깊이는 하드 오프셋 `--shadow-flat`).
- ✅ 형태: `--radius-md 6px`(중간 라운드), 잉크 보더 `--border-2/3`, `.ink-edge--rough` 거친 가장자리 옵션.
- ✅ 타이포: Bricolage Grotesque(디스플레이) + Archivo(본문) + Space Mono(스탬프) — 진 포스터풍 초대형 제목.

## D. 토큰
- ✅ 원시: 4색 램프 ×10단계 + paper-neutral, 리소 토큰(grain/overprint/misregister/halftone/paper-tone/ink-edge), 간격 0~16, 타이포 2xs~6xl + leading/tracking/weight, radius, border, shadow, ring, z-index, breakpoint, 모션(ease/duration). 이름 고정.
- ✅ 시맨틱: bg/surface/surface-2/text/text-muted/primary/primary-fg/accent/border/success/warning/danger/info 매핑 + 컴포넌트 토큰(btn/card/input/badge/nav/modal/drawer/toast/table…).
- ✅ 라이트/다크 양쪽 정의(`:root`/`[data-theme="light"]` + `[data-theme="dark"]`).

## E. 컴포넌트 (카테고리 전수)
- ✅ **폼**: Button(6변형×3사이즈×hover/active/disabled/loading/icon) · ButtonGroup · Input · Textarea · Select · MultiSelect · Combobox/Autocomplete · Checkbox · Radio · Toggle · SegmentedControl · Slider · Stepper · DatePicker · FileUpload · SearchBar · Rating · ChipInput.
- ✅ **표시**: Card(overprint/grain/link) · StatCard · Badge/Tag · Avatar/AvatarGroup(halftone) · Tooltip · Popover · Accordion · Tabs · Table(정렬·선택·페이지네이션) · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel · Calendar.
- ✅ **피드백/오버레이**: Alert/Banner · Toast(스택) · Modal · Drawer · CommandPalette(⌘K) · Progress(바/원형 하프톤) · Spinner(+dots) · InlineNotification.
- ✅ **내비**: Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard.

## F. 인터랙션 (app.js · 바닐라 · 의존성 0)
- ✅ 모달/드로어/⌘K: 오버레이 스택, 포커스 트랩, `Esc` 닫기, 포커스 복원, 스크림(그레인 합성).
- ✅ 토스트 스택(자동 소멸 + 닫기), 탭(←/→ 키보드), 아코디언(single 모드), 메뉴/컨텍스트메뉴.
- ✅ 테이블 정렬(숫자/문자)·전체선택·행선택, 사이드바 접기/모바일 오프캔버스.
- ✅ 캐러셀(도트·화살표·스냅), 별점(호버/클릭/키보드 focus), 스텝퍼, 슬라이더 출력, 칩인풋, 콤보박스/멀티셀렉트/데이트픽커, 드롭존(드래그&드롭).
- ✅ 세그먼트/가격 월·연 토글(`data-price-mode`), 복사, 위저드(이전/다음/완료), 미스레지스터 효과, 등장 리빌(IntersectionObserver).
- ✅ 칸반 드래그&드롭(페이지 로컬, 무JS 시 graceful degrade).
- ✅ 테마 토글 10/10 페이지, ⌘K 명령 팔레트 9/10 페이지(온보딩은 집중형 플로우로 의도적 제외).

## G. 접근성
- ✅ 형광 스폿 채움 위 텍스트는 잉크 다크/종이톤 고정 — 형광 위 형광 없음, 본문 대비 4.5:1 목표 충족.
- ✅ 상태 = 색 + 아이콘/텍스트 병행(alert·toast·badge·inline-note에 SVG 아이콘 동반).
- ✅ 전역 `:focus-visible` 2px 스폿 아웃라인, `skip-link`, ARIA role/속성(dialog·tablist·listbox·aria-current·aria-expanded·aria-selected·aria-sort 등), 키보드 조작.
- ✅ `prefers-reduced-motion: reduce`에서 그레인 드리프트·미스레지스터 지터·재인쇄 플래시·리빌·전이 정지. 정적 색분리는 유지(정보 손실 없음).
- ✅ `data-reveal` 숨김은 `html.js` + `no-preference`에서만 적용 → 무JS/감속모드 FOUC·정보 누락 없음.

## H. 쇼케이스 (멀티 페이지 · 실조립)
- ✅ index.html 허브: 진 포스터 히어로(오버프린트 블롭 + 미스레지스터 타이틀) + 토큰/오버프린트/하프톤 비주얼 + 라이브 컴포넌트 갤러리 + 9개 화면 링크 + 동작 모달/드로어/⌘K.
- ✅ pages 9종 전부 실데이터·한국어로 채움(플레이스홀더 없음), 반응형 브레이크포인트 대응:
  1. ✅ 분석 대시보드 — 스폿 스탯카드 + 하프톤 막대/원형 차트 + 정렬·선택 테이블 + 페이지네이션 + 내보내기 모달/필터 드로어.
  2. ✅ 칸반 — 4컬럼 드래그 카드 + 카드 생성 모달 + 보드 드로어.
  3. ✅ 인박스 — 3패널(폴더/리스트/읽기) + 작성 모달.
  4. ✅ 상품 상세 — 리소 포스터 캐러셀 + 옵션/수량 + 탭(상세/사양/리뷰) + 관련상품 + 장바구니 드로어.
  5. ✅ 가격표 — 3플랜 + 월/연 토글 + 비교표 + FAQ 아코디언.
  6. ✅ 설정 — 5탭 + 토글/세그먼트/슬라이더/스텝퍼 + 위험 영역 + 삭제 확인 모달.
  7. ✅ 온보딩 — 4단계 Steps 위저드(이전/다음/완료).
  8. ✅ 프로필 — 오버프린트 배너 + 스탯 + 탭(활동 타임라인/에디션/컬렉션) + 소개/연락/팀/캘린더.
  9. ✅ 404 + 빈 상태 — 초대형 미스레지스터 404 + EmptyState 4종 갤러리.

## I. 품질 기준
- ✅ 외부 CSS 프레임워크 0개 — 순수 CSS 변수 + 바닐라 JS.
- ✅ 모티프/아이콘 전부 인라인 SVG, 그레인은 SVG/CSS 노이즈.
- ✅ 모든 HTML이 `file://` 더블클릭만으로 렌더·동작(상대 경로, 빌드 스텝 없음).
- ✅ README에 디자인 의도·토큰표·컴포넌트 목록·인터랙션 훅·교체 가이드 수록.

---

## 남은 주의/개선 여지
- ⚠️ 대비 4.5:1은 토큰 설계상 충족하도록 매핑했으나, 자동 측정기(axe/Lighthouse)로의 정량 재검증은 사용자가 브라우저에서 1회 돌려보면 좋습니다(특히 옐로 위 잉크/회색 muted 텍스트 경계값).
- ⚠️ 드래그&드롭(칸반)은 포인터 기준입니다. 완전한 키보드 재정렬은 향후 확장 포인트로 남겨둠(현재 카드 자체는 Tab 포커스 가능).
- ⬜ 온보딩의 ⌘K는 의도적으로 제외(집중형 플로우). 필요 시 다른 페이지의 `#cmd` 블록을 복사해 활성화 가능.
