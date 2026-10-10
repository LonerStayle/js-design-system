import 'package:flutter/material.dart';

// 웹 semantic.css를 직접 대응한 토큰.
class LedgerColors {
  final bool dark;
  const LedgerColors(this.dark);
  Color get canvas => dark ? const Color(0xFF0A0C10) : const Color(0xFFF5F6F8);
  Color get surface => dark ? const Color(0xFF11141A) : const Color(0xFFFFFFFF);
  Color get surfaceRaised =>
      dark ? const Color(0xFF181C24) : const Color(0xFFFFFFFF);
  Color get surfaceSunken =>
      dark ? const Color(0xFF0D1015) : const Color(0xFFECEEF2);
  Color get surfaceHover =>
      dark ? const Color(0xFF181C24) : const Color(0xFFF5F6F8);
  Color get surfaceInk =>
      dark ? const Color(0xFFE7EAF0) : const Color(0xFF0E1116);
  Color get onSurfaceInk =>
      dark ? const Color(0xFF0E1116) : const Color(0xFFE7EAF0);
  Color get onSurfaceInk2 =>
      dark ? const Color(0xFF475162) : const Color(0xFFA0A9B8);
  Color get onSurfaceInkLine =>
      dark ? const Color(0xFFB9C0CB) : const Color(0xFF262B35);
  Color get onSurfaceInkLink =>
      dark ? const Color(0xFF1D44D8) : const Color(0xFFA4B5FF);
  Color get line => dark ? const Color(0xFF262B35) : const Color(0xFFDDE1E7);
  Color get lineStrong =>
      dark ? const Color(0xFF3A414E) : const Color(0xFFB9C0CB);
  Color get lineControl =>
      dark ? const Color(0xFF5E6776) : const Color(0xFF8A93A2);
  Color get ruleHead =>
      dark ? const Color(0xFFE7EAF0) : const Color(0xFF0E1116);
  Color get text => dark ? const Color(0xFFE7EAF0) : const Color(0xFF0E1116);
  Color get text2 => dark ? const Color(0xFFA0A9B8) : const Color(0xFF475162);
  Color get text3 => dark ? const Color(0xFF8A94A4) : const Color(0xFF5F6878);
  Color get placeholder =>
      dark ? const Color(0xFF5E6776) : const Color(0xFF8A93A2);
  Color get primary => dark ? const Color(0xFF7C95FF) : const Color(0xFF1D44D8);
  Color get primaryHover =>
      dark ? const Color(0xFFA4B5FF) : const Color(0xFF1636B0);
  Color get primaryTint =>
      dark ? const Color(0xFF18213F) : const Color(0xFFEBF0FF);
  Color get primaryFill =>
      dark ? const Color(0xFF3B5BF0) : const Color(0xFF1D44D8);
  Color get onPrimaryFill =>
      dark ? const Color(0xFFFFFFFF) : const Color(0xFFFFFFFF);
  Color get ink => dark ? const Color(0xFFE7EAF0) : const Color(0xFF0E1116);
  Color get inkHover =>
      dark ? const Color(0xFFC9CFDA) : const Color(0xFF262B35);
  Color get onInk => dark ? const Color(0xFF0A0C10) : const Color(0xFFFFFFFF);
  Color get stamp => dark ? const Color(0xFFFF7452) : const Color(0xFFC2391A);
  Color get stampTint =>
      dark ? const Color(0xFF2A1510) : const Color(0xFFFFF3EF);
  Color get stampOnInk =>
      dark ? const Color(0xFFC2391A) : const Color(0xFFFF7452);
  Color get successOnInk =>
      dark ? const Color(0xFF0F7A45) : const Color(0xFF45C58C);
  Color get warningOnInk =>
      dark ? const Color(0xFF9A5300) : const Color(0xFFEBA53F);
  Color get dangerOnInk =>
      dark ? const Color(0xFFB8122F) : const Color(0xFFFF7A8E);
  Color get success => dark ? const Color(0xFF45C58C) : const Color(0xFF0F7A45);
  Color get successTint =>
      dark ? const Color(0xFF0F2A1E) : const Color(0xFFE6F4EC);
  Color get onSuccess =>
      dark ? const Color(0xFF0A0C10) : const Color(0xFFFFFFFF);
  Color get warning => dark ? const Color(0xFFEBA53F) : const Color(0xFF9A5300);
  Color get warningTint =>
      dark ? const Color(0xFF2D2110) : const Color(0xFFFDF1DC);
  Color get danger => dark ? const Color(0xFFFF7A8E) : const Color(0xFFB8122F);
  Color get dangerTint =>
      dark ? const Color(0xFF33141B) : const Color(0xFFFDE8EC);
  Color get onDanger =>
      dark ? const Color(0xFF0A0C10) : const Color(0xFFFFFFFF);
  Color get info => dark ? const Color(0xFF7C95FF) : const Color(0xFF1D44D8);
  Color get infoTint =>
      dark ? const Color(0xFF18213F) : const Color(0xFFEBF0FF);
  Color get chartActual =>
      dark ? const Color(0xFF7C95FF) : const Color(0xFF1D44D8);
  Color get chartBudget =>
      dark ? const Color(0xFFE7EAF0) : const Color(0xFF0E1116);
  Color get chartPrev =>
      dark ? const Color(0xFF5E6776) : const Color(0xFF8A93A2);
  Color get chart2 => dark ? const Color(0xFF45C58C) : const Color(0xFF0F7A45);
  Color get chart3 => dark ? const Color(0xFFEBA53F) : const Color(0xFF9A5300);
  Color get chartGrid =>
      dark ? const Color(0xFF262B35) : const Color(0xFFDDE1E7);
  Color get codeBg => dark ? const Color(0xFF0D1015) : const Color(0xFF0E1116);
  Color get codeLine =>
      dark ? const Color(0xFF262B35) : const Color(0xFF262B35);
  Color get codeText =>
      dark ? const Color(0xFFE7EAF0) : const Color(0xFFE7EAF0);
  Color get codeMuted =>
      dark ? const Color(0xFF8A94A4) : const Color(0xFF8A94A4);
  Color get codeKey => dark ? const Color(0xFFA4B5FF) : const Color(0xFFA4B5FF);
  Color get codeString =>
      dark ? const Color(0xFF8FDDB4) : const Color(0xFF8FDDB4);
  Color get codeNumber =>
      dark ? const Color(0xFFF2C77E) : const Color(0xFFF2C77E);
  Color get paper => dark ? const Color(0xFFC9CFDA) : const Color(0xFFFFFFFF);
  Color get paperInk =>
      dark ? const Color(0xFF262B35) : const Color(0xFF262B35);
  Color get paperLine =>
      dark ? const Color(0xFFB9C0CB) : const Color(0xFFB9C0CB);
  Color get scrim => dark ? const Color(0xA3000000) : const Color(0x7A0E1116);
  Color get overlayBorder =>
      dark ? const Color(0xFF3A414E) : const Color(0xFFDDE1E7);
  Color get focusRing =>
      dark ? const Color(0xFF7C95FF) : const Color(0xFF1D44D8);
}
