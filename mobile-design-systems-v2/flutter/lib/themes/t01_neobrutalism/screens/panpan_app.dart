import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class PanpanApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const PanpanApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<PanpanApp> createState() => _PanpanAppState();
}

class _PanpanAppState extends State<PanpanApp> {
  late int screen = widget.initialScreen;
  int filter = 0;
  bool notify = true, used = false, pickup = true;
  String query = '', reply = '';
  final shop = TextEditingController(text: PanpanFacts.brand);
  String? error;
  @override
  void dispose() {
    shop.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: panpanTheme(widget.dark),
    child: Builder(
      builder: (context) => Scaffold(
        appBar: PanpanTopAppBar(
          PanpanFacts.brand,
          onBack: widget.onBack,
          onToggle: widget.onToggle,
        ),
        bottomNavigationBar: PanpanNavigationBar(
          selected: screen,
          onChanged: (i) => setState(() => screen = i),
          labels: const ['운영', '음반', '문의', '매장'],
          icons: const [
            Icons.space_dashboard_outlined,
            Icons.album_outlined,
            Icons.inbox_outlined,
            Icons.storefront_outlined,
          ],
        ),
        body: SingleChildScrollView(
          key: ValueKey(screen),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (screen == 0)
                ...dashboard(context)
              else if (screen == 1)
                ...product(context)
              else if (screen == 2)
                ...inbox(context)
              else
                ...settings(context),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    ),
  );
  Widget title(BuildContext c, String t) => section(
    c,
    Text(
      t,
      style: PanpanType.display.copyWith(
        color: PanpanTokens.of(c).fg,
        fontSize: 36,
      ),
    ),
  );
  Widget section(BuildContext ctx, Widget child, {Color? color}) {
    final c = PanpanTokens.of(ctx);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        border: Border(bottom: BorderSide(color: c.rule, width: 3)),
      ),
      child: child,
    );
  }

  List<Widget> dashboard(BuildContext ctx) {
    final c = PanpanTokens.of(ctx);
    return [
      section(
        ctx,
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              PanpanFacts.shortDate,
              style: PanpanType.ui.copyWith(
                color: c.onAccent,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              '${PanpanFacts.owner} · 망원',
              style: PanpanType.ui.copyWith(color: c.onAccent, fontSize: 14),
            ),
          ],
        ),
        color: c.accent,
      ),
      title(ctx, '운영 보드'),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '10월 매출',
              style: PanpanType.ui.copyWith(fontSize: 14, color: c.fgMuted),
            ),
            const SizedBox(height: 4),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                PanpanFacts.revenue,
                style: PanpanType.number.copyWith(fontSize: 60, color: c.fg),
              ),
            ),
            const SizedBox(height: 12),
            PanpanProgress(PanpanFacts.progress, '목표 ${PanpanFacts.target}'),
            const SizedBox(height: 12),
            const Align(
              alignment: Alignment.centerRight,
              child: PriceSticker('목표의 92%'),
            ),
          ],
        ),
      ),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              PanpanFacts.concert,
              style: PanpanType.ui.copyWith(
                color: c.onHighlight,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Text(
                    PanpanFacts.artist,
                    style: PanpanType.display.copyWith(
                      fontSize: 36,
                      color: c.onHighlight,
                    ),
                  ),
                ),
                Text(
                  '38',
                  style: PanpanType.number.copyWith(
                    fontSize: 48,
                    color: c.onHighlight,
                  ),
                ),
                Text('석', style: PanpanType.ui.copyWith(color: c.onHighlight)),
              ],
            ),
            Text(
              PanpanFacts.concertDate,
              style: PanpanType.ui.copyWith(color: c.onHighlight),
            ),
            const SizedBox(height: 12),
            PanpanButton(
              '공연 잔여석 보기',
              kind: ButtonKind.secondary,
              onPressed: () => dsBottomSheet(
                ctx,
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      PanpanFacts.concert,
                      style: PanpanType.display.copyWith(fontSize: 32),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '${PanpanFacts.artist}\n${PanpanFacts.concertDate}\n${PanpanFacts.seats} 남음',
                      style: PanpanType.ui,
                    ),
                    const SizedBox(height: 24),
                    PanpanButton('확인', onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
              ),
            ),
          ],
        ),
        color: c.highlight,
      ),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '매입 검수 대기',
              style: PanpanType.ui.copyWith(
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final crate in PanpanFacts.crates) PanpanBadge(crate),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '담당 한도윤 · ${PanpanFacts.intake}',
              style: PanpanType.ui.copyWith(fontSize: 14, color: c.fgMuted),
            ),
          ],
        ),
      ),
    ];
  }

  List<Widget> product(BuildContext ctx) {
    final c = PanpanTokens.of(ctx);
    return [
      section(
        ctx,
        Text(
          '${PanpanFacts.albumId} / ${PanpanFacts.format}',
          style: PanpanType.ui.copyWith(fontSize: 13),
        ),
      ),
      const AlbumArt(),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              PanpanFacts.artist,
              style: PanpanType.ui.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 4),
            Text(
              PanpanFacts.album,
              style: PanpanType.display.copyWith(fontSize: 48, color: c.fg),
            ),
            const SizedBox(height: 16),
            const PriceSticker(PanpanFacts.price),
          ],
        ),
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: PanpanTabs(
          const ['재발매', '중고'],
          selected: used ? 1 : 0,
          onChanged: (i) => setState(() => used = i == 1),
        ),
      ),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              used
                  ? '${PanpanFacts.usedGrade} · ${PanpanFacts.usedPrice}'
                  : PanpanFacts.format,
              style: PanpanType.ui.copyWith(
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            Text('매장 픽업 또는 택배로 받아보세요.', style: PanpanType.ui),
            const SizedBox(height: 20),
            PanpanButton(
              '담을 판 고르기',
              onPressed: () => dsBottomSheet(
                ctx,
                StatefulBuilder(
                  builder: (ctx, setSheet) => Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        PanpanFacts.album,
                        style: PanpanType.display.copyWith(fontSize: 36),
                      ),
                      const SizedBox(height: 12),
                      PanpanRadio(
                        '매장 픽업',
                        selected: pickup,
                        onTap: () => setSheet(() => pickup = true),
                      ),
                      PanpanRadio(
                        '택배',
                        selected: !pickup,
                        onTap: () => setSheet(() => pickup = false),
                      ),
                      PanpanButton(
                        '장바구니에 담기',
                        onPressed: () {
                          Navigator.pop(ctx);
                          dsToast(ctx, '${PanpanFacts.album}을 장바구니에 담았어요');
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      section(
        ctx,
        Text(
          '셀렉터 오세진\n흑백전화 〈지하 3층〉',
          style: PanpanType.ui.copyWith(
            color: c.onSlabInk,
            fontWeight: FontWeight.w700,
          ),
        ),
        color: c.slabInk,
      ),
    ];
  }

  List<Widget> inbox(BuildContext ctx) {
    final c = PanpanTokens.of(ctx);
    final rows = PanpanFacts.inquiries
        .where(
          (r) =>
              (filter == 0 || r.$1 == ['전체', '매입', '예매', '주문'][filter]) &&
              (r.$2 + r.$3).contains(query),
        )
        .toList();
    return [
      title(ctx, '문의함'),
      Padding(
        padding: const EdgeInsets.all(16),
        child: PanpanTabs(
          const ['전체', '매입', '예매', '주문'],
          selected: filter,
          onChanged: (i) => setState(() => filter = i),
        ),
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: PanpanTextField(
          '문의 검색',
          onChanged: (s) => setState(() => query = s),
        ),
      ),
      for (final r in rows)
        PanpanListItem(
          r.$2,
          '${r.$1} · ${r.$3}',
          trailing: Icon(Icons.chevron_right, color: c.fg),
          onTap: () => dsBottomSheet(
            ctx,
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                PanpanBadge(r.$1),
                const SizedBox(height: 16),
                Text(
                  r.$2,
                  style: PanpanType.ui.copyWith(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                PanpanTextField(
                  '답장 초안',
                  helper: '이 기기에서만 저장됩니다.',
                  onChanged: (s) => reply = s,
                ),
                const SizedBox(height: 16),
                PanpanButton(
                  '초안 저장',
                  onPressed: () {
                    Navigator.pop(ctx);
                    dsToast(
                      ctx,
                      reply.trim().isEmpty ? '입력한 답장이 없습니다.' : '답장 초안을 저장했어요',
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      if (rows.isEmpty)
        PanpanEmptyState(
          '조건에 맞는 문의가 없어요.',
          onReset: () => setState(() {
            query = '';
            filter = 0;
          }),
        ),
    ];
  }

  List<Widget> settings(BuildContext ctx) {
    final c = PanpanTokens.of(ctx);
    return [
      title(ctx, '매장 설정'),
      section(
        ctx,
        Text('${PanpanFacts.operator} · 온라인 운영', style: PanpanType.ui),
      ),
      section(
        ctx,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PanpanBadge('${PanpanFacts.closure} 임시휴무'),
            const SizedBox(height: 16),
            PanpanTextField('매장 이름', controller: shop, error: error),
            Text(
              PanpanFacts.address,
              style: PanpanType.ui.copyWith(fontSize: 14, color: c.fgMuted),
            ),
          ],
        ),
      ),
      for (final row in PanpanFacts.hours) PanpanListItem(row.$1, row.$2),
      Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            PanpanSwitch(
              '입고 알림',
              value: notify,
              onChanged: (v) => setState(() => notify = v),
            ),
            PanpanButton(
              '변경 저장',
              onPressed: () {
                setState(
                  () => error = shop.text.trim().isEmpty
                      ? '매장 이름을 입력해 주세요.'
                      : null,
                );
                if (error == null) dsToast(ctx, '매장 설정을 저장했어요');
              },
            ),
            const SizedBox(height: 20),
            PanpanButton(
              '임시휴무 예약 확인',
              kind: ButtonKind.destructive,
              onPressed: () async {
                final yes = await dsDialog(
                  ctx,
                  '임시휴무 예약',
                  '${PanpanFacts.closure}은 재고 정리로 쉽니다.',
                );
                if (yes && ctx.mounted) dsToast(ctx, '임시휴무 예약을 확인했어요');
              },
            ),
          ],
        ),
      ),
    ];
  }
}
