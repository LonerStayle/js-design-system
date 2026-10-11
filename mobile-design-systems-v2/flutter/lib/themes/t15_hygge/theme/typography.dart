import 'package:flutter/material.dart';

class ModakType {
  static const ui = TextStyle(
    fontFamily: 'Gowun Dodum',
    fontFamilyFallback: ['Noto Sans KR'],
    fontSize: 16,
    height: 1.65,
    fontWeight: FontWeight.w400,
    letterSpacing: 0,
  );
  static const body = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    fontFamilyFallback: ['Gowun Dodum', 'Noto Sans KR'],
    fontSize: 16,
    height: 1.75,
    fontWeight: FontWeight.w400,
  );
  static const display = TextStyle(
    fontFamily: 'Gowun Dodum',
    fontSize: 32,
    height: 1.2,
    fontWeight: FontWeight.w400,
    letterSpacing: 0,
  );
  static const label = TextStyle(
    fontFamily: 'Sunflower',
    fontSize: 16,
    height: 1.3,
    fontWeight: FontWeight.w500,
  );
  static const number = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    fontSize: 56,
    height: 1.1,
    fontWeight: FontWeight.w800,
  );
  static const hand = TextStyle(
    fontFamily: 'Nanum Pen Script',
    fontSize: 28,
    height: 1.2,
  );
  static const code = TextStyle(
    fontFamily: 'DM Mono',
    fontSize: 12,
    height: 1.5,
  );
}
