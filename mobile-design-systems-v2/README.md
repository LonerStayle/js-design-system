# 모바일 디자인 시스템 v2

웹 v2에서 완성이 확정된 **01·02·03·04·15·30**을 Android Compose와 Flutter로 구현했습니다. 플랫폼마다 앱 하나에서 테마를 선택하고 낮·밤을 전환합니다. 각 테마는 독립 폴더입니다.

| 폴더 | 브랜드 | 네 화면과 시그니처 |
|---|---|---|
| `t01_neobrutalism` | 판판레코드 | 운영 보드·음반·문의·매장 / 가격 스티커·크레이트 탭·음반 표지 |
| `t02_swiss` | 오선음악당 | 매표·공연·편지·계정 / 노출 그리드·잘린 숫자·붉은 공연 포스터 |
| `t03_editorial` | 월간 행간 | 편집국·단권·독자 편지·구독 / 폴리오·옥스퍼드 룰·112쪽 플랫플랜 |
| `t04_glass` | 윤슬홈 | 집·무드등·알림·허브 설정 / 도시와 강·빛 테두리 유리·깊이 후퇴 |
| `t15_hygge` | 모닥 | 쇼룸·담요·상담·계정 / 방 단면·사물 일러스트·콜아웃·연필 메모 |
| `t30_corporate_clean_saas` | 레저라인 | 마감·결재·지출결의서·규칙 / 결재 도장·원장 행 |

## 실행

### Android

SDK 36, minSdk 26, JDK 17, Kotlin 2.2.0, AGP 8.11.1, Gradle 8.13.

```sh
cd mobile-design-systems-v2/android
# 다른 컴퓨터에서는 local.properties의 SDK 경로와 gradle.properties의 JDK 경로를 맞춥니다.
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.jinsup.ds.v2/com.jinsup.ds.catalog.MainActivity
```

검증 진입 인자: `--ei theme 1|2|3|4|15|30 --ei screen 0|1|2|3 --ez dark true|false`.

### Flutter

Flutter 3.44.5 / Dart 3.12.2.

```sh
cd mobile-design-systems-v2/flutter
flutter pub get
flutter run
flutter analyze
flutter test
flutter build apk --debug
```

Google Fonts TTF와 OFL을 테마 폴더에 번들했습니다. `GoogleFonts.config.allowRuntimeFetching = false`이므로 화면·골든에 폰트 다운로드가 필요하지 않습니다.

## 폴더 복사

테마 사이의 import와 카탈로그에 대한 역방향 의존은 없습니다.

- **Flutter:** `lib/themes/tNN_.../`를 복사하고 해당 `fonts/`를 `pubspec.yaml`에 같은 family·weight로 등록합니다. `theme/theme.dart`의 `panpanTheme`, `oseonTheme`, `haengganTheme`, `yunseulTheme`, `modakTheme`, `ledgerTheme` 중 해당 함수를 적용합니다. 구성품은 `components/`, 장면 예시는 `screens/`, 사실 정본은 `facts.dart`입니다. 중복 폰트 family는 앱에서 한 번만 등록해도 되며, 각 폴더에는 독립 복사용 파일이 있습니다.
- **Android:** `app/src/main/java/com/jinsup/ds/tNN_.../`를 복사하고 모듈의 `sourceSets["main"].res.srcDir(...)`에 그 폴더의 `res/`를 추가합니다. 다른 namespace에서는 `Type.kt`의 `R` import를 맞춥니다. Compose/Material 3·material-icons-extended를 의존성에 추가하고 해당 `*Theme`로 감쌉니다. 앱 예시는 `PanpanApp`, `OseonApp`, `HaengganApp`, `YunseulApp`, `ModakApp`, `LedgerApp`입니다.

각 `theme/`는 Color·Type·Shape·Spacing·Motion·Elevation·Theme 7종입니다. Material에 없는 의미 토큰은 Android `CompositionLocal`, Flutter `ThemeExtension`으로 제공합니다. 폰트 라이선스는 Flutter `fonts/*/OFL.txt`, Android `font-licenses/`에 있습니다.

## 구성품과 샘플 상태

각 테마는 버튼(주요·보조·고스트·위험·비활성·처리 중), 아이콘 버튼, 입력(도움말·오류), 카드, 배지, 탭, 상단바, 하단 내비, 목록, 다이얼로그, 시트, 스낵바, 스위치, 체크박스, 라디오, 진행률, 빈 상태, 스켈레톤과 테마별 시그니처를 포함합니다.

검색·필터·초안·답장 저장, 좌석 등급·할인·수량·배송 계산, 결재 상태 변경, 조명·온도·방 필터·영화 장면, 방문 처리, 장바구니 합산, 주소·설정 유효성 검증을 조작할 수 있습니다. 상태는 앱 메모리에 유지됩니다. 외부 전송이나 실제 구매·결재·가정 기기 제어는 연결하지 않았습니다.

팩트는 DIRECTION 정본과 확인한 웹 장면에서 가져와 `facts.dart` / `Facts.kt`에 보존했습니다. 원본에 개별 항목이 없는 전체 현황은 요약 수치로만 표시합니다. 모닥 장바구니 초기 ₩232,000과 새로 담은 담요의 합계, 담요 리뷰와 쇼룸 리뷰는 구분합니다.

## 검증과 화면 비교

```sh
python3 mobile-design-systems-v2/tools/audit.py
cd mobile-design-systems-v2/flutter
flutter analyze
flutter test
# 화면을 의도적으로 바꾼 경우:
flutter test --update-goldens
```

골든 기준은 `flutter/test/goldens/`. 웹·Android·Flutter 검토 PNG와 갤러리는 `/private/tmp/mobile-v2-shots/`에 있습니다.

```sh
ANDROID_SERIAL=emulator-5580 MOBILE_SHOT_THEMES=2,3,4,15 python3 mobile-design-systems-v2/tools/android_shots.py
python3 mobile-design-systems-v2/tools/review_gallery.py
```

Android 디버그 캡처는 앱 Window를 `PixelCopy`로 기록합니다. 다른 앱의 오버레이가 포함되지 않고 일반 실행에서는 캡처가 작동하지 않습니다. 검증 스크립트는 표시 크기·밀도·글자 크기를 종료 시 복원합니다. `MOBILE_SHOT_THEMES`, `MOBILE_SHOT_SCREENS`, `MOBILE_SHOT_MODES`, `MOBILE_SHOT_SCALES`로 부분 재검증합니다. 이미 설치된 APK를 그대로 재검증할 때는 `MOBILE_SKIP_INSTALL=1`을 지정합니다.

상세 결과·원본 충돌·배치 교훈은 [검증 기록](VERIFICATION.md), 확산 원본 해시는 [원본 기록](BATCH-02-SOURCE.md)을 참고하세요. 원격 push는 하지 않았습니다.
