# CHECKLIST — Aperture (theme-30 Corporate Clean SaaS)

구현·접근성 자가 점검 결과. ✅ 충족 · ⚠️ 부분/주의 · ⬚ 해당없음

---

## A. 디자인 DNA 충족

| 항목 | 상태 | 비고 |
|------|------|------|
| 무드: 신뢰·산뜻·전문 (B2B 대시보드 결) | ✅ | Linear/Vercel/Notion 류 절제된 톤. 장식 배제 |
| 인디고 프라이머리 `#4F46E5` | ✅ | `--indigo-600` 코어, 버튼·링크·포커스·차트 일관 |
| 화이트/라이트 그레이 배경 + 슬레이트 뉴트럴 | ✅ | `--color-bg` = neutral-100, surface = white |
| 상태색(그린/앰버/레드) 또렷하되 절제 | ✅ | subtle 배경 + 텍스트/보더 변형으로 절제 |
| 중간 라운드 8~10px | ✅ | `--radius-md: 9px` 시그니처 |
| 소프트 엘리베이션 그림자 + 미세 보더 | ✅ | `--shadow-xs~2xl` 슬레이트 틴트, `--border-1` |
| 그라데이션은 버튼 호버/헤더 한정 | ✅ | primary 버튼·hero·brand-mark 만 |
| Inter 산세리프 + 명확한 위계 | ✅ | Google Fonts + 강한 시스템 폴백 |
| 데이터 친화 (tabular-nums) | ✅ | 통계·테이블·가격에 `font-variant-numeric` |
| 호버=미세 엘리베이션/틴트, 포커스=인디고 2px 링 | ✅ | 전역 `:focus-visible` 인디고 링 |

## B. 토큰 (이름 고정·풀 스케일)

| 항목 | 상태 | 비고 |
|------|------|------|
| neutral 0–900(+150/850/950) | ✅ | 슬레이트 14단계 |
| indigo / blue / green / amber / red 50–900(+950) | ✅ | 5개 램프 풀 스케일 |
| `--space-0 … 16`(+px/20/24) | ✅ | 4px 기준 |
| `--text-2xs … 6xl` + `--leading-*` + `--tracking-*` | ✅ | 12단계 타입 스케일 |
| `--radius-sm/md/lg/full`(+xs/xl/2xl) | ✅ | |
| `--border-1`(+2/3) | ✅ | |
| `--shadow-xs/sm/md/lg/xl`(+2xl/primary/inner) | ✅ | 소프트 엘리베이션 |
| z-index · 브레이크포인트 · `--ring-*` 인디고 | ✅ | 레이어 표준화 |
| 모션 `--ease-standard/emphasized` · `--duration-fast/base` | ✅ | (+decel/accel/spring, instant/slow/slower) |
| 시맨틱 bg/surface/surface-2/text/text-muted/primary/primary-fg/accent/border/success/warning/danger/info | ✅ | 전부 정의 |
| 컴포넌트 토큰 `--btn-* --card-* --input-*` 등 | ✅ | |
| 라이트(정본) + 다크(슬레이트 다크+인디고, 동일 위계) | ✅ | + `prefers-color-scheme` 자동 |

## C. 컴포넌트 (카테고리별 / 상태·사이즈·변형)

| 카테고리 | 상태 | 포함 |
|----------|------|------|
| 폼 | ✅ | Button(7변형×3사이즈×hover/active/disabled/loading/icon), ButtonGroup, Segmented, Stepper, Input(+adornment/affix), Textarea, Select, Combobox/MultiSelect, Checkbox, Radio(+카드), Toggle, Slider, SearchBar, FileUpload, Rating, ChipInput, DatePicker |
| 표시 | ✅ | Card, StatCard, Badge/Tag, Avatar/Group, Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·필터·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar, Progress |
| 피드백/오버레이 | ✅ | Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification |
| 내비 | ✅ | Navbar, Sidebar(접힘/중첩/모바일), Breadcrumb, Pagination, Menu/Dropdown/ContextMenu, Steps/Wizard |
| 키보드·ARIA | ✅ | 탭 화살표, 모달/드로어/팔레트 포커스 트랩·ESC, role/aria-* |

## D. 쇼케이스 (멀티 페이지 — 실조립)

| # | 페이지 | 상태 | 핵심 |
|---|--------|------|------|
| — | index.html (허브) | ✅ | 히어로 + 미니 대시보드 프리뷰 + 토큰 비주얼 + 컴포넌트 갤러리 + 9페이지 링크 |
| 1 | dashboard.html | ✅ | KPI 4카드 + 선/도넛 차트 + 정렬·선택·필터·페이지네이션 테이블 + 리포트 모달 |
| 2 | kanban.html | ✅ | 4컬럼 18카드 드래그앤드롭, 우선순위 badge·담당자·진행률 |
| 3 | inbox.html | ✅ | 3패널(폴더·리스트·읽기창) |
| 4 | billing.html | ✅ | 현재 플랜·사용량 미터·결제수단·인보이스 테이블·플랜 변경 모달 |
| 5 | pricing.html | ✅ | 플랜 3개 + 월/연 토글(가격 실교체) + 비교표 + FAQ 아코디언 |
| 6 | settings.html | ✅ | 탭(일반/알림/멤버/보안/위험영역) + 토글 + 삭제 확인 모달 |
| 7 | onboarding.html | ✅ | 4단계 Steps 위저드(실제 단계 전환 동작) |
| 8 | profile.html | ✅ | 프로필 헤더·통계·탭·타임라인·히트맵 |
| 9 | 404.html | ✅ | 404 히어로 + EmptyState 변형 데모 + 스켈레톤 |
| 인터랙션 전부 바닐라 JS 실동작 | ✅ | 모달·드로어·토스트·탭·토글·⌘K·다크모드·테이블 정렬/필터 |

## E. 접근성 (이 테마의 품질 기준)

| 항목 | 상태 | 비고 |
|------|------|------|
| 텍스트 대비 4.5:1↑ | ✅ | text(slate-800) on surface(white) ≈ 12:1, muted(slate-500) on white ≈ 4.6:1 |
| UI 요소·포커스 대비 3:1↑ | ✅ | 인디고-600 포커스 링/보더 |
| 상태 = 색 + 아이콘 + 텍스트 병행 | ✅ | badge·alert·toast 모두 아이콘+라벨 |
| 키보드 조작 + 또렷한 포커스 링 | ✅ | 전역 `:focus-visible` 2px 인디고 + offset |
| `prefers-reduced-motion` | ✅ | base.css 전역 차단(애니메이션/트랜지션 0.01ms) |
| 완전한 ARIA·role | ✅ | dialog/tab/tablist/navigation/status/alert, aria-selected/expanded/current/hidden/modal/label |
| 스킵 링크 + 시맨틱 랜드마크 | ✅ | `.skip-link` + `<nav>/<main>/<header>/<aside>` |
| 포커스 트랩 (모달/드로어/팔레트) | ✅ | Tab 순환, ESC 닫기, 닫을 때 트리거로 포커스 복귀 |

## F. 기술 품질

| 항목 | 상태 | 비고 |
|------|------|------|
| 외부 CSS 프레임워크 0 | ✅ | 순수 CSS 변수만 |
| 아이콘 인라인 SVG | ✅ | Lucide 스타일 stroke, currentColor |
| `file://` 더블클릭 렌더·동작 | ✅ | 상대경로 `../theme.css` `../app.js`, 폰트는 폴백 안전 |
| 반응형 브레이크포인트 | ✅ | sm/md/lg/xl, 사이드바 모바일 오버레이, 그리드 축소 |
| 다크/라이트 영속 | ✅ | localStorage |
| JS 의존성 0 · 페이지별 graceful no-op | ✅ | 마크업 없으면 모듈 조용히 건너뜀 |

## G. 폴더 규칙 준수

| 항목 | 상태 |
|------|------|
| 모든 산출물이 `theme-30-corporate-clean-saas/` 안에만 존재 | ✅ |
| 다른 `theme-*` 폴더 미접근·미수정 | ✅ |
| 지정 폴더 구조(tokens/semantic/base/components/app.js/index/pages/README/CHECKLIST) | ✅ |

---

### 알려진 한계 / 비고
- 폰트는 온라인 시 Google Fonts(Inter/JetBrains Mono), 오프라인 시 시스템 산세리프로 폴백 — 위계·간격은 유지됩니다.
- 차트는 정적 데모 데이터(순수 CSS/SVG). 실시간 렌더링 라이브러리는 의도적으로 배제했습니다.
- 드래그앤드롭(칸반)은 포인터 기반입니다. 키보드 재정렬은 향후 확장 포인트.
