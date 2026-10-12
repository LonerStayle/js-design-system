# 모바일 v2 인수인계 (Claude Code → Codex)

> 작성 2026-10-10. 웹 디자인시스템 v2 30개를 원본으로 삼아 **Android(Jetpack Compose)와 Flutter v2를 30개 전부** 만든다.

---

## ▶ Codex에 붙여넣을 시작 프롬프트

```
/Users/seobi/jinsup_ralph_mobile/js_design_system 레포에서 작업해.
docs/design-v2/MOBILE-HANDOFF.md 를 끝까지 읽고 그대로 진행해. 그 문서가 유일한 작업 지시서야.
먼저 0절의 '현황 확인'을 실행해서 웹 v2가 완성된 테마 목록을 보고해 줘.
그다음 1차로 theme-01(브루탈리즘)과 theme-30(SaaS), 두 테마만 Android와 Flutter 둘 다 만들어.
7절 검증을 통과시키고, 스크린샷을 보여준 뒤 멈춰. 나머지 28개는 내가 확인한 다음에 진행해.
사용자에게 보이는 텍스트와 보고는 전부 한국어로 해.
```

---

## 0. 배경과 현황

- 웹 v1(`design-systems/`)은 "AI가 만든 티"가 나서 폐기했다. 모든 테마가 같은 SaaS 랜딩 뼈대였다.
- 웹 v2(`design-systems-v2/theme-XX-*`)는 ui-ux-pro-max 플러그인 데이터를 근거로 테마마다 **가상의 한국 서비스 하나**를 정하고 처음부터 다시 만들었다. 예: 01 = 망원동 레코드샵 "판판레코드", 30 = 경비정산 SaaS "레저라인".
- **v1 모바일(`mobile-design-systems/`)은 쓰지 않는다.** 그 폴더의 `_specs/`, `android/`, `flutter/`는 v1 기준이다. 읽지도 고치지도 지우지도 말 것(삭제 여부는 사용자가 나중에 결정).
- 웹 v2 작업 규칙: `docs/design-v2/BRIEF.md`. 특히 3절 AI티 블랙리스트와 7절 파일럿 교훈은 모바일에도 그대로 적용된다.

**현황 확인 (작업 시작 시 실행):**
```bash
cd /Users/seobi/jinsup_ralph_mobile/js_design_system
for d in design-systems-v2/theme-*; do
  n=$(ls $d/pages/*.html 2>/dev/null | wc -l | tr -d ' ')
  printf "%-36s DIRECTION:%s index:%s pages:%s\n" $(basename $d) \
    $([ -f $d/DIRECTION.md ] && echo Y || echo N) $([ -f $d/index.html ] && echo Y || echo N) $n
done
git status --short | head
```
**주의: 웹 v2 확산 워크플로우가 아직 돌고 있을 수 있다.** 같은 시간에 Claude Code 에이전트들이 다른 테마 파일을 계속 쓰고 있다. 그래서 "완성된 테마"만 골라야 한다.

- **현재 상태는 `docs/design-v2/STATUS.md`를 먼저 본다.** 2026-10-11 기준으로 모바일 원본으로 쓸 수 있는 테마는 01, 02, 03, 04, 05, 06, 15, 30이다. 07과 08은 웹 쪽 수정이 끝나지 않았으니 보류하고, 나머지 20개는 웹 v2가 아직 없다.
- 그 외 테마는 아래 조건을 **모두** 만족할 때만 완성으로 본다.
  1. DIRECTION.md, index.html, pages 9개가 모두 있다.
  2. 폴더 안 파일이 **최근 90분 동안 한 번도 수정되지 않았다.** 리뷰 단계는 파일을 안 건드리다가 수정 단계에서 다시 고치기 때문에, 짧게 조용하다고 해서 끝난 것이 아니다.
  ```bash
  for d in design-systems-v2/theme-*; do
    recent=$(find $d -type f -mmin -90 | wc -l | tr -d ' ')
    echo "$(basename $d) 최근90분수정:$recent  $([ $recent = 0 ] && echo '→ 완성 후보')"
  done
  ```
- 미완성 테마는 건드리지도 읽어서 확정하지도 말고 다음 배치로 미룬다. 판단이 애매하면 사용자에게 묻는다.

## 1. 원본(Source of Truth) — 테마별로 이 순서대로 읽는다

| 파일 | 쓰는 곳 |
|---|---|
| `design-systems-v2/<t>/DIRECTION.md` | **최우선.** 클라이언트·세계관, 감정 톤, `## 팩트 시트`(날짜·인물·가격·ID), 팔레트(light/dark hex), 타이포(라틴+한글 폰트, 스케일), 시그니처, 모션 문법, 페이지 장면 시나리오 |
| `design-systems-v2/<t>/tokens.css` | 원시 토큰 값(색 램프, 반경, 그림자, 간격, 모션 duration/easing) |
| `design-systems-v2/<t>/semantic.css` | 의미 토큰과 light/dark 매핑 → 모바일 ColorScheme과 커스텀 토큰으로 1:1 이식 |
| `design-systems-v2/<t>/COMPONENTS.md` | 컴포넌트 형태·상태 규칙, 시그니처 적용 방식 |
| `design-systems-v2/<t>/components/*.css` | 세부 수치(보더 두께, 오프셋, 상태별 변화)를 확인할 때 |
| `design-systems-v2/<t>/pages/*.html` | 샘플 화면의 장면·데이터·구도 레퍼런스 |

**웹 화면을 눈으로 보기:** `docs/design-v2/shot.sh <html 절대경로> <out.png> [폭] [높이] [theme=dark]`. 폭을 390으로 주면 모바일 뷰포트로 찍는다. 모바일 화면을 만들기 전에 해당 웹 페이지의 390폭 light/dark 샷을 먼저 본다.

## 2. 출력 구조

빌드를 각각 30번 하지 않도록 **플랫폼마다 앱 하나**로 만든다. 단, 테마 폴더는 서로 import하지 않는 자급자족 구조로 둬서, 폴더 하나만 복사하면 다른 프로젝트에서 바로 쓸 수 있게 한다.

```
mobile-design-systems-v2/
  README.md                      # 실행법, 테마 목록, 폴더 복사해서 쓰는 법
  android/                       # Gradle 프로젝트 1개 (app 모듈)
    app/src/main/java/com/jinsup/ds/
      catalog/                   # 런처: 테마 30개 목록 → 테마별 샘플 진입, light/dark 토글
      t01_neobrutalism/
        theme/   Color.kt Type.kt Shape.kt Spacing.kt Motion.kt Elevation.kt Theme.kt
        components/  (아래 3절)
        screens/     (아래 4절)
      t02_swiss/ ...
  flutter/                       # Flutter 앱 1개
    lib/
      main.dart                  # 런처(catalog)
      themes/
        t01_neobrutalism/
          theme/   colors.dart typography.dart shape.dart spacing.dart motion.dart elevation.dart theme.dart
          components/
          screens/
        t02_swiss/ ...
    test/goldens/                # 골든 스크린샷 (7절)
```

- 패키지명과 폴더명은 `tNN_<짧은이름>` 규칙을 따른다(웹 폴더명에서 파생).
- 테마 간 공유 코드는 금지. 공용 유틸이 꼭 필요하면 `catalog/` 쪽에만 두고, 테마 폴더는 의존하지 않는다.

## 3. 테마당 산출물 — 테마 파일 + 컴포넌트

**테마 파일**
- light/dark 두 모드. 다크는 웹처럼 "그 세계의 밤 장면"으로 설계하고 단순 반전하지 않는다. 웹 semantic.css의 dark 값을 그대로 쓴다.
- Material 3 `ColorScheme`/`ThemeData`에 매핑한다. Material이 담지 못하는 토큰(하드 섀도 오프셋, 스티커 회전값, 스티치 패턴 등)은 커스텀 토큰 객체로 둔다. Android는 `CompositionLocal`, Flutter는 `ThemeExtension`을 쓴다.
- 타이포는 웹 DIRECTION의 라틴+한글 폰트 그대로. 모바일 스케일은 웹 스케일에서 비율을 유지하며 줄인다(본문 15~16sp 기준).
- 반경·간격·모션(duration/easing)은 tokens.css 값을 dp/ms로 옮긴다.

**컴포넌트 (최소 이 목록 + 테마 시그니처 컴포넌트 1~2개)**
Button(primary/secondary/ghost/destructive, loading/disabled), IconButton, TextField(label/helper/error), Card, Badge/Chip, Tabs, TopAppBar, BottomNavigation 또는 NavigationBar, ListItem, Dialog, BottomSheet, Snackbar/Toast, Switch, Checkbox, Radio, ProgressBar/Indicator, EmptyState, Skeleton.

- 모든 상태(pressed/focused/disabled/selected/error)를 테마 문법으로 표현한다. Material 기본 리플이나 elevation이 테마 DNA와 충돌하면 끄고 테마 방식으로 바꾼다. 예: 브루탈리즘은 누르면 하드 섀도가 줄면서 요소가 오프셋만큼 이동.
- 웹의 시그니처를 반드시 이식한다. 예: 01은 가격 스티커와 크레이트 칸막이 탭, 30은 결재 도장란. 시그니처가 빠지면 "아무 Material 앱"이 되고, 그게 실패다.

## 4. 테마당 산출물 — 샘플 화면 3~4개

- 웹 `pages/` 중 그 서비스를 가장 잘 보여주는 장면 3~4개를 모바일 네이티브 화면으로 옮긴다. 기본 조합은 dashboard(홈), product(상세), inbox 또는 kanban(목록), settings(폼)이다.
- 웹 390폭 레이아웃을 복사하지 말고 **모바일 앱 문법**으로 재구성한다: 하단 내비, 스크롤 리스트, 바텀시트, 스와이프. 대신 구도의 개성(비대칭, 거대 타이포, 컬러 면 등)은 유지한다.
- 데이터는 **DIRECTION.md 팩트 시트 값만** 쓴다. 웹과 같은 인물·가격·날짜여야 한다. Lorem, John Doe, "Title" 같은 자리표시 금지.
- 모든 노출 텍스트는 한국어(브랜드 워드마크와 고유 양식명 제외).
- 화면마다 light/dark 둘 다 성립해야 한다.

## 5. 플랫폼 기술 규칙

**공통**
- 폰트: Google Fonts만. 한글 폰트는 웹 DIRECTION에 적힌 것(Gasoek One, IBM Plex Sans KR, Gowun Batang, Black Han Sans, Do Hyeon, Jua 등). 스택 순서는 라틴 → 무드 한글 → Noto Sans/Serif KR(안전망). 한글 두부(□)가 나오면 실패.
- 이미지 파일을 쓰지 않는다. 일러스트는 Canvas / CustomPainter / Compose `drawBehind`로 그린다(웹도 CSS/SVG로만 그렸다).
- 접근성: 터치 타깃 48dp, 본문 대비 4.5:1(양 모드), contentDescription/Semantics 라벨, 폰트 스케일 1.3배에서도 레이아웃이 깨지지 않을 것.
- 한글 줄바꿈: 단어 단위가 자연스럽게. Flutter는 긴 문장에서 어절 중간이 끊기지 않는지 확인한다. 한글에는 넓은 자간을 쓰지 않는다(웹 BRIEF 7-5).

**Android**
- Kotlin + Jetpack Compose + Material 3, minSdk 26, compileSdk는 설치된 SDK 최신.
- 폰트: `androidx.compose.ui:ui-text-google-fonts`(Downloadable Fonts). 오프라인 대비가 필요하면 `res/font`에 TTF 번들도 가능(OFL 라이선스 확인).
- SDK 경로: `~/Library/Android/sdk`. `ANDROID_HOME`이 설정되어 있지 않으니 `local.properties`에 `sdk.dir`을 쓴다. Java는 24가 기본이므로 Gradle toolchain을 17로 고정하거나 AGP 호환 JDK를 확인한다.

**Flutter**
- Flutter 3.44.5(설치됨). Material 3, `ThemeExtension`으로 커스텀 토큰.
- 폰트: `google_fonts` 패키지. 골든 테스트에서는 네트워크를 쓰지 않도록 TTF를 `assets/fonts`에 번들하고 `GoogleFonts.config.allowRuntimeFetching = false`로 둔다.

## 6. 진행 순서 (권장 배치)

1. **스캐폴드**: android 앱과 flutter 앱 뼈대, 런처(catalog), 빌드 통과.
2. **파일럿**: theme-01(강렬함)과 theme-30(정갈함) 두 개를 양 플랫폼 모두 완성 → 7절 검증 → **사용자에게 스크린샷을 보여주고 멈춘다.**
3. **확산**: 승인 후 나머지 28개를 4~5개씩 배치로 진행하고, 배치마다 검증과 커밋. 배치를 시작할 때마다 0절의 완성 판정을 다시 돌려 완성된 테마만 고른다(웹 쪽이 아직 진행 중일 수 있음). 커밋할 때는 `mobile-design-systems-v2/`만 스테이징한다. 웹 쪽 파일은 다른 에이전트가 쓰는 중일 수 있다. 배치에서 얻은 교훈은 이 문서 8절에 추가한다.
4. 마무리: README 정리, 전체 빌드, 30개 런처에서 전부 진입 확인.

## 7. 검증 (테마마다, "빌드됨"이 아니라 "보기 좋음"이 완료 조건)

- Android: `./gradlew :app:assembleDebug` 통과. 화면 확인은 Roborazzi 또는 Paparazzi 스크린샷 테스트를 권장한다(에뮬레이터 불필요). 안 되면 에뮬레이터에서 `adb exec-out screencap -p > out.png`.
- Flutter: `flutter analyze` 0 issues, `flutter build apk --debug` 통과, 샘플 화면 골든 테스트(390×844 논리 크기, light/dark) PNG 생성.
- 생성한 PNG를 **직접 열어 보고** 웹 v2의 같은 장면 390폭 샷과 나란히 비교한다. 같은 브랜드로 보이는가, 시그니처가 살아 있는가, AI티 블랙리스트(BRIEF 3절)에 걸리지 않는가.
- grep 점검: 영어 플레이스홀더, 하드코딩 색(테마 파일 밖의 `Color(0x…)` / `Color(0xFF…)`), 테마 폴더 간 import 0건.
- 스크린샷은 레포 밖 `/private/tmp/mobile-v2-shots/<platform>/<theme>/`에 둔다(골든 테스트 기준 이미지만 레포에 둔다).

## 8. 교훈 누적란 (진행하면서 추가)

- (웹에서 넘어온 것) 같은 테마 안에서 날짜·요일·인물이 화면마다 달라지는 사고가 잦았다 → 팩트 시트 상수 파일(`facts.kt` / `facts.dart`)을 테마 폴더에 두고 화면은 그것만 참조할 것.
- (웹에서 넘어온 것) 다크 모드에서 브랜드 원색이 엉뚱한 파스텔로 바뀌는 문제가 있었다 → semantic.css dark 값을 그대로 쓸 것.

## 9. 하지 말 것

- `mobile-design-systems/`(v1) 수정·삭제·참조.
- `design-systems/`(웹 v1) 참조. 원본은 오직 `design-systems-v2/`.
- 웹 v2 파일 수정. 웹 쪽 결함을 발견하면 수정하지 말고 보고만 한다.
- 사용자 확인 없이 원격 push. 커밋은 배치 단위로 하되 push는 사용자에게 묻는다.
