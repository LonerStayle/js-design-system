# theme-09 Y2K / Frutiger Aero — 시스템 레이어 고도화 워크로그

> 대상: tokens.css · semantic.css · base.css · components/* · index.html · app.js
> pages/* 는 건드리지 않음 (별도 에이전트). 아래는 **페이지에 일관 반영할 지침**.

---

## 1. 폰트 (P0 — 페이지는 tokens.css만 링크하면 자동 반영)

- **Do Hyeon → Jua** 로 디스플레이 교체(둥글고 버블 DNA에 맞음). **Noto Serif KR 죽은 임포트 삭제**. `--font-sans`에 **Noto Sans KR 배선**(system-ui 앞).
- **@import는 tokens.css 한 곳으로 통합** — base.css의 폰트 @import 제거. 페이지는 로드 순서(tokens→semantic→base→components)만 지키면 됨.
- Jua는 400 단일 웨이트 → 한글 헤딩에 `font-synthesis-weight:none` 적용됨(base.css). **한글 헤딩 위계는 굵기가 아니라 크기로**. 라틴/숫자는 여전히 Hind/Mulish(tabular).

## 2. 다크모드 FOUC + JS 게이트 (P0 — 모든 페이지 `<head>`에 필수)

각 페이지 `<html>`의 하드코딩 `data-theme="..."`를 **제거**하고, `<head>` 최상단(스타일시트보다 먼저)에 아래 스니펫을 넣을 것. 키는 반드시 `aero-theme`(app.js와 일치):

```html
<script>
  (function () {
    var d = document.documentElement;
    d.classList.add('js');
    try {
      var t = localStorage.getItem('aero-theme');
      if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      d.setAttribute('data-theme', t);
    } catch (e) { d.setAttribute('data-theme', 'light'); }
  })();
</script>
```

- `.js` 클래스가 **없으면** `[data-reveal]`은 숨지 않음(애니메이션만 생략, 콘텐츠는 항상 보임 = 안전 폴백). 그러므로 이 스니펫이 곧 등장 모션의 스위치.

## 3. 시그니처 등장 모션 — `[data-reveal]` (공용, base.css로 이동)

- 인덱스에 있던 인라인 fade-up 규칙 삭제 → **base.css에 "수면 위로 떠오르는" 리빌**(translateY + scale + blur 해제)로 통일. JS 게이트(`html.js`), reduced-motion 시 즉시 완성.
- 페이지는 섹션/카드에 `data-reveal`만 붙이면 됨. app.js `initReveal`(IntersectionObserver)이 처리.

## 4. 분위기 배경 — 초원/수면 풍경 (자동, 마크업 그대로)

- `.aero-sky`가 **하늘 그라데이션 + 드리프트 커스틱(feature) + 초원 언덕 실루엣**을 그림. 다크에서는 언덕이 **야간 수면 horizon**으로 자동 전환. 기존 `.aero-sky`/`.aero-bubbles` 마크업 그대로 두면 됨.
- **씬 변주(§6-2)**: `<html>` 또는 섹션에 `data-scene` 부여로 무드 조절 —
  - `data-scene="calm"` (언덕/플레어 낮춤, 잔잔), `data-scene="deep"` (언덕 짙게), `data-scene="tilt"` (언덕 기울임 — **404에 추천**).

## 5. 새 유틸리티 · 컴포넌트 클래스

| 클래스/속성 | 용도 | 주의 |
|---|---|---|
| `data-gloss` | 포인터를 따라오는 젖은 하이라이트 시트. 인터랙티브 글래스 카드/캡슐에 부여 | 자체 `::after`를 쓰는 요소와 **병용 금지**(충돌). 카드/캡슐엔 OK |
| `--light-sweep` (토큰) | 유리 위를 지나가는 대각 광선. 히어로 시트 등에 `::after`로 | index 히어로 위젯 참고 |
| `.btn__ripple` | 버튼 클릭 물결. **app.js가 자동 주입** — 페이지 조치 불필요 | reduced-motion 시 생성 안 함 |

- **버튼 젤리 물성**: `.btn:active` 스쿼시(scale) + 물결 리플이 전역 자동. 마크업 변경 없음.
- **토스트**: 등장/퇴장이 "떠오름(rise+blur)"으로 변경. app.js `Aero.toast()` 그대로.

## 6. 신규 토큰 (전부 토큰 경유, 하드코딩 금지 유지)

- 타이포: `--leading-heading-ko(1.3)` · `--leading-display-ko(1.14)` · `--tracking-caps-ko(0.06em)`
- 분위기: `--hill-mask` · `--caustic-layer` · `--light-sweep`(tokens) / `--fx-hill` · `--fx-hill-opacity` · `--fx-flare-opacity`(semantic, 라이트/다크 각각)
- 스크롤바: `--color-scrollbar` · `--color-scrollbar-hover`(semantic)
- base.css 하단에 **한글 조판 레이어**(keep-all, 행간, faux-bold 차단, tabular-nums) 이식됨 — 페이지는 `lang="ko"`만 지키면 자동 적용.

## 7. 카피/마크업 규율 (페이지도 동일 적용)

- **이모지 아이콘 금지 → 인라인 SVG**. 커맨드 팔레트 항목은 `data-command-href="pages/xxx.html"`로 내비게이션(인라인 `onclick` 금지). app.js가 처리.
- **자기참조 dev-tool 카피 금지**("순수 CSS·0 의존성·60+ 컴포넌트" 류). 푸터는 테마 보이스 콜로폰으로.
- 테마 토글: `<span data-theme-label>다크</span>` + 해/달 SVG(`.theme-ico--sun`/`.theme-ico--moon`, `[data-theme]`로 CSS 스왑). 라벨 한글은 app.js가 갱신(다크/라이트).
- 어체: 실무·명료(해요체/합니다체), 데이터 밀도가 보이스. 훅 문구 반복 금지.

## 8. 아직 남은 P0/P1 — **pages 에이전트 담당** (시스템에서 못 고침)

- **[P0] empty.html(52건)·dashboard.html(3건) SVG 속성 `var()` → `style="fill:var()"`/CSS class/currentColor** (④-1). 렌더 깨짐 치명.
- **[P1] dashboard.html sticky wrapper** — `.navbar--sticky`를 감싼 `container-wide`가 즉시 닫혀 sticky 무력화(④-2). wrapper가 페이지 전체를 감싸도록.
- **[P1] pricing.html `<label ... aria-pressed>`** 무효 ARIA(④-4) — button+role="switch" 또는 aria-pressed 제거(app.js는 button에도 동작).
- empty.html `<circle rx r=0>` 죽은 요소, `--warning-700`(미정의) 참조 정리.

## 9. 검증 결과

- grep: SVG attr var()=0 · onclick/href#/.md=0 · 이모지=0 · 서구 filler=0 · components 하드코딩 hex(비intentional)=0 · @import 단일화.
- 육안(헤드리스 Chrome): 라이트/다크 히어로·토큰·컴포넌트 갤러리 정상, 360/375px 가로 overflow 없음(문서 scrollW==clientWidth), Jua 한글 헤딩 적용 확인, 언덕/버블 배경·유리 위젯 광선·다크 수중 버블 정상.
