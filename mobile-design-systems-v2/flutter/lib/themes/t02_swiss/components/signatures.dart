import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/theme.dart';

class GridPlate extends StatelessWidget {
  final String title, number, caption;
  final bool paper, poster;
  final double height;
  const GridPlate({
    super.key,
    required this.title,
    required this.number,
    required this.caption,
    this.paper = false,
    this.poster = false,
    this.height = 200,
  });
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    final wide = number.length > 2;
    final compact = !wide && !poster && !paper && height <= 160;
    final bg = poster
        ? c.plateRed
        : paper
        ? c.litPaper
        : c.plateInk;
    final fg = poster
        ? c.onPlateRed
        : paper
        ? c.onPosterPaper
        : c.onPlateInk;
    return Semantics(
      label: '$title, $number, $caption',
      child: Container(
        height: height,
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          color: bg,
          border: Border(
            top: BorderSide(color: poster ? c.plateInk : c.accent, width: 8),
          ),
        ),
        child: Stack(
          children: [
            Positioned.fill(
              child: CustomPaint(painter: _Grid(fg.withValues(alpha: .16))),
            ),
            Positioned(
              left: wide ? -24 : null,
              right: wide ? null : -8,
              top: paper || compact ? -46 : null,
              bottom: paper || compact
                  ? null
                  : wide
                  ? -12
                  : -36,
              child: Text(
                number,
                textScaler: TextScaler.noScaling,
                style: OseonType.display.copyWith(
                  fontFamily: 'Inter Tight',
                  fontSize: wide ? 96 : 164,
                  height: 1,
                  fontWeight: FontWeight.w900,
                  color: fg,
                ),
              ),
            ),
            Positioned(
              left: wide ? 220 : 16,
              top: wide
                  ? 98
                  : poster
                  ? 24
                  : 20,
              right: 16,
              child: Text(
                caption,
                style: OseonType.ui.copyWith(fontSize: 12, color: fg),
              ),
            ),
            Positioned(
              left: wide ? 220 : 16,
              right: wide
                  ? 16
                  : paper || compact
                  ? 130
                  : 16,
              bottom: wide
                  ? 72
                  : compact
                  ? 24
                  : poster
                  ? 26
                  : 76,
              child: poster
                  ? Transform.rotate(
                      angle: -math.pi / 4,
                      alignment: Alignment.centerLeft,
                      child: Text(
                        title,
                        style: OseonType.display.copyWith(
                          fontSize: 48,
                          color: fg,
                        ),
                      ),
                    )
                  : Text(
                      title,
                      style: OseonType.display.copyWith(
                        fontSize: wide || compact
                            ? 24
                            : paper
                            ? 28
                            : 32,
                        color: fg,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Grid extends CustomPainter {
  final Color color;
  _Grid(this.color);
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = color
      ..strokeWidth = .7;
    for (var x = 16.0; x < size.width; x += (size.width - 32) / 4) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), p);
    }
    for (var y = 0.0; y < size.height; y += 64) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), p);
    }
  }

  @override
  bool shouldRepaint(_Grid old) => old.color != color;
}

class OseonBullet extends StatelessWidget {
  final String label;
  final double value;
  final VoidCallback? onTap;
  const OseonBullet(this.label, this.value, {super.key, this.onTap});
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    style: OseonType.ui.copyWith(fontWeight: FontWeight.w700),
                  ),
                ),
                Text(
                  '$value%',
                  style: OseonType.ui.copyWith(fontWeight: FontWeight.w900),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Semantics(
              label: '판매율 $value%, 목표 85%',
              child: LayoutBuilder(
                builder: (ctx, box) => SizedBox(
                  height: 16,
                  child: Stack(
                    children: [
                      Container(color: c.surface2),
                      FractionallySizedBox(
                        widthFactor: value / 100,
                        child: Container(color: c.fg),
                      ),
                      Positioned(
                        left: box.maxWidth * .85,
                        top: 0,
                        bottom: 0,
                        child: Container(width: 2, color: c.accent),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
