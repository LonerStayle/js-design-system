package com.jinsup.ds.t15_hygge.theme

import androidx.compose.ui.graphics.Color

class ModakColors(val dark: Boolean) {
  val paper
    get() = if (dark) Color(0xFF221A16) else Color(0xFFF5EDE2)

  val paperRaised
    get() = if (dark) Color(0xFF2E241F) else Color(0xFFFFFAF3)

  val paperSunken
    get() = if (dark) Color(0xFF1A1411) else Color(0xFFEADFCF)

  val ink
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFF2E241E)

  val ink2
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFF5E4E41)

  val inkOnRoom
    get() = if (dark) Color(0xFFD9C8B3) else Color(0xFF4F4136)

  val line
    get() = if (dark) Color(0xFF4A3C33) else Color(0xFFD8C8B4)

  val lineStrong
    get() = if (dark) Color(0xFF8A7563) else Color(0xFF8C7A69)

  val shadeMix
    get() = if (dark) Color(0xFF000000) else Color(0xFF2E241E)

  val brand
    get() = if (dark) Color(0xFFE06F3E) else Color(0xFFA8472A)

  val brandHover
    get() = if (dark) Color(0xFFEA8250) else Color(0xFF8F3B22)

  val brandText
    get() = if (dark) Color(0xFFEC8452) else Color(0xFFA8472A)

  val brandPress
    get() = if (dark) Color(0xFFCD673A) else Color(0xFF7F331B)

  val onBrand
    get() = if (dark) Color(0xFF221A16) else Color(0xFFFFF6EA)

  val brandSoft
    get() = if (dark) Color(0xFF4A3024) else Color(0xFFF5E5DB)

  val pencil
    get() = if (dark) Color(0xFFF4A57E) else Color(0xFF7F331B)

  val lamp
    get() = if (dark) Color(0xFFF2B35B) else Color(0xFFF2B35B)

  val objWool
    get() = if (dark) Color(0xFF6B5A4C) else Color(0xFFF3EFE7)

  val roomButter
    get() = if (dark) Color(0xFF4F3E17) else Color(0xFFF2C86B)

  val floorButter
    get() = if (dark) Color(0xFF433412) else Color(0xFFE3BA62)

  val roomSage
    get() = if (dark) Color(0xFF2F3A2C) else Color(0xFFB7C4A3)

  val floorSage
    get() = if (dark) Color(0xFF283226) else Color(0xFFA9B596)

  val roomFjord
    get() = if (dark) Color(0xFF26323B) else Color(0xFFA9BFCB)

  val floorFjord
    get() = if (dark) Color(0xFF202A32) else Color(0xFF9CB0BB)

  val roomOak
    get() = if (dark) Color(0xFF45382B) else Color(0xFFE2C9A6)

  val floorOak
    get() = if (dark) Color(0xFF3B3025) else Color(0xFFD2BA98)

  val roomRose
    get() = if (dark) Color(0xFF4D2C33) else Color(0xFFE6B8A8)

  val floorRose
    get() = if (dark) Color(0xFF42252B) else Color(0xFFD6AA9B)

  val roomEmber
    get() = if (dark) Color(0xFF65301A) else Color(0xFFD9774B)

  val floorEmber
    get() = if (dark) Color(0xFF572916) else Color(0xFFC96D45)

  val roomAttic
    get() = if (dark) Color(0xFF232A22) else Color(0xFF3E4A3D)

  val floorAttic
    get() = if (dark) Color(0xFF1D231C) else Color(0xFF343F33)

  val roomDoor
    get() = if (dark) Color(0xFF140F0C) else Color(0xFF2E241E)

  val dotButter
    get() = if (dark) Color(0xFFC4A258) else Color(0xFFF2C86B)

  val dotSage
    get() = if (dark) Color(0xFF90987E) else Color(0xFFB7C4A3)

  val dotFjord
    get() = if (dark) Color(0xFF86949C) else Color(0xFFA9BFCB)

  val dotOak
    get() = if (dark) Color(0xFFA8957B) else Color(0xFFE2C9A6)

  val dotRose
    get() = if (dark) Color(0xFFB38F82) else Color(0xFFE6B8A8)

  val dotEmber
    get() = if (dark) Color(0xFFBF6A44) else Color(0xFFD9774B)

  val dotAttic
    get() = if (dark) Color(0xFF859077) else Color(0xFF3E4A3D)

  val dotDoor
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFF2E241E)

  val onAttic
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFFFF6EA)

  val onDoor
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFF5EDE2)

  val onDoor2
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFFBDB5AB)

  val ok
    get() = if (dark) Color(0xFF9FC79A) else Color(0xFF3F6B45)

  val okSoft
    get() = if (dark) Color(0xFF424135) else Color(0xFFDCE4D2)

  val warn
    get() = if (dark) Color(0xFFE9BE62) else Color(0xFF8A5A0B)

  val warnSoft
    get() = if (dark) Color(0xFF50402B) else Color(0xFFF7D98F)

  val danger
    get() = if (dark) Color(0xFFF08C76) else Color(0xFFA23B2A)

  val dangerSoft
    get() = if (dark) Color(0xFF51372F) else Color(0xFFF2D3C8)

  val info
    get() = if (dark) Color(0xFF9CC0D8) else Color(0xFF365F7A)

  val infoSoft
    get() = if (dark) Color(0xFF424040) else Color(0xFFD6E2E9)

  val swatchButter
    get() = if (dark) Color(0xFFB49043) else Color(0xFFEDBE55)

  val swatchPine
    get() = if (dark) Color(0xFF748666) else Color(0xFF5E7553)

  val swatchSnow
    get() = if (dark) Color(0xFFB0ABA4) else Color(0xFFF3EFE7)

  val swatchTangerine
    get() = if (dark) Color(0xFFB26E33) else Color(0xFFE0883C)

  val swatchFirewood
    get() = if (dark) Color(0xFFB15A3E) else Color(0xFFA8472A)

  val swatchSage
    get() = if (dark) Color(0xFF737C61) else Color(0xFF9DAE88)

  val swatchCharcoal
    get() = if (dark) Color(0xFF665B52) else Color(0xFF3B3431)

  val floatEdge
    get() = if (dark) Color(0xFF4A3C33) else Color(0x00000000)

  val scrim
    get() = if (dark) Color(0x9E0A0705) else Color(0x7A2E241E)

  val focusInk
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFF2E241E)

  val focusHalo
    get() = if (dark) Color(0x8CF2B35B) else Color(0x99F2B35B)

  val ribbonBg
    get() = if (dark) Color(0xFF65301A) else Color(0xFF2E241E)

  val ribbonFg
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFF5EDE2)

  val tagBg
    get() = if (dark) Color(0xFF45382B) else Color(0xFFE2C9A6)

  val tagFg
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFF2E241E)

  val switchOn
    get() = if (dark) Color(0xFF694F31) else Color(0xFF2E241E)

  val objInk
    get() = if (dark) Color(0xFF8B8075) else Color(0xFF2E241E)

  val objWood
    get() = if (dark) Color(0xFF725A49) else Color(0xFFD4A987)

  val objWoodD
    get() = if (dark) Color(0xFF5A3F31) else Color(0xFFB47B5D)

  val objFabric
    get() = if (dark) Color(0xFFB49043) else Color(0xFFEDBE55)

  val objChair
    get() = if (dark) Color(0xFF737C61) else Color(0xFF9DAE88)

  val objShade
    get() = if (dark) Color(0xFF737C61) else Color(0xFF9DAE88)

  val objMug
    get() = if (dark) Color(0xFF665B52) else Color(0xFF3B3431)

  val objCeramic
    get() = if (dark) Color(0xFF6B5A4C) else Color(0xFFFFFAF3)

  val objLinen
    get() = if (dark) Color(0xFF8C7A68) else Color(0xFFFFFAF3)

  val objLinenD
    get() = if (dark) Color(0xFF756556) else Color(0xFFE6E0D9)

  val objWax
    get() = if (dark) Color(0xFFF3CF9D) else Color(0xFFFAE1BE)

  val objSky
    get() = if (dark) Color(0xFF1C2230) else Color(0xFFEBB685)

  val objSkyNight
    get() = if (dark) Color(0xFF1C2230) else Color(0xFF1C2230)

  val objSun
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFFBE5C5)

  val objHill
    get() = if (dark) Color(0xFF21262A) else Color(0xFF748584)

  val objSnow
    get() = if (dark) Color(0xFF767474) else Color(0xFFFFFAF3)

  val objFrame
    get() = if (dark) Color(0xFF584F47) else Color(0xFFFFFAF3)

  val objCat
    get() = if (dark) Color(0xFF9D6A3A) else Color(0xFFDC934C)

  val objCatD
    get() = if (dark) Color(0xFF723522) else Color(0xFFBE6739)

  val objLeaf
    get() = if (dark) Color(0xFF555446) else Color(0xFF6E7B66)

  val objPot
    get() = if (dark) Color(0xFF803A24) else Color(0xFFA8472A)

  val objDoor
    get() = if (dark) Color(0xFF725A49) else Color(0xFFD4A987)

  val objYarn
    get() = if (dark) Color(0xFFE06F3E) else Color(0xFFA8472A)

  val objBrass
    get() = if (dark) Color(0xFFDC934C) else Color(0xFFDC934C)

  val objSteam
    get() = if (dark) Color(0x8CF3E6D3) else Color(0xFFFFFAF3)

  val objStar
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFFFFAF3)

  val objShadow
    get() = if (dark) Color(0x59000000) else Color(0x242E241E)

  val objCushion
    get() = if (dark) Color(0xFFB26E33) else Color(0xFFE0883C)

  val objCurtain
    get() = if (dark) Color(0xFF8C7A68) else Color(0xFFFFFAF3)

  val objFlake
    get() = if (dark) Color(0xFFB3ABA2) else Color(0xFFFFFAF3)

  val skyDusk
    get() = if (dark) Color(0xFF1C2230) else Color(0xFFEBB685)

  val skyDay
    get() = if (dark) Color(0xFF1C2230) else Color(0xFFCAD5DA)

  val skySnow
    get() = if (dark) Color(0xFF1E2532) else Color(0xFF91A5AC)

  val skyNight
    get() = if (dark) Color(0xFF1C2230) else Color(0xFF1C2230)

  val sunDay
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFFFFAF3)

  val moon
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFF3E6D3)

  val hillNight
    get() = if (dark) Color(0xFF21262A) else Color(0xFF21262A)

  val snowNight
    get() = if (dark) Color(0xFF767474) else Color(0xFF767474)

  val canvas
    get() = if (dark) Color(0xFF221A16) else Color(0xFFF5EDE2)

  val surface
    get() = if (dark) Color(0xFF2E241F) else Color(0xFFFFFAF3)

  val surfaceRaised
    get() = if (dark) Color(0xFF2E241F) else Color(0xFFFFFAF3)

  val surfaceSunken
    get() = if (dark) Color(0xFF1A1411) else Color(0xFFEADFCF)

  val surfaceHover
    get() = if (dark) Color(0xFF1A1411) else Color(0xFFEADFCF)

  val surfaceInk
    get() = if (dark) Color(0xFF140F0C) else Color(0xFF2E241E)

  val onSurfaceInk
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFFF5EDE2)

  val lineControl
    get() = if (dark) Color(0xFF8A7563) else Color(0xFF8C7A69)

  val ruleHead
    get() = if (dark) Color(0xFF8A7563) else Color(0xFF8C7A69)

  val text
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFF2E241E)

  val text2
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFF5E4E41)

  val text3
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFF5E4E41)

  val placeholder
    get() = if (dark) Color(0xFFC9B6A0) else Color(0xFF5E4E41)

  val primary
    get() = if (dark) Color(0xFFEC8452) else Color(0xFFA8472A)

  val primaryHover
    get() = if (dark) Color(0xFFEC8452) else Color(0xFFA8472A)

  val primaryTint
    get() = if (dark) Color(0xFF4A3024) else Color(0xFFF5E5DB)

  val primaryFill
    get() = if (dark) Color(0xFFE06F3E) else Color(0xFFA8472A)

  val onPrimaryFill
    get() = if (dark) Color(0xFF221A16) else Color(0xFFFFF6EA)

  val inkHover
    get() = if (dark) Color(0xFFEA8250) else Color(0xFF8F3B22)

  val onInk
    get() = if (dark) Color(0xFF221A16) else Color(0xFFFFF6EA)

  val onDanger
    get() = if (dark) Color(0xFF221A16) else Color(0xFFFFF6EA)

  val warning
    get() = if (dark) Color(0xFFE9BE62) else Color(0xFF8A5A0B)

  val warningTint
    get() = if (dark) Color(0xFF50402B) else Color(0xFFF7D98F)

  val stamp
    get() = if (dark) Color(0xFFEC8452) else Color(0xFFA8472A)

  val focusRing
    get() = if (dark) Color(0xFFF3E6D3) else Color(0xFF2E241E)
}
