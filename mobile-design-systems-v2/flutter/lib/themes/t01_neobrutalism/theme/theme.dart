import 'package:flutter/material.dart';
import 'colors.dart';
import 'typography.dart';
import 'shape.dart';
export 'colors.dart';
export 'typography.dart';
export 'spacing.dart';
export 'shape.dart';
export 'motion.dart';
export 'elevation.dart';

@immutable
class PanpanTokens extends ThemeExtension<PanpanTokens> {
  final PanpanColors colors;
  const PanpanTokens(this.colors);
  static PanpanColors of(BuildContext context) =>
      Theme.of(context).extension<PanpanTokens>()!.colors;
  @override
  PanpanTokens copyWith({PanpanColors? colors}) =>
      PanpanTokens(colors ?? this.colors);
  @override
  PanpanTokens lerp(covariant PanpanTokens? other, double t) =>
      other == null || t < .5 ? this : other;
}

ThemeData panpanTheme(bool dark) {
  final c = PanpanColors(dark);
  final scheme =
      ColorScheme.fromSeed(
        seedColor: c.accent,
        brightness: dark ? Brightness.dark : Brightness.light,
      ).copyWith(
        primary: c.accent,
        onPrimary: c.onAccent,
        secondary: c.highlight,
        onSecondary: c.onHighlight,
        surface: c.surface,
        onSurface: c.fg,
        surfaceContainerHighest: c.surface2,
        onSurfaceVariant: c.fgMuted,
        outline: c.rule,
        outlineVariant: c.rule,
        error: c.dangerFg,
        onError: c.onDanger,
      );
  final radius = BorderRadius.circular(PanpanShape.control);
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: c.bg,
    splashFactory: NoSplash.splashFactory,
    textTheme: Typography.material2021().black.apply(
      fontFamily: PanpanType.ui.fontFamily,
      fontFamilyFallback: PanpanType.ui.fontFamilyFallback,
      bodyColor: scheme.onSurface,
      displayColor: scheme.onSurface,
    ),
    extensions: [PanpanTokens(c)],
    appBarTheme: AppBarTheme(
      backgroundColor: c.surface,
      foregroundColor: scheme.onSurface,
      scrolledUnderElevation: 0,
      elevation: 0,
      centerTitle: false,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: c.surface,
      border: OutlineInputBorder(borderRadius: radius),
      focusedBorder: OutlineInputBorder(
        borderRadius: radius,
        borderSide: BorderSide(color: c.focus, width: 2),
      ),
      contentPadding: const EdgeInsets.all(16),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: c.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(PanpanShape.panel),
        side: BorderSide(color: scheme.outline),
      ),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: c.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(PanpanShape.panel),
        ),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(PanpanShape.badge),
      ),
    ),
  );
}
