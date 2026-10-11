import 'package:flutter/material.dart';

class YunseulType {
  static const ui = TextStyle(
    fontFamily: 'Outfit',
    fontFamilyFallback: ['Gothic A1', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0,
  );
  static const display = TextStyle(
    fontFamily: 'Outfit',
    fontFamilyFallback: ['Gothic A1', 'Noto Sans KR'],
    fontSize: 36,
    height: 1.16,
    fontWeight: FontWeight.w900,
    letterSpacing: 0,
  );
  static const number = TextStyle(
    fontFamily: 'Outfit',
    fontSize: 64,
    height: 1.08,
    fontWeight: FontWeight.w900,
  );
  static const code = TextStyle(
    fontFamily: 'DM Mono',
    fontFamilyFallback: ['Gothic A1'],
    fontSize: 12,
    height: 1.5,
  );
  static const body = ui;
}
