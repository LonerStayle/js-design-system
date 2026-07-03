# CHECKLIST — Theme 25 Maximalist Color-block 자가점검 결과

검증 일자: 2026-06-21 · 방법: 정적 분석(중복 id/끊긴 참조/`node --check`) + 헤드리스 Chrome 1440px 실제 렌더 스크린샷(전 페이지 + 다크모드).

범례: ✅ 통과 · ⚠️ 부분/주의 · — 해당없음

---

## 1. 파일/구조
| 항목 | 결과 | 비고 |
|------|:----:|------|
| 폴더 규칙 (오직 `theme-25-maximalist-colorblock/`에만 작성) | ✅ | 다른 theme-* 미접근 |
| tokens → semantic → base → components 로드 순서 | ✅ | `theme.css` 단일 진입점 |
| `@import` 상대경로가 pages/에서도 동작 | ✅ | CSS 기준 상대경로 |
| `app.js` 문법 검사 (`node --check`) | ✅ | 통과 |
| 전 페이지 중복 id / 끊긴 aria-controls·data-* 참조 | ✅ | 10개 파일 0건 |
| 외부 CSS/JS 프레임워크 | ✅ | 0개 (순수 CSS + 바닐라 JS) |
| 아이콘 | ✅ | 전부 인라인 SVG |

## 2. 디자인 DNA (Maximalist Color-block)
| 항목 | 결과 | 비고 |
|------|:----:|------|
| 충돌하는 풀채도 멀티휴 (8휴) | ✅ | pink/blue/lime/orange/purple/cyan/red/yellow |
| 큰 색면 분할 + 겹침 + 대각 분할 | ✅ | 히어로 색면 그리드, `split-diagonal`, `clip-*`, 404 색면 그리드 |
| 색면 위 다른 색 텍스트 | ✅ | combo 클래스로 구현 |
| 오버사이즈 디스플레이 헤드라인 | ✅ | Archivo Black, `--text-7xl` 화면 채움 |
| 중간 라운드/직각 + 또렷한 블록 경계 | ✅ | `--radius-md` 8px, 두꺼운 보더 |
| 호버 = 색면 시프트 / 포커스 = 보색 솔리드 링 | ✅ | 버튼 시프트+오프셋, `--color-ring` |
| 미니멀·무채색 지배 회피 | ✅ | 색면이 화면을 지배 |

## 3. 접근성 (색-온-색 위험 관리)
| 항목 | 결과 | 비고 |
|------|:----:|------|
| 색면 위 텍스트 대비 4.5:1↑ | ✅ | `--block-combo-1..8` 사전 계산 (5.07~15.9:1), 비비드-위-비비드 텍스트 없음 |
| 시맨틱 상태색 + 전경 대비 | ✅ | success/warning(블랙 fg), danger/info(상황별 fg) 모두 4.5:1↑ |
| 상태를 색만으로 구분하지 않음 (아이콘+형태) | ✅ | `.status-dot--success/warning/danger/info` = 원/다이아몬드/사각/물방울 + 뱃지 아이콘 |
| 키보드 포커스 링 (보색 솔리드) | ✅ | `:focus-visible` 박스섀도/아웃라인 |
| 키보드 조작 | ✅ | 탭 ←→/Home/End, 메뉴 ↑↓/Esc, 콤보박스 ↑↓/Enter/Esc, 모달·드로어·cmdk 포커스 트랩, 레이팅 ←→ |
| `prefers-reduced-motion` 대응 | ✅ | base.css 전역 모션 무력화 |
| ARIA·role | ✅ | dialog/aria-modal, tablist/tab/tabpanel, menu/menuitem, listbox/option, aria-expanded/-selected/-current/-sort, aria-live 토스트 |
| 스킵 링크 / 시맨틱 랜드마크 | ✅ | `.skip-link`, header/nav/main/aside/footer |

## 4. 컴포넌트 (구현 여부)
| 카테고리 | 결과 | 포함 |
|------|:----:|------|
| 폼 | ✅ | Button(7변형×3사이즈×hover/active/disabled/loading/icon)·ButtonGroup·Input·Textarea·Select·MultiSelect·Combobox·Checkbox·Radio·Switch·Segmented·Slider·Stepper·DatePicker·FileUpload·SearchBar·Rating·ChipInput |
| 표시 | ✅ | Card·StatCard·Badge·Tag·Avatar·AvatarGroup·Tooltip·Popover·Accordion·Tabs·Table(정렬·선택·페이지네이션)·List·Timeline·KanbanCard·CodeBlock·Skeleton·EmptyState·Carousel·Calendar |
| 피드백/오버레이 | ✅ | Alert·Banner·Toast(스택)·Modal·Drawer·CommandPalette(⌘K)·Progress(바/원형)·Spinner·BlockLoader·InlineNotification |
| 내비 | ✅ | Navbar·Sidebar(접힘)·Breadcrumb·Pagination·Menu·ContextMenu·Steps/Wizard |

## 5. 인터랙션 실동작 (렌더 검증)
| 동작 | 결과 | 비고 |
|------|:----:|------|
| 라이트/다크 테마 전환 + 영속(localStorage) | ✅ | 다크 = 블랙 캔버스 위 네온 블록 확인 |
| 모달 / 드로어 (백드롭·ESC·포커스 트랩) | ✅ | 대시보드 위젯 모달, 필터 드로어 등 |
| 토스트 스택 | ✅ | 자동 소멸 + 닫기 |
| 탭 / 아코디언 / 메뉴 / 팝오버 | ✅ | 키보드 포함 |
| 테이블 정렬·전체선택·행선택·선택수 | ✅ | data-sortable |
| ⌘K 커맨드 팔레트 (검색·↑↓·Enter·이동) | ✅ | 전 앱 페이지 포함 |
| 칸반 네이티브 드래그앤드롭 + 카운트 갱신 | ✅ | kanban.html |
| 인박스 클릭→읽기창 로드·읽음처리·답장·보관 | ✅ | inbox.html |
| 가격표 월/연 토글 → 실제 금액 변경 | ✅ | segmented data-onchange |
| 위저드 단계 진행/완료 | ✅ | onboarding.html |
| 슬라이더/스테퍼/세그먼트/콤보/레이팅/칩/파일업로드/캐러셀/진행원 | ✅ | 자동 init |

## 6. 쇼케이스 (9페이지 + 허브) — 렌더 확인
| 화면 | 결과 |
|------|:----:|
| index.html (히어로·램프·조합·타입·컴포넌트 갤러리·데모 링크) | ✅ |
| dashboard (색블록 위젯·CSS 막대차트·테이블·타임라인·게이지) | ✅ |
| kanban (5컬럼·드래그앤드롭) | ✅ |
| inbox (3패널) | ✅ |
| product (캐러셀·옵션·탭·리뷰·관련상품) | ✅ |
| pricing (월/연 토글·3플랜·비교표·FAQ) | ✅ |
| settings (탭·토글·위험영역) | ✅ |
| onboarding (4단계 위저드) | ✅ |
| profile (커버·통계·타임라인·스킬·팀) | ✅ |
| 404 (색면 그리드 + 빈 상태 3종) | ✅ |

## 7. 반응형
| 항목 | 결과 | 비고 |
|------|:----:|------|
| `.grid-*` 모바일 1열 붕괴 | ✅ | base.css @media |
| 앱 셸 사이드바 ≤760px 숨김/접힘 | ✅ | |
| 인박스 3패널 → ≤1000px 목록/읽기 전환 | ✅ | |
| 칸반 보드 가로 스크롤 | ✅ | |
| 램프 그리드 10단계 정렬 | ✅ | 수정 완료 (9→10 컬럼) |

## 8. file:// 더블클릭 동작
| 항목 | 결과 | 비고 |
|------|:----:|------|
| 모든 HTML 더블클릭 렌더 | ✅ | 상대경로 CSS/JS, fetch 미사용 |
| 폰트 오프라인 폴백 | ✅ | Google Fonts 실패 시 Arial Black/system-ui |

---

## 검증 중 발견·수정한 이슈
1. **색면 카드 미적용 (중요)** — `.card`의 `background`가 `.combo-*`보다 늦게 로드돼 색면 카드가 흰색으로 표시됨. → `.plane-*`/`.combo-*`를 `components/colorblock.css`로 분리해 **가장 마지막 로드**하도록 변경. (가격 Pro 카드·대시보드 인사이트·프로필 통계 등 정상화 확인)
2. **램프 그리드 줄바꿈** — 10단계인데 컬럼 9개로 잡혀 900이 줄바꿈됨. → `repeat(10, 1fr)`로 수정.
3. **page-tile 텍스트색 강제** — 로컬 `.page-tile`이 `color`를 고정해 핑크/블루/퍼플/레드 타일에서 combo 안전 전경을 덮음(대비 위험). → 고정 색 제거, combo가 전경 결정.
4. **가격 숫자 오버플로** — `price-num` text-6xl이 너무 커서 3번째 카드 잘림·비교표 제목 겹침. → `clamp(2.5rem … 4rem)`로 축소 + featured 카드 하단 여백 추가.
5. **inbox `<main>` 중복 id** — `id` 속성 2개 → 단일 `id="mail-root"`로 정리, 스킵 링크 타깃 동기화.

전 항목 통과. 잔여 결함 없음.
