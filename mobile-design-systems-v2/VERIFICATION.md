# 파일럿 검증 기록

## 기준과 범위

- 작업 지시: `docs/design-v2/MOBILE-HANDOFF.md`.
- 01·30 각각 4화면, Android/Flutter, light/dark.
- 기존 모바일 v1 미참조·미수정. 웹 v2 미수정.
- 처음 현황: 01·02·03·04·30은 핸드오프가 완성 확정. 15는 최근 90분 수정으로 보류, 05·06·07은 파일 구성 미완성.

## 원본 불일치 처리

두 파일럿의 DIRECTION에는 별도의 `## 팩트 시트` 제목이 없어, 세계관·장면 시나리오의 값을 팩트 정본으로 사용했습니다.

1. 01 product의 일부 오버레이는 PP-0410을 썰물, PP-0398을 낮잠클럽으로 표시합니다. DIRECTION/COMPONENTS의 정본에 맞춰 **PP-0398 = 모래사장 〈썰물〉**을 사용합니다.
2. 30 inbox 웹 상세는 현재 김하늘 검토 차례로 표시하지만 DIRECTION은 박도윤 재무 차례로 지정합니다. 모바일은 **현재 박도윤**을 사용합니다.

## 확인된 검증

- Flutter: `flutter analyze` 0 issues, `flutter build apk --debug` 통과.
- Flutter 16개 골든(390×844, 테마 2 × 화면 4 × 모드 2) 생성 및 1.3배 글자 크기 레이아웃 검사 통과.
- 골든·레이아웃과 결재 승인 후 승인함 이동, 문의 검색·빈 상태, 음반 수령 방법·담기, 전결 한도 입력 검증·반영을 합쳐 `flutter test` 20개 통과.
- `./gradlew :app:assembleDebug` 통과. SDK 36 / minSdk 26 / JDK 17.
- `tools/audit.py`: 테마 파일 밖 색상 리터럴 0건, 테마 간 import 0건, 영어 자리표시 0건.
- 라이트·다크의 본문·보조·주요 버튼·가격 스티커·도장 대비 22쌍 모두 4.5:1 이상.
- 웹 원본 390px light/dark 16장과 Flutter 16장을 열어 비교했습니다.
- Android 실기 검토 중 발견한 시스템 바 겹침, 다크 시스템 아이콘 대비, 가변 폰트 굵기를 수정했습니다. 전용 에뮬레이터에서 최종 기본 글자 크기 16장과 1.3배 16장을 캡처하여 확인했습니다.

- Android 캡처는 디버그 앱의 PixelCopy로 해당 앱 Window만 기록합니다. 시스템 아이콘과 다른 앱의 오버레이는 포함하지 않습니다.
- 최종 비교 갤러리: `/private/tmp/mobile-v2-shots/index.html`. Android·Flutter 대표 화면: 같은 폴더의 `android-pilot.png`, `flutter-pilot.png`.
- 파일럿 범위만 완료했습니다. 나머지 28개 테마는 사용자 검토 후 진행합니다.
