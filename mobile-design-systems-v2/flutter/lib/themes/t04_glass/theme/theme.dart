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
class YunseulTokens extends ThemeExtension<YunseulTokens> {
  final YunseulColors colors;
  const YunseulTokens(this.colors);
  static YunseulColors of(BuildContext context) =>
      Theme.of(context).extension<YunseulTokens>()!.colors;
  @override
  YunseulTokens copyWith({YunseulColors? colors}) =>
      YunseulTokens(colors ?? this.colors);
  @override
  YunseulTokens lerp(covariant YunseulTokens? other, double t) =>
      other == null || t < .5 ? this : other;
}

ThemeData yunseulTheme(bool dark) {
  final c = YunseulColors(dark);
  final scheme =
      ColorScheme.fromSeed(
        seedColor: c.primary,
        brightness: dark ? Brightness.dark : Brightness.light,
      ).copyWith(
        primary: c.ink,
        onPrimary: c.onInk,
        secondary: c.primary,
        onSecondary: c.onPrimaryFill,
        surface: c.surface,
        onSurface: c.text,
        surfaceContainerHighest: c.surfaceSunken,
        onSurfaceVariant: c.text2,
        outline: c.lineControl,
        outlineVariant: c.line,
        error: c.danger,
        onError: c.onDanger,
      );
  final radius = BorderRadius.circular(YunseulShape.control);
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: c.surface,
    splashFactory: NoSplash.splashFactory,
    textTheme: Typography.material2021().black.apply(
      fontFamily: YunseulType.ui.fontFamily,
      fontFamilyFallback: YunseulType.ui.fontFamilyFallback,
      bodyColor: scheme.onSurface,
      displayColor: scheme.onSurface,
    ),
    extensions: [YunseulTokens(c)],
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
        borderSide: BorderSide(color: c.primary, width: 2),
      ),
      contentPadding: const EdgeInsets.all(16),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: c.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(YunseulShape.panel),
        side: BorderSide(color: scheme.outline),
      ),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: c.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(YunseulShape.panel),
        ),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(YunseulShape.badge),
      ),
    ),
  );
}
