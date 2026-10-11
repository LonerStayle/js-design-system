import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_design_systems_v2/main.dart';
import 'package:mobile_design_systems_v2/themes/t02_swiss/screens/oseon_app.dart';
import 'package:mobile_design_systems_v2/themes/t03_editorial/screens/haenggan_app.dart';
import 'package:mobile_design_systems_v2/themes/t03_editorial/components/signatures.dart';
import 'package:mobile_design_systems_v2/themes/t04_glass/screens/yunseul_app.dart';
import 'package:mobile_design_systems_v2/themes/t15_hygge/screens/modak_app.dart';

Widget app(int theme, bool dark, int page) => switch (theme) {
  2 => OseonApp(dark: dark, initialScreen: page),
  3 => HaengganApp(dark: dark, initialScreen: page),
  15 => ModakApp(dark: dark, initialScreen: page),
  _ => YunseulApp(dark: dark, initialScreen: page),
};
Future<void> reviewCapture(WidgetTester tester, String path) async {
  if (Platform.environment['MOBILE_CAPTURE_REVIEW'] != '1') return;
  await tester.runAsync(() async {
    final boundary = tester.renderObject<RenderRepaintBoundary>(
      find.byKey(const ValueKey('capture')),
    );
    final frame = await boundary.toImage();
    final bytes = await frame.toByteData(format: ui.ImageByteFormat.png);
    final file = File('/private/tmp/mobile-v2-shots/flutter/$path.png');
    await file.parent.create(recursive: true);
    await file.writeAsBytes(bytes!.buffer.asUint8List());
    frame.dispose();
  });
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    final manifest =
        jsonDecode(await rootBundle.loadString('FontManifest.json')) as List;
    for (final entry in manifest) {
      final loader = FontLoader(entry['family'] as String);
      for (final font in entry['fonts'] as List) {
        loader.addFont(rootBundle.load(font['asset'] as String));
      }
      await loader.load();
    }
  });
  for (final theme in [2, 3, 4, 15]) {
    for (final dark in [false, true]) {
      for (var page = 0; page < 4; page++) {
        testWidgets('$theme / $page / ${dark ? '다크' : '라이트'} 골든과 큰 글자', (
          tester,
        ) async {
          tester.view.physicalSize = const Size(390, 844);
          tester.view.devicePixelRatio = 1;
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          Widget root(double scale) => RepaintBoundary(
            key: const ValueKey('capture'),
            child: MaterialApp(
              debugShowCheckedModeBanner: false,
              builder: (ctx, child) => MediaQuery(
                data: MediaQuery.of(
                  ctx,
                ).copyWith(textScaler: TextScaler.linear(scale)),
                child: child!,
              ),
              home: app(theme, dark, page),
            ),
          );
          await tester.pumpWidget(root(1));
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
          await expectLater(
            find.byKey(const ValueKey('capture')),
            matchesGoldenFile(
              'goldens/t$theme/${page}_${dark ? 'dark' : 'light'}.png',
            ),
          );
          await reviewCapture(
            tester,
            'theme-${theme.toString().padLeft(2, '0')}/${page}_${dark ? 'dark' : 'light'}',
          );
          await tester.pumpWidget(root(1.3));
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
          await reviewCapture(
            tester,
            'theme-${theme.toString().padLeft(2, '0')}/${page}_${dark ? 'dark' : 'light'}_scale13',
          );
          await tester.drag(
            find.byType(SingleChildScrollView).first,
            const Offset(0, -500),
          );
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
        });
      }
    }
  }
  test('112쪽 상태 합계가 사실 정본과 일치', () {
    final counts = List<int>.filled(4, 0);
    for (var p = 1; p <= 112; p++) {
      counts[Flatplan.status(p)]++;
    }
    expect(counts, [46, 28, 30, 8]);
  });
  testWidgets('오선 회원 S석 2매 할인과 등급 변경', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: OseonApp(initialScreen: 1)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('합계 ₩72,000'));
    expect(find.text('합계 ₩72,000'), findsOneWidget);
    await tester.ensureVisible(find.text('R석'));
    await tester.tap(find.text('R석'));
    await tester.pumpAndSettle();
    expect(find.text('합계 ₩108,000'), findsOneWidget);
  });
  testWidgets('행간 수량 변경에 무료배송 반영', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: HaengganApp(initialScreen: 1)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('합계 ₩19,000'));
    expect(find.text('합계 ₩19,000'), findsOneWidget);
    await tester.ensureVisible(find.byTooltip('수량 늘리기'));
    await tester.tap(find.byTooltip('수량 늘리기'));
    await tester.pumpAndSettle();
    expect(find.text('합계 ₩32,000'), findsOneWidget);
    expect(find.text('2권 이상 무료배송'), findsOneWidget);
  });
  testWidgets('윤슬 알림 모두 읽음 상태와 검색 빈 상태', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: YunseulApp(initialScreen: 2)),
    );
    await tester.pumpAndSettle();
    expect(find.text('읽지 않음 12건'), findsOneWidget);
    await tester.tap(find.text('모두 읽음'));
    await tester.pumpAndSettle();
    expect(find.text('읽지 않음 0건'), findsOneWidget);
    await tester.enterText(find.byType(TextField), '없는 알림');
    await tester.pumpAndSettle();
    expect(find.text('조건에 맞는 알림이 없어요'), findsOneWidget);
  });
  testWidgets('윤슬 영화 장면에서 메인등 끄기와 무드등 15%', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: YunseulApp()));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('영화 장면 실행'));
    await tester.tap(find.text('영화 장면 실행'));
    await tester.pumpAndSettle();
    expect(find.text('15%'), findsOneWidget);
    final switches = tester.widgetList<Switch>(find.byType(Switch)).toList();
    expect(switches[0].value, false);
    expect(switches[1].value, true);
  });
  testWidgets('런처에서 새 테마 4개 진입과 돌아오기', (tester) async {
    await tester.pumpWidget(const MobileCatalog());
    await tester.pumpAndSettle();
    for (final name in ['02 오선음악당', '03 행간', '04 윤슬홈', '15 모닥']) {
      await tester.ensureVisible(find.text(name));
      await tester.tap(find.text(name));
      await tester.pumpAndSettle();
      expect(find.byTooltip('테마 목록'), findsOneWidget);
      await tester.tap(find.byTooltip('테마 목록'));
      await tester.pumpAndSettle();
      expect(find.text('완성 테마 6종'), findsOneWidget);
    }
  });
  testWidgets('모닥 담요 수량과 기존 장바구니 합계', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ModakApp(initialScreen: 1)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.byTooltip('수량 늘리기'));
    await tester.tap(find.byTooltip('수량 늘리기'));
    await tester.pumpAndSettle();
    expect(find.text('선택 합계 ₩336,000'), findsOneWidget);
    await tester.ensureVisible(find.text('장바구니에 담기'));
    await tester.tap(find.text('장바구니에 담기'));
    await tester.pumpAndSettle();
    expect(find.text('기존 장바구니 ₩232,000'), findsOneWidget);
    expect(find.text('담요 추가 2장 · 합계 ₩568,000'), findsOneWidget);
  });
  testWidgets('모닥 상담 답장 저장 후 미답 집계와 내용 반영', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ModakApp(initialScreen: 2)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('류다온'));
    await tester.tap(find.text('류다온'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField).last, '패브릭 샘플을 준비했어요.');
    await tester.ensureVisible(find.text('답장 저장'));
    await tester.tap(find.text('답장 저장'));
    await tester.pumpAndSettle();
    expect(find.text('미답 5'), findsOneWidget);
    expect(find.text('패브릭 샘플을 준비했어요.'), findsOneWidget);
    expect(find.text('답장 완료'), findsOneWidget);
  });
  testWidgets('모닥 방 조명 합계가 선택과 일치', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ModakApp()));
    await tester.pumpAndSettle();
    await tester.tap(find.text('거실'));
    await tester.pumpAndSettle();
    expect(find.text('불 켜진 방 3개 · 꺼진 방 4개'), findsOneWidget);
  });
  testWidgets('모닥 휴대폰 오류를 수정해 저장', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ModakApp(initialScreen: 3)),
    );
    await tester.pumpAndSettle();
    final field = find.byType(TextField).at(1);
    await tester.ensureVisible(field);
    await tester.enterText(field, '010-2741-0418');
    await tester.ensureVisible(find.text('내 정보 저장'));
    await tester.tap(find.text('내 정보 저장'));
    await tester.pumpAndSettle();
    expect(find.text('내 정보를 저장했어요.'), findsOneWidget);
    expect(find.text('한 자리가 모자라요. 010-1234-5678로 적어 주세요.'), findsNothing);
  });
  testWidgets('윤슬 방 필터에 해당 방 기기만 노출', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: YunseulApp()));
    await tester.pumpAndSettle();
    await tester.tap(find.text('주방 3'));
    await tester.pumpAndSettle();
    expect(find.text('주방 펜던트'), findsOneWidget);
    expect(find.text('식기세척기'), findsOneWidget);
    expect(find.text('나머지 1대'), findsOneWidget);
    expect(find.text('거실 실내'), findsNothing);
  });
}
