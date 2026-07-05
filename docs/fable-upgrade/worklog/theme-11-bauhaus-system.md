# theme-11-bauhaus · 시스템 레이어 고도화 노트 (페이지 에이전트용)

> 시스템 레이어(tokens/semantic/base/components/index.html/app.js)만 수정함. pages/는 미변경.
> 아래 계약을 pages/ 9개에 일관 반영할 것. 핵심만.

## 1. 다크모드 테두리 소실(P1) — 전역 해결. 페이지도 같은 규칙 준수
- **구조 테두리·구분선·라인 채움은 절대 `var(--black)` 금지 → `var(--color-border)`**(라이트=검정, 다크=흰색 자동 플립). 컴포넌트 CSS 전수 치환 완료.
- **"검정 바탕 + 흰 글자"의 강조/선택 표면**(활성 탭·활성 네비·정렬 헤더·칩·세그먼트 선택·pagination 활성·아코디언 열림·cmdk 활성)은 → `background: var(--color-surface-inverse); color: var(--color-text-inverse)`. 다크에서 흰 블록+검정 글자로 뒤집혀 항상 보임.
- **의도된 색면 블록은 그대로**: 노랑 블록 위 검정 테두리(`.banner--accent`), `card--fill-black`, `price-card.is-featured`(검정), 노랑/파랑/빨강 블록의 흰/검 텍스트는 유지. (노랑 위엔 항상 검정 텍스트 — DNA)
- 페이지 인라인 스타일에 `border:… solid var(--black)`, `background:var(--black)`+흰텍스트가 있으면 위 규칙대로 치환.

## 2. FOUC + JS 게이트 (모든 페이지 `<head>`에 필수)
`<html>`에서 `data-theme="light"` 하드코딩 제거하고, 스타일시트보다 먼저 아래 삽입 (키는 `bauhaus-theme`, app.js와 동일):
```html
<script>(function(){try{var t=localStorage.getItem('bauhaus-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}document.documentElement.classList.add('js');})();</script>
<noscript><style>[data-reveal]{opacity:1!important;transform:none!important;}</style></noscript>
```

## 3. 시그니처: 도형 테마 토글 (원↔사각 모핑) — 임시 아이콘 토글 전부 교체
`ico-home`/`ico-gear`로 대충 쓰던 테마 토글을 아래로 교체:
```html
<button class="theme-toggle" data-theme-toggle aria-label="테마 전환" aria-pressed="false"><span class="theme-toggle__shape" aria-hidden="true"></span></button>
```
- 라이트=노랑 **원**, 다크=파랑 **사각**으로 자동 모핑(`--ease-stamp`). cmdk 테마 항목 아이콘에도 `theme-toggle__shape` 사용 가능.

## 4. 시그니처 모션 (테마 1문법 = "스탬프")
- 새 키프레임 `stamp-in`(위에서 쾅 내려앉음) — `[data-stagger] > *`, `.animate-rise`가 전부 이 문법.
- **스크롤 리빌**: 블록에 `data-reveal` 부여 → app.js의 공용 IntersectionObserver가 `.is-in` 붙여 stamp로 등장. reduced-motion·JS없음 시 즉시 완성(안전).
- 히어로 로드 연출은 `data-stagger` 컨테이너 사용.

## 5. 한글 조판 레이어 (base.css 하단, 전역 적용중)
- `lang="ko"`만 지키면 `keep-all`/줄바꿈/행간(ko)/**Do Hyeon faux-bold 방지**(`font-synthesis-weight:none`) 자동 적용. 초대형 한글 디스플레이는 `line-height:var(--leading-display-ko)`가 적용됨(0.95 직행 금지).
- 표/스탯/가격 숫자는 `.table td/.table__num/.statcard__value/.price/.slider__value`에서 tabular-nums 자동.

## 6. 신규/변경 토큰
| 토큰 | 값·용도 |
|---|---|
| `--leading-heading-ko` 1.3 / `--leading-display-ko` 1.14 / `--leading-body-ko` 1.7 | 한글 행간 |
| `--tracking-caps-ko` 0.06em | 한글 캡스 라벨 자간(라틴보다 좁게) |
| `--ease-stamp` / `--duration-stamp`(460ms) | 스탬프 모션 |
| `--svg-grid-mod-inv` | 다크용 밝은 제도 그리드 라인 |
| `--grid-lines` (semantic, 라이트/다크) | `.grid-texture` 가 참조 — 다크=블루프린트 라인 |
| `--tooltip-bg/fg` → `surface-inverse/text-inverse` | 다크에서 툴팁 가독 |
| `--progress-track` → `--color-surface-3` | 테마-aware 트랙 |

## 7. 신규 유틸/컴포넌트 (index.html 참고)
- `.grid-texture` — 제도판 그리드 배경(테마-aware). 섹션에 부여해 분위기 연출.
- `.section__mark` — 초대형 아웃라인 챕터 번호 워터마크(`-webkit-text-stroke`, aria-hidden). 섹션에 `position:relative; overflow-x:clip` 전제.
- **몬드리안 허브**: `.page-hub`(12col dense) + `.cell--lead`(6×2) / `.cell--wide`(6) / `.cell--sm`(3) + `.page-card--fill`(색면 리드카드) / `.page-card--statement`(인버스 선언 블록). 반응형 1024→6분할, 560→풀.
- **표 정렬 키보드 접근**: `<th scope="col" data-sort="text|number"><button class="th-sort" type="button">라벨</button></th>` (버튼 클릭이 th로 버블 → app.js 정렬). 페이지 표 전부 이 패턴 + `scope="col"` + 체크박스 `aria-label`.
- **모바일 네비(마케팅 navbar)**: 죽은 `data-sidebar-mobile` 대신 `data-nav-toggle aria-controls="…" aria-expanded="false"`; app.js가 `.navbar.is-nav-open` 토글(880px 경계, 데드존 없음). ※ 사이드바형 앱셸 페이지(dashboard 등)는 기존 `.sidebar` 패턴 유지.

## 8. app.js 전면 한글화 (완료 — 페이지는 자기 문자열만 한글화)
토스트 기본값/닫기·제거 aria·캘린더(월/요일 한글·"2026년 7월"·이전/다음 달)·"N번 슬라이드"·위저드 완료·복사 토스트·cmdk 실행 폴백 전부 한글. 새 문자열 추가 시 한국어로.

## 9. 접근성·기타 (시스템에서 해결됨 — 페이지는 활용만)
- `.alert--warning` 삼각형에 고대비 아웃라인 부여(WCAG 1.4.11 충족). 페이지는 `.alert--warning` 그대로 쓰면 됨.
- statcard 델타 색 `--color-success`/`--color-danger`(테마-aware)로 변경 → 다크 대비 확보.
- 숨김 오버레이 `autofocus` 금지(스크롤 점프). app.js가 열릴 때 첫 포커서블로 이동.

## 10. 카피·데이터 정합(페이지 통일)
- 통화 `₩`, 큰 금액 억/만 축약(예 `₩4.82억`, `₩4,200만`). 날짜는 상대표현 권장.
- index 데모 스탯 정본: **"6월 매출 ₩4.82억 · 전월 대비 +18.2%"** — dashboard가 같은 지표를 쓰면 값 통일.
- 어체: 바우하우스=**선언·명령**(단문, 명사형 종결). 다정체와 섞지 말 것.
- dev-tool 자기지시 카피("순수 CSS/프레임워크 없음/N개 컴포넌트") 금지 — index에서 제거 완료.
