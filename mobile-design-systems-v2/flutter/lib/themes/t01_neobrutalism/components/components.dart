import 'package:flutter/material.dart';
import '../theme/theme.dart';

final bool _hardEdges = PanpanShape.rule == 3;

enum ButtonKind { primary, secondary, ghost, destructive }

class PanpanButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonKind kind;
  final bool loading;
  const PanpanButton(
    this.label, {
    super.key,
    this.onPressed,
    this.kind = ButtonKind.primary,
    this.loading = false,
  });
  @override
  State<PanpanButton> createState() => _PanpanButtonState();
}

class _PanpanButtonState extends State<PanpanButton> {
  bool pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    final disabled = widget.onPressed == null;
    final fill = disabled
        ? c.disabledFill
        : (widget.kind == ButtonKind.primary
              ? c.accent
              : widget.kind == ButtonKind.destructive
              ? c.dangerBtn
              : c.surface);
    final fg = disabled
        ? c.fgMuted
        : (widget.kind == ButtonKind.primary
              ? c.onAccent
              : widget.kind == ButtonKind.destructive
              ? c.onDangerBtn
              : c.fg);
    return Padding(
      padding: const EdgeInsets.only(bottom: 6, right: 6),
      child: Listener(
        onPointerDown: disabled ? null : (_) => setState(() => pressed = true),
        onPointerUp: (_) => setState(() => pressed = false),
        onPointerCancel: (_) => setState(() => pressed = false),
        child: AnimatedContainer(
          duration: MediaQuery.disableAnimationsOf(context)
              ? Duration.zero
              : PanpanMotion.press,
          transform: Matrix4.translationValues(
            pressed ? 6 : 0,
            pressed ? 6 : 0,
            0,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(PanpanShape.control),
            boxShadow: _hardEdges && !pressed && widget.kind != ButtonKind.ghost
                ? [BoxShadow(color: c.shadowInk, offset: const Offset(6, 6))]
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
                  borderRadius: BorderRadius.circular(PanpanShape.control),
                ),
              ),
              side: WidgetStateProperty.resolveWith(
                (s) => BorderSide(
                  color: s.contains(WidgetState.focused)
                      ? c.focus
                      : widget.kind == ButtonKind.ghost
                      ? fill
                      : c.rule,
                  width: s.contains(WidgetState.focused) ? 2 : PanpanShape.rule,
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
                    style: PanpanType.ui.copyWith(
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

class PanpanIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  const PanpanIconButton(this.icon, this.label, {super.key, this.onPressed});
  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: label,
    onPressed: onPressed,
    icon: Icon(icon),
    constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
  );
}

class PanpanTextField extends StatelessWidget {
  final String label;
  final String? helper, error;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  const PanpanTextField(
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
      style: PanpanType.ui,
      decoration: InputDecoration(
        labelText: label,
        helperText: helper,
        errorText: error,
        errorMaxLines: 3,
      ),
    ),
  );
}

class PanpanCard extends StatelessWidget {
  final Widget child;
  const PanpanCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.surface,
        border: Border.all(color: c.rule, width: PanpanShape.rule),
        borderRadius: BorderRadius.circular(PanpanShape.panel),
      ),
      child: child,
    );
  }
}

class PanpanBadge extends StatelessWidget {
  final String label;
  final bool alert;
  const PanpanBadge(this.label, {super.key, this.alert = false});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: alert ? c.dangerFill : c.highlight,
        borderRadius: BorderRadius.circular(PanpanShape.badge),
      ),
      child: Text(
        label,
        style: PanpanType.ui.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: alert ? c.onDanger : c.onHighlight,
        ),
      ),
    );
  }
}

class PanpanTabs extends StatelessWidget {
  final List<String> labels;
  final int selected;
  final ValueChanged<int> onChanged;
  const PanpanTabs(
    this.labels, {
    super.key,
    required this.selected,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
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
                    color: i == selected ? c.highlight : c.surface,
                    border: _hardEdges
                        ? Border.all(color: c.rule, width: 3)
                        : Border(
                            bottom: BorderSide(
                              color: i == selected ? c.fg : c.rule,
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
                      style: PanpanType.ui.copyWith(
                        fontSize: 14,
                        fontWeight: i == selected
                            ? FontWeight.w700
                            : FontWeight.w400,
                        color: i == selected ? c.onHighlight : c.fg,
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

class PanpanTopAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onBack, onToggle;
  const PanpanTopAppBar(this.title, {super.key, this.onBack, this.onToggle});
  @override
  Size get preferredSize => const Size.fromHeight(60);
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return AppBar(
      leading: PanpanIconButton(Icons.arrow_back, '테마 목록', onPressed: onBack),
      title: Text(
        title,
        style: PanpanType.ui.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      actions: [
        PanpanIconButton(
          c.dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          '밝기 전환',
          onPressed: onToggle,
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(PanpanShape.rule),
        child: Container(height: PanpanShape.rule, color: c.rule),
      ),
    );
  }
}

class PanpanNavigationBar extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onChanged;
  final List<String> labels;
  final List<IconData> icons;
  const PanpanNavigationBar({
    super.key,
    required this.selected,
    required this.onChanged,
    required this.labels,
    required this.icons,
  });
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: c.surface,
        border: Border(
          top: BorderSide(color: c.rule, width: PanpanShape.rule),
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
                      color: i == selected ? c.highlight : null,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            icons[i],
                            color: i == selected ? c.onHighlight : c.fgMuted,
                            size: 23,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            labels[i],
                            style: PanpanType.ui.copyWith(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: i == selected ? c.onHighlight : c.fgMuted,
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

class PanpanListItem extends StatelessWidget {
  final String title, subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  const PanpanListItem(
    this.title,
    this.subtitle, {
    super.key,
    this.trailing,
    this.onTap,
    this.selected = false,
  });
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: selected ? c.highlight : null,
        border: Border(
          bottom: BorderSide(color: c.rule, width: _hardEdges ? 2 : 1),
        ),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          title,
          style: PanpanType.ui.copyWith(
            fontWeight: FontWeight.w700,
            color: selected ? c.onHighlight : c.fg,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            subtitle,
            style: PanpanType.ui.copyWith(
              fontSize: 13,
              color: selected ? c.onHighlight : c.fgMuted,
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
        content: Text(text, style: PanpanType.ui),
        actions: [
          PanpanButton(
            '취소',
            kind: ButtonKind.ghost,
            onPressed: () => Navigator.pop(ctx, false),
          ),
          PanpanButton('확인', onPressed: () => Navigator.pop(ctx, true)),
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
  final c = PanpanTokens.of(context);
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: c.slabInk,
      content: Text(message, style: PanpanType.ui.copyWith(color: c.onSlabInk)),
      behavior: SnackBarBehavior.floating,
    ),
  );
}

class PanpanSwitch extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;
  const PanpanSwitch(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => SwitchListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: PanpanType.ui),
    value: value,
    onChanged: onChanged,
  );
}

class PanpanCheckbox extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  const PanpanCheckbox(
    this.label, {
    super.key,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => CheckboxListTile(
    contentPadding: EdgeInsets.zero,
    title: Text(label, style: PanpanType.ui),
    value: value,
    onChanged: onChanged,
    controlAffinity: ListTileControlAffinity.leading,
  );
}

class PanpanRadio extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  const PanpanRadio(
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
      title: Text(label, style: PanpanType.ui),
    ),
  );
}

class PanpanProgress extends StatelessWidget {
  final double value;
  final String label;
  const PanpanProgress(this.value, this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: PanpanType.ui.copyWith(fontSize: 13, color: c.fgMuted),
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: value,
          minHeight: _hardEdges ? 16 : 4,
          color: c.accent,
          backgroundColor: c.disabledFill,
          semanticsLabel: label,
          semanticsValue: '${(value * 100).round()}%',
        ),
      ],
    );
  }
}

class PanpanEmptyState extends StatelessWidget {
  final String message;
  final VoidCallback onReset;
  const PanpanEmptyState(this.message, {super.key, required this.onReset});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      children: [
        const Icon(Icons.inbox_outlined, size: 48),
        const SizedBox(height: 16),
        Text(message, style: PanpanType.ui),
        const SizedBox(height: 16),
        PanpanButton('전체 보기', onPressed: onReset),
      ],
    ),
  );
}

class PanpanSkeleton extends StatelessWidget {
  const PanpanSkeleton({super.key});
  @override
  Widget build(BuildContext context) {
    final c = PanpanTokens.of(context);
    return Semantics(
      label: '불러오는 중',
      child: Column(
        children: [
          for (var i = 0; i < 3; i++)
            Container(
              height: 12,
              margin: const EdgeInsets.symmetric(vertical: 12),
              color: c.disabledFill,
            ),
        ],
      ),
    );
  }
}
