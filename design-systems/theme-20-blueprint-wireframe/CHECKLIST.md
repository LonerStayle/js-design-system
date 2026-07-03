# CHECKLIST — THEME 20 · BLUEPRINT / WIREFRAME

구현·접근성 자가 점검 결과. (✅ 충족 · ⚠️ 부분/주의 · ⬜ 미해당)

검증일: 2026-06-21 · REV 1.0

---

## A. 폴더 / 스코프 규칙

| 항목 | 상태 | 비고 |
|---|---|---|
| 모든 산출물이 `theme-20-blueprint-wireframe/` 내부에만 위치 | ✅ | `find` 결과 22개 파일 전부 폴더 내부 |
| 다른 `theme-*` 폴더 읽기/쓰기/참조 없음 | ✅ | grep 검증 — 외부 theme 참조 0건 |
| 지정 폴더 구조 일치 | ✅ | tokens/semantic/base/components/app.js/index/pages/README/CHECKLIST |

## B. 토큰 (tokens.css / semantic.css)

| 항목 | 상태 | 비고 |
|---|---|---|
| navy / cyan / neutral 50–900(+950) 풀 램프 | ✅ | 각 11단계 |
| 제도 토큰 (`--grid-*`,`--dimension-*`,`--callout-*`,`--crosshair`,`--registration-*`,`--hatch-*`) | ✅ | tokens.css §드래프팅 모티프 |
| 간격 `--space-0…16` (격자 정렬) | ✅ | 4px/20px 모듈 |
| 타이포 `--text-2xs…6xl` + `--leading-*` + `--tracking-*` | ✅ | 와이드 트래킹 포함 |
| 모서리 `--radius-* = 0` (full만 원형) | ✅ | 직각 원칙 |
| 보더 `--border-1/2/3` 헤어라인 | ✅ | |
| 그림자 `--shadow-* = none` | ✅ | 깊이는 라인 굵기 · `--ink-echo`(무블러)만 예외 |
| `--ring-*`(시안), z-index, 브레이크포인트, 모션 토큰 | ✅ | |
| 시맨틱 역할 매핑 (bg/surface/text/primary/border/status) | ✅ | |
| 컴포넌트 토큰 (`--btn-*`,`--card-*`,`--input-*`…) | ✅ | |
| 라이트/다크 둘 다 (다크=네이비 정본) | ✅ | `[data-theme="light"]` = 드래프팅 화이트 페이퍼 |
| 미정의 변수 참조 없음 | ✅ | 정적 검증 통과 |

## C. 컴포넌트 (카테고리별 전수)

| 카테고리 | 구현 | 상태 |
|---|---|---|
| **폼** | Button(5변형×3사이즈×상태: hover/active/disabled/loading/icon), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox, Checkbox, Radio, Switch, SegmentedControl, Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput | ✅ |
| **표시** | Card(+치수선), StatCard, Badge/Tag, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar | ✅ |
| **피드백/오버레이** | Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification | ✅ |
| **내비** | Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard | ✅ |
| **데이터 viz** | LineChart, Sparkline, BarChart, Donut, Gauge (전부 라인) | ✅ |
| 각 컴포넌트 키보드 조작·ARIA | ✅ | 탭(←→), 모달/드로어(ESC·포커스트랩), ⌘K(↑↓ Enter ESC), 테이블(aria-sort) |

## D. 시그니처 모티프

| 항목 | 상태 |
|---|---|
| 엔지니어링 격자 (미세+굵은 기준선) 배경 | ✅ `.bp-grid` |
| 치수선 (양끝 화살표 + 측정값 라벨) | ✅ `.bp-dim` |
| 주석 콜아웃 (지시선 + 노트) | ✅ `.bp-callout` |
| 크로스헤어 / 등록 마크 (코너) | ✅ `.bp-frame`, `.bp-reg-mark`, `.plate-corner` |
| 단면 해치 (45°) | ✅ `.bp-hatch` |
| 스케일 바 / 좌표 룰러 | ✅ `.bp-scalebar`, `.bp-ruler-x` |
| 직각 + 1px 헤어라인 윤곽선 위주 | ✅ |
| 호버 = 시안 라인 하이라이트 / 포커스 = 시안 2px | ✅ |
| 채움색·그라데이션·소프트섀도·곡선 장식 없음 | ✅ |

## E. 쇼케이스 (멀티 페이지)

| 화면 | 파일 | 상태 |
|---|---|---|
| 허브 (도면 히어로 + 토큰/모티프 + 갤러리 + pages 링크) | `index.html` | ✅ |
| ① 분석 대시보드 (위젯 + 데이터 그리드 + 라인 차트) | `pages/dashboard.html` | ✅ |
| ② 칸반 보드 (드래그&드롭) | `pages/kanban.html` | ✅ |
| ③ 이메일 인박스 (3패널) | `pages/inbox.html` | ✅ |
| ④ 이커머스 상품 상세 (스펙/치수 강조) | `pages/product.html` | ✅ |
| ⑤ 가격표 (3플랜 · 월/연 토글) | `pages/pricing.html` | ✅ |
| ⑥ 설정 (탭 + 토글 + 위험영역) | `pages/settings.html` | ✅ |
| ⑦ 온보딩 위저드 (Steps) | `pages/onboarding.html` | ✅ |
| ⑧ 프로필 / 계정 | `pages/profile.html` | ✅ |
| ⑨ 404 + 빈 상태 (미완성 도면풍) | `pages/404.html` | ✅ |
| 전 페이지 반응형 · 실데이터처럼 채움 | ✅ | |
| 모든 인터랙션 실제 동작 (모달/드로어/토스트/탭/토글/⌘K/다크모드/격자 토글) | ✅ | |

## F. 접근성

| 항목 | 상태 | 비고 |
|---|---|---|
| 본문 텍스트 대비 4.5:1 이상 | ✅ | white(#fff)/cyan-200 on navy-800 — AAA~AA 수준 |
| 격자/치수선/해치 장식 `aria-hidden` | ✅ | 의미는 텍스트 병행 |
| 상태 = 색 + 아이콘/라벨 병행 | ✅ | badge·inline-note 모두 텍스트 라벨 포함 |
| `prefers-reduced-motion` 대응 | ✅ | base.css §12 |
| 또렷한 포커스 링 (`:focus-visible`, 시안) | ✅ | |
| 모달/드로어 포커스 트랩 + ESC | ✅ | app.js `trapFocus` |
| 시맨틱 role/aria (dialog·tab·sort·current·live) | ✅ | |
| skip-link (본문 건너뛰기) | ✅ | 전 페이지 |
| 아이콘 전용 버튼 `aria-label` | ✅ | 정적 검증 통과 |

## G. 기술 품질 기준

| 항목 | 상태 | 비고 |
|---|---|---|
| 외부 CSS 프레임워크 0 | ✅ | 순수 CSS + 토큰 변수 |
| 모티프/아이콘 인라인 SVG (라인) | ✅ | |
| 모든 HTML `file://` 더블클릭 렌더·동작 | ✅ | classic script, 상대 경로, 외부 의존성=Google Fonts 1건(폴백 있음) |
| 반응형 브레이크포인트 | ✅ | 사이드바 모바일 접힘, 그리드 단/복열 전환, inbox/kanban 모바일 재배치 |
| README (의도·토큰표·컴포넌트·교체법) | ✅ | `README.md` |
| CHECKLIST (점검 결과) | ✅ | 본 문서 |

---

## H. 알려진 한계 / 노트

- **DatePicker/Calendar**: 2026년 6월 기준의 경량 렌더. 실제 날짜 라이브러리 미사용(디자인 시스템 데모 목적).
- **차트**: 정적 SVG 좌표(샘플 데이터). 실제 데이터 바인딩은 사용처에서 좌표 생성으로 교체.
- **Google Fonts**: 오프라인/`file://` 에서 폰트 CDN 미접속 시 시스템 모노스페이스로 자동 폴백(레이아웃 영향 없음).
- **드래그&드롭(칸반)**: HTML5 DnD 기반 — 데스크톱 마우스 최적. 터치 환경은 기본 동작만.
- **대비**: 장식용 `--color-text-subtle`(ghosted geometry)는 의도적으로 낮은 대비(비텍스트 보조 정보)이며, 핵심 정보 전달에는 사용하지 않음.

## I. 자가 검증 수행 내역

- 폴더 스코프: `find` + `grep` 로 외부 theme 참조 0건 확인.
- 경로 일관성: pages/ 의 `../` 접두 및 css/js 링크 수 일치 확인.
- 정적 무결성: CSS 미정의 변수, 중복 id, aria 타깃 존재, 내부 링크 유효성 검증(서브에이전트).
- 컴포넌트 전수: 요구 카테고리 대비 누락 0.

**결론: 요구 범위 전 항목 충족. SHEET 20/20 · REV 1.0 승인 준비 완료.**
