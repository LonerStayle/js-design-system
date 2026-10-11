package com.jinsup.ds.t04_glass.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

val LocalYunseulColors = staticCompositionLocalOf { YunseulColors(false) }

@Composable
fun YunseulTheme(dark: Boolean, content: @Composable () -> Unit) {
  val c = YunseulColors(dark)
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
  CompositionLocalProvider(LocalYunseulColors provides c, LocalContentColor provides c.text) {
    MaterialTheme(
        colorScheme = scheme,
        typography =
            Typography(
                bodyLarge = YunseulType.ui,
                bodyMedium = YunseulType.ui,
                titleLarge = YunseulType.display,
                labelLarge = YunseulType.ui,
                headlineLarge = YunseulType.display,
            ),
        shapes =
            Shapes(
                small = RoundedCornerShape(YunseulShape.control),
                medium = RoundedCornerShape(YunseulShape.panel),
                large = RoundedCornerShape(YunseulShape.panel),
            ),
        content = content,
    )
  }
}
