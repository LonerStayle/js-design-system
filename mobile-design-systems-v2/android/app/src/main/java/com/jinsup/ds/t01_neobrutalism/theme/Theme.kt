package com.jinsup.ds.t01_neobrutalism.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalPanpanColors = staticCompositionLocalOf { PanpanColors(false) }

@Composable
fun PanpanTheme(dark: Boolean, content: @Composable () -> Unit) {
    val c = PanpanColors(dark)
    val scheme =
        (if (dark) darkColorScheme() else lightColorScheme()).copy(
            primary = c.accent,
            onPrimary = c.onAccent,
            secondary = c.highlight,
            onSecondary = c.onHighlight,
            background = c.bg,
            onBackground = c.fg,
            surface = c.surface,
            onSurface = c.fg,
            surfaceVariant = c.surface2,
            onSurfaceVariant = c.fgMuted,
            outline = c.rule,
            outlineVariant = c.rule,
            error = c.dangerFg,
            onError = c.onDanger,
        )
    CompositionLocalProvider(LocalPanpanColors provides c) {
        MaterialTheme(
            colorScheme = scheme,
            typography =
                Typography(
                    bodyLarge = PanpanType.ui,
                    bodyMedium = PanpanType.ui,
                    titleLarge = PanpanType.display,
                    labelLarge = PanpanType.ui,
                    headlineLarge = PanpanType.display,
                ),
            shapes =
                Shapes(
                    small = RoundedCornerShape(PanpanShape.control),
                    medium = RoundedCornerShape(PanpanShape.panel),
                    large = RoundedCornerShape(PanpanShape.panel),
                ),
            content = content,
        )
    }
}
