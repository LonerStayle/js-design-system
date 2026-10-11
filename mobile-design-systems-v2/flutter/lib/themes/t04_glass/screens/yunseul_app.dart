import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import '../theme/theme.dart';
import '../facts.dart';
import '../components/components.dart';
import '../components/signatures.dart';

class YunseulApp extends StatefulWidget {
  final bool dark;
  final int initialScreen;
  final VoidCallback? onBack, onToggle;
  const YunseulApp({
    super.key,
    this.dark = false,
    this.initialScreen = 0,
    this.onBack,
    this.onToggle,
  });
  @override
  State<YunseulApp> createState() => _YunseulAppState();
}

class _YunseulAppState extends State<YunseulApp> {
  late int screen = widget.initialScreen;
  int variant = 1, room = 0;
  double brightness = 70, mood = 40, target = 24;
  bool mainOn = true,
      moodOn = true,
      dnd = false,
      secure = true,
      receded = false;
  final read = <int>{};
  String query = '';
  bool calendarAdded = false;
  final house = TextEditingController(text: YunseulFacts.house);
  @override
  void dispose() {
    house.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: yunseulTheme(widget.dark),
    child: Builder(
      builder: (ctx) {
        final c = YunseulTokens.of(ctx);
        final reduce = MediaQuery.disableAnimationsOf(ctx);
        return Scaffold(
          backgroundColor: c.canvas,
          body: Stack(
            children: [
              Positioned.fill(
                child: ImageFiltered(
                  imageFilter: ui.ImageFilter.blur(
                    sigmaX: receded ? 8 : 0,
                    sigmaY: receded ? 8 : 0,
                  ),
                  child: const RiverWindow(),
                ),
              ),
              SafeArea(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: GlassPanel(
                        radius: 32,
                        padding: 0,
                        child: Row(
                          children: [
                            YunseulIconButton(
                              Icons.arrow_back,
                              '테마 목록',
                              onPressed: widget.onBack,
                            ),
                            Expanded(
                              child: Text(
                                YunseulFacts.brand,
                                style: YunseulType.ui.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            YunseulIconButton(
                              widget.dark
                                  ? Icons.light_mode_outlined
                                  : Icons.dark_mode_outlined,
                              '밝기 전환',
                              onPressed: widget.onToggle,
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: AnimatedScale(
                        scale: receded && !reduce ? .955 : 1,
                        duration: reduce ? Duration.zero : YunseulMotion.sheet,
                        curve: const Cubic(.32, .72, 0, 1),
                        child: ImageFiltered(
                          imageFilter: ui.ImageFilter.blur(
                            sigmaX: receded ? 3 : 0,
                            sigmaY: receded ? 3 : 0,
                          ),
                          child: SingleChildScrollView(
                            key: ValueKey(screen),
                            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
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
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
                      child: GlassPanel(
                        radius: 32,
                        padding: 4,
                        child: Row(
                          children: [
                            for (var i = 0; i < 4; i++)
                              Expanded(
                                child: Semantics(
                                  selected: screen == i,
                                  child: InkWell(
                                    onTap: () => setState(() => screen = i),
                                    borderRadius: BorderRadius.circular(24),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 10,
                                      ),
                                      decoration: BoxDecoration(
                                        color: screen == i ? c.tileOn : null,
                                        borderRadius: BorderRadius.circular(24),
                                      ),
                                      child: Column(
                                        children: [
                                          Icon(
                                            [
                                              Icons.home_outlined,
                                              Icons.lightbulb_outline,
                                              Icons.notifications_none,
                                              Icons.tune,
                                            ][i],
                                            color: screen == i
                                                ? c.tileOnAccent
                                                : c.text,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            ['집', '스토어', '알림', '설정'][i],
                                            style: YunseulType.ui.copyWith(
                                              fontSize: 12,
                                              color: screen == i
                                                  ? c.tileOnText
                                                  : c.text,
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
                  ],
                ),
              ),
            ],
          ),
        );
      },
    ),
  );
  Widget heading(String text) => Text(
    text,
    style: YunseulType.ui.copyWith(fontSize: 24, fontWeight: FontWeight.w700),
  );
  Widget meta(BuildContext ctx, String text) => Text(
    text,
    style: YunseulType.ui.copyWith(
      color: YunseulTokens.of(ctx).text2,
      fontSize: 13,
    ),
  );
  Widget gap() => const SizedBox(height: 16);
  Widget panel(Widget child) => GlassPanel(child: child);
  Future<void> sheet(
    BuildContext ctx,
    Widget Function(BuildContext, StateSetter) content,
  ) async {
    setState(() => receded = true);
    await showModalBottomSheet<void>(
      context: ctx,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: YunseulTokens.of(ctx).glass3,
      showDragHandle: true,
      builder: (sc) => StatefulBuilder(
        builder: (s, local) => SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(
            20,
            8,
            20,
            28 + MediaQuery.viewInsetsOf(s).bottom,
          ),
          child: content(s, local),
        ),
      ),
    );
    if (mounted) setState(() => receded = false);
  }

  List<Widget> dashboard(BuildContext ctx) => [
    Text(
      widget.dark ? YunseulFacts.darkClock : YunseulFacts.lightClock,
      style: YunseulType.number.copyWith(
        fontSize: 76,
        fontWeight: FontWeight.w200,
        color: YunseulTokens.of(ctx).text,
      ),
    ),
    heading(house.text),
    meta(ctx, YunseulFacts.homeAddress),
    meta(ctx, YunseulFacts.basis),
    gap(),
    SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < YunseulFacts.rooms.length; i++)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: YunseulButton(
                '${YunseulFacts.rooms[i][0]} ${YunseulFacts.rooms[i][1]}',
                kind: room == i ? ButtonKind.primary : ButtonKind.secondary,
                onPressed: () => setState(() => room = i),
              ),
            ),
        ],
      ),
    ),
    gap(),
    if (room == 4)
      panel(
        YunseulEmptyState(
          '서재에 등록된 기기가 없어요',
          onReset: () => setState(() => room = 0),
        ),
      )
    else if (room != 0)
      panel(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            heading(YunseulFacts.rooms[room][0]),
            for (final device in YunseulFacts.devices.where(
              (d) => d[2] == YunseulFacts.rooms[room][0],
            ))
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(device[1]),
                subtitle: Text(device[3]),
                onTap: () => showRoomDevice(ctx, device),
              ),
            if (int.parse(YunseulFacts.rooms[room][1]) >
                YunseulFacts.devices
                    .where((d) => d[2] == YunseulFacts.rooms[room][0])
                    .length)
              meta(
                ctx,
                "나머지 ${int.parse(YunseulFacts.rooms[room][1]) - YunseulFacts.devices.where((d) => d[2] == YunseulFacts.rooms[room][0]).length}대",
              ),
          ],
        ),
      )
    else ...[
      panel(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            heading('거실 실내'),
            const YunseulGauge(.7, '23.5°'),
            meta(ctx, '목표 ${target.toStringAsFixed(1)}°C'),
            Row(
              children: [
                YunseulIconButton(
                  Icons.remove,
                  '온도 낮추기',
                  onPressed: target > 18
                      ? () => setState(() => target -= .5)
                      : null,
                ),
                const Expanded(
                  child: Text(
                    '습도 46% · CO₂ 640ppm',
                    textAlign: TextAlign.center,
                  ),
                ),
                YunseulIconButton(
                  Icons.add,
                  '온도 높이기',
                  onPressed: target < 28
                      ? () => setState(() => target += .5)
                      : null,
                ),
              ],
            ),
          ],
        ),
      ),
      gap(),
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: lightTile(
              ctx,
              '거실 메인등',
              mainOn,
              brightness,
              (v) => setState(() => mainOn = v),
              (v) => setState(() => brightness = v),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: lightTile(
              ctx,
              '무드등 L2',
              moodOn,
              mood,
              (v) => setState(() => moodOn = v),
              (v) => setState(() => mood = v),
            ),
          ),
        ],
      ),
      gap(),
      panel(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            meta(ctx, '전기 · 오늘'),
            Text(
              YunseulFacts.energy,
              style: YunseulType.number.copyWith(
                fontSize: 38,
                fontWeight: FontWeight.w300,
              ),
            ),
            meta(ctx, YunseulFacts.energyForecast),
            gap(),
            YunseulButton(
              '영화 장면 실행',
              onPressed: () {
                setState(() {
                  mainOn = false;
                  moodOn = true;
                  mood = 15;
                });
                dsToast(ctx, '영화 장면 · 메인등 끄기, 무드등 15%, 커튼 닫기');
              },
            ),
          ],
        ),
      ),
      gap(),
      panel(
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            heading('집 상태'),
            meta(ctx, '온라인 25대 · 오프라인 2대'),
            const Text('공기청정기 A3 · 필터 8% · 연결 끊김'),
            meta(ctx, YunseulFacts.pet),
            meta(ctx, YunseulFacts.guest),
            if (calendarAdded) meta(ctx, YunseulFacts.calendarEvent),
          ],
        ),
      ),
    ],
  ];
  void showRoomDevice(BuildContext ctx, List<String> device) {
    setState(() => receded = true);
    dsBottomSheet(
      ctx,
      Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading(device[1]),
          meta(ctx, device[0]),
          Text(device[3]),
          gap(),
          YunseulButton("닫기", onPressed: () => Navigator.pop(ctx)),
        ],
      ),
    ).whenComplete(() {
      if (mounted) setState(() => receded = false);
    });
  }

  Widget lightTile(
    BuildContext ctx,
    String title,
    bool on,
    double value,
    ValueChanged<bool> toggle,
    ValueChanged<double> change,
  ) {
    final c = YunseulTokens.of(ctx);
    return GlassPanel(
      on: on,
      padding: 12,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Icon(
            Icons.lightbulb_outline,
            color: on ? c.tileOnLamp : c.text,
            size: 30,
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: YunseulType.ui.copyWith(
              color: on ? c.tileOnText : c.text,
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          Text(
            '${value.round()}%',
            style: YunseulType.number.copyWith(
              fontSize: 36,
              fontWeight: FontWeight.w200,
              color: on ? c.tileOnText : c.text,
            ),
          ),
          Switch(
            value: on,
            onChanged: toggle,
            activeThumbColor: c.tileOnAccent,
          ),
          Slider(
            value: value,
            min: 0,
            max: 100,
            divisions: 100,
            onChanged: on ? change : null,
            semanticFormatterCallback: (v) => '밝기 ${v.round()}%',
            activeColor: c.tileOnAccent,
          ),
        ],
      ),
    );
  }

  List<Widget> product(BuildContext ctx) => [
    YunseulLamp(variant),
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading(YunseulFacts.lamp),
          meta(ctx, YunseulFacts.lampReview),
          gap(),
          Text(
            YunseulFacts.lampPrice,
            style: YunseulType.number.copyWith(
              fontSize: 42,
              fontWeight: FontWeight.w300,
            ),
          ),
          gap(),
          YunseulTabs(
            const ['서리', '호박', '심해'],
            selected: variant,
            onChanged: (i) => setState(() => variant = i),
          ),
          gap(),
          Text(YunseulFacts.lampSpec),
          meta(ctx, YunseulFacts.delivery),
          gap(),
          YunseulButton(
            '무드등 선택',
            onPressed: () => sheet(
              ctx,
              (s, local) => Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  heading('무드등 선택'),
                  YunseulLamp(variant),
                  Text('${YunseulFacts.lamp} · ${['서리', '호박', '심해'][variant]}'),
                  Text(YunseulFacts.lampPrice),
                  meta(ctx, YunseulFacts.delivery),
                  gap(),
                  YunseulButton(
                    '선택 확인',
                    onPressed: () {
                      Navigator.pop(s);
                      dsToast(ctx, '${['서리', '호박', '심해'][variant]} 무드등을 선택했어요');
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ),
    gap(),
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading('배송 중인 주문'),
          meta(ctx, YunseulFacts.order),
          Text(YunseulFacts.existingOrder),
          meta(ctx, YunseulFacts.delivery),
        ],
      ),
    ),
  ];
  List<Widget> inbox(BuildContext ctx) {
    final events = YunseulFacts.events.indexed.where(
      (e) => e.$2.join().contains(query),
    );
    return [
      heading('알림 센터'),
      meta(ctx, YunseulFacts.basis),
      gap(),
      panel(
        Row(
          children: [
            Expanded(
              child: Text(
                '읽지 않음 ${12 - read.length}건',
                style: YunseulType.ui.copyWith(fontWeight: FontWeight.w700),
              ),
            ),
            YunseulButton(
              '모두 읽음',
              kind: ButtonKind.ghost,
              onPressed: () =>
                  setState(() => read.addAll(List.generate(12, (i) => i))),
            ),
          ],
        ),
      ),
      gap(),
      panel(
        YunseulTextField('알림 검색', onChanged: (s) => setState(() => query = s)),
      ),
      gap(),
      if (events.isEmpty)
        panel(
          YunseulEmptyState(
            '조건에 맞는 알림이 없어요',
            onReset: () => setState(() => query = ''),
          ),
        ),
      for (final e in events.toList().reversed) ...[
        GestureDetector(
          onTap: () {
            setState(() => read.add(e.$1));
            sheet(
              ctx,
              (s, local) => Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  meta(ctx, '${e.$2[0]} · ${e.$2[2]}'),
                  heading(e.$2[1]),
                  gap(),
                  Text(e.$2[3]),
                  gap(),
                  if (e.$1 == 0)
                    YunseulButton(
                      '앱 일정에 추가',
                      onPressed: () {
                        setState(() => calendarAdded = true);
                        Navigator.pop(s);
                        dsToast(
                          ctx,
                          '${YunseulFacts.calendarEvent}을 일정에 추가했어요',
                        );
                      },
                    )
                  else
                    YunseulButton('확인', onPressed: () => Navigator.pop(s)),
                ],
              ),
            );
          },
          child: Semantics(
            button: true,
            label: '${e.$2[1]}, ${read.contains(e.$1) ? '읽음' : '읽지 않음'}',
            child: panel(
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    read.contains(e.$1)
                        ? Icons.mark_email_read_outlined
                        : Icons.notifications_active_outlined,
                    size: 22,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          e.$2[1],
                          style: YunseulType.ui.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        meta(ctx, e.$2[3]),
                        meta(ctx, '${e.$2[0]} · ${e.$2[2]}'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
      ],
    ];
  }

  List<Widget> settings(BuildContext ctx) => [
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading(YunseulFacts.hub),
          meta(ctx, YunseulFacts.hubId),
          const YunseulGauge(.62, '62%'),
          meta(
            ctx,
            '${YunseulFacts.firmware} → ${YunseulFacts.updateVersion} · 다운로드 중',
          ),
          const YunseulProgress(.62, '10월 20일(화) 자동 업데이트 예정'),
        ],
      ),
    ),
    gap(),
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading('집 정보'),
          YunseulListItem(
            house.text,
            YunseulFacts.homeAddress,
            onTap: () => sheet(ctx, (s, local) {
              var invalid = false;
              final editHouse = TextEditingController(text: house.text);
              return StatefulBuilder(
                builder: (form, update) => Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    heading('집 이름'),
                    YunseulTextField(
                      '집 이름',
                      controller: editHouse,
                      error: invalid ? '집 이름을 입력해 주세요' : null,
                    ),
                    YunseulButton(
                      '이름 저장',
                      onPressed: () {
                        if (editHouse.text.trim().isEmpty) {
                          update(() => invalid = true);
                          return;
                        }
                        setState(() {
                          house.text = editHouse.text.trim();
                        });
                        Navigator.pop(s);
                        dsToast(ctx, '집 이름을 저장했어요');
                      },
                    ),
                  ],
                ),
              );
            }),
          ),
          for (final member in YunseulFacts.members)
            YunseulListItem(member[0], member[1]),
        ],
      ),
    ),
    gap(),
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading('알림 · 보안'),
          YunseulSwitch(
            '방해금지 ${YunseulFacts.doNotDisturb}',
            value: dnd,
            onChanged: (v) => setState(() => dnd = v),
          ),
          YunseulCheckbox(
            '2단계 인증',
            value: secure,
            onChanged: (v) => setState(() => secure = v ?? false),
          ),
          meta(ctx, '위치 반경 300m · 영상 보관 7일'),
        ],
      ),
    ),
    gap(),
    panel(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          heading('자동화'),
          Text(YunseulFacts.arrivalRule),
          gap(),
          YunseulButton(
            '귀가 장면 확인',
            kind: ButtonKind.secondary,
            onPressed: () => sheet(
              ctx,
              (s, local) => Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  heading('귀가 장면'),
                  const Text(YunseulFacts.arrivalRule),
                  meta(ctx, '마지막 실행 17:02 · 이주원'),
                  gap(),
                  YunseulButton('닫기', onPressed: () => Navigator.pop(s)),
                ],
              ),
            ),
          ),
        ],
      ),
    ),
    gap(),
    panel(
      YunseulButton(
        '허브 다시 시작',
        kind: ButtonKind.destructive,
        onPressed: () => sheet(
          ctx,
          (s, local) => Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              heading('허브 다시 시작'),
              const Text('다시 시작하는 동안 기기 상태를 확인할 수 없어요.'),
              gap(),
              YunseulButton(
                '시연 확인',
                kind: ButtonKind.destructive,
                onPressed: () {
                  Navigator.pop(s);
                  dsToast(ctx, '다시 시작 시연을 확인했어요');
                },
              ),
            ],
          ),
        ),
      ),
    ),
  ];
}
