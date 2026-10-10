import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';

class ApprovalLine extends StatelessWidget {
  final bool approved, rejected;
  const ApprovalLine({super.key, this.approved = false, this.rejected = false});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Semantics(
      label: rejected
          ? '박도윤 반려'
          : approved
          ? '박도윤 승인 완료, 이서진 결재 대기'
          : '최민재 승인 완료, 박도윤 결재 차례',
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < 3; i++)
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: i == 1 && !approved ? c.primaryTint : c.surface,
                  border: Border.all(color: c.lineStrong),
                ),
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        border: Border(bottom: BorderSide(color: c.lineStrong)),
                      ),
                      child: Text(
                        ['팀장', '재무', '대표'][i],
                        textAlign: TextAlign.center,
                        style: LedgerType.ui.copyWith(
                          fontSize: 12,
                          color: c.text2,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: TweenAnimationBuilder<double>(
                        key: ValueKey('$i-$approved-$rejected'),
                        tween: Tween(
                          begin: i == 1 && approved ? 1.25 : 1.0,
                          end: 1.0,
                        ),
                        duration: MediaQuery.disableAnimationsOf(context)
                            ? Duration.zero
                            : LedgerMotion.stamp,
                        curve: LedgerMotion.stampEase,
                        builder: (context, value, child) =>
                            Transform.scale(scale: value, child: child),
                        child: Transform.rotate(
                          angle: -.14,
                          child: Container(
                            width: 46,
                            height: 46,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              shape: rejected && i == 1
                                  ? BoxShape.rectangle
                                  : BoxShape.circle,
                              border: Border.all(
                                color: i == 0 || i == 1 && approved
                                    ? c.stamp
                                    : i == 1
                                    ? c.primary
                                    : c.lineStrong,
                                width: i == 0 || i == 1 && approved ? 2 : 1,
                              ),
                            ),
                            child: Text(
                              i == 0
                                  ? '민재'
                                  : i == 1
                                  ? (rejected
                                        ? '반려'
                                        : approved
                                        ? '도윤'
                                        : '차례')
                                  : '대기',
                              style: LedgerType.ui.copyWith(
                                fontSize: 13,
                                color: i == 0 || i == 1 && approved
                                    ? c.stamp
                                    : i == 1
                                    ? c.primary
                                    : c.text2,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        [
                          LedgerFacts.author,
                          LedgerFacts.reviewer,
                          LedgerFacts.director,
                        ][i],
                        style: LedgerType.ui.copyWith(fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class ApprovalProgress extends StatelessWidget {
  final int done;
  const ApprovalProgress({super.key, this.done = 1});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < 3; i++)
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(right: 2),
            decoration: BoxDecoration(
              color: i < done ? c.text : c.surface,
              border: Border.all(color: c.lineStrong),
            ),
          ),
        const SizedBox(width: 4),
        Text(
          '$done/3 승인',
          style: LedgerType.ui.copyWith(fontSize: 12, color: c.text2),
        ),
      ],
    );
  }
}

class LedgerRule extends StatelessWidget {
  final String label, value;
  final bool total;
  const LedgerRule(this.label, this.value, {super.key, this.total = false});
  @override
  Widget build(BuildContext context) {
    final c = LedgerTokens.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: c.line),
          top: BorderSide(
            color: total ? c.ruleHead : c.surface,
            width: total ? 2 : 0,
          ),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: LedgerType.ui.copyWith(color: c.text2, fontSize: 14),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: LedgerType.ui.copyWith(
                fontWeight: total ? FontWeight.w700 : FontWeight.w500,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
