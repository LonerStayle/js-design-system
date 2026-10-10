# 모바일 디자인 시스템 v2 · 파일럿

웹 v2의 **01 판판레코드**와 **30 레저라인**을 Android Compose와 Flutter의 독립 테마로 옮겼습니다. 각 플랫폼 앱은 하나이며, 런처에서 테마를 선택하고 밝기를 전환합니다. 나머지 28개는 파일럿 검토 후 진행합니다.

| 테마 폴더 | 브랜드 | 화면 |
|---|---|---|
| `t01_neobrutalism` | 판판레코드 | 운영 보드, 음반 상세, 문의함, 매장 설정 |
| `t30_corporate_clean_saas` | 레저라인 | 마감 현황, 결재함, 지출결의서 상세, 결재 규칙 |

## 실행

### Android

설치된 최신 SDK 36, minSdk 26, JDK 17, AGP 8.11.1, Gradle 8.13입니다.

```sh
cd mobile-design-systems-v2/android
# 다른 컴퓨터에서는 local.properties의 sdk.dir와 gradle.properties의 JDK 경로를 맞춥니다.
./gradlew :app:assembleDebug
# Android Studio에서 이 폴더를 열어 실행하거나:
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.jinsup.ds.v2/com.jinsup.ds.catalog.MainActivity
```

스크린샷 검증용 진입 인자: `--ei theme 1|30 --ei screen 0|1|2|3 --ez dark true|false`.

### Flutter

Flutter 3.44.5 / Dart 3.12.2를 사용합니다.

```sh
cd mobile-design-systems-v2/flutter
flutter pub get
flutter run
flutter analyze
flutter test
flutter build apk --debug
```

Google Fonts의 TTF를 OFL과 함께 번들했습니다. `GoogleFonts.config.allowRuntimeFetching = false`이므로 폰트 표시와 골든 테스트에 네트워크가 필요하지 않습니다. 처음 패키지를 설치하고 빌드할 때는 네트워크가 필요할 수 있습니다.

## 테마 폴더를 복사해서 쓰기

테마 폴더 사이에 import가 없습니다. 카탈로그에 대한 역방향 의존도 없습니다.

- **Flutter**: `lib/themes/tNN_.../` 전체를 복사합니다. 대상 앱의 `pubspec.yaml`에 해당 테마의 `fonts/` 폰트들을 같은 family 이름으로 등록합니다. `theme/theme.dart`의 `panpanTheme()` 또는 `ledgerTheme()`를 적용하고, `components/components.dart`와 `components/signatures.dart`를 사용합니다. `screens/`는 샘플이며 필요에 따라 제외할 수 있습니다. 양쪽 테마가 함께 있으면 IBM Plex Sans KR와 Noto Sans KR은 한 번만 등록해도 됩니다. 각 폴더에는 독립 복사를 위해 같은 폰트를 모두 포함했습니다.
- **Android**: `app/src/main/java/com/jinsup/ds/tNN_.../` 전체를 복사합니다. 대상 모듈의 `sourceSets["main"].res.srcDir(...)`에 테마의 `res/`를 추가합니다. 대상 앱 namespace가 다르면 `Type.kt`의 `R` import를 맞춥니다. Compose/Material 3와 material-icons-extended를 의존성에 추가하고 `PanpanTheme` 또는 `LedgerTheme`로 감쌉니다. 앱 진입점은 각각 `PanpanApp` / `LedgerApp`입니다.

`theme/`는 Color, Type, Shape, Spacing, Motion, Elevation, Theme 7종입니다. 웹의 색상 의미를 같은 이름의 프로퍼티로 대응했습니다. Android는 `CompositionLocal`, Flutter는 `ThemeExtension`을 통해 Material 밖의 토큰을 제공합니다.

## 구성품

두 테마 모두 버튼(주요·보조·고스트·위험·비활성·처리 중), 아이콘 버튼, 입력(label/helper/error), 카드, 배지, 탭, 상단바, 하단 내비, 목록 행, 다이얼로그, 바텀시트, 스낵바, 스위치, 체크박스, 라디오, 진행률, 빈 상태, 스켈레톤을 제공합니다.

판판레코드에는 가격 스티커와 솟아오른 크레이트 탭, Canvas 음반 표지를 추가했습니다. 레저라인에는 원형 인주 도장 결재란, 미니 결재 진행칸, 원장 행을 추가했습니다. 정적인 패널에는 그림자를 쓰지 않으며, 판판레코드의 버튼은 누를 때 오프셋 그림자가 줄어듭니다.

## 샘플 동작과 데이터 범위

문의 필터·검색, 답장 초안, 음반 수령 방법 선택·담기, 매장 입력 검증, 결재 승인·반려, 승인 상태 필터, 전결 한도 편집·검증, 알림 설정을 조작할 수 있습니다. 샘플 상태는 앱 메모리에만 유지되며 서버 전송·실제 구매·실제 결재는 수행하지 않습니다.

팩트는 테마의 `facts.dart` / `Facts.kt`에 모았습니다. DIRECTION 정본에 명시된 문의 3건과 결재 상세 1건을 구현했으며, 화면의 전체 현황 숫자(결재 대기 12건 등)는 정본의 운영 지표입니다. 원본에 없는 개별 문서나 금액을 만들어 채우지 않았습니다.

## 검증

```sh
python3 mobile-design-systems-v2/tools/audit.py
cd mobile-design-systems-v2/flutter
flutter analyze
flutter test
# 화면을 의도적으로 바꾼 경우에만:
flutter test --update-goldens
```

골든 기준 이미지는 `flutter/test/goldens/`에 있습니다. 웹 참조와 Android·Flutter 검토용 이미지는 `/private/tmp/mobile-v2-shots/`에 둡니다. Android 검증 이미지는 디버그 앱의 `PixelCopy`로 해당 앱의 Window 표면을 캡처합니다. 앱 밖의 플로팅 창이 스크린샷에 섞이지 않으며, 디버그 인자가 없는 일반 실행에는 캡처 코드가 작동하지 않습니다.

Android 캡처는 `ANDROID_SERIAL=emulator-5580 python3 mobile-design-systems-v2/tools/android_shots.py`로 재생성할 수 있습니다. `MOBILE_SHOT_THEMES`, `MOBILE_SHOT_MODES`, `MOBILE_SHOT_SCALES`로 부분 재검증할 수 있고, 표시 설정은 종료 시 복구합니다. `tools/review_gallery.py`는 같은 임시 폴더에 비교용 HTML을 만듭니다.

자세한 결과와 원본 데이터 충돌은 [검증 기록](VERIFICATION.md)을 참고하세요.
