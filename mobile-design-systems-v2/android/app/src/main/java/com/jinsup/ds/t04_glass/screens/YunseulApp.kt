package com.jinsup.ds.t04_glass.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t04_glass.YunseulFacts
import com.jinsup.ds.t04_glass.components.*
import com.jinsup.ds.t04_glass.theme.*
import kotlinx.coroutines.launch

@Composable
fun YunseulApp(
    dark: Boolean,
    initialScreen: Int = 0,
    onBack: () -> Unit = {},
    onToggle: () -> Unit = {},
) =
    YunseulTheme(dark) {
      val c = LocalYunseulColors.current
      var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
      var room by rememberSaveable { mutableIntStateOf(0) }
      var variant by rememberSaveable { mutableIntStateOf(1) }
      var brightness by rememberSaveable { mutableFloatStateOf(70f) }
      var mood by rememberSaveable { mutableFloatStateOf(40f) }
      var target by rememberSaveable { mutableFloatStateOf(24f) }
      var mainOn by rememberSaveable { mutableStateOf(true) }
      var moodOn by rememberSaveable { mutableStateOf(true) }
      var dnd by rememberSaveable { mutableStateOf(false) }
      var secure by rememberSaveable { mutableStateOf(true) }
      var read by rememberSaveable { mutableStateOf(listOf<Int>()) }
      var query by rememberSaveable { mutableStateOf("") }
      var house by rememberSaveable { mutableStateOf(YunseulFacts.house) }
      var calendarAdded by rememberSaveable { mutableStateOf(false) }
      var editHouse by remember { mutableStateOf(house) }
      var invalid by remember { mutableStateOf(false) }
      var sheet by remember { mutableStateOf<String?>(null) }
      var event by remember { mutableIntStateOf(0) }
      val scale by
          animateFloatAsState(
              if (sheet != null) .955f else 1f,
              tween(YunseulMotion.sheet, easing = CubicBezierEasing(.32f, .72f, 0f, 1f)),
              label = "깊이 후퇴",
          )
      val host = remember { SnackbarHostState() }
      val scope = rememberCoroutineScope()
      fun toast(s: String) {
        scope.launch { host.showSnackbar(s) }
      }
      Box(Modifier.fillMaxSize()) {
        RiverWindow(Modifier.blur(if (sheet != null) 8.dp else 0.dp))
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
              Column(Modifier.statusBarsPadding().padding(12.dp)) {
                GlassPanel(radius = 32, padding = 0) {
                  Row(verticalAlignment = Alignment.CenterVertically) {
                    YunseulIconButton(Icons.Outlined.ArrowBack, "테마 목록", onBack)
                    Text(
                        YunseulFacts.brand,
                        Modifier.weight(1f),
                        style = YunseulType.ui,
                        fontWeight = FontWeight.Bold,
                    )
                    YunseulIconButton(
                        if (dark) Icons.Outlined.LightMode else Icons.Outlined.DarkMode,
                        "밝기 전환",
                        onToggle,
                    )
                  }
                }
              }
            },
            bottomBar = {
              Column(Modifier.navigationBarsPadding().padding(12.dp, 0.dp, 12.dp, 8.dp)) {
                GlassPanel(radius = 32, padding = 4) {
                  Row {
                    listOf("집", "스토어", "알림", "설정").forEachIndexed { i, label ->
                      Column(
                          Modifier.weight(1f)
                              .background(
                                  if (screen == i) c.tileOn else Color.Transparent,
                                  RoundedCornerShape(24.dp),
                              )
                              .clickable(role = Role.Tab) { screen = i }
                              .semantics { selected = screen == i }
                              .heightIn(min = 64.dp)
                              .padding(8.dp),
                          horizontalAlignment = Alignment.CenterHorizontally,
                      ) {
                        Icon(
                            listOf(
                                Icons.Outlined.Home,
                                Icons.Outlined.Lightbulb,
                                Icons.Outlined.NotificationsNone,
                                Icons.Outlined.Tune,
                            )[i],
                            null,
                            tint = if (screen == i) c.tileOnAccent else c.text,
                        )
                        Text(
                            label,
                            style = YunseulType.ui.copy(fontSize = 12.sp),
                            color = if (screen == i) c.tileOnText else c.text,
                        )
                      }
                    }
                  }
                }
              }
            },
            snackbarHost = { YunseulSnackbar(host) },
        ) { padding ->
          key(screen) {
            Column(
                Modifier.padding(padding)
                    .graphicsLayer {
                      scaleX = scale
                      scaleY = scale
                    }
                    .blur(if (sheet != null) 3.dp else 0.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp, 12.dp, 16.dp, 24.dp)) {
                  when (screen) {
                    0 -> {
                      Text(
                          if (dark) YunseulFacts.darkClock else YunseulFacts.lightClock,
                          style =
                              YunseulType.number.copy(
                                  fontSize = 76.sp,
                                  lineHeight = 84.sp,
                                  fontWeight = FontWeight.ExtraLight,
                              ),
                      )
                      Heading(house)
                      Meta(YunseulFacts.homeAddress)
                      Meta(YunseulFacts.basis)
                      Gap()
                      Row(
                          Modifier.horizontalScroll(rememberScrollState()),
                          horizontalArrangement = Arrangement.spacedBy(8.dp),
                      ) {
                        YunseulFacts.rooms.forEachIndexed { i, row ->
                          YunseulButton(
                              "${row[0]} ${row[1]}",
                              kind = if (room == i) ButtonKind.Primary else ButtonKind.Secondary,
                          ) {
                            room = i
                          }
                        }
                      }
                      Gap()
                      if (room == 4)
                          GlassPanel { YunseulEmptyState("서재에 등록된 기기가 없어요") { room = 0 } }
                      else if (room != 0) {
                        val devices =
                            YunseulFacts.devices.filter { it[2] == YunseulFacts.rooms[room][0] }
                        GlassPanel {
                          Heading(YunseulFacts.rooms[room][0])
                          devices.forEach { device ->
                            Column(Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
                              Text(device[1], style = YunseulType.ui)
                              Meta(device[3])
                              Meta(device[0])
                            }
                          }
                          val remaining = YunseulFacts.rooms[room][1].toInt() - devices.size
                          if (remaining > 0) Meta("나머지 ${remaining}대")
                        }
                      } else {
                        GlassPanel {
                          Heading("거실 실내")
                          YunseulGauge(.7f, "23.5°")
                          Meta("목표 ${"%.1f".format(target)}°C")
                          Row(verticalAlignment = Alignment.CenterVertically) {
                            YunseulIconButton(Icons.Outlined.Remove, "온도 낮추기") {
                              if (target > 18) target -= .5f
                            }
                            Text(
                                "습도 46% · CO₂ 640ppm",
                                Modifier.weight(1f),
                                style = YunseulType.ui.copy(fontSize = 13.sp),
                            )
                            YunseulIconButton(Icons.Outlined.Add, "온도 높이기") {
                              if (target < 28) target += .5f
                            }
                          }
                        }
                        Gap()
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                          LightTile(
                              "거실 메인등",
                              mainOn,
                              brightness,
                              { mainOn = it },
                              { brightness = it },
                              Modifier.weight(1f),
                          )
                          LightTile(
                              "무드등 L2",
                              moodOn,
                              mood,
                              { moodOn = it },
                              { mood = it },
                              Modifier.weight(1f),
                          )
                        }
                        Gap()
                        GlassPanel {
                          Meta("전기 · 오늘")
                          Text(
                              YunseulFacts.energy,
                              style =
                                  YunseulType.number.copy(
                                      fontSize = 38.sp,
                                      lineHeight = 46.sp,
                                      fontWeight = FontWeight.Light,
                                  ),
                          )
                          Meta(YunseulFacts.energyForecast)
                          Gap()
                          YunseulButton("영화 장면 실행") {
                            mainOn = false
                            moodOn = true
                            mood = 15f
                            toast("영화 장면 · 메인등 끄기, 무드등 15%, 커튼 닫기")
                          }
                        }
                        Gap()
                        GlassPanel {
                          Heading("집 상태")
                          Meta("온라인 25대 · 오프라인 2대")
                          Text("공기청정기 A3 · 필터 8% · 연결 끊김")
                          Meta(YunseulFacts.pet)
                          Meta(YunseulFacts.guest)
                          if (calendarAdded) Meta(YunseulFacts.calendarEvent)
                        }
                      }
                    }
                    1 -> {
                      YunseulLamp(variant)
                      GlassPanel {
                        Heading(YunseulFacts.lamp)
                        Meta(YunseulFacts.lampReview)
                        Gap()
                        Text(
                            YunseulFacts.lampPrice,
                            style =
                                YunseulType.number.copy(
                                    fontSize = 42.sp,
                                    lineHeight = 50.sp,
                                ),
                        )
                        Gap()
                        YunseulTabs(listOf("서리", "호박", "심해"), variant) { variant = it }
                        Gap()
                        Text(YunseulFacts.lampSpec)
                        Meta(YunseulFacts.delivery)
                        Gap()
                        YunseulButton("무드등 선택") { sheet = "lamp" }
                      }
                      Gap()
                      GlassPanel {
                        Heading("배송 중인 주문")
                        Meta(YunseulFacts.order)
                        Text(YunseulFacts.existingOrder)
                        Meta(YunseulFacts.delivery)
                      }
                    }
                    2 -> {
                      Heading("알림 센터")
                      Meta(YunseulFacts.basis)
                      Gap()
                      GlassPanel {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                          Text(
                              "읽지 않음 ${12-read.size}건",
                              Modifier.weight(1f),
                              fontWeight = FontWeight.Bold,
                          )
                          YunseulButton("모두 읽음", kind = ButtonKind.Ghost) {
                            read = (0..11).toList()
                          }
                        }
                      }
                      Gap()
                      GlassPanel { YunseulTextField("알림 검색", query, { query = it }) }
                      Gap()
                      val visible =
                          YunseulFacts.events.withIndex().filter {
                            it.value.joinToString().contains(query)
                          }
                      if (visible.isEmpty())
                          GlassPanel { YunseulEmptyState("조건에 맞는 알림이 없어요") { query = "" } }
                      visible.reversed().forEach { e ->
                        GlassPanel(
                            Modifier.clickable {
                                  event = e.index
                                  read = (read + event).distinct()
                                  sheet = "event"
                                }
                                .semantics {
                                  contentDescription =
                                      "${e.value[1]}, ${if(e.index in read)"읽음" else "읽지 않음"}"
                                }) {
                              Row(verticalAlignment = Alignment.Top) {
                                Icon(
                                    if (e.index in read) Icons.Outlined.MarkEmailRead
                                    else Icons.Outlined.NotificationsActive,
                                    null,
                                )
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                  Text(e.value[1], fontWeight = FontWeight.Bold)
                                  Meta(e.value[3])
                                  Meta("${e.value[0]} · ${e.value[2]}")
                                }
                              }
                            }
                        Spacer(Modifier.height(12.dp))
                      }
                    }
                    else -> {
                      GlassPanel {
                        Heading(YunseulFacts.hub)
                        Meta(YunseulFacts.hubId)
                        YunseulGauge(.62f, "62%")
                        Meta("${YunseulFacts.firmware} → ${YunseulFacts.updateVersion} · 다운로드 중")
                        YunseulProgress(.62f, "10월 20일(화) 자동 업데이트 예정")
                      }
                      Gap()
                      GlassPanel {
                        Heading("집 정보")
                        YunseulListItem(
                            house,
                            YunseulFacts.homeAddress,
                            onClick = {
                              invalid = false
                              editHouse = house
                              sheet = "house"
                            },
                        )
                        YunseulFacts.members.forEach { YunseulListItem(it[0], it[1]) }
                      }
                      Gap()
                      GlassPanel {
                        Heading("알림 · 보안")
                        YunseulSwitch("방해금지 ${YunseulFacts.doNotDisturb}", dnd) { dnd = it }
                        YunseulCheckbox("2단계 인증", secure) { secure = it }
                        Meta("위치 반경 300m · 영상 보관 7일")
                      }
                      Gap()
                      GlassPanel {
                        Heading("자동화")
                        Text(YunseulFacts.arrivalRule)
                        Gap()
                        YunseulButton("귀가 장면 확인", kind = ButtonKind.Secondary) { sheet = "arrival" }
                      }
                      Gap()
                      GlassPanel {
                        YunseulButton("허브 다시 시작", kind = ButtonKind.Destructive) {
                          sheet = "restart"
                        }
                      }
                    }
                  }
                }
          }
        }
      }
      if (sheet != null)
          YunseulBottomSheet({ sheet = null }) {
            when (sheet) {
              "lamp" -> {
                Heading("무드등 선택")
                YunseulLamp(variant)
                Text("${YunseulFacts.lamp} · ${listOf("서리","호박","심해")[variant]}")
                Text(YunseulFacts.lampPrice)
                Meta(YunseulFacts.delivery)
                Gap()
                YunseulButton("선택 확인") {
                  sheet = null
                  toast("${listOf("서리","호박","심해")[variant]} 무드등을 선택했어요")
                }
              }
              "event" -> {
                val row = YunseulFacts.events[event]
                Meta("${row[0]} · ${row[2]}")
                Heading(row[1])
                Gap()
                Text(row[3])
                Gap()
                if (event == 0)
                    YunseulButton("앱 일정에 추가") {
                      calendarAdded = true
                      sheet = null
                      toast("${YunseulFacts.calendarEvent}을 일정에 추가했어요")
                    }
                else YunseulButton("확인") { sheet = null }
              }
              "house" -> {
                Heading("집 이름")
                YunseulTextField(
                    "집 이름",
                    editHouse,
                    { editHouse = it },
                    error = if (invalid) "집 이름을 입력해 주세요" else null,
                )
                YunseulButton("이름 저장") {
                  if (editHouse.isBlank()) invalid = true
                  else {
                    house = editHouse.trim()
                    sheet = null
                    toast("집 이름을 저장했어요")
                  }
                }
              }
              "arrival" -> {
                Heading("귀가 장면")
                Text(YunseulFacts.arrivalRule)
                Meta("마지막 실행 17:02 · 이주원")
                Gap()
                YunseulButton("닫기") { sheet = null }
              }
              "restart" -> {
                Heading("허브 다시 시작")
                Text("다시 시작하는 동안 기기 상태를 확인할 수 없어요.")
                Gap()
                YunseulButton("시연 확인", kind = ButtonKind.Destructive) {
                  sheet = null
                  toast("다시 시작 시연을 확인했어요")
                }
              }
            }
          }
    }

@Composable
private fun LightTile(
    title: String,
    on: Boolean,
    value: Float,
    toggle: (Boolean) -> Unit,
    change: (Float) -> Unit,
    modifier: Modifier,
) {
  val c = LocalYunseulColors.current
  GlassPanel(modifier, on = on, padding = 12) {
    Icon(
        Icons.Outlined.Lightbulb,
        null,
        Modifier.size(30.dp),
        tint = if (on) c.tileOnLamp else c.text,
    )
    Spacer(Modifier.height(8.dp))
    Text(
        title,
        style = YunseulType.ui.copy(fontSize = 14.sp),
        fontWeight = FontWeight.Bold,
        color = if (on) c.tileOnText else c.text,
    )
    Text(
        "${value.toInt()}%",
        style =
            YunseulType.number.copy(
                fontSize = 36.sp,
                lineHeight = 44.sp,
                fontWeight = FontWeight.ExtraLight,
            ),
        color = if (on) c.tileOnText else c.text,
    )
    Switch(on, toggle)
    Slider(
        value,
        change,
        enabled = on,
        valueRange = 0f..100f,
        steps = 99,
        modifier = Modifier.semantics { contentDescription = "$title 밝기 ${value.toInt()}%" },
    )
  }
}

@Composable
private fun Heading(s: String) {
  Text(
      s,
      style =
          YunseulType.ui.copy(fontSize = 24.sp, lineHeight = 32.sp, fontWeight = FontWeight.Bold),
  )
}

@Composable
private fun Meta(s: String) {
  Text(
      s,
      color = LocalYunseulColors.current.text2,
      style = YunseulType.ui.copy(fontSize = 13.sp, lineHeight = 20.sp),
  )
}

@Composable
private fun Gap() {
  Spacer(Modifier.height(16.dp))
}
