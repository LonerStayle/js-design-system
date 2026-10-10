import 'package:flutter/material.dart';
import '../theme/theme.dart';

final bool _hardEdges = LedgerShape.rule == 3;

enum ButtonKind { primary, secondary, ghost, destructive }

class LedgerButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonKind kind;
  final bool loading;
  const LedgerButton(
    this.label, {
    super.key,
    this.onPressed,
    this.kind = ButtonKind.primary,
    this.loading = false,
  });
  @override
  State<LedgerButton> createState() => _LedgerButtonState();
}

class _LedgerButtonState extends State<LedgerButton> {
  bool pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
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
              : LedgerMotion.press,
          transform: Matrix4.translationValues(
            pressed ? 1 : 0,
            pressed ? 1 : 0,
            0,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(LedgerShape.control),
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
                  borderRadius: BorderRadius.circular(LedgerShape.control),
                ),
              ),
              side: WidgetStateProperty.resolveWith(
                (s) => BorderSide(
                  color: s.contains(WidgetState.focused)
                      ? c.primary
                      : widget.kind == ButtonKind.ghost
                      ? fill
                      : c.line,
                  width: s.contains(WidgetState.focused) ? 2 : LedgerShape.rule,
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
                    style: LedgerType.ui.copyWith(
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

class LedgerIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  const LedgerIconButton(this.icon, this.label, {super.key, this.onPressed});
  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: label,
    onPressed: onPressed,
    icon: Icon(icon),
    constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
  );
}

class LedgerTextField extends StatelessWidget {
  final String label;
  final String? helper, error;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  const LedgerTextField(
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
      style: LedgerType.ui,
      decoration: InputDecoration(
        labelText: label,
        helperText: helper,
        errorText: error,
        errorMaxLines: 3,
      ),
    ),
  );
}

class LedgerCard extends StatelessWidget {
  final Widget child;
  const LedgerCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.surface,
        border: Border.all(color: c.line, width: LedgerShape.rule),
        borderRadius: BorderRadius.circular(LedgerShape.panel),
      ),
      child: child,
    );
  }
}

class LedgerBadge extends StatelessWidget {
  final String label;
  final bool alert;
  const LedgerBadge(this.label, {super.key, this.alert = false});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: alert ? c.warningTint : c.primaryTint,
        borderRadius: BorderRadius.circular(LedgerShape.badge),
      ),
      child: Text(
        label,
        style: LedgerType.ui.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: alert ? c.warning : c.primary,
        ),
      ),
    );
  }
}

class LedgerTabs extends StatelessWidget {
  final List<String> labels;
  final int selected;
  final ValueChanged<int> onChanged;
  const LedgerTabs(
    this.labels, {
    super.key,
    required this.selected,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
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
                    color: i == selected ? c.primaryTint : c.surface,
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
                      style: LedgerType.ui.copyWith(
                        fontSize: 14,
                        fontWeight: i == selected
                            ? FontWeight.w700
                            : FontWeight.w400,
                        color: i == selected ? c.primary : c.text,
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

class LedgerTopAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onBack, onToggle;
  const LedgerTopAppBar(this.title, {super.key, this.onBack, this.onToggle});
  @override
  Size get preferredSize => const Size.fromHeight(60);
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return AppBar(
      leading: LedgerIconButton(Icons.arrow_back, '테마 목록', onPressed: onBack),
      title: Text(
        title,
        style: LedgerType.ui.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      actions: [
        LedgerIconButton(
          c.dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          '밝기 전환',
          onPressed: onToggle,
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(LedgerShape.rule),
        child: Container(height: LedgerShape.rule, color: c.line),
      ),
    );
  }
}

class LedgerNavigationBar extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onChanged;
  final List<String> labels;
  final List<IconData> icons;
  const LedgerNavigationBar({
    super.key,
    required this.selected,
    required this.onChanged,
    required this.labels,
    required this.icons,
  });
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: c.surface,
        border: Border(
          top: BorderSide(color: c.line, width: LedgerShape.rule),
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
                      color: i == selected ? c.primaryTint : null,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            icons[i],
                            color: i == selected ? c.primary : c.text2,
                            size: 23,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            labels[i],
                            style: LedgerType.ui.copyWith(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: i == selected ? c.primary : c.text2,
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

class LedgerListItem extends StatelessWidget {
  final String title, subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  const LedgerListItem(
    this.title,
    this.subtitle, {
    super.key,
    this.trailing,
    this.onTap,
    this.selected = false,
  });
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: selected ? c.primaryTint : null,
        border: Border(
          bottom: BorderSide(color: c.line, width: _hardEdges ? 2 : 1),
        ),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          title,
          style: LedgerType.ui.copyWith(
            fontWeight: FontWeight.w700,
            color: selected ? c.primary : c.text,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            subtitle,
            style: LedgerType.ui.copyWith(
              fontSize: 13,
              color: selected ? c.primary : c.text2,
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
        content: Text(text, style: LedgerType.ui),
        actions: [
          LedgerButton(
            '취소',
            kind: ButtonKind.ghost,
            onPressed: () => Navigator.pop(ctx, false),
          ),
          LedgerButton('확인', onPressed: () => Navigator.pop(ctx, true)),
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
  final c = LedgerTokens.of(context);
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: c.surfaceInk,
      content: Text(
        message,
        style: LedgerType.ui.copyWith(color: c.onSurfaceInk),
      ),
      behavior: SnackBarBehavior.floating,
    ),
  );
}

class LedgerSwitch extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;
  const LedgerSwitch(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => SwitchListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: LedgerType.ui),
    value: value,
    onChanged: onChanged,
  );
}

class LedgerCheckbox extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  const LedgerCheckbox(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => CheckboxListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: LedgerType.ui),
    value: value,
    onChanged: onChanged,
    controlAffinity: ListTileControlAffinity.leading,
  );
}

class LedgerRadio extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  const LedgerRadio(
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
      title: Text(label, style: LedgerType.ui),
    ),
  );
}

class LedgerProgress extends StatelessWidget {
  final double value;
  final String label;
  const LedgerProgress(this.value, this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: LedgerType.ui.copyWith(fontSize: 13, color: c.text2),
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

class LedgerEmptyState extends StatelessWidget {
  final String message;
  final VoidCallback onReset;
  const LedgerEmptyState(this.message, {super.key, required this.onReset});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      children: [
        const Icon(Icons.inbox_outlined, size: 48),
        const SizedBox(height: 16),
        Text(message, style: LedgerType.ui),
        const SizedBox(height: 16),
        LedgerButton('전체 보기', onPressed: onReset),
      ],
    ),
  );
}

class LedgerSkeleton extends StatelessWidget {
  const LedgerSkeleton({super.key});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
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
