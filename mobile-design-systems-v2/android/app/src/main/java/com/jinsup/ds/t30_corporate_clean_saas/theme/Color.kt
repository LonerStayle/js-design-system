package com.jinsup.ds.t30_corporate_clean_saas.theme

import androidx.compose.ui.graphics.Color

// 웹 semantic.css의 의미와 모드 값을 보존한다.
data class LedgerColors(val dark: Boolean) {
    val canvas: Color
        get() = if (dark) Color(0xFF0A0C10) else Color(0xFFF5F6F8)

    val surface: Color
        get() = if (dark) Color(0xFF11141A) else Color(0xFFFFFFFF)

    val surfaceRaised: Color
        get() = if (dark) Color(0xFF181C24) else Color(0xFFFFFFFF)

    val surfaceSunken: Color
        get() = if (dark) Color(0xFF0D1015) else Color(0xFFECEEF2)

    val surfaceHover: Color
        get() = if (dark) Color(0xFF181C24) else Color(0xFFF5F6F8)

    val surfaceInk: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFF0E1116)

    val onSurfaceInk: Color
        get() = if (dark) Color(0xFF0E1116) else Color(0xFFE7EAF0)

    val onSurfaceInk2: Color
        get() = if (dark) Color(0xFF475162) else Color(0xFFA0A9B8)

    val onSurfaceInkLine: Color
        get() = if (dark) Color(0xFFB9C0CB) else Color(0xFF262B35)

    val onSurfaceInkLink: Color
        get() = if (dark) Color(0xFF1D44D8) else Color(0xFFA4B5FF)

    val line: Color
        get() = if (dark) Color(0xFF262B35) else Color(0xFFDDE1E7)

    val lineStrong: Color
        get() = if (dark) Color(0xFF3A414E) else Color(0xFFB9C0CB)

    val lineControl: Color
        get() = if (dark) Color(0xFF5E6776) else Color(0xFF8A93A2)

    val ruleHead: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFF0E1116)

    val text: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFF0E1116)

    val text2: Color
        get() = if (dark) Color(0xFFA0A9B8) else Color(0xFF475162)

    val text3: Color
        get() = if (dark) Color(0xFF8A94A4) else Color(0xFF5F6878)

    val placeholder: Color
        get() = if (dark) Color(0xFF5E6776) else Color(0xFF8A93A2)

    val primary: Color
        get() = if (dark) Color(0xFF7C95FF) else Color(0xFF1D44D8)

    val primaryHover: Color
        get() = if (dark) Color(0xFFA4B5FF) else Color(0xFF1636B0)

    val primaryTint: Color
        get() = if (dark) Color(0xFF18213F) else Color(0xFFEBF0FF)

    val primaryFill: Color
        get() = if (dark) Color(0xFF3B5BF0) else Color(0xFF1D44D8)

    val onPrimaryFill: Color
        get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

    val ink: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFF0E1116)

    val inkHover: Color
        get() = if (dark) Color(0xFFC9CFDA) else Color(0xFF262B35)

    val onInk: Color
        get() = if (dark) Color(0xFF0A0C10) else Color(0xFFFFFFFF)

    val stamp: Color
        get() = if (dark) Color(0xFFFF7452) else Color(0xFFC2391A)

    val stampTint: Color
        get() = if (dark) Color(0xFF2A1510) else Color(0xFFFFF3EF)

    val stampOnInk: Color
        get() = if (dark) Color(0xFFC2391A) else Color(0xFFFF7452)

    val successOnInk: Color
        get() = if (dark) Color(0xFF0F7A45) else Color(0xFF45C58C)

    val warningOnInk: Color
        get() = if (dark) Color(0xFF9A5300) else Color(0xFFEBA53F)

    val dangerOnInk: Color
        get() = if (dark) Color(0xFFB8122F) else Color(0xFFFF7A8E)

    val success: Color
        get() = if (dark) Color(0xFF45C58C) else Color(0xFF0F7A45)

    val successTint: Color
        get() = if (dark) Color(0xFF0F2A1E) else Color(0xFFE6F4EC)

    val onSuccess: Color
        get() = if (dark) Color(0xFF0A0C10) else Color(0xFFFFFFFF)

    val warning: Color
        get() = if (dark) Color(0xFFEBA53F) else Color(0xFF9A5300)

    val warningTint: Color
        get() = if (dark) Color(0xFF2D2110) else Color(0xFFFDF1DC)

    val danger: Color
        get() = if (dark) Color(0xFFFF7A8E) else Color(0xFFB8122F)

    val dangerTint: Color
        get() = if (dark) Color(0xFF33141B) else Color(0xFFFDE8EC)

    val onDanger: Color
        get() = if (dark) Color(0xFF0A0C10) else Color(0xFFFFFFFF)

    val info: Color
        get() = if (dark) Color(0xFF7C95FF) else Color(0xFF1D44D8)

    val infoTint: Color
        get() = if (dark) Color(0xFF18213F) else Color(0xFFEBF0FF)

    val chartActual: Color
        get() = if (dark) Color(0xFF7C95FF) else Color(0xFF1D44D8)

    val chartBudget: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFF0E1116)

    val chartPrev: Color
        get() = if (dark) Color(0xFF5E6776) else Color(0xFF8A93A2)

    val chart2: Color
        get() = if (dark) Color(0xFF45C58C) else Color(0xFF0F7A45)

    val chart3: Color
        get() = if (dark) Color(0xFFEBA53F) else Color(0xFF9A5300)

    val chartGrid: Color
        get() = if (dark) Color(0xFF262B35) else Color(0xFFDDE1E7)

    val codeBg: Color
        get() = if (dark) Color(0xFF0D1015) else Color(0xFF0E1116)

    val codeLine: Color
        get() = if (dark) Color(0xFF262B35) else Color(0xFF262B35)

    val codeText: Color
        get() = if (dark) Color(0xFFE7EAF0) else Color(0xFFE7EAF0)

    val codeMuted: Color
        get() = if (dark) Color(0xFF8A94A4) else Color(0xFF8A94A4)

    val codeKey: Color
        get() = if (dark) Color(0xFFA4B5FF) else Color(0xFFA4B5FF)

    val codeString: Color
        get() = if (dark) Color(0xFF8FDDB4) else Color(0xFF8FDDB4)

    val codeNumber: Color
        get() = if (dark) Color(0xFFF2C77E) else Color(0xFFF2C77E)

    val paper: Color
        get() = if (dark) Color(0xFFC9CFDA) else Color(0xFFFFFFFF)

    val paperInk: Color
        get() = if (dark) Color(0xFF262B35) else Color(0xFF262B35)

    val paperLine: Color
        get() = if (dark) Color(0xFFB9C0CB) else Color(0xFFB9C0CB)

    val scrim: Color
        get() = if (dark) Color(0xA3000000) else Color(0x7A0E1116)

    val overlayBorder: Color
        get() = if (dark) Color(0xFF3A414E) else Color(0xFFDDE1E7)

    val focusRing: Color
        get() = if (dark) Color(0xFF7C95FF) else Color(0xFF1D44D8)
}
