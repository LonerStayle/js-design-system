package com.jinsup.ds.t30_corporate_clean_saas.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalLedgerColors = staticCompositionLocalOf { LedgerColors(false) }

@Composable
fun LedgerTheme(dark: Boolean, content: @Composable () -> Unit) {
    val c = LedgerColors(dark)
    val scheme =
        (if (dark) darkColorScheme() else lightColorScheme()).copy(
            primary = c.ink,
            onPrimary = c.onInk,
            secondary = c.primary,
            onSecondary = c.onPrimaryFill,
            background = c.canvas,
            onBackground = c.text,
            surface = c.surface,
            onSurface = c.text,
            surfaceVariant = c.surfaceSunken,
            onSurfaceVariant = c.text2,
            outline = c.lineControl,
            outlineVariant = c.line,
            error = c.danger,
            onError = c.onDanger,
        )
    CompositionLocalProvider(LocalLedgerColors provides c) {
        MaterialTheme(
            colorScheme = scheme,
            typography =
                Typography(
                    bodyLarge = LedgerType.ui,
                    bodyMedium = LedgerType.ui,
                    titleLarge = LedgerType.display,
                    labelLarge = LedgerType.ui,
                    headlineLarge = LedgerType.display,
                ),
            shapes =
                Shapes(
                    small = RoundedCornerShape(LedgerShape.control),
                    medium = RoundedCornerShape(LedgerShape.panel),
                    large = RoundedCornerShape(LedgerShape.panel),
                ),
            content = content,
        )
    }
}
