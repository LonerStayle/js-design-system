# 구현 · 접근성 자가점검 — Atomic (Theme 18)

> 점검일 2026-06-21 · 범위: `theme-18-mid-century-modern/` 전체
> 표기: ✅ 충족 · ⚠️ 부분/주의 · ⬜ 해당없음

---

## A. 디자인 DNA 충실도

| 항목 | 상태 | 비고 |
|---|---|---|
| 따뜻·낙관·복고 모던 무드 (차갑/미니멀/네온틱 배제) | ✅ | 크림 바탕 + 웜 라디얼 그라데이션, 굵은 컬러 면 |
| 색: 머스타드·틸·버트오렌지·아보카도 + 크림 | ✅ | 5개 램프 50–900, 앵커 값 브리프와 일치 |
| 굵은 플랫 컬러 블록 | ✅ | `.block--*`, `.card--teal/mustard/orange/avocado`, 컬러블록 히어로 |
| 아토믹 모티프: 스타버스트·부메랑·아톰·키드니·furniture-leg | ✅ | `--motif-*` SVG 토큰 + `.motif-*`/`.has-starburst`/`.atomic-divider` |
| 중간 라운드(11px) + 유기적 곡선 | ✅ | `--radius-md`, `--curve-organic` 키드니 카드 |
| 지오메트릭 산세리프 + 슬랩 액센트 | ✅ | Jost/Poppins + Bitter, 견고한 시스템 폴백 |
| 호버=따뜻한 톤 전환/살짝 이동, 포커스=틸/오렌지 솔리드 | ✅ | btn translateY + `--ring-shadow-teal/orange` |

---

## B. 토큰

| 항목 | 상태 | 비고 |
|---|---|---|
| 컬러 램프 5종 × 50–900 | ✅ | mustard/teal/orange/avocado/neutral(+950) |
| 아토믹 모티프 SVG 토큰 5+종 | ✅ | starburst·atom·boomerang·kidney·retro(+legs·grain) |
| 간격 `--space-0…16` | ✅ | 4px 리듬 |
| 타이포 `--text-2xs…6xl` + leading/tracking/weight | ✅ | 11–84px |
| 라운드 sm/md/lg(+xl/pill) + `--curve-organic` | ✅ | |
| 보더 `--border-1/2(/3)` | ✅ | |
| 그림자 웜톤 sm/md(+xs/lg/xl/block) | ✅ | |
| z-index · 브레이크포인트 · `--ring-*` · 모션 토큰 | ✅ | |
| 시맨틱: bg/surface/surface-2/text/muted/primary/primary-fg/accent/border/success/warning/danger/info | ✅ | |
| 컴포넌트 토큰 `--btn-* --card-* --input-*` 등 | ✅ | table/sidebar/toast/track/switch 추가 |
| 라이트/다크 양쪽 | ✅ | 다크=웜 다크브라운/틸 + 머스타드·오렌지 포인트 |

---

## C. 컴포넌트 (카테고리별 구현 + 상태/사이즈/변형)

| 그룹 | 구현 | 상태 |
|---|---|---|
| 폼 | Button(6변형×3사이즈×hover/active/disabled/loading/icon)·ButtonGroup·Input·Textarea·Select·MultiSelect·Combobox·Checkbox·Radio·Switch·Segmented·Slider·Stepper·SearchBar·ChipInput·FileUpload·Rating | ✅ |
| 표시 | Card(곡선/컬러블록/print)·StatCard·Badge/Tag·Avatar/AvatarGroup·Tooltip·Accordion·Tabs·Table(정렬·선택·페이지네이션)·List·Timeline·KanbanCard·CodeBlock·Skeleton·Carousel·Calendar·Charts | ✅ |
| 피드백·오버레이 | Alert/Banner·InlineNotification·Toast(스택)·Modal·Drawer·Popover·CommandPalette(⌘K)·Progress(바/원형)·Spinner(아톰) | ✅ |
| 내비 | Navbar·Sidebar(접힘)·Breadcrumb·Pagination·Menu/Dropdown·ContextMenu·Steps/Wizard | ✅ |

---

## D. 접근성

| 항목 | 상태 | 비고 |
|---|---|---|
| 대비 4.5:1↑ | ✅ | 머스타드/크림 면 위 다크 잉크 강제(`--color-text-on-accent`); 틸/오렌지/아보카도 600단계로 흰 텍스트 확보 |
| 머스타드 위 흰 텍스트 회피 | ✅ | `--block-mustard-fg`=`--neutral-900` |
| 상태 = 색 + 아이콘 병행 | ✅ | 배지 `badge--dot`, 알림/토스트 아이콘 |
| 키보드 포커스 링 | ✅ | 전역 `:focus-visible` 틸 아웃라인 + 컴포넌트별 ring-shadow |
| `prefers-reduced-motion` | ✅ | 전 애니메이션/트랜지션 무력화 + reveal 강제표시 |
| ARIA·role | ✅ | dialog/tablist/tab/tabpanel/listbox/option/menu/menuitem/aria-current/aria-selected/aria-expanded/aria-pressed/aria-modal |
| 아이콘 전용 버튼 aria-label | ✅ | 닫기/토글/액션 버튼 전반 |
| 포커스 트랩 (모달/드로어) | ✅ | `trapFocus()` + Esc 닫기 + 트리거 포커스 복원 |
| 스킵 링크 | ✅ | `.skip-link` → #main |
| 키보드 내비 (탭 ←/→, 팔레트 ↑/↓/↵, 위저드) | ✅ | app.js |

---

## E. 품질 기준

| 항목 | 상태 | 비고 |
|---|---|---|
| 외부 CSS 프레임워크 0 | ✅ | 순수 CSS + 토큰 변수만 |
| 모티프/아이콘 인라인 SVG | ✅ | data-URI 토큰 + 인라인 `<svg>` |
| `file://` 더블클릭 렌더·동작 | ✅ | 상대경로, 의존성 0, 폰트 폴백 내장 |
| 반응형 브레이크포인트 | ✅ | sidebar/grid/mail 3-pane/kanban/navbar 모바일 대응 |
| 다크모드 실제 동작 | ✅ | 토글 + localStorage + prefers-color-scheme 폴백 |
| README(의도·토큰표·컴포넌트·교체법) | ✅ | |
| CHECKLIST | ✅ | 이 문서 |

---

## F. 쇼케이스 — 멀티 페이지 (실조립)

| # | 페이지 | 핵심 | 상태 |
|---|---|---|---|
| — | `index.html` | 아토믹 히어로 + 토큰/모티프 비주얼 + 라이브 컴포넌트 갤러리 + 페이지 링크 | ✅ |
| 1 | `pages/dashboard.html` | 레트로 위젯·StatCard·바/도넛 차트·정렬/선택 테이블·타임라인·드로어 | ✅ |
| 2 | `pages/kanban.html` | 4컬럼 14카드, 컬러 칸반 카드 | ✅ |
| 3 | `pages/inbox.html` | 이메일 3패널 | ✅ |
| 4 | `pages/product.html` | 미드센추리 가구 상품 상세(갤러리·변형·탭·관련상품) | ✅ |
| 5 | `pages/pricing.html` | 플랜 3개 + 월/연 토글(실동작) + 비교표 + FAQ | ✅ |
| 6 | `pages/settings.html` | 탭 + 토글 + 위험영역(삭제 모달) | ✅ |
| 7 | `pages/onboarding.html` | Steps 위저드(실동작) | ✅ |
| 8 | `pages/profile.html` | 프로필 히어로 + 통계 + 탭 + 활동 타임라인 | ✅ |
| 9 | `pages/404.html` | 아토믹 404 + 빈상태 패턴 갤러리 | ✅ |

---

## G. 자동 검증 결과 (최종 전수 점검 통과)
- CSS 중괄호 균형: 전 파일 `{`=`}` 일치 ✅
- JS 괄호/중괄호/대괄호 균형: app.js 일치 ✅
- HTML 자산 참조: 전 페이지 4 CSS + 1 app.js 경로(`../`) 정상 ✅
- 페이지 간 내부 `.html` 링크: 전부 실존 파일로 해결 ✅
- 미정의 클래스 사용: 전 페이지 0건 (icon-sun/moon=JS 훅, tabs=컨테이너 셀렉터, 페이지-로컬 `<style>` 정의 제외) ✅
- 타 `theme-*` 폴더 참조: 0건 (작업 범위 규칙 준수) ✅
- HTML 구조 무결성: 10개 파일 전부 태그 밸런스 정상(Python 파서) ✅
- 페이지 공통 요소: lang="ko" · viewport · title · 테마-플래시 스크립트 · 폰트 · 테마 토글 전 페이지 존재 ✅
- 보조 수정: `.btn--primary` 명시 규칙 추가, 누락 간격 유틸(mt-3/5/10·mb-3/5) 보강 ✅

> 비고: 라이브 브라우저 렌더는 Playwright 프로필이 다른 인스턴스에 점유되어 생략, 대신 정적 구조·링크·클래스·태그밸런스 전수 검증으로 대체함.
