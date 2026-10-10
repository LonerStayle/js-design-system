package com.jinsup.ds.t01_neobrutalism.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.jinsup.ds.R

@OptIn(androidx.compose.ui.text.ExperimentalTextApi::class)
object PanpanType {
    val uiFamily =
        FontFamily(
            Font(R.font.p_ibmplexsanskr_regular),
            Font(R.font.p_ibmplexsanskr_bold, FontWeight.Bold),
        )
    val displayFamily = FontFamily(Font(R.font.p_gasoekone_regular))
    val numberFamily =
        FontFamily(
            Font(
                R.font.p_bigshouldersdisplay_regular,
                FontWeight.ExtraBold,
                variationSettings = FontVariation.Settings(FontVariation.weight(800)),
            )
        )
    val codeFamily = FontFamily(Font(R.font.p_ibmplexmono_regular))
    val ui =
        TextStyle(fontFamily = uiFamily, fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.sp)
    val display =
        TextStyle(
            fontFamily = displayFamily,
            fontSize = 36.sp,
            lineHeight = 44.sp,
            letterSpacing = 0.sp,
        )
    val number =
        TextStyle(
            fontFamily = numberFamily,
            fontSize = 60.sp,
            lineHeight = 66.sp,
            fontWeight = FontWeight.Bold,
        )
    val code = TextStyle(fontFamily = codeFamily, fontSize = 12.sp, lineHeight = 18.sp)
}
