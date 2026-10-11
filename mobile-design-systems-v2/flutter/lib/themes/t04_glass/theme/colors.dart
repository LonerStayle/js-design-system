import 'package:flutter/material.dart';

// 웹 semantic.css 의미 토큰을 양 모드에 직접 대응합니다.
class YunseulColors {
  final bool dark;
  const YunseulColors(this.dark);
  Color get skyTop => dark ? const Color(0xFF060B19) : const Color(0xFF4F8FDF);
  Color get skyMid => dark ? const Color(0xFF0E1E3D) : const Color(0xFF9CC3EE);
  Color get skyLow => dark ? const Color(0xFF1D2F5C) : const Color(0xFFF6C8A8);
  Color get horizon => dark ? const Color(0xFF2A3F6E) : const Color(0xFFFF9D76);
  Color get sun => dark ? const Color(0xFFF4F1E6) : const Color(0xFFFFE2B5);
  Color get sunCore => dark ? const Color(0xFFF4F1E6) : const Color(0xFFFFF6E4);
  Color get sunGlow => dark ? const Color(0x33F4F1E6) : const Color(0x8CFFC48C);
  Color get sunHalo => dark ? const Color(0x0D7FE7F2) : const Color(0x9EFFA86C);
  Color get riverSun =>
      dark ? const Color(0x33F4F1E6) : const Color(0xF2FFD6A8);
  Color get riverSunSoft =>
      dark ? const Color(0x0DF4F1E6) : const Color(0x6BFFB280);
  Color get glintMoon =>
      dark ? const Color(0xFFF4F1E6) : const Color(0xFFFFF1D6);
  Color get river => dark ? const Color(0xFF0B1630) : const Color(0xFF5B87C0);
  Color get riverDeep =>
      dark ? const Color(0xFF070E20) : const Color(0xFF3F6699);
  Color get glint => dark ? const Color(0xFF7FE7F2) : const Color(0xFFFFF1D6);
  Color get skyline => dark ? const Color(0xFF0A1226) : const Color(0xFF3B4F75);
  Color get skylineFar =>
      dark ? const Color(0xFF15223F) : const Color(0xFF7F8FB3);
  Color get hill => dark ? const Color(0xFF111B33) : const Color(0xFFA9A7C2);
  Color get windowLit =>
      dark ? const Color(0xFFFFC56B) : const Color(0xFFFFD08A);
  Color get bridgeLamp =>
      dark ? const Color(0xFF7FE7F2) : const Color(0xFFFFF1D6);
  Color get glass1 => dark ? const Color(0x75111B30) : const Color(0x7AFFFFFF);
  Color get glass1Bare =>
      dark ? const Color(0x61111B30) : const Color(0x66FFFFFF);
  Color get glass2 => dark ? const Color(0x9E111B30) : const Color(0xB8FFFFFF);
  Color get glass3 => dark ? const Color(0xCC111B30) : const Color(0xD6FFFFFF);
  Color get glassClear =>
      dark ? const Color(0x3D111B30) : const Color(0x3DFFFFFF);
  Color get glassSolid =>
      dark ? const Color(0xFF141E33) : const Color(0xFFEEF2F8);
  Color get glassHover =>
      dark ? const Color(0xB21E2C48) : const Color(0xD1FFFFFF);
  Color get glassPress =>
      dark ? const Color(0xBD111B30) : const Color(0x9EFFFFFF);
  Color get glassSunken =>
      dark ? const Color(0x38000000) : const Color(0x0F0F1B2D);
  Color get skel => dark ? const Color(0x1AEEF3FA) : const Color(0x170F1B2D);
  Color get glassInk =>
      dark ? const Color(0xE6030712) : const Color(0xDB0F1B2D);
  Color get onGlassInk =>
      dark ? const Color(0xFFEEF3FA) : const Color(0xFFFFFFFF);
  Color get onGlassInk2 =>
      dark ? const Color(0xFFBAC6D8) : const Color(0xFFBAC6D8);
  Color get glassOffline =>
      dark ? const Color(0x80283042) : const Color(0x9EE6EAF0);
  Color get sweep => dark ? const Color(0x29FFFFFF) : const Color(0x61FFFFFF);
  Color get veilPrimary =>
      dark ? const Color(0x2404232B) : const Color(0x29FFFFFF);
  Color get veilInk => dark ? const Color(0x14FFFFFF) : const Color(0x14FFFFFF);
  Color get veilInkHover =>
      dark ? const Color(0x2EFFFFFF) : const Color(0x29FFFFFF);
  Color get fillGloss =>
      dark ? const Color(0x2EFFFFFF) : const Color(0x47FFFFFF);
  Color get codeHl => dark ? const Color(0x1A7FE7F2) : const Color(0x147FE7F2);
  Color get hairline =>
      dark ? const Color(0x1AEEF3FA) : const Color(0x1F0F1B2D);
  Color get hairlineStrong =>
      dark ? const Color(0x2EEEF3FA) : const Color(0x330F1B2D);
  Color get lineControl =>
      dark ? const Color(0x5CEEF3FA) : const Color(0x6B0F1B2D);
  Color get lineControlHover =>
      dark ? const Color(0x8FEEF3FA) : const Color(0x9E0F1B2D);
  Color get track => dark ? const Color(0x24EEF3FA) : const Color(0x1F0F1B2D);
  Color get text => dark ? const Color(0xFFEEF3FA) : const Color(0xFF0F1B2D);
  Color get text2 => dark ? const Color(0xFFBAC6D8) : const Color(0xFF2E3D53);
  Color get text3 => dark ? const Color(0xFFBAC6D8) : const Color(0xFF2E3D53);
  Color get placeholder =>
      dark ? const Color(0xFFBAC6D8) : const Color(0xFF2E3D53);
  Color get primary => dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get primaryHover =>
      dark ? const Color(0xFF7FE7F2) : const Color(0xFF054A58);
  Color get onPrimary =>
      dark ? const Color(0xFF04232B) : const Color(0xFFFFFFFF);
  Color get primarySoft =>
      dark ? const Color(0x245ED6E6) : const Color(0x1F075A6B);
  Color get primaryLine =>
      dark ? const Color(0x735ED6E6) : const Color(0x66075A6B);
  Color get ring => dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get ringGlow =>
      dark ? const Color(0x405ED6E6) : const Color(0x38075A6B);
  Color get lamp => dark ? const Color(0xFFFFB45C) : const Color(0xFFFFB547);
  Color get lampInk => dark ? const Color(0xFFFFB45C) : const Color(0xFF952A0B);
  Color get lampSoft =>
      dark ? const Color(0x2EFFB45C) : const Color(0x38FFB547);
  Color get tileOn => dark ? const Color(0xFFF2F5FA) : const Color(0xF0FFFFFF);
  Color get tileOnText =>
      dark ? const Color(0xFF0F1B2D) : const Color(0xFF0F1B2D);
  Color get tileOnAccent =>
      dark ? const Color(0xFF0B6577) : const Color(0xFF075A6B);
  Color get tileOnLamp =>
      dark ? const Color(0xFFB5470E) : const Color(0xFF952A0B);
  Color get success => dark ? const Color(0xFF4FD69C) : const Color(0xFF0D5F45);
  Color get successSoft =>
      dark ? const Color(0x244FD69C) : const Color(0x1F0D5F45);
  Color get warning => dark ? const Color(0xFFFFC46B) : const Color(0xFF7A4300);
  Color get warningSoft =>
      dark ? const Color(0x24FFC46B) : const Color(0x1F7A4300);
  Color get danger => dark ? const Color(0xFFFF8A9B) : const Color(0xFF9B1B35);
  Color get dangerSoft =>
      dark ? const Color(0x24FF8A9B) : const Color(0x1A9B1B35);
  Color get onDanger =>
      dark ? const Color(0xFF0F1B2D) : const Color(0xFFFFFFFF);
  Color get info => dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get infoSoft =>
      dark ? const Color(0x1F5ED6E6) : const Color(0x1A075A6B);
  Color get badgeCount =>
      dark ? const Color(0xFFD23A55) : const Color(0xFFE5383B);
  Color get onBadgeCount =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get kelvinWarm =>
      dark ? const Color(0xFFFFB45C) : const Color(0xFFFFB547);
  Color get kelvinMid =>
      dark ? const Color(0xFFF2F5FA) : const Color(0xFFF7F8FA);
  Color get kelvinCool =>
      dark ? const Color(0xFF7FE7F2) : const Color(0xFF9CC3EE);
  Color get codeText =>
      dark ? const Color(0xFFEEF3FA) : const Color(0xFFEEF3FA);
  Color get codeKey => dark ? const Color(0xFF7FE7F2) : const Color(0xFF7FE7F2);
  Color get codeStr => dark ? const Color(0xFFFFC46B) : const Color(0xFFFFC46B);
  Color get codeNum => dark ? const Color(0xFFFF8A9B) : const Color(0xFFFF8A9B);
  Color get codeBool =>
      dark ? const Color(0xFF4FD69C) : const Color(0xFF4FD69C);
  Color get codeCom => dark ? const Color(0xFF9AA8BE) : const Color(0xFF9AA8BE);
  Color get codeLine =>
      dark ? const Color(0x1FEEF3FA) : const Color(0x1FEEF3FA);
  Color get scrim => dark ? const Color(0x6B020610) : const Color(0x381C2846);
  Color get tone1 => dark ? const Color(0x2E5ED6E6) : const Color(0x29075A6B);
  Color get onTone1 => dark ? const Color(0xFF7FE7F2) : const Color(0xFF054A58);
  Color get tone2 => dark ? const Color(0x33FFB45C) : const Color(0x52FFB547);
  Color get onTone2 => dark ? const Color(0xFFFFD08A) : const Color(0xFF952A0B);
  Color get tone3 => dark ? const Color(0x2E4FD69C) : const Color(0x290D5F45);
  Color get onTone3 => dark ? const Color(0xFF4FD69C) : const Color(0xFF0D5F45);
  Color get tone4 => dark ? const Color(0x2EFF8A9B) : const Color(0x1F9B1B35);
  Color get onTone4 => dark ? const Color(0xFFFF8A9B) : const Color(0xFF9B1B35);
  Color get canvas => dark ? const Color(0xFF141E33) : const Color(0xFFEEF2F8);
  Color get surface => dark ? const Color(0xFF141E33) : const Color(0xFFEEF2F8);
  Color get surfaceRaised =>
      dark ? const Color(0xFF141E33) : const Color(0xFFEEF2F8);
  Color get surfaceSunken =>
      dark ? const Color(0x38000000) : const Color(0x0F0F1B2D);
  Color get surfaceHover =>
      dark ? const Color(0xB21E2C48) : const Color(0xD1FFFFFF);
  Color get surfaceInk =>
      dark ? const Color(0xE6030712) : const Color(0xDB0F1B2D);
  Color get onSurfaceInk =>
      dark ? const Color(0xFFEEF3FA) : const Color(0xFFFFFFFF);
  Color get line => dark ? const Color(0x1AEEF3FA) : const Color(0x1F0F1B2D);
  Color get lineStrong =>
      dark ? const Color(0x2EEEF3FA) : const Color(0x330F1B2D);
  Color get ruleHead =>
      dark ? const Color(0x1AEEF3FA) : const Color(0x1F0F1B2D);
  Color get primaryTint =>
      dark ? const Color(0x245ED6E6) : const Color(0x1F075A6B);
  Color get primaryFill =>
      dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get onPrimaryFill =>
      dark ? const Color(0xFF04232B) : const Color(0xFFFFFFFF);
  Color get ink => dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get inkHover =>
      dark ? const Color(0xFF7FE7F2) : const Color(0xFF054A58);
  Color get onInk => dark ? const Color(0xFF04232B) : const Color(0xFFFFFFFF);
  Color get warningTint =>
      dark ? const Color(0x24FFC46B) : const Color(0x1F7A4300);
  Color get stamp => dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
  Color get focusRing =>
      dark ? const Color(0xFF5ED6E6) : const Color(0xFF075A6B);
}
