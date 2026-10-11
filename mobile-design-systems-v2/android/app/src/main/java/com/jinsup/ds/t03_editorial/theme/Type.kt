package com.jinsup.ds.t03_editorial.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.sp
import com.jinsup.ds.R

object HaengganType {
  val uiFamily =
      FontFamily(
          Font(R.font.b3_ibmplexsanskr_400), Font(R.font.b3_ibmplexsanskr_700, FontWeight.Bold))
  val ui =
      TextStyle(fontFamily = uiFamily, fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.sp)
  val display =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b3_hahmlet_900, FontWeight.Black)),
          fontSize = 36.sp,
          lineHeight = 44.sp,
          fontWeight = FontWeight.Black)
  val number =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b3_bodonimoda_400)),
          fontSize = 64.sp,
          lineHeight = 72.sp,
          fontWeight = FontWeight.Bold)
  val code =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b3_ibmplexmono_400)),
          fontSize = 12.sp,
          lineHeight = 18.sp)
  val body =
      TextStyle(
          fontFamily = FontFamily(Font(R.font.b3_notoserifkr_400)),
          fontSize = 16.sp,
          lineHeight = 28.sp)
}
