import 'package:flutter/animation.dart';

class PanpanMotion {
  static const press = Duration(milliseconds: 90),
      snap = Duration(milliseconds: 140),
      stamp = Duration(milliseconds: 220);
  static const ease = Cubic(.2, 0, 0, 1), stampEase = Cubic(.3, 1.5, .5, 1);
}
