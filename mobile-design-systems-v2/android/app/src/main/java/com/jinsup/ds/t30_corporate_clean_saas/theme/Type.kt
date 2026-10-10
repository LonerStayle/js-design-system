package com.jinsup.ds.t30_corporate_clean_saas.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.jinsup.ds.R

object LedgerType {
    val uiFamily =
        FontFamily(
            Font(R.font.l_ibmplexsanskr_regular),
            Font(R.font.l_ibmplexsanskr_bold, FontWeight.Bold),
        )
    val displayFamily = FontFamily(Font(R.font.l_ibmplexsanskr_bold))
    val numberFamily = FontFamily(Font(R.font.l_geist_regular))
    val codeFamily = FontFamily(Font(R.font.l_geistmono_regular))
    val ui =
        TextStyle(fontFamily = uiFamily, fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.sp)
    val display =
        TextStyle(
            fontFamily = displayFamily,
            fontSize = 30.sp,
            lineHeight = 40.sp,
            letterSpacing = 0.sp,
        )
    val number =
        TextStyle(
            fontFamily = numberFamily,
            fontSize = 40.sp,
            lineHeight = 48.sp,
            fontWeight = FontWeight.Bold,
        )
    val code = TextStyle(fontFamily = codeFamily, fontSize = 12.sp, lineHeight = 18.sp)
}
