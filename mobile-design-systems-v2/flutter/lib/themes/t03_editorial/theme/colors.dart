import 'package:flutter/material.dart';

// 웹 semantic.css 의미 토큰을 양 모드에 직접 대응합니다.
class HaengganColors {
  final bool dark;
  const HaengganColors(this.dark);
  Color get bg => dark ? const Color(0xFF121110) : const Color(0xFFF6F3EC);
  Color get surface => dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get surface2 =>
      dark ? const Color(0xFF24211D) : const Color(0xFFDDD5C6);
  Color get field => dark ? const Color(0xFF1C1A17) : const Color(0xFFFBF9F4);
  Color get layer => dark ? const Color(0xFF1C1A17) : const Color(0xFFFBF9F4);
  Color get layerPaper =>
      dark ? const Color(0xFF2E2A25) : const Color(0xFFECE6DA);
  Color get text => dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get text2 => dark ? const Color(0xFFA39A8C) : const Color(0xFF5E574D);
  Color get text3 => dark ? const Color(0xFFA39A8C) : const Color(0xFF5E574D);
  Color get rule => dark ? const Color(0xFF3A352F) : const Color(0xFFC9C0B0);
  Color get ruleStrong =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get spot => dark ? const Color(0xFFF26A4F) : const Color(0xFFC7341C);
  Color get spotText =>
      dark ? const Color(0xFFF26A4F) : const Color(0xFFA82A16);
  Color get onSpot => dark ? const Color(0xFFF6F3EC) : const Color(0xFFF6F3EC);
  Color get spotFill =>
      dark ? const Color(0xFFB5381F) : const Color(0xFFC7341C);
  Color get spotDisplay =>
      dark ? const Color(0xFFD2462B) : const Color(0xFFC7341C);
  Color get onSpotFill =>
      dark ? const Color(0xFFF6F3EC) : const Color(0xFFF6F3EC);
  Color get success => dark ? const Color(0xFF7CC09B) : const Color(0xFF2F6A4C);
  Color get warning => dark ? const Color(0xFFE0A84A) : const Color(0xFF8A5C0C);
  Color get info => dark ? const Color(0xFF8FB0E0) : const Color(0xFF2F4E7A);
  Color get danger => dark ? const Color(0xFFF26A4F) : const Color(0xFFA82A16);
  Color get invertBg =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get invertFg =>
      dark ? const Color(0xFF121110) : const Color(0xFFF6F3EC);
  Color get invertFg2 =>
      dark ? const Color(0xFF5E574D) : const Color(0xFFA39A8C);
  Color get invertText2 =>
      dark ? const Color(0xFF5E574D) : const Color(0xFFA39A8C);
  Color get doneBg => dark ? const Color(0xFF4A443C) : const Color(0xFF14120F);
  Color get doneFg => dark ? const Color(0xFFEDE6D9) : const Color(0xFFF6F3EC);
  Color get doneFg2 => dark ? const Color(0xFFEDE6D9) : const Color(0xFFA39A8C);
  Color get inkFace => dark ? const Color(0xFF24211D) : const Color(0xFF14120F);
  Color get onInkFace =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFFF6F3EC);
  Color get focus => dark ? const Color(0xFFF26A4F) : const Color(0xFFC7341C);
  Color get hoverWash =>
      dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get scrim => dark ? const Color(0x9E000000) : const Color(0x7514120F);
  Color get coverBg => dark ? const Color(0xFF121110) : const Color(0xFFC7341C);
  Color get coverFg => dark ? const Color(0xFFEDE6D9) : const Color(0xFFF6F3EC);
  Color get coverMast =>
      dark ? const Color(0xFFC7341C) : const Color(0xFFF6F3EC);
  Color get coverStrong =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get backBg => dark ? const Color(0xFF121110) : const Color(0xFF14120F);
  Color get backFg => dark ? const Color(0xFFEDE6D9) : const Color(0xFFF6F3EC);
  Color get backTitle =>
      dark ? const Color(0xFFC7341C) : const Color(0xFFF6F3EC);
  Color get backAccent =>
      dark ? const Color(0xFFF26A4F) : const Color(0xFFC7341C);
  Color get footBg => dark ? const Color(0xFF1C1A17) : const Color(0xFF14120F);
  Color get footFg => dark ? const Color(0xFFEDE6D9) : const Color(0xFFF6F3EC);
  Color get footFg2 => dark ? const Color(0xFFA39A8C) : const Color(0xFFA39A8C);
  Color get footRule =>
      dark ? const Color(0xFF3A352F) : const Color(0xFF3A352F);
  Color get footAccent =>
      dark ? const Color(0xFFF26A4F) : const Color(0xFFF26A4F);
  Color get canvas => dark ? const Color(0xFF121110) : const Color(0xFFF6F3EC);
  Color get surfaceRaised =>
      dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get surfaceSunken =>
      dark ? const Color(0xFF24211D) : const Color(0xFFDDD5C6);
  Color get surfaceHover =>
      dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get surfaceInk =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get onSurfaceInk =>
      dark ? const Color(0xFF121110) : const Color(0xFFF6F3EC);
  Color get line => dark ? const Color(0xFF3A352F) : const Color(0xFFC9C0B0);
  Color get lineStrong =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get lineControl =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get ruleHead =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get placeholder =>
      dark ? const Color(0xFFA39A8C) : const Color(0xFF5E574D);
  Color get primary => dark ? const Color(0xFFF26A4F) : const Color(0xFFA82A16);
  Color get primaryHover =>
      dark ? const Color(0xFFF26A4F) : const Color(0xFFA82A16);
  Color get primaryTint =>
      dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get primaryFill =>
      dark ? const Color(0xFFB5381F) : const Color(0xFFC7341C);
  Color get onPrimaryFill =>
      dark ? const Color(0xFFF6F3EC) : const Color(0xFFF6F3EC);
  Color get ink => dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get inkHover =>
      dark ? const Color(0xFFEDE6D9) : const Color(0xFF14120F);
  Color get onInk => dark ? const Color(0xFF121110) : const Color(0xFFF6F3EC);
  Color get onDanger =>
      dark ? const Color(0xFFF6F3EC) : const Color(0xFFF6F3EC);
  Color get warningTint =>
      dark ? const Color(0xFF1C1A17) : const Color(0xFFECE6DA);
  Color get stamp => dark ? const Color(0xFFF26A4F) : const Color(0xFFA82A16);
  Color get focusRing =>
      dark ? const Color(0xFFF26A4F) : const Color(0xFFC7341C);
}
