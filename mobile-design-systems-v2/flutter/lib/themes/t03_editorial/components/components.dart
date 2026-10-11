import 'package:flutter/material.dart';
import '../theme/theme.dart';

final bool _hardEdges = HaengganShape.rule == 3;

enum ButtonKind { primary, secondary, ghost, destructive }

class HaengganButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonKind kind;
  final bool loading;
  const HaengganButton(
    this.label, {
    super.key,
    this.onPressed,
    this.kind = ButtonKind.primary,
    this.loading = false,
  });
  @override
  State<HaengganButton> createState() => _HaengganButtonState();
}

class _HaengganButtonState extends State<HaengganButton> {
  bool pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    final disabled = widget.onPressed == null;
    final fill = disabled
        ? c.surfaceSunken
        : (widget.kind == ButtonKind.primary
              ? c.ink
              : widget.kind == ButtonKind.destructive
              ? c.danger
              : c.surface);
    final fg = disabled
        ? c.text2
        : (widget.kind == ButtonKind.primary
              ? c.onInk
              : widget.kind == ButtonKind.destructive
              ? c.onDanger
              : c.text);
    return Padding(
      padding: const EdgeInsets.only(bottom: 0, right: 0),
      child: Listener(
        onPointerDown: disabled ? null : (_) => setState(() => pressed = true),
        onPointerUp: (_) => setState(() => pressed = false),
        onPointerCancel: (_) => setState(() => pressed = false),
        child: AnimatedContainer(
          duration: MediaQuery.disableAnimationsOf(context)
              ? Duration.zero
              : HaengganMotion.press,
          transform: Matrix4.translationValues(
            pressed ? 1 : 0,
            pressed ? 1 : 0,
            0,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(HaengganShape.control),
            boxShadow: _hardEdges && !pressed && widget.kind != ButtonKind.ghost
                ? [BoxShadow(color: c.line, offset: const Offset(0, 0))]
                : [],
          ),
          child: TextButton(
            onPressed: widget.loading ? null : widget.onPressed,
            style: ButtonStyle(
              minimumSize: const WidgetStatePropertyAll(Size(48, 48)),
              padding: const WidgetStatePropertyAll(
                EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              foregroundColor: WidgetStatePropertyAll(fg),
              backgroundColor: WidgetStatePropertyAll(fill),
              shape: WidgetStatePropertyAll(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(HaengganShape.control),
                ),
              ),
              side: WidgetStateProperty.resolveWith(
                (s) => BorderSide(
                  color: s.contains(WidgetState.focused)
                      ? c.primary
                      : widget.kind == ButtonKind.ghost
                      ? fill
                      : c.line,
                  width: s.contains(WidgetState.focused)
                      ? 2
                      : HaengganShape.rule,
                ),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.loading) ...[
                  SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: fg,
                      semanticsLabel: '처리 중',
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                Flexible(
                  child: Text(
                    widget.label,
                    style: HaengganType.ui.copyWith(
                      color: fg,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HaengganIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  const HaengganIconButton(this.icon, this.label, {super.key, this.onPressed});
  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: label,
    onPressed: onPressed,
    icon: Icon(icon),
    constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
  );
}

class HaengganTextField extends StatelessWidget {
  final String label;
  final String? helper, error;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  const HaengganTextField(
    this.label, {
    super.key,
    this.helper,
    this.error,
    this.controller,
    this.onChanged,
    this.keyboardType,
  });
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8),
    child: TextField(
      controller: controller,
      onChanged: onChanged,
      keyboardType: keyboardType,
      style: HaengganType.ui,
      decoration: InputDecoration(
        labelText: label,
        helperText: helper,
        errorText: error,
        errorMaxLines: 3,
      ),
    ),
  );
}

class HaengganCard extends StatelessWidget {
  final Widget child;
  const HaengganCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.surface,
        border: Border.all(color: c.line, width: HaengganShape.rule),
        borderRadius: BorderRadius.circular(HaengganShape.panel),
      ),
      child: child,
    );
  }
}

class HaengganBadge extends StatelessWidget {
  final String label;
  final bool alert;
  const HaengganBadge(this.label, {super.key, this.alert = false});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: alert ? c.warningTint : c.primaryTint,
        borderRadius: BorderRadius.circular(HaengganShape.badge),
      ),
      child: Text(
        label,
        style: HaengganType.ui.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: alert ? c.warning : c.primary,
        ),
      ),
    );
  }
}

class HaengganTabs extends StatelessWidget {
  final List<String> labels;
  final int selected;
  final ValueChanged<int> onChanged;
  const HaengganTabs(
    this.labels, {
    super.key,
    required this.selected,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        for (var i = 0; i < labels.length; i++)
          Expanded(
            child: Semantics(
              selected: i == selected,
              button: true,
              child: Padding(
                padding: EdgeInsets.only(
                  right: _hardEdges ? 4 : 0,
                  top: _hardEdges ? 12 : 0,
                ),
                child: Container(
                  margin: EdgeInsets.only(
                    top: _hardEdges && i != selected ? 12 : 0,
                  ),
                  decoration: BoxDecoration(
                    color: i == selected ? c.ink : c.surface,
                    border: _hardEdges
                        ? Border.all(color: c.line, width: 3)
                        : Border(
                            bottom: BorderSide(
                              color: i == selected ? c.text : c.line,
                              width: i == selected ? 2 : 1,
                            ),
                          ),
                  ),
                  child: TextButton(
                    onPressed: () => onChanged(i),
                    style: TextButton.styleFrom(
                      minimumSize: Size(
                        48,
                        _hardEdges && i == selected ? 60 : 48,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                    ),
                    child: Text(
                      labels[i],
                      textAlign: TextAlign.center,
                      style: HaengganType.ui.copyWith(
                        fontSize: 14,
                        fontWeight: i == selected
                            ? FontWeight.w700
                            : FontWeight.w400,
                        color: i == selected ? c.onInk : c.text,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class HaengganTopAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onBack, onToggle;
  const HaengganTopAppBar(this.title, {super.key, this.onBack, this.onToggle});
  @override
  Size get preferredSize => const Size.fromHeight(60);
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return AppBar(
      leading: HaengganIconButton(Icons.arrow_back, '테마 목록', onPressed: onBack),
      title: Text(
        title,
        style: HaengganType.ui.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      actions: [
        HaengganIconButton(
          c.dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          '밝기 전환',
          onPressed: onToggle,
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(HaengganShape.rule),
        child: Container(height: HaengganShape.rule, color: c.line),
      ),
    );
  }
}

class HaengganNavigationBar extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onChanged;
  final List<String> labels;
  final List<IconData> icons;
  const HaengganNavigationBar({
    super.key,
    required this.selected,
    required this.onChanged,
    required this.labels,
    required this.icons,
  });
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: c.surface,
        border: Border(
          top: BorderSide(color: c.line, width: HaengganShape.rule),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            for (var i = 0; i < labels.length; i++)
              Expanded(
                child: Semantics(
                  selected: i == selected,
                  child: InkWell(
                    onTap: () => onChanged(i),
                    child: Container(
                      constraints: const BoxConstraints(minHeight: 64),
                      padding: const EdgeInsets.symmetric(
                        vertical: 8,
                        horizontal: 2,
                      ),
                      color: i == selected ? c.ink : null,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            icons[i],
                            color: i == selected ? c.onInk : c.text2,
                            size: 23,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            labels[i],
                            style: HaengganType.ui.copyWith(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: i == selected ? c.onInk : c.text2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class HaengganListItem extends StatelessWidget {
  final String title, subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  const HaengganListItem(
    this.title,
    this.subtitle, {
    super.key,
    this.trailing,
    this.onTap,
    this.selected = false,
  });
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: selected ? c.ink : null,
        border: Border(
          bottom: BorderSide(color: c.line, width: _hardEdges ? 2 : 1),
        ),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          title,
          style: HaengganType.ui.copyWith(
            fontWeight: FontWeight.w700,
            color: selected ? c.onInk : c.text,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            subtitle,
            style: HaengganType.ui.copyWith(
              fontSize: 13,
              color: selected ? c.onInk : c.text2,
            ),
          ),
        ),
        trailing: trailing,
      ),
    );
  }
}

Future<bool> dsDialog(BuildContext context, String title, String text) async =>
    await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(text, style: HaengganType.ui),
        actions: [
          HaengganButton(
            '취소',
            kind: ButtonKind.ghost,
            onPressed: () => Navigator.pop(ctx, false),
          ),
          HaengganButton('확인', onPressed: () => Navigator.pop(ctx, true)),
        ],
      ),
    ) ??
    false;
Future<T?> dsBottomSheet<T>(BuildContext context, Widget child) =>
    showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      showDragHandle: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(
          16,
          8,
          16,
          24 + MediaQuery.viewInsetsOf(ctx).bottom,
        ),
        child: SingleChildScrollView(child: child),
      ),
    );
void dsToast(BuildContext context, String message) {
  final c = HaengganTokens.of(context);
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: c.surfaceInk,
      content: Text(
        message,
        style: HaengganType.ui.copyWith(color: c.onSurfaceInk),
      ),
      behavior: SnackBarBehavior.floating,
    ),
  );
}

class HaengganSwitch extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;
  const HaengganSwitch(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => SwitchListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: HaengganType.ui),
    value: value,
    onChanged: onChanged,
  );
}

class HaengganCheckbox extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  const HaengganCheckbox(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => CheckboxListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: HaengganType.ui),
    value: value,
    onChanged: onChanged,
    controlAffinity: ListTileControlAffinity.leading,
  );
}

class HaengganRadio extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  const HaengganRadio(
    this.label, {
    super.key,
    required this.selected,
    this.onTap,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    checked: selected,
    inMutuallyExclusiveGroup: true,
    child: ListTile(
      contentPadding: EdgeInsets.zero,
      onTap: onTap,
      minVerticalPadding: 12,
      leading: Icon(
        selected ? Icons.radio_button_checked : Icons.radio_button_off,
      ),
      title: Text(label, style: HaengganType.ui),
    ),
  );
}

class HaengganProgress extends StatelessWidget {
  final double value;
  final String label;
  const HaengganProgress(this.value, this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: HaengganType.ui.copyWith(fontSize: 13, color: c.text2),
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: value,
          minHeight: _hardEdges ? 16 : 4,
          color: c.primary,
          backgroundColor: c.surfaceSunken,
          semanticsLabel: label,
          semanticsValue: '${(value * 100).round()}%',
        ),
      ],
    );
  }
}

class HaengganEmptyState extends StatelessWidget {
  final String message;
  final VoidCallback onReset;
  const HaengganEmptyState(this.message, {super.key, required this.onReset});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      children: [
        const Icon(Icons.inbox_outlined, size: 48),
        const SizedBox(height: 16),
        Text(message, style: HaengganType.ui),
        const SizedBox(height: 16),
        HaengganButton('전체 보기', onPressed: onReset),
      ],
    ),
  );
}

class HaengganSkeleton extends StatelessWidget {
  const HaengganSkeleton({super.key});
  @override
  Widget build(BuildContext context) {
    final c = HaengganTokens.of(context);
    return Semantics(
      label: '불러오는 중',
      child: Column(
        children: [
          for (var i = 0; i < 3; i++)
            Container(
              height: 12,
              margin: const EdgeInsets.symmetric(vertical: 12),
              color: c.surfaceSunken,
            ),
        ],
      ),
    );
  }
}
