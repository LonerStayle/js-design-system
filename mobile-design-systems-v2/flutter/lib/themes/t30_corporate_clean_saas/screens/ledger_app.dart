import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class LedgerApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const LedgerApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<LedgerApp> createState() => _LedgerAppState();
}

class _LedgerAppState extends State<LedgerApp> {
  late int screen = widget.initialScreen;
  int tab = 0;
  bool approved = false, rejected = false, notification = true, receipt = true;
  String search = '';
  final limit = TextEditingController(text: '500000');
  String? error;
  String appliedLimit = '500,000';
  @override
  void dispose() {
    limit.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: ledgerTheme(widget.dark),
    child: Builder(
      builder: (ctx) => Scaffold(
        appBar: LedgerTopAppBar(
          LedgerFacts.brand,
          onBack: widget.onBack,
          onToggle: widget.onToggle,
        ),
        bottomNavigationBar: LedgerNavigationBar(
          selected: screen == 2
              ? 1
              : screen == 3
              ? 2
              : screen,
          onChanged: (i) => setState(() => screen = i == 2 ? 3 : i),
          labels: const ['마감', '결재함', '규칙'],
          icons: const [
            Icons.bar_chart_outlined,
            Icons.fact_check_outlined,
            Icons.tune,
          ],
        ),
        body: SingleChildScrollView(
          key: ValueKey(screen),
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: screen == 0
                ? dashboard(ctx)
                : screen == 1
                ? inbox(ctx)
                : screen == 2
                ? detail(ctx)
                : settings(ctx),
          ),
        ),
      ),
    ),
  );
  Widget heading(BuildContext ctx, String text, String sub) {
    final c = LedgerTokens.of(ctx);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          LedgerFacts.company,
          style: LedgerType.ui.copyWith(fontSize: 13, color: c.text2),
        ),
        const SizedBox(height: 8),
        Text(
          text,
          style: LedgerType.display.copyWith(color: c.text, fontSize: 30),
        ),
        const SizedBox(height: 8),
        Text(sub, style: LedgerType.ui.copyWith(fontSize: 13, color: c.text2)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget ruleHead(BuildContext ctx, String text) {
    final c = LedgerTokens.of(ctx);
    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: c.ruleHead, width: 2)),
      ),
      child: Text(
        text,
        style: LedgerType.ui.copyWith(
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  List<Widget> dashboard(BuildContext ctx) {
    final c = LedgerTokens.of(ctx);
    return [
      heading(
        ctx,
        '10월 경비 마감',
        '${LedgerFacts.shortDate} · 마감 담당 ${LedgerFacts.owner}',
      ),
      Row(
        children: [
          Text(
            '10월 승인 경비',
            style: LedgerType.ui.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(width: 8),
          const LedgerBadge('마감 D-3'),
        ],
      ),
      const SizedBox(height: 12),
      FittedBox(
        alignment: Alignment.centerLeft,
        fit: BoxFit.scaleDown,
        child: Text(
          LedgerFacts.total,
          style: LedgerType.display.copyWith(fontSize: 42, color: c.text),
        ),
      ),
      const SizedBox(height: 24),
      const LedgerRule('미제출 영수증', '37건'),
      const LedgerRule('결재 대기', '12건'),
      const LedgerRule('법인카드', '86장'),
      ruleHead(ctx, '영업2팀 예산'),
      const LedgerProgress(LedgerFacts.salesBudget, '예산 소진율 92%'),
      const SizedBox(height: 12),
      const LedgerBadge('예산 소진 주의', alert: true),
      ruleHead(ctx, '검토할 결재'),
      documentRow(ctx),
      const SizedBox(height: 16),
      LedgerButton('결재함 열기', onPressed: () => setState(() => screen = 1)),
    ];
  }

  Widget documentRow(BuildContext ctx) {
    final c = LedgerTokens.of(ctx);
    return InkWell(
      onTap: () => setState(() => screen = 2),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: c.line)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              LedgerFacts.document,
              style: LedgerType.code.copyWith(color: c.text2),
            ),
            const SizedBox(height: 8),
            Text(
              LedgerFacts.merchant,
              style: LedgerType.ui.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 4),
            Text(
              '${LedgerFacts.author} · ${LedgerFacts.purpose}',
              style: LedgerType.ui.copyWith(fontSize: 13, color: c.text2),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ApprovalProgress(done: approved ? 2 : 1),
                Text(
                  LedgerFacts.amount,
                  style: LedgerType.ui.copyWith(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> inbox(BuildContext ctx) => [
    heading(
      ctx,
      '결재함',
      '현재 검토자 ${LedgerFacts.reviewer} ${LedgerFacts.reviewerRole}',
    ),
    LedgerTabs(
      const ['받은 결재', '승인', '반려'],
      selected: tab,
      onChanged: (v) => setState(() => tab = v),
    ),
    const SizedBox(height: 16),
    LedgerTextField(
      '문서번호 또는 가맹점 검색',
      onChanged: (v) => setState(() => search = v),
    ),
    if ((LedgerFacts.document + LedgerFacts.merchant).contains(search) &&
        (tab == 0 && !approved && !rejected ||
            tab == 1 && approved ||
            tab == 2 && rejected))
      documentRow(ctx)
    else
      LedgerEmptyState(
        '해당 조건의 결재가 없습니다.',
        onReset: () => setState(() {
          tab = 0;
          search = '';
        }),
      ),
    const SizedBox(height: 24),
    Text(
      '문서를 누르면 결재 내역을 확인할 수 있습니다.',
      style: LedgerType.ui.copyWith(
        fontSize: 14,
        color: LedgerTokens.of(ctx).text2,
      ),
    ),
  ];
  List<Widget> detail(BuildContext ctx) {
    final c = LedgerTokens.of(ctx);
    return [
      heading(ctx, '지출결의서', LedgerFacts.document),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            LedgerFacts.purpose,
            style: LedgerType.ui.copyWith(fontSize: 17),
          ),
          LedgerBadge(
            rejected
                ? '반려'
                : approved
                ? '승인 완료'
                : '결재 중',
          ),
        ],
      ),
      const SizedBox(height: 12),
      Text(
        LedgerFacts.amount,
        style: LedgerType.display.copyWith(fontSize: 40, color: c.text),
      ),
      const SizedBox(height: 24),
      ApprovalLine(approved: approved, rejected: rejected),
      const SizedBox(height: 24),
      const LedgerRule('가맹점', LedgerFacts.merchant),
      const LedgerRule('기안자', '최민재 · 영업2팀장'),
      const LedgerRule('계정과목', LedgerFacts.account),
      const LedgerRule('법인카드', LedgerFacts.card),
      const LedgerRule('합계', LedgerFacts.amount, total: true),
      const SizedBox(height: 20),
      if (!approved && !rejected)
        Row(
          children: [
            Expanded(
              child: LedgerButton(
                '반려',
                kind: ButtonKind.secondary,
                onPressed: () async {
                  if (await dsDialog(
                        ctx,
                        '결재 반려',
                        '${LedgerFacts.document}을 반려하시겠습니까?',
                      ) &&
                      mounted) {
                    setState(() => rejected = true);
                    if (ctx.mounted) dsToast(ctx, '결재가 반려되었습니다.');
                  }
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: LedgerButton(
                '승인',
                onPressed: () {
                  setState(() => approved = true);
                  dsToast(ctx, '박도윤 승인 완료 · 다음 결재 이서진');
                },
              ),
            ),
          ],
        )
      else
        LedgerButton('결재함으로', onPressed: () => setState(() => screen = 1)),
    ];
  }

  List<Widget> settings(BuildContext ctx) {
    final c = LedgerTokens.of(ctx);
    return [
      heading(ctx, '결재 규칙', '저장 후 상신되는 문서부터 적용됩니다.'),
      Text(
        '금액 구간별 결재선',
        style: LedgerType.ui.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      const SizedBox(height: 16),
      for (final r in LedgerFacts.rules)
        LedgerRule(
          r == LedgerFacts.rules.first ? '₩$appliedLimit 이하' : r.$1,
          r.$2,
        ),
      const SizedBox(height: 16),
      LedgerButton(
        '팀장 전결 한도 편집',
        kind: ButtonKind.secondary,
        onPressed: () => dsBottomSheet(
          ctx,
          StatefulBuilder(
            builder: (sheetCtx, setSheet) => Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  '팀장 전결 한도',
                  style: LedgerType.ui.copyWith(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                LedgerTextField(
                  '금액 (원)',
                  controller: limit,
                  keyboardType: TextInputType.number,
                  error: error,
                  helper: '0보다 큰 금액을 입력하세요.',
                ),
                LedgerButton(
                  '적용',
                  onPressed: () {
                    final n = int.tryParse(limit.text);
                    if (n == null || n <= 0) {
                      setSheet(() => error = '0보다 큰 정수 금액을 입력해 주세요.');
                    } else {
                      setState(() {
                        error = null;
                        appliedLimit = n.toString().replaceAllMapped(
                          RegExp(r'(\d)(?=(\d{3})+$)'),
                          (m) => '${m[1]},',
                        );
                      });
                      Navigator.pop(sheetCtx);
                      dsToast(ctx, '전결 한도 초안을 적용했습니다.');
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
      ruleHead(ctx, '알림'),
      LedgerSwitch(
        '결재 대기 알림',
        value: notification,
        onChanged: (v) => setState(() => notification = v),
      ),
      LedgerCheckbox(
        '영수증 누락 알림',
        value: receipt,
        onChanged: (v) => setState(() => receipt = v ?? false),
      ),
      const SizedBox(height: 24),
      LedgerButton('변경 저장', onPressed: () => dsToast(ctx, '결재 규칙을 저장했습니다.')),
      const SizedBox(height: 16),
      Text(
        '현재 검토 중인 문서는 기존 결재선을 따릅니다.',
        style: LedgerType.ui.copyWith(fontSize: 14, color: c.text2),
      ),
    ];
  }
}
