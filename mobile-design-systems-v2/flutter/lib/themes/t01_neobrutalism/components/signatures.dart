import 'package:flutter/material.dart';
import '../theme/theme.dart';

class PriceSticker extends StatelessWidget {
  final String label;
  const PriceSticker(this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Transform.rotate(
      angle: -.035,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: c.highlight,
          border: Border.all(color: c.stickerEdge, width: 2),
          boxShadow: [
            BoxShadow(color: c.shadowInk, offset: const Offset(3, 3)),
          ],
        ),
        child: Text(
          label,
          style: PanpanType.ui.copyWith(
            color: c.onHighlight,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

class AlbumArt extends StatelessWidget {
  const AlbumArt({super.key});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Semantics(
      label: '지하 3층 앨범 표지, 흑백 계단과 붉은 사각형',
      image: true,
      child: AspectRatio(
        aspectRatio: 1.45,
        child: CustomPaint(painter: _AlbumPainter(c)),
      ),
    );
  }
}

class _AlbumPainter extends CustomPainter {
  final PanpanColors c;
  _AlbumPainter(this.c);
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = c.printPaper;
    canvas.drawRect(Offset.zero & size, p);
    p.color = c.printInk;
    for (var i = 0; i < 5; i++) {
      canvas.drawRect(
        Rect.fromLTWH(
          0,
          16 + i * size.height * .12,
          size.width,
          size.height * .065,
        ),
        p,
      );
    }
    p.color = c.printRed;
    canvas.drawRect(
      Rect.fromLTWH(
        size.width * .73,
        size.height * .25,
        size.width * .15,
        size.height * .23,
      ),
      p,
    );
  }

  @override
  bool shouldRepaint(_AlbumPainter old) => old.c.dark != c.dark;
}
