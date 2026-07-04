# CHECKLIST — Theme 05 · Soft Neumorphism

구현 범위와 접근성 자가점검 결과. 대비(contrast)는 WCAG 2.x 상대휘도 공식으로 직접 계산한 **실측값**이다.
검증 방법: 헤드리스 Chrome으로 `index.html` + 9개 페이지를 `file://`로 렌더링(라이트/다크), 콘솔 에러 0, 토큰 색쌍을 스크립트로 대비 계산.

---

## 1. 색 대비 측정값 (WCAG, 기준 4.5:1)

> 베이스(=표면): 라이트 `#e4eaf2` / 다크 `#2a2e37`. 인풋 well: 라이트 `#dde4ee` / 다크 `#262a32`.
> ✅ = AA 본문 통과(≥4.5) · △ = 큰글씨/비텍스트만 통과(≥3) · ❌ = 미달

### 라이트
| 항목 | 색쌍 | 비율 | 판정 |
|---|---|---|---|
| 본문 텍스트 | `#2b3245` / base | **10.55:1** | ✅ |
| 헤딩(strong) | `#1c2030` / base | **13.36:1** | ✅ |
| 보조(muted) | `#54607d` / base | **5.18:1** | ✅ |
| 보조(muted) — 인풋 위 | `#54607d` / well | **4.90:1** | ✅ |
| Primary 텍스트/링크 | `#4f46e5` / base | **5.19:1** | ✅ |
| **Primary 버튼** | 흰글씨 / `#4f46e5` | **6.29:1** | ✅ |
| **Accent 버튼** | 흰글씨 / `#0b6f62` | **6.06:1** | ✅ |
| **Danger 버튼** | 흰글씨 / `#9c2920` | **7.63:1** | ✅ |
| **Success 채움** | 흰글씨 / `#0c6e45` | **6.30:1** | ✅ |
| **Warning 채움** | 흰글씨 / `#7a4f08` | **7.12:1** | ✅ |
| **Info 채움** | 흰글씨 / `#225bbd` | **6.37:1** | ✅ |
| Success 텍스트(soft 배지) | `#0c6e45` / `#d4f4e2` | **5.35:1** | ✅ |
| Danger 텍스트(soft 배지) | `#9c2920` / `#fbdcdc` | **5.95:1** | ✅ |
| Warning 텍스트(soft 배지) | `#7a4f08` / `#fdeecb` | **6.19:1** | ✅ |
| Info 텍스트(soft 배지) | `#225bbd` / `#d6e6fb` | **5.02:1** | ✅ |
| Badge(danger) 텍스트 | `#9c2920` / base | **6.31:1** | ✅ |
| Badge(success) 텍스트 | `#0c6e45` / base | **5.21:1** | ✅ |

### 다크
| 항목 | 색쌍 | 비율 | 판정 |
|---|---|---|---|
| 본문 텍스트 | `#e3e9f3` / base | **11.15:1** | ✅ |
| 헤딩(strong) | `#f3f6fb` / base | **12.55:1** | ✅ |
| 보조(muted) | `#93a0b8` / base | **5.15:1** | ✅ |
| 보조(muted) — 인풋 위 | `#93a0b8` / well | **5.45:1** | ✅ |
| Primary 텍스트/액티브 내비 | `#9aa1f7` / base | **5.71:1** | ✅ |
| **Primary 버튼** | 어두운글씨 `#14161d` / `#9aa1f7` | **7.58:1** | ✅ |
| Success 텍스트 | `#34c98a` / base | **6.39:1** | ✅ |
| Danger 텍스트 | `#f0736a` / base | **4.77:1** | ✅ |
| Warning 텍스트 | `#e0a93a` / base | **6.41:1** | ✅ |
| Info 텍스트 | `#5b9bf0` / base | **4.79:1** | ✅ |
| inline-note 성공(수리) | `#5fd39e` / `#14352a` | **7.19:1** | ✅ |
| inline-note 경고(수리) | `#ecc061` / `#3a2f12` | **7.70:1** | ✅ |
| inline-note 위험(수리) | `#f5938b` / `#3a1f1f` | **6.76:1** | ✅ |
| inline-note 정보(수리) | `#86b6f5` / `#16263e` | **7.26:1** | ✅ |
| 코드 tok-str(수리) | `#22c2a6` / `#262a32` | **6.40:1** | ✅ |
| 코드 tok-key(수리) | `#8f96f7` / `#262a32` | **5.39:1** | ✅ |

> `--color-text-faint`(라이트 `#8595af` 2.5:1)는 **장식·비텍스트 전용**(플레이스홀더 보조, 비활성 아이콘)으로만 사용하며 의미 전달 텍스트에는 쓰지 않는다.

### 고도화 반영 (2026-07 시스템 재작업)
- `signature.css` 점화 + theme.css 번들 배선: 조각 릴리프 씬(`.nm-scene`/`.nm-relief`), 촉각 오브(`.nm-orb`/`.nm-bowl`, 스프링백), pressed moat(`.nm-moat`), carved/embossed 타이포. 신규 깊이 토큰 `--shadow-carved`/`--shadow-hero`(+`--elevation-carved`/`--elevation-hero`).
- 다크 대비 수리: inline-note 4종 텍스트(`-700` 다크 재정의)·코드 `tok-str`(mint-600)·`tok-key`(indigo-500) 전부 ≥4.5로 상향(위 표).
- P0 수리: 닫힌 모달/⌘K 패널 `visibility:hidden`(투명 클릭 가로채기 제거) · 드로어 스크림 전역 폴백(배경차단 복구).
- 폰트: @import 단일화(tokens.css), 죽은 Noto Serif KR 제거, 한글 스택 순서 교정(Gowun Dodum→system-ui 앞). 한글 정제 레이어(keep-all/행간/자간) + 그레인 배경 추가.
- FOUC 조기적용 스니펫 + `.js` 게이트 리빌(base.css). 세그먼트 ARIA radiogroup/aria-checked 정규화(app.js).
- 검증: 360/768/1440 가로 오버플로 0(CDP), 콘솔 에러 0, 라이트/다크 히어로 육안 확인.

### 보정 이력 (소프트 룩의 약점 보완)
초기 측정에서 미달했던 항목을 토큰 값 조정으로 해결:
- 라이트 muted `#647093`(4.05) → `#54607d`(5.18)
- 라이트 상태색 -500을 본문 대비용으로 심화: success `#15935f`→`#0c6e45`, warning `#b7791f`→`#7a4f08`, danger `#d4493f`→`#9c2920`, info `#2f6fd4`→`#225bbd` (다크는 밝은 톤 유지)
- Accent 버튼 채움 mint-500(흰글씨 2.98) → mint-700 `#0b6f62`(6.06)
- 다크 Primary를 텍스트로 쓸 때 indigo-600(3.53) → indigo-400 `#9aa1f7`(5.71)

---

## 2. 접근성 점검
- [x] 본문·라벨 텍스트 라이트/다크 모두 ≥ 4.5:1 (위 표)
- [x] Primary·상태는 **솔리드 색 채움**으로 구분 — 이중 그림자에만 의존하지 않음
- [x] 상태는 **색 + 아이콘/점** 다중 단서 (badge의 `.dot`, alert/toast의 아이콘, 폼 에러의 아이콘)
- [x] 모든 인터랙티브 요소에 뚜렷한 액센트 포커스 링 (`:focus-visible` → `--ring` / `--ring-inset`)
- [x] `prefers-reduced-motion: reduce` 시 애니메이션·트랜지션 전역 비활성
- [x] 모달/드로어: `role="dialog"` `aria-modal` `aria-hidden` 토글 + **포커스 트랩** + Esc 닫기 + 스크롤 락 + 닫을 때 트리거로 포커스 복귀
- [x] 탭: `role="tablist/tab/tabpanel"`, `aria-selected`, **←/→/Home/End 키보드 이동**
- [x] 아코디언/메뉴/팝오버: `aria-expanded` 토글, 외부 클릭·Esc 닫기
- [x] 테이블: 정렬 헤더 `role="button"` + Enter/Space, 행 선택 체크박스(전체선택 포함)
- [x] 커맨드 팔레트: ⌘K/Ctrl-K, ↑/↓ 탐색, Enter 실행, Esc 닫기, 빈 결과 처리
- [x] 아이콘 전용 버튼 전부 `aria-label`, 장식 SVG는 `aria-hidden`
- [x] `Skip to content` 링크 (`.skip-link`)

## 3. 구현 범위 점검
- [x] **tokens.css** — 뉴모픽 베이스/그림자 합성, neutral·indigo·mint·status 램프, space(0–16)·text(2xs–6xl)·radius·z·breakpoint·motion·ring — 라이트+다크
- [x] **semantic.css** — `--color-*` 시맨틱 + `--btn/card/input/switch/track/modal/pop/table/tag-*` 컴포넌트 토큰, bg=surface 동일 규칙 준수
- [x] **base.css** — 리셋, 타이포(Quicksand+Nunito), 레이아웃 유틸(flex/grid/stack/spacing/type/color), 스크롤바, 애니메이션·stagger, reduced-motion, 반응형 유틸
- [x] **components/** 8파일 — 폼·표시·피드백·오버레이·내비 전 카테고리, 상태/사이즈/변형 포함
- [x] **theme.css** — 마스터 @import 번들 (file:// 동작)
- [x] **app.js** — 테마전환(영속)·토스트·모달·드로어·탭·아코디언·메뉴·팝오버·세그먼트·가격토글·스테퍼·평점·칩인풋·테이블 정렬/선택·컨텍스트메뉴·캐러셀·⌘K·스크롤리빌, 전부 data-속성 위임
- [x] **index.html** — 허브: 솟은/눌린 토큰 비주얼 + 색램프 + 타이포 스케일 + 전 컴포넌트 갤러리 + 9페이지 링크
- [x] **pages/** 9개 — 대시보드·칸반·인박스·상품상세·가격표·설정·온보딩·프로필·404+빈상태, 전부 반응형·실데이터·한국어

## 4. 렌더링 검증 (헤드리스 Chrome, file://)
- [x] index.html — 라이트 ✅ (뉴모픽 오브·그림자 데모·램프·갤러리 정상)
- [x] dashboard.html — 라이트 ✅ / 다크 ✅ (KPI·CSS 차트·도넛·정렬테이블·타임라인)
- [x] pricing.html — ✅ (3플랜·featured 강조·비교표·FAQ, 월/연 토글 배선 수정 완료)
- [x] kanban.html — ✅ (4컬럼 눌린 트랙 + 솟은 카드)
- [x] product.html / inbox.html / settings.html / onboarding.html / profile.html / not-found.html — 전부 ✅
- [x] 다크 모드 — 베이스 어둡게 전환 시 그림자/하이라이트 재계산, 텍스트 대비 유지, 테마토글 아이콘 전환
- [x] CSS 중괄호 균형, `<style>`/`<script>` 태그 균형, app.js `node --check` 통과
- [x] 9개 페이지 모두 `../theme.css`·`../app.js` 링크 정확, cmdk·overlay 마크업 포함
- [x] 다른 theme-* 폴더 미참조(교차 오염 0)

## 5. 알려진 범위/한계
- 차트는 순수 CSS(막대·도넛·conic-gradient)로 정적 표현 — 실시간 데이터·SVG 라인차트는 범위 외.
- 칸반 카드는 시각적 grab 상태만 제공(실제 드래그앤드롭 재정렬 JS는 데모 범위 외).
- Google Fonts는 `@import`(네트워크) — 오프라인 시 둥근 시스템 폰트로 우아하게 폴백.
- 컴포넌트는 정적 데모용 마크업 패턴 — 프레임워크 컴포넌트화(React/Vue 등)는 토큰·클래스 재사용으로 별도 진행 가능.
