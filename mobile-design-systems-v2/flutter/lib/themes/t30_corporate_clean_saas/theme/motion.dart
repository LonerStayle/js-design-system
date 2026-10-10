import 'package:flutter/animation.dart';

class LedgerMotion {
  static const press = Duration(milliseconds: 90),
      snap = Duration(milliseconds: 160),
      stamp = Duration(milliseconds: 200);
  static const ease = Cubic(.2, 0, 0, 1), stampEase = Cubic(.3, 1.4, .5, 1);
}
