import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';

class OxfordRule extends StatelessWidget {
  const OxfordRule({super.key});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Column(
      children: [
        Container(height: 3, color: c.ruleStrong),
        const SizedBox(height: 3),
        Container(height: .5, color: c.ruleStrong),
      ],
    );
  }
}

class FolioSheet extends StatelessWidget {
  final String folio;
  final Widget child;
  const FolioSheet(this.folio, {super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            '${HaengganFacts.brand} 2026.11',
            style: HaengganType.ui.copyWith(fontSize: 12, color: c.text2),
          ),
          const SizedBox(height: 24),
          child,
          const SizedBox(height: 32),
          const OxfordRule(),
          const SizedBox(height: 12),
          Text(
            folio,
            textAlign: TextAlign.right,
            style: HaengganType.code.copyWith(color: c.text),
          ),
        ],
      ),
    );
  }
}

class HaengganCover extends StatelessWidget {
  const HaengganCover({super.key});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return AspectRatio(
      aspectRatio: 230 / 297,
      child: Container(
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          color: c.coverBg,
          border: Border.all(color: c.ruleStrong, width: 1.5),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              HaengganFacts.issue,
              style: HaengganType.ui.copyWith(fontSize: 12, color: c.coverFg),
            ),
            const SizedBox(height: 12),
            FittedBox(
              fit: BoxFit.fitWidth,
              child: Text(
                '행간',
                style: HaengganType.display.copyWith(
                  fontSize: 118,
                  height: 1.1,
                  color: c.coverMast,
                ),
              ),
            ),
            const Spacer(),
            Text(
              '활판의\n마지막 가을',
              style: HaengganType.display.copyWith(
                fontSize: 34,
                color: c.coverFg,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              HaengganFacts.appendix,
              style: HaengganType.ui.copyWith(fontSize: 13, color: c.coverFg),
            ),
            const Spacer(),
            SizedBox(
              height: 38,
              width: 140,
              child: CustomPaint(painter: _Barcode(c.coverFg)),
            ),
            Text(
              HaengganFacts.issn,
              style: HaengganType.code.copyWith(color: c.coverFg, fontSize: 9),
            ),
          ],
        ),
      ),
    );
  }
}

class _Barcode extends CustomPainter {
  final Color color;
  _Barcode(this.color);
  @override
  void paint(Canvas c, Size s) {
    final p = Paint()..color = color;
    for (var i = 0; i < 35; i++) {
      c.drawRect(Rect.fromLTWH(i * 4, 0, i % 3 == 0 ? 3 : 1, s.height), p);
    }
  }

  @override
  bool shouldRepaint(_Barcode o) => o.color != color;
}

class Flatplan extends StatelessWidget {
  final VoidCallback onOpen;
  const Flatplan({super.key, required this.onOpen});
  static int status(int p) {
    if ([2, 3, 22, 23, 62, 63, 70, 71].contains(p)) return 3;
    if (p >= 24 && p <= 41 || p >= 90 && p <= 95 || p >= 104 && p <= 107) {
      return 1;
    }
    if (p >= 42 && p <= 53 ||
        p >= 72 && p <= 77 ||
        p >= 96 && p <= 103 ||
        p >= 108 && p <= 111) {
      return 2;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Semantics(
      button: true,
      label: '112쪽 배열표: 조판 완료 46쪽, 교정 중 28쪽, 원고 대기 30쪽, 광고 8쪽. 상세 보기',
      child: InkWell(
        onTap: onOpen,
        child: GridView.count(
          crossAxisCount: 8,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 4,
          mainAxisSpacing: 4,
          childAspectRatio: .85,
          children: [
            for (var p = 1; p <= 112; p++)
              Container(
                decoration: BoxDecoration(
                  color: status(p) == 0 ? c.doneBg : c.canvas,
                  border: Border.all(
                    color: status(p) == 3 ? c.spot : c.ruleStrong,
                    width: status(p) == 3 ? 1.5 : .5,
                  ),
                ),
                child: Stack(
                  children: [
                    if (status(p) == 1)
                      Positioned.fill(
                        child: CustomPaint(painter: _Hatch(c.rule)),
                      ),
                    Center(
                      child: Text(
                        '$p'.padLeft(3, '0'),
                        style: HaengganType.code.copyWith(
                          fontSize: 8,
                          color: status(p) == 0 ? c.doneFg : c.text,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Hatch extends CustomPainter {
  final Color color;
  _Hatch(this.color);
  @override
  void paint(Canvas c, Size s) {
    c.clipRect(Offset.zero & s);
    final p = Paint()
      ..color = color
      ..strokeWidth = .7;
    for (var x = -s.height; x < s.width; x += 5) {
      c.drawLine(Offset(x, 0), Offset(x + s.height, s.height), p);
    }
  }

  @override
  bool shouldRepaint(_Hatch o) => o.color != color;
}

class LeaderRow extends StatelessWidget {
  final String title, folio;
  final VoidCallback? onTap;
  const LeaderRow(this.title, this.folio, {super.key, this.onTap});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: HaengganType.body.copyWith(color: c.text),
              ),
            ),
            const SizedBox(width: 8),
            Text('····', style: HaengganType.code.copyWith(color: c.text2)),
            const SizedBox(width: 8),
            Text(
              folio,
              style: HaengganType.code.copyWith(fontSize: 11, color: c.text),
            ),
          ],
        ),
      ),
    );
  }
}
