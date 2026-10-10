import 'package:flutter/material.dart';

// 웹 semantic.css를 직접 대응한 토큰.
class PanpanColors {
  final bool dark;
  const PanpanColors(this.dark);
  Color get bg => dark ? const Color(0xFF121212) : const Color(0xFFFFFFFF);
  Color get surface => dark ? const Color(0xFF1E1E1E) : const Color(0xFFFFFFFF);
  Color get surface2 =>
      dark ? const Color(0xFF2A2A2A) : const Color(0xFFF0F0F0);
  Color get fg => dark ? const Color(0xFFF2F2F2) : const Color(0xFF111111);
  Color get fgMuted => dark ? const Color(0xFFA6A6A6) : const Color(0xFF555555);
  Color get rule => dark ? const Color(0xFFF2F2F2) : const Color(0xFF111111);
  Color get shadowInk =>
      dark ? const Color(0xFFFFD400) : const Color(0xFF111111);
  Color get accent => dark ? const Color(0xFFFF3B1F) : const Color(0xFFFF3B1F);
  Color get onAccent =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get highlight =>
      dark ? const Color(0xFFFFD400) : const Color(0xFFFFD400);
  Color get onHighlight =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get link => dark ? const Color(0xFF8C9BFF) : const Color(0xFF2A3FFF);
  Color get focus => dark ? const Color(0xFF8C9BFF) : const Color(0xFF2A3FFF);
  Color get successFill =>
      dark ? const Color(0xFF00C46A) : const Color(0xFF00C46A);
  Color get onSuccess =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get successFg =>
      dark ? const Color(0xFF3DDC84) : const Color(0xFF00873F);
  Color get dangerFill =>
      dark ? const Color(0xFFFF3B1F) : const Color(0xFFFF3B1F);
  Color get onDanger =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get dangerFg =>
      dark ? const Color(0xFFFF5A3D) : const Color(0xFFC42A10);
  Color get warningFill =>
      dark ? const Color(0xFFFFD400) : const Color(0xFFFFD400);
  Color get onWarning =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get infoFill =>
      dark ? const Color(0xFF2A3FFF) : const Color(0xFF2A3FFF);
  Color get onInfo => dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get invert => dark ? const Color(0xFFF2F2F2) : const Color(0xFF111111);
  Color get onInvert =>
      dark ? const Color(0xFF111111) : const Color(0xFFFFFFFF);
  Color get slabInk => dark ? const Color(0xFF000000) : const Color(0xFF111111);
  Color get onSlabInk =>
      dark ? const Color(0xFFF2F2F2) : const Color(0xFFFFFFFF);
  Color get slabEdge =>
      dark ? const Color(0xFFFFD400) : const Color(0xFF111111);
  Color get disabledFill =>
      dark ? const Color(0xFF2A2A2A) : const Color(0xFFD9D9D9);
  Color get disabledFg =>
      dark ? const Color(0xFFA6A6A6) : const Color(0xFF555555);
  Color get disabledEdge =>
      dark ? const Color(0xFFA6A6A6) : const Color(0xFF555555);
  Color get dangerBtn =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get onDangerBtn =>
      dark ? const Color(0xFFFF5A3D) : const Color(0xFFFF5A3D);
  Color get stickerEdge =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get record => dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get recordEdge =>
      dark ? const Color(0xFFF2F2F2) : const Color(0xFF111111);
  Color get recordGroove =>
      dark ? const Color(0xFF555555) : const Color(0xFF555555);
  Color get recordLabel =>
      dark ? const Color(0xFFFF3B1F) : const Color(0xFFFF3B1F);
  Color get recordMark =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get codeBg => dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get codeEdge =>
      dark ? const Color(0xFFF2F2F2) : const Color(0xFF111111);
  Color get codeFg => dark ? const Color(0xFFF2F2F2) : const Color(0xFFF2F2F2);
  Color get codeMuted =>
      dark ? const Color(0xFFA6A6A6) : const Color(0xFFA6A6A6);
  Color get codeKey => dark ? const Color(0xFFFFD400) : const Color(0xFFFFD400);
  Color get codeStr => dark ? const Color(0xFF3DDC84) : const Color(0xFF3DDC84);
  Color get codeNum => dark ? const Color(0xFFFF5A3D) : const Color(0xFFFF5A3D);
  Color get codeFn => dark ? const Color(0xFF8C9BFF) : const Color(0xFF8C9BFF);
  Color get skeleton =>
      dark ? const Color(0xFF2A2A2A) : const Color(0xFFF0F0F0);
  Color get skeletonAlt =>
      dark ? const Color(0xFF3A3A3A) : const Color(0xFFD9D9D9);
  Color get overlay => dark ? const Color(0xB8111111) : const Color(0xB8111111);
  Color get printInk =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get onPrintInk =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get printPaper =>
      dark ? const Color(0xFFF0F0F0) : const Color(0xFFF0F0F0);
  Color get onPrintPaper =>
      dark ? const Color(0xFF111111) : const Color(0xFF111111);
  Color get printRed =>
      dark ? const Color(0xFFFF3B1F) : const Color(0xFFFF3B1F);
  Color get printYellow =>
      dark ? const Color(0xFFFFD400) : const Color(0xFFFFD400);
  Color get printCobalt =>
      dark ? const Color(0xFF2A3FFF) : const Color(0xFF2A3FFF);
  Color get printGreen =>
      dark ? const Color(0xFF00C46A) : const Color(0xFF00C46A);
}
