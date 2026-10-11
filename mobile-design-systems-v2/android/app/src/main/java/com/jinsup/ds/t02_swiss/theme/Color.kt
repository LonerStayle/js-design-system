package com.jinsup.ds.t02_swiss.theme

import androidx.compose.ui.graphics.Color

class OseonColors(val dark: Boolean) {
  val bg
    get() = if (dark) Color(0xFF0E0E0E) else Color(0xFFFFFFFF)

  val surface
    get() = if (dark) Color(0xFF171717) else Color(0xFFFFFFFF)

  val surface2
    get() = if (dark) Color(0xFF222222) else Color(0xFFF2F2F2)

  val fg
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val fgMuted
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFF5C5C5C)

  val fgPlaceholder
    get() = if (dark) Color(0xFF8A8A8A) else Color(0xFF6B6B6B)

  val rule
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val ruleSoft
    get() = if (dark) Color(0xFF3A3A3A) else Color(0xFFCFCFCF)

  val gridLine
    get() = if (dark) Color(0xFF3A3A3A) else Color(0xFFE3E3E3)

  val plateInk
    get() = if (dark) Color(0xFF000000) else Color(0xFF0B0B0B)

  val onPlateInk
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFFFFFFFF)

  val plateEdge
    get() = if (dark) Color(0xFF3A3A3A) else Color(0xFF0B0B0B)

  val plateRed
    get() = if (dark) Color(0xFFDA291C) else Color(0xFFDA291C)

  val onPlateRed
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val gridLineOnPlate
    get() = if (dark) Color(0x2EFFFFFF) else Color(0x2EFFFFFF)

  val fgOnPlateMuted
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFFA3A3A3)

  val accent
    get() = if (dark) Color(0xFFDA291C) else Color(0xFFDA291C)

  val onAccent
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val accentHover
    get() = if (dark) Color(0xFFB81E14) else Color(0xFFB81E14)

  val accentText
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val link
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val focus
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val successFg
    get() = if (dark) Color(0xFF5FC48A) else Color(0xFF1E7A46)

  val warningFg
    get() = if (dark) Color(0xFFE0A52E) else Color(0xFF8A5C00)

  val infoFg
    get() = if (dark) Color(0xFF7FA8F0) else Color(0xFF1F5FBF)

  val dangerFg
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val disabledFill
    get() = if (dark) Color(0xFF222222) else Color(0xFFE3E3E3)

  val disabledFg
    get() = if (dark) Color(0xFF8A8A8A) else Color(0xFF6B6B6B)

  val disabledRule
    get() = if (dark) Color(0xFF3A3A3A) else Color(0xFFCFCFCF)

  val overlay
    get() = if (dark) Color(0xCC000000) else Color(0xB80B0B0B)

  val gridOverlay
    get() = if (dark) Color(0x24DA291C) else Color(0x14DA291C)

  val selection
    get() = if (dark) Color(0xFFDA291C) else Color(0xFFDA291C)

  val onSelection
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val posterPaper
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFFFFFFFF)

  val onPosterPaper
    get() = if (dark) Color(0xFF0B0B0B) else Color(0xFF0B0B0B)

  val posterPaperGrid
    get() = if (dark) Color(0xFFCFCFCF) else Color(0xFFE3E3E3)

  val litPaper
    get() = if (dark) Color(0xFFE9E7E2) else Color(0xFFFFFFFF)

  val litPaperGrid
    get() = if (dark) Color(0xFFC9C5BC) else Color(0xFFE3E3E3)

  val codeBg
    get() = if (dark) Color(0xFF0B0B0B) else Color(0xFF0B0B0B)

  val codeFg
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val codeMuted
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFFA3A3A3)

  val codeRule
    get() = if (dark) Color(0x2EFFFFFF) else Color(0x2EFFFFFF)

  val codeNum
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFFF5240)

  val codeStr
    get() = if (dark) Color(0xFF7FA8F0) else Color(0xFF7FA8F0)

  val codeMark
    get() = if (dark) Color(0x24DA291C) else Color(0x24DA291C)

  val canvas
    get() = if (dark) Color(0xFF0E0E0E) else Color(0xFFFFFFFF)

  val surfaceRaised
    get() = if (dark) Color(0xFF171717) else Color(0xFFFFFFFF)

  val surfaceSunken
    get() = if (dark) Color(0xFF222222) else Color(0xFFF2F2F2)

  val surfaceHover
    get() = if (dark) Color(0xFF222222) else Color(0xFFF2F2F2)

  val surfaceInk
    get() = if (dark) Color(0xFF000000) else Color(0xFF0B0B0B)

  val onSurfaceInk
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFFFFFFFF)

  val line
    get() = if (dark) Color(0xFF3A3A3A) else Color(0xFFCFCFCF)

  val lineStrong
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val lineControl
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val ruleHead
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val text
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFF0B0B0B)

  val text2
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFF5C5C5C)

  val text3
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFF5C5C5C)

  val placeholder
    get() = if (dark) Color(0xFFA3A3A3) else Color(0xFF5C5C5C)

  val primary
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val primaryHover
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val primaryTint
    get() = if (dark) Color(0xFF222222) else Color(0xFFF2F2F2)

  val primaryFill
    get() = if (dark) Color(0xFFDA291C) else Color(0xFFDA291C)

  val onPrimaryFill
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val ink
    get() = if (dark) Color(0xFF000000) else Color(0xFF0B0B0B)

  val inkHover
    get() = if (dark) Color(0xFF000000) else Color(0xFF0B0B0B)

  val onInk
    get() = if (dark) Color(0xFFF2F2F0) else Color(0xFFFFFFFF)

  val danger
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val onDanger
    get() = if (dark) Color(0xFFFFFFFF) else Color(0xFFFFFFFF)

  val warning
    get() = if (dark) Color(0xFFE0A52E) else Color(0xFF8A5C00)

  val warningTint
    get() = if (dark) Color(0xFF222222) else Color(0xFFF2F2F2)

  val stamp
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)

  val focusRing
    get() = if (dark) Color(0xFFFF5240) else Color(0xFFDA291C)
}
