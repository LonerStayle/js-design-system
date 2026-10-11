import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class ModakApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const ModakApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<ModakApp> createState() => _ModakAppState();
}

class _ModakAppState extends State<ModakApp> {
  late int screen = widget.initialScreen;
  int color = 0, qty = 1, tab = 0, filter = 0, added = 0;
  Set<int> lights = {0, 1, 3, 5};
  final visited = <int>{}, replied = <int>{}, selectedOrders = <int>{};
  final replyText = <int, String>{};
  final replyControllers = List.generate(12, (_) => TextEditingController());
  final addressControllers = ModakFacts.addresses
      .map((row) => TextEditingController(text: row[1]))
      .toList();
  String query = '';
  final name = TextEditingController(text: ModakFacts.user),
      phone = TextEditingController(text: ModakFacts.phoneExample),
      email = TextEditingController(text: ModakFacts.email),
      note = TextEditingController(text: ModakFacts.note);
  bool phoneError = true, nameError = false, addressRemoved = false;
  List<List<String>> addresses = ModakFacts.addresses
      .map((r) => r.toList())
      .toList();
  final notifications = ModakFacts.notifications
      .map((r) => r[2] == 'true')
      .toList();
  final channels = ModakFacts.channels.map((r) => r[1] == 'true').toList();
  @override
  void dispose() {
    name.dispose();
    phone.dispose();
    email.dispose();
    note.dispose();
    for (final controller in [...replyControllers, ...addressControllers]) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: modakTheme(widget.dark),
    child: Builder(
      builder: (ctx) {
        final c = ModakTokens.of(ctx);
        return Scaffold(
          backgroundColor: c.paper,
          appBar: AppBar(
            title: Text(
              ModakFacts.wordmark,
              style: ModakType.number.copyWith(fontSize: 24),
            ),
            leading: ModakIconButton(
              Icons.arrow_back,
              '테마 목록',
              onPressed: widget.onBack,
            ),
            actions: [
              Semantics(
                label: '줄 스위치로 낮과 밤 전환',
                button: true,
                child: InkWell(
                  onTap: widget.onToggle,
                  child: SizedBox(
                    width: 56,
                    height: 56,
                    child: CustomPaint(painter: _PullCord(c)),
                  ),
                ),
              ),
            ],
          ),
          body: SingleChildScrollView(
            key: ValueKey(screen),
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
          bottomNavigationBar: SafeArea(
            top: false,
            child: Material(
              color: c.paperRaised,
              child: Row(
                children: [
                  for (var i = 0; i < 4; i++)
                    Expanded(
                      child: Semantics(
                        selected: screen == i,
                        child: InkWell(
                          onTap: () => setState(() => screen = i),
                          child: Container(
                            constraints: const BoxConstraints(minHeight: 64),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              border: Border(
                                top: BorderSide(
                                  color: screen == i ? c.brand : c.line,
                                  width: screen == i ? 4 : 1,
                                ),
                              ),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  [
                                    Icons.home_outlined,
                                    Icons.shopping_bag_outlined,
                                    Icons.mail_outline,
                                    Icons.person_outline,
                                  ][i],
                                  color: screen == i ? c.brandText : c.text2,
                                ),
                                Text(
                                  ['쇼룸', '담요', '상담', '내 계정'][i],
                                  style: ModakType.ui.copyWith(
                                    fontSize: 12,
                                    color: c.text,
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
          ),
        );
      },
    ),
  );
  Widget gap([double h = 16]) => SizedBox(height: h);
  Widget title(String text, [double size = 26]) =>
      Text(text, style: ModakType.display.copyWith(fontSize: size));
  Widget meta(BuildContext ctx, String text) => Builder(
    builder: (inner) => Text(
      text,
      style: ModakType.ui.copyWith(
        fontSize: 13,
        color:
            inner.dependOnInheritedWidgetOfExactType<_RoomSecondary>()?.color ??
            ModakTokens.of(inner).text2,
      ),
    ),
  );
  Widget room(BuildContext ctx, Color color, List<Widget> children) {
    final c = ModakTokens.of(ctx);
    final onRoom = [
      c.roomButter,
      c.roomSage,
      c.roomFjord,
      c.roomOak,
      c.roomRose,
      c.roomEmber,
    ].contains(color);
    return Material(
      color: color,
      child: _RoomSecondary(
        color: onRoom ? c.inkOnRoom : c.text2,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: children,
          ),
        ),
      ),
    );
  }

  Widget paper(BuildContext ctx, List<Widget> children) =>
      room(ctx, ModakTokens.of(ctx).paperRaised, children);
  Future<T?> sheet<T>(BuildContext ctx, List<Widget> children) =>
      showModalBottomSheet<T>(
        context: ctx,
        isScrollControlled: true,
        backgroundColor: ModakTokens.of(ctx).paperRaised,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        builder: (sheetContext) => SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
              24,
              24,
              24,
              24 + MediaQuery.viewInsetsOf(sheetContext).bottom,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ...children,
                gap(),
                ModakButton(
                  '닫기',
                  kind: ButtonKind.secondary,
                  onPressed: () => Navigator.pop(sheetContext),
                ),
              ],
            ),
          ),
        ),
      );
  List<Widget> dashboard(BuildContext ctx) {
    final c = ModakTokens.of(ctx);
    return [
      room(ctx, c.roomFjord, [
        meta(ctx, ModakFacts.date),
        gap(),
        title('하늘 님, 램프 타임까지'),
        Text.rich(
          TextSpan(
            style: ModakType.ui,
            children: [
              TextSpan(
                text: '2',
                style: ModakType.number.copyWith(fontSize: 48),
              ),
              const TextSpan(text: '시간 '),
              TextSpan(
                text: '50',
                style: ModakType.number.copyWith(fontSize: 48),
              ),
              const TextSpan(text: '분'),
            ],
          ),
          semanticsLabel: ModakFacts.lampWait,
        ),
        meta(ctx, ModakFacts.tourHours),
        gap(),
        RoomScene(lights: lights),
        gap(8),
        Text(
          '불 켜진 방 ${lights.length}개 · 꺼진 방 ${7 - lights.length}개',
          style: ModakType.ui,
        ),
        gap(8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (var i = 0; i < 7; i++)
              ModakButton(
                ModakFacts.rooms[i][0],
                kind: ButtonKind.secondary,
                onPressed: () => setState(
                  () => lights = lights.contains(i)
                      ? ({...lights}..remove(i))
                      : {...lights, i},
                ),
              ),
          ],
        ),
        gap(),
        PencilMemo('해가 지면 램프만 켜 두어요'),
        gap(),
        paper(ctx, [
          title('남은 투어 ${5 - visited.length}팀', 22),
          meta(ctx, '다녀간 팀 ${9 + visited.length} · 오늘 14팀'),
          gap(),
          for (var i = 9; i < 14; i++)
            if (!visited.contains(i))
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(ModakFacts.tours[i][1], style: ModakType.label),
                subtitle: Text(
                  '${ModakFacts.tours[i][2]} · ${ModakFacts.tours[i][0]}',
                  style: ModakType.ui.copyWith(fontSize: 13),
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => sheet(ctx, [
                  title(ModakFacts.tours[i][2]),
                  meta(ctx, ModakFacts.tours[i][0]),
                  Text(ModakFacts.tours[i][1]),
                  gap(),
                  ModakButton(
                    '방문 완료 표시',
                    onPressed: () {
                      setState(() => visited.add(i));
                      Navigator.pop(ctx);
                      dsToast(ctx, '방문 완료를 표시했어요.');
                    },
                  ),
                ]),
              ),
        ]),
        gap(),
        meta(ctx, ModakFacts.sun),
        meta(ctx, ModakFacts.weather),
      ]),
      room(ctx, c.roomOak, [
        title('12월의 쇼룸 장부'),
        gap(),
        Text(
          ModakFacts.monthlySales,
          style: ModakType.number.copyWith(fontSize: 36),
        ),
        meta(ctx, ModakFacts.monthlyMetrics),
        gap(),
        for (var i = 0; i < ModakFacts.orders.length; i++)
          Column(
            children: [
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: selectedOrders.contains(i),
                onChanged: (v) => setState(
                  () => v == true
                      ? selectedOrders.add(i)
                      : selectedOrders.remove(i),
                ),
                title: Text(
                  '${ModakFacts.orders[i][2]} · ${ModakFacts.orders[i][4]}',
                  style: ModakType.ui,
                ),
                subtitle: Text(
                  '${ModakFacts.orders[i][3]}\n${ModakFacts.orders[i][0]} · ${ModakFacts.orders[i][5]}',
                  style: ModakType.ui.copyWith(fontSize: 13),
                ),
              ),
              Divider(color: c.line),
            ],
          ),
        ModakButton(
          '선택 주문 ${selectedOrders.length}건 확인',
          onPressed: selectedOrders.isEmpty
              ? null
              : () => sheet(ctx, [
                  title('선택한 주문'),
                  for (final i in selectedOrders)
                    Text(
                      '${ModakFacts.orders[i][0]}\n${ModakFacts.orders[i][3]} · ${ModakFacts.orders[i][4]}',
                    ),
                  gap(),
                  ModakButton(
                    '송장 준비 표시',
                    onPressed: () {
                      setState(selectedOrders.clear);
                      Navigator.pop(ctx);
                      dsToast(ctx, '선택 주문의 송장 준비를 표시했어요.');
                    },
                  ),
                ]),
        ),
        gap(),
        meta(ctx, ModakFacts.showroomReview),
      ]),
    ];
  }

  List<Widget> product(BuildContext ctx) {
    final c = ModakTokens.of(ctx);
    final bg = [c.roomButter, c.roomAttic, c.roomRose, c.roomEmber][color];
    final fg = color == 1 ? c.onAttic : c.text;
    return [
      Container(
        color: bg,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              ModakFacts.colors[color][0],
              style: ModakType.display.copyWith(fontSize: 44, color: fg),
            ),
            Text(
              '${ModakFacts.productId}-${ModakFacts.colors[color][1]}',
              style: ModakType.code.copyWith(color: fg),
            ),
            gap(),
            RoomScene(scene: 1, color: color),
            for (var i = 1; i < 4; i++)
              CatalogCallout(
                i,
                ['도톰한 뜨개코 · 띠 줄무늬', '양 끝 술 장식', '라벨 · 뉴질랜드 양모'][i - 1],
                color: fg,
              ),
            gap(),
            if (color == 1)
              Text(
                '무릎 위에 덮어 보세요',
                style: ModakType.hand.copyWith(color: c.onAttic),
              )
            else
              const PencilMemo('무릎 위에 덮어 보세요'),
          ],
        ),
      ),
      room(ctx, c.paper, [
        title(ModakFacts.product, 32),
        gap(),
        Text(
          ModakFacts.money(ModakFacts.price),
          style: ModakType.number.copyWith(fontSize: 38),
        ),
        meta(ctx, ModakFacts.review),
        meta(ctx, ModakFacts.spec),
        gap(),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (var i = 0; i < 4; i++)
              ModakButton(
                '${ModakFacts.colors[i][0]} · ${ModakFacts.colors[i][2]}장',
                kind: color == i ? ButtonKind.primary : ButtonKind.secondary,
                onPressed: () => setState(() => color = i),
              ),
          ],
        ),
        gap(),
        Row(
          children: [
            ModakIconButton(
              Icons.remove,
              '수량 줄이기',
              onPressed: qty > 1 ? () => setState(() => qty--) : null,
            ),
            Expanded(
              child: Text(
                '$qty장',
                textAlign: TextAlign.center,
                style: ModakType.label,
              ),
            ),
            ModakIconButton(
              Icons.add,
              '수량 늘리기',
              onPressed: qty < 4 ? () => setState(() => qty++) : null,
            ),
          ],
        ),
        gap(),
        Text(
          '선택 합계 ${ModakFacts.money(ModakFacts.price * qty)}',
          style: ModakType.label,
        ),
        meta(ctx, ModakFacts.delivery),
        gap(),
        ModakButton(
          '장바구니에 담기',
          onPressed: () {
            setState(() => added += qty);
            sheet(ctx, [
              title('장바구니에 담았어요'),
              Text(
                '${ModakFacts.product} · ${ModakFacts.colors[color][0]} $qty장',
              ),
              meta(ctx, ModakFacts.cart),
              Text('기존 장바구니 ${ModakFacts.money(ModakFacts.cartTotal)}'),
              Text(
                '담요 추가 $added장 · 합계 ${ModakFacts.money(ModakFacts.cartTotal + ModakFacts.price * added)}',
                style: ModakType.label,
              ),
            ]);
          },
        ),
        gap(),
        meta(ctx, ModakFacts.cutoff),
        gap(),
        ModakTabs(
          const ['소재', '세탁', '배송'],
          selected: tab,
          onChanged: (v) => setState(() => tab = v),
        ),
        gap(),
        Text(
          [ModakFacts.spec, ModakFacts.washing, ModakFacts.delivery][tab],
          style: ModakType.body,
        ),
        gap(),
        title('함께 놓인 물건', 22),
        CatalogCallout(1, '밤불 밀랍초 3개입 · ₩19,000'),
        CatalogCallout(2, '도톰 머그 · ₩26,000'),
      ]),
    ];
  }

  List<Widget> inbox(BuildContext ctx) {
    final c = ModakTokens.of(ctx);
    final rows = List.generate(12, (i) => i).where(
      (i) =>
          (filter == 0 || i < 6 && !replied.contains(i)) &&
          ('${ModakFacts.conversations[i][0]} ${ModakFacts.conversations[i][2]}')
              .contains(query),
    );
    return [
      room(ctx, c.roomOak, [
        title('상담함', 32),
        meta(ctx, '백하늘 · 한채원 / 미답 ${6 - replied.length}건 · 평균 첫 답장 38분'),
        const RoomScene(scene: 2),
        const PencilMemo('손으로 만져 보고 골라요'),
      ]),
      room(ctx, c.paper, [
        TextField(
          decoration: const InputDecoration(
            labelText: '이름·내용 찾기',
            prefixIcon: Icon(Icons.search),
          ),
          onChanged: (v) => setState(() => query = v),
        ),
        gap(),
        ModakTabs(
          ['모두 12', '미답 ${6 - replied.length}'],
          selected: filter,
          onChanged: (v) => setState(() => filter = v),
        ),
        gap(),
        if (rows.isEmpty)
          ModakEmptyState(
            '찾는 상담이 없어요',
            onReset: () => setState(() {
              query = '';
              filter = 0;
            }),
          ),
        for (final i in rows)
          Column(
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: modakRoom(
                    c,
                    [0, 4, 0, 0, 2, 1, 4, 3, 2, 3, 0, 3][i],
                  ),
                  child: Text(
                    ModakFacts.conversations[i][0].substring(1),
                    style: ModakType.label.copyWith(color: c.text),
                  ),
                ),
                title: Text(
                  ModakFacts.conversations[i][0],
                  style: ModakType.ui,
                ),
                subtitle: Text(
                  replyText[i] ?? ModakFacts.conversations[i][2],
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: ModakType.ui.copyWith(fontSize: 14),
                ),
                trailing: Text(
                  replied.contains(i)
                      ? '답장 완료'
                      : ModakFacts.conversations[i][1],
                  style: ModakType.ui.copyWith(fontSize: 12),
                ),
                onTap: () => conversation(ctx, i),
              ),
              Divider(color: c.line),
            ],
          ),
      ]),
    ];
  }

  Future<void> conversation(BuildContext ctx, int i) async {
    final draft = replyControllers[i];
    draft.text = replyText[i] ?? '';

    bool error = false;
    await showModalBottomSheet(
      context: ctx,
      isScrollControlled: true,
      backgroundColor: ModakTokens.of(ctx).paperRaised,
      builder: (modal) => StatefulBuilder(
        builder: (modal, update) => SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
              24,
              24,
              24,
              24 + MediaQuery.viewInsetsOf(modal).bottom,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                title(ModakFacts.conversations[i][0]),
                meta(ctx, ModakFacts.conversations[i][1]),
                gap(),
                Text(ModakFacts.conversations[i][2], style: ModakType.body),
                if (i == 2) ...[
                  gap(),
                  meta(ctx, 'CS-31207 · 류다온 · 서교동'),
                  const RoomScene(scene: 2),
                  Text(ModakFacts.sample, style: ModakType.ui),
                ],
                gap(),
                ModakTextField(
                  '답장',
                  controller: draft,
                  error: error ? '답장 내용을 적어 주세요.' : null,
                  helper: '이 앱 안의 상담 기록에 저장합니다.',
                ),
                gap(),
                Wrap(
                  spacing: 8,
                  children: [
                    ModakButton(
                      '샘플 안내',
                      kind: ButtonKind.secondary,
                      onPressed: () =>
                          draft.text = '패브릭 샘플 4종을 준비해 두었어요. 모닥의 집에서 확인해 주세요.',
                    ),
                    ModakButton(
                      '투어 안내',
                      kind: ButtonKind.secondary,
                      onPressed: () =>
                          draft.text = '금·토 램프 타임은 19:00–21:00입니다.',
                    ),
                  ],
                ),
                gap(),
                ModakButton(
                  '답장 저장',
                  onPressed: () {
                    if (draft.text.trim().isEmpty) {
                      update(() => error = true);
                      return;
                    }
                    setState(() {
                      replyText[i] = draft.text.trim();
                      if (i < 6) replied.add(i);
                    });
                    Navigator.pop(modal);
                    dsToast(ctx, '답장을 상담 기록에 저장했어요.');
                  },
                ),
                gap(),
                ModakButton(
                  '닫기',
                  kind: ButtonKind.secondary,
                  onPressed: () => Navigator.pop(modal),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> settings(BuildContext ctx) {
    final c = ModakTokens.of(ctx);
    return [
      room(ctx, c.roomFjord, [
        const RoomScene(scene: 3),
        title('${ModakFacts.user} 님의 계정', 32),
        meta(ctx, '성북구 정릉동 · ${ModakFacts.member}'),
        gap(),
        const PencilMemo('우리 집에 둘 물건을 골라요'),
      ]),
      room(ctx, c.paperRaised, [
        title('내 정보'),
        gap(),
        ModakTextField(
          '이름',
          controller: name,
          error: nameError ? '이름을 적어 주세요.' : null,
        ),
        gap(),
        ModakTextField(
          '휴대폰',
          controller: phone,
          error: phoneError ? '한 자리가 모자라요. 010-1234-5678로 적어 주세요.' : null,
        ),
        gap(),
        ModakTextField('이메일', controller: email),
        gap(),
        ModakTextField('현관 앞 메모', controller: note),
        gap(),
        ModakButton(
          '내 정보 저장',
          onPressed: () {
            setState(() {
              nameError = name.text.trim().isEmpty;
              phoneError = !RegExp(
                r'^010-\d{4}-\d{4}$',
              ).hasMatch(phone.text.trim());
            });
            if (!nameError && !phoneError) dsToast(ctx, '내 정보를 저장했어요.');
          },
        ),
        gap(32),
        title('배송지'),
        gap(),
        for (var i = 0; i < addresses.length; i++)
          if (!(i == 1 && addressRemoved)) ...[
            paper(ctx, [
              title(addresses[i][0], 22),
              Text(addresses[i][1], style: ModakType.ui),
              meta(
                ctx,
                '${addresses[i][2]} · ${addresses[i][3]} · ${addresses[i][4]}',
              ),
              gap(),
              ModakButton(
                '주소 편집',
                kind: ButtonKind.secondary,
                onPressed: () => editAddress(ctx, i),
              ),
              if (i == 1)
                ModakButton(
                  '부모님 주소 삭제',
                  kind: ButtonKind.destructive,
                  onPressed: () async {
                    final yes = await dsDialog(
                      ctx,
                      '배송지 삭제',
                      '애월 부모님 배송지를 삭제할까요?',
                    );
                    if (yes == true) setState(() => addressRemoved = true);
                  },
                ),
            ]),
            gap(),
          ],
        title('알림'),
        gap(),
        for (var i = 0; i < notifications.length; i++)
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(ModakFacts.notifications[i][0], style: ModakType.ui),
            subtitle: Text(
              ModakFacts.notifications[i][1],
              style: ModakType.ui.copyWith(fontSize: 13),
            ),
            value: notifications[i],
            onChanged: i == 4
                ? null
                : (v) => setState(() => notifications[i] = v),
          ),
        meta(ctx, ModakFacts.quiet),
        gap(),
        title('받는 곳', 22),
        for (var i = 0; i < channels.length; i++)
          CheckboxListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(ModakFacts.channels[i][0], style: ModakType.ui),
            value: channels[i],
            onChanged: (v) => setState(() => channels[i] = v ?? false),
          ),
        gap(),
        title('화면', 22),
        ModakButton(
          widget.dark ? '밤 · 램프 타임 → 낮으로' : '낮 · 오후 네 시 → 밤으로',
          kind: ButtonKind.secondary,
          onPressed: widget.onToggle,
        ),
        gap(32),
        title('우리 집 취향'),
        Text(ModakFacts.taste, style: ModakType.ui),
        gap(),
        const ModakProgress(.75, "취향 찾기 75%"),
        gap(32),
        title('결제'),
        Text(ModakFacts.card, style: ModakType.ui),
        meta(ctx, '카카오페이'),
        gap(),
        title('진행 중인 스타일링', 22),
        Text(ModakFacts.styling, style: ModakType.ui),
        gap(24),
      ]),
    ];
  }

  Future<void> editAddress(BuildContext ctx, int i) async {
    final field = addressControllers[i];
    field.text = addresses[i][1];
    bool error = false;
    await showModalBottomSheet(
      context: ctx,
      isScrollControlled: true,
      builder: (modal) => StatefulBuilder(
        builder: (modal, update) => SafeArea(
          child: Padding(
            padding: EdgeInsets.fromLTRB(
              24,
              24,
              24,
              24 + MediaQuery.viewInsetsOf(modal).bottom,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                title(addresses[i][0]),
                gap(),
                ModakTextField(
                  '주소',
                  controller: field,
                  error: error ? '주소를 적어 주세요.' : null,
                ),
                gap(),
                ModakButton(
                  '배송지 저장',
                  onPressed: () {
                    if (field.text.trim().isEmpty) {
                      update(() => error = true);
                      return;
                    }
                    setState(() => addresses[i][1] = field.text.trim());
                    Navigator.pop(modal);
                    dsToast(ctx, '배송지를 저장했어요.');
                  },
                ),
                gap(),
                ModakButton(
                  '닫기',
                  kind: ButtonKind.secondary,
                  onPressed: () => Navigator.pop(modal),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PullCord extends CustomPainter {
  final ModakColors c;
  _PullCord(this.c);
  @override
  void paint(Canvas canvas, Size s) {
    canvas.drawLine(
      Offset(s.width / 2, 0),
      Offset(s.width / 2, 27),
      Paint()
        ..color = c.objInk
        ..strokeWidth = 1.5,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(s.width / 2 - 6, 26, 12, 18),
        const Radius.circular(6),
      ),
      Paint()..color = c.dark ? c.lamp : c.objWood,
    );
  }

  @override
  bool shouldRepaint(_PullCord old) => old.c.dark != c.dark;
}

class _RoomSecondary extends InheritedWidget {
  final Color color;
  const _RoomSecondary({required this.color, required super.child});
  @override
  bool updateShouldNotify(_RoomSecondary old) => old.color != color;
}
