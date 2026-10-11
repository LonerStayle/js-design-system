import 'dart:ui' as ui;
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/theme.dart';

class RiverWindow extends StatelessWidget {
  final bool dim;
  const RiverWindow({super.key, this.dim = false});
  @override
  Widget build(BuildContext context) {
    final c = YunseulTokens.of(context);
    return RepaintBoundary(
      child: CustomPaint(painter: _River(c), child: const SizedBox.expand()),
    );
  }
}

class _River extends CustomPainter {
  final YunseulColors c;
  _River(this.c);
  @override
  void paint(Canvas canvas, Size s) {
    final w = s.width, h = s.height;
    final p = Paint()
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(0, h * .78),
        [c.skyTop, c.skyMid, c.skyLow, c.horizon],
        [0, .2, .55, 1],
      );
    canvas.drawRect(Offset.zero & s, p);
    final sun = Offset(w * (c.dark ? .78 : .17), h * (c.dark ? .17 : .48));
    p.shader = ui.Gradient.radial(sun, 54, [
      c.sun.withValues(alpha: .55),
      c.sun.withValues(alpha: 0),
    ]);
    canvas.drawCircle(sun, 54, p);
    p.shader = null;
    p.color = c.sun;
    canvas.drawCircle(sun, c.dark ? 14 : 26, p);
    if (c.dark) {
      p.color = c.sun.withValues(alpha: .55);
      for (var i = 0; i < 32; i++) {
        canvas.drawCircle(
          Offset((i * 71 % 390) / 390 * w, (i * 41 % 210) / 844 * h),
          i % 3 == 0 ? 1.2 : .6,
          p,
        );
      }
    }
    final hill = Path()
      ..moveTo(0, h * .61)
      ..lineTo(w * .15, h * .54)
      ..lineTo(w * .36, h * .59)
      ..lineTo(w * .6, h * .52)
      ..lineTo(w * .82, h * .58)
      ..lineTo(w, h * .53)
      ..lineTo(w, h * .75)
      ..lineTo(0, h * .75)
      ..close();
    p.color = c.hill;
    canvas.drawPath(hill, p);
    for (var i = 0; i < 15; i++) {
      final x = i * w / 14, height = 32 + (i * 17 % 62).toDouble();
      p.color = i.isEven ? c.skyline : c.skylineFar;
      canvas.drawRect(
        Rect.fromLTWH(x, h * .71 - height, w / 20, height + 32),
        p,
      );
      if (c.dark) {
        p.color = c.windowLit;
        for (var y = 6.0; y < height; y += 12) {
          if ((i + y.toInt()) % 3 != 0) {
            canvas.drawRect(
              Rect.fromLTWH(x + 4, h * .71 - height + y, 2, 3),
              p,
            );
          }
        }
      }
    }
    p.shader = ui.Gradient.linear(Offset(0, h * .75), Offset(0, h), [
      c.river,
      c.riverDeep,
    ]);
    canvas.drawRect(Rect.fromLTWH(0, h * .75, w, h * .25), p);
    p.shader = null;
    p.color = c.glint.withValues(alpha: c.dark ? .55 : .6);
    p.strokeWidth = 1.5;
    for (var i = 0; i < 38; i++) {
      final y = h * .78 + i * h * .0054, x = (i * 37 % 390) / 390 * w;
      canvas.drawLine(Offset(x, y), Offset(x + 8 + (i % 5) * 8, y), p);
    }
    p.color = c.skyline;
    p.strokeWidth = 5;
    canvas.drawLine(Offset(0, h * .79), Offset(w, h * .775), p);
  }

  @override
  bool shouldRepaint(_River old) => old.c.dark != c.dark;
}

class GlassPanel extends StatefulWidget {
  final Widget child;
  final double radius, padding;
  final bool on;
  const GlassPanel({
    super.key,
    required this.child,
    this.radius = 24,
    this.padding = 16,
    this.on = false,
  });
  @override
  State<GlassPanel> createState() => _GlassPanelState();
}

class _GlassPanelState extends State<GlassPanel>
    with SingleTickerProviderStateMixin {
  late final sweep = AnimationController(
    vsync: this,
    duration: YunseulMotion.sweep,
    value: 1,
  );
  @override
  void dispose() {
    sweep.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = YunseulTokens.of(context);
    final radius = widget.radius, padding = widget.padding;
    final on = widget.on;
    return Listener(
      onPointerDown: (_) {
        if (!MediaQuery.disableAnimationsOf(context)) sweep.forward(from: 0);
      },
      child: AnimatedBuilder(
        animation: sweep,
        builder: (context, child) => DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(radius),
            boxShadow: [
              BoxShadow(
                color: c.skyline.withValues(alpha: .24),
                blurRadius: 32,
                offset: const Offset(0, 14),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(radius),
            child: BackdropFilter(
              filter: ui.ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: CustomPaint(
                foregroundPainter: _Rim(c, radius, sweep.value),
                child: Container(
                  color: on ? c.tileOn : c.glass2,
                  padding: EdgeInsets.all(padding),
                  child: DefaultTextStyle.merge(
                    style: YunseulType.ui.copyWith(
                      color: on ? c.tileOnText : c.text,
                    ),
                    child: Material(
                      type: MaterialType.transparency,
                      child: widget.child,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Rim extends CustomPainter {
  final YunseulColors c;
  final double radius;
  final double sweep;
  _Rim(this.c, this.radius, this.sweep);
  @override
  void paint(Canvas canvas, Size s) {
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(s.width, s.height),
        [
          c.kelvinMid.withValues(alpha: c.dark ? .35 : 1),
          c.kelvinMid.withValues(alpha: .08),
          c.lamp.withValues(alpha: c.dark ? .4 : .1),
        ],
        [0, .5, 1],
      );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(.75, .75, s.width - 1.5, s.height - 1.5),
        Radius.circular(radius),
      ),
      p,
    );
    if (sweep < 1) {
      final shine = Paint()
        ..shader = ui.Gradient.linear(
          Offset(s.width * (sweep * 3 - 1), 0),
          Offset(s.width * (sweep * 3), s.height),
          [
            c.kelvinMid.withValues(alpha: 0),
            c.kelvinMid.withValues(alpha: .38),
            c.kelvinMid.withValues(alpha: 0),
          ],
          [.38, .5, .62],
        );
      canvas.drawRRect(
        RRect.fromRectAndRadius(Offset.zero & s, Radius.circular(radius)),
        shine,
      );
    }
    p.shader = null;
    p.color = c.kelvinMid.withValues(alpha: c.dark ? .12 : .5);
    p.strokeWidth = 1;
    canvas.drawLine(Offset(radius, 2), Offset(s.width - radius, 2), p);
  }

  @override
  bool shouldRepaint(_Rim old) => old.c.dark != c.dark || old.sweep != sweep;
}

class YunseulLamp extends StatelessWidget {
  final int variant;
  const YunseulLamp(this.variant, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = YunseulTokens.of(context);
    return Semantics(
      label: '유리 돔 무드등, ${['서리', '호박', '심해'][variant]}',
      child: SizedBox(
        height: 272,
        child: CustomPaint(painter: _Lamp(c, variant)),
      ),
    );
  }
}

class _Lamp extends CustomPainter {
  final YunseulColors c;
  final int variant;
  _Lamp(this.c, this.variant);
  @override
  void paint(Canvas canvas, Size s) {
    final center = Offset(s.width * .5, s.height * .46), r = 88.0;
    final glow = [c.kelvinMid, c.lamp, c.primary][variant];
    final p = Paint()
      ..shader = ui.Gradient.radial(center, 126, [
        glow.withValues(alpha: .65),
        glow.withValues(alpha: 0),
      ]);
    canvas.drawCircle(center, 126, p);
    p.shader = ui.Gradient.radial(
      center,
      r,
      [c.kelvinMid, glow.withValues(alpha: .95), glow.withValues(alpha: .12)],
      [0, .24, 1],
    );
    canvas.drawCircle(center, r, p);
    p.shader = null;
    p.style = PaintingStyle.stroke;
    p.strokeWidth = 1.5;
    p.color = c.kelvinMid.withValues(alpha: .7);
    canvas.drawCircle(center, r, p);
    p.color = c.kelvinMid.withValues(alpha: .4);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: r - 10),
      math.pi * .8,
      math.pi * .65,
      false,
      p,
    );
    p.style = PaintingStyle.fill;
    p.shader = ui.Gradient.linear(
      Offset(0, 214),
      Offset(0, 235),
      [c.glassSolid, c.skyline, c.lamp.withValues(alpha: .5)],
      [0, .5, 1],
    );
    canvas.drawOval(
      Rect.fromCenter(center: Offset(s.width / 2, 220), width: 168, height: 24),
      p,
    );
  }

  @override
  bool shouldRepaint(_Lamp o) => o.variant != variant || o.c.dark != c.dark;
}

class YunseulGauge extends StatelessWidget {
  final double value;
  final String label;
  const YunseulGauge(this.value, this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = YunseulTokens.of(context);
    return Semantics(
      label: label,
      child: SizedBox(
        height: 160,
        child: Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 144,
              height: 144,
              child: CircularProgressIndicator(
                value: value,
                strokeWidth: 8,
                color: c.primary,
                backgroundColor: c.track,
              ),
            ),
            Text(
              label,
              style: YunseulType.number.copyWith(
                fontSize: 50,
                fontWeight: FontWeight.w200,
                color: c.text,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
