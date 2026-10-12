# Design System v2 — 공통 브리프

30개 테마(`design-systems/theme-XX-*`)를 `design-systems-v2/theme-XX-*`에 **처음부터 다시** 만든다.
기존 v1은 참고용(어떤 AI티가 났는지 확인하는 반면교사)이며, 코드·문구·레이아웃을 복사하지 않는다.

## 0. 왜 다시 하나 — v1의 실패

v1은 규칙 문서는 두꺼웠지만 결과물은 전부 같은 뼈대였다:
`eyebrow 라벨 → 거대 2~3줄 헤드라인(한 단어만 강조색) → 부연 문단 → CTA 2개 → 기능 칩 4개 → 가운데정렬 섹션제목+부제 → 둥근 카드 그리드에 토큰 진열`.
테마가 달라도 색만 바뀐 같은 SaaS 랜딩이다. 이것이 "AI티"의 정체다. **v2의 성공 기준은 "테마 30개를 나란히 놓았을 때 레이아웃 뼈대부터 서로 달라 보이는가"이다.**

## 1. 설계 결정은 ui-ux-pro-max 데이터로

감(관성) 대신 스킬 데이터에서 근거를 가져온다. 스크립트:

```
# 로컬(mac): 플러그인 설치 경로. 클라우드: CLOUD-RESUME.md 대로 받은 경로를 UIUX_PY 로 지정
PY=${UIUX_PY:-/Users/seobi/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.13.0/.claude/skills/ui-ux-pro-max/scripts/search.py}
python3 $PY "<2~5 키워드>" --design-system -p "<테마명>" [--variance N --motion N --density N]
python3 $PY "<키워드>" --domain style|color|typography|google-fonts|landing|ux|chart|icons|gsap [-n 5]
```

- 스타일 카탈로그에 해당 테마 스타일이 있으면(Neubrutalism, Swiss Modernism 2.0, Bauhaus, HUD/Sci-Fi FUI, Vaporwave, Y2K, Memphis, Claymorphism, Editorial Grid/Magazine, E-Ink/Paper, Organic Biophilic, Gradient Mesh, Minimalist Monochrome, Sketch Hand-Drawn, Academia, Enterprise SaaS 등) 반드시 `--domain style`로 해당 행을 읽고 Keywords / Effects / Implementation Checklist / Design System Variables / Do Not Use For를 반영한다.
- 결과를 그대로 베끼지 말 것: 데이터는 **근거**, 최종 판단은 테마 DNA. 채택/기각한 항목과 이유를 `DIRECTION.md`에 남긴다.
- 쿼리 결과가 비거나 엉뚱하면 한 번만 좁혀 재시도, 그래도 없으면 "데이터 매치 없음"이라고 명시.

## 2. 파일 계약 (테마당)

```
design-systems-v2/theme-XX-name/
  DIRECTION.md          # 아트 디렉션 (1단계 산출물, 이후 모든 단계의 기준)
  styles.css            # 단일 진입점: @import tokens → semantic → base → components/*
  tokens.css            # 원시 토큰 (색 램프, 폰트 스택, 스케일, 반경, 그림자, 모션)
  semantic.css          # 의미 토큰 + [data-theme="light"|"dark"] 두 모드
  base.css              # 리셋, 한글 조판, 레이아웃 프리미티브, 테마 시그니처 유틸
  components/*.css      # 아래 32개, 파일명 고정
  app.js                # 바닐라 JS 인터랙션 (외부 라이브러리 금지)
  index.html            # 디자인 시스템 스펙 시트 (토큰 + 32개 컴포넌트 시연)
  pages/{404,dashboard,inbox,kanban,onboarding,pricing,product,profile,settings}.html
```

컴포넌트 32개: accordion alert badge breadcrumb button calendar card carousel code command drawer empty form kanban list marquee menu modal motion navbar pagination popover progress sidebar skeleton spinner steps table tabs timeline toast tooltip

- 모든 HTML은 `<link rel="stylesheet" href="styles.css">`(pages는 `../styles.css`)와 `app.js`를 로드. 장면 전용 레이아웃은 index는 `index.css`, 페이지는 `pages/<name>.css` 하나를 추가로 로드해 거기에만 쓴다(공유 파일 동시 수정 충돌 방지). 장면 CSS도 semantic 토큰만 사용. 폰트는 Google Fonts `<link>` (tokens.css @import 금지 — 렌더 블로킹).
- 클래스 네이밍은 테마별 자유이나 테마 안에서는 일관(BEM 권장). 컴포넌트 CSS는 semantic 토큰만 참조(raw hex 금지).
- `app.js` 필수 동작: 테마 토글 `[data-theme-toggle]` + localStorage + `prefers-color-scheme`, **URL `?theme=dark|light`가 최우선**(스크린샷 검증용), 모달/드로어/커맨드팔레트(⌘K)/탭/아코디언/토스트/팝오버/메뉴/캐러셀 등 시연 컴포넌트 동작, Esc 닫기·포커스 트랩.
- FOUC 방지: 각 HTML `<head>`에 테마 결정 인라인 스크립트(쿼리 → localStorage → 시스템).

## 3. AI티 블랙리스트 (발견 시 무조건 수정)

**구조**
- 위 0절의 랜딩 공식 전체, 또는 그 일부(eyebrow+헤드라인+CTA2개+칩)로 시작하는 첫 화면
- 가운데정렬 "작은 라벨 → 섹션 제목 → 한 줄 부제" 섹션 헤더의 반복
- 모든 섹션이 같은 max-width·같은 패딩·같은 카드 그리드 (균질 리듬)
- 브라우저 창 목업(●●● + URL바) 안에 대시보드 넣은 히어로
- 통계 숫자 4개 가로줄("5 / 12px / 9 / 4.5:1")
- 컴포넌트를 둥근 카드에 하나씩 담아 진열하는 갤러리

**시각**
- 테마 DNA와 무관한 인디고/보라 그라디언트, 모든 것에 같은 radius·같은 은은한 그림자
- 크림/오프화이트 배경 + 근거 없는 세리프 (서재·문서 감성) — 해당 DNA(에디토리얼, 아카데미아, 뉴스프린트 등)일 때만 허용
- 흐릿한 radial-gradient 얼룩 배경으로 "분위기" 때우기
- 이모지 아이콘, 의미 없는 장식 SVG 곡선

**카피**
- "~를 한 화면에", "또렷하게", "일관되게", "검증된", "아늑하게" 류 형용사 슬로건
- 디자인 시스템 자체를 홍보하는 문구("토큰 값만 바꾸면 전체가…", "상태까지 설계된 컴포넌트")
- 기능 칩 나열, "무료로 시작하기 / 데모 보기" CTA 쌍
- Lorem, John Doe, Acme, "Card title", "Button" 같은 플레이스홀더

## 4. 대신 이렇게 — 프로 디자이너의 방식

1. **테마 = 하나의 구체적 클라이언트.** DIRECTION.md에서 이 스타일이 실제로 어울리는 한국 서비스/브랜드 하나를 정하고(예: 브루탈리즘 → 독립 레코드샵·인디 페스티벌 예매; 스위스 → 건축사무소 아카이브), 모든 페이지·카피·데이터가 그 세계 안의 실제 장면이 된다. 스타일의 원래 맥락(시대·매체·출처)에서 출발한다.
2. **index.html은 랜딩이 아니라 그 장르의 "스펙 시트".** 브루탈리즘이면 진(zine)/포스터 같은 스펙, 스위스면 그리드 시스템 매뉴얼, HUD면 기체 계기판 매뉴얼, SaaS면 Stripe·Linear 문서 수준의 정갈한 레퍼런스. 첫 화면부터 테마 고유의 구도.
3. **테마마다 다른 레이아웃 문법.** DIRECTION.md에 "이 테마만의 그리드·정렬·여백 규칙"을 명시(예: 12단 비대칭, 풀블리드 컬러 블록, 좌측 고정 인덱스 열, 모듈러 타일, 신문 단 구성 등). 섹션마다 리듬을 바꿔라.
4. **시그니처 1~2개를 끝까지.** 테마를 알아볼 수 있는 결정적 장치(하드 섀도+오프셋 스탬프, 기준선 그리드 노출, 스캔라인 등)를 컴포넌트 전반에 일관 적용. 장식 남발보다 하나를 대담하게.
5. **타이포가 레이아웃을 이끈다.** 스케일 대비를 크게, 한글 디스플레이 폰트도 테마에 맞게(Google Fonts 한글: Black Han Sans, Do Hyeon, Gothic A1, Nanum Myeongjo, Song Myung, Gowun Batang/Dodum, Jua, Gaegu, Nanum Pen Script, Nanum Gothic Coding, IBM Plex Sans KR, Noto Sans/Serif KR, Gasoek One, Orbit, Hahmlet, Dongle 등 — 무드에 맞게 선택하고 근거 기록).
6. **실제 데이터 밀도.** 한국 서비스다운 고유명사·숫자·날짜·금액(₩)·상태. 표/리스트는 8~15행의 그럴듯한 데이터.

## 5. 품질 바 (프로덕션)

- 한글: 모든 HTML `lang="ko"`, 본문 `word-break: keep-all; overflow-wrap: anywhere;`, 한글 본문 line-height 1.6~1.8, 제목 자간 살짝 음수. 보이는 텍스트는 전부 한국어(브랜드 워드마크·고유 양식명·코드 제외).
- 반응형: 360px~1440px. 360/390px에서 가로 스크롤 0, 터치 타깃 44px.
- 접근성: 본문 대비 4.5:1(양 모드), 가시적 focus-visible, 아이콘 버튼 aria-label, 시맨틱 마크업, `prefers-reduced-motion` 존중.
- **SVG: presentation attribute에 `var()` 금지** (`stroke="var(--x)"` 렌더 깨짐). `style="stroke:var(--x)"` 또는 `currentColor`만.
- 금지: `href="#"`, 인라인 onclick, 인라인 grid-template-columns, 외부 JS/CSS 라이브러리(폰트 제외), 이미지 파일(필요하면 CSS/SVG로 그림).
- 링크: index ↔ pages 상호 내비가 실제로 연결.

## 6. 스크린샷 검증 (자기 눈으로 볼 것)

```
SHOT=<레포 루트>/docs/design-v2/shot.sh
$SHOT <html 절대경로> <out.png> [폭=1440] [높이=2400] [theme=dark]
```
- 결과 PNG를 Read 도구로 직접 열어 본다. 데스크톱(1440)·모바일(390) × light/dark.
- 쿼리에 `theme=`가 없으면 shot.sh가 `theme=light`를 붙인다(시스템 다크 설정에 끌려가지 않게). 다크는 `theme=dark`를 명시.
- 폭 < 500(모바일)은 headless Chrome 최소 창 폭 때문에 넓게 그려진 뒤 잘리므로, shot.sh가 playwright-core로 실제 뷰포트 폭을 쓴다. 가로 넘침 판정은 `scrollWidth === clientWidth`로 한다.
- `--virtual-time-budget`에서는 트랜지션이 0프레임에 멈춘 채 찍힐 수 있다. 열린 오버레이 상태는 실제 브라우저로 다시 확인할 것.
- 스크린샷은 `/private/tmp/claude-501/v2shots/<theme>/` 아래에 저장(레포에 넣지 말 것).
- 보조 스크립트(playwright 잡 파일, crop.py 등)는 scratchpad 루트가 아니라 **에이전트별 하위 폴더**(예: `scratchpad/<theme번호><작업명>/`)에 둔다. 병렬 에이전트가 같은 이름의 파일을 덮어쓴다.
- `100vh`/`100svh`를 쓰는 판은 높이를 키운 전체 페이지 샷(예: 1440×4000)에서 뷰포트 높이만큼 부풀어 보인다. 이런 판은 1440×900 · 390×844 실제 뷰포트로 판정한다.
- "코드상 맞다"가 아니라 "화면이 좋아 보인다"가 완료 조건이다.

## 7. 파일럿 교훈 (01·15·30 이후 추가 — 반드시 지킬 것)

완성 레퍼런스: `design-systems-v2/theme-01-neo-brutalism`, `design-systems-v2/theme-30-corporate-clean-saas`. **품질 기준으로만 참고하고 구조·문법은 따라 하지 말 것.**

1. **index 원형은 테마별로 지정된다.** 각 테마에 배정된 "index 원형"(작업 지시에 명시)으로 첫 화면과 전체 흐름을 짠다. **"왼쪽 고정 목차 사이드바 + 문서형 스펙"은 theme-30 전용**이다. 다른 테마의 index에서 쓰지 말 것. "판권/문서 정보 정의 목록" 블록, "§ 번호 + 섹션 제목" 반복도 01·30의 문법이니 피한다. 30개 index가 나란히 놓였을 때 서로 다른 매체처럼 보여야 한다.
2. **감정 톤이 첫 화면에 드러나야 한다.** 포근함, 장난스러움, 럭셔리, 긴장감 같은 테마의 정서를 1초 안에 느낄 수 있어야 한다. 모든 테마를 회색 기술 문서처럼 만들지 말 것(15 휘게 1차 시도가 "포근한 오두막"인데 차가운 사양서처럼 나와서 7점을 받았다). 정보 밀도보다 분위기가 먼저인 테마는 큰 컬러 면, 일러스트(CSS/SVG), 넉넉한 여백으로 정서를 먼저 세운다.
3. **세계관 팩트 시트.** DIRECTION.md에 `## 팩트 시트` 절을 둔다: 기준 날짜(2026년, 요일은 실제 달력과 일치하게 계산), 주소, 영업시간, 인물 이름·역할, 상품·ID 체계, 가격, 수치. 모든 장면 에이전트는 이 값만 쓴다. 파일럿에서는 페이지마다 요일·주소·시간이 달라지고 "○○" 같은 플레이스홀더가 남았다.
4. **공통 셸 일치.** navbar, footer, 사이드바 마크업은 COMPONENTS.md에 "복사해서 쓰는 셸 스니펫"으로 정확히 고정한다. 페이지마다 다른 푸터 3종 같은 불일치가 없어야 한다.
5. **한글과 모노·자간.** 넓은 자간(≥0.05em)과 모노 폰트는 라틴·숫자에만 쓴다. 한글이 섞인 라벨에는 자간 0 또는 한글 폰트를 쓴다(벌어져 보임).
6. **다크 모드도 설계한다.** 다크에서 핵심 브랜드색이 엉뚱한 색(예: 코발트가 라벤더로)으로 바뀌거나 잉크 면이 흰 띠로 뒤집히면 안 된다. 다크 모드는 그 세계의 "밤 장면"으로 설계한다.
7. **index는 상태를 직접 보여준다.** 모달, 드로어, 메뉴, 커맨드 팔레트 같은 오버레이는 글로 설명하지 말고, 열린 상태를 정적으로 렌더한 견본과 실제로 열리는 트리거를 둘 다 둔다.
8. **벽보형 그리드의 빈 칸.** 칸 높이가 안 맞아 생기는 큰 공백을 남기지 않는다(align-items, 내용량을 조정).
9. 터치 타깃 44px(모바일 탭·아이콘 버튼 포함), 모바일 탭 줄이 잘릴 때는 스크롤 힌트(페이드 등)를 둔다.
