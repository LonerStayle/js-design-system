# CHECKLIST — Aero (Y2K / Frutiger Aero) 자가점검

마지막 점검: 전체 빌드 완료 후 스크립트 검증 + 실브라우저(Playwright) 렌더 확인.

범례: ✅ 충족 · ⚠️ 부분/주의 · ⬜ 해당 없음

---

## 1. 구조 / 산출물

| 항목 | 상태 | 비고 |
|------|------|------|
| `tokens.css` (원시 토큰 풀스케일 + 글로스) | ✅ | 색 램프 4종(50–900), 효과·간격·타이포·모서리·그림자·링·모션·z·브레이크포인트 |
| `semantic.css` (시맨틱 + 컴포넌트 토큰, 라이트/다크) | ✅ | `--color-*`, `--btn/card/input/nav/table/...-*`, light + `[data-theme="dark"]` |
| `base.css` (리셋·타이포·하늘/버블 배경·유틸) | ✅ | `.aero-sky`, `.aero-bubbles`, `.glass`, 레이아웃/간격 유틸, reduced-motion |
| `components/*` (10개 파일) | ✅ | buttons, forms, forms-advanced, card, badge, data-display, overlay, feedback, nav, carousel |
| `app.js` (인터랙션 + 버블 + 테마) | ✅ | 24개 모듈, 의존성 0 |
| `index.html` (허브) | ✅ | 히어로 + 토큰 비주얼 + 컴포넌트 갤러리 + 페이지 링크 |
| `pages/*` (9종) | ✅ | dashboard, kanban, inbox, product, pricing, settings, onboarding, profile, empty |
| `README.md` / `CHECKLIST.md` | ✅ | 철학·토큰표·컴포넌트·교체법 / 본 문서 |

**자동 검증 결과**
- CSS 정의된 커스텀 프로퍼티: **303개**. 모든 CSS 파일 **중괄호 균형 OK**.
- "정의되지 않은 var()" 스캔: 실제 누락 0건 (탐지된 `--btn-*`/`--gloss-*`는 주석 텍스트, `--file-progress`/`--slider-fill`은 fallback 보유 런타임 변수).
- 9개 페이지 전부: 자산 경로(`../*.css`, `../app.js`) **전부 해석됨**, 공통 셸 요소(sky·bubbles·navbar·테마토글·커맨드팔레트·app.js) **전부 존재**, `<div>` 태그 균형 OK.

---

## 2. 디자인 DNA (Y2K / Frutiger Aero)

| 항목 | 상태 | 비고 |
|------|------|------|
| 스카이/아쿠아/라임/화이트 중심 팔레트 | ✅ | `#39B6FF` / `#00D6C8` / `#9BE15D` |
| 하늘 그라데이션 배경 + 떠다니는 버블 | ✅ | `--bg-sky` + `.aero-bubbles` (JS 생성) |
| 하이글로스 표면(상단 샤인 + 하단 반사 + 라이트 림) | ✅ | `--gloss-shine`/`--gloss-reflection`/`--gloss-inset`/`--rim-light`, `.glass::before` |
| 젤리 반투명 버튼/토글 | ✅ | `.btn` `::before` 샤인, `.switch` 젤리 썸 |
| 휴머니스트 산세리프(Mulish/Hind) | ✅ | Google Fonts @import + system humanist 폴백 |
| 둥근 형태(중~대 라운드, 알약 버튼) | ✅ | `--radius-md` 14px, 버튼 `--radius-full` |
| 잎/물방울/플레어 인라인 SVG 액센트 | ✅ | 로고·히어로·빈상태 일러스트 |
| 호버 시 부상 + 샤인 강화, 아쿠아 포커스 링 | ✅ | `:hover` translateY, `:focus-visible` `var(--ring)` |

---

## 3. 접근성 (강제 규칙)

| 항목 | 상태 | 비고 |
|------|------|------|
| 글로시 버튼 텍스트 대비 ≥ 4.5:1 | ✅ | `--btn-*-fg`로 흰/딥틸 고대비, 필요 시 미세 text-shadow(가독 보강) |
| `prefers-reduced-motion` 시 버블·반사·전환 정지 | ✅ | `base.css` 전역 미디어쿼리 + JS 버블 생성 자체 스킵 |
| 또렷한 키보드 포커스 링 | ✅ | 전 인터랙티브 요소 아쿠아 글로우 `var(--ring)` |
| 상태를 색만으로 전달하지 않음(색+아이콘/텍스트) | ✅ | alert/badge/toast/stat-delta 모두 아이콘·글리프 동반 |
| ARIA / role / aria-live | ✅ | dialog/aria-modal, tabs, aria-expanded, aria-selected, aria-current, toast aria-live |
| 키보드 조작(방향키·Esc·Tab 트랩) | ✅ | 탭/메뉴/팔레트/캐러셀/별점 방향키, 모달·드로어 포커스 트랩 + Esc |
| 아이콘 전용 버튼 aria-label | ✅ | 닫기/액션 아이콘 버튼 라벨링 |
| 랜드마크/스킵 링크 | ✅ | `header/nav/main/aside/footer`, `.skip-link` → `#main` |

---

## 4. 컴포넌트 커버리지

| 카테고리 | 상태 | 포함 |
|----------|------|------|
| 폼 | ✅ | Button(5변형×3사이즈×상태+loading+icon), ButtonGroup, Input/Textarea/Select, Field, InputGroup, Search, Checkbox, Radio, Switch, Segmented, Slider, Stepper, FileUpload, ChipInput, Rating, MultiSelect, Combobox, DatePicker, Calendar |
| 표시 | ✅ | Card, StatCard, Badge/Tag, Avatar/AvatarGroup, Table(정렬·선택), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Accordion, Tabs |
| 피드백/오버레이 | ✅ | Alert/Banner, Toast, Modal, Drawer, CommandPalette(⌘K), Progress(바·원형), Spinner, InlineNotification, Tooltip, Popover, Menu, ContextMenu |
| 내비 | ✅ | Navbar, Sidebar(접힘), Breadcrumb, Pagination, Steps/Wizard, Carousel |

---

## 5. 쇼케이스 페이지 (전부 반응형·실데이터)

| # | 페이지 | 상태 | 핵심 |
|---|--------|------|------|
| 1 | dashboard.html | ✅ | 사이드바+탑바, 4 스탯카드, 인라인 SVG 라인/면적 차트, 채널 바, 진행 링, 정렬·선택 테이블 |
| 2 | kanban.html | ✅ | 4컬럼 보드, 12 카드(태그·우선순위·아바타·마감), 새작업 모달, 가로 스크롤 |
| 3 | inbox.html | ✅ | 3패널(폴더·목록·본문), 작성 드로어, 첨부, 반응형 collapse |
| 4 | product.html | ✅ | 갤러리 캐러셀, 옵션 스와치/세그먼트, 스텝퍼, 탭(상세·사양·리뷰), 관련상품 |
| 5 | pricing.html | ✅ | 월/연 토글, 3플랜(Pro 강조), 비교표, FAQ 아코디언 |
| 6 | settings.html | ✅ | 탭(프로필·계정·알림·결제·위험), 토글, 위험영역 + 타입투컨펌 모달, 저장바 |
| 7 | onboarding.html | ✅ | 4단계 Steps 위저드, 칩 인풋 초대, 완료 축하 패널 |
| 8 | profile.html | ✅ | 커버+아바타, 스탯, 탭(활동 타임라인·프로젝트·정보), 기여 히트맵, 편집 드로어 |
| 9 | empty.html | ✅ | 404 히어로 일러스트 + 빈상태 4종 패턴 |

---

## 6. 인터랙션 동작 (app.js)

| 동작 | 상태 |
|------|------|
| 다크모드 토글(영속) | ✅ |
| 버블 플로트(reduced-motion 정지) | ✅ |
| 모달·드로어(포커스 트랩·Esc·배경 클릭) | ✅ |
| 토스트 스택(자동 소멸·닫기) | ✅ |
| 탭·아코디언(방향키·단일개방) | ✅ |
| 메뉴·컨텍스트메뉴·팝오버(클릭아웃·Esc) | ✅ |
| 커맨드 팔레트(⌘K/Ctrl-K·필터·방향키) | ✅ |
| 캐러셀(이전/다음·점·방향키·오토플레이) | ✅ |
| 테이블 정렬·행 선택(전체선택 indeterminate) | ✅ |
| 슬라이더 값 버블 + 채움(`--slider-pct`/`--slider-fill`) | ✅ | 빌드 중 변수명 불일치 발견 → app.js가 두 이름 모두 설정하도록 수정 |
| 스텝퍼·별점·칩인풋·콤보·멀티셀렉트 | ✅ |
| 가격 월/연 토글·위저드·복사·사이드바 접기·모바일 내비 | ✅ |

---

## 7. 품질 기준

| 항목 | 상태 |
|------|------|
| 외부 CSS 프레임워크 0 (순수 CSS + 토큰) | ✅ |
| 아이콘 = 인라인 SVG (아이콘 폰트·외부 이미지 0) | ✅ |
| 모든 HTML `file://` 더블클릭 렌더·동작 | ✅ |
| 반응형 브레이크포인트(1280/768/375) | ✅ |
| 라이트/다크 양쪽 | ✅ |
| 컴포넌트는 시맨틱/컴포넌트 토큰만 참조 | ✅ | 하드코딩 색은 장식 그라데이션/SVG 내부에 한정 |

---

## 8. 알려진 주의 / 폴백

- `backdrop-filter`(글래스 블러): 미지원 브라우저는 반투명 단색 배경으로 우아하게 폴백.
- `:has()`(일부 폼 상태): 현대 브라우저 지원. `.is-active`/`[aria-selected]` 폴백 병행 제공.
- Google Fonts: 오프라인 시 system humanist(Segoe UI 등)로 폴백 — 톤 유지.
- `--file-progress`(파일 업로드 진행률): 마크업 인라인 `style="--file-progress:NN%"`로 설정하는 로컬 변수(기본 0%).
