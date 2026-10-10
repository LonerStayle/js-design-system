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
class LedgerTokens extends ThemeExtension<LedgerTokens> {
  final LedgerColors colors;
  const LedgerTokens(this.colors);
  static LedgerColors of(BuildContext context) =>
      Theme.of(context).extension<LedgerTokens>()!.colors;
  @override
  LedgerTokens copyWith({LedgerColors? colors}) =>
      LedgerTokens(colors ?? this.colors);
  @override
  LedgerTokens lerp(covariant LedgerTokens? other, double t) =>
      other == null || t < .5 ? this : other;
}

ThemeData ledgerTheme(bool dark) {
  final c = LedgerColors(dark);
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
  final radius = BorderRadius.circular(LedgerShape.control);
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: c.surface,
    splashFactory: NoSplash.splashFactory,
    textTheme: Typography.material2021().black.apply(
      fontFamily: LedgerType.ui.fontFamily,
      fontFamilyFallback: LedgerType.ui.fontFamilyFallback,
      bodyColor: scheme.onSurface,
      displayColor: scheme.onSurface,
    ),
    extensions: [LedgerTokens(c)],
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
        borderRadius: BorderRadius.circular(LedgerShape.panel),
        side: BorderSide(color: scheme.outline),
      ),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: c.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(LedgerShape.panel),
        ),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LedgerShape.badge),
      ),
    ),
  );
}
