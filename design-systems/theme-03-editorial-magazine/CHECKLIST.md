# CHECKLIST — Editorial Magazine (Theme N°03) 자가점검

검증 환경: headless Chrome 렌더링(라이트·다크), `node --check` 문법 검사, ID 참조 정합성 스크립트, WCAG 대비 계산. 날짜: 2026-06-21.

---

## A. 디자인 DNA 준수

- [x] 종이 크림 배경(`#F7F3EC`) + 잉크 블랙 텍스트(`#1A1714`) — 라이트 기본
- [x] **단일 액센트** 버건디(`#8E2A2A`)만 사용, 나머지는 세피아 그레이 + 저채도 잉크톤
- [x] 네온/하드섀도/요란한 그라디언트 없음 — 그림자는 미세 소프트(`--shadow-xs/sm/md`)만
- [x] 모서리 거의 0 — `--radius-md` = 2px (규칙 ≤2px 준수)
- [x] 1px 헤어라인 룰(`.rule`, `border --border-1`)로 섹션 구분
- [x] 고대비 세리프 디스플레이(Fraunces) + 가독 세리프(Newsreader) + 산세 스몰캡스(Inter)
- [x] 시그니처: 드롭캡 · 풀쿼트 · 키커/바이라인 스몰캡스 · 멀티컬럼+하이픈네이션 · 피겨 캡션 · 대형 에디토리얼 넘버 · 비대칭 레이아웃 — 전부 구현 및 쇼피스(article.html)에서 총동원
- [x] 종이 그레인 텍스처(인라인 SVG noise, 라이트/다크 강도 자동)

## B. 토큰 (요구 이름 고정 · 값만 DNA)

- [x] `tokens.css` — warm-neutral 50~950(11), crimson 50~950(11), 잉크톤 상태색
- [x] `--space-0` … `--space-16`
- [x] `--text-2xs` … `--text-7xl` + `--leading-*` + `--tracking-*`(라벨 와이드/디스플레이 타이트)
- [x] `--border-1`(헤어라인) · `--radius-sm/md/lg`(전부 작게) · `--shadow-xs/sm/md`
- [x] z-index · 브레이크포인트 · `--ring-*`(버건디) · 모션(`--ease-*`, `--duration-*`)
- [x] 컬럼 토큰 `--columns` / `--column-gap`
- [x] `semantic.css` — bg/surface/surface-2/text/text-muted/primary/primary-fg/accent/border/success/warning/danger/info (저채도 잉크톤)
- [x] 컴포넌트 토큰 `--btn-*` `--card-*` `--input-*` 등
- [x] 라이트/다크 둘 다 (다크 = 짙은 잉크 배경 + 크림 텍스트 + 버건디 유지)

## C. 컴포넌트 (카테고리별 전부)

- [x] **폼**: Button(5변형 × 3사이즈 × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect/Combobox, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput
- [x] **표시**: Card, StatCard, Badge/Tag, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar
- [x] **매거진 특화**: ArticleHeader, PullQuote, DropCap, FigureWithCaption, BlockquoteCitation (+ SectionHead/Masthead/Footnote)
- [x] **피드백/오버레이**: Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification
- [x] **내비**: Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard
- [x] 키보드 조작·ARIA: 탭(화살표 roving tabindex), 메뉴(화살표/Esc), 모달·드로어(포커스 트랩·Esc), ⌘K(↑↓/Enter/Esc), 아코디언(aria-expanded), 테이블(aria-sort/aria-selected)

## D. 쇼케이스 (멀티 페이지, 실제 조립)

- [x] `index.html` 허브 — 표지 마스트헤드 + 타이포/컬럼/컬러 토큰 비주얼 + 컴포넌트 갤러리 + 데모 링크
- [x] 1) 대시보드 2) 칸반 3) 인박스 3패널 4) 상품 상세 5) 가격표 6) 설정 7) 온보딩 위저드 8) 프로필 9) 404+빈상태 10) 롱폼 아티클(쇼피스)
- [x] 모든 페이지 반응형 + 실데이터(편집국/매거진 맥락 한국어)
- [x] 인터랙션 실동작: 모달/드로어/토스트/탭/토글/⌘K/다크모드/칸반DnD/테이블정렬·선택/가격토글/캐러셀/스텝퍼/평점/콤보박스/파일드롭 — 전부 바닐라 JS(app.js)
- [x] headless Chrome 렌더 확인: index, dashboard, article, kanban, pricing, product, inbox, onboarding, profile, settings, 404 + 다크모드 — 전부 정상 레이아웃

## E. 품질 / 접근성 — 측정값

### 대비 (WCAG, 계산 검증)
| 조합 | 대비 | 판정 |
|------|-----:|------|
| 라이트 본문 text/bg | 16.14:1 | AA 본문 ✓ |
| 라이트 muted/bg | 5.38:1 | AA 본문 ✓ |
| 라이트 primary/bg | 7.55:1 | AA 본문 ✓ |
| 라이트 흰 텍스트/primary 버튼 | 8.35:1 | AA 본문 ✓ |
| 라이트 danger 버튼 텍스트 | 10.61:1 | AA 본문 ✓ |
| 라이트 링크/bg | 9.59:1 | AA 본문 ✓ |
| 라이트 success/warning/info/danger-fg ↔ 각 bg | 5.7~8.6:1 | AA 본문 ✓ |
| 다크 본문 text/bg | 16.87:1 | AA 본문 ✓ |
| 다크 muted/bg | 6.85:1 | AA 본문 ✓ |
| 다크 primary/bg | 4.89:1 | AA 본문 ✓ |
| 다크 잉크 텍스트/primary 버튼 | 4.67:1 | AA 본문 ✓ |

> 본문·핵심 텍스트는 라이트·다크 모두 **4.5:1 이상**. `--color-text-subtle`(라이트 ~2.7:1)은 플레이스홀더/장식 등 **비핵심 텍스트 전용**(WCAG 면제 범주).
> 초기값에서 라이트 muted(3.9:1)·다크 버건디(4.1~4.3:1)가 기준에 약간 미달하여 muted를 `#6E6252`, 다크 primary를 `#CB6457`로 보정해 통과시킴.

### 기타
- [x] 키보드 포커스 링 — 버건디 2px(`:focus-visible`), 모든 인터랙티브 요소
- [x] `prefers-reduced-motion: reduce` — 애니메이션/트랜지션/스무스 스크롤 비활성
- [x] ARIA/role — dialog(aria-modal), tab/tabpanel, menu/menuitem, aria-current, aria-expanded, aria-sort, aria-selected, status/alert(live region)
- [x] 시맨틱 랜드마크 — header/main/nav/aside/footer + skip-link
- [x] 아이콘 버튼 `aria-label`, 폼 `<label for>` 연결(ID 참조 정합성 스크립트 0 오류)
- [x] 외부 CSS 프레임워크 0 · 순수 CSS 변수만 · 아이콘 전부 인라인 SVG
- [x] 모든 HTML 더블클릭(`file://`)으로 렌더·동작 — 외부 이미지 0(SVG 플레이스홀더), 폰트는 오프라인 시 Georgia/system 폴백
- [x] 반응형 — 640/768/880/1024/1280px 브레이크포인트

## F. 코드 검증

- [x] `app.js` `node --check` 통과 / 모든 페이지 인라인 스크립트 문법 통과
- [x] CSS 링크 경로 정합 — `pages/`는 `../` (10/10), `index.html`은 루트 상대
- [x] ID 참조 정합성(modal-open/sidebar-toggle/drawer/aria-controls/label-for/context-menu) — **0 오류**
- [x] 작업 범위 — 산출물 전부 `theme-03-editorial-magazine/` 안. 다른 theme-* 폴더 미접근/미수정

---

## 알려진 한계 / 메모

- 글꼴은 Google Fonts CDN 로드. **오프라인**에서는 폴백(Georgia/Times, system-ui)으로 렌더되며 무드는 유지되나 광학 사이징/고대비 디테일은 온라인에서 가장 잘 드러난다.
- 차트는 정적 SVG/CSS(데모용 고정 데이터). 실데이터 연동 시 path/height 값만 교체.
- 인박스 항목 전환·온보딩 단계 이동·상품 썸네일 교체·외관 테마 라디오는 페이지 고유 동작이라 각 페이지 하단 소형 인라인 스크립트로 처리(공유 인터랙션은 전부 app.js).
- `--color-text-subtle`은 의도적으로 저대비(장식/플레이스홀더 전용). 본문에 쓰지 말 것.
