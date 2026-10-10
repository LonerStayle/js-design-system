import 'package:flutter/material.dart';

class PanpanType {
  static const ui = TextStyle(
    fontFamily: 'IBM Plex Sans KR',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0,
  );
  static const display = TextStyle(
    fontFamily: 'Big Shoulders Display',
    fontFamilyFallback: ['Gasoek One', 'IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 48,
    height: 1.12,
    fontWeight: FontWeight.w400,
    letterSpacing: 0,
  );
  static final number = display.copyWith(
    fontFamily: 'Big Shoulders Display',
    fontVariations: const [FontVariation('wght', 800)],
  );
  static const code = TextStyle(
    fontFamily: 'IBM Plex Mono',
    fontFamilyFallback: ['IBM Plex Sans KR', 'Noto Sans KR'],
    fontSize: 12,
    height: 1.5,
  );
}
