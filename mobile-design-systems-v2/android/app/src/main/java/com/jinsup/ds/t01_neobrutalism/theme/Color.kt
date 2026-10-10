package com.jinsup.ds.t01_neobrutalism.theme

import androidx.compose.ui.graphics.Color

// 웹 semantic.css의 의미와 모드 값을 보존한다.
data class PanpanColors(val dark: Boolean) {
    val bg: Color
        get() = if (dark) Color(0xFF121212) else Color(0xFFFFFFFF)

    val surface: Color
        get() = if (dark) Color(0xFF1E1E1E) else Color(0xFFFFFFFF)

    val surface2: Color
        get() = if (dark) Color(0xFF2A2A2A) else Color(0xFFF0F0F0)

    val fg: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFF111111)

    val fgMuted: Color
        get() = if (dark) Color(0xFFA6A6A6) else Color(0xFF555555)

    val rule: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFF111111)

    val shadowInk: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFF111111)

    val accent: Color
        get() = if (dark) Color(0xFFFF3B1F) else Color(0xFFFF3B1F)

    val onAccent: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val highlight: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFFFFD400)

    val onHighlight: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val link: Color
        get() = if (dark) Color(0xFF8C9BFF) else Color(0xFF2A3FFF)

    val focus: Color
        get() = if (dark) Color(0xFF8C9BFF) else Color(0xFF2A3FFF)

    val successFill: Color
        get() = if (dark) Color(0xFF00C46A) else Color(0xFF00C46A)

    val onSuccess: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val successFg: Color
        get() = if (dark) Color(0xFF3DDC84) else Color(0xFF00873F)

    val dangerFill: Color
        get() = if (dark) Color(0xFFFF3B1F) else Color(0xFFFF3B1F)

    val onDanger: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val dangerFg: Color
        get() = if (dark) Color(0xFFFF5A3D) else Color(0xFFC42A10)

    val warningFill: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFFFFD400)

    val onWarning: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val infoFill: Color
        get() = if (dark) Color(0xFF2A3FFF) else Color(0xFF2A3FFF)

    val onInfo: Color
        get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

    val invert: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFF111111)

    val onInvert: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFFFFFFFF)

    val slabInk: Color
        get() = if (dark) Color(0xFF000000) else Color(0xFF111111)

    val onSlabInk: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFFFFFFFF)

    val slabEdge: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFF111111)

    val disabledFill: Color
        get() = if (dark) Color(0xFF2A2A2A) else Color(0xFFD9D9D9)

    val disabledFg: Color
        get() = if (dark) Color(0xFFA6A6A6) else Color(0xFF555555)

    val disabledEdge: Color
        get() = if (dark) Color(0xFFA6A6A6) else Color(0xFF555555)

    val dangerBtn: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val onDangerBtn: Color
        get() = if (dark) Color(0xFFFF5A3D) else Color(0xFFFF5A3D)

    val stickerEdge: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val record: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val recordEdge: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFF111111)

    val recordGroove: Color
        get() = if (dark) Color(0xFF555555) else Color(0xFF555555)

    val recordLabel: Color
        get() = if (dark) Color(0xFFFF3B1F) else Color(0xFFFF3B1F)

    val recordMark: Color
        get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

    val codeBg: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val codeEdge: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFF111111)

    val codeFg: Color
        get() = if (dark) Color(0xFFF2F2F2) else Color(0xFFF2F2F2)

    val codeMuted: Color
        get() = if (dark) Color(0xFFA6A6A6) else Color(0xFFA6A6A6)

    val codeKey: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFFFFD400)

    val codeStr: Color
        get() = if (dark) Color(0xFF3DDC84) else Color(0xFF3DDC84)

    val codeNum: Color
        get() = if (dark) Color(0xFFFF5A3D) else Color(0xFFFF5A3D)

    val codeFn: Color
        get() = if (dark) Color(0xFF8C9BFF) else Color(0xFF8C9BFF)

    val skeleton: Color
        get() = if (dark) Color(0xFF2A2A2A) else Color(0xFFF0F0F0)

    val skeletonAlt: Color
        get() = if (dark) Color(0xFF3A3A3A) else Color(0xFFD9D9D9)

    val overlay: Color
        get() = if (dark) Color(0xB8111111) else Color(0xB8111111)

    val printInk: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val onPrintInk: Color
        get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

    val printPaper: Color
        get() = if (dark) Color(0xFFF0F0F0) else Color(0xFFF0F0F0)

    val onPrintPaper: Color
        get() = if (dark) Color(0xFF111111) else Color(0xFF111111)

    val printRed: Color
        get() = if (dark) Color(0xFFFF3B1F) else Color(0xFFFF3B1F)

    val printYellow: Color
        get() = if (dark) Color(0xFFFFD400) else Color(0xFFFFD400)

    val printCobalt: Color
        get() = if (dark) Color(0xFF2A3FFF) else Color(0xFF2A3FFF)

    val printGreen: Color
        get() = if (dark) Color(0xFF00C46A) else Color(0xFF00C46A)
}
