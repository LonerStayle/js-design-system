import 'package:flutter/material.dart';

// 웹 semantic.css 의미 토큰을 양 모드에 직접 대응합니다.
class OseonColors {
  final bool dark;
  const OseonColors(this.dark);
  Color get bg => dark ? const Color(0xFF0E0E0E) : const Color(0xFFFFFFFF);
  Color get surface => dark ? const Color(0xFF171717) : const Color(0xFFFFFFFF);
  Color get surface2 =>
      dark ? const Color(0xFF222222) : const Color(0xFFF2F2F2);
  Color get fg => dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get fgMuted => dark ? const Color(0xFFA3A3A3) : const Color(0xFF5C5C5C);
  Color get fgPlaceholder =>
      dark ? const Color(0xFF8A8A8A) : const Color(0xFF6B6B6B);
  Color get rule => dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get ruleSoft =>
      dark ? const Color(0xFF3A3A3A) : const Color(0xFFCFCFCF);
  Color get gridLine =>
      dark ? const Color(0xFF3A3A3A) : const Color(0xFFE3E3E3);
  Color get plateInk =>
      dark ? const Color(0xFF000000) : const Color(0xFF0B0B0B);
  Color get onPlateInk =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFFFFFFFF);
  Color get plateEdge =>
      dark ? const Color(0xFF3A3A3A) : const Color(0xFF0B0B0B);
  Color get plateRed =>
      dark ? const Color(0xFFDA291C) : const Color(0xFFDA291C);
  Color get onPlateRed =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get gridLineOnPlate =>
      dark ? const Color(0x2EFFFFFF) : const Color(0x2EFFFFFF);
  Color get fgOnPlateMuted =>
      dark ? const Color(0xFFA3A3A3) : const Color(0xFFA3A3A3);
  Color get accent => dark ? const Color(0xFFDA291C) : const Color(0xFFDA291C);
  Color get onAccent =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get accentHover =>
      dark ? const Color(0xFFB81E14) : const Color(0xFFB81E14);
  Color get accentText =>
      dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get link => dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get focus => dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get successFg =>
      dark ? const Color(0xFF5FC48A) : const Color(0xFF1E7A46);
  Color get warningFg =>
      dark ? const Color(0xFFE0A52E) : const Color(0xFF8A5C00);
  Color get infoFg => dark ? const Color(0xFF7FA8F0) : const Color(0xFF1F5FBF);
  Color get dangerFg =>
      dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get disabledFill =>
      dark ? const Color(0xFF222222) : const Color(0xFFE3E3E3);
  Color get disabledFg =>
      dark ? const Color(0xFF8A8A8A) : const Color(0xFF6B6B6B);
  Color get disabledRule =>
      dark ? const Color(0xFF3A3A3A) : const Color(0xFFCFCFCF);
  Color get overlay => dark ? const Color(0xCC000000) : const Color(0xB80B0B0B);
  Color get gridOverlay =>
      dark ? const Color(0x24DA291C) : const Color(0x14DA291C);
  Color get selection =>
      dark ? const Color(0xFFDA291C) : const Color(0xFFDA291C);
  Color get onSelection =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get posterPaper =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFFFFFFFF);
  Color get onPosterPaper =>
      dark ? const Color(0xFF0B0B0B) : const Color(0xFF0B0B0B);
  Color get posterPaperGrid =>
      dark ? const Color(0xFFCFCFCF) : const Color(0xFFE3E3E3);
  Color get litPaper =>
      dark ? const Color(0xFFE9E7E2) : const Color(0xFFFFFFFF);
  Color get litPaperGrid =>
      dark ? const Color(0xFFC9C5BC) : const Color(0xFFE3E3E3);
  Color get codeBg => dark ? const Color(0xFF0B0B0B) : const Color(0xFF0B0B0B);
  Color get codeFg => dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get codeMuted =>
      dark ? const Color(0xFFA3A3A3) : const Color(0xFFA3A3A3);
  Color get codeRule =>
      dark ? const Color(0x2EFFFFFF) : const Color(0x2EFFFFFF);
  Color get codeNum => dark ? const Color(0xFFFF5240) : const Color(0xFFFF5240);
  Color get codeStr => dark ? const Color(0xFF7FA8F0) : const Color(0xFF7FA8F0);
  Color get codeMark =>
      dark ? const Color(0x24DA291C) : const Color(0x24DA291C);
  Color get canvas => dark ? const Color(0xFF0E0E0E) : const Color(0xFFFFFFFF);
  Color get surfaceRaised =>
      dark ? const Color(0xFF171717) : const Color(0xFFFFFFFF);
  Color get surfaceSunken =>
      dark ? const Color(0xFF222222) : const Color(0xFFF2F2F2);
  Color get surfaceHover =>
      dark ? const Color(0xFF222222) : const Color(0xFFF2F2F2);
  Color get surfaceInk =>
      dark ? const Color(0xFF000000) : const Color(0xFF0B0B0B);
  Color get onSurfaceInk =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFFFFFFFF);
  Color get line => dark ? const Color(0xFF3A3A3A) : const Color(0xFFCFCFCF);
  Color get lineStrong =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get lineControl =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get ruleHead =>
      dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get text => dark ? const Color(0xFFF2F2F0) : const Color(0xFF0B0B0B);
  Color get text2 => dark ? const Color(0xFFA3A3A3) : const Color(0xFF5C5C5C);
  Color get text3 => dark ? const Color(0xFFA3A3A3) : const Color(0xFF5C5C5C);
  Color get placeholder =>
      dark ? const Color(0xFFA3A3A3) : const Color(0xFF5C5C5C);
  Color get primary => dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get primaryHover =>
      dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get primaryTint =>
      dark ? const Color(0xFF222222) : const Color(0xFFF2F2F2);
  Color get primaryFill =>
      dark ? const Color(0xFFDA291C) : const Color(0xFFDA291C);
  Color get onPrimaryFill =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get ink => dark ? const Color(0xFF000000) : const Color(0xFF0B0B0B);
  Color get inkHover =>
      dark ? const Color(0xFF000000) : const Color(0xFF0B0B0B);
  Color get onInk => dark ? const Color(0xFFF2F2F0) : const Color(0xFFFFFFFF);
  Color get danger => dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get onDanger =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get warning => dark ? const Color(0xFFE0A52E) : const Color(0xFF8A5C00);
  Color get warningTint =>
      dark ? const Color(0xFF222222) : const Color(0xFFF2F2F2);
  Color get stamp => dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
  Color get focusRing =>
      dark ? const Color(0xFFFF5240) : const Color(0xFFDA291C);
}
