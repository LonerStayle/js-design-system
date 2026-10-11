import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class HaengganApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const HaengganApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<HaengganApp> createState() => _HaengganAppState();
}

class _HaengganAppState extends State<HaengganApp> {
  late int screen = widget.initialScreen;
  int quantity = 1, tab = 0, archive = 0;
  String search = '';
  String savedReply = '';
  bool letterSaved = false, newsletter = true;
  final address = TextEditingController(text: HaengganFacts.address);
  String? error;
  @override
  void dispose() {
    address.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: haengganTheme(widget.dark),
    child: Builder(
      builder: (ctx) => Scaffold(
        appBar: HaengganTopAppBar(
          HaengganFacts.brand,
          onBack: widget.onBack,
          onToggle: widget.onToggle,
        ),
        backgroundColor: HaengganTokens.of(ctx).canvas,
        bottomNavigationBar: HaengganNavigationBar(
          selected: screen,
          onChanged: (i) => setState(() => screen = i),
          labels: const ['편집국', '단권', '편지', '구독'],
          icons: const [
            Icons.view_module_outlined,
            Icons.menu_book_outlined,
            Icons.mail_outline,
            Icons.person_outline,
          ],
        ),
        body: SingleChildScrollView(
          key: ValueKey(screen),
          child: FolioSheet(
            ['p.096', 'p.112', 'p.104', 'p.108'][screen],
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: screen == 0
                  ? dashboard(ctx)
                  : screen == 1
                  ? product(ctx)
                  : screen == 2
                  ? inbox(ctx)
                  : settings(ctx),
            ),
          ),
        ),
      ),
    ),
  );
  Widget title(String text, {double size = 30}) =>
      Text(text, style: HaengganType.display.copyWith(fontSize: size));
  Widget small(BuildContext ctx, String text) => Text(
    text,
    style: HaengganType.ui.copyWith(
      color: HaengganTokens.of(ctx).text2,
      fontSize: 13,
    ),
  );
  List<Widget> dashboard(BuildContext ctx) => [
    title('112쪽 가운데\n46쪽이 판에 올랐다'),
    const SizedBox(height: 16),
    Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: title('D−4', size: 68),
          ),
        ),
        Expanded(child: small(ctx, '원고 마감\n${HaengganFacts.deadline}')),
      ],
    ),
    const SizedBox(height: 24),
    const OxfordRule(),
    const SizedBox(height: 24),
    small(ctx, '11월호 지면 배열표 · 윤서경 편집장'),
    const SizedBox(height: 12),
    Flatplan(onOpen: () => articleSheet(ctx)),
    const SizedBox(height: 16),
    small(ctx, '■ 조판 46 · ▨ 교정 28 · □ 원고 30 · ▣ 광고 8'),
    const SizedBox(height: 32),
    Text('인쇄본을 받는 독자', style: HaengganType.body),
    Text('6,214명', style: HaengganType.display.copyWith(fontSize: 48)),
    small(ctx, '10월 순증 138명 · 디지털 아카이브 11,870명'),
    const SizedBox(height: 28),
    const OxfordRule(),
    const SizedBox(height: 12),
    for (final row in HaengganFacts.articles)
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          LeaderRow(
            row[1],
            row[3],
            onTap: () => articleSheet(ctx, selected: row),
          ),
          small(ctx, '${row[2]} · ${row[4]}'),
          const SizedBox(height: 12),
        ],
      ),
  ];
  Future<void> articleSheet(BuildContext ctx, {List<String>? selected}) async =>
      dsBottomSheet(
        ctx,
        FolioSheet(
          selected?[3] ?? 'p.096',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              title(selected?[1] ?? '11월호 배열표', size: 24),
              const SizedBox(height: 12),
              if (selected != null)
                Text(
                  '${selected[0]}\n${selected[2]} · ${selected[4]}',
                  style: HaengganType.body,
                )
              else
                for (final row in HaengganFacts.articles)
                  LeaderRow(row[1], row[3]),
            ],
          ),
        ),
      );
  List<Widget> product(BuildContext ctx) => [
    const HaengganCover(),
    const SizedBox(height: 32),
    const OxfordRule(),
    const SizedBox(height: 24),
    title(HaengganFacts.coverTitle),
    const SizedBox(height: 12),
    Text(
      HaengganFacts.priceLabel,
      style: HaengganType.display.copyWith(fontSize: 40),
    ),
    small(ctx, HaengganFacts.spec),
    small(ctx, HaengganFacts.appendix),
    small(ctx, HaengganFacts.delivery),
    const SizedBox(height: 24),
    for (final row in HaengganFacts.articles.take(9)) LeaderRow(row[1], row[3]),
    const SizedBox(height: 16),
    Row(
      children: [
        const Expanded(child: Text('수량')),
        HaengganIconButton(
          Icons.remove,
          '수량 줄이기',
          onPressed: quantity > 1 ? () => setState(() => quantity--) : null,
        ),
        Text('$quantity'),
        HaengganIconButton(
          Icons.add,
          '수량 늘리기',
          onPressed: quantity < 10 ? () => setState(() => quantity++) : null,
        ),
      ],
    ),
    small(
      ctx,
      quantity >= 2
          ? '2권 이상 무료배송'
          : '배송비 ${HaengganFacts.money(HaengganFacts.shipping.first)}',
    ),
    Text(
      '합계 ${HaengganFacts.money(quantity * HaengganFacts.price.first + (quantity >= 2 ? 0 : HaengganFacts.shipping.first))}',
      style: HaengganType.display.copyWith(fontSize: 26),
    ),
    const SizedBox(height: 16),
    HaengganButton(
      '단권 주문 확인',
      onPressed: () => dsBottomSheet(
        ctx,
        FolioSheet(
          'p.112',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              title('단권 주문', size: 24),
              Text(
                '${HaengganFacts.issue}\n$quantity권 · ${HaengganFacts.money(quantity * HaengganFacts.price.first + (quantity >= 2 ? 0 : HaengganFacts.shipping.first))}',
              ),
              HaengganButton(
                '선택 확인',
                kind: ButtonKind.destructive,
                onPressed: () {
                  Navigator.pop(ctx);
                  dsToast(ctx, '단권 선택을 확인했습니다 · p.112');
                },
              ),
            ],
          ),
        ),
      ),
    ),
    const SizedBox(height: 40),
    title('지난 호', size: 24),
    const SizedBox(height: 12),
    LeaderRow(
      HaengganFacts.archive[archive][1],
      HaengganFacts.archive[archive][0],
    ),
    HaengganTabs(
      const ['제86호', '제85호', '제84호', '제83호', '제82호'],
      selected: archive,
      onChanged: (i) => setState(() => archive = i),
    ),
  ];
  List<Widget> inbox(BuildContext ctx) {
    final readers = HaengganFacts.readers.where(
      (r) => r.join().contains(search),
    );
    return [
      Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Text(
              '47',
              style: HaengganType.number.copyWith(
                fontSize: 116,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
          Container(
            width: 110,
            height: 110,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: HaengganTokens.of(ctx).ruleStrong,
                width: 2,
              ),
            ),
            child: Text(
              '서울 종로\n26.10.10\n행간 편집국',
              textAlign: TextAlign.center,
              style: HaengganType.ui.copyWith(fontSize: 12),
            ),
          ),
        ],
      ),
      small(ctx, '독자 편지 · ${HaengganFacts.letterEditor}'),
      const SizedBox(height: 16),
      title('미답 ${letterSaved ? 8 : 9}통', size: 26),
      small(ctx, '지면 의견 21 · 구독·배송 14 · 기고·제보 9 · 정정 요청 3'),
      const SizedBox(height: 16),
      HaengganTextField(
        '보낸 이 · 지역 찾기',
        onChanged: (s) => setState(() => search = s),
      ),
      const SizedBox(height: 16),
      const OxfordRule(),
      if (readers.isEmpty)
        HaengganEmptyState(
          '조건에 맞는 독자가 없습니다',
          onReset: () => setState(() => search = ''),
        ),
      for (final row in readers)
        LeaderRow(
          '${row[0]} · ${row[1]}',
          'p.104',
          onTap: () => row == HaengganFacts.readers.first
              ? replySheet(ctx)
              : dsBottomSheet(
                  ctx,
                  FolioSheet(
                    'p.104',
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        title(row[0], size: 24),
                        Text(row[1], style: HaengganType.body),
                        const SizedBox(height: 16),
                        small(ctx, '팩트 시트의 독자 정보입니다.'),
                      ],
                    ),
                  ),
                ),
        ),
    ];
  }

  Future<void> replySheet(BuildContext ctx) async {
    final draft = TextEditingController(text: savedReply);
    var invalid = false;
    await dsBottomSheet(
      ctx,
      StatefulBuilder(
        builder: (sheet, local) => FolioSheet(
          'p.104',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              title('독자 엽서', size: 28),
              small(
                ctx,
                '${HaengganFacts.letterName} · ${HaengganFacts.letterArea}',
              ),
              const SizedBox(height: 16),
              Text(HaengganFacts.letterSubject, style: HaengganType.body),
              const SizedBox(height: 24),
              HaengganTextField(
                '답장',
                controller: draft,
                error: invalid ? '답장을 입력해 주세요' : null,
              ),
              HaengganButton(
                '답장 작성 완료',
                onPressed: () {
                  if (draft.text.trim().isEmpty) {
                    local(() => invalid = true);
                    return;
                  }
                  setState(() {
                    letterSaved = true;
                    savedReply = draft.text;
                  });
                  Navigator.pop(sheet);
                  dsToast(ctx, '답장을 작성했습니다 · p.104');
                },
              ),
            ],
          ),
        ),
      ),
    );
    draft.dispose();
  }

  List<Widget> settings(BuildContext ctx) => [
    Container(
      decoration: BoxDecoration(
        color: HaengganTokens.of(ctx).surface,
        border: Border.all(color: HaengganTokens.of(ctx).ruleStrong),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          small(ctx, '구독증 · ${HaengganFacts.subscriberId}'),
          const SizedBox(height: 16),
          title(HaengganFacts.subscriber, size: 40),
          small(ctx, HaengganFacts.period),
          const SizedBox(height: 20),
          const OxfordRule(),
          const SizedBox(height: 20),
          title('7권 받음 · 5권 남음', size: 23),
          const SizedBox(height: 16),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              for (var i = 80; i <= 91; i++)
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: i <= 86
                        ? HaengganTokens.of(ctx).doneBg
                        : HaengganTokens.of(ctx).canvas,
                    border: Border.all(
                      color: i == 87
                          ? HaengganTokens.of(ctx).spot
                          : HaengganTokens.of(ctx).ruleStrong,
                    ),
                  ),
                  child: Text(
                    '$i',
                    style: HaengganType.code.copyWith(
                      color: i <= 86
                          ? HaengganTokens.of(ctx).doneFg
                          : HaengganTokens.of(ctx).text,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    ),
    const SizedBox(height: 24),
    HaengganTabs(
      const ['배송지', '알림', '결제'],
      selected: tab,
      onChanged: (i) => setState(() => tab = i),
    ),
    const SizedBox(height: 24),
    if (tab == 0) ...[
      HaengganTextField('배송지', controller: address, error: error),
      small(ctx, HaengganFacts.addressDeadline),
      small(ctx, '${HaengganFacts.post} · ${HaengganFacts.phone}'),
      const SizedBox(height: 16),
      HaengganButton(
        '배송지 저장',
        onPressed: () async {
          setState(
            () => error = address.text.trim().isEmpty ? '배송지를 입력해 주세요' : null,
          );
          if (error != null) return;
          if (await dsDialog(ctx, '배송지 변경', address.text)) {
            if (ctx.mounted) dsToast(ctx, '배송지를 저장했습니다 · p.108');
          }
        },
      ),
    ],
    if (tab == 1)
      HaengganSwitch(
        '행간 레터 수신',
        value: newsletter,
        onChanged: (v) => setState(() => newsletter = v),
      ),
    if (tab == 2) ...[
      title('결제 수단', size: 24),
      const Text(HaengganFacts.card),
      small(ctx, '1년 정기구독 · ₩160,000'),
    ],
  ];
}
