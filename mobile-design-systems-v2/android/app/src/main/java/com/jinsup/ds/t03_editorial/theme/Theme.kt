package com.jinsup.ds.t03_editorial.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalHaengganColors = staticCompositionLocalOf { HaengganColors(false) }

@Composable
fun HaengganTheme(dark: Boolean, content: @Composable () -> Unit) {
  val c = HaengganColors(dark)
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
  CompositionLocalProvider(LocalHaengganColors provides c) {
    MaterialTheme(
        colorScheme = scheme,
        typography =
            Typography(
                bodyLarge = HaengganType.ui,
                bodyMedium = HaengganType.ui,
                titleLarge = HaengganType.display,
                labelLarge = HaengganType.ui,
                headlineLarge = HaengganType.display,
            ),
        shapes =
            Shapes(
                small = RoundedCornerShape(HaengganShape.control),
                medium = RoundedCornerShape(HaengganShape.panel),
                large = RoundedCornerShape(HaengganShape.panel),
            ),
        content = content,
    )
  }
}
