package com.jinsup.ds.t15_hygge.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalModakColors = staticCompositionLocalOf { ModakColors(false) }

@Composable
fun ModakTheme(dark: Boolean, content: @Composable () -> Unit) {
  val c = ModakColors(dark)
  val scheme =
      (if (dark) darkColorScheme() else lightColorScheme()).copy(
          primary = c.primaryFill,
          onPrimary = c.onPrimaryFill,
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
  CompositionLocalProvider(LocalModakColors provides c) {
    MaterialTheme(
        colorScheme = scheme,
        typography =
            Typography(
                bodyLarge = ModakType.ui,
                bodyMedium = ModakType.ui,
                titleLarge = ModakType.display,
                labelLarge = ModakType.ui,
                headlineLarge = ModakType.display,
            ),
        shapes =
            Shapes(
                small = RoundedCornerShape(ModakShape.control),
                medium = RoundedCornerShape(ModakShape.panel),
                large = RoundedCornerShape(ModakShape.panel),
            ),
        content = content,
    )
  }
}
