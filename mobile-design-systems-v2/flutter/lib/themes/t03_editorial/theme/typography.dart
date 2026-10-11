import 'package:flutter/material.dart';

class HaengganType {
  static const ui = TextStyle(
    fontFamily: 'IBM Plex Sans KR',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0,
  );
  static const display = TextStyle(
    fontFamily: 'Hahmlet',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 36,
    height: 1.16,
    fontWeight: FontWeight.w900,
    letterSpacing: 0,
  );
  static const number = TextStyle(
    fontFamily: 'Bodoni Moda',
    fontSize: 64,
    height: 1.08,
    fontWeight: FontWeight.w900,
  );
  static const code = TextStyle(
    fontFamily: 'IBM Plex Mono',
    fontFamilyFallback: ['IBM Plex Sans KR'],
    fontSize: 12,
    height: 1.5,
  );
  static const body = TextStyle(
    fontFamily: 'Source Serif 4',
    fontFamilyFallback: ['Noto Serif KR', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.75,
  );
}
