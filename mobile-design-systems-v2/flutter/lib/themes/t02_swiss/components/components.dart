import 'package:flutter/material.dart';
import '../theme/theme.dart';

final bool _hardEdges = OseonShape.rule == 3;

enum ButtonKind { primary, secondary, ghost, destructive }

class OseonButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonKind kind;
  final bool loading;
  const OseonButton(
    this.label, {
    super.key,
    this.onPressed,
    this.kind = ButtonKind.primary,
    this.loading = false,
  });
  @override
  State<OseonButton> createState() => _OseonButtonState();
}

class _OseonButtonState extends State<OseonButton> {
  bool pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
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
              : OseonMotion.press,
          transform: Matrix4.translationValues(
            pressed ? 1 : 0,
            pressed ? 1 : 0,
            0,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(OseonShape.control),
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
                  borderRadius: BorderRadius.circular(OseonShape.control),
                ),
              ),
              side: WidgetStateProperty.resolveWith(
                (s) => BorderSide(
                  color: s.contains(WidgetState.focused)
                      ? c.primary
                      : widget.kind == ButtonKind.ghost
                      ? fill
                      : c.line,
                  width: s.contains(WidgetState.focused) ? 2 : OseonShape.rule,
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
                    style: OseonType.ui.copyWith(
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

class OseonIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  const OseonIconButton(this.icon, this.label, {super.key, this.onPressed});
  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: label,
    onPressed: onPressed,
    icon: Icon(icon),
    constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
  );
}

class OseonTextField extends StatelessWidget {
  final String label;
  final String? helper, error;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  const OseonTextField(
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
      style: OseonType.ui,
      decoration: InputDecoration(
        labelText: label,
        helperText: helper,
        errorText: error,
        errorMaxLines: 3,
      ),
    ),
  );
}

class OseonCard extends StatelessWidget {
  final Widget child;
  const OseonCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.surface,
        border: Border.all(color: c.line, width: OseonShape.rule),
        borderRadius: BorderRadius.circular(OseonShape.panel),
      ),
      child: child,
    );
  }
}

class OseonBadge extends StatelessWidget {
  final String label;
  final bool alert;
  const OseonBadge(this.label, {super.key, this.alert = false});
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: alert ? c.warningTint : c.primaryTint,
        borderRadius: BorderRadius.circular(OseonShape.badge),
      ),
      child: Text(
        label,
        style: OseonType.ui.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: alert ? c.warning : c.primary,
        ),
      ),
    );
  }
}

class OseonTabs extends StatelessWidget {
  final List<String> labels;
  final int selected;
  final ValueChanged<int> onChanged;
  const OseonTabs(
    this.labels, {
    super.key,
    required this.selected,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < labels.length; i++)
            Semantics(
              selected: i == selected,
              button: true,
              child: Container(
                decoration: BoxDecoration(
                  color: i == selected ? c.ink : c.surface,
                  border: Border(
                    bottom: BorderSide(
                      color: i == selected ? c.text : c.line,
                      width: i == selected ? 2 : 1,
                    ),
                  ),
                ),
                child: TextButton(
                  onPressed: () => onChanged(i),
                  style: TextButton.styleFrom(
                    minimumSize: const Size(48, 48),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                  ),
                  child: Text(
                    labels[i],
                    softWrap: false,
                    style: OseonType.ui.copyWith(
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
        ],
      ),
    );
  }
}

class OseonTopAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onBack, onToggle;
  const OseonTopAppBar(this.title, {super.key, this.onBack, this.onToggle});
  @override
  Size get preferredSize => const Size.fromHeight(60);
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return AppBar(
      leading: OseonIconButton(Icons.arrow_back, '테마 목록', onPressed: onBack),
      title: Text(
        title,
        style: OseonType.ui.copyWith(fontSize: 20, fontWeight: FontWeight.w700),
      ),
      actions: [
        OseonIconButton(
          c.dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          '밝기 전환',
          onPressed: onToggle,
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(OseonShape.rule),
        child: Container(height: OseonShape.rule, color: c.line),
      ),
    );
  }
}

class OseonNavigationBar extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onChanged;
  final List<String> labels;
  final List<IconData> icons;
  const OseonNavigationBar({
    super.key,
    required this.selected,
    required this.onChanged,
    required this.labels,
    required this.icons,
  });
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: c.surface,
        border: Border(
          top: BorderSide(color: c.line, width: OseonShape.rule),
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
                            style: OseonType.ui.copyWith(
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

class OseonListItem extends StatelessWidget {
  final String title, subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  const OseonListItem(
    this.title,
    this.subtitle, {
    super.key,
    this.trailing,
    this.onTap,
    this.selected = false,
  });
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
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
          style: OseonType.ui.copyWith(
            fontWeight: FontWeight.w700,
            color: selected ? c.onInk : c.text,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            subtitle,
            style: OseonType.ui.copyWith(
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
        content: Text(text, style: OseonType.ui),
        actions: [
          OseonButton(
            '취소',
            kind: ButtonKind.ghost,
            onPressed: () => Navigator.pop(ctx, false),
          ),
          OseonButton('확인', onPressed: () => Navigator.pop(ctx, true)),
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
  final c = OseonTokens.of(context);
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: c.surfaceInk,
      content: Text(
        message,
        style: OseonType.ui.copyWith(color: c.onSurfaceInk),
      ),
      behavior: SnackBarBehavior.floating,
    ),
  );
}

class OseonSwitch extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;
  const OseonSwitch(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => SwitchListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: OseonType.ui),
    value: value,
    onChanged: onChanged,
  );
}

class OseonCheckbox extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  const OseonCheckbox(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => CheckboxListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: OseonType.ui),
    value: value,
    onChanged: onChanged,
    controlAffinity: ListTileControlAffinity.leading,
  );
}

class OseonRadio extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  const OseonRadio(this.label, {super.key, required this.selected, this.onTap});
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
      title: Text(label, style: OseonType.ui),
    ),
  );
}

class OseonProgress extends StatelessWidget {
  final double value;
  final String label;
  const OseonProgress(this.value, this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: OseonType.ui.copyWith(fontSize: 13, color: c.text2)),
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

class OseonEmptyState extends StatelessWidget {
  final String message;
  final VoidCallback onReset;
  const OseonEmptyState(this.message, {super.key, required this.onReset});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      children: [
        const Icon(Icons.inbox_outlined, size: 48),
        const SizedBox(height: 16),
        Text(message, style: OseonType.ui),
        const SizedBox(height: 16),
        OseonButton('전체 보기', onPressed: onReset),
      ],
    ),
  );
}

class OseonSkeleton extends StatelessWidget {
  const OseonSkeleton({super.key});
  @override
  Widget build(BuildContext context) {
    final c = OseonTokens.of(context);
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
