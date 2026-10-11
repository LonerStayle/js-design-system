import 'package:flutter/material.dart';

class OseonType {
  static const ui = TextStyle(
    fontFamily: 'Inter Tight',
    fontFamilyFallback: ['Gothic A1', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0,
  );
  static const display = TextStyle(
    fontFamily: 'Inter Tight',
    fontFamilyFallback: ['Gothic A1', 'Noto Sans KR'],
    fontSize: 36,
    height: 1.16,
    fontWeight: FontWeight.w900,
    letterSpacing: 0,
  );
  static const number = TextStyle(
    fontFamily: 'Inter Tight',
    fontSize: 64,
    height: 1.08,
    fontWeight: FontWeight.w900,
  );
  static const code = TextStyle(
    fontFamily: 'JetBrains Mono',
    fontFamilyFallback: ['Gothic A1'],
    fontSize: 12,
    height: 1.5,
  );
  static const body = ui;
}
