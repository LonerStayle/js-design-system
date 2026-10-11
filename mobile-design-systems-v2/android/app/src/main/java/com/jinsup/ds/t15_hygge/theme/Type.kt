package com.jinsup.ds.t15_hygge.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.sp
import com.jinsup.ds.R

object ModakType {
  val uiFamily = FontFamily(Font(R.font.b15_gowundodum_400))
  val ui =
      TextStyle(
          fontFamily = uiFamily,
          fontSize = 16.sp,
          lineHeight = 26.sp,
          fontWeight = FontWeight.Normal)
  val display = ui.copy(fontSize = 32.sp, lineHeight = 40.sp)
  val number =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b15_bricolagegrotesque_800, FontWeight.ExtraBold)),
          fontSize = 56.sp,
          lineHeight = 64.sp,
          fontWeight = FontWeight.ExtraBold)
  val label =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b15_sunflower_500, FontWeight.Medium)),
          fontSize = 16.sp,
          lineHeight = 22.sp,
          fontWeight = FontWeight.Medium)
  val hand =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b15_nanumpenscript_400)),
          fontSize = 28.sp,
          lineHeight = 34.sp)
  val code =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b15_dmmono_400)),
          fontSize = 12.sp,
          lineHeight = 18.sp)
  val body = ui
}
