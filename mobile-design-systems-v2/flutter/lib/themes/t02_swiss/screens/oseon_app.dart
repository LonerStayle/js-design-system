import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class OseonApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const OseonApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<OseonApp> createState() => _OseonAppState();
}

class _OseonAppState extends State<OseonApp> {
  late int screen = widget.initialScreen;
  int grade = 1, quantity = 2, filter = 0;
  String search = '';
  final drafts = <String, String>{};
  bool notify = true, access = false, cancelled = false;
  final name = TextEditingController(text: OseonFacts.member);
  String? error;
  @override
  void dispose() {
    name.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: oseonTheme(widget.dark),
    child: Builder(
      builder: (ctx) => Scaffold(
        appBar: OseonTopAppBar(
          OseonFacts.brand,
          onBack: widget.onBack,
          onToggle: widget.onToggle,
        ),
        bottomNavigationBar: OseonNavigationBar(
          selected: screen,
          onChanged: (i) => setState(() => screen = i),
          labels: const ['매표', '공연', '편지', '계정'],
          icons: const [
            Icons.confirmation_number_outlined,
            Icons.music_note_outlined,
            Icons.mail_outline,
            Icons.person_outline,
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
      ),
    ),
  );
  Widget padded(Widget child) =>
      Padding(padding: const EdgeInsets.fromLTRB(16, 24, 16, 24), child: child);
  Widget label(BuildContext ctx, String text) => Text(
    text,
    style: OseonType.ui.copyWith(
      color: OseonTokens.of(ctx).text2,
      fontSize: 13,
    ),
  );
  Widget title(String text) =>
      Text(text, style: OseonType.display.copyWith(fontSize: 24));
  List<Widget> dashboard(BuildContext ctx) => [
    const GridPlate(
      title: '매표 현황',
      number: '76',
      caption: OseonFacts.basis,
      height: 208,
    ),
    padded(
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          label(ctx, OseonFacts.concertId),
          title('「선과 면」은 목표까지\n137석 남았습니다'),
          const SizedBox(height: 12),
          const Text('1,127 / 1,486석 판매 · 잔여 359석\n목표 85% · 1,264석'),
          const SizedBox(height: 16),
          for (var i = 0; i < 4; i++)
            OseonBullet(
              OseonFacts.shows[[0, 2, 3, 4][i]][0],
              OseonFacts.rates[i],
              onTap: () => setState(() => screen = 1),
            ),
          const SizedBox(height: 20),
          label(ctx, '오늘 판매'),
          Text('214매', style: OseonType.number.copyWith(fontSize: 64)),
          Text(
            OseonFacts.money(13860000),
            style: OseonType.display.copyWith(fontSize: 28),
          ),
          const SizedBox(height: 20),
          OseonButton(
            '오늘 마감 보고',
            kind: ButtonKind.secondary,
            onPressed: () async {
              if (await dsDialog(
                ctx,
                '오늘 마감 보고',
                '214매 · ${OseonFacts.money(13860000)}',
              )) {
                if (ctx.mounted) dsToast(ctx, '마감 보고를 확인했습니다');
              }
            },
          ),
          const SizedBox(height: 32),
          title('구역별 잔여석'),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (var i = 0; i < 13; i++)
                SizedBox(
                  width: 76,
                  child: OseonButton(
                    '${String.fromCharCode(65 + i)} · ${OseonFacts.left[i]}',
                    kind: ButtonKind.secondary,
                    onPressed: () => dsBottomSheet(
                      ctx,
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          title('${String.fromCharCode(65 + i)}구역'),
                          Text('잔여 ${OseonFacts.left[i]}석'),
                          OseonButton(
                            '공연 보기',
                            onPressed: () {
                              Navigator.pop(ctx);
                              setState(() => screen = 1);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 24),
          label(ctx, OseonFacts.opening),
        ],
      ),
    ),
    for (final row in OseonFacts.shows)
      OseonListItem(
        row[1],
        '${row[0]} · ${row[2]}',
        trailing: Text(row[3], style: OseonType.ui.copyWith(fontSize: 12)),
        onTap: () => row == OseonFacts.shows.first
            ? setState(() => screen = 1)
            : dsBottomSheet(
                ctx,
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    title(row[1]),
                    Text('${row[0]}\n${row[2]}\n${row[3]}'),
                  ],
                ),
              ),
      ),
  ];
  List<Widget> product(BuildContext ctx) => [
    const GridPlate(
      title: '공연 상세',
      number: '41',
      caption: OseonFacts.concertId,
      height: 152,
    ),
    padded(
      const GridPlate(
        title: '선과 면',
        number: '41',
        caption: OseonFacts.concertDate,
        poster: true,
        height: 244,
      ),
    ),
    padded(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          title(OseonFacts.concert),
          const SizedBox(height: 12),
          Text(OseonFacts.concertDate),
          label(ctx, OseonFacts.artists),
          const SizedBox(height: 24),
          Text(OseonFacts.program, style: OseonType.ui.copyWith(height: 1.8)),
          const SizedBox(height: 24),
          OseonTabs(
            const ['R석', 'S석', 'A석'],
            selected: grade,
            onChanged: (i) => setState(() => grade = i),
          ),
          const SizedBox(height: 16),
          Text(
            OseonFacts.money(OseonFacts.prices[grade]),
            style: OseonType.number.copyWith(fontSize: 42),
          ),
          label(ctx, '오선 회원 10% 할인 · 예매 수수료 없음'),
          Row(
            children: [
              const Expanded(child: Text('수량')),
              OseonIconButton(
                Icons.remove,
                '수량 줄이기',
                onPressed: quantity > 1
                    ? () => setState(() => quantity--)
                    : null,
              ),
              Text('$quantity', style: OseonType.ui),
              OseonIconButton(
                Icons.add,
                '수량 늘리기',
                onPressed: quantity < 4
                    ? () => setState(() => quantity++)
                    : null,
              ),
            ],
          ),
          Text(
            '합계 ${OseonFacts.money(OseonFacts.prices[grade] * quantity * .9)}',
            style: OseonType.display.copyWith(fontSize: 24),
          ),
          const SizedBox(height: 16),
          OseonButton('예매 요약', onPressed: () => booking(ctx)),
          const SizedBox(height: 24),
          title('관람 안내'),
          const SizedBox(height: 12),
          Text(OseonFacts.cancel),
          label(ctx, '로비 60분 전 · 객석 30분 전 입장'),
        ],
      ),
    ),
  ];
  Future<void> booking(BuildContext ctx) async {
    var agree = false;
    await dsBottomSheet(
      ctx,
      StatefulBuilder(
        builder: (sheet, local) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            title('예매 요약'),
            const SizedBox(height: 16),
            const Text(OseonFacts.concert),
            Text(
              '${['R', 'S', 'A'][grade]}석 · $quantity매\n${OseonFacts.member} · ${OseonFacts.memberId}',
            ),
            Text(
              OseonFacts.money(OseonFacts.prices[grade] * quantity * .9),
              style: OseonType.display,
            ),
            OseonCheckbox(
              OseonFacts.cancel,
              value: agree,
              onChanged: (v) => local(() => agree = v ?? false),
            ),
            OseonButton(
              '선택 확인',
              onPressed: agree
                  ? () {
                      Navigator.pop(sheet);
                      dsToast(ctx, '예매 선택을 확인했습니다');
                    }
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> inbox(BuildContext ctx) {
    final visible = OseonFacts.letters.where(
      (row) =>
          (filter == 0 || row[2] == ['전체', '인쇄소', '매니지먼트', '관내'][filter]) &&
          row.join().contains(search),
    );
    return [
      const GridPlate(
        title: '받은편지함',
        number: '12',
        caption: '홍보디자인팀 · 남궁윤',
        paper: true,
        height: 180,
      ),
      padded(
        Column(
          children: [
            OseonTabs(
              const ['전체', '인쇄소', '매니지먼트', '관내'],
              selected: filter,
              onChanged: (i) => setState(() => filter = i),
            ),
            OseonTextField(
              '편지 검색',
              onChanged: (s) => setState(() => search = s),
            ),
            label(ctx, '팩트 시트에 명시된 주요 편지 5통'),
          ],
        ),
      ),
      if (visible.isEmpty)
        OseonEmptyState(
          '조건에 맞는 편지가 없습니다',
          onReset: () => setState(() {
            search = '';
            filter = 0;
          }),
        ),
      for (final row in visible)
        OseonListItem(
          row[1],
          '${row[0]} · ${row[2]}',
          trailing: const Icon(Icons.chevron_right),
          onTap: () => openLetter(ctx, row),
        ),
    ];
  }

  Future<void> openLetter(BuildContext ctx, List<String> row) async {
    final draft = TextEditingController(text: drafts[row[0]] ?? "");
    var invalid = false;
    await dsBottomSheet(
      ctx,
      StatefulBuilder(
        builder: (sheet, local) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            title(row[1]),
            const SizedBox(height: 12),
            Text(row[0]),
            const SizedBox(height: 24),
            Text(row[3], style: OseonType.ui.copyWith(height: 1.8)),
            OseonTextField(
              '답장 초안',
              controller: draft,
              error: invalid ? '초안을 입력해 주세요' : null,
            ),
            OseonButton(
              '초안 저장',
              onPressed: () {
                if (draft.text.trim().isEmpty) {
                  local(() => invalid = true);
                  return;
                }
                drafts[row[0]] = draft.text;
                Navigator.pop(sheet);
                dsToast(ctx, '답장 초안을 저장했습니다');
              },
            ),
          ],
        ),
      ),
    );
    draft.dispose();
  }

  List<Widget> settings(BuildContext ctx) => [
    const GridPlate(
      title: '내 계정',
      number: '0712',
      caption: '김도연 · M-204318',
      height: 152,
    ),
    padded(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          title('개인정보'),
          OseonTextField('이름', controller: name, error: error),
          label(ctx, OseonFacts.memberId),
          const SizedBox(height: 16),
          OseonSwitch(
            '선예매 알림',
            value: notify,
            onChanged: (v) => setState(() => notify = v),
          ),
          OseonCheckbox(
            '휠체어석 우선 안내',
            value: access,
            onChanged: (v) => setState(() => access = v ?? false),
          ),
          const SizedBox(height: 24),
          title('등록 카드'),
          const Text(OseonFacts.card),
          const SizedBox(height: 24),
          title('정기권'),
          const Text(OseonFacts.subscription),
          const Text(OseonFacts.fixedSeat),
          const SizedBox(height: 24),
          OseonButton(
            '변경 저장',
            onPressed: () {
              setState(
                () => error = name.text.trim().isEmpty ? '이름을 입력해 주세요' : null,
              );
              if (error == null) dsToast(ctx, '계정 변경을 저장했습니다');
            },
          ),
          const SizedBox(height: 32),
          title('나의 예매'),
          const Text(OseonFacts.ticketId),
          const Text(OseonFacts.seat),
          const SizedBox(height: 12),
          OseonButton(
            cancelled ? '부분 취소 확인 완료' : '12번 좌석 부분 취소',
            kind: ButtonKind.destructive,
            onPressed: cancelled
                ? null
                : () async {
                    if (await dsDialog(
                      ctx,
                      '12번 1매 부분 취소',
                      OseonFacts.refund,
                    )) {
                      setState(() => cancelled = true);
                      if (ctx.mounted) dsToast(ctx, '환불액 ₩32,400을 확인했습니다');
                    }
                  },
          ),
        ],
      ),
    ),
  ];
}
