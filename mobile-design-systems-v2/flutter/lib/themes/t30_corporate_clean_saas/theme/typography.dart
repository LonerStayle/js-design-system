import 'package:flutter/material.dart';

class LedgerType {
  static const ui = TextStyle(
    fontFamily: 'Geist',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0,
  );
  static const display = TextStyle(
    fontFamily: 'Geist',
    fontFamilyFallback: [
      'IBM Plex Sans KR',
      'IBM Plex Sans KR',
      'Noto Sans KR',
    ],
    fontSize: 36,
    height: 1.12,
    fontWeight: FontWeight.w800,
    letterSpacing: 0,
  );
  static const code = TextStyle(
    fontFamily: 'Geist Mono',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 12,
    height: 1.5,
  );
}
