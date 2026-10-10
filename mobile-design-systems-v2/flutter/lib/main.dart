import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'themes/t01_neobrutalism/screens/panpan_app.dart';
import 'themes/t30_corporate_clean_saas/screens/ledger_app.dart';

void main() {
  GoogleFonts.config.allowRuntimeFetching = false;
  LicenseRegistry.addLicense(() async* {
    for (final path in const [
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
    home: theme == 1
        ? PanpanApp(
            dark: dark,
            onBack: () => setState(() => theme = null),
            onToggle: () => setState(() => dark = !dark),
          )
        : theme == 30
        ? LedgerApp(
            dark: dark,
            onBack: () => setState(() => theme = null),
            onToggle: () => setState(() => dark = !dark),
          )
        : Scaffold(
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
                Text(
                  '파일럿 2종',
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                const SizedBox(height: 24),
                ListTile(
                  title: const Text('01 판판레코드'),
                  subtitle: const Text('네오 브루탈리즘 · 운영, 음반, 문의, 매장'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => setState(() => theme = 1),
                ),
                const Divider(),
                ListTile(
                  title: const Text('30 레저라인'),
                  subtitle: const Text('경비 정산 · 마감, 결재, 규칙'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => setState(() => theme = 30),
                ),
                const SizedBox(height: 24),
                const Text('다른 테마는 파일럿 검토 후 추가됩니다.'),
              ],
            ),
          ),
  );
}
