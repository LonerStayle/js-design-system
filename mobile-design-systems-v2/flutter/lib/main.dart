import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'themes/t01_neobrutalism/screens/panpan_app.dart';
import 'themes/t02_swiss/screens/oseon_app.dart';
import 'themes/t03_editorial/screens/haenggan_app.dart';
import 'themes/t04_glass/screens/yunseul_app.dart';
import 'themes/t30_corporate_clean_saas/screens/ledger_app.dart';
import 'themes/t15_hygge/screens/modak_app.dart';

void main() {
  GoogleFonts.config.allowRuntimeFetching = false;
  LicenseRegistry.addLicense(() async* {
    for (final path in const [
      'lib/themes/t15_hygge/fonts/gowundodum/OFL.txt',
      'lib/themes/t15_hygge/fonts/bricolagegrotesque/OFL.txt',
      'lib/themes/t15_hygge/fonts/sunflower/OFL.txt',
      'lib/themes/t15_hygge/fonts/nanumpenscript/OFL.txt',
      'lib/themes/t15_hygge/fonts/dmmono/OFL.txt',
      'lib/themes/t15_hygge/fonts/notosanskr/OFL.txt',

      'lib/themes/t02_swiss/fonts/notosanskr/OFL.txt',
      'lib/themes/t02_swiss/fonts/intertight/OFL.txt',
      'lib/themes/t02_swiss/fonts/jetbrainsmono/OFL.txt',
      'lib/themes/t02_swiss/fonts/gothica1/OFL.txt',
      'lib/themes/t03_editorial/fonts/ibmplexmono/OFL.txt',
      'lib/themes/t03_editorial/fonts/bodonimoda/OFL.txt',
      'lib/themes/t03_editorial/fonts/hahmlet/OFL.txt',
      'lib/themes/t03_editorial/fonts/sourceserif4/OFL.txt',
      'lib/themes/t03_editorial/fonts/ibmplexsanskr/OFL.txt',
      'lib/themes/t03_editorial/fonts/notosanskr/OFL.txt',
      'lib/themes/t03_editorial/fonts/notoserifkr/OFL.txt',
      'lib/themes/t04_glass/fonts/notosanskr/OFL.txt',
      'lib/themes/t04_glass/fonts/dmmono/OFL.txt',
      'lib/themes/t04_glass/fonts/gothica1/OFL.txt',
      'lib/themes/t04_glass/fonts/outfit/OFL.txt',
      'lib/themes/t01_neobrutalism/fonts/ibmplexsanskr/OFL.txt',
      'lib/themes/t01_neobrutalism/fonts/ibmplexmono/OFL.txt',
      'lib/themes/t01_neobrutalism/fonts/gasoekone/OFL.txt',
      'lib/themes/t01_neobrutalism/fonts/notosanskr/OFL.txt',
      'lib/themes/t01_neobrutalism/fonts/bigshouldersdisplay/OFL.txt',
      'lib/themes/t30_corporate_clean_saas/fonts/geistmono/OFL.txt',
      'lib/themes/t30_corporate_clean_saas/fonts/ibmplexsanskr/OFL.txt',
      'lib/themes/t30_corporate_clean_saas/fonts/geist/OFL.txt',
      'lib/themes/t30_corporate_clean_saas/fonts/notosanskr/OFL.txt',
    ]) {
      yield LicenseEntryWithLineBreaks([
        'Google Fonts',
      ], await rootBundle.loadString(path));
    }
  });
  runApp(const MobileCatalog());
}

class MobileCatalog extends StatefulWidget {
  const MobileCatalog({super.key});
  @override
  State<MobileCatalog> createState() => _MobileCatalogState();
}

class _MobileCatalogState extends State<MobileCatalog> {
  int? theme;
  bool dark = false;
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: '모바일 디자인 시스템',
    theme: ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      fontFamily: 'IBM Plex Sans KR',
    ),
    home: switch (theme) {
      1 => PanpanApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      2 => OseonApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      3 => HaengganApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      4 => YunseulApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      15 => ModakApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      30 => LedgerApp(
        dark: dark,
        onBack: () => setState(() => theme = null),
        onToggle: () => setState(() => dark = !dark),
      ),
      _ => Scaffold(
        appBar: AppBar(
          title: const Text('모바일 테마'),
          actions: [
            IconButton(
              tooltip: '밝기 전환',
              onPressed: () => setState(() => dark = !dark),
              icon: const Icon(Icons.contrast),
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            Text('완성 테마 6종', style: Theme.of(context).textTheme.headlineLarge),
            const SizedBox(height: 24),
            for (final row in const [
              (1, '판판레코드', '네오 브루탈리즘'),
              (2, '오선음악당', '스위스 인터내셔널'),
              (3, '행간', '에디토리얼 매거진'),
              (4, '윤슬홈', '글래스모피즘'),
              (15, '모닥', '스칸디나비안 휘게'),
              (30, '레저라인', '경비 정산'),
            ]) ...[
              ListTile(
                title: Text('${row.$1.toString().padLeft(2, '0')} ${row.$2}'),
                subtitle: Text(row.$3),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => setState(() => theme = row.$1),
              ),
              const Divider(),
            ],
          ],
        ),
      ),
    },
  );
}
