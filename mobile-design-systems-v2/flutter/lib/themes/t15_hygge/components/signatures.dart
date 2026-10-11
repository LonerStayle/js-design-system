import 'package:flutter/material.dart';
import '../theme/theme.dart';

Color modakRoom(ModakColors c, int i) => [
  c.roomButter,
  c.roomSage,
  c.roomFjord,
  c.roomOak,
  c.roomRose,
  c.roomEmber,
  c.roomAttic,
][i];

class PencilMemo extends StatelessWidget {
  final String text;
  const PencilMemo(this.text, {super.key});
  @override
  Widget build(BuildContext context) => Transform.rotate(
    angle: -.045,
    alignment: Alignment.centerLeft,
    child: Text(
      text,
      style: ModakType.hand.copyWith(color: ModakTokens.of(context).pencil),
    ),
  );
}

class RoomScene extends StatelessWidget {
  final int scene, color;
  final Set<int> lights;
  const RoomScene({
    super.key,
    this.scene = 0,
    this.color = 0,
    this.lights = const {0, 1, 3, 5},
  });
  @override
  Widget build(BuildContext context) => Semantics(
    label: [
      '모닥의 집, 일곱 방의 단면',
      '의자 팔걸이 위 양모 담요, 뜨개코와 술 장식',
      '네 종류의 패브릭 샘플',
      '현관 문과 신발장, 배송 상자',
    ][scene],
    child: CustomPaint(
      size: Size(
        double.infinity,
        scene == 1
            ? 310
            : scene == 0
            ? 230
            : scene == 2
            ? 156
            : 200,
      ),
      painter: _Objects(ModakTokens.of(context), scene, color, lights),
    ),
  );
}

class _Objects extends CustomPainter {
  final ModakColors c;
  final int scene, color;
  final Set<int> lights;
  _Objects(this.c, this.scene, this.color, this.lights);
  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(
      size.width / 358,
      size.height /
          (scene == 1
              ? 310
              : scene == 0
              ? 230
              : scene == 2
              ? 156
              : 200),
    );
    void rect(
      double x,
      double y,
      double w,
      double h,
      Color col, [
      double r = 0,
    ]) {
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(x, y, w, h), Radius.circular(r)),
        Paint()..color = col,
      );
    }

    void line(
      double x,
      double y,
      double xx,
      double yy,
      Color col, [
      double w = 2,
    ]) {
      canvas.drawLine(
        Offset(x, y),
        Offset(xx, yy),
        Paint()
          ..color = col
          ..strokeWidth = w,
      );
    }

    void dot(double x, double y, double r, Color col) {
      canvas.drawCircle(Offset(x, y), r, Paint()..color = col);
    }

    void glow(double x, double y, double w, double h) {
      if (!c.dark) return;
      final p = Path()
        ..moveTo(x, y)
        ..lineTo(x + w / 2, y + h)
        ..lineTo(x - w / 2, y + h)
        ..close();
      canvas.drawPath(
        p,
        Paint()
          ..shader = LinearGradient(
            colors: [
              c.lamp.withValues(alpha: .55),
              c.lamp.withValues(alpha: 0),
            ],
            stops: const [0, .92],
          ).createShader(Rect.fromLTWH(x - w / 2, y, w, h)),
      );
      canvas.drawOval(
        Rect.fromCenter(center: Offset(x, y + h), width: w, height: 12),
        Paint()..color = c.lamp.withValues(alpha: .2),
      );
    }

    if (scene == 0) {
      rect(6, 202, 346, 28, c.floorFjord);
      line(6, 202, 352, 202, c.objInk.withValues(alpha: .14), 3);
      canvas.drawPath(
        Path()
          ..moveTo(22, 68)
          ..lineTo(177, 4)
          ..lineTo(334, 68)
          ..close(),
        Paint()..color = c.objWoodD,
      );
      rect(20, 65, 316, 138, c.objWood, 4);
      for (var i = 0; i < 6; i++) {
        final x = 26 + (i % 3) * 103.0, y = 71 + (i ~/ 3) * 63.0;
        final index = [2, 4, 6, 0, 1, 3][i];
        rect(x, y, 95, 56, modakRoom(c, index));
        if (i < 3) {
          rect(x + 9, y + 10, 20, 29, c.objSky, 1);
          line(x + 19, y + 10, x + 19, y + 39, c.objFrame, 2);
        }
        if (i == 0) {
          rect(x + 44, y + 13, 30, 34, c.objWoodD);
          for (var k = 0; k < 3; k++) {
            rect(x + 46, y + 16 + k * 9, 26, 3, c.objLinen);
          }
        } else if (i == 1) {
          rect(x + 38, y + 30, 48, 18, c.objLinen, 3);
          rect(x + 41, y + 24, 13, 8, c.objWool, 2);
        } else if (i == 2) {
          rect(x + 49, y + 31, 22, 13, c.objWoodD);
        } else if (i == 3) {
          rect(x + 8, y + 29, 48, 20, c.objChair, 6);
          rect(x + 68, y + 9, 4, 37, c.objWoodD);
          dot(x + 70, y + 12, 12, c.lamp);
        } else if (i == 4) {
          rect(x + 9, y + 27, 70, 20, c.objLinen);
          rect(x + 15, y + 15, 18, 12, c.objCeramic);
        } else {
          rect(x + 18, y + 24, 60, 6, c.objWoodD);
          rect(x + 23, y + 30, 4, 18, c.objWoodD);
          rect(x + 67, y + 30, 4, 18, c.objWoodD);
        }
        if (lights.contains(index)) {
          dot(x + 81, y + 9, 4, c.lamp);
          glow(x + 47, y + 8, 55, 40);
        }
      }
      rect(240, 173, 79, 29, c.roomEmber);
      rect(250, 179, 55, 4, c.objWoodD);
      rect(254, 183, 3, 15, c.objWoodD);
      rect(298, 183, 3, 15, c.objWoodD);
      if (lights.contains(5)) glow(279, 176, 54, 25);
    } else if (scene == 1) {
      final fabric = [
        c.swatchButter,
        c.swatchPine,
        c.dark ? c.objWool : c.swatchSnow,
        c.swatchTangerine,
      ][color];
      final floor = [
        c.floorButter,
        c.floorAttic,
        c.floorRose,
        c.floorEmber,
      ][color];
      rect(0, 254, 358, 56, floor);
      line(0, 254, 358, 254, c.objInk.withValues(alpha: .14), 3);
      canvas.drawOval(
        const Rect.fromLTWH(63, 284, 242, 12),
        Paint()..color = c.objShadow,
      );
      rect(40, 47, 159, 108, c.objChair, 24);
      rect(48, 62, 141, 93, c.objShade, 18);
      rect(41, 176, 243, 77, c.objChair, 18);
      rect(164, 104, 128, 64, c.objShade, 28);
      rect(86, 244, 8, 39, c.objWoodD, 2);
      rect(264, 245, 8, 38, c.objWoodD, 2);
      final blanket = Path()
        ..moveTo(180, 107)
        ..quadraticBezierTo(216, 83, 255, 120)
        ..lineTo(262, 259)
        ..quadraticBezierTo(227, 273, 161, 253)
        ..lineTo(172, 135)
        ..close();
      canvas.drawPath(blanket, Paint()..color = fabric);
      for (var y = 137.0; y < 247; y += 11) {
        for (var x = 180.0; x < 245; x += 12) {
          line(x, y, x + 6, y + 5, c.objInk.withValues(alpha: .25), 2);
          line(x + 6, y + 5, x + 12, y, c.objInk.withValues(alpha: .25), 2);
        }
      }
      line(178, 153, 249, 153, c.objInk.withValues(alpha: .15), 5);
      line(169, 218, 255, 218, c.objInk.withValues(alpha: .15), 5);
      for (var x = 165.0; x < 260; x += 8) {
        line(x, 255, x, 277, c.objWood, 3);
      }
      rect(229, 161, 24, 15, c.paperRaised, 1);
      line(234, 166, 247, 166, c.objInk, 2);
      line(234, 170, 242, 170, c.objInk, 2);
      var callout = 0;
      for (final p in [
        const [126.0, 207.0, 193.0, 194.0],
        const [298.0, 270.0, 251.0, 259.0],
        const [310.0, 137.0, 244.0, 168.0],
      ]) {
        line(p[0], p[1], p[2], p[3], c.objInk.withValues(alpha: .6), 1.5);
        dot(p[2], p[3], 3, c.objInk);
        dot(p[0], p[1], 13, c.objInk);
        callout++;
        final number = TextPainter(
          text: TextSpan(
            text: "$callout",
            style: ModakType.number.copyWith(fontSize: 14, color: c.paper),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        number.paint(
          canvas,
          Offset(p[0] - number.width / 2, p[1] - number.height / 2),
        );
      }
    } else if (scene == 2) {
      for (var i = 0; i < 4; i++) {
        final x = 8 + i * 88.0;
        final col = [
          c.swatchSage,
          c.swatchFirewood,
          c.objLinen,
          c.swatchButter,
        ][i];
        rect(x, 20, 76, 111, col, 3);
        canvas.drawOval(
          Rect.fromLTWH(x + 8, 132, 60, 5),
          Paint()..color = c.objShadow,
        );
        for (var y = 28.0; y < 125; y += 9) {
          for (var xx = x + 7; xx < x + 70; xx += 9) {
            if (i == 0) {
              dot(xx, y, 1.6, c.objInk.withValues(alpha: .18));
            } else if (i == 1) {
              line(xx, y, xx + 5, y + 3, c.objInk.withValues(alpha: .14), 1);
            } else if (i == 2) {
              line(xx, y, xx, y + 6, c.objInk.withValues(alpha: .16), 1);
              line(xx, y, xx + 6, y, c.objInk.withValues(alpha: .12), 1);
            } else {
              line(xx, y, xx + 3, y + 3, c.objInk.withValues(alpha: .18), 1.5);
              line(
                xx + 3,
                y + 3,
                xx + 6,
                y,
                c.objInk.withValues(alpha: .18),
                1.5,
              );
            }
          }
        }
      }
    } else {
      rect(0, 153, 358, 47, c.floorFjord);
      line(0, 153, 358, 153, c.objInk.withValues(alpha: .14), 3);
      rect(17, 25, 20, 125, c.objFrame);
      rect(21, 30, 12, 116, c.objSky);
      for (var y = 47.0; y < 140; y += 16) {
        dot(25, y, 1.5, c.objSnow);
      }
      rect(43, 19, 79, 135, c.objLinen);
      rect(50, 26, 64, 126, c.objWood);
      rect(57, 34, 50, 53, c.objWoodD.withValues(alpha: .38));
      rect(57, 94, 50, 49, c.objWoodD.withValues(alpha: .38));
      dot(108, 87, 3, c.lamp);
      rect(145, 70, 124, 7, c.objWood);
      rect(149, 77, 5, 76, c.objWood);
      rect(260, 77, 5, 76, c.objWood);
      rect(145, 108, 124, 6, c.objWood);
      rect(145, 146, 124, 7, c.objWood);
      for (var i = 0; i < 3; i++) {
        rect(160 + i * 31.0, 94, 22, 12, c.objLinen, 6);
        rect(160 + i * 31.0, 130, 23, 16, i == 1 ? c.objMug : c.objLinen, 3);
      }
      rect(283, 97, 59, 24, c.objWood, 2);
      rect(276, 126, 72, 28, c.objWood, 2);
      line(314, 97, 314, 121, c.objWoodD, 4);
      line(313, 126, 313, 154, c.objWoodD, 4);
      rect(282, 135, 21, 12, c.paperRaised, 1);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_Objects old) =>
      old.c.dark != c.dark || old.color != color || old.lights != lights;
}

class CatalogCallout extends StatelessWidget {
  final int number;
  final String label;
  final VoidCallback? onTap;
  final Color? color;
  const CatalogCallout(
    this.number,
    this.label, {
    super.key,
    this.onTap,
    this.color,
  });
  @override
  Widget build(BuildContext context) {
    final c = ModakTokens.of(context);
    return InkWell(
      onTap: onTap,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Row(
          children: [
            Container(
              width: 26,
              height: 26,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: c.objInk,
                shape: BoxShape.circle,
              ),
              child: Text(
                '$number',
                style: ModakType.number.copyWith(fontSize: 14, color: c.paper),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(label, style: ModakType.ui.copyWith(color: color)),
            ),
          ],
        ),
      ),
    );
  }
}
