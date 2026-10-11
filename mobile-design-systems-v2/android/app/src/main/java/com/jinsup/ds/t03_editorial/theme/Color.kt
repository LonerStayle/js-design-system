package com.jinsup.ds.t03_editorial.theme

import androidx.compose.ui.graphics.Color

class HaengganColors(val dark: Boolean) {
  val bg
    get() = if (dark) Color(0xFF121110) else Color(0xFFF6F3EC)

  val surface
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val surface2
    get() = if (dark) Color(0xFF24211D) else Color(0xFFDDD5C6)

  val field
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFFBF9F4)

  val layer
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFFBF9F4)

  val layerPaper
    get() = if (dark) Color(0xFF2E2A25) else Color(0xFFECE6DA)

  val text
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val text2
    get() = if (dark) Color(0xFFA39A8C) else Color(0xFF5E574D)

  val text3
    get() = if (dark) Color(0xFFA39A8C) else Color(0xFF5E574D)

  val rule
    get() = if (dark) Color(0xFF3A352F) else Color(0xFFC9C0B0)

  val ruleStrong
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val spot
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFC7341C)

  val spotText
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFA82A16)

  val onSpot
    get() = if (dark) Color(0xFFF6F3EC) else Color(0xFFF6F3EC)

  val spotFill
    get() = if (dark) Color(0xFFB5381F) else Color(0xFFC7341C)

  val spotDisplay
    get() = if (dark) Color(0xFFD2462B) else Color(0xFFC7341C)

  val onSpotFill
    get() = if (dark) Color(0xFFF6F3EC) else Color(0xFFF6F3EC)

  val success
    get() = if (dark) Color(0xFF7CC09B) else Color(0xFF2F6A4C)

  val warning
    get() = if (dark) Color(0xFFE0A84A) else Color(0xFF8A5C0C)

  val info
    get() = if (dark) Color(0xFF8FB0E0) else Color(0xFF2F4E7A)

  val danger
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFA82A16)

  val invertBg
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val invertFg
    get() = if (dark) Color(0xFF121110) else Color(0xFFF6F3EC)

  val invertFg2
    get() = if (dark) Color(0xFF5E574D) else Color(0xFFA39A8C)

  val invertText2
    get() = if (dark) Color(0xFF5E574D) else Color(0xFFA39A8C)

  val doneBg
    get() = if (dark) Color(0xFF4A443C) else Color(0xFF14120F)

  val doneFg
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFF6F3EC)

  val doneFg2
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFA39A8C)

  val inkFace
    get() = if (dark) Color(0xFF24211D) else Color(0xFF14120F)

  val onInkFace
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFF6F3EC)

  val focus
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFC7341C)

  val hoverWash
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val scrim
    get() = if (dark) Color(0x9E000000) else Color(0x7514120F)

  val coverBg
    get() = if (dark) Color(0xFF121110) else Color(0xFFC7341C)

  val coverFg
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFF6F3EC)

  val coverMast
    get() = if (dark) Color(0xFFC7341C) else Color(0xFFF6F3EC)

  val coverStrong
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val backBg
    get() = if (dark) Color(0xFF121110) else Color(0xFF14120F)

  val backFg
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFF6F3EC)

  val backTitle
    get() = if (dark) Color(0xFFC7341C) else Color(0xFFF6F3EC)

  val backAccent
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFC7341C)

  val footBg
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFF14120F)

  val footFg
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFFF6F3EC)

  val footFg2
    get() = if (dark) Color(0xFFA39A8C) else Color(0xFFA39A8C)

  val footRule
    get() = if (dark) Color(0xFF3A352F) else Color(0xFF3A352F)

  val footAccent
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFF26A4F)

  val canvas
    get() = if (dark) Color(0xFF121110) else Color(0xFFF6F3EC)

  val surfaceRaised
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val surfaceSunken
    get() = if (dark) Color(0xFF24211D) else Color(0xFFDDD5C6)

  val surfaceHover
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val surfaceInk
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val onSurfaceInk
    get() = if (dark) Color(0xFF121110) else Color(0xFFF6F3EC)

  val line
    get() = if (dark) Color(0xFF3A352F) else Color(0xFFC9C0B0)

  val lineStrong
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val lineControl
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val ruleHead
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val placeholder
    get() = if (dark) Color(0xFFA39A8C) else Color(0xFF5E574D)

  val primary
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFA82A16)

  val primaryHover
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFA82A16)

  val primaryTint
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val primaryFill
    get() = if (dark) Color(0xFFB5381F) else Color(0xFFC7341C)

  val onPrimaryFill
    get() = if (dark) Color(0xFFF6F3EC) else Color(0xFFF6F3EC)

  val ink
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val inkHover
    get() = if (dark) Color(0xFFEDE6D9) else Color(0xFF14120F)

  val onInk
    get() = if (dark) Color(0xFF121110) else Color(0xFFF6F3EC)

  val onDanger
    get() = if (dark) Color(0xFFF6F3EC) else Color(0xFFF6F3EC)

  val warningTint
    get() = if (dark) Color(0xFF1C1A17) else Color(0xFFECE6DA)

  val stamp
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFA82A16)

  val focusRing
    get() = if (dark) Color(0xFFF26A4F) else Color(0xFFC7341C)
}
