import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_design_systems_v2/themes/t01_neobrutalism/screens/panpan_app.dart';
import 'package:mobile_design_systems_v2/themes/t30_corporate_clean_saas/screens/ledger_app.dart';

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
  for (final theme in [1, 30]) {
    for (final dark in [false, true]) {
      for (var page = 0; page < 4; page++) {
        testWidgets('$theme / $page / ${dark ? '다크' : '라이트'} 스크린샷', (
          tester,
        ) async {
          tester.view.physicalSize = const Size(390, 844);
          tester.view.devicePixelRatio = 1;
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          await tester.pumpWidget(
            MaterialApp(
              debugShowCheckedModeBanner: false,
              home: theme == 1
                  ? PanpanApp(dark: dark, initialScreen: page)
                  : LedgerApp(dark: dark, initialScreen: page),
            ),
          );
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/t$theme/${page}_${dark ? 'dark' : 'light'}.png',
            ),
          );
          await tester.pumpWidget(
            MaterialApp(
              debugShowCheckedModeBanner: false,
              builder: (context, child) => MediaQuery(
                data: MediaQuery.of(
                  context,
                ).copyWith(textScaler: TextScaler.linear(1.3)),
                child: child!,
              ),
              home: theme == 1
                  ? PanpanApp(dark: dark, initialScreen: page)
                  : LedgerApp(dark: dark, initialScreen: page),
            ),
          );
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
          await tester.drag(
            find.byType(SingleChildScrollView).first,
            const Offset(0, -450),
          );
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
        });
      }
    }
  }
  testWidgets('결재 승인 후 승인함에 문서 유지', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LedgerApp(initialScreen: 2)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('승인').last);
    await tester.tap(find.text('승인').last);
    await tester.pumpAndSettle();
    expect(find.text('승인 완료'), findsOneWidget);
    await tester.pump(const Duration(seconds: 5));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('결재함으로'));
    await tester.tap(find.text('결재함으로'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('승인'));
    await tester.pumpAndSettle();
    expect(find.text('EXP-2610-0412'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
  testWidgets('문의 검색 결과와 빈 상태', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: PanpanApp(initialScreen: 2)),
    );
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), '없는 음반');
    await tester.pumpAndSettle();
    expect(find.text('조건에 맞는 문의가 없어요.'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('음반 바텀시트의 수령 방법 선택과 담기', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: PanpanApp(initialScreen: 1)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('담을 판 고르기'));
    await tester.tap(find.text('담을 판 고르기'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('택배'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('장바구니에 담기'));
    await tester.pumpAndSettle();
    expect(find.text('지하 3층을 장바구니에 담았어요'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
  testWidgets('전결 한도 검증과 변경값 반영', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LedgerApp(initialScreen: 3)),
    );
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('팀장 전결 한도 편집'));
    await tester.tap(find.text('팀장 전결 한도 편집'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), '0');
    await tester.tap(find.text('적용'));
    await tester.pumpAndSettle();
    expect(find.text('0보다 큰 정수 금액을 입력해 주세요.'), findsOneWidget);
    await tester.enterText(find.byType(TextField), '750000');
    await tester.tap(find.text('적용'));
    await tester.pumpAndSettle();
    expect(find.text('₩750,000 이하'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
