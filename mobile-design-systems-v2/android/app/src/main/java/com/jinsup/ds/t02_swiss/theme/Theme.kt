package com.jinsup.ds.t02_swiss.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalOseonColors = staticCompositionLocalOf { OseonColors(false) }

@Composable
fun OseonTheme(dark: Boolean, content: @Composable () -> Unit) {
  val c = OseonColors(dark)
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
  CompositionLocalProvider(LocalOseonColors provides c) {
    MaterialTheme(
        colorScheme = scheme,
        typography =
            Typography(
                bodyLarge = OseonType.ui,
                bodyMedium = OseonType.ui,
                titleLarge = OseonType.display,
                labelLarge = OseonType.ui,
                headlineLarge = OseonType.display,
            ),
        shapes =
            Shapes(
                small = RoundedCornerShape(OseonShape.control),
                medium = RoundedCornerShape(OseonShape.panel),
                large = RoundedCornerShape(OseonShape.panel),
            ),
        content = content,
    )
  }
}
